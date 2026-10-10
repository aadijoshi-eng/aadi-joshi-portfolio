


from __future__ import annotations

import json

import numpy as np
import pandas as pd

from common import INTERIM, PROCESSED, TABLES, ensure_directories, write_json
from model_utils import extract_term, fit_ols


CONTROLS = "unemployment_rate_lag + log_population_lag + log_pcpi_lag"
FE = "C(fips) + C(year)"


def main() -> None:
    ensure_directories()
    panel = pd.read_csv(PROCESSED / "nc_bank_startup_panel.csv", dtype={"fips": str}).sort_values(
        ["fips", "year"]
    )


    baseline_population = (
        panel.loc[panel["exposure_year"] == 2013, ["fips", "population_lag"]]
        .rename(columns={"population_lag": "population_2013"})
        .drop_duplicates("fips")
    )
    if len(baseline_population) != 100:
        raise AssertionError("Expected one 2013 population value for each NC county")
    panel = panel.merge(baseline_population, on="fips", how="left", validate="many_to_one")
    panel["branch_density_fixed_2013_population"] = 10000 * panel["branch_count_lag"] / panel["population_2013"]
    panel["startup_estabs_per_10000_population"] = 10000 * panel["age0_estabs"] / panel["population_lag"]
    panel["year_centered"] = panel["year"] - panel["year"].min()
    panel["lagged_log_population_growth"] = panel.groupby("fips")["log_population_lag"].diff()

    specifications = [
        (
            "P1",
            "Fixed-2013-population branch density",
            f"startup_rate ~ branch_density_fixed_2013_population + {CONTROLS} + {FE}",
            "branch_density_fixed_2013_population",
            "startup_rate",
        ),
        (
            "P2",
            "County-specific linear trends",
            f"startup_rate ~ branch_density_lag + {CONTROLS} + {FE} + C(fips):year_centered",
            "branch_density_lag",
            "startup_rate",
        ),
        (
            "P3",
            "Population-based startup outcome",
            f"startup_estabs_per_10000_population ~ branch_density_lag + {CONTROLS} + {FE}",
            "branch_density_lag",
            "startup_estabs_per_10000_population",
        ),
        (
            "P4",
            "Additional population-growth control",
            f"startup_rate ~ branch_density_lag + {CONTROLS} + lagged_log_population_growth + {FE}",
            "branch_density_lag",
            "startup_rate",
        ),
    ]

    rows: list[dict[str, object]] = []
    for spec_id, label, formula, term, outcome in specifications:
        result = fit_ols(formula, panel)
        row = extract_term(
            result,
            term,
            spec_id=spec_id,
            spec_label=label,
            outcome=outcome,
            exposure=term,
            effect_label="Post-hoc diagnostic slope",
        )
        row["analysis_status"] = "Post-hoc/exploratory"
        rows.append(row)

    results = pd.DataFrame(rows)
    results.to_csv(TABLES / "model_results_posthoc_diagnostics.csv", index=False)
    panel.to_csv(INTERIM / "panel_with_posthoc_variables.csv", index=False)


    changes = (
        panel.groupby("fips", as_index=False)
        .agg(
            county_name=("county_name", "first"),
            branch_density_start=("branch_density_lag", "first"),
            branch_density_end=("branch_density_lag", "last"),
            branch_count_start=("branch_count_lag", "first"),
            branch_count_end=("branch_count_lag", "last"),
            population_start=("population_lag", "first"),
            population_end=("population_lag", "last"),
        )
    )
    changes["branch_density_change"] = changes["branch_density_end"] - changes["branch_density_start"]
    changes["branch_count_change"] = changes["branch_count_end"] - changes["branch_count_start"]
    changes["log_population_change"] = np.log(changes["population_end"]) - np.log(changes["population_start"])
    changes.to_csv(TABLES / "table_posthoc_density_decomposition.csv", index=False)

    correlations = {
        "corr_density_change_population_growth": float(
            changes["branch_density_change"].corr(changes["log_population_change"])
        ),
        "corr_density_change_branch_count_change": float(
            changes["branch_density_change"].corr(changes["branch_count_change"])
        ),
        "note": "Post-hoc descriptive correlations across 100 counties; not causal tests.",
    }
    write_json(INTERIM / "posthoc_diagnostic_summary.json", {"results": rows, **correlations})
    print(results.to_string(index=False))
    print(json.dumps(correlations, indent=2))


if __name__ == "__main__":
    main()
