

from __future__ import annotations

import json

import numpy as np
import pandas as pd

from common import INTERIM, PROCESSED, RAW, ensure_directories, write_json


def hhi_10000(group: pd.DataFrame) -> float:
    deposits = group.groupby("cert", observed=True)["deposits_thousands"].sum(min_count=1)
    deposits = deposits.loc[deposits >= 0]
    total = deposits.sum()
    if not np.isfinite(total) or total <= 0:
        return np.nan
    shares = deposits / total
    return float(10000 * np.square(shares).sum())


def main() -> None:
    ensure_directories()
    rows: list[dict[str, object]] = []
    raw_counts: dict[str, int] = {}
    for year in range(2012, 2023):
        path = RAW / f"fdic_sod_nc_{year}.json"
        payload = json.loads(path.read_text(encoding="utf-8"))
        year_rows = [item["data"] for item in payload["data"]]
        raw_counts[str(year)] = len(year_rows)
        rows.extend(year_rows)

    frame = pd.DataFrame(rows)
    frame = frame.rename(
        columns={
            "YEAR": "year",
            "CERT": "cert",
            "UNINUMBR": "branch_id",
            "NAMEBR": "branch_name",
            "STCNTYBR": "fips",
            "DEPSUMBR": "deposits_thousands",
            "BRSERTYP": "service_type",
        }
    )
    for column in ["year", "cert", "branch_id", "deposits_thousands", "service_type"]:
        frame[column] = pd.to_numeric(frame[column], errors="raise")
    frame["year"] = frame["year"].astype(int)
    frame["cert"] = frame["cert"].astype(int)
    frame["branch_id"] = frame["branch_id"].astype(int)
    frame["service_type"] = frame["service_type"].astype(int)
    frame["fips"] = pd.to_numeric(frame["fips"], errors="raise").astype(int).astype(str).str.zfill(5)

    if not frame["fips"].str.fullmatch(r"37\d{3}").all():
        raise AssertionError("FDIC extract contains malformed or non-NC FIPS")
    duplicate = frame.duplicated(["year", "branch_id"], keep=False)
    if duplicate.any():
        sample = frame.loc[duplicate, ["year", "branch_id", "branch_name"]].head().to_dict(orient="records")
        raise AssertionError(f"Duplicate annual branch identifiers found: {sample}")
    if (frame["deposits_thousands"] < 0).any():
        raise AssertionError("Negative SOD branch deposits require manual review")

    full = frame.loc[frame["service_type"].isin([11, 12])].copy()
    full_counts = full.groupby(["fips", "year"]).size().rename("full_service_branches")
    bank_counts = full.groupby(["fips", "year"])["cert"].nunique().rename("bank_count")
    deposits = full.groupby(["fips", "year"])["deposits_thousands"].sum().rename("full_service_deposits_thousands")
    hhi = full.groupby(["fips", "year"], group_keys=False).apply(hhi_10000, include_groups=False).rename("deposit_hhi")

    bds = pd.read_csv(PROCESSED / "bds_county_outcomes.csv", dtype={"fips": str})
    fips = sorted(bds["fips"].astype(str).str.zfill(5).unique())
    skeleton = pd.MultiIndex.from_product([fips, range(2012, 2023)], names=["fips", "year"]).to_frame(index=False)
    county = skeleton.merge(full_counts.reset_index(), on=["fips", "year"], how="left", validate="one_to_one")
    county = county.merge(bank_counts.reset_index(), on=["fips", "year"], how="left", validate="one_to_one")
    county = county.merge(deposits.reset_index(), on=["fips", "year"], how="left", validate="one_to_one")
    county = county.merge(hhi.reset_index(), on=["fips", "year"], how="left", validate="one_to_one")
    for column in ["full_service_branches", "bank_count", "full_service_deposits_thousands"]:
        county[column] = county[column].fillna(0)
    county["full_service_branches"] = county["full_service_branches"].astype(int)
    county["bank_count"] = county["bank_count"].astype(int)

    observed_counties = full.groupby("year")["fips"].nunique()
    variation = county.loc[county["year"].between(2013, 2022)].groupby("fips")["full_service_branches"].nunique()
    endpoints = county.loc[county["year"].isin([2013, 2022])].pivot(index="fips", columns="year", values="full_service_branches")
    endpoint_change = endpoints[2022] - endpoints[2013]
    by_year_full = full.groupby("year").size().astype(int).to_dict()
    audit = {
        "raw_rows_by_year": raw_counts,
        "all_raw_rows": int(len(frame)),
        "full_service_rows": int(len(full)),
        "full_service_rows_by_year": {str(k): int(v) for k, v in by_year_full.items()},
        "counties_with_any_full_service_branch_by_year": {str(k): int(v) for k, v in observed_counties.items()},
        "county_year_skeleton_rows": int(len(county)),
        "counties_with_2013_2022_within_count_variation": int((variation > 1).sum()),
        "counties_fewer_branches_2022_than_2013": int((endpoint_change < 0).sum()),
        "counties_more_branches_2022_than_2013": int((endpoint_change > 0).sum()),
        "counties_unchanged_2022_vs_2013": int((endpoint_change == 0).sum()),
        "duplicate_annual_branch_ids": int(duplicate.sum()),
        "negative_deposit_rows": int((frame["deposits_thousands"] < 0).sum()),
    }
    full.to_csv(INTERIM / "fdic_full_service_branch_records.csv", index=False)
    county.to_csv(PROCESSED / "fdic_county_year.csv", index=False)
    write_json(INTERIM / "fdic_audit.json", audit)
    print(json.dumps(audit, indent=2))


if __name__ == "__main__":
    main()

