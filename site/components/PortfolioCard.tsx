import Link from "next/link";
import type { PortfolioSection } from "@/site/lib/portfolio";

export function PortfolioCard({ project }: { project: PortfolioSection }) {
  return (
    <article className={`portfolio-card portfolio-card-${project.accent}`}>
      <div className="portfolio-card-topline">
        <span>{project.number}</span>
        <span>{project.label}</span>
      </div>
      <div>
        <h3>{project.title}</h3>
        <p>{project.description}</p>
      </div>
      <div className="portfolio-card-footer">
        <span>{project.count}</span>
        <Link href={project.href} aria-label={`Explore ${project.title}`}>
          Explore <span aria-hidden="true">→</span>
        </Link>
      </div>
    </article>
  );
}
