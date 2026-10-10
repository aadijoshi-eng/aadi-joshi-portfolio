import type { Metadata } from "next";
import { PageIntro } from "@/site/components/PageIntro";
import { researchSummary } from "@/site/lib/research-summary";

export const metadata: Metadata = { title: "Methodology" };

const variables = [
  ["Employer-startup rate", "Firm-age-zero establishments ÷ lagged active establishments × 1,000", "Census BDS", "Label year t; flow spans March t−1 to March t"],
  ["Branch density", "Full-service branches (BRSERTYP 11/12) ÷ population × 10,000", "FDIC SOD + BEA", "Frozen: June 30 t−1, inside outcome interval; A4: June 30 t−2"],
  ["Unemployment", "Annual-average county unemployment rate", "BLS LAUS", "Frozen: t−1; A4: t−2"],
  ["Population", "Natural log of county population", "BEA CAINC1", "Frozen: t−1; A4: t−2"],
  ["Per-capita income", "Natural log of nominal PCPI", "BEA CAINC1", "Frozen: t−1; A4: t−2"],
  ["Nonmetro", "RUCC code 4-9 under the 2013 vintage", "USDA ERS", "Fixed"],
] as const;

const robustness = [
  "Official BDS establishment-entry rate",
  "Startup-job creation intensity",
  "Exclude outcome years 2020-2021",
  "Population-weighted fixed effects",
  "Branch count and one-year branch changes",
  "Deposit HHI in a separate model",
  "First differences",
  "2023 RUCC classification",
  "Large-county leave-one-out checks",
  "Poisson count model with exposure offset",
] as const;

const auditChecks = [
  ["A1", "Firm-age-zero firm-rate measurement check", "−1.821 [−5.645, 2.004]"],
  ["A2", "Exclude final BDS outcome year", "−1.671 [−5.802, 2.460]"],
  ["A3", "Exclude both suppression-affected counties", "−0.291 [−2.770, 2.188]"],
  ["A4", "Clean-preperiod exposure and controls at t−2", "+2.028 [−1.383, 5.439]"],
] as const;

