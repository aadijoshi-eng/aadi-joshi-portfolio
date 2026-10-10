export type MetricKey = "branchDensity" | "branchChange" | "startupRate" | "startupJobs" | "classification";

export type AtlasRecord = {
  fips: string;
  name: string;
  outcomeYear: number;
  exposureYear: number;
  branchCount: number;
  branchDensity: number;
  branchChangeOneYear: number;
  branchChangeSince2013: number;
  startupRate: number | null;
  startupJobs: number | null;
  officialEntryRate: number | null;
  depositHhi: number;
  age0Estabs: number | null;
  age0Jobs: number | null;
  lagEstabs: number;
  lagEmployment: number;
  population: number;
  nonmetro: boolean;
  classification: "Metro" | "Nonmetro";
  rucc2013: number;
  startupFlag: string | null;
};

export type MetricDefinition = {
  label: string;
  shortLabel: string;
  unit: string;
  timing: string;
  source: string;
  digits?: number;
  thresholds?: number[];
  palette: string[];
  categories?: string[];
};

export type Benchmark = {
  branchCount: number;
  branchDensity: number;
  branchChangeSince2013: number;
  startupRate: number | null;
  startupJobs: number | null;
  population: number;
  counties: number;
  startupCellsAvailable: number;
};

export type BenchmarkYear = {
  outcomeYear: number;
  exposureYear: number;
  state: Benchmark;
  metro: Benchmark;
  nonmetro: Benchmark;
};

export type Headline = {
  branchCount2013: number;
  branchCount2022: number;
  branchCountPercentChange: number;
  branchDensity2013: number;
  branchDensity2022: number;
  branchDensityPercentChange: number;
  candidateCountyYears: number;
  usableStartupObservations: number;
  suppressedStartupCells: number;
  headlineEstimate: number;
  headlineStdError: number;
  headlineCiLow: number;
  headlineCiHigh: number;
  headlinePValue: number;
  headlineN: number;
  headlineClusters: number;
  cleanPreperiodEstimate: number;
  cleanPreperiodStdError: number;
  cleanPreperiodCiLow: number;
  cleanPreperiodCiHigh: number;
  cleanPreperiodPValue: number;
  cleanPreperiodN: number;
  cleanPreperiodClusters: number;
};

export type ModelSummary = {
  specId: string;
  label: string;
  effectLabel: string;
  estimate: number;
  stdError: number;
  ciLow: number;
  ciHigh: number;
  pValue: number;
  n: number;
  clusters: number;
};

export type AtlasPayload = {
  metadata: {
    title: string;
    version: string;
    outcomeYears: number[];
    exposureYears: number[];
    countyCount: number;
    candidateCountyYears: number;
    missingStartupCells: number;
    yearConvention: string;
    timingNote: string;
    missingPolicy: string;
  };
  headline: Headline;
  models: {
    frozenHeadline: ModelSummary;
    cleanPreperiod: ModelSummary;
    poisson: ModelSummary;
    selectedModels: ModelSummary[];
    timingConclusion: string;
  };
  metrics: Record<MetricKey, MetricDefinition>;
  benchmarks: Record<string, BenchmarkYear>;
  stateSeries: Array<Benchmark & { outcomeYear: number; exposureYear: number }>;
  records: AtlasRecord[];
};

export type CountyGeometry = {
  fips: string;
  name: string;
  path: string;
  centroid: [number, number];
};

export type GeographyPayload = {
  metadata: {
    source: string;
    stateFips: string;
    countyCount: number;
    viewBox: string;
  };
  counties: CountyGeometry[];
};
