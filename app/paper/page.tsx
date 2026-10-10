import { publicPath } from "@/site/lib/paths";
import type { Metadata } from "next";
import { PageIntro } from "@/site/components/PageIntro";

export const metadata: Metadata = { title: "Paper & About" };

export default function PaperPage() {
  return (
    <main>
      <PageIntro
        eyebrow="Paper and about"
        title="A reproducible working paper, translated for public use."
        description="The Atlas is the public-facing extension of one research project. It is not a separate paper, activity, or causal claim."
        aside="Status: provisional working paper. Not published, accepted, peer reviewed, or under journal review."
      />

      <section className="shell paper-feature">
        <div className="paper-cover" aria-hidden="true"><span>Working paper</span><strong>Bank Branch Network Contraction and Employer Startup Activity</strong><small>North Carolina Counties · 2014-2023</small></div>
        <div>
          <p className="eyebrow">Full research package</p>
          <h2>Read the evidence at the level you need.</h2>
          <p>The 24-page working paper contains the literature, data construction, fixed-effects design, timing correction, clean-preperiod diagnostic, secondary Poisson result, and limitations. It retains all four research figures and the complete appendix tables. The policy brief and presentation provide shorter entry points.</p>
          <div className="paper-downloads">
            <a className="button primary" href={publicPath("/downloads/working_paper.pdf")}>Working paper · PDF</a>
            <a className="button secondary" href={publicPath("/downloads/working_paper_overleaf_import.zip")}>Editable paper · Overleaf ZIP</a>
            <a className="button secondary" href={publicPath("/downloads/nc_policy_brief.pdf")}>Policy brief · PDF</a>
            <a className="button secondary" href={publicPath("/downloads/presentation_outline.pdf")}>Presentation · PDF</a>
          </div>
        </div>
      </section>

      <section className="about-band">
        <div className="shell about-grid">
          <article>
            <p className="eyebrow light">Project purpose</p>
            <h2>Make the research legible without making it louder than the evidence.</h2>
            <p>This public data product helps readers explore county patterns, compare the internally frozen label-aligned estimate with the audit-added clean-preperiod estimate, understand denominators and timing, and audit the sources. It foregrounds uncertainty and gives equal visibility to the limitations.</p>
          </article>
          <article className="researcher-bio">
            <p className="eyebrow light">Researcher</p>
            <h2>Aadi Joshi</h2>
            <p>Aadi Joshi is a North Carolina high school student interested in applied economics, data analysis, banking, and corporate finance. His research examines bank-branch networks and employer-startup activity across all 100 North Carolina counties.</p>
            <dl><div><dt>Location</dt><dd>North Carolina</dd></div><div><dt>Paper revised</dt><dd>October 4, 2026</dd></div></dl>
          </article>
        </div>
      </section>

      <section className="shell status-section">
        <div><p className="eyebrow">Research status</p><h2>A provisional working paper</h2></div>
        <div><p>The internal audit checks calculations, sources, code, and consistency. It is not external peer review. The paper is not published, accepted, or under journal review.</p><p>The estimates describe conditional associations. Fixed effects do not resolve endogenous branch placement, the original timing overlap, or the limits of county-level measurement.</p></div>
      </section>

      <section className="shell public-data-note">
        <p><strong>Public-data note:</strong> All analytical inputs are from official federal sources. The project uses aggregate public data and does not contain personal, student-level, borrower-level, or proprietary bank data.</p>
        <p><strong>Version:</strong> v1.0.1-provisional · data through BDS 2023 and FDIC SOD 2022 · paper and site revised October 4, 2026.</p>
      </section>
    </main>
  );
}
