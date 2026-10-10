import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const atlas = JSON.parse(await readFile(new URL("../public/data/atlas.json", import.meta.url), "utf8"));
const geography = JSON.parse(await readFile(new URL("../public/data/nc_counties.json", import.meta.url), "utf8"));

test("atlas preserves the audited panel dimensions and missingness", () => {
  assert.equal(atlas.records.length, 1000);
  assert.equal(new Set(atlas.records.map((row) => row.fips)).size, 100);
  assert.deepEqual(atlas.metadata.outcomeYears, [2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023]);
  assert.equal(new Set(atlas.records.map((row) => `${row.fips}-${row.outcomeYear}`)).size, 1000);
  assert.equal(atlas.records.filter((row) => row.startupRate === null).length, 5);
  assert.ok(atlas.records.every((row) => /^37\d{3}$/.test(row.fips)));
});

test("headline outputs match the verified research files", () => {
  assert.equal(atlas.headline.branchCount2013, 2554);
  assert.equal(atlas.headline.branchCount2022, 1998);
  assert.equal(atlas.headline.headlineEstimate, -1.822803);
  assert.equal(atlas.headline.headlineStdError, 1.809045);
  assert.equal(atlas.headline.headlineN, 995);
  assert.equal(atlas.headline.headlineClusters, 100);
  assert.equal(atlas.headline.cleanPreperiodEstimate, 2.027805);
  assert.equal(atlas.headline.cleanPreperiodStdError, 1.719083);
  assert.equal(atlas.headline.cleanPreperiodCiLow, -1.383228);
  assert.equal(atlas.headline.cleanPreperiodCiHigh, 5.438838);
  assert.equal(atlas.headline.cleanPreperiodPValue, 0.240992);
  assert.equal(atlas.headline.cleanPreperiodN, 895);
  assert.equal(atlas.headline.cleanPreperiodClusters, 100);
  assert.equal(atlas.models.cleanPreperiod.specId, "A4");
  assert.match(atlas.metadata.yearConvention, /March/);
  assert.match(atlas.metadata.yearConvention, /inside/i);
  assert.match(atlas.metadata.timingNote, /precede/i);
});

test("the exact Census disclosure-suppressed cells remain missing", () => {
  const missing = atlas.records
    .filter((row) => row.startupRate === null)
    .map((row) => `${row.fips}-${row.outcomeYear}`)
    .sort();
  assert.deepEqual(missing, [
    "37029-2019",
    "37177-2015",
    "37177-2017",
    "37177-2021",
    "37177-2023",
  ]);
  assert.ok(atlas.records.filter((row) => row.startupRate === null).every((row) => row.startupFlag === "D"));
});

test("every analytical county has exactly one map geometry", () => {
  assert.equal(geography.counties.length, 100);
  assert.equal(new Set(geography.counties.map((county) => county.fips)).size, 100);
  assert.deepEqual(
    [...new Set(atlas.records.map((row) => row.fips))].sort(),
    geography.counties.map((county) => county.fips).sort(),
  );
  assert.ok(geography.counties.every((county) => county.path.startsWith("M") && county.path.endsWith("Z")));
});

test("required public downloads are present and nonempty", async () => {
  const downloads = [
    "atlas_county_year.csv",
    "state_group_benchmarks.csv",
    "SOURCE_MANIFEST.csv",
    "working_paper.pdf",
    "nc_policy_brief.pdf",
    "presentation_outline.pdf",
    "working_paper_overleaf_import.zip",
  ];
  for (const file of downloads) {
    const bytes = await readFile(new URL(`../public/downloads/${file}`, import.meta.url));
    assert.ok(bytes.length > 100, `${file} should not be empty`);
    if (file.endsWith(".pdf")) assert.equal(bytes.subarray(0, 4).toString(), "%PDF");
  }
});
