"use client";

import { useEffect, useMemo, useState } from "react";
import type { AtlasPayload, AtlasRecord, Benchmark, GeographyPayload, MetricKey } from "@/site/lib/atlas-types";
import { parseAtlasPayload, parseGeographyPayload } from "@/site/lib/atlas-data";

const DEFAULT_YEAR = 2023;
const DEFAULT_METRIC: MetricKey = "branchDensity";
const DEFAULT_COUNTY = "37183";

const metricOptions: Array<{ key: MetricKey; label: string }> = [
  { key: "branchDensity", label: "Full-service branch density" },
  { key: "branchChange", label: "Density change since 2013" },
  { key: "startupRate", label: "Employer-startup rate" },
  { key: "startupJobs", label: "Startup-job intensity" },
  { key: "classification", label: "2013 metro/nonmetro" },
];

function recordValue(record: AtlasRecord, metric: MetricKey): number | string | null {
  if (metric === "branchDensity") return record.branchDensity;
  if (metric === "branchChange") return record.branchChangeSince2013;
  if (metric === "startupRate") return record.startupRate;
  if (metric === "startupJobs") return record.startupJobs;
  return record.classification;
}

function benchmarkValue(benchmark: Benchmark, metric: MetricKey): number | null {
  if (metric === "branchDensity") return benchmark.branchDensity;
  if (metric === "branchChange") return benchmark.branchChangeSince2013;
  if (metric === "startupRate") return benchmark.startupRate;
  if (metric === "startupJobs") return benchmark.startupJobs;
  return null;
}

function formatValue(value: number | string | null, metric: MetricKey, digits = 1): string {
  if (value === null) return "Not available";
  if (typeof value === "string") return value;
  const sign = metric === "branchChange" && value > 0 ? "+" : "";
  return `${sign}${value.toLocaleString("en-US", { maximumFractionDigits: digits, minimumFractionDigits: digits })}`;
}

function legendLabels(thresholds: number[], digits: number): string[] {
  const format = (value: number) => value.toLocaleString("en-US", { maximumFractionDigits: digits });
  return thresholds.map((threshold, index) => {
    if (index === 0) return `≤ ${format(threshold)}`;
    return `${format(thresholds[index - 1])}-${format(threshold)}`;
  }).concat(`> ${format(thresholds[thresholds.length - 1])}`);
}

