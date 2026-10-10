import { publicPath } from "@/site/lib/paths";
import Link from "next/link";
import { PROJECT_DATE, PROJECT_VERSION } from "@/site/lib/content";

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="shell footer-grid">
        <div>
          <p className="eyebrow light">Independent student work</p>
          <p className="footer-title">Research, valuation, corporate analysis, and Carolina business.</p>
          <p className="footer-note">The North Carolina Banking &amp; Startup Opportunity Atlas remains the flagship research project. Dated conclusions, source links, and material limitations stay visible throughout the portfolio.</p>
        </div>
        <div className="footer-meta">
          <p>Atlas: {PROJECT_VERSION}</p>
          <p>Research release: {PROJECT_DATE}</p>
          <div className="footer-links">
            <Link href="/projects">All projects</Link>
            <Link href="/valuation">Valuation</Link>
            <Link href="/corporate-autopsies">Autopsies</Link>
            <Link href="/carolina-business-brief">Business Brief</Link>
            <Link href="/limitations">Limitations</Link>
            <Link href="/data">Sources & downloads</Link>
            <a href={publicPath("/downloads/working_paper.pdf")}>Working paper</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
