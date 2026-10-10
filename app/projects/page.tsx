import type { Metadata } from "next";
import Link from "next/link";
import { carolinaBusinessBriefDrafts, corporateAutopsyReports } from "@/site/lib/editorial-projects";
import { valuationProjects } from "@/site/lib/valuation-projects";

export const metadata: Metadata = {
  title: "Projects",
  description: "Browse the Atlas, valuation studies, Corporate Autopsies, and Carolina Business Brief drafts.",
};

const projectGroups = [
  {
    number: "01",
    label: "Atlas / Research",
    href: "/atlas",
    description: "Interactive county map, trends, findings, methods, data, limitations, working paper, and reproducibility materials.",
    items: ["North Carolina Banking & Startup Opportunity Atlas"],
  },
  {
    number: "02",
    label: "Equity Research & Valuation",
    href: "/valuation",
    description: "Audited, driver-based DCF case studies with scenario ranges, operating assumptions, risks, and limitations.",
    items: valuationProjects.map((project) => project.company),
  },
  {
    number: "03",
    label: "Corporate Autopsy Series",
    href: "/corporate-autopsies",
    type: "Independent research series",
    description: "Twelve full, source-linked case reports and a Corporate Signals Map examining the business model, governance, operating, and liquidity pressures behind corporate crises.",
    items: ["Corporate Signals Map", ...corporateAutopsyReports.map((report) => report.title.replace("Corporate Autopsy: ", ""))],
  },
  {
    number: "04",
    label: "Carolina Business Brief",
    href: "/carolina-business-brief",
    description: "Ten dated, source-linked research drafts covering consequential North Carolina business developments.",
    items: carolinaBusinessBriefDrafts.map((article) => article.title),
  },
];

export default function ProjectsPage() {
  return (
    <main>
      <section className="page-intro shell project-page-intro">
        <div>
          <p className="eyebrow">Complete work index</p>
          <h1>One portfolio, organized for a fast scan and a deep read.</h1>
          <p className="page-deck">Start with the flagship Atlas or move directly into finance, corporate analysis, and Carolina business reporting.</p>
        </div>
        <p className="page-aside">Each area keeps the format best suited to its question while sharing one standard for evidence, attribution, and limitations.</p>
      </section>

      <section className="shell projects-directory">
        {projectGroups.map((group) => (
          <article className="project-directory-row" key={group.href}>
            <div className="directory-number">{group.number}</div>
            <div className="directory-copy">
              <p className="card-kicker">{group.type ?? "Work area"}</p>
              <h2>{group.label}</h2>
              <p>{group.description}</p>
              <Link href={group.href}>Open section <span aria-hidden="true">→</span></Link>
            </div>
            <ol>
              {group.items.map((item) => <li key={item}>{item}</li>)}
            </ol>
          </article>
        ))}
      </section>

      <section className="portfolio-principles-band">
        <div className="shell portfolio-principles-grid">
          <div>
            <p className="eyebrow light">About the work</p>
            <h2>Research is strongest when its limits remain attached.</h2>
          </div>
          <dl>
            <div><dt>Evidence</dt><dd>Public sources, dated inputs, and traceable definitions.</dd></div>
            <div><dt>Interpretation</dt><dd>Conclusions stay conditional on the model or reporting record.</dd></div>
            <div><dt>Ownership</dt><dd>Working papers and drafts are labeled accurately; unfinished publication or review claims are not implied.</dd></div>
          </dl>
        </div>
      </section>
    </main>
  );
}
