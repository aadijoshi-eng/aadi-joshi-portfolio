import { researchSummary } from "@/site/lib/research-summary";

export const PROJECT_TITLE = "North Carolina Banking & Startup Opportunity Atlas";
export const PROJECT_SHORT_TITLE = "NC Banking & Startup Atlas";
export const PROJECT_VERSION = "1.0.1 · Provisional";
export const PROJECT_DATE = researchSummary.date;

export const portfolioNavigation = [
  { href: "/", label: "Home" },
  { href: "/atlas", label: "Atlas / Research" },
  { href: "/valuation", label: "Valuation" },
  { href: "/corporate-autopsies", label: "Corporate Autopsies" },
  { href: "/carolina-business-brief", label: "Carolina Business Brief" },
  { href: "/projects", label: "Projects" },
] as const;

export const atlasNavigation = [
  { href: "/atlas", label: "County atlas" },
  { href: "/trends", label: "Trends" },
  { href: "/findings", label: "Findings" },
  { href: "/methodology", label: "Methodology" },
  { href: "/data", label: "Data" },
  { href: "/limitations", label: "Limitations" },
  { href: "/paper", label: "Paper & about" },
] as const;

export const headlineFacts = [
  {
    value: `${researchSummary.descriptive.branchCountPercentChange.toFixed(1).replace("-", "−")}%`,
    label: "full-service branches",
    detail: `${researchSummary.descriptive.branchCount2013.toLocaleString()} in 2013 → ${researchSummary.descriptive.branchCount2022.toLocaleString()} in 2022`,
  },
  {
    value: "100 × 10",
    label: "county-year frame",
    detail: "100 counties, 2014-2023 outcomes",
  },
  {
    value: "No stable sign",
    label: "timing check",
    detail: `frozen ${researchSummary.models.frozenHeadline.estimate.toFixed(3).replace("-", "−")}; clean-preperiod +${researchSummary.models.cleanPreperiod.estimate.toFixed(3)}`,
  },
] as const;

export const coreQuestion =
  "How is full-service bank-branch density associated with employer-startup activity across North Carolina’s 100 counties, and how sensitive is that association to exposure timing?";
