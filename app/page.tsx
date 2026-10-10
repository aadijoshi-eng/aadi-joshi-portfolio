import { publicPath } from "@/site/lib/paths";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PortfolioCard } from "@/site/components/PortfolioCard";
import { coreQuestion, headlineFacts } from "@/site/lib/content";
import { portfolioFacts, portfolioSections } from "@/site/lib/portfolio";

export const metadata: Metadata = {
  title: "Research & Analysis",
  description:
    "A portfolio of applied economics, equity valuation, corporate analysis, and Carolina business reporting, led by the North Carolina Banking & Startup Opportunity Atlas.",
};

const pathways = [
  {
    index: "01",
    title: "Explore counties",
    text: "Compare branch density, network change, employer-startup rates, and 2013 metro status without turning the map into a county ranking.",
    href: "/atlas",
    label: "Open the county atlas",
  },
  {
    index: "02",
    title: "Inspect the evidence",
    text: "Separate statewide descriptive changes from the fixed-effects estimate and its wide confidence interval.",
    href: "/findings",
    label: "Read the findings",
  },
  {
    index: "03",
    title: "Audit the project",
    text: "Download the processed panel, read the source manifest, and reproduce the public display layer from audited research outputs.",
    href: "/data",
    label: "Review data and sources",
  },
] as const;

export default function OverviewPage() {
  return (
    <main>
      <section className="portfolio-hero shell">
        <div className="portfolio-hero-copy">
          <p className="eyebrow">Independent student research portfolio</p>
          <h1>Companies, capital, and Carolina, studied from the evidence outward.</h1>
          <p className="portfolio-deck">
            An organized body of work across applied economics, equity valuation,
            corporate analysis, and North Carolina business. The Banking &amp;
            Startup Opportunity Atlas remains the flagship research project.
          </p>
          <div className="action-row">
            <Link className="button primary" href="/atlas">Explore the flagship Atlas</Link>
            <Link className="button secondary" href="/projects">Browse all projects</Link>
          </div>
        </div>
        <aside className="portfolio-register" aria-label="Portfolio areas">
          <div className="register-heading">
            <span>Work index</span>
            <span>2026</span>
          </div>
          {portfolioSections.map((project) => (
            <Link href={project.href} key={project.href}>
              <span>{project.number}</span>
              <strong>{project.title}</strong>
              <small>{project.count}</small>
            </Link>
          ))}
        </aside>
      </section>

      <section className="portfolio-fact-strip" aria-label="Portfolio summary">
        <div className="shell portfolio-fact-grid">
          {portfolioFacts.map((fact) => (
            <article key={fact.label}>
              <p className="fact-value">{fact.value}</p>
              <p className="fact-label">{fact.label}</p>
              <p className="fact-detail">{fact.detail}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="flagship-heading shell">
        <p className="eyebrow">Flagship research</p>
        <p>Public data · interactive tools · working paper · reproducible analysis</p>
      </section>

      <section className="hero shell">
        <div className="hero-copy">
          <p className="eyebrow">North Carolina · 100 counties · 2014-2023</p>
          <h1>Banking networks changed. Startup activity did not tell a simple story.</h1>
          <p className="hero-deck">{coreQuestion}</p>
          <div className="action-row">
            <Link className="button primary" href="/atlas">Explore the county atlas</Link>
            <a className="button secondary" href={publicPath("/downloads/working_paper.pdf")}>Read the working paper <span aria-hidden="true">↗</span></a>
          </div>
          <p className="method-tag"><span aria-hidden="true">●</span> County and year fixed effects · county-clustered uncertainty · 31 independently checked effects</p>
        </div>

        <figure className="hero-figure">
          <div className="figure-kicker">
            <span>Branch-density change</span>
            <span>2013-2022</span>
          </div>
          <Image
            src={publicPath("/figures/branch-density-change-map.png")}
            alt="Map of North Carolina counties showing varied changes in full-service bank branch density from 2013 to 2022."
            width={2744}
            height={1463}
            sizes="(max-width: 920px) 90vw, 42vw"
            priority
            unoptimized
          />
          <figcaption>Widespread contraction, uneven local magnitude. FDIC SOD + BEA; descriptive only.</figcaption>
        </figure>
      </section>

      <section className="fact-strip" aria-label="Three verified project facts">
        <div className="shell fact-grid">
          {headlineFacts.map((fact) => (
            <article key={fact.value}>
              <p className="fact-value">{fact.value}</p>
              <p className="fact-label">{fact.label}</p>
              <p className="fact-detail">{fact.detail}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="shell read-note">
        <div>
          <p className="eyebrow">How to read this project</p>
          <h2>The contraction is a fact. The direction of the adjusted association is not stable.</h2>
        </div>
        <div className="read-note-copy">
          <p>The data show that qualifying full-service branches fell from 2,554 to 1,998. The internally frozen, label-aligned estimate is negative and imprecise; an audit-added clean-preperiod estimate is positive and imprecise.</p>
          <p>Because both intervals cross zero and their signs differ, this study establishes neither a precise, temporally stable sign nor a causal effect. It cannot show that branches increase startups, suppress startups, or do not matter.</p>
          <Link className="text-link" href="/limitations">Read the identification and measurement limits <span aria-hidden="true">→</span></Link>
        </div>
      </section>

      <section className="shell pathways-section">
        <div className="section-heading-row">
          <div>
            <p className="eyebrow">Use the evidence</p>
            <h2>Three ways into the project</h2>
          </div>
          <p>Every public claim links back to a definition, source, or audited model output.</p>
        </div>
        <div className="pathway-list">
          {pathways.map((pathway) => (
            <article className="pathway" key={pathway.index}>
              <span className="pathway-index">{pathway.index}</span>
              <div>
                <h3>{pathway.title}</h3>
                <p>{pathway.text}</p>
              </div>
              <Link href={pathway.href}>{pathway.label} <span aria-hidden="true">→</span></Link>
            </article>
          ))}
        </div>
      </section>

      <section className="work-index-section shell" id="work">
        <div className="section-heading-row">
          <div>
            <p className="eyebrow">Selected work</p>
            <h2>Different formats. One standard of evidence.</h2>
          </div>
          <p>Scan the portfolio by discipline, then open the underlying models, reports, articles, sources, and limitations.</p>
        </div>
        <div className="portfolio-grid">
          {portfolioSections.map((project) => (
            <PortfolioCard project={project} key={project.href} />
          ))}
        </div>
      </section>

      <section className="scope-band">
        <div className="shell scope-grid">
          <div>
            <p className="eyebrow light">Scope discipline</p>
            <h2>What the Atlas measures, and what it deliberately leaves out.</h2>
          </div>
          <dl>
            <div><dt>Exposure</dt><dd>FDIC full-service branches per 10,000 residents. Frozen June t−1 overlaps the BDS interval; audit A4 uses June t−2.</dd></div>
            <div><dt>Outcome</dt><dd>Census BDS firm-age-zero establishments per 1,000 lagged active establishments; label year t spans March t−1 to March t.</dd></div>
            <div><dt>Not measured</dt><dd>Travel time, digital access, credit unions, nonbank lending, or nonemployer businesses.</dd></div>
          </dl>
        </div>
      </section>
    </main>
  );
}
