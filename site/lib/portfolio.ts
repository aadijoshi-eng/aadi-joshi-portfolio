export type PortfolioSection = {
  number: string;
  label: string;
  title: string;
  description: string;
  href: string;
  count: string;
  accent: "atlas" | "valuation" | "autopsy" | "brief";
};

export const portfolioSections: PortfolioSection[] = [
  {
    number: "01",
    label: "Flagship research",
    title: "North Carolina Banking & Startup Opportunity Atlas",
    description:
      "A reproducible county-panel study and interactive public-data atlas examining bank-branch density and employer-startup activity across all 100 North Carolina counties.",
    href: "/atlas",
    count: "100 counties · 2014-2023",
    accent: "atlas",
  },
  {
    number: "02",
    label: "Equity research",
    title: "Valuation",
    description:
      "Three audited, driver-based DCF case studies that connect operating economics, scenario analysis, source discipline, and model limitations.",
    href: "/valuation",
    count: "Copart · CAVA · ADP",
    accent: "valuation",
  },
  {
    number: "03",
    label: "Corporate analysis",
    title: "Corporate Autopsies",
    description:
      "Long-form reports tracing how strategy, incentives, governance, capital structure, and execution combined to damage major businesses.",
    href: "/corporate-autopsies",
    count: "12 source-linked cases",
    accent: "autopsy",
  },
  {
    number: "04",
    label: "Carolina business",
    title: "Carolina Business Brief",
    description:
      "Source-linked reporting on acquisitions, investment, manufacturing, development, and corporate expansion across North Carolina.",
    href: "/carolina-business-brief",
    count: "Ten completed briefs",
    accent: "brief",
  },
];

export const portfolioFacts = [
  { value: "26", label: "featured project pages", detail: "One research atlas, three valuations, 12 autopsies, and ten business briefs" },
  { value: "4", label: "connected disciplines", detail: "Applied economics, finance, corporate analysis, and Carolina business" },
  { value: "1", label: "research standard", detail: "Sources, assumptions, limitations, and dated conclusions stay visible" },
] as const;
