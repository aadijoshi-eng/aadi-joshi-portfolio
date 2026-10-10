

from __future__ import annotations

import json

import numpy as np
import pandas as pd

from common import INTERIM, PROCESSED, TABLES, ensure_directories, write_json
from model_utils import extract_term, fit_ols, fit_poisson, full_coefficients, linear_combination


CONTROLS = "unemployment_rate_lag + log_population_lag + log_pcpi_lag"
FE = "C(fips) + C(year)"


def main() -> None:
    ensure_directories()
    panel = pd.read_csv(PROCESSED / "nc_bank_startup_panel.csv", dtype={"fips": str}).sort_values(["fips", "year"])
    panel["deposit_hhi_per_1000_lag"] = panel["deposit_hhi_lag"] / 1000

    result_rows: list[dict[str, object]] = []
    coefficient_frames: list[pd.DataFrame] = []

    def register(spec_id: str, label: str, result: object, term: str, outcome: str, exposure: str, effect: str = "Slope") -> None:
        result_rows.append(
            extract_term(
                result,
                term,
                spec_id=spec_id,
                spec_label=label,
                outcome=outcome,
                exposure=exposure,
                effect_label=effect,
            )
        )
        coefficient_frames.append(full_coefficients(result, spec_id))

    covid = panel.loc[~panel["year"].isin([2020, 2021])].copy()
    r_covid = fit_ols(f"startup_rate ~ branch_density_lag + {CONTROLS} + {FE}", covid)
    register("R1", "Exclude 2020-2021", r_covid, "branch_density_lag", "startup_rate", "branch_density_lag")

    r_weighted = fit_ols(
        f"startup_rate ~ branch_density_lag + {CONTROLS} + {FE}", panel, weights="population_lag"
    )
    register("R2", "Population-weighted", r_weighted, "branch_density_lag", "startup_rate", "branch_density_lag")

    r_count = fit_ols(f"startup_rate ~ branch_count_lag + {CONTROLS} + {FE}", panel)
    register("R3", "Branch count exposure", r_count, "branch_count_lag", "startup_rate", "branch_count_lag")

    r_count_change = fit_ols(f"startup_rate ~ branch_count_change_lag + {CONTROLS} + {FE}", panel)
    register(
        "R4",
        "One-year branch-count change",
        r_count_change,
        "branch_count_change_lag",
        "startup_rate",
        "branch_count_change_lag",
    )

    r_density_change = fit_ols(f"startup_rate ~ branch_density_change_lag + {CONTROLS} + {FE}", panel)
    register(
        "R5",
        "One-year branch-density change",
        r_density_change,
        "branch_density_change_lag",
        "startup_rate",
        "branch_density_change_lag",
    )

    r_hhi = fit_ols(f"startup_rate ~ deposit_hhi_per_1000_lag + {CONTROLS} + {FE}", panel)
    register(
        "R6",
        "Deposit HHI (separate model)",
        r_hhi,
        "deposit_hhi_per_1000_lag",
        "startup_rate",
        "deposit_hhi_per_1000_lag",
    )

    r_exit = fit_ols(f"official_exit_rate ~ branch_density_lag + {CONTROLS} + {FE}", panel)
    register("R7", "Establishment-exit context", r_exit, "branch_density_lag", "official_exit_rate", "branch_density_lag")

    r_rucc23 = fit_ols(
        f"startup_rate ~ branch_density_lag + branch_density_lag:nonmetro2023 + {CONTROLS} + {FE}", panel
    )
    register("R8_metro", "2023 RUCC metro slope", r_rucc23, "branch_density_lag", "startup_rate", "branch_density_lag", "Metro slope")
    result_rows.append(
        linear_combination(
            r_rucc23,
            ["branch_density_lag", "branch_density_lag:nonmetro2023"],
            [1, 1],
            spec_id="R8_nonmetro",
            spec_label="2023 RUCC nonmetro slope",
            outcome="startup_rate",
            exposure="branch_density_lag",
            effect_label="Nonmetro slope",
        )
    )


    diff_columns = [
        "startup_rate",
        "branch_density_lag",
        "unemployment_rate_lag",
        "log_population_lag",
        "log_pcpi_lag",
    ]
    first = panel[["fips", "year"] + diff_columns].copy()
    first["prior_year"] = first.groupby("fips")["year"].shift(1)
    for column in diff_columns:
        first[f"d_{column}"] = first.groupby("fips")[column].diff()
    first = first.loc[first["prior_year"] == first["year"] - 1].copy()
    r_diff = fit_ols(
        "d_startup_rate ~ d_branch_density_lag + d_unemployment_rate_lag + d_log_population_lag + d_log_pcpi_lag + C(year)",
        first,
    )
    register("R9", "First differences", r_diff, "d_branch_density_lag", "d_startup_rate", "d_branch_density_lag")


    poisson_data = panel.dropna(
        subset=["age0_estabs", "lag_estabs", "branch_density_lag", "unemployment_rate_lag", "log_population_lag", "log_pcpi_lag"]
    ).copy()
    r_poisson = fit_poisson(
        f"age0_estabs ~ branch_density_lag + {CONTROLS} + {FE}",
        poisson_data,
        offset="lag_estabs",
    )
    register("R10", "Poisson count with exposure offset", r_poisson, "branch_density_lag", "age0_estabs", "branch_density_lag")


    top_fips = (
        panel.groupby(["fips", "county_name"], as_index=False)["population_lag"].mean().nlargest(5, "population_lag")
    )
    influence_rows: list[dict[str, object]] = []
    for row in top_fips.itertuples(index=False):
        reduced = panel.loc[panel["fips"] != row.fips]
        result = fit_ols(f"startup_rate ~ branch_density_lag + {CONTROLS} + {FE}", reduced)
        extracted = extract_term(
            result,
            "branch_density_lag",
            spec_id=f"I_{row.fips}",
            spec_label=f"Leave out {row.county_name}",
            outcome="startup_rate",
            exposure="branch_density_lag",
            effect_label="Full sample slope",
        )
        extracted["omitted_fips"] = row.fips
        extracted["omitted_county"] = row.county_name
        influence_rows.append(extracted)
    pd.DataFrame(influence_rows).to_csv(TABLES / "model_results_influence.csv", index=False)

    results = pd.DataFrame(result_rows)
    results.to_csv(TABLES / "model_results_robustness.csv", index=False)
    pd.concat(coefficient_frames, ignore_index=True).to_csv(INTERIM / "model_coefficients_robustness_full.csv", index=False)
    first.to_csv(INTERIM / "first_difference_panel.csv", index=False)


    corr_vars = [
        "branch_density_lag",
        "deposit_hhi_per_1000_lag",
        "unemployment_rate_lag",
        "log_population_lag",
        "log_pcpi_lag",
    ]
    within = panel[corr_vars] - panel.groupby("fips")[corr_vars].transform("mean")
    within.corr().to_csv(TABLES / "table_within_county_correlations.csv")

    poisson_row = results.loc[results["spec_id"] == "R10"].iloc[0]
    summary = {
        "robustness_specs": int(len(results)),
        "first_difference_n": int(results.loc[results["spec_id"] == "R9", "n_obs"].iloc[0]),
        "poisson_n": int(poisson_row["n_obs"]),
        "poisson_incidence_rate_ratio_per_density_unit": float(np.exp(poisson_row["estimate"])),
        "largest_counties_checked": top_fips[["fips", "county_name"]].to_dict(orient="records"),
        "community_bank_share_status": "Not estimated: no historical institution-year community-bank classification was included in the frozen public-data acquisition. This optional secondary extension is documented as incomplete rather than imputed.",
    }
    write_json(INTERIM / "robustness_summary.json", summary)
    print(results.to_string(index=False))
    print(pd.DataFrame(influence_rows).to_string(index=False))
    print(json.dumps(summary, indent=2))


if __name__ == "__main__":
    main()

