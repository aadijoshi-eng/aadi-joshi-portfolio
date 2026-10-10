import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MarkdownArticle } from "@/site/components/MarkdownArticle";
import { corporateAutopsyReports } from "@/site/lib/editorial-projects";

type PageProps = { params: Promise<{ slug: string }> };

function findReport(slug: string) {
  return corporateAutopsyReports.find((report) => report.slug === slug);
}

export function generateStaticParams() {
  return corporateAutopsyReports.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const report = findReport(slug);
  if (!report) return {};
  const title = report.title;
  const description = `${report.mainBusinessProblem}. ${report.crisisOutcome}.`;
  return {
    title,
    description,
    openGraph: { title, description, images: [] },
    twitter: { card: "summary", title, description, images: [] },
  };
}

export default async function CorporateAutopsyDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const report = findReport(slug);
  if (!report) notFound();

  return (
    <main>
      <section className="detail-hero autopsy-detail-hero">
        <div className="shell detail-hero-grid">
          <div>
            <Link className="back-link" href="/corporate-autopsies">← All Corporate Autopsies</Link>
            <p className="eyebrow light">Corporate Autopsy · {report.timePeriod}</p>
            <h1>{report.title.replace("Corporate Autopsy: ", "")}</h1>
            <p className="detail-deck">{report.mainBusinessProblem}</p>
          </div>
          <aside className="verdict-card">
            <span>Crisis / outcome</span>
            <strong>{report.crisisOutcome}</strong>
            <small>{report.industry} · {report.readTime} read</small>
          </aside>
        </div>
      </section>

      <article className="shell longform-layout">
        <aside className="longform-rail">
          <span>Report structure</span>
          <ol>
            <li>Executive summary</li>
            <li>Background</li>
            <li>Root causes</li>
            <li>Timeline</li>
            <li>Business impact</li>
            <li>What could change</li>
            <li>Student takeaways</li>
            <li>Sources</li>
          </ol>
        </aside>
        <MarkdownArticle markdown={report.markdown} />
      </article>
    </main>
  );
}
