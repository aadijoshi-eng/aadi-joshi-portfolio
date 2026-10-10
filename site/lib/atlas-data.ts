import type {
  AtlasPayload,
  AtlasRecord,
  Benchmark,
  BenchmarkYear,
  CountyGeometry,
  GeographyPayload,
  Headline,
  MetricDefinition,
  ModelSummary,
} from "./atlas-types";

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function isString(value: unknown): value is string {
  return typeof value === "string";
}

function isNullableNumber(value: unknown): value is number | null {
  return value === null || isNumber(value);
}

function isArrayOf<T>(value: unknown, check: (item: unknown) => item is T): value is T[] {
  return Array.isArray(value) && value.every(check);
}

function hasFields(
  value: Record<string, unknown>,
  fields: readonly string[],
  check: (item: unknown) => boolean,
): boolean {
  return fields.every((field) => check(value[field]));
}

function isAtlasRecord(value: unknown): value is AtlasRecord {
  return isObject(value)
    && isString(value.fips) && /^37\d{3}$/.test(value.fips)
    && isString(value.name)
    && hasFields(value, [
      "outcomeYear", "exposureYear", "branchCount", "branchDensity",
      "branchChangeOneYear", "branchChangeSince2013", "depositHhi",
      "lagEstabs", "lagEmployment", "population", "rucc2013",
    ], isNumber)
    && hasFields(value, [
      "startupRate", "startupJobs", "officialEntryRate", "age0Estabs", "age0Jobs",
    ], isNullableNumber)
    && typeof value.nonmetro === "boolean"
    && value.classification === (value.nonmetro ? "Nonmetro" : "Metro")
    && (value.startupFlag === null || isString(value.startupFlag));
}

function isBenchmark(value: unknown): value is Benchmark {
  return isObject(value)
    && hasFields(value, [
      "branchCount", "branchDensity", "branchChangeSince2013", "population",
      "counties", "startupCellsAvailable",
    ], isNumber)
    && hasFields(value, ["startupRate", "startupJobs"], isNullableNumber);
}

function isBenchmarkYear(value: unknown): value is BenchmarkYear {
  return isObject(value)
    && isNumber(value.outcomeYear) && isNumber(value.exposureYear)
    && isBenchmark(value.state) && isBenchmark(value.metro) && isBenchmark(value.nonmetro);
}

function isStateYear(value: unknown): value is Benchmark & { outcomeYear: number; exposureYear: number } {
  return isObject(value) && isNumber(value.outcomeYear)
    && isNumber(value.exposureYear) && isBenchmark(value);
}

function isMetricDefinition(value: unknown): value is MetricDefinition {
  return isObject(value)
    && hasFields(value, ["label", "shortLabel", "unit", "timing", "source"], isString)
    && isArrayOf(value.palette, isString) && value.palette.length > 0
    && (value.digits === undefined || (isNumber(value.digits)
      && Number.isInteger(value.digits) && value.digits >= 0 && value.digits <= 20))
    && (value.thresholds === undefined || (isArrayOf(value.thresholds, isNumber)
      && value.thresholds.every((threshold, index, thresholds) => index === 0 || threshold > thresholds[index - 1])
      && value.palette.length === value.thresholds.length + 1))
    && (value.categories === undefined || (isArrayOf(value.categories, isString)
      && value.categories.length === value.palette.length));
}

function isHeadline(value: unknown): value is Headline {
  const fields = [
    "branchCount2013", "branchCount2022", "branchCountPercentChange",
    "branchDensity2013", "branchDensity2022", "branchDensityPercentChange",
    "candidateCountyYears", "usableStartupObservations", "suppressedStartupCells",
    "headlineEstimate", "headlineStdError", "headlineCiLow", "headlineCiHigh",
    "headlinePValue", "headlineN", "headlineClusters", "cleanPreperiodEstimate",
    "cleanPreperiodStdError", "cleanPreperiodCiLow", "cleanPreperiodCiHigh",
    "cleanPreperiodPValue", "cleanPreperiodN", "cleanPreperiodClusters",
  ] satisfies readonly (keyof Headline)[];
  return isObject(value) && hasFields(value, fields, isNumber);
}

