import { publicPath } from "@/site/lib/paths";
import { valuationReportFor, type WebValuationReport } from "@/site/lib/valuation-reports";

export type ValuationSource = Readonly<{
  label: string;
  url: string;
}>;

export type ValuationProject = Readonly<{
  slug: "copart" | "cava" | "adp";
  company: "Copart" | "CAVA" | "ADP";
  ticker: "CPRT" | "CAVA" | "ADP";
  researchQuestion: string;
  investmentThesis: string;
  finalClose: number;
  baseDcfValuePerShare: number;
  scenarioRange: Readonly<{
    low: number;
    high: number;
  }>;
  waccPercent: number;
  conclusion: string;
  valuationDate: string;
  valuationDateNote: string;
  workbookPath: string;
  workbookLabel: string;
  reportPath: string;
  reportLabel: string;
  report: WebValuationReport;
  modelDrivers: readonly string[];
  sensitivityThemes: readonly string[];
  risks: readonly string[];
  limitations: readonly string[];
  unavailableAssumptions: readonly string[];
  officialSources: readonly ValuationSource[];
}>;

export const valuationProjects: readonly ValuationProject[] = [
  {
    slug: "copart",
    company: "Copart",
    ticker: "CPRT",
    researchQuestion: "How should a service-heavy salvage-auction marketplace be valued when owned-vehicle sales, land and capex, and international growth carry different economics?",
    investmentThesis: "The base DCF supports $24.48 per share against the $28.91 reference price, a 15.3% shortfall. Insurer volumes and fees support revenue growth, but yard investment limits distributable cash. The upside operating case reaches $30.59.",
    finalClose: 28.91,
    baseDcfValuePerShare: 24.48,
    scenarioRange: { low: 20.28, high: 30.59 },
    waccPercent: 9.32,
    conclusion: "Reference price exceeds the base value and lies near the upside case.",
    valuationDate: "August 5, 2026",
    valuationDateNote: "Valued at the August 5, 2026 close using disclosures available by that date. FY2026 ended before the cutoff and contributes no future cash-flow present value.",
    workbookPath: publicPath("/downloads/valuation-models/Copart_DCF.xlsx"),
    workbookLabel: "Copart DCF Model",
    reportPath: publicPath("/downloads/valuation-reports/Copart_Investment_Report.pdf"),
    reportLabel: "Copart valuation report (PDF)",
    report: valuationReportFor("copart"),
    modelDrivers: [
      "Driver-based FCFF that separates U.S. service revenue, international service revenue, and owned-vehicle sales.",
      "Indexed insurer volume, fee growth, and the disclosed insurer share of processed vehicles.",
      "Facility and G&A costs, land and capex, inventory and working capital, and international expansion.",
    ],
    sensitivityThemes: [
      "WACC × perpetual growth",
      "Service growth × service margin",
      "Volume × revenue per vehicle",
      "Capex intensity × terminal margin",
    ],
    risks: [
      "Total-loss and accident frequency.",
      "Salvage values and insurance contracts.",
      "Land and facility costs.",
      "Foreign-exchange exposure, catastrophe volatility, and international execution.",
    ],
    limitations: [
      "Absolute annual vehicle counts and seller-type revenue are not disclosed; the insurer count share is a revenue-allocation proxy.",
      "Beta is an analyst assumption. The finance-lease claim is estimated from the latest separately disclosed balance.",
      "Terminal value supplies 79.3% of enterprise value. The cash reserve does not certify the legal availability of each dollar.",
    ],
    unavailableAssumptions: ["Exact sensitivity-cell outputs remain in the workbook rather than on this webpage."],
    officialSources: [
      {
        label: "Copart SEC filing",
        url: "https://www.sec.gov/Archives/edgar/data/900075/000162828025042946/cprt-20250731.htm",
      },
      {
        label: "Copart earnings release",
        url: "https://www.copart.com/content/cprt-04-30-26-earnings-release.pdf",
      },
    ],
  },
  {
    slug: "cava",
    company: "CAVA",
    ticker: "CAVA",
    researchQuestion: "How much of CAVA’s valuation can be supported by restaurant openings, store-cohort maturation, unit volumes, and margin normalization?",
    investmentThesis: "The base DCF supports $30.70 per share against the $66.17 reference price, a 53.6% shortfall. Restaurant expansion produces substantial revenue growth, but construction spending and reinvestment absorb part of the operating gains. All three operating cases remain below the reference price.",
    finalClose: 66.17,
    baseDcfValuePerShare: 30.7,
    scenarioRange: { low: 14.55, high: 47.92 },
    waccPercent: 9.98,
    conclusion: "Reference price exceeds all three modeled operating cases.",
    valuationDate: "August 5, 2026",
    valuationDateNote: "Valued at the August 5, 2026 close. The operating case uses FY2025 results and the May FY2026 guidance; subsequent results are excluded from the dated forecast.",
    workbookPath: publicPath("/downloads/valuation-models/CAVA_DCF.xlsx"),
    workbookLabel: "CAVA DCF Model",
    reportPath: publicPath("/downloads/valuation-reports/CAVA_Investment_Report.pdf"),
    reportLabel: "CAVA valuation report (PDF)",
    report: valuationReportFor("cava"),
    modelDrivers: [
      "Restaurant count and new openings, cohort and store ramp, and average unit volume.",
      "Traffic plus pricing/mix, restaurant-level margins, and food, labor, and occupancy costs.",
      "G&A, cash construction costs, shared infrastructure, working capital, and terminal reinvestment at the selected ROIC.",
    ],
    sensitivityThemes: [
      "WACC × perpetual growth",
      "New restaurants × mature average unit volume",
      "Restaurant margin × G&A expense ratio",
      "Traffic × price and mix",
    ],
    risks: [
      "Comparable-sales deceleration and food or labor inflation.",
      "Expansion, cannibalization, new-store ramp, saturation, and location quality.",
      "Valuation expectations.",
    ],
    limitations: [
      "The opening-year and second-year sales factors are estimates; mature AUV does not establish every new store’s productivity.",
      "Terminal growth of 3.0% and incremental ROIC of 20% are forecast judgments. Terminal value supplies 73.7% of enterprise value.",
      "The normalized 25% cash-tax assumption does not forecast NOL utilization. The Other segment retains its FY2025 loss margin.",
    ],
    unavailableAssumptions: ["Exact sensitivity-cell outputs remain in the workbook rather than on this webpage."],
    officialSources: [
      {
        label: "CAVA SEC filing",
        url: "https://www.sec.gov/Archives/edgar/data/1639438/000162828026011296/cava-20251228.htm",
      },
      {
        label: "CAVA Q1 FY2026 SEC filing",
        url: "https://www.sec.gov/Archives/edgar/data/1639438/000162828026036625/cava-20260419.htm",
      },
      {
        label: "CAVA Q1 FY2026 earnings release",
        url: "https://www.sec.gov/Archives/edgar/data/1639438/000162828026036461/earningsrelease2026q1.htm",
      },
    ],
  },
  {
    slug: "adp",
    company: "ADP",
    ticker: "ADP",
    researchQuestion: "How should recurring payroll and HCM economics be separated from rate-sensitive client-funds interest when valuing ADP?",
    investmentThesis: "The base DCF supports $236.08 per share, 12.6% below the $270.09 reference price. Recurring payroll revenue supports the operating case, but the price requires stronger long-run cash economics or a lower required return. The base case offers no margin of safety at the reference price.",
    finalClose: 270.09,
    baseDcfValuePerShare: 236.08,
    scenarioRange: { low: 173.25, high: 292.74 },
    waccPercent: 8.0,
    conclusion: "The base case offers no margin of safety at the reference price.",
    valuationDate: "August 5, 2026",
    valuationDateNote: "Valued at the August 5, 2026 close using ADP’s July 29 earnings release. Balance-sheet amounts reflect June disclosures rather than a measured cash balance on the valuation date.",
    workbookPath: publicPath("/downloads/valuation-models/ADP_DCF.xlsx"),
    workbookLabel: "ADP DCF Model",
    reportPath: publicPath("/downloads/valuation-reports/ADP_Investment_Report.pdf"),
    reportLabel: "ADP valuation report (PDF)",
    report: valuationReportFor("adp"),
    modelDrivers: [
      "Employer Services excluding client-fund interest.",
      "Client-fund interest modeled as average balance multiplied by yield, less a 3% administration and liquidity allowance.",
      "PEO excluding zero-margin benefits pass-throughs, with pass-throughs modeled separately.",
      "Retention, bookings, pays per control, worksite employees, and net investment in deferred contract costs.",
    ],
    sensitivityThemes: [
      "WACC × perpetual growth",
      "Client-fund yield × client-fund balance growth",
      "Employer Services growth × EBIT margin",
      "PEO margin × normalized tax rate",
    ],
    risks: [
      "Employment and payroll slowdown or falling interest rates.",
      "HCM competition and cybersecurity.",
      "PEO workers' compensation claims.",
      "Treating temporary float interest as permanent.",
    ],
    limitations: [
      "The forecast uses GAAP operating profit; adjusted margin guidance provides context rather than an exact accounting match.",
      "The 3% client-funds cost allowance and 25% terminal incremental ROIC are assumptions.",
      "Terminal value supplies 78.1% of enterprise value. Estimated diluted shares combine the latest basic count and award effect.",
    ],
    unavailableAssumptions: ["Exact sensitivity-cell outputs remain in the workbook rather than on this webpage."],
    officialSources: [
      {
        label: "ADP FY2026 SEC filing (later verification)",
        url: "https://www.sec.gov/Archives/edgar/data/8670/000000867026000030/adp-20260630.htm",
      },
      {
        label: "ADP Q4 FY2026 earnings release",
        url: "https://s205.q4cdn.com/887941133/files/doc_financials/2026/q4/ADP-4Q26-Earnings-Release.pdf",
      },
    ],
  },
];
