"use client";

import { useEffect, useMemo, useState } from "react";
import type { AtlasPayload, AtlasRecord } from "@/site/lib/atlas-types";
import { parseAtlasPayload } from "@/site/lib/atlas-data";

type Point = { x: number; y: number };
type Series = { label: string; color: string; points: Point[] };

const WIDTH = 620;
const HEIGHT = 280;
const MARGIN = { left: 58, right: 18, top: 20, bottom: 40 };

function paddedDomain(values: number[]): [number, number] {
  const minimum = Math.min(...values);
  const maximum = Math.max(...values);
  const padding = Math.max((maximum - minimum) * 0.12, Math.abs(maximum) * 0.03, 0.5);
  return [minimum - padding, maximum + padding];
}

function LineChart({ series, unit, description }: { series: Series[]; unit: string; description: string }) {
  const allPoints = series.flatMap((item) => item.points);
  const [minX, maxX] = [Math.min(...allPoints.map((point) => point.x)), Math.max(...allPoints.map((point) => point.x))];
  const [minY, maxY] = paddedDomain(allPoints.map((point) => point.y));
  const x = (value: number) => MARGIN.left + ((value - minX) / (maxX - minX || 1)) * (WIDTH - MARGIN.left - MARGIN.right);
  const y = (value: number) => HEIGHT - MARGIN.bottom - ((value - minY) / (maxY - minY || 1)) * (HEIGHT - MARGIN.top - MARGIN.bottom);
  const path = (points: Point[]) => points.map((point, index) => `${index === 0 ? "M" : "L"}${x(point.x).toFixed(1)},${y(point.y).toFixed(1)}`).join(" ");

  return (
    <div className="chart-wrap">
      <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} role="img" aria-label={description}>
        {[0, 0.5, 1].map((share) => {
          const value = minY + (maxY - minY) * share;
          return <g key={share}><line x1={MARGIN.left} x2={WIDTH - MARGIN.right} y1={y(value)} y2={y(value)} className="gridline" /><text x={MARGIN.left - 10} y={y(value) + 4} textAnchor="end" className="axis-label">{value.toFixed(value >= 100 ? 0 : 1)}</text></g>;
        })}
        <line x1={MARGIN.left} x2={WIDTH - MARGIN.right} y1={HEIGHT - MARGIN.bottom} y2={HEIGHT - MARGIN.bottom} className="axis-line" />
        <text x={MARGIN.left} y={HEIGHT - 13} className="axis-label">{minX}</text>
        <text x={WIDTH - MARGIN.right} y={HEIGHT - 13} textAnchor="end" className="axis-label">{maxX}</text>
        {series.map((item) => (
          <g key={item.label}>
            <path d={path(item.points)} fill="none" stroke={item.color} strokeWidth="3" />
            {item.points.map((point) => <circle key={`${item.label}-${point.x}`} cx={x(point.x)} cy={y(point.y)} r="3.5" fill={item.color}><title>{item.label}: {point.y.toFixed(2)} in {point.x}</title></circle>)}
          </g>
        ))}
      </svg>
      <div className="chart-legend">
        {series.map((item) => <span key={item.label}><i style={{ background: item.color }} />{item.label}</span>)}
        <span className="chart-unit">{unit}</span>
      </div>
    </div>
  );
}

function ScatterChart({ rows, selectedFips, year }: { rows: AtlasRecord[]; selectedFips: string; year: number }) {
  const available = rows.filter((record) => record.startupRate !== null);
  const [minX, maxX] = paddedDomain(available.map((record) => record.branchDensity));
  const [minY, maxY] = paddedDomain(available.map((record) => record.startupRate as number));
  const x = (value: number) => MARGIN.left + ((value - minX) / (maxX - minX)) * (WIDTH - MARGIN.left - MARGIN.right);
  const y = (value: number) => HEIGHT - MARGIN.bottom - ((value - minY) / (maxY - minY)) * (HEIGHT - MARGIN.top - MARGIN.bottom);
  return (
    <div className="chart-wrap">
      <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} role="img" aria-label={`Scatterplot of branch density and employer-startup rates for North Carolina counties in outcome year ${year}`}>
        {[0, 0.5, 1].map((share) => {
          const value = minY + (maxY - minY) * share;
          return <g key={share}><line x1={MARGIN.left} x2={WIDTH - MARGIN.right} y1={y(value)} y2={y(value)} className="gridline" /><text x={MARGIN.left - 10} y={y(value) + 4} textAnchor="end" className="axis-label">{value.toFixed(0)}</text></g>;
        })}
        <line x1={MARGIN.left} x2={WIDTH - MARGIN.right} y1={HEIGHT - MARGIN.bottom} y2={HEIGHT - MARGIN.bottom} className="axis-line" />
        {available.map((record) => {
          const selected = record.fips === selectedFips;
          return <circle key={record.fips} cx={x(record.branchDensity)} cy={y(record.startupRate as number)} r={selected ? 7 : 4} fill={selected ? "#c46f43" : record.nonmetro ? "#d7a244" : "#2d7477"} opacity={selected ? 1 : 0.7} stroke={selected ? "#102b37" : "none"} strokeWidth="2"><title>{record.name}: {record.branchDensity.toFixed(2)} branches per 10,000; startup rate {(record.startupRate as number).toFixed(1)}</title></circle>;
        })}
        <text x={MARGIN.left} y={HEIGHT - 13} className="axis-label">{minX.toFixed(1)}</text>
        <text x={WIDTH - MARGIN.right} y={HEIGHT - 13} textAnchor="end" className="axis-label">{maxX.toFixed(1)} branches per 10,000</text>
      </svg>
      <div className="chart-legend"><span><i style={{ background: "#2d7477" }} />Metro</span><span><i style={{ background: "#d7a244" }} />Nonmetro</span><span><i style={{ background: "#c46f43" }} />Selected county</span></div>
    </div>
  );
}

