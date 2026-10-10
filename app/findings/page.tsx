import { publicPath } from "@/site/lib/paths";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PageIntro } from "@/site/components/PageIntro";
import { researchSummary } from "@/site/lib/research-summary";

export const metadata: Metadata = { title: "Findings" };

const signed = (value: number, digits = 3) => {
  const magnitude = Math.abs(value).toFixed(digits);
  return value < 0 ? `−${magnitude}` : `+${magnitude}`;
};

const modelLabels: Record<string, string> = {
  M1: "County + year FE",
  M2: "FE + label-aligned controls (internally frozen)",
  M3_metro: "Metro slope",
  M3_nonmetro: "Nonmetro slope",
  M4: "Official BDS entry rate",
  M5: "Startup-job intensity",
  A4: "Clean-preperiod t−2 (audit-added)",
};

const estimates = researchSummary.models.selectedModels.map((model) => [
  modelLabels[model.specId] ?? model.label,
  signed(model.estimate),
  `${signed(model.ciLow)} to ${signed(model.ciHigh)}`,
  model.n.toLocaleString(),
]);

export default function FindingsPage() {
  const frozen = researchSummary.models.frozenHeadline;
  const clean = researchSummary.models.cleanPreperiod;
  const poisson = researchSummary.models.poisson;

  return (
    <main>
      <PageIntro
        eyebrow="Public findings"
        title="A clear network contraction. No precise, temporally stable association."
        description="The descriptive change is large. The internally frozen estimate is negative and imprecise; the audit-added clean-preperiod estimate is positive and imprecise."
        aside="Both confidence intervals cross zero, and their signs differ. This design does not establish a stable direction or a causal effect."
      />

      <section className="shell evidence-split">
        <article>
          <p className="eyebrow">Descriptive evidence</p>
          <h2>North Carolina lost 556 qualifying full-service branches.</h2>
          <p>FDIC Summary of Deposits records show 2,554 qualifying offices in 2013 and 1,998 in 2022, a 21.8% decline. Statewide branch density fell 28.4%, from 2.606 to 1.865 branches per 10,000 residents.</p>
          <dl className="finding-facts">
            <div><dt>Counties ending with fewer branches</dt><dd>88</dd></div>
            <div><dt>Counties ending unchanged</dt><dd>11</dd></div>
            <div><dt>Counties ending with more</dt><dd>1</dd></div>
          </dl>
        </article>
        <article className="regression-result">
          <p className="eyebrow light">Internally frozen, label-aligned model</p>
          <div className="estimate-main"><span>Adjusted slope</span><strong>{signed(frozen.estimate)}</strong></div>
          <div className="interval-track" aria-label={`95 percent confidence interval from ${signed(frozen.ciLow)} to ${signed(frozen.ciHigh)}, centered on estimate ${signed(frozen.estimate)}`}>
            <span className="zero-line" />
            <span className="interval-line" />
            <span className="estimate-dot" />
          </div>
          <div className="interval-labels"><span>{signed(frozen.ciLow)}</span><span>0</span><span>{signed(frozen.ciHigh)}</span></div>
          <p>95% county-clustered confidence interval. N = {frozen.n} county-years; {frozen.clusters} county clusters; p = {frozen.pValue.toFixed(3)}. The June t−1 snapshot falls inside the BDS outcome interval.</p>
        </article>
      </section>

      <section className="findings-meaning">
        <div className="shell meaning-grid">
          <div><p className="eyebrow light">Correct interpretation</p><h2>The evidence does not establish a stable directional relationship.</h2></div>
          <div>
            <p>The internally frozen plan predicted a positive association, but it was not externally preregistered. Its label-aligned estimate points negative while the clean-preperiod audit points positive; neither is precise.</p>
            <p>Therefore the study cannot conclude that branches increase startups, suppress startups, or do not matter. Its contribution is a transparent public panel, a fully disclosed timing correction, and an honest boundary on what the design can identify.</p>
          </div>
        </div>
      </section>

      <section className="shell results-table-section">
        <div className="section-heading-row">
          <div><p className="eyebrow">Model sequence</p><h2>Internally frozen and audit-added estimates</h2></div>
          <p>The frozen sequence uses the June t−1 exposure label. A4 moves exposure and controls to t−2 so they predate the BDS March-to-March outcome interval.</p>
        </div>
        <div className="table-scroll">
          <table className="research-table">
            <thead><tr><th>Specification / outcome</th><th>Estimate</th><th>95% CI</th><th>N</th></tr></thead>
            <tbody>{estimates.map((row) => <tr key={row[0]}><th scope="row">{row[0]}</th><td>{row[1]}</td><td>{row[2]}</td><td>{row[3]}</td></tr>)}</tbody>
          </table>
        </div>
        <p className="table-note">All rows include county and outcome-year fixed effects. M2-M5 use label-aligned t−1 controls; A4 uses t−2 exposure and controls. Uncertainty is clustered by county.</p>
      </section>

      <section className="shell visual-findings">
        <figure><Image src={publicPath("/figures/coefficient-plot.png")} alt="Coefficient plot showing mostly negative and imprecise internally frozen estimates with confidence intervals crossing zero." width={2589} height={1342} sizes="(max-width: 920px) 95vw, 54vw" unoptimized /><figcaption><strong>Internally frozen continuous models.</strong> Most intervals include zero. Source: audited model outputs.</figcaption></figure>
        <figure><Image src={publicPath("/figures/metro-nonmetro-slopes.png")} alt="Coefficient plot comparing metro and nonmetro branch-density slopes with wide overlapping confidence intervals." width={2295} height={1120} sizes="(max-width: 920px) 95vw, 42vw" unoptimized /><figcaption><strong>Metro/nonmetro heterogeneity.</strong> Point estimates differ, but the difference is not precise.</figcaption></figure>
      </section>

      <section className="shell secondary-result">
        <div><p className="eyebrow">Critical timing audit</p><h2>Moving exposure before the full outcome interval reverses the point-estimate sign.</h2></div>
        <div><p>A4 estimates {signed(clean.estimate)} (95% CI {signed(clean.ciLow)} to {signed(clean.ciHigh)}; p = {clean.pValue.toFixed(3)}; N = {clean.n}). The June t−2 exposure precedes the March t−1 start of the BDS flow.</p><p>This does not prove a positive effect. A4 also drops the first outcome year, so it changes both timing and sample. Read with the frozen {signed(frozen.estimate)} estimate, the evidence remains imprecise and does not establish a stable direction.</p></div>
      </section>

      <section className="shell secondary-result">
        <div><p className="eyebrow">Model-dependent secondary result</p><h2>The Poisson specification is negative and conventionally distinguishable from zero.</h2></div>
        <div><p>Its log coefficient is {signed(poisson.estimate, 4)} (95% CI {signed(poisson.ciLow, 4)} to {signed(poisson.ciHigh, 4)}; p = {poisson.pValue.toFixed(3)}), corresponding to an incidence-rate ratio of {Math.exp(poisson.estimate).toFixed(3)}. It is reported, not promoted: it changes the functional form, shares the same endogenous exposure, and appears within a larger model sequence.</p><p>A single secondary result does not override the timing-sensitive, imprecise evidence.</p></div>
      </section>

      <section className="shell findings-next">
        <p className="eyebrow">Where the evidence points next</p>
        <h2>Measure actual access at smaller geographies.</h2>
        <p>A stronger next design would use geocoded closure events, road-network travel time, sub-county outcomes, and plausibly exogenous merger-related variation. Until then, the defensible policy implication is better monitoring, not a causal claim.</p>
        <div className="action-row"><Link className="button primary" href="/methodology">Inspect the design</Link><Link className="button secondary" href="/limitations">Read every limitation</Link></div>
      </section>
    </main>
  );
}
