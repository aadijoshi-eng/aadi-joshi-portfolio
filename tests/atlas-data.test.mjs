import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { parseAtlasPayload, parseGeographyPayload } from "../site/lib/atlas-data.ts";

const atlas = JSON.parse(await readFile(new URL("../public/data/atlas.json", import.meta.url), "utf8"));
const geography = JSON.parse(await readFile(new URL("../public/data/nc_counties.json", import.meta.url), "utf8"));

test("the public Atlas and county map satisfy their data contracts", () => {
  assert.equal(parseAtlasPayload(atlas), atlas);
  assert.equal(parseGeographyPayload(geography), geography);
});

test("invalid numeric values and missing benchmarks are rejected", () => {
  const nonnumeric = structuredClone(atlas);
  nonnumeric.records[0].branchDensity = "2.6";
  assert.throws(() => parseAtlasPayload(nonnumeric), /invalid structure/);

  const nonfinite = structuredClone(atlas);
  nonfinite.headline.headlineEstimate = Infinity;
  assert.throws(() => parseAtlasPayload(nonfinite), /invalid structure/);

  const missingYear = structuredClone(atlas);
  delete missingYear.benchmarks["2023"];
  assert.throws(() => parseAtlasPayload(missingYear), /invalid structure/);
});

test("duplicate county-year keys and altered disclosure cells are rejected", () => {
  const duplicate = structuredClone(atlas);
  duplicate.records[1] = structuredClone(duplicate.records[0]);
  assert.throws(() => parseAtlasPayload(duplicate), /invalid structure/);

  const changedMissingness = structuredClone(atlas);
  const suppressed = changedMissingness.records.find((record) => record.startupRate === null);
  assert.ok(suppressed);
  suppressed.startupRate = 0;
  assert.throws(() => parseAtlasPayload(changedMissingness), /invalid structure/);
});

test("invalid centroids and duplicate map counties are rejected", () => {
  const badCentroid = structuredClone(geography);
  badCentroid.counties[0].centroid = [120];
  assert.throws(() => parseGeographyPayload(badCentroid), /invalid structure/);

  const duplicate = structuredClone(geography);
  duplicate.counties[1] = structuredClone(duplicate.counties[0]);
  assert.throws(() => parseGeographyPayload(duplicate), /invalid structure/);
});
