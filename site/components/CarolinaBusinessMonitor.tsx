"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { CarolinaBusinessMonitorEntry, MonitorRegion, MonitorStage } from "@/site/lib/carolina-business-monitor";

const regionFilters: Array<MonitorRegion | "All regions"> = ["All regions", "Charlotte", "Triangle", "Triad", "Piedmont", "Sandhills"];
const stageFilters: Array<MonitorStage | "All stages"> = ["All stages", "Completed", "Operating milestone", "Under construction", "Groundbreaking", "Permit review", "Announced"];

export function CarolinaBusinessMonitor({ entries }: { entries: CarolinaBusinessMonitorEntry[] }) {
  const [region, setRegion] = useState<(typeof regionFilters)[number]>("All regions");
  const [stage, setStage] = useState<(typeof stageFilters)[number]>("All stages");

  const visibleEntries = useMemo(() => entries.filter((entry) => {
    const regionMatch = region === "All regions" || entry.region === region;
    const stageMatch = stage === "All stages" || entry.stage === stage;
    return regionMatch && stageMatch;
  }), [entries, region, stage]);

  return (
    <div className="business-monitor">
      <div className="monitor-controls" aria-label="Filter monitored developments">
        <label>
          <span>Region</span>
          <select value={region} onChange={(event) => setRegion(event.target.value as (typeof regionFilters)[number])}>
            {regionFilters.map((item) => <option key={item}>{item}</option>)}
          </select>
        </label>
        <label>
          <span>Evidence stage</span>
          <select value={stage} onChange={(event) => setStage(event.target.value as (typeof stageFilters)[number])}>
            {stageFilters.map((item) => <option key={item}>{item}</option>)}
          </select>
        </label>
        <p><strong>{visibleEntries.length}</strong> of {entries.length} developments shown</p>
      </div>

      <div className="monitor-list">
        {visibleEntries.map((entry) => (
          <article className="monitor-card" key={entry.id}>
            <header className="monitor-card-header">
              <div>
                <p className="monitor-location">{entry.region} · {entry.location}</p>
                <h3>{entry.company}</h3>
                <p>{entry.project}</p>
              </div>
              <span className={`monitor-status status-${entry.stage.toLowerCase().replaceAll(" ", "-")}`}>{entry.stage}</span>
            </header>

            <dl className="monitor-facts">
              <div><dt>Scale</dt><dd>{entry.headlineScale}</dd></div>
              <div><dt>Sector</dt><dd>{entry.sector}</dd></div>
              <div><dt>Event</dt><dd>{entry.eventType}</dd></div>
              <div><dt>Public support</dt><dd>{entry.publicSupport}</dd></div>
            </dl>

            <div className="monitor-evidence-grid">
              <section>
                <span>Verified now</span>
                <p>{entry.verifiedNow}</p>
              </section>
              <section>
                <span>Announcement / promise</span>
                <p>{entry.announcedPromise}</p>
              </section>
              <section>
                <span>Next checkpoint</span>
                <p>{entry.nextCheckpoint}</p>
              </section>
            </div>

            {entry.uncertainty && <p className="monitor-caveat"><strong>Uncertainty:</strong> {entry.uncertainty}</p>}

            <footer className="monitor-card-footer">
              <div>
                <span>Last verified {entry.lastVerified}</span>
                <span>{entry.sources.length} linked primary sources</span>
              </div>
              <div className="monitor-links">
                <Link href={entry.articleHref}>Read the brief →</Link>
                {entry.sources.map((source) => (
                  <a href={source.url} key={source.url} rel="noreferrer" target="_blank">{source.kind}: {source.label} ↗</a>
                ))}
              </div>
            </footer>
          </article>
        ))}
      </div>

      {visibleEntries.length === 0 && <p className="monitor-empty">No developments match both filters.</p>}
    </div>
  );
}
