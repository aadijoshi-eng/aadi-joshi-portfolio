#!/usr/bin/env python3


from __future__ import annotations

import csv
import json
import math
import re
import shutil
from collections import defaultdict
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
INTERIM = ROOT / "data" / "interim"
PROCESSED = ROOT / "data" / "processed"
PUBLIC_DATA = ROOT / "public" / "data"
PUBLIC_DOWNLOADS = ROOT / "public" / "downloads"
SUMMARY_PATH = ROOT / "site" / "lib" / "research-summary.ts"
VERSION = "1.0.1-provisional"


def as_float(value: str | None) -> float | None:
    if value is None or value.strip() == "":
        return None
    number = float(value)
    return number if math.isfinite(number) else None


def as_int(value: str | None) -> int | None:
    number = as_float(value)
    return None if number is None else int(number)


def clean_number(value: float | None, digits: int = 6) -> float | None:
    return None if value is None else round(value, digits)


def quantile(values: list[float], probability: float) -> float:
    ordered = sorted(values)
    if not ordered:
        raise ValueError("Cannot calculate a quantile from an empty list")
    position = (len(ordered) - 1) * probability
    lower = math.floor(position)
    upper = math.ceil(position)
    if lower == upper:
        return ordered[lower]
    weight = position - lower
    return ordered[lower] * (1 - weight) + ordered[upper] * weight


def read_csv(path: Path) -> list[dict[str, str]]:
    with path.open(newline="", encoding="utf-8-sig") as handle:
        return list(csv.DictReader(handle))