function DistributionStrip({ rows, selectedFips, year }: { rows: AtlasRecord[]; selectedFips: string; year: number }) {
  const values = rows.map((record) => record.branchDensity);
  const [min, max] = paddedDomain(values);
  const x = (value: number) => 32 + ((value - min) / (max - min)) * (WIDTH - 64);
  const median = [...values].sort((a, b) => a - b)[Math.floor(values.length / 2)];
  return (
    <div className="chart-wrap compact-chart">
      <svg viewBox={`0 0 ${WIDTH} 120`} role="img" aria-label={`Distribution of branch density across counties in the June snapshot labeled ${year - 1}`}>
        <line x1="32" x2={WIDTH - 32} y1="62" y2="62" className="axis-line" />
        <line x1={x(median)} x2={x(median)} y1="24" y2="94" stroke="#647278" strokeDasharray="4 4" />
        {rows.map((record, index) => <circle key={record.fips} cx={x(record.branchDensity)} cy={48 + (index % 4) * 9} r={record.fips === selectedFips ? 7 : 3.5} fill={record.fips === selectedFips ? "#c46f43" : "#2d7477"} opacity={record.fips === selectedFips ? 1 : 0.55}><title>{record.name}: {record.branchDensity.toFixed(2)}</title></circle>)}
        <text x="32" y="112" className="axis-label">{Math.max(0, min).toFixed(1)}</text>
        <text x={x(median)} y="16" textAnchor="middle" className="axis-label">County median {median.toFixed(2)}</text>
        <text x={WIDTH - 32} y="112" textAnchor="end" className="axis-label">{max.toFixed(1)}</text>
      </svg>
    </div>
  );
}

