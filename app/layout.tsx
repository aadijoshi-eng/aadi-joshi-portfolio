import type { Metadata } from "next";
import "./globals.css";
import { Footer } from "@/site/components/Footer";
import { Header } from "@/site/components/Header";

const siteDescription =
  "Applied economics, equity valuation, corporate analysis, and Carolina business reporting led by the North Carolina Banking & Startup Opportunity Atlas.";
const basePath = process.env.GITHUB_PAGES_BASE_PATH || "";

export const metadata: Metadata = {
    metadataBase: new URL("https://aadijoshi-eng.github.io"),
    title: {
      default: "Aadi Joshi | Research & Analysis",
      template: "%s | Aadi Joshi Research",
    },
    description: siteDescription,
    icons: {
      icon: "/favicon.svg",
      shortcut: "/favicon.svg",
    },
    openGraph: {
      type: "website",
      title: "Aadi Joshi | Research & Analysis",
      description: siteDescription,
      url: `${basePath}/`,
      images: [
        {
          url: `${basePath}/og.png`,
          width: 1731,
          height: 909,
          alt: "Aadi Joshi Research & Analysis portfolio cover",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "Aadi Joshi | Research & Analysis",
      description: siteDescription,
      images: [`${basePath}/og.png`],
    },
  };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <a className="skip-link" href="#main-content">Skip to content</a>
        <Header />
        <div id="main-content">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
