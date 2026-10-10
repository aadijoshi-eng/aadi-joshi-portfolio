

from __future__ import annotations

import math
from dataclasses import dataclass
from typing import Any

import numpy as np
import pandas as pd
import statsmodels.api as sm
import statsmodels.formula.api as smf
from scipy import stats


def fit_ols(
    formula: str,
    data: pd.DataFrame,
    *,
    weights: str | None = None,
    cluster: str = "fips",
) -> Any:
    if weights is None:
        model = smf.ols(formula, data=data, missing="drop")
    else:
        model = smf.wls(formula, data=data, weights=data[weights], missing="drop")
    row_labels = model.data.row_labels
    groups = data.loc[row_labels, cluster]
    result = model.fit(
        cov_type="cluster",
        cov_kwds={"groups": groups, "use_correction": True},
        use_t=True,
    )
    result._ec2_cluster_count = int(groups.nunique())
    return result


def fit_poisson(
    formula: str,
    data: pd.DataFrame,
    *,
    offset: str,
    cluster: str = "fips",
) -> Any:
    required = [offset, cluster]
    work = data.dropna(subset=required).copy()
    model = smf.glm(
        formula,
        data=work,
        family=sm.families.Poisson(),
        offset=np.log(work[offset]),
        missing="drop",
    )
    groups = work.loc[model.data.row_labels, cluster]
    result = model.fit(
        cov_type="cluster",
        cov_kwds={"groups": groups, "use_correction": True},
        maxiter=200,
    )
    result._ec2_cluster_count = int(groups.nunique())
    return result


def extract_term(
    result: Any,
    term: str,
    *,
    spec_id: str,
    spec_label: str,
    outcome: str,
    exposure: str,
    effect_label: str | None = None,
) -> dict[str, object]:
    if term not in result.params.index:
        raise KeyError(f"Term {term!r} not found in model {spec_id}")
    ci = result.conf_int().loc[term]
    return {
        "spec_id": spec_id,
        "spec_label": spec_label,
        "outcome": outcome,
        "exposure": exposure,
        "effect_label": effect_label or term,
        "term": term,
        "estimate": float(result.params[term]),
        "std_error": float(result.bse[term]),
        "ci_low": float(ci.iloc[0]),
        "ci_high": float(ci.iloc[1]),
        "p_value": float(result.pvalues[term]),
        "n_obs": int(result.nobs),
        "clusters": int(getattr(result, "_ec2_cluster_count", np.nan)),
        "r_squared": float(getattr(result, "rsquared", np.nan)),
        "adjusted_r_squared": float(getattr(result, "rsquared_adj", np.nan)),
    }


def linear_combination(
    result: Any,
    terms: list[str],
    weights: list[float],
    *,
    spec_id: str,
    spec_label: str,
    outcome: str,
    exposure: str,
    effect_label: str,
) -> dict[str, object]:
    parameters = result.params
    covariance = result.cov_params()
    vector = np.zeros(len(parameters))
    for term, weight in zip(terms, weights):
        if term not in parameters.index:
            raise KeyError(term)
        vector[parameters.index.get_loc(term)] = weight
    estimate = float(vector @ parameters.to_numpy())
    variance = float(vector @ covariance.to_numpy() @ vector)
    standard_error = math.sqrt(max(variance, 0.0))
    clusters = int(getattr(result, "_ec2_cluster_count", 0))
    degrees = max(clusters - 1, 1)
    critical = float(stats.t.ppf(0.975, degrees))
    statistic = estimate / standard_error if standard_error > 0 else np.nan
    p_value = float(2 * stats.t.sf(abs(statistic), degrees)) if np.isfinite(statistic) else np.nan
    return {
        "spec_id": spec_id,
        "spec_label": spec_label,
        "outcome": outcome,
        "exposure": exposure,
        "effect_label": effect_label,
        "term": " + ".join(f"{weight:g}*{term}" for term, weight in zip(terms, weights)),
        "estimate": estimate,
        "std_error": standard_error,
        "ci_low": estimate - critical * standard_error,
        "ci_high": estimate + critical * standard_error,
        "p_value": p_value,
        "n_obs": int(result.nobs),
        "clusters": clusters,
        "r_squared": float(getattr(result, "rsquared", np.nan)),
        "adjusted_r_squared": float(getattr(result, "rsquared_adj", np.nan)),
    }


def full_coefficients(result: Any, spec_id: str) -> pd.DataFrame:
    confidence = result.conf_int()
    return pd.DataFrame(
        {
            "spec_id": spec_id,
            "term": result.params.index,
            "estimate": result.params.to_numpy(),
            "std_error": result.bse.to_numpy(),
            "ci_low": confidence.iloc[:, 0].to_numpy(),
            "ci_high": confidence.iloc[:, 1].to_numpy(),
            "p_value": result.pvalues.to_numpy(),
        }
    )

