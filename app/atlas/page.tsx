import type { Metadata } from "next";
import { CountyAtlas } from "@/site/components/CountyAtlas";
import { PageIntro } from "@/site/components/PageIntro";

export const metadata: Metadata = { title: "Interactive County Atlas" };

export default function AtlasPage() {
  return (
    <main>
      <PageIntro
        eyebrow="Interactive county atlas"
        title="One state. One hundred county trajectories."
        description="Explore banking-network measures and employer-startup activity using the same FIPS-linked records that support the working paper."
        aside="The year control uses the BDS label year. BDS flow measures cover March of t-1 through March of t, so the June t-1 banking snapshot falls within that outcome interval."
      />
      <div className="shell atlas-page-body"><CountyAtlas /></div>
    </main>
  );
}