export function TrendExplorer() {
  const [atlas, setAtlas] = useState<AtlasPayload | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [year, setYear] = useState(2023);
  const [selectedFips, setSelectedFips] = useState("37183");

  useEffect(() => {
    const controller = new AbortController();
    fetch(`${process.env.NEXT_PUBLIC_BASE_PATH || ""}/data/atlas.json`, { signal: controller.signal })
      .then(async (response) => {
        if (!response.ok) throw new Error("Trend data could not be loaded");
        const payload: unknown = await response.json();
        return parseAtlasPayload(payload);
      })
      .then((payload) => {
        if (!controller.signal.aborted) setAtlas(payload);
      })
      .catch((reason: unknown) => {
        if (!controller.signal.aborted) setError(reason instanceof Error ? reason.message : "Trend data are unavailable");
      });
    return () => controller.abort();
  }, []);

  const countyChoices = useMemo(
    () => atlas ? Array.from(new Map<string, string>(atlas.records.map((record) => [record.fips, record.name]))).sort((a, b) => a[1].localeCompare(b[1])) : [],
    [atlas],
  );

  if (error) return <div className="unavailable-state" role="status"><h2>Trend data unavailable</h2><p>{error}. No sample series are being shown in its place.</p></div>;
  if (!atlas) return <div className="loading-state" role="status">Loading verified trend data…</div>;

  const yearRows = atlas.records.filter((record) => record.outcomeYear === year);
  const selectedSeries = atlas.records.filter((record) => record.fips === selectedFips);
  const selectedName = selectedSeries[0]?.name ?? "Selected county";
  const metroSeries = atlas.metadata.outcomeYears.map((outcomeYear) => ({ x: outcomeYear, y: atlas.benchmarks[String(outcomeYear)].metro.startupRate ?? 0 }));
  const nonmetroSeries = atlas.metadata.outcomeYears.map((outcomeYear) => ({ x: outcomeYear, y: atlas.benchmarks[String(outcomeYear)].nonmetro.startupRate ?? 0 }));

  return (
    <div className="trend-explorer">
      <div className="trend-controls">
        <div className="control-field"><label htmlFor="trend-year">Scatterplot year</label><select id="trend-year" value={year} onChange={(event) => setYear(Number(event.target.value))}>{atlas.metadata.outcomeYears.map((option) => <option key={option}>{option}</option>)}</select></div>
        <div className="control-field"><label htmlFor="trend-county">Highlighted county</label><select id="trend-county" value={selectedFips} onChange={(event) => setSelectedFips(event.target.value)}>{countyChoices.map(([fips, name]) => <option key={fips} value={fips}>{name} County</option>)}</select></div>
        <a href={`${process.env.NEXT_PUBLIC_BASE_PATH || ""}/downloads/atlas_county_year.csv`}>Download all chart data (.csv)</a>
      </div>

      <section className="chart-section">
        <div className="chart-heading"><div><p className="eyebrow">Statewide description</p><h2>Two trends, two different units</h2></div><p>These lines are displayed separately to avoid a misleading dual axis. State startup rates come from the Census BDS state aggregate.</p></div>
        <div className="chart-grid">
          <article className="chart-card"><h3>Full-service branch count</h3><p>June 30 snapshots, 2013-2022</p><LineChart series={[{ label: "Branches", color: "#2d7477", points: atlas.stateSeries.map((item) => ({ x: item.exposureYear, y: item.branchCount })) }]} unit="branch offices" description="Statewide full-service bank branch count fell from 2013 to 2022" /></article>
          <article className="chart-card"><h3>Employer-startup rate</h3><p>Outcome years 2014-2023</p><LineChart series={[{ label: "Startup rate", color: "#c46f43", points: atlas.stateSeries.map((item) => ({ x: item.outcomeYear, y: item.startupRate ?? 0 })) }]} unit="per 1,000 lagged active establishments" description="Statewide employer-startup rate from 2014 to 2023" /></article>
        </div>
        <p className="chart-interpretation"><strong>Interpretation:</strong> the series do not co-move in a simple way. A statewide visual trend cannot identify the local effect of a branch change.</p>
      </section>

      <section className="chart-section">
        <div className="chart-heading"><div><p className="eyebrow">Cross-section</p><h2>Density versus startup activity</h2></div><p>Each dot is one county in BDS label year {year}; banking density uses the June snapshot labeled {year - 1}, which falls inside the March-to-March BDS interval. The highlighted county is {selectedName}.</p></div>
        <div className="chart-grid split-emphasis">
          <article className="chart-card wide"><h3>County scatterplot</h3><p>No fitted line is shown because the paper’s estimate comes from within-county fixed-effects variation, not this cross-section.</p><ScatterChart rows={yearRows} selectedFips={selectedFips} year={year} /></article>
          <article className="chart-card"><h3>Branch-density distribution</h3><p>Dots show the distribution without labeling it a performance ranking.</p><DistributionStrip rows={yearRows} selectedFips={selectedFips} year={year} /></article>
        </div>
      </section>

      <section className="chart-section">
        <div className="chart-heading"><div><p className="eyebrow">Comparisons</p><h2>Metro, nonmetro, and selected-county views</h2></div><p>2013 USDA RUCC status is fixed across the panel. Group aggregates use disclosed county cells.</p></div>
        <div className="chart-grid">
          <article className="chart-card"><h3>Metro versus nonmetro startup rates</h3><p>Aggregated from disclosed county-year cells</p><LineChart series={[{ label: "Metro", color: "#2d7477", points: metroSeries }, { label: "Nonmetro", color: "#d7a244", points: nonmetroSeries }]} unit="per 1,000 lagged active establishments" description="Metro and nonmetro employer-startup rates across outcome years" /></article>
          <article className="chart-card"><h3>{selectedName} County branch density</h3><p>June snapshot labels 2013-2022</p><LineChart series={[{ label: selectedName, color: "#c46f43", points: selectedSeries.map((record) => ({ x: record.exposureYear, y: record.branchDensity })) }]} unit="branches per 10,000 residents" description={`${selectedName} County branch density across the June snapshot period`} /></article>
        </div>
      </section>

      <div className="chart-source-note"><strong>Sources:</strong> FDIC Summary of Deposits, Census Business Dynamics Statistics, BEA CAINC1, and USDA RUCC. Definitions and missing-data rules appear on the Data and Methodology pages.</div>
    </div>
  );
}
