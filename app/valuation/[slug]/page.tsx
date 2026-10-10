import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { valuationProjects } from "@/site/lib/valuation-projects";

type PageProps = { params: Promise<{ slug: string }> };

function money(value: number) {
  return `$${value.toFixed(2)}`;
}

function findProject(slug: string) {
  return valuationProjects.find((project) => project.slug === slug);
}

export function generateStaticParams() {
  return valuationProjects.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = findProject(slug);
  if (!project) return {};

  const title = `${project.company} DCF Case Study`;
  const description = `${project.investmentThesis} Base DCF: ${money(project.baseDcfValuePerShare)} per share.`;
  return {
    title,
    description,
    openGraph: { title, description, images: [] },
    twitter: { card: "summary", title, description, images: [] },
  };
}

export default async function ValuationDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const project = findProject(slug);
  if (!project) notFound();

  return (
    <main>
      <section className="detail-hero valuation-detail-hero">
        <div className="shell detail-hero-grid">
          <div>
            <Link className="back-link" href="/valuation">← All valuation case studies</Link>
            <p className="eyebrow light">{project.ticker} · Driver-based FCFF</p>
            <h1>{project.company}</h1>
            <p className="detail-deck">{project.researchQuestion}</p>
          </div>
          <aside className="verdict-card">
            <span>Valuation view</span>
            <strong>{project.conclusion}</strong>
            <small>{project.valuationDate}</small>
          </aside>
        </div>
      </section>

      <section className="shell metric-panel" aria-label={`${project.company} valuation metrics`}>
        <div><span>Reference close</span><strong>{money(project.finalClose)}</strong></div>
        <div><span>Base DCF</span><strong>{money(project.baseDcfValuePerShare)}</strong></div>
        <div><span>Scenario range</span><strong>{money(project.scenarioRange.low)}-{money(project.scenarioRange.high)}</strong></div>
        <div><span>WACC</span><strong>{project.waccPercent.toFixed(2)}%</strong></div>
      </section>

      <section className="shell source-section model-download-section" aria-labelledby="project-files-title">
        <div>
          <p className="eyebrow">Project files</p>
          <h2 id="project-files-title">Read the report or open the full DCF model.</h2>
          <p>The PDF contains the written valuation report. The workbook contains the historical inputs, operating drivers, forecast, WACC, free-cash-flow bridge, scenarios, sensitivities, sources, and calculation checks.</p>
        </div>
        <div className="source-link-list">
          <a href={project.reportPath} target="_blank" rel="noreferrer">
            <span>{project.reportLabel}</span><span aria-hidden="true">↗</span>
          </a>
          <a href={project.workbookPath} download>
            <span>{project.workbookLabel}</span><span aria-hidden="true">↓</span>
          </a>
        </div>
      </section>

      <section className="shell valuation-report-section" aria-labelledby="full-report-title">
        <div className="valuation-report-heading">
          <p className="eyebrow">Full report</p>
          <h2 id="full-report-title">{project.report.title}</h2>
          <p>This report explains the business, the operating drivers behind the forecast, the valuation assumptions, the scenario range, and the main risks.</p>
        </div>
        <div className="valuation-report-layout">
          <article className="valuation-report-copy">
            {project.report.sections.map((section) => (
              <section key={section.heading}>
                <h3>{section.heading}</h3>
                {section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
              </section>
            ))}
          </article>
        </div>
      </section>

      <section className="shell detail-story-grid">
        <article>
          <p className="eyebrow">Investment thesis</p>
          <h2>The conditional read</h2>
          <p className="lead-copy">{project.investmentThesis}</p>
          <p className="date-note">{project.valuationDateNote}</p>
        </article>
        <article>
          <p className="eyebrow">Model architecture</p>
          <h2>What drives the forecast</h2>
          <ul className="detail-list">
            {project.modelDrivers.map((driver) => <li key={driver}>{driver}</li>)}
          </ul>
        </article>
      </section>

      <section className="detail-band">
        <div className="shell detail-three-column">
          <article>
            <p className="eyebrow light">Sensitivity</p>
            <h2>Dimensions to test</h2>
            <p className="section-caveat">These directional dimensions are preserved from the case structure; exact final sensitivity-cell outputs are not available in the audit record.</p>
            <ul>{project.sensitivityThemes.map((item) => <li key={item}>{item}</li>)}</ul>
          </article>
          <article>
            <p className="eyebrow light">Risks</p>
            <h2>What can break</h2>
            <ul>{project.risks.map((risk) => <li key={risk}>{risk}</li>)}</ul>
          </article>
          <article>
            <p className="eyebrow light">Limitations</p>
            <h2>What remains unresolved</h2>
            <ul>
              {[...project.limitations, ...project.unavailableAssumptions].map((limitation) => <li key={limitation}>{limitation}</li>)}
            </ul>
          </article>
        </div>
      </section>

      <section className="shell source-section">
        <div>
          <p className="eyebrow">Sources &amp; research files</p>
          <h2>Trace the public inputs.</h2>
          <p>All values and source material use the August 5, 2026 valuation date. Later information is not used to revise the original model.</p>
        </div>
        <div className="source-link-list">
          {project.officialSources.map((source) => (
            <a href={source.url} key={source.url} rel="noreferrer" target="_blank">
              <span>{source.label}</span><span aria-hidden="true">↗</span>
            </a>
          ))}
        </div>
      </section>
    </main>
  );
}
