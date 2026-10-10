

from __future__ import annotations

import json

import numpy as np
import pandas as pd

from common import DOCS, INTERIM, PROCESSED, TABLES, ensure_directories, write_json


def main() -> None:
    ensure_directories()
    bds = pd.read_csv(PROCESSED / "bds_county_outcomes.csv", dtype={"fips": str})
    fdic = pd.read_csv(PROCESSED / "fdic_county_year.csv", dtype={"fips": str})
    bea = pd.read_csv(PROCESSED / "bea_county_year.csv", dtype={"fips": str})
    bls = pd.read_csv(PROCESSED / "bls_laus_county_year.csv", dtype={"fips": str})
    rucc = pd.read_csv(PROCESSED / "rucc_county.csv", dtype={"fips": str})
    for frame in [bds, fdic, bea, bls, rucc]:
        frame["fips"] = frame["fips"].astype(str).str.zfill(5)

    bank = fdic.merge(
        bea[["fips", "year", "county_name", "population", "pcpi"]],
        on=["fips", "year"],
        how="left",
        validate="one_to_one",
        indicator=True,
    )
    if not (bank["_merge"] == "both").all():
        raise AssertionError(f"FDIC-BEA merge losses: {bank['_merge'].value_counts().to_dict()}")
    bank = bank.drop(columns="_merge").sort_values(["fips", "year"])
    bank["branch_density"] = 10000 * bank["full_service_branches"] / bank["population"]
    bank["branch_count_change"] = bank.groupby("fips")["full_service_branches"].diff()
    bank["branch_density_change"] = bank.groupby("fips")["branch_density"].diff()
    bank["log_population"] = np.log(bank["population"])
    bank["log_pcpi"] = np.log(bank["pcpi"])
    bank = bank.merge(bls, on=["fips", "year"], how="left", validate="one_to_one")
    bank.to_csv(INTERIM / "bank_controls_exposure_year.csv", index=False)

    bds["exposure_year"] = bds["year"] - 1
    exposure_columns = [
        "fips",
        "year",
        "county_name",
        "full_service_branches",
        "bank_count",
        "full_service_deposits_thousands",
        "deposit_hhi",
        "population",
        "pcpi",
        "log_population",
        "log_pcpi",
        "branch_density",
        "branch_count_change",
        "branch_density_change",
        "unemployment_rate",
    ]
    panel = bds.merge(
        bank[exposure_columns].rename(columns={"year": "exposure_year"}),
        on=["fips", "exposure_year"],
        how="left",
        validate="one_to_one",
        indicator=True,
    )
    bank_merge_counts = panel["_merge"].value_counts().to_dict()
    panel = panel.drop(columns="_merge")
    panel = panel.merge(rucc, on="fips", how="left", validate="many_to_one", indicator=True)
    rucc_merge_counts = panel["_merge"].value_counts().to_dict()
    panel = panel.drop(columns="_merge")

    panel = panel.rename(
        columns={
            "full_service_branches": "branch_count_lag",
            "bank_count": "bank_count_lag",
            "full_service_deposits_thousands": "branch_deposits_thousands_lag",
            "deposit_hhi": "deposit_hhi_lag",
            "population": "population_lag",
            "pcpi": "pcpi_lag",
            "log_population": "log_population_lag",
            "log_pcpi": "log_pcpi_lag",
            "branch_density": "branch_density_lag",
            "branch_count_change": "branch_count_change_lag",
            "branch_density_change": "branch_density_change_lag",
            "unemployment_rate": "unemployment_rate_lag",
        }
    )

    expected_core = [
        "branch_count_lag",
        "branch_density_lag",
        "population_lag",
        "log_population_lag",
        "log_pcpi_lag",
        "unemployment_rate_lag",
        "rucc2013",
        "nonmetro2013",
    ]
    if len(panel) != 1000 or panel.duplicated(["fips", "year"]).any():
        raise AssertionError("Final panel does not contain exactly one row per 1,000 county-years")
    missing_core = panel[expected_core].isna().sum()
    if (missing_core > 0).any():
        raise AssertionError(f"Core merge losses: {missing_core[missing_core > 0].to_dict()}")
    if not (panel["exposure_year"] == panel["year"] - 1).all():
        raise AssertionError("Exposure year does not equal outcome year minus one")

    panel = panel.sort_values(["fips", "year"]).reset_index(drop=True)
    panel.to_csv(PROCESSED / "nc_bank_startup_panel.csv", index=False)
    panel.loc[panel["startup_rate"].notna()].to_csv(PROCESSED / "nc_bank_startup_panel_primary.csv", index=False)

    key_variables = [
        "startup_rate",
        "official_entry_rate",
        "startup_job_creation_intensity",
        "branch_density_lag",
        "branch_count_lag",
        "branch_density_change_lag",
        "deposit_hhi_lag",
        "unemployment_rate_lag",
        "log_population_lag",
        "log_pcpi_lag",
        "nonmetro2013",
    ]
    missingness = pd.DataFrame(
        {
            "variable": key_variables,
            "missing_n": [int(panel[column].isna().sum()) for column in key_variables],
            "observed_n": [int(panel[column].notna().sum()) for column in key_variables],
            "missing_percent": [100 * panel[column].isna().mean() for column in key_variables],
        }
    )
    missingness.to_csv(TABLES / "table_missingness.csv", index=False)

    bds_audit = json.loads((INTERIM / "bds_audit.json").read_text(encoding="utf-8"))
    sample_flow = pd.DataFrame(
        [
            {"step": "Raw BDS county rows, all states/years", "n": bds_audit["raw_overall_rows"]},
            {"step": "NC rows, 2013-2023, including residual county 999", "n": bds_audit["nc_overall_rows_with_residual_2013_2023"]},
            {"step": "NC true-county denominator rows after removing 999", "n": bds_audit["nc_overall_rows_excluding_residual_2013_2023"]},
            {"step": "Candidate outcome county-years, 2014-2023", "n": 1000},
            {"step": "Firm-age-zero rows in candidate outcome window", "n": bds_audit["nc_age_zero_rows_2014_2023"]},
            {"step": "Primary rows lost to BDS age-zero suppression", "n": -bds_audit["primary_outcome_flagged_rows"]},
            {"step": "Core banking/control/RUCC merge losses", "n": -int(panel[expected_core].isna().any(axis=1).sum())},
            {"step": "Final primary estimation sample", "n": int(panel["startup_rate"].notna().sum())},
        ]
    )
    sample_flow.to_csv(TABLES / "table_sample_flow.csv", index=False)

    audit = {
        "candidate_rows": int(len(panel)),
        "unique_counties": int(panel["fips"].nunique()),
        "outcome_years": [int(panel["year"].min()), int(panel["year"].max())],
        "primary_numeric_rows": int(panel["startup_rate"].notna().sum()),
        "primary_missing_rows": int(panel["startup_rate"].isna().sum()),
        "bank_control_merge": {str(k): int(v) for k, v in bank_merge_counts.items()},
        "rucc_merge": {str(k): int(v) for k, v in rucc_merge_counts.items()},
        "core_missing": {key: int(value) for key, value in missing_core.items()},
        "duplicate_county_years": int(panel.duplicated(["fips", "year"]).sum()),
    }
    write_json(INTERIM / "merge_audit.json", audit)
    print(json.dumps(audit, indent=2))


if __name__ == "__main__":
    main()
