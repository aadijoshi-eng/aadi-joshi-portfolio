

from __future__ import annotations

import json

import numpy as np
import pandas as pd

from common import INTERIM, PROCESSED, TABLES, ensure_directories, write_json
from model_utils import extract_term, fit_ols, full_coefficients, linear_combination


CONTROLS = "unemployment_rate_lag + log_population_lag + log_pcpi_lag"
FE = "C(fips) + C(year)"


def main() -> None:
    ensure_directories()
    panel = pd.read_csv(PROCESSED / "nc_bank_startup_panel.csv", dtype={"fips": str})
    models: dict[str, object] = {}
    models["M1"] = fit_ols(f"startup_rate ~ branch_density_lag + {FE}", panel)
    models["M2"] = fit_ols(f"startup_rate ~ branch_density_lag + {CONTROLS} + {FE}", panel)
    models["M3"] = fit_ols(
        f"startup_rate ~ branch_density_lag + branch_density_lag:nonmetro2013 + {CONTROLS} + {FE}", panel
    )
    models["M4"] = fit_ols(f"official_entry_rate ~ branch_density_lag + {CONTROLS} + {FE}", panel)
    models["M5"] = fit_ols(
        f"startup_job_creation_intensity ~ branch_density_lag + {CONTROLS} + {FE}", panel
    )

    labels = {
        "M1": "County and year FE",
        "M2": "County/year FE + controls",
        "M3": "Metro/nonmetro slopes",
        "M4": "Official BDS entry rate",
        "M5": "Startup job creation intensity",
    }
    outcomes = {
        "M1": "startup_rate",
        "M2": "startup_rate",
        "M3": "startup_rate",
        "M4": "official_entry_rate",
        "M5": "startup_job_creation_intensity",
    }

    result_rows: list[dict[str, object]] = []
    for spec in ["M1", "M2", "M4", "M5"]:
        result_rows.append(
            extract_term(
                models[spec],
                "branch_density_lag",
                spec_id=spec,
                spec_label=labels[spec],
                outcome=outcomes[spec],
                exposure="branch_density_lag",
                effect_label="Full sample slope",
            )
        )

    metro = extract_term(
        models["M3"],
        "branch_density_lag",
        spec_id="M3_metro",
        spec_label=labels["M3"],
        outcome="startup_rate",
        exposure="branch_density_lag",
        effect_label="Metro slope",
    )
    interaction = extract_term(
        models["M3"],
        "branch_density_lag:nonmetro2013",
        spec_id="M3_interaction",
        spec_label=labels["M3"],
        outcome="startup_rate",
        exposure="branch_density_lag",
        effect_label="Nonmetro minus metro",
    )
    nonmetro = linear_combination(
        models["M3"],
        ["branch_density_lag", "branch_density_lag:nonmetro2013"],
        [1.0, 1.0],
        spec_id="M3_nonmetro",
        spec_label=labels["M3"],
        outcome="startup_rate",
        exposure="branch_density_lag",
        effect_label="Nonmetro slope",
    )
    result_rows.extend([metro, interaction, nonmetro])

    results = pd.DataFrame(result_rows)
    primary = panel.dropna(subset=["startup_rate", "branch_density_lag"])
    within = primary["branch_density_lag"] - primary.groupby("fips")["branch_density_lag"].transform("mean")
    within_sd = float(within.std(ddof=1))
    results["within_county_branch_density_sd"] = within_sd
    results["effect_per_within_sd"] = results["estimate"] * within_sd
    results.to_csv(TABLES / "model_results_main.csv", index=False)

    full = pd.concat([full_coefficients(result, spec) for spec, result in models.items()], ignore_index=True)
    full.to_csv(INTERIM / "model_coefficients_main_full.csv", index=False)

    headline = results.loc[results["spec_id"] == "M2"].iloc[0]
    mean_outcome = float(primary["startup_rate"].mean())
    findings = {
        "headline_specification": "M2 county/year fixed effects with predefined lagged controls",
        "estimate": float(headline["estimate"]),
        "standard_error": float(headline["std_error"]),
        "ci_low": float(headline["ci_low"]),
        "ci_high": float(headline["ci_high"]),
        "p_value": float(headline["p_value"]),
        "n_obs": int(headline["n_obs"]),
        "clusters": int(headline["clusters"]),
        "mean_outcome": mean_outcome,
        "within_county_branch_density_sd": within_sd,
        "effect_per_within_sd": float(headline["effect_per_within_sd"]),
        "effect_per_within_sd_percent_of_mean": float(100 * headline["effect_per_within_sd"] / mean_outcome),
        "metro_slope": float(metro["estimate"]),
        "metro_ci": [float(metro["ci_low"]), float(metro["ci_high"])],
        "nonmetro_slope": float(nonmetro["estimate"]),
        "nonmetro_ci": [float(nonmetro["ci_low"]), float(nonmetro["ci_high"])],
        "interaction": float(interaction["estimate"]),
        "interaction_ci": [float(interaction["ci_low"]), float(interaction["ci_high"])],
    }
    write_json(INTERIM / "main_findings.json", findings)
    print(results.to_string(index=False))
    print(json.dumps(findings, indent=2))


if __name__ == "__main__":
    main()

