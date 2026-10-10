import Link from "next/link";
import { atlasNavigation, portfolioNavigation } from "@/site/lib/content";

export function Header() {
  return (
    <header className="site-header">
      <div className="header-primary shell">
        <Link className="wordmark" href="/" aria-label="Aadi Joshi research and analysis home">
          <span className="wordmark-mark" aria-hidden="true">AJ</span>
          <span>Aadi Joshi <i>Research &amp; Analysis</i></span>
        </Link>
        <span className="release-badge">Applied economics · finance · Carolina business</span>
      </div>
      <nav className="site-nav" aria-label="Primary navigation">
        <div className="shell nav-scroll">
          {portfolioNavigation.map((item) => (
            <Link href={item.href} key={item.href}>{item.label}</Link>
          ))}
        </div>
      </nav>
      <nav className="atlas-nav" aria-label="Atlas research navigation">
        <div className="shell nav-scroll atlas-nav-scroll">
          <span>Atlas research</span>
          {atlasNavigation.map((item) => (
            <Link href={item.href} key={item.href}>{item.label}</Link>
          ))}
        </div>
      </nav>
    </header>
  );
}
