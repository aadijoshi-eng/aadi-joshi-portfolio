

from __future__ import annotations

import json

import numpy as np
import pandas as pd

from common import INTERIM, PROCESSED, TABLES, ensure_directories, write_json


VARIABLES = {
    "startup_rate": "Employer-startup establishments per 1,000 lagged active establishments",
    "age0_estabs": "Firm-age-zero establishments (count)",
    "official_entry_rate": "Official BDS establishment-entry rate",
    "startup_job_creation_intensity": "Startup job creation per 1,000 lagged employed workers",
    "branch_density_lag": "Full-service branches per 10,000 residents, t-1",
    "branch_count_lag": "Full-service branch count, t-1",
    "deposit_hhi_lag": "County branch-assigned deposit HHI, 0-10,000, t-1",
    "unemployment_rate_lag": "Annual unemployment rate, percent, t-1",
    "population_lag": "County population, t-1",
    "pcpi_lag": "Per-capita personal income, nominal dollars, t-1",
}


def main() -> None:
    ensure_directories()
    panel = pd.read_csv(PROCESSED / "nc_bank_startup_panel.csv", dtype={"fips": str})
    state_bds = pd.read_csv(PROCESSED / "bds_state_trends.csv")
    fdic = pd.read_csv(PROCESSED / "fdic_county_year.csv", dtype={"fips": str})
    bea = pd.read_csv(PROCESSED / "bea_county_year.csv", dtype={"fips": str})

    summary_rows: list[dict[str, object]] = []
    for variable, label in VARIABLES.items():
        series = panel[variable].dropna()
        summary_rows.append(
            {
                "variable": variable,
                "label": label,
                "n": int(series.size),
                "mean": float(series.mean()),
                "std_dev": float(series.std(ddof=1)),
                "min": float(series.min()),
                "p25": float(series.quantile(0.25)),
                "median": float(series.median()),
                "p75": float(series.quantile(0.75)),
                "max": float(series.max()),
            }
        )
    summary = pd.DataFrame(summary_rows)
    summary.to_csv(TABLES / "table_summary_statistics.csv", index=False)

    banking = fdic.loc[fdic["year"].between(2013, 2022)].merge(
        bea[["fips", "year", "population"]], on=["fips", "year"], how="left", validate="one_to_one"
    )
    statewide_bank = banking.groupby("year", as_index=False).agg(
        branch_count=("full_service_branches", "sum"), population=("population", "sum")
    )
    statewide_bank["branch_density"] = 10000 * statewide_bank["branch_count"] / statewide_bank["population"]
    statewide_bank["outcome_year"] = statewide_bank["year"] + 1
    trends = state_bds.rename(columns={"year": "outcome_year"}).merge(
        statewide_bank[["outcome_year", "year", "branch_count", "branch_density"]],
        on="outcome_year",
        how="left",
        validate="one_to_one",
    ).rename(columns={"year": "exposure_year"})
    for variable in ["branch_count", "branch_density", "startup_rate"]:
        trends[f"{variable}_index"] = 100 * trends[variable] / trends.loc[trends["outcome_year"] == 2014, variable].iloc[0]
    trends.to_csv(INTERIM / "statewide_trends.csv", index=False)

    density = banking.assign(branch_density=10000 * banking["full_service_branches"] / banking["population"])
    change = density.loc[density["year"].isin([2013, 2022]), ["fips", "year", "branch_density", "full_service_branches"]].pivot(
        index="fips", columns="year", values=["branch_density", "full_service_branches"]
    )
    change.columns = [f"{name}_{year}" for name, year in change.columns]
    change = change.reset_index()
    change["branch_density_change_2013_2022"] = change["branch_density_2022"] - change["branch_density_2013"]
    change["branch_count_change_2013_2022"] = change["full_service_branches_2022"] - change["full_service_branches_2013"]
    change.to_csv(INTERIM / "county_branch_change_map_data.csv", index=False)

    start = trends.iloc[0]
    end = trends.iloc[-1]
    primary = panel.dropna(subset=["startup_rate", "branch_density_lag"]).copy()
    descriptive = {
        "branch_count_2013": int(start["branch_count"]),
        "branch_count_2022": int(end["branch_count"]),
        "branch_count_percent_change": float(100 * (end["branch_count"] / start["branch_count"] - 1)),
        "statewide_branch_density_2013": float(start["branch_density"]),
        "statewide_branch_density_2022": float(end["branch_density"]),
        "statewide_branch_density_percent_change": float(100 * (end["branch_density"] / start["branch_density"] - 1)),
        "statewide_startup_rate_2014": float(start["startup_rate"]),
        "statewide_startup_rate_2023": float(end["startup_rate"]),
        "primary_sample_mean_startup_rate": float(primary["startup_rate"].mean()),
        "primary_sample_within_county_branch_density_sd": float(
            (
                primary["branch_density_lag"]
                - primary.groupby("fips")["branch_density_lag"].transform("mean")
            ).std(ddof=1)
        ),
    }
    write_json(INTERIM / "descriptive_summary.json", descriptive)
    print(json.dumps(descriptive, indent=2))


if __name__ == "__main__":
    main()
