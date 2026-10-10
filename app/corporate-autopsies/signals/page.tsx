import type { Metadata } from "next";
import Link from "next/link";
import { CorporateSignalsMap } from "@/site/components/CorporateSignalsMap";

export const metadata: Metadata = {
  title: "Corporate Signals Map",
  description: "A source-linked monitoring map of publicly documented company pressures and positive signals. Not investment advice.",
};

export default function CorporateSignalsPage() {
  return (
    <main>
      <section className="detail-hero autopsy-detail-hero signals-hero">
        <div className="shell detail-hero-grid">
          <div>
            <Link className="back-link" href="/corporate-autopsies">← Corporate Autopsies</Link>
            <p className="eyebrow light">Current-company research</p>
            <h1>Corporate Signals Map</h1>
            <p className="detail-deck">A transparent reading map of public earnings, balance-sheet, execution, operating, and rate-sensitivity signals. It does not tell anyone what to buy or sell.</p>
          </div>
          <aside className="verdict-card signals-verdict-card">
            <span>How to read it</span>
            <strong>Evidence, not a magic score.</strong>
            <small>Green = documented positive. Amber = monitor. Red = elevated pressure. Gray = no call from the current source record.</small>
          </aside>
        </div>
      </section>

      <section className="shell signals-method-grid">
        <div>
          <p className="eyebrow">Method</p>
          <h2>Five lenses. One source rule.</h2>
          <p>Each color must point to a current company filing, regulator record, or official results release. A flag is removed or changed when the evidence changes. The goal is to make claims testable, not to convert incomplete public information into a 4/10 or a price prediction.</p>
        </div>
        <aside>
          <p className="eyebrow">Important limits</p>
          <ul>
            <li>Public filings can be delayed, incomplete, or influenced by management judgment.</li>
            <li>A favorable flag does not cancel a red flag elsewhere.</li>
            <li>“No call assigned” means the record is not strong enough for a claim, not that risk is absent.</li>
          </ul>
        </aside>
      </section>

      <section className="shell signals-map-section">
        <div className="section-heading-row">
          <div>
            <p className="eyebrow">Launch watchlist</p>
            <h2>Follow the evidence, then update the view.</h2>
          </div>
          <p>The initial four-company set deliberately mixes an acquisition-integration case, an operational-recovery case, a rate-sensitive finance model, and a leveraged media company.</p>
        </div>
        <CorporateSignalsMap />
      </section>
    </main>
  );
}
