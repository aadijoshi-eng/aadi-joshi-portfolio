export type MonitorRegion = "Charlotte" | "Triangle" | "Triad" | "Piedmont" | "Sandhills";
export type MonitorStage = "Completed" | "Operating milestone" | "Under construction" | "Groundbreaking" | "Permit review" | "Announced";

export type MonitorSource = {
  label: string;
  url: string;
  kind: "Company" | "SEC filing" | "State government" | "Local government";
};

export type CarolinaBusinessMonitorEntry = {
  id: string;
  company: string;
  project: string;
  location: string;
  region: MonitorRegion;
  sector: string;
  eventType: string;
  stage: MonitorStage;
  headlineScale: string;
  plannedCapital: number | null;
  plannedPermanentJobs: number | null;
  publicSupport: string;
  lastVerified: string;
  verifiedNow: string;
  announcedPromise: string;
  uncertainty: string | null;
  nextCheckpoint: string;
  articleHref: string;
  sources: MonitorSource[];
};

export const monitorLastUpdated = "September 25, 2026";

export const carolinaBusinessMonitorEntries: CarolinaBusinessMonitorEntry[] = [
  {
    id: "avidxchange",
    company: "AvidXchange",
    project: "TPG and Corpay acquisition",
    location: "Charlotte, Mecklenburg County",
    region: "Charlotte",
    sector: "Fintech",
    eventType: "Ownership change",
    stage: "Completed",
    headlineScale: "$2.2B transaction value",
    plannedCapital: null,
    plannedPermanentJobs: null,
    publicSupport: "No incentive amount tracked",
    lastVerified: "October 15, 2025",
    verifiedNow: "AvidXchange's SEC filing confirms the acquisition closed for $10 per share and Nasdaq trading was suspended.",
    announcedPromise: "The new owners described private ownership as a way to invest in growth, but that is a strategy statement rather than a measured outcome.",
    uncertainty: "Private ownership reduces the quarterly public reporting available for evaluating the next phase.",
    nextCheckpoint: "Watch for disclosed hiring, product growth, customer expansion, or a later Corpay ownership change.",
    articleHref: "/carolina-business-brief/avidxchange-goes-private",
    sources: [
      { label: "AvidXchange merger completion Form 8-K", url: "https://www.sec.gov/Archives/edgar/data/1858257/000119312525239635/d49921d8k.htm", kind: "SEC filing" },
      { label: "Corpay and TPG closing announcement", url: "https://investor.corpay.com/news-releases/news-release-details/corpay-and-tpg-close-avidxchange-acquisition/", kind: "Company" },
    ],
  },
  {
    id: "genentech",
    company: "Genentech",
    project: "Holly Springs manufacturing facility",
    location: "Holly Springs, Wake County",
    region: "Triangle",
    sector: "Biotechnology",
    eventType: "Manufacturing expansion",
    stage: "Under construction",
    headlineScale: "$2.0B planned capital",
    plannedCapital: 2_000_000_000,
    plannedPermanentJobs: 500,
    publicSupport: "Not quantified in this tracker",
    lastVerified: "January 20, 2026",
    verifiedNow: "Genentech says construction began in August 2025 and increased the planned investment to approximately $2 billion in January 2026.",
    announcedPromise: "The company expects more than 500 manufacturing jobs, more than 1,500 temporary construction jobs, and operations by 2029.",
    uncertainty: "The investment, permanent-job count, and opening year remain forward-looking company commitments.",
    nextCheckpoint: "Track construction progress, initial hiring, validation of production systems, and the planned 2029 opening.",
    articleHref: "/carolina-business-brief/genentech-holly-springs",
    sources: [
      { label: "Genentech expanded-investment announcement", url: "https://www.gene.com/media/press-releases/15096/2026-01-20/genentech-more-than-doubles-investment-i", kind: "Company" },
      { label: "Genentech and Roche groundbreaking announcement", url: "https://www.gene.com/media/press-releases/15074/2025-08-25/genentech-and-roche-break-ground-on-stat", kind: "Company" },
    ],
  },
  {
    id: "jetzero",
    company: "JetZero",
    project: "Greensboro aircraft manufacturing campus",
    location: "Greensboro, Guilford County",
    region: "Triad",
    sector: "Aerospace",
    eventType: "New manufacturing campus",
    stage: "Groundbreaking",
    headlineScale: "$4.7B planned capital",
    plannedCapital: 4_700_000_000,
    plannedPermanentJobs: 14_560,
    publicSupport: "Up to $1.018B JDIG; up to $450M state infrastructure support",
    lastVerified: "June 15, 2026",
    verifiedNow: "JetZero and North Carolina officials held a groundbreaking for the planned campus at Piedmont Triad International Airport.",
    announcedPromise: "State records describe more than $4.7 billion in investment and 14,560 jobs, subject to a long performance schedule and verification.",
    uncertainty: "A groundbreaking verifies site activity, not aircraft certification, completed investment, or current employment at the announced scale.",
    nextCheckpoint: "Track site construction, demonstrator testing, regulatory milestones, phased hiring, and annual incentive verification.",
    articleHref: "/carolina-business-brief/jetzero-greensboro",
    sources: [
      { label: "North Carolina Commerce project announcement", url: "https://www.commerce.nc.gov/news/press-releases/2025/06/12/governor-stein-announces-jetzero-selects-north-carolina-4-billion-airplane-manufacturing-hub", kind: "State government" },
      { label: "Governor's office groundbreaking record", url: "https://governor.nc.gov/news/press-releases/2026/06/15/governor-stein-celebrates-jetzero-groundbreaking-launch-greensboro-airplane-makers-14500-job-project", kind: "State government" },
      { label: "JetZero groundbreaking announcement", url: "https://www.jetzero.aero/jetzero-breaks-ground-on-greensboro-factory", kind: "Company" },
    ],
  },
  {
    id: "river-district",
    company: "Crescent Communities",
    project: "The River District",
    location: "West Charlotte, Mecklenburg County",
    region: "Charlotte",
    sector: "Real estate",
    eventType: "Master-planned development",
    stage: "Operating milestone",
    headlineScale: "318 apartments open",
    plannedCapital: null,
    plannedPermanentJobs: null,
    publicSupport: "No incentive amount tracked",
    lastVerified: "June 4, 2026",
    verifiedNow: "NOVEL River District, a 318-unit apartment community, opened as the development's first multifamily property.",
    announcedPromise: "The broader plan includes thousands of single-family and multifamily homes plus future retail, office, and public space.",
    uncertainty: "Company materials have described the full site as roughly 1,200 to 1,400 acres; the final buildout can change over a multi-year development cycle.",
    nextCheckpoint: "Track occupancy, home completions, commercial tenants, infrastructure, and whether later phases match the proposed mix.",
    articleHref: "/carolina-business-brief/river-district",
    sources: [
      { label: "NOVEL River District grand opening", url: "https://www.crescentcommunities.com/media/press/crescent-communities-celebrates-grand-opening-of-first-multifamily-development-at-the-river-district/", kind: "Company" },
      { label: "First residential phase announcement", url: "https://www.theriverdistrict.com/news/home-construction-to-begin-at-the-river-district/", kind: "Company" },
    ],
  },
  {
    id: "citi",
    company: "Citigroup",
    project: "Charlotte office expansion",
    location: "Charlotte, Mecklenburg County",
    region: "Charlotte",
    sector: "Financial services",
    eventType: "Office expansion",
    stage: "Operating milestone",
    headlineScale: "510 planned jobs",
    plannedCapital: 16_100_000,
    plannedPermanentJobs: 510,
    publicSupport: "Up to $8.94M JDIG over 10 years",
    lastVerified: "March 16, 2026",
    verifiedNow: "The Governor's office marked the grand opening of Citi's Charlotte office in March 2026. The 510 jobs remain a separate announced target.",
    announcedPromise: "Citi plans to invest $16.1 million and add 510 jobs in areas including personal banking, finance, and marketing.",
    uncertainty: "An office opening does not establish that all 510 jobs or $16.1 million of planned investment have been delivered.",
    nextCheckpoint: "Track net new headcount, capital spending, and annual JDIG performance verification.",
    articleHref: "/carolina-business-brief/citi-charlotte-expansion",
    sources: [
      { label: "North Carolina Commerce expansion announcement", url: "https://www.commerce.nc.gov/news/press-releases/2025/07/08/governor-stein-announces-510-new-jobs-citigroup-selects-charlotte-expansion", kind: "State government" },
      { label: "City of Charlotte project announcement", url: "https://www.charlottenc.gov/City-News/Citigroup-to-Establish-Major-Office-Facility-in-Charlotte", kind: "Local government" },
      { label: "Governor's office grand opening", url: "https://governor.nc.gov/news/press-releases/2026/03/16/governor-stein-celebrates-grand-opening-citi-charlotte-office", kind: "State government" },
    ],
  },
  {
    id: "amazon-richmond-county",
    company: "Amazon Web Services",
    project: "Richmond County cloud and AI campus",
    location: "Richmond County",
    region: "Sandhills",
    sector: "Cloud computing / AI infrastructure",
    eventType: "Data-center campus",
    stage: "Permit review",
    headlineScale: "$10B planned capital; at least 500 jobs",
    plannedCapital: 10_000_000_000,
    plannedPermanentJobs: 500,
    publicSupport: "No incentive amount tracked",
    lastVerified: "June 26, 2026",
    verifiedNow: "North Carolina announced the planned campus in 2025. In June 2026, NCDEQ described draft air-permit proceedings for the proposed Energy Way Tech Campus near Hamlet.",
    announcedPromise: "Amazon says the project will support additional construction and supply-chain work, plus technical workforce training.",
    uncertainty: "Permit review does not establish that construction has begun, that capital has been spent at the announced scale, or that the planned jobs have been filled.",
    nextCheckpoint: "Track permit decisions, verified site work, construction, initial hiring, and the first operating facilities.",
    articleHref: "/carolina-business-brief/amazon-richmond-county-ai-campus",
    sources: [
      { label: "North Carolina Commerce project announcement", url: "https://www.commerce.nc.gov/news/press-releases/2025/06/04/governor-stein-announces-amazon-plans-invest-10-billion-north-carolina-ai-infrastructure", kind: "State government" },
      { label: "Amazon planned-investment announcement", url: "https://www.aboutamazon.com/news/aws/aws-investment-north-carolina-ai-cloud-infrastructure", kind: "Company" },
      { label: "NCDEQ draft air-permit hearing notice", url: "https://www.deq.nc.gov/news/press-releases/2026/06/26/deq-announces-joint-public-hearing-amazon-data-center-and-duke-energy-air-quality-permits-richmond", kind: "State government" },
    ],
  },
  {
    id: "toyota-battery",
    company: "Toyota Battery Manufacturing North Carolina",
    project: "Liberty battery-manufacturing plant",
    location: "Liberty, Randolph County",
    region: "Triad",
    sector: "Automotive batteries",
    eventType: "New manufacturing plant",
    stage: "Operating milestone",
    headlineScale: "$13.9B current investment; up to 5,100 planned employees",
    plannedCapital: 13_900_000_000,
    plannedPermanentJobs: 5_100,
    publicSupport: "Not tracked in this monitor",
    lastVerified: "November 12, 2025",
    verifiedNow: "Toyota says it began shipping hybrid battery modules in June 2025 and formally marked the start of production in November.",
    announcedPromise: "Toyota lists 14 production lines and 30 GWh of annual capacity at full production, with additional lines scheduled through 2030.",
    uncertainty: "The stated full workforce, line count, and capacity are future targets rather than completed results.",
    nextCheckpoint: "Track additional line launches, hiring, vehicle-program launches, supplier development, and utilization.",
    articleHref: "/carolina-business-brief/toyota-liberty-battery-plant",
    sources: [
      { label: "Toyota start-of-production announcement", url: "https://pressroom.toyota.com/toyota-charges-into-u-s-battery-manufacturing/", kind: "Company" },
      { label: "Toyota North Carolina facility overview", url: "https://pressroom.toyota.com/facility/toyota-battery-manufacturing-north-carolina/", kind: "Company" },
    ],
  },
  {
    id: "jabil-rowan",
    company: "Jabil",
    project: "Rowan County cloud and AI infrastructure facility",
    location: "Rowan County",
    region: "Piedmont",
    sector: "Advanced manufacturing",
    eventType: "Manufacturing expansion",
    stage: "Announced",
    headlineScale: "$500M planned capital; 1,181 jobs",
    plannedCapital: 500_000_000,
    plannedPermanentJobs: 1_181,
    publicSupport: "Up to $11.25M JDIG over 12 years; contingent on verified performance",
    lastVerified: "June 30, 2025",
    verifiedNow: "State records confirm Jabil’s announced Rowan County facility, including its $500 million multiyear investment plan and 1,181-job commitment.",
    announcedPromise: "Jabil plans to manufacture solutions for cloud and AI data-center customers and recruit manufacturing and engineering talent.",
    uncertainty: "The plant, jobs, payroll impact, and incentive payments remain future commitments until construction and performance are verified.",
    nextCheckpoint: "Track the selected site, construction, job postings, equipment installation, and annual JDIG verification.",
    articleHref: "/carolina-business-brief/jabil-rowan-county-ai-supply-chain",
    sources: [
      { label: "North Carolina Commerce project announcement", url: "https://www.commerce.nc.gov/news/press-releases/2025/06/30/jabil-selects-rowan-county-nearly-1200-new-jobs-and-500-million-multi-year-investment", kind: "State government" },
      { label: "Rowan County economic-development project summary", url: "https://rowanedc.com/jabel-chooses-rowan-county-for-new-facility/", kind: "Local government" },
    ],
  },
  {
    id: "scout-motors",
    company: "Scout Motors",
    project: "Charlotte corporate headquarters",
    location: "Charlotte, Mecklenburg County",
    region: "Charlotte",
    sector: "Automotive / corporate operations",
    eventType: "New corporate headquarters",
    stage: "Announced",
    headlineScale: "$206.9M planned capital; 1,200 jobs by 2030",
    plannedCapital: 206_900_000,
    plannedPermanentJobs: 1_200,
    publicSupport: "JDIG approved; performance-based terms",
    lastVerified: "November 12, 2025",
    verifiedNow: "State and county records confirm Scout Motors selected Charlotte for a planned 300,000-square-foot headquarters serving corporate and technical functions.",
    announcedPromise: "The company plans 1,200 jobs by 2030 in functions including R&D, IT, finance, sales, and marketing.",
    uncertainty: "Initial staffing was scheduled to begin in 2026, while full headquarters operations will scale over several years.",
    nextCheckpoint: "Track office development, early hiring, job composition, capital spending, and progress toward the 2030 target.",
    articleHref: "/carolina-business-brief/scout-motors-charlotte-headquarters",
    sources: [
      { label: "North Carolina Commerce project announcement", url: "https://www.commerce.nc.gov/news/press-releases/2025/11/12/governor-stein-announces-new-headquarters-scout-motors-creating-1200-jobs-mecklenburg-county", kind: "State government" },
      { label: "Mecklenburg County project announcement", url: "https://news.mecknc.gov/scout-motors-selects-mecklenburg-county-new-headquarters-creating-1200-jobs", kind: "Local government" },
    ],
  },
  {
    id: "wolfspeed-restructuring",
    company: "Wolfspeed",
    project: "Chapter 11 financial restructuring",
    location: "Durham, Durham County",
    region: "Triangle",
    sector: "Semiconductors",
    eventType: "Financial restructuring",
    stage: "Completed",
    headlineScale: "Approximately 70% debt reduction",
    plannedCapital: null,
    plannedPermanentJobs: null,
    publicSupport: "Not tracked in this monitor",
    lastVerified: "September 29, 2025",
    verifiedNow: "Wolfspeed reported that it emerged from Chapter 11 after reducing total debt by approximately 70%, extending maturities to 2030, and lowering annual cash interest expense by roughly 60%.",
    announcedPromise: "The company says its installed 200mm manufacturing footprint can support a self-funded plan through future free cash flow.",
    uncertainty: "Future cash flow, factory yields, customer demand, and operating execution remain uncertain and should not be inferred from the completed restructuring alone.",
    nextCheckpoint: "Track production performance, demand, margins, cash generation, and compliance with the new capital structure.",
    articleHref: "/carolina-business-brief/wolfspeed-financial-restructuring",
    sources: [
      { label: "Wolfspeed Chapter 11 implementation announcement", url: "https://investor.wolfspeed.com/news/news-details/2025/Wolfspeed-Takes-Next-Step-to-Implement-Restructuring-Support-Agreement-and-Proactively-Strengthen-Capital-Structure/default.aspx", kind: "Company" },
      { label: "Wolfspeed emergence announcement", url: "https://investor.wolfspeed.com/news/news-details/2025/Wolfspeed-Successfully-Completes-Financial-Restructuring-Emerges-as-Financially-Stronger-Company-Well-Positioned-in-Silicon-Carbide-Market/default.aspx", kind: "Company" },
    ],
  },
];

export const monitorSummary = {
  developments: carolinaBusinessMonitorEntries.length,
  plannedCapital: carolinaBusinessMonitorEntries.reduce((sum, item) => sum + (item.plannedCapital ?? 0), 0),
  plannedPermanentJobs: carolinaBusinessMonitorEntries.reduce((sum, item) => sum + (item.plannedPermanentJobs ?? 0), 0),
  regions: new Set(carolinaBusinessMonitorEntries.map((item) => item.region)).size,
};
