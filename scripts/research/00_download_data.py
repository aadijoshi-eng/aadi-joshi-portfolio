


from __future__ import annotations

import argparse
import datetime as dt
import json
import urllib.parse
from pathlib import Path

import pandas as pd

from common import DOCS, RAW, download_file, ensure_directories, get_json, post_json, sha256, write_csv, write_json


DOWNLOAD_DATE = dt.date.today().isoformat()

STATIC_SOURCES = [
    {
        "dataset_name": "Census Business Dynamics Statistics - county",
        "institution": "U.S. Census Bureau",
        "url": "https://www2.census.gov/programs-surveys/bds/tables/time-series/2023/bds2023_st_cty.csv",
        "file_name": "bds2023_st_cty.csv",
        "time_coverage": "1978-2023 (analysis uses 2013-2023)",
        "geographic_unit": "county-year",
        "key_variables": "firms, estabs, emp, estabs_entry_rate, estabs_exit_rate",
        "intended_use": "denominators and official county outcomes",
        "known_limitations": "Employer businesses only; disclosure and quality codes appear inline",
        "citation_format": "U.S. Census Bureau, Business Dynamics Statistics, 2023 county time series.",
    },
    {
        "dataset_name": "Census Business Dynamics Statistics - county by coarse firm age",
        "institution": "U.S. Census Bureau",
        "url": "https://www2.census.gov/programs-surveys/bds/tables/time-series/2023/bds2023_st_cty_fac.csv",
        "file_name": "bds2023_st_cty_fac.csv",
        "time_coverage": "1978-2023 (analysis uses 2014-2023)",
        "geographic_unit": "county-year-firm-age category",
        "key_variables": "fagecoarse, firms, estabs, job_creation_births",
        "intended_use": "firm-age-zero employer-startup outcomes",
        "known_limitations": "Employer businesses only; small cells can be disclosure suppressed",
        "citation_format": "U.S. Census Bureau, Business Dynamics Statistics, 2023 county-by-firm-age time series.",
    },
    {
        "dataset_name": "Census Business Dynamics Statistics - state",
        "institution": "U.S. Census Bureau",
        "url": "https://www2.census.gov/programs-surveys/bds/tables/time-series/2023/bds2023_st.csv",
        "file_name": "bds2023_st.csv",
        "time_coverage": "1978-2023 (analysis uses 2013-2023)",
        "geographic_unit": "state-year",
        "key_variables": "estabs, emp, entry and exit measures",
        "intended_use": "statewide descriptive trend denominator",
        "known_limitations": "Employer businesses only",
        "citation_format": "U.S. Census Bureau, Business Dynamics Statistics, 2023 state time series.",
    },
    {
        "dataset_name": "Census Business Dynamics Statistics - state by coarse firm age",
        "institution": "U.S. Census Bureau",
        "url": "https://www2.census.gov/programs-surveys/bds/tables/time-series/2023/bds2023_st_fac.csv",
        "file_name": "bds2023_st_fac.csv",
        "time_coverage": "1978-2023 (analysis uses 2014-2023)",
        "geographic_unit": "state-year-firm-age category",
        "key_variables": "fagecoarse, estabs, job_creation_births",
        "intended_use": "statewide firm-age-zero startup trend",
        "known_limitations": "Employer businesses only",
        "citation_format": "U.S. Census Bureau, Business Dynamics Statistics, 2023 state-by-firm-age time series.",
    },
    {
        "dataset_name": "BDS codebook and glossary",
        "institution": "U.S. Census Bureau",
        "url": "https://www.census.gov/content/dam/Census/programs-surveys/business-dynamics-statistics/codebook-glossary.pdf",
        "file_name": "bds_codebook_glossary.pdf",
        "time_coverage": "2023 release documentation",
        "geographic_unit": "documentation",
        "key_variables": "definitions and disclosure codes",
        "intended_use": "measurement documentation",
        "known_limitations": "Definitions should be checked against the frozen data release",
        "citation_format": "U.S. Census Bureau, Business Dynamics Statistics Codebook and Glossary.",
    },
    {
        "dataset_name": "BEA County Personal Income (CAINC1)",
        "institution": "U.S. Bureau of Economic Analysis",
        "url": "https://apps.bea.gov/regional/zip/CAINC1.zip",
        "file_name": "CAINC1.zip",
        "time_coverage": "Historical through latest release (analysis uses 2012-2022)",
        "geographic_unit": "county-year-line code",
        "key_variables": "population and per-capita personal income",
        "intended_use": "branch-density denominator and lagged controls",
        "known_limitations": "Revised vintage; nominal income used with year fixed effects",
        "citation_format": "U.S. Bureau of Economic Analysis, Regional Data, CAINC1.",
    },
    {
        "dataset_name": "USDA 2013 Rural-Urban Continuum Codes",
        "institution": "USDA Economic Research Service",
        "url": "https://www.ers.usda.gov/media/5769/2013-rural-urban-continuum-codes.xls?v=29951",
        "file_name": "rucc2013.xls",
        "time_coverage": "2013 classification",
        "geographic_unit": "county",
        "key_variables": "RUCC_2013",
        "intended_use": "pre-period metro/nonmetro classification",
        "known_limitations": "Time-invariant classification; criteria differ across vintages",
        "citation_format": "USDA Economic Research Service, 2013 Rural-Urban Continuum Codes.",
    },
    {
        "dataset_name": "USDA 2023 Rural-Urban Continuum Codes",
        "institution": "USDA Economic Research Service",
        "url": "https://www.ers.usda.gov/media/5768/2023-rural-urban-continuum-codes.csv?v=59547",
        "file_name": "rucc2023.csv",
        "time_coverage": "2023 classification",
        "geographic_unit": "county",
        "key_variables": "RUCC_2023",
        "intended_use": "rural-classification robustness",
        "known_limitations": "Urban thresholds and OMB delineations differ from 2013 vintage",
        "citation_format": "USDA Economic Research Service, 2023 Rural-Urban Continuum Codes.",
    },
    {
        "dataset_name": "Census cartographic county boundaries",
        "institution": "U.S. Census Bureau",
        "url": "https://www2.census.gov/geo/tiger/GENZ2023/shp/cb_2023_us_county_500k.zip",
        "file_name": "cb_2023_us_county_500k.zip",
        "time_coverage": "2023 boundaries",
        "geographic_unit": "county geometry",
        "key_variables": "STATEFP, COUNTYFP, GEOID, geometry",
        "intended_use": "North Carolina branch-density-change map",
        "known_limitations": "Generalized boundaries; geometry is descriptive only",
        "citation_format": "U.S. Census Bureau, 2023 Cartographic Boundary Files.",
    },
    {
        "dataset_name": "FDIC SOD variable definitions",
        "institution": "Federal Deposit Insurance Corporation",
        "url": "https://api.fdic.gov/banks/docs/SOD_Variables_and_Definitions.csv",
        "file_name": "SOD_Variables_and_Definitions.csv",
        "time_coverage": "Current API documentation",
        "geographic_unit": "documentation",
        "key_variables": "BRSERTYP, STCNTYBR, DEPSUMBR, CERT, UNINUMBR",
        "intended_use": "banking-variable definitions",
        "known_limitations": "Current documentation can postdate historical records",
        "citation_format": "Federal Deposit Insurance Corporation, Summary of Deposits Variable Definitions.",
    },
]


