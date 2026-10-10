

from __future__ import annotations

import json
from pathlib import Path

import numpy as np
import pandas as pd

from common import INTERIM, PROCESSED, RAW, ensure_directories, write_json


FLAG_CODES = {"D", "S", "X", "N"}
OVERALL_FIELDS = [
    "firms",
    "estabs",
    "emp",
    "estabs_entry",
    "estabs_entry_rate",
    "estabs_exit",
    "estabs_exit_rate",
    "job_creation_births",
]
AGE_FIELDS = ["firms", "estabs", "emp", "estabs_entry_rate", "job_creation", "job_creation_births"]


def numeric_and_flag(series: pd.Series) -> tuple[pd.Series, pd.Series]:
    raw = series.astype("string").str.strip()
    numeric = pd.to_numeric(raw, errors="coerce")
    flag = raw.where(numeric.isna() & raw.notna() & (raw != ""), pd.NA)
    return numeric, flag


def flag_log(df: pd.DataFrame, variables: list[str], dataset: str) -> list[dict[str, object]]:
    rows: list[dict[str, object]] = []
    for variable in variables:
        numeric, flags = numeric_and_flag(df[variable])
        df[variable] = numeric
        df[f"{variable}_flag"] = flags
        for index in df.index[flags.notna()]:
            rows.append(
                {
                    "dataset": dataset,
                    "year": int(df.at[index, "year"]),
                    "fips": str(df.at[index, "fips"]),
                    "variable": variable,
                    "flag": str(flags.at[index]),
                }
            )
    return rows


def clean_county() -> tuple[pd.DataFrame, list[dict[str, object]], dict[str, object]]:
    overall_raw = pd.read_csv(RAW / "bds2023_st_cty.csv", dtype=str)
    age_raw = pd.read_csv(RAW / "bds2023_st_cty_fac.csv", dtype=str)

    for frame in [overall_raw, age_raw]:
        frame["year"] = pd.to_numeric(frame["year"], errors="raise").astype(int)
        frame["st"] = frame["st"].str.zfill(2)
        frame["cty"] = frame["cty"].str.zfill(3)
        frame["fips"] = frame["st"] + frame["cty"]

    nc_overall_with_residual = overall_raw.loc[
        (overall_raw["st"] == "37") & overall_raw["year"].between(2013, 2023)
    ].copy()
    overall = nc_overall_with_residual.loc[nc_overall_with_residual["cty"] != "999"].copy()
    counts = overall.groupby("year")["fips"].nunique()
    if not (counts == 100).all() or len(counts) != 11:
        raise AssertionError(f"BDS overall did not contain 100 NC counties in every year: {counts.to_dict()}")

    flags = flag_log(overall, OVERALL_FIELDS, "county_overall")
    overall = overall.sort_values(["fips", "year"]).reset_index(drop=True)
    for variable in ["firms", "estabs", "emp"]:
        overall[f"lag_{variable}"] = overall.groupby("fips", sort=False)[variable].shift(1)
    overall["lag_year"] = overall.groupby("fips", sort=False)["year"].shift(1)
    expected_lag = overall["year"] - 1
    lag_problem = overall["lag_year"].notna() & (overall["lag_year"] != expected_lag)
    if lag_problem.any():
        raise AssertionError("BDS denominator lag crossed a nonconsecutive year")

    age0 = age_raw.loc[
        (age_raw["st"] == "37")
        & (age_raw["cty"] != "999")
        & age_raw["year"].between(2014, 2023)
        & (age_raw["fagecoarse"] == "a) 0")
    ].copy()
    age_counts = age0.groupby("year")["fips"].nunique()
    if not (age_counts == 100).all() or len(age_counts) != 10:
        raise AssertionError(f"BDS age-zero file did not contain 100 NC counties per year: {age_counts.to_dict()}")
    flags.extend(flag_log(age0, AGE_FIELDS, "county_firm_age_zero"))

    age0 = age0.rename(
        columns={
            "firms": "age0_firms",
            "estabs": "age0_estabs",
            "emp": "age0_emp",
            "job_creation": "age0_job_creation",
            "job_creation_births": "age0_job_creation_births",
            "firms_flag": "age0_firms_flag",
            "estabs_flag": "age0_estabs_flag",
            "emp_flag": "age0_emp_flag",
            "job_creation_flag": "age0_job_creation_flag",
            "job_creation_births_flag": "age0_job_creation_births_flag",
            "estabs_entry_rate_flag": "age0_estabs_entry_rate_flag",
        }
    )

    overall_keep = [
        "year",
        "fips",
        "firms",
        "estabs",
        "emp",
        "lag_firms",
        "lag_estabs",
        "lag_emp",
        "estabs_entry",
        "estabs_entry_rate",
        "estabs_entry_rate_flag",
        "estabs_exit",
        "estabs_exit_rate",
        "estabs_exit_rate_flag",
        "job_creation_births",
    ]
    age_keep = [
        "year",
        "fips",
        "age0_firms",
        "age0_estabs",
        "age0_emp",
        "age0_job_creation",
        "age0_job_creation_births",
        "age0_firms_flag",
        "age0_estabs_flag",
        "age0_emp_flag",
        "age0_job_creation_flag",
        "age0_job_creation_births_flag",
        "estabs_entry_rate",
        "age0_estabs_entry_rate_flag",
    ]
    age_keep = [column for column in age_keep if column in age0.columns]
    outcomes = overall.loc[overall["year"].between(2014, 2023), overall_keep].merge(
        age0[age_keep], on=["fips", "year"], how="left", validate="one_to_one", suffixes=("", "_age0_raw")
    )
    if len(outcomes) != 1000:
        raise AssertionError(f"Expected 1,000 county-outcome rows, found {len(outcomes)}")

    for denominator in ["lag_firms", "lag_estabs", "lag_emp"]:
        if outcomes[denominator].isna().any() or (outcomes[denominator] <= 0).any():
            raise AssertionError(f"Invalid BDS denominator: {denominator}")

    outcomes["startup_rate"] = 1000 * outcomes["age0_estabs"] / outcomes["lag_estabs"]
    outcomes["startup_firm_rate"] = 1000 * outcomes["age0_firms"] / outcomes["lag_firms"]
    outcomes["startup_job_creation_intensity"] = (
        1000 * outcomes["age0_job_creation_births"] / outcomes["lag_emp"]
    )
    outcomes["official_entry_rate"] = outcomes["estabs_entry_rate"]
    outcomes["official_exit_rate"] = outcomes["estabs_exit_rate"]


    age0_rate_column = "estabs_entry_rate_age0_raw"
    if age0_rate_column in outcomes.columns:
        reported = outcomes[age0_rate_column].dropna()
        if not np.allclose(reported, 200.0):
            raise AssertionError("Age-zero BDS entry rate is not mechanically 200 as expected")

    primary_suppressed = outcomes.loc[outcomes["age0_estabs"].isna(), ["fips", "year", "age0_estabs_flag"]]
    audit = {
        "raw_overall_rows": int(len(overall_raw)),
        "raw_age_rows": int(len(age_raw)),
        "nc_overall_rows_with_residual_2013_2023": int(len(nc_overall_with_residual)),
        "nc_overall_rows_excluding_residual_2013_2023": int(len(overall)),
        "nc_residual_rows_removed": int((nc_overall_with_residual["cty"] == "999").sum()),
        "nc_age_zero_rows_2014_2023": int(len(age0)),
        "candidate_county_years": int(len(outcomes)),
        "primary_outcome_numeric_rows": int(outcomes["startup_rate"].notna().sum()),
        "primary_outcome_flagged_rows": int(outcomes["startup_rate"].isna().sum()),
        "primary_flagged_cells": primary_suppressed.fillna("").to_dict(orient="records"),
        "all_flag_records_in_kept_fields": int(len(flags)),
    }
    return outcomes, flags, audit


