export type WebValuationReport = Readonly<{
  slug: "copart" | "cava" | "adp";
  title: string;
  wordCount: number;
  sections: readonly Readonly<{
    heading: string;
    paragraphs: readonly string[];
  }>[];
}>;

const reportContent: readonly Omit<WebValuationReport, "wordCount">[] = [
  {
    "slug": "copart",
    "title": "Copart, Inc. (NASDAQ: CPRT) Investment Report",
    "sections": [
      {
        "heading": "Valuation view",
        "paragraphs": [
          "The base DCF supports $24.48 per share against the $28.91 reference price, a 15.3% shortfall. Higher insurer volumes and fees support revenue growth, but maintaining yard capacity limits distributable cash. The upside operating case reaches $30.59. The base terminal value implies 9.00x final-year EBITDA.",
          "The downside case produces $20.28 per share. Scenario values change operating and terminal assumptions. They are model comparisons, not probability estimates. The equivalent multiple reconciles the base terminal assumptions."
        ]
      },
      {
        "heading": "Operating case",
        "paragraphs": [
          "FY2025 service revenue was $3.97 billion and owned-vehicle sales were $678.3 million. The forecast separates the fee business from gross vehicle sales because their margins differ. Insurance companies supplied 81% of processed vehicles; the model uses that count share as a proxy for allocating U.S. service revenue. Seller-type revenue and absolute annual vehicle counts are not disclosed.",
          "FY2026 is estimated from nine-month results plus a fourth-quarter case. It produces $4.67 billion of revenue but receives zero future cash-flow PV because the fiscal year ended on July 31, before the valuation date. Future value uses the remaining FY2027 period and FY2028-FY2030. Nine-month April revenue and EBIT were $3.51 billion and $1.28 billion.",
          "The base reaches $5.92 billion of revenue and 38.1% EBIT margin by FY2030. U.S. insurer volume growth slows from 4.5% to 3.3% and fee growth from 2.6% to 2.0%. Facility costs improve modestly to 48.5% of service revenue and G&A to 8.5% of total revenue. Throughput and cost absorption must improve while service quality and insurer relationships hold."
        ]
      },
      {
        "heading": "Cash generation and investment",
        "paragraphs": [
          "Base CapEx remains at least 10% of revenue, reaching $592.13 million in FY2030. FY2025 PP&E purchases were $568.99 million, approximately 12.2% of revenue. The forecast continues to fund land, yards and operating capacity and deducts all projected spending. Forecast acquisitions are zero, so the revenue case assumes organic growth.",
          "Final-year FCFF is $1,449.22 million and normalized terminal FCFF is $1,490.15 million at 2.75% growth. The terminal retains the final investment ratio and normalizes working-capital additions. Terminal value contributes 79.3% of EV; the four-year forward horizon makes long-run capital efficiency particularly consequential."
        ]
      },
      {
        "heading": "Required return and sensitivity",
        "paragraphs": [
          "WACC is 9.32%. Beta of 1.11 is an explicit analyst assumption about systematic risk, not a reproduced provider quote or regression. The 4.63% Treasury rate is dated August 5; 4.23% ERP is the selected 2025 estimate published in January. Estimated finance debt has an immaterial weight. Its 6.38% borrowing cost is an indicative spread assumption.",
          "Reducing WACC by one percentage point produces $28.39 per share; raising it by one point produces $21.60. Reducing terminal growth by half a percentage point produces $23.20; raising it by half a point produces $25.97. These are independent changes with the remaining assumptions held fixed."
        ]
      },
      {
        "heading": "Equity bridge and disclosure limits",
        "paragraphs": [
          "The cash proxy includes $3,513.16 million of disclosed equivalents and Treasury securities. It excludes $686.55 million whose cash/restricted-cash split is unclassified and retains a $701.01 million reserve. The bridge deducts a $17.181 million minority claim and $2.694 million estimated finance lease claim. The 932.288482 million diluted denominator combines the May basic count with latest award dilution.",
          "The cash policy is conservative and does not certify each dollar’s legal availability. Foreign cash is earmarked within the existing reserve, avoiding a second deduction. The finance lease estimate assumes no undisclosed additions, remeasurements or exchange-rate changes after the last separately disclosed balance.",
          "The model discounts at fiscal year-end using actual days / 365. The first future period is prorated by remaining fiscal days. This approximates evenly timed cash generation; seasonal spending can change the remaining-period cash flow. Market inputs and company disclosures are kept at or before the stated cutoff."
        ]
      },
      {
        "heading": "Terminal assumptions and evidence",
        "paragraphs": [
          "The reference price exceeds the base value and lies near the upside operating case. The equivalent 9.00x EBITDA multiple reproduces $24.48 per share. Salvage demand, insurer contracts and new land requirements can weaken volume or margin. A lower required return raises the base value.",
          "The report and workbook identify the FY2025 Form 10-K, Q3 FY2026 Form 10-Q, Treasury yield data, Damodaran’s historical ERP series and the August 5 closing price. The downloadable report contains the source references; the workbook Sources sheet gives the URLs and locations."
        ]
      }
    ]
  },
  {
    "slug": "cava",
    "title": "CAVA Group (NYSE: CAVA) Investment Report",
    "sections": [
      {
        "heading": "Valuation view",
        "paragraphs": [
          "The base DCF supports $30.70 per share against the $66.17 reference price, a 53.6% shortfall. The business expands substantially in the forecast, yet cash construction costs and required reinvestment absorb part of the operating gains. The terminal value implies 6.89x final-year EBITDA under 3% growth and 20% incremental ROIC.",
          "The downside and upside cases produce $14.55 and $47.92 per share. Scenario values change operating and terminal assumptions. They are model comparisons, not probability estimates. The equivalent multiple reconciles the base terminal assumptions."
        ]
      },
      {
        "heading": "Operating case",
        "paragraphs": [
          "CAVA ended FY2025 with 439 restaurants and reported mature-store AUV of $2.934 million. May guidance called for 75-77 FY2026 openings, 4.5%-6.5% same-restaurant sales growth and 23.7%-24.3% restaurant-level margin. The base starts at the midpoints and reaches 1,271 restaurants, $4.10 million mature AUV and $5.06 billion of revenue by FY2035. Later-year inputs are estimates.",
          "The revenue build distinguishes opening cohorts: 45% of mature annual sales in the first year, 90% in the second and 100% thereafter. Both timing and immature productivity affect the opening-year factor. Mature AUV is based on full trailing 13-period sales; it does not establish the productivity of every new store.",
          "Restaurant-level margin reaches 25.7% and G&A falls to 6.8% of revenue. After depreciation, opening costs, noncash charges and the retained Other segment loss margin, FY2035 EBIT margin is 12.7%. Successful sites, labor efficiency and repeat demand are therefore essential. The forecast carries the FY2025 Other loss margin rather than assuming immediate break-even."
        ]
      },
      {
        "heading": "Cash generation and investment",
        "paragraphs": [
          "Cash construction costs start at $1.80 million per opening and rise 3% annually to $2.35 million. The base retains $15 million of annual shared infrastructure spending. Final-year CapEx is $255.35 million versus $227.84 million of D&A. The capital-asset schedule makes the implied investment visible.",
          "Noncash impairment and disposal losses are added back after reducing operating profit. The normalized 25% cash-tax assumption applies to EBIT before those write-downs, avoiding an assumed immediate tax benefit. The cash-tax treatment does not forecast NOL utilization. Company statements separately identify the noncash adjustment."
        ]
      },
      {
        "heading": "Required return and sensitivity",
        "paragraphs": [
          "WACC is 9.98%, using a selected beta of 1.265. Half comes from a 1.75 company operating-risk assumption and half from the January 2026 restaurant cash-corrected operating beta of 0.78. The company value and weighting are judgments. Industry lease conventions and business mix limit comparability. The Treasury rate is 4.63%, ERP is 4.23% and funded debt is zero.",
          "Reducing WACC by one percentage point produces $36.82 per share; raising it by one point produces $26.17. Reducing terminal growth by half a percentage point produces $29.79; raising it by half a point produces $31.74. A one-percentage-point reduction in every explicit-year EBIT margin lowers value to $27.93. Terminal ROIC of 15% produces $29.48; 25% produces $31.43. Cohort sales and construction spending are more useful operating checks than the opening count alone."
        ]
      },
      {
        "heading": "Equity bridge and disclosure limits",
        "paragraphs": [
          "The bridge adds $302.96 million of cash and liquid securities after a $100 million operating reserve, plus the separate $10.715 million Hyphen note. Rent stays in operating expenses, so operating lease liabilities are not deducted again. Diluted shares are estimated at 118.448856 million. Cash is from April 19 and basic shares from May 12.",
          "The model discounts at fiscal year-end using actual days / 365. The first future period is prorated by remaining fiscal days. This approximates evenly timed cash generation; seasonal spending can change the remaining-period cash flow. Market inputs and company disclosures are kept at or before the stated cutoff."
        ]
      },
      {
        "heading": "Terminal assumptions and evidence",
        "paragraphs": [
          "At 3% terminal growth and 20% incremental ROIC, terminal FCFF is $418.12 million. Growth slows below the final explicit-year pace. Terminal value contributes 73.7% of EV. The equivalent 6.89x final-year EBITDA multiple reproduces $30.70 per share. It is derived from the same growth, required return and reinvestment assumptions.",
          "The report and workbook identify the FY2025 Form 10-K, Q1 FY2026 Form 10-Q, May earnings guidance, Treasury yield data, Damodaran’s ERP and sector beta datasets, and the August 5 closing price. The downloadable report contains the source references; the workbook Sources sheet gives the URLs and locations."
        ]
      }
    ]
  },
  {
    "slug": "adp",
    "title": "Automatic Data Processing (NASDAQ: ADP) Investment Report",
    "sections": [
      {
        "heading": "Valuation view",
        "paragraphs": [
          "The base DCF supports $236.08 per share, 12.6% below the $270.09 reference price. Recurring payroll revenue supports the operating case, but the price requires stronger long-run cash economics or a lower required return. The base case offers no margin of safety at the reference price.",
          "The downside and upside cases produce $173.25 and $292.74 per share. Scenario values change operating and terminal assumptions. They are model comparisons, not probability estimates. The equivalent multiple reconciles the base terminal assumptions."
        ]
      },
      {
        "heading": "Operating case",
        "paragraphs": [
          "ADP reported FY2026 revenue of $21.95 billion and operating EBIT of $5.78 billion. Management’s FY2027 outlook called for 5%-6% revenue growth and approximately 23% adjusted tax. The forecast reaches $28.19 billion of revenue and a 29.0% operating margin in FY2031. The forecast uses GAAP operating profit; the adjusted margin outlook provides context rather than an exact accounting match.",
          "The revenue build separates core HCM fees, net PEO services, benefit reimbursements and client-funds interest. Benefit reimbursements contribute no direct profit. Fee revenue drives operating depreciation and capital spending. Client-funds contribution deducts a 3% portfolio administration and liquidity allowance from interest revenue. That allowance is an estimate, not a company-reported cost ratio.",
          "Higher client yields improve earnings substantially because most incremental interest reaches operating profit. Employment, retention and service pricing govern the fee business. The model preserves separate client assets and client obligations rather than treating payroll balances as corporate wealth."
        ]
      },
      {
        "heading": "Cash generation and investment",
        "paragraphs": [
          "Deferred contract costs remain part of operating investment. FY2026 cash additions were $1,307.9 million, amortization was $1,200.5 million and the ending contract asset was $3,244.1 million. The explicit schedule deducts net contract investment once. Final-year FCFF is $6,095.3 million.",
          "Terminal growth is 2.75%, with 25% incremental ROIC in the base case. This requires $711.4 million of first-terminal-year net investment and produces $5,756.0 million of terminal FCFF. The return assumes continuing pricing and renewal advantages. At 20% ROIC, value falls to $230.25; at 30%, it rises to $239.97. These returns are forecast judgments."
        ]
      },
      {
        "heading": "Required return and sensitivity",
        "paragraphs": [
          "WACC is 8.00%. The selected beta of 0.839 starts from the January 2026 cash-corrected operating beta of 0.81 for business and consumer services and applies ADP’s corporate debt-to-equity ratio. The 4.63% Treasury rate is dated August 5; the 4.23% ERP is the selected 2025 estimate published in January. The 5.25% marginal debt cost is an analyst estimate. Industry scope and lease conventions limit the beta comparison.",
          "Reducing WACC by one percentage point produces $292.88 per share; raising it by one point produces $197.45. Reducing terminal growth by half a percentage point produces $222.67; raising it by half a point produces $252.27. A 50-basis-point reduction in each forecast client-funds yield produces $228.94 per share. Service costs, settlement liquidity and contract investment should be reassessed if client balances or retention deviate from the case."
        ]
      },
      {
        "heading": "Equity bridge and disclosure limits",
        "paragraphs": [
          "The equity bridge deducts $4,964.1 million of funded corporate debt and adds $2,729.4 million of cash after the reserve and pledged cash. Diluted shares are estimated at 398.7 million from the latest disclosed basic count and incremental award effect. Balance-sheet amounts reflect the June disclosure, not a measured August 5 cash balance.",
          "The model discounts at fiscal year-end using actual days / 365. The first future period is prorated by remaining fiscal days. This approximates evenly timed cash generation; seasonal spending can change the remaining-period cash flow. Market inputs and company disclosures are kept at or before the stated cutoff."
        ]
      },
      {
        "heading": "Terminal assumptions and evidence",
        "paragraphs": [
          "Terminal value contributes 78.1% of enterprise value. The same terminal cash flows imply 12.40x final-year EBITDA and reproduce $236.08 per share. This reconciliation uses the same growth and reinvestment assumptions. Holding the rest of the model fixed, the reference price requires approximately 34.2% FY2031 EBIT margin versus 29.0% in the base forecast.",
          "The report and workbook identify the July 29 FY2026 earnings release, Treasury yield data, Damodaran’s ERP and sector beta datasets, and the August 5 closing price. The downloadable report contains the source references; the workbook Sources sheet gives the URLs and locations."
        ]
      }
    ]
  }
];

export const valuationReports: readonly WebValuationReport[] = reportContent.map((report) => ({
  ...report,
  wordCount: report.sections.flatMap((section) => section.paragraphs).join(" ").split(/\s+/).length,
}));

export function valuationReportFor(slug: WebValuationReport["slug"]): WebValuationReport {
  const report = valuationReports.find((item) => item.slug === slug);
  if (!report) throw new Error(`Missing valuation report: ${slug}`);
  return report;
}
