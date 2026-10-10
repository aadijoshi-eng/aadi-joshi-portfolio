"use client";

import { useMemo, useState } from "react";
import type { SignalState } from "@/site/lib/corporate-signals";
import { corporateSignalCompanies, signalDimensions } from "@/site/lib/corporate-signals";

type SignalKey = (typeof signalDimensions)[number]["key"];

const stateCopy: Record<SignalState, string> = {
  green: "Documented positive",
  amber: "Needs monitoring",
  red: "Elevated pressure",
  gray: "No call assigned",
};

const watchFilters = ["All", "Lower pressure", "Watch", "Elevated pressure"] as const;

export function CorporateSignalsMap() {
  const [activeDimension, setActiveDimension] = useState<SignalKey | "all">("all");
  const [watchFilter, setWatchFilter] = useState<(typeof watchFilters)[number]>("All");
  const visibleCompanies = useMemo(
    () => watchFilter === "All" ? corporateSignalCompanies : corporateSignalCompanies.filter((company) => company.watchState === watchFilter),
    [watchFilter],
  );

  return (
    <div className="signals-dashboard">
      <section className="signals-controls" aria-label="Signals map controls">
        <div>
          <p className="eyebrow">View a lens</p>
          <div className="signals-filter-row" role="group" aria-label="Highlight a signal dimension">
            <button className={activeDimension === "all" ? "active" : ""} onClick={() => setActiveDimension("all")}>All signals</button>
            {signalDimensions.map((dimension) => (
              <button className={activeDimension === dimension.key ? "active" : ""} onClick={() => setActiveDimension(dimension.key)} key={dimension.key}>{dimension.label}</button>
            ))}
          </div>
        </div>
        <div>
          <p className="eyebrow">Show companies</p>
          <div className="signals-filter-row" role="group" aria-label="Filter companies by pressure level">
            {watchFilters.map((filter) => (
              <button className={watchFilter === filter ? "active" : ""} onClick={() => setWatchFilter(filter)} key={filter}>{filter}</button>
            ))}
          </div>
        </div>
      </section>

      <p className="signals-result-note">{visibleCompanies.length} companies shown. A color describes the linked public evidence as of the listed review date; it is not a stock rating, price target, or recommendation.</p>

      <div className="signals-company-grid">
        {visibleCompanies.map((company) => (
          <article className="signal-company-card" key={company.slug}>
            <header className="signal-company-header">
              <div>
                <p className="card-kicker">{company.ticker}</p>
                <h2>{company.company}</h2>
                <p>{company.industry} · Reviewed {company.lastReviewed}</p>
              </div>
              <span className={`watch-chip ${company.watchState.toLowerCase().replaceAll(" ", "-")}`}>{company.watchState}</span>
            </header>
            <p className="signal-thesis">{company.thesis}</p>
            <dl className="signal-matrix">
              {signalDimensions.map((dimension) => {
                const signal = company.signals[dimension.key];
                const isFocused = activeDimension === "all" || activeDimension === dimension.key;
                return (
                  <div className={`signal-cell ${signal.state} ${isFocused ? "focused" : "muted"}`} key={dimension.key}>
                    <dt>
                      <span className="signal-dot" aria-hidden="true" />
                      {dimension.label}
                    </dt>
                    <dd>
                      <strong>{signal.label}</strong>
                      <span>{signal.detail}</span>
                      <small>{stateCopy[signal.state]}</small>
                    </dd>
                  </div>
                );
              })}
            </dl>
            <div className="signal-next-evidence">
              <p className="eyebrow">Next evidence to check</p>
              <p>{company.nextEvidence}</p>
            </div>
            <div className="signal-sources">
              <p className="eyebrow">Source record</p>
              <ul>
                {company.sources.map((source) => <li key={source.url}><a href={source.url} target="_blank" rel="noreferrer">{source.label} <span aria-hidden="true">↗</span></a></li>)}
              </ul>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
