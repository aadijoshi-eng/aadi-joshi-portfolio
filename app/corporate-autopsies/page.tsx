import type { Metadata } from "next";
import Link from "next/link";
import { CorporateAutopsyIndex } from "@/site/components/CorporateAutopsyIndex";
import { corporateAutopsyReports } from "@/site/lib/editorial-projects";

export const metadata: Metadata = {
  title: "Corporate Autopsies",
  description: "A source-linked comparative index of major corporate failures, crises, and restructurings.",
};

export default function CorporateAutopsiesPage() {
  return (
    <main>
      <section className="page-intro shell project-page-intro">
        <div>
          <p className="eyebrow">Corporate analysis</p>
          <h1>Failure is rarely one bad decision.</h1>
          <p className="page-deck">A source-linked comparative index of 12 corporate crises. It distinguishes the visible event from the governance, capital-allocation, operating, strategy, and liquidity problems that built up beforehand.</p>
        </div>
        <p className="page-aside">All 12 reports use the same full research structure: business model, root causes, timeline, impact, alternatives, lessons, and a source record.</p>
      </section>

      <section className="shell signals-callout" aria-labelledby="signals-callout-title">
        <div>
          <p className="eyebrow">Current-company research</p>
          <h2 id="signals-callout-title">Corporate Signals Map</h2>
          <p>Read documented balance-sheet, earnings, deal-execution, operating, and rate-sensitivity signals without turning public filings into a fake stock score.</p>
        </div>
        <Link className="text-link" href="/corporate-autopsies/signals">Open the signals map <span aria-hidden="true">→</span></Link>
      </section>

      <section className="shell project-card-section">
        <div className="section-heading-row">
          <div>
            <p className="eyebrow">Report library</p>
            <h2>Flagship reports</h2>
          </div>
          <p>Long-form reports with full timelines, analysis, limitations, and primary-source links.</p>
        </div>
        <div className="case-card-grid autopsy-card-grid">
          {corporateAutopsyReports.slice(0, 3).map((report, index) => (
            <article className="case-card autopsy-case-card" key={report.slug}>
              <div className="case-card-topline">
                <span>{String(index + 1).padStart(2, "0")}</span>
                <span>{report.timePeriod}</span>
              </div>
              <div>
                <p className="card-kicker">Corporate Autopsy</p>
                <h2>{report.title.replace("Corporate Autopsy: ", "")}</h2>
                <p>{report.mainBusinessProblem}</p>
              </div>
              <dl className="case-metadata">
                <div><dt>Industry</dt><dd>{report.industry}</dd></div>
                <div><dt>Outcome</dt><dd>{report.crisisOutcome}</dd></div>
              </dl>
              <Link className="case-card-link" href={`/corporate-autopsies/${report.slug}`}>Read the full report <span aria-hidden="true">→</span></Link>
            </article>
          ))}
        </div>
      </section>

      <section className="shell autopsy-index-section">
        <div className="section-heading-row">
          <div>
            <p className="eyebrow">Comparative index</p>
            <h2>All 12 full reports.</h2>
          </div>
          <p>Filter reports by the mechanisms most visible in the public record. A tag is a reading tool, not a verdict, causal score, or investment view.</p>
        </div>
        <CorporateAutopsyIndex cases={corporateAutopsyReports} />
      </section>

      <section className="autopsy-method-band">
        <div className="shell method-manifesto">
          <p className="eyebrow light">Analytical standard</p>
          <h2>Separate the headline event from the system that made it possible.</h2>
          <p>A promotion, failed IPO, bank run, safety incident, or market shock may trigger attention. The useful analysis asks which contracts, incentives, processes, and governance failures accumulated before the visible crisis.</p>
        </div>
      </section>
    </main>
  );
}
