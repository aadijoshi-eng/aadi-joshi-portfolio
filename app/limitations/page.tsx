import { publicPath } from "@/site/lib/paths";
import type { Metadata } from "next";
import Link from "next/link";
import { PageIntro } from "@/site/components/PageIntro";

export const metadata: Metadata = { title: "Limitations" };

const limitations = [
  ["Not causal", "County and year fixed effects do not isolate an exogenous branch shock. Banks may contract where expected local activity is already weakening."],
  ["Density is not access", "Branches per 10,000 residents do not measure distance, drive time, service quality, relationship continuity, or credit availability."],
  ["Incomplete financial network", "The measure omits credit unions, nonbank community-development financial institutions, fintech lenders, and other nonbank providers. It measures qualifying FDIC bank offices, not the full network of financial services."],
  ["Employer businesses only", "Census BDS excludes nonemployer businesses, so the outcome cannot represent all entrepreneurs or business applications."],
  ["County aggregation", "County averages can hide neighborhood branch deserts, cross-border alternatives, and different conditions within large urban or rural counties."],
  ["Exposure timing overlap", "The frozen June t−1 branch snapshot falls inside the BDS outcome interval, which runs from March t−1 to March t. A4 uses June t−2, drops the first outcome year, and produces a positive but imprecise estimate. The comparison changes timing and sample together."],
  ["Limited power", "The headline interval is wide, and rural interaction intervals are wider. A null-crossing interval does not prove no relationship."],
  ["Model dependence", "A negative Poisson estimate is conventionally distinguishable from zero while continuous-rate and branch-count models are inconclusive."],
] as const;

export default function LimitationsPage() {
  return (
    <main>
      <PageIntro
        eyebrow="Limitations"
        title="The limits are part of the result, not a footnote to it."
        description="This project measures county-level conditional associations. It cannot tell policymakers what would happen if a branch opened, closed, or changed its services."
        aside="The strongest surviving criticism is endogenous branch placement combined with an imperfect access proxy. No county-level robustness check fixes that."
      />

      <section className="limitation-banner">
        <div className="shell"><span>Do not conclude:</span><p>“Branch closures caused fewer startups,” “branches do not matter,” or “opening offices would increase entrepreneurship.” None is identified by this design.</p></div>
      </section>

      <section className="shell limitation-grid">{limitations.map((item, index) => <article key={item[0]}><span>{String(index + 1).padStart(2, "0")}</span><h2>{item[0]}</h2><p>{item[1]}</p></article>)}</section>

      <section className="claims-boundary">
        <div className="shell claims-grid">
          <article><p className="eyebrow light">What this project can say</p><ul><li>North Carolina’s qualifying full-service branch count fell 21.8% from 2013 to 2022.</li><li>The public panel contains all 100 counties and ten outcome years.</li><li>The internally frozen estimate is negative and imprecise.</li><li>The audit-added clean-preperiod estimate is positive and imprecise.</li><li>The evidence establishes no precise, temporally stable sign.</li><li>Practical access requires better measurement than county branch density.</li></ul></article>
          <article><p className="eyebrow light">What this project cannot say</p><ul><li>Closing a branch changed a county’s startup rate.</li><li>The estimate applies to nonemployer businesses.</li><li>Metro and nonmetro effects are meaningfully different.</li><li>Branch density captures online banking or local credit supply.</li><li>The observed association generalizes beyond North Carolina or after 2023.</li></ul></article>
        </div>
      </section>

      <section className="shell stronger-design">
        <div><p className="eyebrow">A stronger next study</p><h2>Geocode closures. Measure travel. Find plausibly exogenous variation.</h2></div>
        <div><p>The next credible design would link exact office closures to smaller geographic areas, calculate road-network travel time, incorporate cross-border alternatives and credit unions, test pretrends, and use merger-related consolidation exposure or another defensible source of variation.</p><p>That is a future research agenda. It is not an extension silently added to this paper.</p><div className="action-row"><Link className="button primary" href="/methodology">Review the current design</Link><a className="button secondary" href={publicPath("/downloads/working_paper.pdf")}>Read the full paper</a></div></div>
      </section>
    </main>
  );
}
