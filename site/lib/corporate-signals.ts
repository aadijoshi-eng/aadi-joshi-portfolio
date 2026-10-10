export type SignalState = "green" | "amber" | "red" | "gray";

export type CorporateSignal = {
  state: SignalState;
  label: string;
  detail: string;
};

export type CorporateSignalCompany = {
  slug: string;
  company: string;
  ticker: string;
  industry: string;
  watchState: "Lower pressure" | "Watch" | "Elevated pressure";
  lastReviewed: string;
  thesis: string;
  signals: {
    earnings: CorporateSignal;
    balanceSheet: CorporateSignal;
    execution: CorporateSignal;
    operations: CorporateSignal;
    rateSensitivity: CorporateSignal;
  };
  nextEvidence: string;
  sources: { label: string; url: string }[];
};

export const signalDimensions = [
  { key: "earnings", label: "Earnings & cash" },
  { key: "balanceSheet", label: "Balance sheet" },
  { key: "execution", label: "Capital / deal execution" },
  { key: "operations", label: "Operations / regulation" },
  { key: "rateSensitivity", label: "Rate sensitivity" },
] as const;

export const corporateSignalCompanies: CorporateSignalCompany[] = [
  {
    slug: "dicks-foot-locker",
    company: "DICK’S Sporting Goods + Foot Locker",
    ticker: "DKS · Foot Locker acquired",
    industry: "Athletic retail",
    watchState: "Watch",
    lastReviewed: "September 2026",
    thesis: "This is an acquisition-integration watch, not a merger-of-equals score. DICK’S has an operating base to fund the work, but the question is whether the combined retail footprint, inventory, and brand relationships perform better together than separately.",
    signals: {
      earnings: { state: "green", label: "Cash generation visible", detail: "DICK’S reported Q2 2026 results and disclosed no outstanding revolving-credit borrowings. That is a useful cushion, not proof that the deal will create value." },
      balanceSheet: { state: "amber", label: "Post-close capital discipline", detail: "The right check is not a single debt number. Track cash, revolver use, lease commitments, and working capital against the next post-acquisition filings." },
      execution: { state: "amber", label: "Integration unproven", detail: "The acquisition closed on September 8, 2025. Synergies, store strategy, and brand-partner retention should be treated as claims to test rather than automatic gains." },
      operations: { state: "amber", label: "Retail turnaround still matters", detail: "A larger platform does not remove the need to improve store productivity, inventory turns, and customer relevance across Foot Locker’s footprint." },
      rateSensitivity: { state: "gray", label: "Indirect exposure", detail: "Retail demand can weaken in a tighter economy, but this is not primarily a bank or rate-arbitrage business. The map does not assign a rate flag without a clearer filing-based trigger." },
    },
    nextEvidence: "Compare post-close same-store sales, gross margin, inventory, lease disclosures, and management’s quantified integration costs against the 2025-26 baseline.",
    sources: [
      { label: "DICK’S: acquisition of Foot Locker completed (Sept. 8, 2025)", url: "https://investors.dicks.com/news/news-details/2025/DICKS-Sporting-Goods-Completes-Acquisition-of-Foot-Locker/default.aspx" },
      { label: "DICK’S Q2 2026 results and financial-report archive", url: "https://investors.dicks.com/overview/default.aspx" },
      { label: "DICK’S SEC filings", url: "https://investors.dicks.com/financials/sec-filings/default.aspx" },
    ],
  },
  {
    slug: "boeing",
    company: "Boeing",
    ticker: "NYSE: BA",
    industry: "Aerospace and defense",
    watchState: "Elevated pressure",
    lastReviewed: "September 2026",
    thesis: "Boeing’s recovery has observable operating progress, but the remaining work is still a quality, certification, supplier, and balance-sheet problem, not simply an earnings-rebound story.",
    signals: {
      earnings: { state: "amber", label: "Improving, still incomplete", detail: "Q2 2026 revenue rose to $24.6 billion and free cash flow was positive, while the company still recorded a GAAP loss. Improvement is measurable; profitability remains a separate test." },
      balanceSheet: { state: "amber", label: "Large debt load", detail: "At June 30, 2026, Boeing reported $20.0 billion of cash and marketable securities against $45.9 billion of consolidated debt, with undrawn credit facilities." },
      execution: { state: "amber", label: "Production ramp is conditional", detail: "Higher deliveries are helping cash flow, but future rates still depend on certification, supplier performance, quality controls, and customer delivery timing." },
      operations: { state: "red", label: "Safety and quality remain central", detail: "The FAA’s production scrutiny and the NTSB’s door-plug findings make operational discipline a continuing business variable, not a closed historical issue." },
      rateSensitivity: { state: "gray", label: "Not the dominant pressure", detail: "The map does not treat interest rates as Boeing’s primary current operating risk; production quality, execution, and leverage are more directly supported by the record." },
    },
    nextEvidence: "Track certified production rates, delivery volume, commercial-airplanes margins, cash conversion, and any regulator updates, not the stock price alone.",
    sources: [
      { label: "Boeing Q2 2026 results", url: "https://boeing.mediaroom.com/2026-07-28-Boeing-Reports-Second-Quarter-Results" },
      { label: "FAA production-expansion action", url: "https://www.faa.gov/newsroom/faa-halts-boeing-max-production-expansion-improve-quality-control-also-lays-out-extensive" },
      { label: "NTSB door-plug findings", url: "https://www-s.ntsb.gov/news/press-releases/Pages/NR20250624.aspx" },
    ],
  },
  {
    slug: "carmax",
    company: "CarMax",
    ticker: "NYSE: KMX",
    industry: "Used-vehicle retail and auto finance",
    watchState: "Watch",
    lastReviewed: "September 2026",
    thesis: "CarMax is a better rate-sensitivity example than a generic ‘overleveraged’ label: used-car demand, financing costs, credit losses, and vehicle values interact through its retail and finance operations.",
    signals: {
      earnings: { state: "amber", label: "Margins and demand need watching", detail: "Used-vehicle retail depends on unit demand, gross profit per vehicle, wholesale conditions, and the cost of funding customers. Each can move differently in the same quarter." },
      balanceSheet: { state: "amber", label: "Finance assets need context", detail: "Auto loans are central to the model. The relevant question is asset quality, funding, and loss reserves, not whether a headline debt figure looks large by itself." },
      execution: { state: "gray", label: "No current deal call", detail: "This launch set does not assign a merger or acquisition signal where public filings do not make one central to the near-term thesis." },
      operations: { state: "amber", label: "Retail and credit are connected", detail: "Pricing, reconditioning, inventory, and loan performance all affect results. The map keeps those links visible rather than treating retail and financing as separate stories." },
      rateSensitivity: { state: "red", label: "Direct financing exposure", detail: "A change in borrowing costs or consumer affordability can affect loan demand, loan performance, and the economics of CarMax Auto Finance. Its filings identify interest-rate risk and credit-loss reserves as material monitoring points." },
    },
    nextEvidence: "Compare loan-loss allowance, net credit losses, funding costs, retail gross profit per vehicle, and unit volume across the next two filings.",
    sources: [
      { label: "CarMax Q2 fiscal 2026 results", url: "https://investors.carmax.com/news-and-events/news-releases/news-release-details/2025/CarMax-Reports-Second-Quarter-Fiscal-Year-2026-Results/default.aspx" },
      { label: "CarMax annual reports and SEC filings", url: "https://investors.carmax.com/financial-information/default.aspx" },
      { label: "CarMax Q3 fiscal 2026 Form 10-Q", url: "https://www.sec.gov/Archives/edgar/data/1170010/000117001025000106/kmx-20251130.htm" },
    ],
  },
  {
    slug: "warner-bros-discovery",
    company: "Warner Bros. Discovery",
    ticker: "NASDAQ: WBD",
    industry: "Media, studios, and streaming",
    watchState: "Elevated pressure",
    lastReviewed: "September 2026",
    thesis: "WBD is a leverage and execution case with a useful nuance: long debt maturities reduce one kind of near-term pressure, but do not remove the need for consistent cash generation or make volatile content economics disappear.",
    signals: {
      earnings: { state: "amber", label: "Uneven segment performance", detail: "Q2 2026 studio revenue and adjusted EBITDA declined sharply year over year, illustrating how content timing and releases can make one quarter a noisy signal rather than a complete verdict." },
      balanceSheet: { state: "red", label: "Leverage remains material", detail: "At June 30, 2026, WBD reported $33.1 billion of gross debt, $3.4 billion of cash, and 3.4x net leverage. Those are monitoring facts, not a prediction of distress." },
      execution: { state: "amber", label: "Strategic transaction uncertainty", detail: "The company’s investor materials describe a proposed transaction. Regulatory, legal, and integration outcomes are uncertain, so the map flags the decision without scoring it as success or failure." },
      operations: { state: "amber", label: "Content economics are volatile", detail: "Film, television, sports, and streaming can produce uneven timing in revenue and costs. The analytical task is to separate temporary slate timing from durable audience and cash-flow trends." },
      rateSensitivity: { state: "amber", label: "Refinancing matters, but maturity helps", detail: "WBD reported an 8.3-year weighted-average debt maturity and 5.2% weighted-average cost of debt at Q2 2026. That moderates immediate refinancing pressure while leaving leverage important to monitor." },
    },
    nextEvidence: "Follow free cash flow, debt reduction, streaming profitability, the transaction record, and the source of any earnings change by segment.",
    sources: [
      { label: "Warner Bros. Discovery Q2 2026 earnings release", url: "https://www.sec.gov/Archives/edgar/data/1437107/000143710726000072/wbd2q26earningsrelease08.htm" },
      { label: "Warner Bros. Discovery Q2 2026 materials and debt schedule", url: "https://ir.wbd.com/investor-relations/default.aspx" },
      { label: "Warner Bros. Discovery financial news", url: "https://ir.wbd.com/news-and-events/financial-news/default.aspx" },
    ],
  },
];
