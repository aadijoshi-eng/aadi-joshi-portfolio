import Link from "next/link";
import { notFound } from "next/navigation";
import { corporateAutopsyReports } from "@/site/lib/editorial-projects";

type PageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return corporateAutopsyReports.map(({ slug }) => ({ slug }));
}

export default async function LegacyCorporateAutopsyCasePage({ params }: PageProps) {
  const { slug } = await params;
  const report = corporateAutopsyReports.find((item) => item.slug === slug);
  if (!report) notFound();
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
  const destination = `/corporate-autopsies/${slug}`;
  return (
    <main className="shell">
      <meta httpEquiv="refresh" content={`0;url=${basePath}${destination}/`} />
      <h1>{report.title}</h1>
      <p>This case is available in the full report library.</p>
      <Link href={destination}>Read the report</Link>
    </main>
  );
}