def acquire_static(force: bool) -> list[Path]:
    files: list[Path] = []
    for source in STATIC_SOURCES:
        destination = RAW / source["file_name"]
        print(f"static: {source['file_name']}")
        download_file(source["url"], destination, force=force)
        files.append(destination)
    return files


def acquire_fdic(force: bool) -> list[Path]:
    endpoint = "https://api.fdic.gov/banks/sod"
    fields = "YEAR,CERT,UNINUMBR,NAMEBR,STCNTYBR,DEPSUMBR,BRSERTYP"
    files: list[Path] = []
    for year in range(2012, 2023):
        destination = RAW / f"fdic_sod_nc_{year}.json"
        if destination.exists() and destination.stat().st_size > 0 and not force:
            files.append(destination)
            continue
        params = {
            "filters": f"STALPBR:NC AND YEAR:{year}",
            "fields": fields,
            "limit": 10000,
            "sort_by": "UNINUMBR",
            "sort_order": "ASC",
            "format": "json",
        }
        payload = get_json(endpoint + "?" + urllib.parse.urlencode(params))
        expected = int(payload["meta"]["total"])
        observed = len(payload.get("data", []))
        if expected != observed:
            raise RuntimeError(f"FDIC {year}: API returned {observed} of {expected} rows")
        write_json(destination, payload)
        files.append(destination)
        print(f"fdic {year}: {observed:,} rows")
    return files


