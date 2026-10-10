

from __future__ import annotations

import json
import re
import zipfile

import pandas as pd

from common import INTERIM, PROCESSED, RAW, ensure_directories, write_json


def main() -> None:
    ensure_directories()
    with zipfile.ZipFile(RAW / "CAINC1.zip") as archive:
        members = [name for name in archive.namelist() if name.startswith("CAINC1_NC_") and name.endswith(".csv")]
        if len(members) != 1:
            raise AssertionError(f"Expected one NC CAINC1 file, found {members}")
        source_member = members[0]
        raw = pd.read_csv(archive.open(source_member), dtype=str)

    raw["fips"] = raw["GeoFIPS"].str.replace(r"\D", "", regex=True).str.zfill(5)


    raw["LineCode"] = pd.to_numeric(raw["LineCode"], errors="coerce")
    county = raw.loc[raw["fips"].str.fullmatch(r"37\d{3}") & (raw["fips"] != "37000") & raw["LineCode"].isin([2, 3])].copy()
    county["LineCode"] = county["LineCode"].astype(int)
    years = [str(year) for year in range(2012, 2023)]
    long = county.melt(
        id_vars=["fips", "GeoName", "LineCode", "Description", "Unit"],
        value_vars=years,
        var_name="year",
        value_name="value",
    )
    long["year"] = long["year"].astype(int)
    long["value"] = pd.to_numeric(long["value"].str.replace(",", "", regex=False), errors="coerce")
    if long["value"].isna().any():
        raise AssertionError("BEA control values contain missing or nonnumeric cells")
    wide = long.pivot(index=["fips", "year"], columns="LineCode", values="value").reset_index().rename(columns={2: "population", 3: "pcpi"})
    names = county[["fips", "GeoName"]].drop_duplicates("fips").rename(columns={"GeoName": "county_name"})
    names["county_name"] = names["county_name"].str.replace(", NC", "", regex=False).str.strip()
    wide = wide.merge(names, on="fips", how="left", validate="many_to_one")
    if len(wide) != 1100 or wide["fips"].nunique() != 100:
        raise AssertionError(f"Expected 1,100 BEA county-years, found {len(wide)} rows/{wide['fips'].nunique()} counties")
    if (wide[["population", "pcpi"]] <= 0).any().any():
        raise AssertionError("BEA population or PCPI is nonpositive")
    wide = wide[["fips", "county_name", "year", "population", "pcpi"]].sort_values(["fips", "year"])
    wide.to_csv(PROCESSED / "bea_county_year.csv", index=False)
    audit = {
        "zip_member": source_member,
        "raw_rows": int(len(raw)),
        "selected_line_rows": int(len(county)),
        "processed_rows": int(len(wide)),
        "counties": int(wide["fips"].nunique()),
        "years": [int(wide["year"].min()), int(wide["year"].max())],
        "line_codes": {"2": "Population (persons)", "3": "Per capita personal income (dollars)"},
    }
    write_json(INTERIM / "bea_audit.json", audit)
    print(json.dumps(audit, indent=2))


if __name__ == "__main__":
    main()
