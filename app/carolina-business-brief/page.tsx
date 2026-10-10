import type { Metadata } from "next";
import Link from "next/link";
import { CarolinaBusinessMonitor } from "@/site/components/CarolinaBusinessMonitor";
import { CarolinaProgressExplorer } from "@/site/components/CarolinaProgressExplorer";
import { carolinaBusinessBriefDrafts } from "@/site/lib/editorial-projects";
import { carolinaBusinessMonitorEntries, monitorLastUpdated, monitorSummary } from "@/site/lib/carolina-business-monitor";

export const metadata: Metadata = {
  title: "Carolina Business Brief",
  description: "Source-linked North Carolina business briefs and a tracker that separates announced commitments from verified outcomes.",
};

export default function CarolinaBusinessBriefPage() {
  return (
    <main>
      <section className="brief-masthead shell">
        <div className="brief-edition-line">
          <span>Carolina Business Brief</span>
          <span>Business Monitor updated · {monitorLastUpdated}</span>
        </div>
        <p className="eyebrow">North Carolina business reporting</p>
        <h1>Track the promise. Verify the progress.</h1>
        <p className="page-deck">Ten source-linked briefs, paired with a structured monitor that separates announcements from completed transactions, construction milestones, job targets, and future commitments.</p>
      </section>

      <section className="shell brief-progress-section" id="brief-progress">
        <CarolinaProgressExplorer entries={carolinaBusinessMonitorEntries} />
      </section>

      <section className="monitor-section shell">
        <div className="section-heading-row monitor-heading-row">
          <div>
            <p className="eyebrow">Carolina Business Monitor</p>
            <h2>Announcements are not outcomes.</h2>
          </div>
          <p>The same public record is coded into a repeatable framework: what is physically or legally verified, what remains a commitment, and which event would count as the next meaningful checkpoint.</p>
        </div>

        <div className="monitor-summary" aria-label="Business monitor summary">
          <div><strong>{monitorSummary.developments}</strong><span>developments tracked</span></div>
          <div><strong>${(monitorSummary.plannedCapital / 1_000_000_000).toFixed(2)}B</strong><span>planned capital investment*</span></div>
          <div><strong>{monitorSummary.plannedPermanentJobs.toLocaleString()}+</strong><span>planned permanent jobs*</span></div>
          <div><strong>{monitorSummary.regions}</strong><span>North Carolina regions</span></div>
        </div>
        <p className="monitor-summary-note">*Capital and job totals exclude the AvidXchange transaction and River District unit counts. They are announced commitments, not verified delivery totals.</p>

        <CarolinaBusinessMonitor entries={carolinaBusinessMonitorEntries} />
      </section>

      <section className="monitor-method-band">
        <div className="shell monitor-method-grid">
          <div>
            <p className="eyebrow light">What this adds</p>
            <h2>A reporting process, not a pile of posts.</h2>
          </div>
          <div>
            <p>The analysis classifies each development by evidence stage and refuses to count a press-release promise as a delivered result. Transaction closings, groundbreakings, construction, openings, jobs, investment, and incentive payments are different milestones.</p>
            <p>The central lesson is simple: the size of an announcement matters less than whether the company reaches the next observable checkpoint. This page can be updated as evidence changes without rewriting the original dated briefs.</p>
          </div>
        </div>
      </section>

      <section className="shell brief-index-section">
        <div className="section-heading-row brief-library-heading">
          <div>
            <p className="eyebrow">Brief library</p>
            <h2>Read the underlying analysis.</h2>
          </div>
          <p>Each article explains the business model, decision, local relevance, and evidence behind the structured tracker.</p>
        </div>
        <div className="brief-feature-grid">
          {carolinaBusinessBriefDrafts.map((article, index) => (
            <article className={`brief-card ${index === 0 ? "brief-card-lead" : ""}`} key={article.slug}>
              <div className="brief-card-meta">
                <span>{String(index + 1).padStart(2, "0")}</span>
                <span>{article.category}</span>
              </div>
              <div>
                <h2>{article.title}</h2>
                <p>{article.deck}</p>
              </div>
              <div className="brief-card-footer">
                <span>{article.date} · {article.estimatedReadTime}</span>
                <Link href={`/carolina-business-brief/${article.slug}`}>Read article <span aria-hidden="true">→</span></Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="brief-standards-band">
        <div className="shell brief-standards-grid">
          <div>
            <p className="eyebrow light">Editorial standard</p>
            <h2>Facts, interpretation, and commitments are kept distinct.</h2>
          </div>
          <div>
            <p>These pieces are portfolio research drafts, not claims of published newsroom reporting. Each article preserves its date, category, tags, full text, and source links.</p>
            <p>Projected jobs, investments, incentives, and outcomes remain labeled as commitments until public evidence verifies delivery.</p>
          </div>
        </div>
      </section>
    </main>
  );
}
