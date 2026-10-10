import { publicPath } from "@/site/lib/paths";
import type { Metadata } from "next";
import { PageIntro } from "@/site/components/PageIntro";

export const metadata: Metadata = { title: "Data & Sources" };

const sources = [
  { name: "Census Business Dynamics Statistics", use: "Firm-age-zero employer startups, establishment denominators, entry and exit rates, startup jobs", coverage: "Label years 2014-2023; flows span March t−1 to March t", href: "https://www.census.gov/programs-surveys/bds/data/data-tables.html" },
  { name: "FDIC Summary of Deposits", use: "Full-service branch records, counts, branch-assigned deposits, and deposit HHI", coverage: "June 30 snapshots 2012-2022", href: "https://www.fdic.gov/bank-financial-reports/summary-deposits" },
  { name: "BEA CAINC1", use: "County population and nominal per-capita personal income", coverage: "Lagged controls 2012-2022", href: "https://apps.bea.gov/regional/downloadzip.htm" },
  { name: "BLS Local Area Unemployment Statistics", use: "County annual-average unemployment", coverage: "Lagged controls 2013-2022", href: "https://www.bls.gov/lau/" },
  { name: "USDA Rural-Urban Continuum Codes", use: "2013 metro/nonmetro classification; 2023 robustness vintage", coverage: "Fixed county classification", href: "https://www.ers.usda.gov/data-products/rural-urban-continuum-codes/" },
  { name: "Census cartographic boundaries", use: "FIPS-linked interactive county geometry", coverage: "2023 1:500,000 county file", href: "https://www.census.gov/geographies/mapping-files/time-series/geo/cartographic-boundary.html" },
] as const;

const downloads = [
  ["County-year Atlas dataset", publicPath("/downloads/atlas_county_year.csv"), "CSV · 1,000 rows"],
  ["State and metro/nonmetro benchmarks", publicPath("/downloads/state_group_benchmarks.csv"), "CSV · 30 rows"],
  ["Source manifest", publicPath("/downloads/SOURCE_MANIFEST.csv"), "CSV · URLs, coverage, retrieval records, hashes"],
  ["Full working paper", publicPath("/downloads/working_paper.pdf"), "PDF · 24 pages"],
  ["Editable working paper", publicPath("/downloads/working_paper_overleaf_import.zip"), "ZIP · LaTeX source and figures"],
  ["North Carolina policy brief", publicPath("/downloads/nc_policy_brief.pdf"), "PDF · 1 page"],
  ["Presentation outline", publicPath("/downloads/presentation_outline.pdf"), "PDF · 3 pages"],
] as const;

export default function DataPage() {
  return (
    <main>
      <PageIntro
        eyebrow="Data and sources"
        title="Every public value has a source, timing rule, and missing-data state."
        description="The Atlas display layer is generated from audited analytical panel and model tables. It is never edited by hand and can be downloaded below."
        aside="The five disclosure-suppressed startup cells remain blank. They are not imputed and are never treated as zero."
      />

      <section className="shell data-summary">
        <div><span>1,000</span><p>candidate county-years</p></div>
        <div><span>995</span><p>usable startup-rate observations</p></div>
        <div><span>0</span><p>core merge losses</p></div>
        <div><span>100</span><p>valid North Carolina FIPS codes</p></div>
      </section>

      <section className="shell data-section">
        <div className="section-heading-row"><div><p className="eyebrow">Official inputs</p><h2>Source manifest</h2></div><p>Official federal sources are prioritized. Links lead to source documentation or download pages.</p></div>
        <div className="source-list">{sources.map((source, index) => <article key={source.name}><span>{String(index + 1).padStart(2, "0")}</span><div><h3>{source.name}</h3><p>{source.use}</p></div><p>{source.coverage}</p><a href={source.href}>Official source <span aria-hidden="true">↗</span></a></article>)}</div>
      </section>

      <section className="downloads-band">
        <div className="shell downloads-grid">
          <div><p className="eyebrow light">Public downloads</p><h2>Inspect the paper, panel, and benchmark layer.</h2><p>Processed files are derived from public federal data. Consult the source manifest and original agencies for authoritative definitions and usage notes.</p></div>
          <div className="download-list">{downloads.map((item) => <a href={item[1]} key={item[0]}><span><strong>{item[0]}</strong><small>{item[2]}</small></span><i aria-hidden="true">↓</i></a>)}</div>
        </div>
      </section>

      <section className="shell dictionary-section">
        <div className="section-heading-row"><div><p className="eyebrow">Display dictionary</p><h2>What the public measures mean</h2></div><p>The paper provides the full variable definitions and model specifications.</p></div>
        <div className="dictionary-grid">
          <article><h3>Employer-startup rate</h3><p>Firm-age-zero establishments divided by lagged active establishments, multiplied by 1,000.</p><dl><div><dt>Source</dt><dd>Census BDS</dd></div><div><dt>Coverage</dt><dd>Employer businesses only</dd></div><div><dt>Missing</dt><dd>Five disclosure-suppressed cells</dd></div></dl></article>
          <article><h3>Full-service branch density</h3><p>FDIC SOD branches with BRSERTYP 11 or 12 divided by BEA population, multiplied by 10,000.</p><dl><div><dt>Source</dt><dd>FDIC + BEA</dd></div><div><dt>Timing</dt><dd>June t−1 overlaps the BDS flow; A4 uses June t−2</dd></div><div><dt>Not equivalent to</dt><dd>Distance or credit access</dd></div></dl></article>
          <article><h3>Startup-job intensity</h3><p>Jobs created by age-zero establishment births divided by lagged county employment, multiplied by 1,000.</p><dl><div><dt>Source</dt><dd>Census BDS</dd></div><div><dt>Role</dt><dd>Alternative outcome</dd></div><div><dt>Missing</dt><dd>Disclosure flags preserved</dd></div></dl></article>
          <article><h3>Metro/nonmetro</h3><p>Nonmetro equals USDA 2013 RUCC codes 4-9; metro equals codes 1-3.</p><dl><div><dt>Source</dt><dd>USDA ERS</dd></div><div><dt>Timing</dt><dd>Fixed 2013 vintage</dd></div><div><dt>Limit</dt><dd>Broad county classification</dd></div></dl></article>
        </div>
      </section>

      <section className="shell usage-notes">
        <article><p className="eyebrow">Redistribution</p><h2>Public inputs, documented derivatives.</h2><p>The Atlas distributes derived county-year values and Census county geometry. It does not redistribute restricted microdata. FDIC office deposits are assigned to branches and should not be read as deposits of residents or firms in that county.</p></article>
        <article><p className="eyebrow">Reproduction boundary</p><h2>The website does not re-estimate the paper.</h2><p>The display pipeline validates and reshapes audited outputs, including exact M2 and A4 checks. Upstream scripts recreate the panel and models; all 31 reported effects were also reconstructed independently.</p></article>
      </section>
    </main>
  );
}
