

from __future__ import annotations

import json

import pandas as pd

from common import INTERIM, PROCESSED, RAW, ensure_directories, write_json


def main() -> None:
    ensure_directories()
    rows: list[dict[str, object]] = []
    series_count = 0
    for part in range(1, 5):
        payload = json.loads((RAW / f"bls_laus_nc_2013_2022_part{part}.json").read_text(encoding="utf-8"))
        if payload.get("status") != "REQUEST_SUCCEEDED":
            raise AssertionError(f"BLS part {part} did not succeed")
        for series in payload["Results"]["series"]:
            series_count += 1
            series_id = series["seriesID"]
            if len(series_id) != 20 or not series_id.startswith("LAUCN") or not series_id.endswith("03"):
                raise AssertionError(f"Unexpected LAUS series id: {series_id}")
            fips = series_id[5:10]
            for observation in series["data"]:
                if observation["period"] != "M13":
                    continue
                rows.append(
                    {
                        "fips": fips,
                        "year": int(observation["year"]),
                        "unemployment_rate": float(observation["value"]),
                        "footnote": " | ".join(
                            note.get("text", "") for note in observation.get("footnotes", []) if note.get("text")
                        ),
                    }
                )
    frame = pd.DataFrame(rows).sort_values(["fips", "year"])
    if series_count != 100 or len(frame) != 1000 or frame["fips"].nunique() != 100:
        raise AssertionError(
            f"Expected 100 series and 1,000 annual values; got {series_count}, {len(frame)}, {frame['fips'].nunique()}"
        )
    if frame.duplicated(["fips", "year"]).any():
        raise AssertionError("Duplicate LAUS county-years")
    if not frame["year"].between(2013, 2022).all() or not frame["unemployment_rate"].between(0, 100).all():
        raise AssertionError("Invalid LAUS year or unemployment rate")
    frame.to_csv(PROCESSED / "bls_laus_county_year.csv", index=False)
    audit = {
        "series": series_count,
        "annual_rows": int(len(frame)),
        "counties": int(frame["fips"].nunique()),
        "years": [int(frame["year"].min()), int(frame["year"].max())],
        "period_used": "M13 annual average",
        "measure_code": "03 unemployment rate",
    }
    write_json(INTERIM / "bls_audit.json", audit)
    print(json.dumps(audit, indent=2))


if __name__ == "__main__":
    main()