function isModelSummary(value: unknown): value is ModelSummary {
  return isObject(value)
    && hasFields(value, ["specId", "label", "effectLabel"], isString)
    && hasFields(value, ["estimate", "stdError", "ciLow", "ciHigh", "pValue", "n", "clusters"], isNumber);
}

function isAtlasMetadata(value: unknown): value is AtlasPayload["metadata"] {
  return isObject(value)
    && hasFields(value, ["title", "version", "yearConvention", "timingNote", "missingPolicy"], isString)
    && isArrayOf(value.outcomeYears, isNumber) && value.outcomeYears.length > 0
    && isArrayOf(value.exposureYears, isNumber)
    && hasFields(value, ["countyCount", "candidateCountyYears", "missingStartupCells"], isNumber);
}

function isModels(value: unknown): value is AtlasPayload["models"] {
  return isObject(value)
    && isModelSummary(value.frozenHeadline) && isModelSummary(value.cleanPreperiod)
    && isModelSummary(value.poisson) && isArrayOf(value.selectedModels, isModelSummary)
    && isString(value.timingConclusion);
}

function isMetrics(value: unknown): value is AtlasPayload["metrics"] {
  return isObject(value)
    && isMetricDefinition(value.branchDensity) && isMetricDefinition(value.branchChange)
    && isMetricDefinition(value.startupRate) && isMetricDefinition(value.startupJobs)
    && isMetricDefinition(value.classification);
}

function isBenchmarks(value: unknown): value is AtlasPayload["benchmarks"] {
  return isObject(value) && Object.values(value).every(isBenchmarkYear);
}

function isAtlasPayload(value: unknown): value is AtlasPayload {
  if (!isObject(value) || !isAtlasMetadata(value.metadata) || !isHeadline(value.headline)
    || !isModels(value.models) || !isMetrics(value.metrics) || !isBenchmarks(value.benchmarks)
    || !isArrayOf(value.stateSeries, isStateYear) || !isArrayOf(value.records, isAtlasRecord)) {
    return false;
  }

  const metadata = value.metadata;
  const benchmarks = value.benchmarks;
  return value.records.length === metadata.candidateCountyYears
    && new Set(value.records.map((record) => record.fips)).size === metadata.countyCount
    && new Set(value.records.map((record) => `${record.fips}-${record.outcomeYear}`)).size === value.records.length
    && value.records.filter((record) => record.startupRate === null).length === metadata.missingStartupCells
    && metadata.outcomeYears.every((year) => isBenchmarkYear(benchmarks[String(year)]))
    && value.records.every((record) => metadata.outcomeYears.includes(record.outcomeYear));
}

function isCoordinate(value: unknown): value is [number, number] {
  return Array.isArray(value) && value.length === 2 && value.every(isNumber);
}

function isCountyGeometry(value: unknown): value is CountyGeometry {
  return isObject(value) && isString(value.fips) && /^37\d{3}$/.test(value.fips)
    && isString(value.name) && isString(value.path)
    && value.path.startsWith("M") && value.path.endsWith("Z") && isCoordinate(value.centroid);
}

function isGeographyPayload(value: unknown): value is GeographyPayload {
  if (!isObject(value) || !isObject(value.metadata)
    || !hasFields(value.metadata, ["source", "stateFips", "viewBox"], isString)
    || !isNumber(value.metadata.countyCount) || !isArrayOf(value.counties, isCountyGeometry)) {
    return false;
  }
  return value.metadata.stateFips === "37"
    && value.counties.length === value.metadata.countyCount
    && value.counties.length > 0
    && new Set(value.counties.map((county) => county.fips)).size === value.counties.length;
}

export function parseAtlasPayload(value: unknown): AtlasPayload {
  if (!isAtlasPayload(value)) throw new Error("The Atlas dataset has an invalid structure");
  return value;
}

export function parseGeographyPayload(value: unknown): GeographyPayload {
  if (!isGeographyPayload(value)) throw new Error("The county map has an invalid structure");
  return value;
}
