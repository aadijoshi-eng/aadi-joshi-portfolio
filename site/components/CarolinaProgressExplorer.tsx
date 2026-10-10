"use client";

import Link from "next/link";
import { useState } from "react";
import type { CarolinaBusinessMonitorEntry } from "@/site/lib/carolina-business-monitor";

type ProgressSpec = {
  id: string;
  stages: string[];
  verifiedStage: number;
  marker?: { x: number; y: number };
};

const progressSpecs: ProgressSpec[] = [
  { id: "avidxchange", stages: ["Announced", "Shareholder approval", "Closed"], verifiedStage: 3 },
  { id: "genentech", stages: ["Announced", "Ground broken", "Construction", "Operations"], verifiedStage: 3, marker: { x: 510, y: 103 } },
  { id: "jetzero", stages: ["Announced", "Site selected", "Groundbreaking", "Operations"], verifiedStage: 3, marker: { x: 408, y: 63 } },
  { id: "river-district", stages: ["Master plan", "Ground broken", "First phase built", "Apartments open"], verifiedStage: 4, marker: { x: 303, y: 151 } },
  { id: "citi", stages: ["Announced", "Office opened"], verifiedStage: 2, marker: { x: 329, y: 139 } },
  { id: "amazon-richmond-county", stages: ["Announced", "Permit review", "Construction", "Operations"], verifiedStage: 2, marker: { x: 432, y: 173 } },
  { id: "toyota-battery", stages: ["Announced", "Construction", "Production", "Plant opened"], verifiedStage: 4, marker: { x: 444, y: 86 } },
  { id: "jabil-rowan", stages: ["Announced", "Site work", "Construction", "Operations"], verifiedStage: 1, marker: { x: 363, y: 102 } },
  { id: "scout-motors", stages: ["Announced", "Office buildout", "Operations"], verifiedStage: 1, marker: { x: 351, y: 153 } },
  { id: "wolfspeed-restructuring", stages: ["Support agreement", "Chapter 11", "Emerged"], verifiedStage: 3 },
];

const mapped = progressSpecs.filter((item) => item.marker);
const corporate = progressSpecs.filter((item) => !item.marker);

// Projected from the Census Bureau's 2025 1:20,000,000 cartographic state boundary.
const northCarolinaPath = "M19,143 L16,163 L33,163 L45,163 L51,163 L51,163 L79,163 L86,163 L92,163 L106,162 L125,162 L125,162 L134,160 L144,157 L144,157 L155,154 L156,155 L158,155 L163,151 L173,149 L177,148 L184,146 L188,144 L193,144 L197,144 L198,144 L206,145 L215,145 L221,145 L228,145 L236,145 L246,146 L271,147 L282,147 L285,147 L311,149 L311,149 L312,151 L310,155 L311,158 L321,152 L323,155 L329,162 L335,168 L333,178 L354,178 L354,178 L376,179 L398,179 L412,179 L412,179 L433,180 L434,180 L453,195 L454,196 L463,203 L485,222 L489,225 L489,225 L489,225 L512,245 L526,257 L530,260 L536,265 L550,261 L560,260 L573,260 L583,262 L584,265 L589,265 L591,259 L593,255 L595,249 L600,237 L606,230 L611,226 L618,220 L629,213 L633,210 L646,204 L653,199 L663,195 L665,195 L683,191 L700,189 L709,191 L715,195 L717,199 L724,188 L730,181 L737,175 L744,171 L753,163 L764,156 L773,151 L787,146 L788,145 L798,142 L807,142 L811,127 L814,108 L810,96 L808,93 L804,84 L796,70 L790,62 L786,51 L783,46 L780,33 L777,22 L763,22 L754,22 L737,22 L737,22 L721,22 L716,22 L699,22 L683,23 L683,23 L682,23 L669,23 L660,23 L658,23 L648,23 L608,23 L606,23 L594,23 L581,23 L573,23 L556,23 L544,23 L539,23 L519,23 L513,23 L500,23 L483,23 L475,23 L464,23 L453,23 L449,23 L449,23 L431,23 L403,23 L403,23 L400,23 L378,23 L366,22 L365,22 L350,22 L342,21 L329,21 L324,21 L324,21 L309,21 L299,21 L283,20 L270,20 L254,19 L252,24 L252,30 L249,35 L250,37 L251,42 L246,41 L240,41 L233,45 L232,46 L231,48 L229,51 L222,61 L218,62 L218,62 L214,63 L212,60 L206,58 L205,58 L201,61 L198,60 L194,62 L188,64 L187,65 L183,71 L179,74 L175,76 L170,74 L171,70 L170,69 L168,66 L160,70 L155,73 L154,76 L152,79 L148,77 L145,78 L143,79 L144,83 L141,88 L138,90 L137,92 L131,91 L126,92 L120,93 L117,97 L112,98 L112,98 L111,99 L108,103 L104,103 L97,107 L94,108 L90,111 L82,111 L76,111 L75,111 L66,111 L59,115 L52,119 L49,121 L49,121 L47,121 L43,125 L44,129 L42,131 L43,135 L42,136 L36,140 L29,140 L25,138 L20,142 L19,143 Z";