def clean_state() -> pd.DataFrame:
    overall = pd.read_csv(RAW / "bds2023_st.csv", dtype=str)
    age = pd.read_csv(RAW / "bds2023_st_fac.csv", dtype=str)
    for frame in [overall, age]:
        frame["year"] = pd.to_numeric(frame["year"], errors="raise").astype(int)
        frame["st"] = frame["st"].str.zfill(2)

    overall = overall.loc[(overall["st"] == "37") & overall["year"].between(2013, 2023)].copy()
    age = age.loc[
        (age["st"] == "37") & age["year"].between(2014, 2023) & (age["fagecoarse"] == "a) 0")
    ].copy()
    for column in ["estabs", "emp", "estabs_entry_rate", "estabs_exit_rate"]:
        overall[column] = pd.to_numeric(overall[column], errors="coerce")
    for column in ["estabs", "firms", "job_creation_births"]:
        age[column] = pd.to_numeric(age[column], errors="coerce")
    overall = overall.sort_values("year")
    overall["lag_estabs"] = overall["estabs"].shift(1)
    state = overall.loc[overall["year"].between(2014, 2023), ["year", "estabs", "lag_estabs", "emp", "estabs_entry_rate", "estabs_exit_rate"]].merge(
        age[["year", "estabs", "firms", "job_creation_births"]].rename(
            columns={"estabs": "age0_estabs", "firms": "age0_firms", "job_creation_births": "age0_job_creation_births"}
        ),
        on="year",
        how="left",
        validate="one_to_one",
    )
    state["startup_rate"] = 1000 * state["age0_estabs"] / state["lag_estabs"]
    return state


def main() -> None:
    ensure_directories()
    outcomes, flags, audit = clean_county()
    state = clean_state()
    outcomes.to_csv(PROCESSED / "bds_county_outcomes.csv", index=False)
    state.to_csv(PROCESSED / "bds_state_trends.csv", index=False)
    pd.DataFrame(flags).sort_values(["dataset", "year", "fips", "variable"]).to_csv(
        INTERIM / "bds_flagged_cells.csv", index=False
    )
    write_json(INTERIM / "bds_audit.json", audit)
    print(json.dumps(audit, indent=2))


if __name__ == "__main__":
    main()

