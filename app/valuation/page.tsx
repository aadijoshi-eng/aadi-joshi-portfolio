import type { Metadata } from "next";
import Link from "next/link";
import { valuationProjects } from "@/site/lib/valuation-projects";

export const metadata: Metadata = {
  title: "Equity Research & Valuation",
  description: "Audited, driver-based DCF case studies of Copart, CAVA, and ADP.",
};

function money(value: number) {
  return `$${value.toFixed(2)}`;
}

export default function ValuationPage() {
  return (
    <main>
      <section className="page-intro shell project-page-intro">
        <div>
          <p className="eyebrow">Equity research &amp; valuation</p>
          <h1>Three businesses. Three different valuation problems.</h1>
          <p className="page-deck">Driver-based DCF work on a salvage-auction marketplace, a fast-growing restaurant chain, and a recurring payroll-and-HCM franchise.</p>
        </div>
        <p className="page-aside">These are dated valuation snapshots, not current recommendations. Each page shows the assumptions, scenario range, risks, and unresolved limitations.</p>
      </section>

      <section className="shell project-card-section">
        <div className="section-heading-row">
          <div>
            <p className="eyebrow">Case studies</p>
            <h2>Open the model logic, one company at a time.</h2>
          </div>
          <p>Every company retains its own thesis, operating drivers, valuation range, source links, and limitations.</p>
        </div>
        <div className="case-card-grid valuation-card-grid">
          {valuationProjects.map((project, index) => (
            <article className="case-card valuation-case-card" key={project.slug}>
              <div className="case-card-topline">
                <span>{String(index + 1).padStart(2, "0")}</span>
                <span>{project.ticker}</span>
              </div>
              <div>
                <p className="card-kicker">Audited DCF case study</p>
                <h2>{project.company}</h2>
                <p>{project.researchQuestion}</p>
              </div>
              <dl className="compact-metrics">
                <div><dt>Base DCF</dt><dd>{money(project.baseDcfValuePerShare)}</dd></div>
                <div><dt>Range</dt><dd>{money(project.scenarioRange.low)}-{money(project.scenarioRange.high)}</dd></div>
                <div><dt>WACC</dt><dd>{project.waccPercent.toFixed(2)}%</dd></div>
              </dl>
              <Link className="case-card-link" href={`/valuation/${project.slug}`}>Read the {project.company} case study <span aria-hidden="true">→</span></Link>
            </article>
          ))}
        </div>
      </section>

      <section className="valuation-comparison-band">
        <div className="shell">
          <div className="section-heading-row dark-heading">
            <div>
              <p className="eyebrow light">Audited comparison</p>
              <h2>Conclusions stay conditional.</h2>
            </div>
            <p>The final portfolio audit recalculated FCFF, corrected valuation inputs and sensitivities, and preserved company-specific caveats.</p>
          </div>
          <div className="table-scroll" role="region" aria-label="Audited DCF comparison table" tabIndex={0}>
            <table className="portfolio-comparison-table">
              <caption className="visually-hidden">Reference close, base DCF, scenario range, and audited conclusion for Copart, CAVA, and ADP.</caption>
              <thead><tr><th>Company</th><th>Reference close</th><th>Base DCF</th><th>Scenario range</th><th>Conclusion</th></tr></thead>
              <tbody>
                {valuationProjects.map((project) => (
                  <tr key={project.slug}>
                    <th>{project.company}</th>
                    <td>{money(project.finalClose)}</td>
                    <td>{money(project.baseDcfValuePerShare)}</td>
                    <td>{money(project.scenarioRange.low)}-{money(project.scenarioRange.high)}</td>
                    <td>{project.conclusion}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </main>
  );
}