export function CarolinaProgressExplorer({ entries }: { entries: CarolinaBusinessMonitorEntry[] }) {
  const [selectedId, setSelectedId] = useState("genentech");
  const byId = new Map(entries.map((entry) => [entry.id, entry]));
  const selectedSpec = progressSpecs.find((item) => item.id === selectedId) ?? progressSpecs[1];
  const selected = byId.get(selectedSpec.id);

  if (!selected) return null;

  const selectRecord = (id: string) => {
    setSelectedId(id);
    if (window.matchMedia("(max-width: 920px)").matches) {
      const behavior = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth";
      window.requestAnimationFrame(() => document.getElementById("brief-progress-detail")?.scrollIntoView({ behavior, block: "start" }));
    }
  };

  return (
    <div className="brief-progress-explorer">
      <div className="brief-progress-heading">
        <div>
          <p className="eyebrow">Location and milestone record</p>
          <h2>Where each development stands.</h2>
        </div>
        <p>These tracks show the latest documented event, not a percentage of a project completed. The stars locate a city or county, not an exact site.</p>
      </div>

      <div className="brief-progress-grid">
        <div className="brief-progress-map-side">
          <div className="brief-progress-map-scroll" aria-label="Scroll to explore the North Carolina map">
            <div className="brief-progress-map" role="group" aria-label="Eight North Carolina developments">
              <svg viewBox="0 0 840 300" aria-hidden="true" focusable="false">
                <path d={northCarolinaPath} className="brief-nc-outline" />
                <text x="125" y="109">Asheville</text>
                <text x="251" y="188">Charlotte area</text>
                <text x="389" y="43">Greensboro</text>
                <text x="529" y="85">Raleigh area</text>
                <text x="604" y="241">Wilmington</text>
              </svg>
              {mapped.map((item, index) => {
                const entry = byId.get(item.id);
                if (!entry || !item.marker) return null;
                return (
                  <button
                    key={item.id}
                    type="button"
                    className={`brief-map-pin${selectedId === item.id ? " selected" : ""}`}
                    style={{ left: `${item.marker.x / 840 * 100}%`, top: `${item.marker.y / 300 * 100}%` }}
                    title={`${index + 1}. ${entry.company} · ${entry.location} · ${entry.stage}`}
                    aria-label={`Select ${index + 1}, ${entry.company}, ${entry.location}`}
                    aria-pressed={selectedId === item.id}
                    onClick={() => selectRecord(item.id)}
                  >
                    <svg viewBox="0 0 40 40" aria-hidden="true"><path d="M20 2 25 13 37 14 28 23 31 36 20 29 9 36 12 23 3 14 15 13Z" /><text x="20" y="23">{index + 1}</text></svg>
                  </button>
                );
              })}
            </div>
          </div>
          <p className="brief-map-source">Boundary: <a href="https://www.census.gov/geographies/mapping-files/2025/geo/carto-boundary-file.html" target="_blank" rel="noreferrer">U.S. Census Bureau, 2025 cartographic file</a>. Charlotte markers are offset to separate nearby records.</p>

          <div className="brief-progress-records" aria-label="Mapped development records">
            {mapped.map((item, index) => {
              const entry = byId.get(item.id);
              if (!entry) return null;
              return (
                <button key={item.id} type="button" className={selectedId === item.id ? "selected" : ""} aria-pressed={selectedId === item.id} onClick={() => selectRecord(item.id)}>
                  <span className="brief-record-number">{index + 1}</span>
                  <span><strong>{entry.company}</strong><small>{entry.location}</small></span>
                </button>
              );
            })}
          </div>

          <div className="brief-corporate-outcomes">
            <h3>Corporate outcomes</h3>
            <p>These two reports concern a transaction and a restructuring, so they have no construction pin.</p>
            {corporate.map((item) => {
              const entry = byId.get(item.id);
              if (!entry) return null;
              return <button key={item.id} type="button" className={selectedId === item.id ? "selected" : ""} aria-pressed={selectedId === item.id} onClick={() => selectRecord(item.id)}><strong>{entry.company}</strong><span>{entry.project} · {entry.lastVerified}</span></button>;
            })}
          </div>
        </div>

        <article className="brief-progress-detail" id="brief-progress-detail" aria-live="polite">
          <p className="brief-detail-kicker">{selectedSpec.marker ? "Mapped development" : "Corporate outcome"} · {selected.location}</p>
          <h3>{selected.company}</h3>
          <p className="brief-detail-project">{selected.project}</p>
          <div className="brief-verified-status"><span>Latest documented event · {selected.lastVerified}</span><strong>{selected.stage}</strong><p>{selected.verifiedNow}</p></div>

          <div className="brief-stage-heading"><h4>Documented sequence</h4><span>{selectedSpec.verifiedStage} / {selectedSpec.stages.length} stages</span></div>
          <ol className="brief-stage-track" style={{ gridTemplateColumns: `repeat(${selectedSpec.stages.length}, minmax(0, 1fr))` }} aria-label={`${selectedSpec.verifiedStage} of ${selectedSpec.stages.length} stages documented`}>
            {selectedSpec.stages.map((stage, index) => (
              <li key={stage} className={`${index < selectedSpec.verifiedStage ? "complete" : ""} ${index + 1 < selectedSpec.verifiedStage ? "connected" : ""} ${index === selectedSpec.verifiedStage - 1 ? "current" : ""}`}>
                <span className="brief-stage-dot" aria-hidden="true" /><span>{stage}</span>
              </li>
            ))}
          </ol>
          <p className="brief-stage-explainer">The line joins documented milestones. Empty stages are future checkpoints, not predicted completion.</p>

          <div className="brief-detail-evidence"><span>Still a commitment</span><p>{selected.announcedPromise}</p></div>
          {selected.uncertainty && <p className="brief-detail-caveat"><strong>Limit:</strong> {selected.uncertainty}</p>}
          <div className="brief-detail-links">
            <Link href={selected.articleHref}>Read the full brief →</Link>
            {selected.sources.map((source) => <a key={source.url} href={source.url} target="_blank" rel="noreferrer">{source.label} ↗</a>)}
          </div>
        </article>
      </div>
    </div>
  );
}
