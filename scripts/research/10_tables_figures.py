

from __future__ import annotations

import json
from pathlib import Path

import geopandas as gpd
import matplotlib as mpl
import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
import seaborn as sns
from matplotlib.colors import TwoSlopeNorm

from common import FIGURES, INTERIM, PROCESSED, RAW, TABLES, ensure_directories


BLUE = "#153B5B"
TEAL = "#238C8C"
ORANGE = "#D9822B"
RED = "#B54747"
GRAY = "#6B7280"


VARIABLE_DEFINITIONS = [
    {
        "variable": "Employer-startup rate",
        "definition": "1,000 x firm-age-zero establishments in year t / all active establishments in year t-1",
        "source": "Census BDS county and county-by-coarse-firm-age files",
        "timing_units": "Outcome year; establishments per 1,000 lagged establishments",
    },
    {
        "variable": "Official establishment-entry rate",
        "definition": "Census BDS entry rate for all entering establishments, including locations opened by existing firms",
        "source": "Census BDS county file",
        "timing_units": "Outcome year; BDS rate",
    },
    {
        "variable": "Startup job-creation intensity",
        "definition": "1,000 x jobs created by firm-age-zero establishments / lagged employed workers",
        "source": "Census BDS county and county-by-coarse-firm-age files",
        "timing_units": "Outcome year; jobs per 1,000 lagged workers",
    },
    {
        "variable": "Full-service branch density",
        "definition": "10,000 x count of SOD service codes 11 or 12 / BEA county population",
        "source": "FDIC SOD and BEA CAINC1",
        "timing_units": "June 30 in t-1; branches per 10,000 residents",
    },
    {
        "variable": "Deposit HHI",
        "definition": "10,000 x sum of squared institution shares of county branch-assigned deposits",
        "source": "FDIC SOD",
        "timing_units": "June 30 in t-1; 0-10,000 scale",
    },
    {
        "variable": "Unemployment rate",
        "definition": "County annual-average unemployment rate",
        "source": "BLS LAUS",
        "timing_units": "t-1; percent",
    },
    {
        "variable": "Population and PCPI",
        "definition": "County population and nominal per-capita personal income",
        "source": "BEA CAINC1",
        "timing_units": "t-1; persons and nominal dollars (logs in models)",
    },
    {
        "variable": "Nonmetro",
        "definition": "2013 RUCC code 4-9 (2023 RUCC used in robustness)",
        "source": "USDA Economic Research Service",
        "timing_units": "Time-invariant indicator",
    },
]


def save_figure(fig: plt.Figure, basename: str) -> None:
    fig.savefig(FIGURES / f"{basename}.png", dpi=300, bbox_inches="tight", facecolor="white")
    fig.savefig(FIGURES / f"{basename}.pdf", bbox_inches="tight", facecolor="white")
    plt.close(fig)


