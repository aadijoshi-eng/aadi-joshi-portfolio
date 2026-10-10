"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { CorporateAutopsyReport, FailureMechanism } from "@/site/lib/editorial-projects";

const filters: Array<FailureMechanism | "All"> = ["All", "Governance", "Capital allocation", "Operations", "Strategy", "Liquidity"];

export function CorporateAutopsyIndex({ cases }: { cases: CorporateAutopsyReport[] }) {
  const [active, setActive] = useState<(typeof filters)[number]>("All");
  const visibleCases = useMemo(() => active === "All" ? cases : cases.filter((item) => item.mechanisms.includes(active)), [active, cases]);
  return <>
    <div className="autopsy-filter-row" aria-label="Filter cases by primary mechanism">
      {filters.map((filter) => <button className={filter === active ? "active" : ""} onClick={() => setActive(filter)} key={filter}>{filter}</button>)}
    </div>
    <p className="autopsy-result-note">{visibleCases.length} cases shown. Tags are analytical reading aids, not numerical risk scores or causal findings.</p>
    <div className="case-card-grid autopsy-index-grid">
      {visibleCases.map((caseFile) => <article className="case-card autopsy-index-card" key={caseFile.slug}>
        <div className="case-card-topline"><span>{caseFile.timePeriod}</span><span>{caseFile.industry}</span></div>
        <div><p className="card-kicker">Full report</p><h2>{caseFile.title.replace("Corporate Autopsy: ", "")}</h2><p>{caseFile.summary}</p></div>
        <div className="mechanism-tags">{caseFile.mechanisms.map((mechanism) => <span key={mechanism}>{mechanism}</span>)}</div>
        <p className="case-outcome"><strong>Outcome:</strong> {caseFile.crisisOutcome}</p>
        <Link className="case-card-link" href={`/corporate-autopsies/${caseFile.slug}`}>Read full report <span aria-hidden="true">→</span></Link>
      </article>)}
    </div>
  </>;
}
