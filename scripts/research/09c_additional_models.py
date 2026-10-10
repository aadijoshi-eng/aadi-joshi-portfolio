


from __future__ import annotations

import json

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
    rows: list[dict[str, object]] = []

    def register(
        spec_id: str,
        label: str,
        formula: str,
        term: str,
        data: pd.DataFrame,
        status: str,
    ) -> None:
        result = fit_ols(formula, data)
        row = extract_term(
            result,
            term,
            spec_id=spec_id,
            spec_label=label,
            outcome=formula.split("~", 1)[0].strip(),
            exposure=term,
            effect_label="Audit-added diagnostic slope",
        )
        row["analysis_status"] = status
        rows.append(row)

    register(
        "A1",
        "Firm-age-zero firm-rate measurement check",
        f"startup_firm_rate ~ branch_density_lag + {CONTROLS} + {FE}",
        "branch_density_lag",
        panel,
        "Audit-added secondary check; listed in the frozen plan but omitted from the original execution",
    )

    register(
        "A2",
        "Exclude final BDS outcome year",
        f"startup_rate ~ branch_density_lag + {CONTROLS} + {FE}",
        "branch_density_lag",
        panel.loc[panel["year"] <= 2022].copy(),
        "Audit-added adversarial sensitivity",
    )

    suppression_counties = sorted(panel.loc[panel["age0_estabs_flag"].notna(), "fips"].unique())
    register(
        "A3",
        "Exclude suppression-affected counties",
        f"startup_rate ~ branch_density_lag + {CONTROLS} + {FE}",
        "branch_density_lag",
        panel.loc[~panel["fips"].isin(suppression_counties)].copy(),
        "Audit-added adversarial sensitivity",
    )

    shift_columns = [
        "branch_density_lag",
        "unemployment_rate_lag",
        "log_population_lag",
        "log_pcpi_lag",
        "exposure_year",
    ]
    for column in shift_columns:
        panel[f"{column}_t2"] = panel.groupby("fips")[column].shift(1)

    register(
        "A4",
        "Clean-preperiod exposure and controls (t-2)",
        "startup_rate ~ branch_density_lag_t2 + unemployment_rate_lag_t2 "
        "+ log_population_lag_t2 + log_pcpi_lag_t2 + C(fips) + C(year)",
        "branch_density_lag_t2",
        panel,
        "Audit-added timing diagnostic",
    )

    results = pd.DataFrame(rows)
    results.to_csv(TABLES / "model_results_additional_models.csv", index=False)
    panel.to_csv(INTERIM / "panel_with_audit_timing.csv", index=False)

    clean = results.loc[results["spec_id"] == "A4"].iloc[0]
    payload = {
        "analysis_status": "Audit-added; none of these specifications replaces M2",
        "bds_timing": "BDS year t dynamics are measured between March employment reference dates in t-1 and t",
        "sod_timing": "FDIC SOD is a June 30 snapshot",
        "headline_timing_implication": "The t-1 SOD snapshot falls inside the BDS t transition window",
        "suppression_affected_counties": suppression_counties,
        "clean_preperiod_estimate": float(clean["estimate"]),
        "clean_preperiod_standard_error": float(clean["std_error"]),
        "clean_preperiod_ci": [float(clean["ci_low"]), float(clean["ci_high"])],
        "clean_preperiod_p_value": float(clean["p_value"]),
        "clean_preperiod_n": int(clean["n_obs"]),
        "clean_preperiod_clusters": int(clean["clusters"]),
    }
    write_json(INTERIM / "audit_additions_summary.json", payload)
    print(results.to_string(index=False))
    print(json.dumps(payload, indent=2))


if __name__ == "__main__":
    main()