def write_csv(path: Path, rows: list[dict], fieldnames: list[str]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("w", newline="", encoding="utf-8") as handle:
        writer = csv.DictWriter(handle, fieldnames=fieldnames, extrasaction="ignore")
        writer.writeheader()
        writer.writerows(rows)


def model_summary(row: dict[str, str]) -> dict[str, float | int | str]:
    return {
        "specId": row["spec_id"],
        "label": row["spec_label"],
        "effectLabel": row["effect_label"],
        "estimate": clean_number(float(row["estimate"])),
        "stdError": clean_number(float(row["std_error"])),
        "ciLow": clean_number(float(row["ci_low"])),
        "ciHigh": clean_number(float(row["ci_high"])),
        "pValue": clean_number(float(row["p_value"])),
        "n": int(row["n_obs"]),
        "clusters": int(row["clusters"]),
    }


def aggregate_county_group(rows: list[dict]) -> dict[str, float | int | None]:
    branch_count = sum(row["branchCount"] for row in rows)
    population = sum(row["population"] for row in rows)
    startup_rows = [row for row in rows if row["startupRate"] is not None]
    jobs_rows = [row for row in rows if row["startupJobs"] is not None]
    startup_rate = (
        1000 * sum(row["age0Estabs"] for row in startup_rows) / sum(row["lagEstabs"] for row in startup_rows)
        if startup_rows
        else None
    )
    startup_jobs = (
        1000 * sum(row["age0Jobs"] for row in jobs_rows) / sum(row["lagEmployment"] for row in jobs_rows)
        if jobs_rows
        else None
    )
    return {
        "branchCount": branch_count,
        "branchDensity": 10000 * branch_count / population,
        "startupRate": startup_rate,
        "startupJobs": startup_jobs,
        "population": population,
        "counties": len(rows),
        "startupCellsAvailable": len(startup_rows),
    }


def main() -> None:
    for directory in (PROCESSED, PUBLIC_DATA, PUBLIC_DOWNLOADS):
        directory.mkdir(parents=True, exist_ok=True)

    raw_panel = read_csv(INTERIM / "research_panel.csv")
    raw_state = read_csv(INTERIM / "bds_state_trends.csv")
    raw_models = read_csv(INTERIM / "model_results_main.csv")
    raw_robustness = read_csv(INTERIM / "model_results_robustness.csv")
    raw_additional_models = read_csv(INTERIM / "model_results_additional_models.csv")

    rows: list[dict] = []
    seen_keys: set[tuple[str, int]] = set()
    county_names: dict[str, str] = {}
    baseline_density: dict[str, float] = {}

    for source in raw_panel:
        fips = source["fips"].strip().zfill(5)
        year = int(source["year"])
        key = (fips, year)
        if key in seen_keys:
            raise AssertionError(f"Duplicate county-year key: {key}")
        seen_keys.add(key)
        if not re.fullmatch(r"37\d{3}", fips):
            raise AssertionError(f"Invalid North Carolina FIPS: {fips}")

        county_name = source["county_name"].strip()
        county_names[fips] = county_name
        branch_density = as_float(source["branch_density_lag"])
        if branch_density is None:
            raise AssertionError(f"Missing branch density for {fips} in {year}")
        if year == 2014:
            baseline_density[fips] = branch_density

        startup_rate = as_float(source["startup_rate"])
        startup_flag = source.get("age0_estabs_flag", "").strip() or None
        if startup_rate is None and startup_flag is None:
            raise AssertionError(f"Unexplained missing startup rate for {fips} in {year}")

        rows.append(
            {
                "fips": fips,
                "name": county_name,
                "outcomeYear": year,
                "exposureYear": int(source["exposure_year"]),
                "branchCount": int(float(source["branch_count_lag"])),
                "branchDensity": branch_density,
                "branchChangeOneYear": as_float(source["branch_density_change_lag"]),
                "branchChangeSince2013": None,
                "startupRate": startup_rate,
                "startupJobs": as_float(source["startup_job_creation_intensity"]),
                "officialEntryRate": as_float(source["official_entry_rate"]),
                "depositHhi": as_float(source["deposit_hhi_lag"]),
                "age0Estabs": as_float(source["age0_estabs"]),
                "age0Jobs": as_float(source["age0_job_creation_births"]),
                "lagEstabs": as_float(source["lag_estabs"]),
                "lagEmployment": as_float(source["lag_emp"]),
                "population": int(float(source["population_lag"])),
                "nonmetro": int(float(source["nonmetro2013"])) == 1,
                "classification": "Nonmetro" if int(float(source["nonmetro2013"])) == 1 else "Metro",
                "rucc2013": int(float(source["rucc2013"])),
                "startupFlag": startup_flag,
            }
        )

    for row in rows:
        row["branchChangeSince2013"] = row["branchDensity"] - baseline_density[row["fips"]]

    rows.sort(key=lambda row: (row["outcomeYear"], row["fips"]))

    years = sorted({row["outcomeYear"] for row in rows})
    counties = sorted(county_names)
    if years != list(range(2014, 2024)):
        raise AssertionError(f"Unexpected outcome years: {years}")
    if len(rows) != 1000 or len(counties) != 100:
        raise AssertionError(f"Expected 1,000 rows and 100 counties; got {len(rows)} and {len(counties)}")
    if len(baseline_density) != 100:
        raise AssertionError("Every county must have a 2013 density baseline")

    suppressed = [row for row in rows if row["startupRate"] is None]
    if len(suppressed) != 5 or {row["startupFlag"] for row in suppressed} != {"D"}:
        raise AssertionError("Expected exactly five disclosure-suppressed startup cells")

    state_by_year = {int(row["year"]): row for row in raw_state}
    benchmarks: dict[str, dict] = {}
    state_series: list[dict] = []
    baseline_benchmark_density: dict[str, float] = {}

    for year in years:
        year_rows = [row for row in rows if row["outcomeYear"] == year]
        metro_rows = [row for row in year_rows if not row["nonmetro"]]
        nonmetro_rows = [row for row in year_rows if row["nonmetro"]]
        state_group = aggregate_county_group(year_rows)
        metro_group = aggregate_county_group(metro_rows)
        nonmetro_group = aggregate_county_group(nonmetro_rows)

        state_source = state_by_year[year]
        state_group["startupRate"] = as_float(state_source["startup_rate"])
        state_lag_emp = as_float(state_source.get("lag_emp"))
        state_jobs = as_float(state_source.get("age0_job_creation_births"))
        if state_lag_emp and state_jobs is not None:
            state_group["startupJobs"] = 1000 * state_jobs / state_lag_emp

        if year == 2014:
            baseline_benchmark_density = {
                "state": state_group["branchDensity"],
                "metro": metro_group["branchDensity"],
                "nonmetro": nonmetro_group["branchDensity"],
            }

        for label, group in (("state", state_group), ("metro", metro_group), ("nonmetro", nonmetro_group)):
            group["branchChangeSince2013"] = group["branchDensity"] - baseline_benchmark_density[label]
            for key, value in list(group.items()):
                if isinstance(value, float):
                    group[key] = clean_number(value)

        benchmarks[str(year)] = {
            "outcomeYear": year,
            "exposureYear": year - 1,
            "state": state_group,
            "metro": metro_group,
            "nonmetro": nonmetro_group,
        }
        state_series.append(
            {
                "outcomeYear": year,
                "exposureYear": year - 1,
                **state_group,
            }
        )

    metric_values = {
        "branchDensity": [row["branchDensity"] for row in rows],
        "startupRate": [row["startupRate"] for row in rows if row["startupRate"] is not None],
        "startupJobs": [row["startupJobs"] for row in rows if row["startupJobs"] is not None],
    }
    metric_definitions = {
        "branchDensity": {
            "label": "Full-service branch density",
            "shortLabel": "Branch density",
            "unit": "branches per 10,000 residents",
            "timing": "June 30 labeled t−1; this date falls inside the BDS March-to-March outcome interval",
            "source": "FDIC Summary of Deposits + BEA",
            "digits": 2,
            "thresholds": [clean_number(quantile(metric_values["branchDensity"], q), 3) for q in (0.2, 0.4, 0.6, 0.8)],
            "palette": ["#eef4ed", "#c7e2d5", "#82c2bd", "#3b8ea5", "#174a68"],
        },
        "branchChange": {
            "label": "Change in branch density since 2013",
            "shortLabel": "Density change",
            "unit": "branches per 10,000 residents",
            "timing": "Selected exposure year minus 2013",
            "source": "FDIC Summary of Deposits + BEA",
            "digits": 2,
            "thresholds": [-1.0, -0.5, -0.1, 0.1, 0.5],
            "palette": ["#8c3b2a", "#d87952", "#e9c7aa", "#e9ece7", "#7ab4ad", "#246b72"],
        },
        "startupRate": {
            "label": "Employer-startup rate",
            "shortLabel": "Startup rate",
            "unit": "age-zero establishments per 1,000 lagged active establishments",
            "timing": "BDS label year t; flows span March t−1 to March t",
            "source": "U.S. Census Bureau BDS",
            "digits": 1,
            "thresholds": [clean_number(quantile(metric_values["startupRate"], q), 2) for q in (0.2, 0.4, 0.6, 0.8)],
            "palette": ["#f2efe8", "#d9d7c0", "#b1c7a3", "#6ca18d", "#2b686c"],
        },
        "startupJobs": {
            "label": "Startup-job creation intensity",
            "shortLabel": "Startup jobs",
            "unit": "startup jobs per 1,000 lagged workers",
            "timing": "BDS label year t; flows span March t−1 to March t",
            "source": "U.S. Census Bureau BDS",
            "digits": 1,
            "thresholds": [clean_number(quantile(metric_values["startupJobs"], q), 2) for q in (0.2, 0.4, 0.6, 0.8)],
            "palette": ["#f5eee3", "#e8d5ba", "#c9b17e", "#9a7b3f", "#60471d"],
        },
        "classification": {
            "label": "2013 metro/nonmetro classification",
            "shortLabel": "Metro status",
            "unit": "USDA RUCC classification",
            "timing": "Fixed 2013 classification",
            "source": "USDA Economic Research Service",
            "palette": ["#2a788e", "#d69b3a"],
            "categories": ["Metro", "Nonmetro"],
        },
    }

    main_by_id = {row["spec_id"]: row for row in raw_models}
    robustness_by_id = {row["spec_id"]: row for row in raw_robustness}
    additional_by_id = {row["spec_id"]: row for row in raw_additional_models}
    headline = main_by_id["M2"]
    clean_preperiod = additional_by_id["A4"]
    poisson = robustness_by_id["R10"]
    branch_2013 = benchmarks["2014"]["state"]["branchCount"]
    branch_2022 = benchmarks["2023"]["state"]["branchCount"]
    density_2013 = benchmarks["2014"]["state"]["branchDensity"]
    density_2022 = benchmarks["2023"]["state"]["branchDensity"]
    headline_facts = {
        "branchCount2013": branch_2013,
        "branchCount2022": branch_2022,
        "branchCountPercentChange": clean_number(100 * (branch_2022 - branch_2013) / branch_2013, 1),
        "branchDensity2013": density_2013,
        "branchDensity2022": density_2022,
        "branchDensityPercentChange": clean_number(100 * (density_2022 - density_2013) / density_2013, 1),
        "candidateCountyYears": len(rows),
        "usableStartupObservations": len(rows) - len(suppressed),
        "suppressedStartupCells": len(suppressed),
        "headlineEstimate": clean_number(float(headline["estimate"]), 6),
        "headlineStdError": clean_number(float(headline["std_error"]), 6),
        "headlineCiLow": clean_number(float(headline["ci_low"]), 6),
        "headlineCiHigh": clean_number(float(headline["ci_high"]), 6),
        "headlinePValue": clean_number(float(headline["p_value"]), 6),
        "headlineN": int(headline["n_obs"]),
        "headlineClusters": int(headline["clusters"]),
        "cleanPreperiodEstimate": clean_number(float(clean_preperiod["estimate"]), 6),
        "cleanPreperiodStdError": clean_number(float(clean_preperiod["std_error"]), 6),
        "cleanPreperiodCiLow": clean_number(float(clean_preperiod["ci_low"]), 6),
        "cleanPreperiodCiHigh": clean_number(float(clean_preperiod["ci_high"]), 6),
        "cleanPreperiodPValue": clean_number(float(clean_preperiod["p_value"]), 6),
        "cleanPreperiodN": int(clean_preperiod["n_obs"]),
        "cleanPreperiodClusters": int(clean_preperiod["clusters"]),
    }

    selected_models = [
        model_summary(main_by_id["M1"]),
        model_summary(main_by_id["M2"]),
        model_summary(main_by_id["M3_metro"]),
        model_summary(main_by_id["M3_nonmetro"]),
        model_summary(main_by_id["M4"]),
        model_summary(main_by_id["M5"]),
        model_summary(additional_by_id["A4"]),
    ]
    model_results = {
        "frozenHeadline": model_summary(headline),
        "cleanPreperiod": model_summary(clean_preperiod),
        "poisson": model_summary(poisson),
        "selectedModels": selected_models,
        "timingConclusion": "The frozen and clean-preperiod estimates are both imprecise and have opposite signs; the data do not establish a precise, temporally stable sign.",
    }

    public_records: list[dict] = []
    csv_rows: list[dict] = []
    for row in rows:
        public_row = {
            key: clean_number(value) if isinstance(value, float) else value
            for key, value in row.items()
        }
        public_records.append(public_row)
        csv_rows.append(
            {
                "fips": row["fips"],
                "county_name": row["name"],
                "outcome_year": row["outcomeYear"],
                "exposure_year": row["exposureYear"],
                "branch_count": row["branchCount"],
                "branch_density_per_10000": clean_number(row["branchDensity"]),
                "branch_density_change_one_year": clean_number(row["branchChangeOneYear"]),
                "branch_density_change_since_2013": clean_number(row["branchChangeSince2013"]),
                "startup_rate_per_1000_lagged_estabs": clean_number(row["startupRate"]),
                "startup_jobs_per_1000_lagged_workers": clean_number(row["startupJobs"]),
                "official_bds_entry_rate": clean_number(row["officialEntryRate"]),
                "deposit_hhi": clean_number(row["depositHhi"]),
                "population": row["population"],
                "rucc2013": row["rucc2013"],
                "metro_class_2013": row["classification"],
                "startup_disclosure_flag": row["startupFlag"] or "",
            }
        )

    csv_fields = list(csv_rows[0].keys())
    write_csv(PROCESSED / "atlas_county_year.csv", csv_rows, csv_fields)
    shutil.copy2(PROCESSED / "atlas_county_year.csv", PUBLIC_DOWNLOADS / "atlas_county_year.csv")

    benchmark_rows: list[dict] = []
    for year in years:
        for group in ("state", "metro", "nonmetro"):
            values = benchmarks[str(year)][group]
            benchmark_rows.append({"outcome_year": year, "exposure_year": year - 1, "group": group, **values})
    benchmark_fields = [
        "outcome_year", "exposure_year", "group", "branchCount", "branchDensity",
        "branchChangeSince2013", "startupRate", "startupJobs", "population",
        "counties", "startupCellsAvailable",
    ]
    write_csv(PROCESSED / "state_group_benchmarks.csv", benchmark_rows, benchmark_fields)
    shutil.copy2(PROCESSED / "state_group_benchmarks.csv", PUBLIC_DOWNLOADS / "state_group_benchmarks.csv")

    atlas_payload = {
        "metadata": {
            "title": "North Carolina Banking & Startup Opportunity Atlas",
            "version": VERSION,
            "outcomeYears": years,
            "exposureYears": [year - 1 for year in years],
            "countyCount": len(counties),
            "candidateCountyYears": len(rows),
            "missingStartupCells": len(suppressed),
            "yearConvention": "The interface selects BDS label year t. BDS flows span March t−1 to March t; the frozen June t−1 banking snapshot falls inside that interval and is label-aligned rather than a clean lag.",
            "timingNote": "Model A4 uses the June t−2 banking snapshot and t−2 controls, which precede the March t−1 start of the BDS interval. It also drops the first outcome year, changing both timing and sample.",
            "missingPolicy": "Disclosure-suppressed BDS startup cells remain null and are never converted to zero.",
        },
        "headline": headline_facts,
        "models": model_results,
        "metrics": metric_definitions,
        "benchmarks": benchmarks,
        "stateSeries": state_series,
        "records": public_records,
    }
    with (PUBLIC_DATA / "atlas.json").open("w", encoding="utf-8") as handle:
        json.dump(atlas_payload, handle, separators=(",", ":"), ensure_ascii=False)

    research_summary = {
        "version": VERSION,
        "date": "October 4, 2026",
        "descriptive": {
            "branchCount2013": branch_2013,
            "branchCount2022": branch_2022,
            "branchCountPercentChange": headline_facts["branchCountPercentChange"],
            "branchDensity2013": density_2013,
            "branchDensity2022": density_2022,
            "branchDensityPercentChange": headline_facts["branchDensityPercentChange"],
            "candidateCountyYears": len(rows),
            "usableStartupObservations": len(rows) - len(suppressed),
            "suppressedStartupCells": len(suppressed),
        },
        "models": model_results,
    }
    SUMMARY_PATH.write_text(
        f"export const researchSummary = {json.dumps(research_summary, ensure_ascii=False, indent=2)} as const;\n",
        encoding="utf-8",
    )

    validation = {
        "status": "PASS",
        "checks": {
            "rows": len(rows),
            "counties": len(counties),
            "years": years,
            "uniqueCountyYears": len(seen_keys),
            "invalidFips": [],
            "duplicateCountyYears": len(rows) - len(seen_keys),
            "unexplainedMissingStartupRates": 0,
            "suppressedStartupCells": len(suppressed),
            "branchCount2013": branch_2013,
            "branchCount2022": branch_2022,
            "headlineEstimate": headline_facts["headlineEstimate"],
            "headlineStdError": headline_facts["headlineStdError"],
            "headlineN": headline_facts["headlineN"],
            "headlineClusters": headline_facts["headlineClusters"],
            "cleanPreperiodEstimate": headline_facts["cleanPreperiodEstimate"],
            "cleanPreperiodStdError": headline_facts["cleanPreperiodStdError"],
            "cleanPreperiodN": headline_facts["cleanPreperiodN"],
            "cleanPreperiodClusters": headline_facts["cleanPreperiodClusters"],
        },
    }
    print(json.dumps(validation, indent=2))


if __name__ == "__main__":
    main()