export function CountyAtlas() {
  const [atlas, setAtlas] = useState<AtlasPayload | null>(null);
  const [geography, setGeography] = useState<GeographyPayload | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [year, setYear] = useState(DEFAULT_YEAR);
  const [metric, setMetric] = useState<MetricKey>(DEFAULT_METRIC);
  const [selectedFips, setSelectedFips] = useState(DEFAULT_COUNTY);

  useEffect(() => {
    const controller = new AbortController();
    Promise.all([
      fetch(`${process.env.NEXT_PUBLIC_BASE_PATH || ""}/data/atlas.json`, { signal: controller.signal }).then(async (response) => {
        if (!response.ok) throw new Error("Atlas data could not be loaded");
        const payload: unknown = await response.json();
        return parseAtlasPayload(payload);
      }),
      fetch(`${process.env.NEXT_PUBLIC_BASE_PATH || ""}/data/nc_counties.json`, { signal: controller.signal }).then(async (response) => {
        if (!response.ok) throw new Error("County geography could not be loaded");
        const payload: unknown = await response.json();
        return parseGeographyPayload(payload);
      }),
    ]).then(([atlasPayload, geographyPayload]) => {
      if (controller.signal.aborted) return;
      setAtlas(atlasPayload);
      setGeography(geographyPayload);
    }).catch((reason: unknown) => {
      if (controller.signal.aborted) return;
      setError(reason instanceof Error ? reason.message : "The Atlas is temporarily unavailable");
    });
    return () => controller.abort();
  }, []);

  const yearRows = useMemo(
    () => atlas?.records.filter((record) => record.outcomeYear === year) ?? [],
    [atlas, year],
  );
  const recordMap = useMemo(() => new Map<string, AtlasRecord>(yearRows.map((record) => [record.fips, record])), [yearRows]);
  const selected = recordMap.get(selectedFips) ?? null;
  const countyChoices = useMemo(
    () => (atlas ? Array.from(new Map<string, string>(atlas.records.map((record) => [record.fips, record.name]))).sort((a, b) => a[1].localeCompare(b[1])) : []),
    [atlas],
  );

  if (error) {
    return (
      <div className="unavailable-state" role="status">
        <p className="eyebrow">Unavailable-data state</p>
        <h2>The county layer could not be loaded.</h2>
        <p>{error}. No illustrative values are being substituted. The processed CSV remains available from the Data page.</p>
      </div>
    );
  }

  if (!atlas || !geography) {
    return <div className="loading-state" role="status">Loading verified county data…</div>;
  }

  const definition = atlas.metrics[metric];
  const thresholds = definition.thresholds ?? [];
  const labels = metric === "classification"
    ? definition.categories ?? []
    : legendLabels(thresholds, definition.digits ?? 1);
  const benchmarkYear = atlas.benchmarks[String(year)];

  const fillFor = (record: AtlasRecord | undefined): string => {
    if (!record) return "url(#missing-hatch)";
    if (metric === "classification") return definition.palette[record.nonmetro ? 1 : 0];
    const value = recordValue(record, metric);
    if (typeof value !== "number") return "url(#missing-hatch)";
    const index = thresholds.findIndex((threshold) => value <= threshold);
    return definition.palette[index === -1 ? definition.palette.length - 1 : index];
  };

  const reset = () => {
    setYear(DEFAULT_YEAR);
    setMetric(DEFAULT_METRIC);
    setSelectedFips(DEFAULT_COUNTY);
  };

  const selectedValue = selected ? recordValue(selected, metric) : null;
  const groupKey = selected?.nonmetro ? "nonmetro" : "metro";
  const stateValue = benchmarkValue(benchmarkYear.state, metric);
  const groupValue = benchmarkValue(benchmarkYear[groupKey], metric);

  return (
    <section className="atlas-interface" aria-label="Interactive North Carolina county atlas">
      <div className="atlas-controls">
        <div className="control-field">
          <label htmlFor="atlas-year">Outcome year</label>
          <select id="atlas-year" value={year} onChange={(event) => setYear(Number(event.target.value))}>
            {atlas.metadata.outcomeYears.map((option) => <option key={option} value={option}>{option}</option>)}
          </select>
        </div>
        <div className="control-field metric-control">
          <label htmlFor="atlas-metric">Map measure</label>
          <select id="atlas-metric" value={metric} onChange={(event) => {
            const option = metricOptions.find((item) => item.key === event.target.value);
            if (option) setMetric(option.key);
          }}>
            {metricOptions.map((option) => <option key={option.key} value={option.key}>{option.label}</option>)}
          </select>
        </div>
        <div className="control-field">
          <label htmlFor="atlas-county">County</label>
          <select id="atlas-county" value={selectedFips} onChange={(event) => setSelectedFips(event.target.value)}>
            {countyChoices.map(([fips, name]) => <option key={fips} value={fips}>{name} County</option>)}
          </select>
        </div>
        <button className="reset-button" type="button" onClick={reset}>Reset view</button>
      </div>

      <div className="atlas-year-note">
        <span>Selected outcome year: <strong>{year}</strong></span>
        <span>Banking snapshot label: <strong>{year - 1}</strong></span>
        <span>100 counties</span>
      </div>

      <div className="atlas-grid">
        <figure className="map-panel">
          <div className="map-title-row">
            <div>
              <p className="eyebrow">County map</p>
              <h2>{definition.label}</h2>
            </div>
            <p>{definition.unit}</p>
          </div>
          <svg className="county-map" viewBox={geography.metadata.viewBox} role="img" aria-labelledby="map-title map-desc">
            <title id="map-title">{definition.label} across North Carolina counties</title>
            <desc id="map-desc">Select a county path to update the detail panel. Missing disclosure-protected data appear hatched.</desc>
            <defs>
              <pattern id="missing-hatch" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                <rect width="8" height="8" fill="#ebe6da" />
                <line x1="0" y1="0" x2="0" y2="8" stroke="#8d928f" strokeWidth="2" />
              </pattern>
            </defs>
            {geography.counties.map((county) => {
              const record = recordMap.get(county.fips);
              const value = record ? recordValue(record, metric) : null;
              const isSelected = county.fips === selectedFips;
              return (
                <path
                  key={county.fips}
                  d={county.path}
                  fill={fillFor(record)}
                  className={isSelected ? "county-shape selected" : "county-shape"}
                  role="button"
                  tabIndex={0}
                  aria-pressed={isSelected}
                  aria-label={`${county.name} County: ${formatValue(value, metric, definition.digits ?? 1)} ${typeof value === "number" ? definition.unit : ""}`}
                  onClick={() => setSelectedFips(county.fips)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      setSelectedFips(county.fips);
                    }
                  }}
                />
              );
            })}
          </svg>
          <div className="map-legend" aria-label="Map legend">
            {definition.palette.map((color, index) => (
              <span key={`${color}-${index}`}><i style={{ background: color }} />{labels[index]}</span>
            ))}
            {metric === "startupRate" || metric === "startupJobs" ? <span><i className="missing-swatch" />Suppressed / unavailable</span> : null}
          </div>
          <figcaption>
            <strong>Source:</strong> {definition.source}. {definition.timing}. County boundaries: U.S. Census Bureau, 2023 cartographic file.
          </figcaption>
        </figure>

        <aside className="county-detail" aria-live="polite">
          {selected ? (
            <>
              <p className="eyebrow">Selected county</p>
              <div className="county-name-row">
                <div><h2>{selected.name}</h2><p>FIPS {selected.fips} · RUCC {selected.rucc2013} · {selected.classification}</p></div>
                <span>{year}</span>
              </div>

              <div className="primary-readout">
                <span>{definition.shortLabel}</span>
                <strong>{formatValue(selectedValue, metric, definition.digits ?? 1)}</strong>
                <small>{typeof selectedValue === "number" ? definition.unit : selected.startupFlag === "D" ? "Disclosure-suppressed by Census BDS" : definition.unit}</small>
              </div>

              {metric !== "classification" ? (
                <div className="comparison-readouts">
                  <div><span>State benchmark</span><strong>{formatValue(stateValue, metric, definition.digits ?? 1)}</strong></div>
                  <div><span>{selected.classification} benchmark</span><strong>{formatValue(groupValue, metric, definition.digits ?? 1)}</strong></div>
                </div>
              ) : (
                <p className="classification-note">Metro status is fixed using the 2013 USDA Rural-Urban Continuum Codes. It is a broad county classification, not a measure of remoteness or service access.</p>
              )}

              <dl className="county-facts">
                <div><dt>Full-service branches</dt><dd>{selected.branchCount.toLocaleString()} in June snapshot label {selected.exposureYear}</dd></div>
                <div><dt>Branch density</dt><dd>{selected.branchDensity.toFixed(2)} per 10,000</dd></div>
                <div><dt>Employer-startup rate</dt><dd>{selected.startupRate === null ? "Suppressed" : selected.startupRate.toFixed(1)}</dd></div>
                <div><dt>Population denominator</dt><dd>{selected.population.toLocaleString()}</dd></div>
              </dl>

              <div className="definition-note">
                <strong>Interpret with care</strong>
                <p>Branch density is not distance, travel time, digital access, service quality, or local credit supply. The county value is descriptive and does not estimate a branch effect.</p>
              </div>
            </>
          ) : <p>Select a county to view its record.</p>}
        </aside>
      </div>

      <div className="atlas-footnotes">
        <p><strong>Denominator and timing:</strong> employer-startup rate = firm-age-zero establishments ÷ lagged active establishments × 1,000. BDS label year t spans March t−1 to March t, so the displayed June t−1 banking snapshot falls inside that interval.</p>
        <p><strong>Missingness:</strong> five county-year startup cells are Census disclosure-suppressed and remain missing, not zero.</p>
        <a href={`${process.env.NEXT_PUBLIC_BASE_PATH || ""}/downloads/atlas_county_year.csv`}>Download the county-year data (.csv)</a>
      </div>
    </section>
  );
}
