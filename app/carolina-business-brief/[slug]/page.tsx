import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MarkdownArticle } from "@/site/components/MarkdownArticle";
import { carolinaBusinessBriefDrafts } from "@/site/lib/editorial-projects";

type PageProps = { params: Promise<{ slug: string }> };

function findArticle(slug: string) {
  return carolinaBusinessBriefDrafts.find((article) => article.slug === slug);
}

export function generateStaticParams() {
  return carolinaBusinessBriefDrafts.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = findArticle(slug);
  if (!article) return {};
  const title = article.title;
  const description = article.deck ?? "A Carolina Business Brief research draft.";
  return {
    title,
    description,
    openGraph: { title, description, images: [] },
    twitter: { card: "summary", title, description, images: [] },
  };
}

export default async function CarolinaBusinessBriefArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const article = findArticle(slug);
  if (!article || !article.markdown) notFound();

  return (
    <main>
      <article>
        <header className="brief-article-header shell">
          <Link className="back-link dark" href="/carolina-business-brief">← All Carolina Business Brief articles</Link>
          <p className="eyebrow">{article.category} · Research draft</p>
          <h1>{article.title}</h1>
          <p className="brief-article-deck">{article.deck}</p>
          <div className="brief-byline">
            <span>{article.author}</span>
            <span>{article.date}</span>
            <span>{article.estimatedReadTime}</span>
          </div>
          <div className="tag-list" aria-label="Article tags">
            {article.tags.map((tag) => <span key={tag}>{tag}</span>)}
          </div>
        </header>
        <div className="brief-article-rule" />
        <div className="shell brief-longform-layout">
          <aside className="article-note">
            <span>Carolina Business Brief</span>
            <p>Source-linked portfolio research draft. Figures and commitments are presented as of the article date.</p>
          </aside>
          <MarkdownArticle markdown={article.markdown} />
        </div>
      </article>
    </main>
  );
}
