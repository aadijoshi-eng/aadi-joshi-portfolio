import type { Metadata } from "next";
import { PageIntro } from "@/site/components/PageIntro";
import { TrendExplorer } from "@/site/components/TrendExplorer";

export const metadata: Metadata = { title: "Trends & Comparisons" };

export default function TrendsPage() {
  return (
    <main>
      <PageIntro
        eyebrow="Trends and comparisons"
        title="Look for patterns without turning them into causes."
        description="Statewide trends, county scatterplots, metro/nonmetro aggregates, and selected-county trajectories, each with its own denominator and timing."
        aside="Descriptive co-movement is not the fixed-effects estimate. Every chart below remains observational."
      />
      <div className="shell"><TrendExplorer /></div>
    </main>
  );
}