export default function MethodologyPage() {
  const clean = researchSummary.models.cleanPreperiod;

  return (
    <main>
      <PageIntro
        eyebrow="Methodology"
        title="A transparent fixed-effects design with a deliberately narrow claim."
        description="The model compares changes within counties over time, accounting for persistent county differences, common year shocks, and three county controls."
        aside="Fixed effects improve comparability. They do not solve time-varying omitted variables, reverse causality, timing overlap, or measurement error."
      />

      <section className="shell method-overview">
        <div className="method-steps">
          <article><span>01</span><h2>Unit</h2><p>One North Carolina county in one BDS year. The candidate panel covers all 100 counties from 2014 through 2023.</p></article>
          <article><span>02</span><h2>Timing</h2><p>BDS year t covers the transition from March t−1 to March t. The June 30 t−1 branch snapshot falls inside that interval. A4 uses June 30 t−2, before the interval begins.</p></article>
          <article><span>03</span><h2>Inference</h2><p>County and year fixed effects with standard errors clustered by county across 100 clusters.</p></article>
          <article><span>04</span><h2>Claim</h2><p>The model estimates a conditional association. It does not estimate the causal effect of opening or closing a branch.</p></article>
        </div>
      </section>

      <section className="equation-band">
        <div className="shell equation-grid">
          <div><p className="eyebrow light">Internally frozen equation</p><h2>Within-county variation, adjusted for common years.</h2></div>
          <div>
            <div className="equation" role="img" aria-label="Y i t equals a county fixed effect plus a year fixed effect plus beta times branch density at t minus 1 plus gamma times controls at t minus 1 plus an error term.">
              Y<sub>it</sub> = α<sub>i</sub> + λ<sub>t</sub> + βB<sub>i,t−1</sub> + γ′X<sub>i,t−1</sub> + ε<sub>it</sub>
            </div>
            <dl className="equation-key">
              <div><dt>Y<sub>it</sub></dt><dd>Employer-startup establishments per 1,000 lagged active establishments; BDS flow from March t−1 to March t</dd></div>
              <div><dt>B<sub>i,t−1</sub></dt><dd>June 30 full-service branches per 10,000 residents under the frozen dataset-label match; the snapshot falls inside the outcome interval</dd></div>
              <div><dt>X<sub>i,t−1</sub></dt><dd>Unemployment, log population, and log PCPI under the same dataset-label match</dd></div>
              <div><dt>α<sub>i</sub>, λ<sub>t</sub></dt><dd>County and outcome-year fixed effects</dd></div>
            </dl>
          </div>
        </div>
      </section>

      <section className="shell method-section">
        <div className="section-heading-row"><div><p className="eyebrow">Variable dictionary</p><h2>Construction, source, and timing</h2></div><p>Definitions below are binding for the audited provisional release.</p></div>
        <div className="table-scroll"><table className="research-table"><thead><tr><th>Variable</th><th>Construction</th><th>Source</th><th>Timing</th></tr></thead><tbody>{variables.map((row) => <tr key={row[0]}><th scope="row">{row[0]}</th><td>{row[1]}</td><td>{row[2]}</td><td>{row[3]}</td></tr>)}</tbody></table></div>
      </section>

      <section className="shell method-two-column">
        <article>
          <p className="eyebrow">Missingness and inclusion</p>
          <h2>Suppressed is not zero.</h2>
          <ul className="plain-list">
            <li>Remove Census residual county code <code>999</code>.</li>
            <li>Require valid five-character North Carolina FIPS codes.</li>
            <li>Preserve every BDS disclosure flag.</li>
            <li>Keep five age-zero startup cells null when flagged <code>D</code>.</li>
            <li>Retain 995 observations in the frozen headline model and 100 county clusters.</li>
            <li>Record zero core-data merge losses.</li>
          </ul>
        </article>
        <article>
          <p className="eyebrow">Heterogeneity</p>
          <h2>Metro versus nonmetro is an interaction, not two separate stories.</h2>
          <p>The model interacts branch density with the fixed 2013 nonmetro indicator. The metro slope is β; the nonmetro slope is β + θ; θ tests their difference. Wide intervals block a stable heterogeneity claim.</p>
          <div className="method-callout">Seven counties change classification under the 2023 RUCC vintage. The robustness model remains imprecise.</div>
        </article>
      </section>

      <section className="robustness-band">
        <div className="shell robustness-grid">
          <div><p className="eyebrow light">Internally frozen robustness sequence</p><h2>Alternative outcomes, exposures, samples, and functional forms.</h2><p>The plan was frozen internally before estimates but was not externally preregistered. These checks test sensitivity; they cannot repair endogenous branch placement.</p></div>
          <ol>{robustness.map((item, index) => <li key={item}><span>{String(index + 1).padStart(2, "0")}</span>{item}</li>)}</ol>
        </div>
      </section>

      <section className="shell technical-appendix">
        <p className="eyebrow">Final-audit additions</p>
        <h2>Four checks were added transparently after the frozen sequence.</h2>
        <div className="appendix-grid">
          {auditChecks.map((check) => <article key={check[0]}><h3>{check[0]} · {check[1]}</h3><p>{check[2]}. Audit-added diagnostic; county-clustered 95% confidence interval.</p></article>)}
        </div>
        <div className="method-callout">A4 estimates {clean.estimate.toFixed(3)}, SE {clean.stdError.toFixed(3)}, 95% CI [{clean.ciLow.toFixed(3)}, {clean.ciHigh.toFixed(3)}], p = {clean.pValue.toFixed(3)}, N = {clean.n}. Its opposite sign and wide interval do not establish a positive effect. A4 also drops the first outcome year, so the comparison changes both timing and sample.</div>
      </section>

      <section className="shell technical-appendix">
        <p className="eyebrow">Technical appendix</p>
        <h2>Transformation and version rules</h2>
        <div className="appendix-grid">
          <article><h3>Transformations</h3><p>Population and PCPI enter the frozen model in natural logs. Density is scaled per 10,000 residents. Startup activity is scaled per 1,000 lagged active establishments.</p></article>
          <article><h3>Standard errors</h3><p>CR1 county-clustered covariance allows heteroskedasticity and within-county serial correlation. Standard errors are clustered across all 100 counties.</p></article>
          <article><h3>Version</h3><p>Atlas v{researchSummary.version}. Census BDS 2023 time series; branch snapshots 2013-2022; outcome years 2014-2023. Site layer generated {researchSummary.date}.</p></article>
          <article><h3>Reproduction</h3><p>The public display is generated from audited processed outputs. Upstream research scripts, source hashes, exhaustive dictionary, audit log, and exact reproduction instructions are provided on the Data page.</p></article>
        </div>
      </section>
    </main>
  );
}