def acquire_bls(force: bool) -> list[Path]:
    county = pd.read_csv(RAW / "bds2023_st_cty.csv", dtype=str, usecols=["st", "cty"])
    fips = sorted((county.loc[(county["st"] == "37") & (county["cty"] != "999"), "st"] + county.loc[(county["st"] == "37") & (county["cty"] != "999"), "cty"]).unique())
    if len(fips) != 100:
        raise RuntimeError(f"Expected 100 NC counties before BLS acquisition, found {len(fips)}")


    series = [f"LAUCN{code}0000000003" for code in fips]
    endpoint = "https://api.bls.gov/publicAPI/v2/timeseries/data/"
    files: list[Path] = []
    for batch_number, start in enumerate(range(0, len(series), 25), start=1):
        destination = RAW / f"bls_laus_nc_2013_2022_part{batch_number}.json"
        if destination.exists() and destination.stat().st_size > 0 and not force:
            existing = json.loads(destination.read_text(encoding="utf-8"))
            existing_series = existing.get("Results", {}).get("series", [])
            if existing_series and all(len(item.get("data", [])) > 0 for item in existing_series):
                files.append(destination)
                continue
        payload = {
            "seriesid": series[start : start + 25],
            "startyear": "2013",
            "endyear": "2022",
            "annualaverage": True,
        }
        response = post_json(endpoint, payload)
        if response.get("status") != "REQUEST_SUCCEEDED":
            raise RuntimeError(f"BLS batch {batch_number} failed: {response.get('message')}")
        returned = response.get("Results", {}).get("series", [])
        empty = [item.get("seriesID") for item in returned if not item.get("data")]
        if len(returned) != len(payload["seriesid"]) or empty:
            raise RuntimeError(
                f"BLS batch {batch_number}: expected {len(payload['seriesid'])} populated "
                f"series, received {len(returned)}; empty={empty}"
            )
        write_json(destination, response)
        files.append(destination)
        print(f"bls batch {batch_number}: {len(response['Results']['series'])} series")
    return files


def build_manifest(all_files: list[Path]) -> None:
    rows = []
    for source in STATIC_SOURCES:
        rows.append({**source, "download_date": DOWNLOAD_DATE, "sha256": sha256(RAW / source["file_name"])})

    rows.extend(
        [
            {
                "dataset_name": "FDIC Summary of Deposits annual API extracts",
                "institution": "Federal Deposit Insurance Corporation",
                "url": "https://api.fdic.gov/banks/sod",
                "file_name": "fdic_sod_nc_2012.json through fdic_sod_nc_2022.json",
                "download_date": DOWNLOAD_DATE,
                "time_coverage": "2012-2022 (2012 auxiliary; main exposures 2013-2022)",
                "geographic_unit": "branch snapshot at June 30",
                "key_variables": "YEAR, CERT, UNINUMBR, STCNTYBR, DEPSUMBR, BRSERTYP",
                "intended_use": "full-service branch counts, density, deposit HHI",
                "known_limitations": "Banks only; excludes credit unions and nonbanks; deposits are office assigned",
                "citation_format": "Federal Deposit Insurance Corporation, Summary of Deposits.",
                "sha256": "See docs/raw_checksums.sha256 for annual files",
            },
            {
                "dataset_name": "BLS Local Area Unemployment Statistics API extracts",
                "institution": "U.S. Bureau of Labor Statistics",
                "url": "https://api.bls.gov/publicAPI/v2/timeseries/data/",
                "file_name": "bls_laus_nc_2013_2022_part1.json through part4.json",
                "download_date": DOWNLOAD_DATE,
                "time_coverage": "2013-2022 annual averages",
                "geographic_unit": "county-year",
                "key_variables": "LAUS annual unemployment rate (measure 03)",
                "intended_use": "predefined lagged control",
                "known_limitations": "Revised data vintage; annual average only",
                "citation_format": "U.S. Bureau of Labor Statistics, Local Area Unemployment Statistics.",
                "sha256": "See docs/raw_checksums.sha256 for API response files",
            },
        ]
    )

    columns = [
        "dataset_name",
        "institution",
        "url",
        "file_name",
        "download_date",
        "time_coverage",
        "geographic_unit",
        "key_variables",
        "intended_use",
        "known_limitations",
        "citation_format",
        "sha256",
    ]
    write_csv(DOCS / "source_manifest.csv", rows, columns)

    checksum_lines = [f"{sha256(path)}  {path.relative_to(RAW.parent.parent)}" for path in sorted(set(all_files))]
    (DOCS / "raw_checksums.sha256").write_text("\n".join(checksum_lines) + "\n", encoding="utf-8")


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--force", action="store_true", help="redownload and replace existing raw files")
    args = parser.parse_args()
    ensure_directories()
    static_files = acquire_static(args.force)
    fdic_files = acquire_fdic(args.force)
    bls_files = acquire_bls(args.force)
    all_files = static_files + fdic_files + bls_files
    build_manifest(all_files)
    print(f"acquisition complete: {len(all_files)} files")


if __name__ == "__main__":
    main()
