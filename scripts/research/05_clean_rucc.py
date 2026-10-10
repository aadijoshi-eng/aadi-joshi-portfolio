

from __future__ import annotations

import json

import pandas as pd

from common import INTERIM, PROCESSED, RAW, ensure_directories, write_json


def main() -> None:
    ensure_directories()
    old = pd.read_excel(RAW / "rucc2013.xls", sheet_name="Rural-urban Continuum Code 2013", dtype={"FIPS": str})
    old["fips"] = old["FIPS"].astype(str).str.replace(r"\.0$", "", regex=True).str.zfill(5)
    old = old.loc[old["fips"].str.startswith("37"), ["fips", "County_Name", "RUCC_2013", "Description"]].copy()
    old = old.rename(columns={"County_Name": "county_name_rucc", "RUCC_2013": "rucc2013", "Description": "rucc2013_description"})
    old["rucc2013"] = pd.to_numeric(old["rucc2013"], errors="raise").astype(int)
    old["nonmetro2013"] = (old["rucc2013"] >= 4).astype(int)


    current_long = pd.read_csv(RAW / "rucc2023.csv", dtype={"FIPS": str}, encoding="latin-1")
    current_long["fips"] = current_long["FIPS"].astype(str).str.zfill(5)
    current_long = current_long.loc[current_long["fips"].str.startswith("37")].copy()
    current = current_long.pivot(index=["fips", "State", "County_Name"], columns="Attribute", values="Value").reset_index()
    current = current.rename(columns={"RUCC_2023": "rucc2023", "Description": "rucc2023_description"})
    current["rucc2023"] = pd.to_numeric(current["rucc2023"], errors="raise").astype(int)
    current["nonmetro2023"] = (current["rucc2023"] >= 4).astype(int)
    current = current[["fips", "rucc2023", "rucc2023_description", "nonmetro2023"]]

    combined = old.merge(current, on="fips", how="outer", validate="one_to_one", indicator=True)
    if len(combined) != 100 or not (combined["_merge"] == "both").all():
        raise AssertionError(f"RUCC merge failed: {combined['_merge'].value_counts().to_dict()}")
    combined = combined.drop(columns="_merge").sort_values("fips")
    combined.to_csv(PROCESSED / "rucc_county.csv", index=False)
    audit = {
        "counties": int(len(combined)),
        "nonmetro_2013": int(combined["nonmetro2013"].sum()),
        "nonmetro_2023": int(combined["nonmetro2023"].sum()),
        "changed_metro_status": int((combined["nonmetro2013"] != combined["nonmetro2023"]).sum()),
    }
    write_json(INTERIM / "rucc_audit.json", audit)
    print(json.dumps(audit, indent=2))


if __name__ == "__main__":
    main()