def main() -> None:
    ensure_directories()
    mpl.rcParams.update(
        {
            "font.family": "DejaVu Sans",
            "font.size": 9.5,
            "axes.titlesize": 13,
            "axes.labelsize": 10,
            "axes.edgecolor": "#475569",
            "axes.linewidth": 0.7,
            "axes.spines.top": False,
            "axes.spines.right": False,
            "figure.dpi": 140,
        }
    )
    sns.set_theme(style="whitegrid", rc={"grid.color": "#E5E7EB", "grid.linewidth": 0.6})

    definitions = pd.DataFrame(VARIABLE_DEFINITIONS)
    definitions.to_csv(TABLES / "table_variable_definitions.csv", index=False)
    (TABLES / "table_variable_definitions.md").write_text(definitions.to_markdown(index=False) + "\n", encoding="utf-8")

    main_results = pd.read_csv(TABLES / "model_results_main.csv")
    robustness = pd.read_csv(TABLES / "model_results_robustness.csv")
    influence = pd.read_csv(TABLES / "model_results_influence.csv")
    summary = pd.read_csv(TABLES / "table_summary_statistics.csv")

    primary_rows = main_results.loc[main_results["spec_id"].isin(["M1", "M2", "M3_metro", "M3_nonmetro", "M3_interaction", "M4", "M5"])].copy()
    primary_rows["estimate_ci"] = primary_rows.apply(
        lambda row: f"{row.estimate:.3f} [{row.ci_low:.3f}, {row.ci_high:.3f}]", axis=1
    )
    primary_table = primary_rows[
        ["spec_label", "outcome", "effect_label", "estimate_ci", "std_error", "p_value", "n_obs", "clusters", "r_squared"]
    ].rename(
        columns={
            "spec_label": "Specification",
            "outcome": "Outcome",
            "effect_label": "Reported effect",
            "estimate_ci": "Estimate [95% CI]",
            "std_error": "Clustered SE",
            "p_value": "p-value",
            "n_obs": "N",
            "clusters": "Counties",
            "r_squared": "R-squared",
        }
    )
    primary_table.to_csv(TABLES / "table_primary_estimates.csv", index=False)
    (TABLES / "table_primary_estimates.md").write_text(primary_table.to_markdown(index=False) + "\n", encoding="utf-8")

    robustness["estimate_ci"] = robustness.apply(
        lambda row: f"{row.estimate:.3f} [{row.ci_low:.3f}, {row.ci_high:.3f}]", axis=1
    )
    robustness_table = robustness[
        ["spec_label", "outcome", "exposure", "estimate_ci", "std_error", "p_value", "n_obs", "clusters"]
    ].rename(
        columns={
            "spec_label": "Specification",
            "outcome": "Outcome",
            "exposure": "Exposure",
            "estimate_ci": "Estimate [95% CI]",
            "std_error": "Clustered SE",
            "p_value": "p-value",
            "n_obs": "N",
            "clusters": "Counties",
        }
    )
    robustness_table.to_csv(TABLES / "table_robustness_estimates.csv", index=False)
    (TABLES / "table_robustness_estimates.md").write_text(robustness_table.to_markdown(index=False) + "\n", encoding="utf-8")


    audit_rows = []
    for name in ["bds", "fdic", "bea", "bls", "rucc", "merge"]:
        data = json.loads((INTERIM / f"{name}_audit.json").read_text(encoding="utf-8"))
        audit_rows.append({"source_or_stage": name.upper(), "key_checks": json.dumps(data, sort_keys=True)})
    pd.DataFrame(audit_rows).to_csv(TABLES / "table_source_data_quality.csv", index=False)


    change = pd.read_csv(INTERIM / "county_branch_change_map_data.csv", dtype={"fips": str})
    geometry = gpd.read_file(f"zip://{RAW / 'cb_2023_us_county_500k.zip'}")
    geometry = geometry.loc[geometry["STATEFP"] == "37"].copy()
    geometry["fips"] = geometry["GEOID"].astype(str)
    map_data = geometry.merge(change, on="fips", how="left", validate="one_to_one")
    if len(map_data) != 100 or map_data["branch_density_change_2013_2022"].isna().any():
        raise AssertionError("Map merge did not retain 100 NC counties")
    values = map_data["branch_density_change_2013_2022"]
    extent = max(abs(values.quantile(0.02)), abs(values.quantile(0.98)))
    norm = TwoSlopeNorm(vmin=-extent, vcenter=0, vmax=extent)
    fig, ax = plt.subplots(figsize=(9.5, 5.1))
    map_data.plot(
        column="branch_density_change_2013_2022",
        cmap="RdBu",
        norm=norm,
        linewidth=0.35,
        edgecolor="white",
        ax=ax,
        missing_kwds={"color": "#D1D5DB"},
    )
    ax.set_axis_off()
    ax.set_title("Change in full-service bank branches per 10,000 residents, 2013-2022", loc="left", pad=12, weight="bold")
    scalar = mpl.cm.ScalarMappable(norm=norm, cmap="RdBu")
    fig.subplots_adjust(left=0.03, right=0.98, top=0.89, bottom=0.23)
    cax = fig.add_axes([0.30, 0.18, 0.40, 0.025])
    colorbar = fig.colorbar(scalar, cax=cax, orientation="horizontal")
    cax.set_title("Change in branches per 10,000 residents", fontsize=9, pad=5)
    fig.text(0.03, 0.085, "Note: Negative values indicate lower branch density in 2022. Full-service SOD codes 11 and 12 only.", fontsize=8.5, color=GRAY)
    fig.text(0.03, 0.035, "Sources: FDIC Summary of Deposits; BEA CAINC1; Census 2023 cartographic boundaries.", fontsize=8, color=GRAY)
    save_figure(fig, "figure_1_branch_density_change_map")


    trends = pd.read_csv(INTERIM / "statewide_trends.csv")
    fig, axes = plt.subplots(2, 1, figsize=(8.2, 6.7), sharex=True, gridspec_kw={"height_ratios": [1, 1]})
    axes[0].plot(trends["outcome_year"], trends["branch_count_index"], marker="o", color=BLUE, label="Full-service branch count")
    axes[0].plot(trends["outcome_year"], trends["branch_density_index"], marker="s", color=TEAL, label="Branches per 10,000 residents")
    axes[0].axhline(100, color="#9CA3AF", linewidth=0.8, linestyle="--")
    axes[0].set_ylabel("Index (2014 = 100)")
    axes[0].legend(frameon=False, ncol=2, loc="lower left")
    axes[0].set_title("North Carolina branch networks contracted while startup activity moved differently over time", loc="left", weight="bold")
    axes[1].plot(trends["outcome_year"], trends["startup_rate"], marker="o", color=ORANGE)
    axes[1].set_ylabel("Startup establishments per\n1,000 lagged establishments")
    axes[1].set_xlabel("BDS outcome year (branch measure is June 30 of prior year)")
    axes[1].set_xticks(trends["outcome_year"])
    axes[1].tick_params(axis="x", rotation=45)
    fig.text(0.01, 0.01, "Sources: FDIC SOD, BEA CAINC1, and Census BDS state firm-age tables. Indices are descriptive, not causal.", fontsize=8, color=GRAY)
    fig.tight_layout(rect=[0, 0.04, 1, 1])
    save_figure(fig, "figure_2_statewide_trends")


    comparison = pd.concat(
        [
            main_results.loc[main_results["spec_id"].isin(["M1", "M2"])],
            robustness.loc[robustness["spec_id"].isin(["R1", "R2", "R9"])],
        ],
        ignore_index=True,
    )
    comparison = comparison.iloc[::-1].reset_index(drop=True)
    fig, ax = plt.subplots(figsize=(8.4, 4.9))
    y = np.arange(len(comparison))
    xerr = np.vstack([comparison["estimate"] - comparison["ci_low"], comparison["ci_high"] - comparison["estimate"]])
    ax.errorbar(comparison["estimate"], y, xerr=xerr, fmt="o", color=BLUE, ecolor=TEAL, capsize=3, linewidth=1.4)
    ax.axvline(0, color="#111827", linewidth=0.8)
    ax.set_yticks(y, comparison["spec_label"])
    ax.set_xlabel("Associated change in startup rate per +1 branch per 10,000 residents")
    ax.set_title("Branch-density estimates across the predefined model sequence", loc="left", weight="bold")
    fig.subplots_adjust(left=0.34, right=0.97, top=0.88, bottom=0.22)
    fig.text(0.34, 0.055, "Note: 95% confidence intervals with county-clustered standard errors. First differences retain year effects.", fontsize=8.5, color=GRAY)
    save_figure(fig, "figure_3_coefficient_plot")


    slopes = main_results.loc[main_results["spec_id"].isin(["M3_metro", "M3_nonmetro"])].copy()
    slopes = slopes.sort_values("effect_label")
    fig, ax = plt.subplots(figsize=(7.0, 4.1))
    y = np.arange(len(slopes))
    xerr = np.vstack([slopes["estimate"] - slopes["ci_low"], slopes["ci_high"] - slopes["estimate"]])
    ax.errorbar(slopes["estimate"], y, xerr=xerr, fmt="o", color=ORANGE, ecolor=RED, capsize=4, markersize=7)
    ax.axvline(0, color="#111827", linewidth=0.8)
    ax.set_yticks(y, slopes["effect_label"])
    ax.set_xlabel("Associated startup-rate change per +1 branch per 10,000 residents")
    ax.set_title("Estimated branch-density slope by 2013 metro status", loc="left", weight="bold")
    fig.subplots_adjust(left=0.28, right=0.97, top=0.86, bottom=0.25)
    fig.text(0.28, 0.055, "Note: 95% confidence intervals from one interaction model with county/year fixed effects and controls.", fontsize=8.5, color=GRAY)
    save_figure(fig, "figure_4_metro_nonmetro_slopes")

    print(f"Created {len(list(FIGURES.glob('figure_*.png')))} PNG figures and publication tables")


if __name__ == "__main__":
    main()
