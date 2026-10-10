import type { CorporateAutopsyReport, EditorialSource } from "./editorial-projects";

type RootCause = { title: string; detail: string };
type TimelineEvent = { date: string; event: string };

type ReportInput = Omit<CorporateAutopsyReport, "markdown" | "sources" | "readTime" | "contentStatus"> & {
  executiveSummary: string;
  background: string;
  rootCauses: RootCause[];
  timeline: TimelineEvent[];
  businessImpact: string;
  whatCouldChange: string;
  takeaways: string[];
  sources: EditorialSource[];
};

function buildReport(input: ReportInput): CorporateAutopsyReport {
  const rootCauses = input.rootCauses.map(({ title, detail }, index) => `**${index + 1}. ${title}.** ${detail}`).join("\n\n");
  const timeline = input.timeline.map(({ date, event }) => `- **${date}:** ${event}`).join("\n");
  const takeaways = input.takeaways.map((takeaway) => `- ${takeaway}`).join("\n");
  const sources = input.sources.map(({ label, url }) => `- [${label}](${url})`).join("\n");

  return {
    slug: input.slug,
    title: input.title,
    industry: input.industry,
    crisisOutcome: input.crisisOutcome,
    timePeriod: input.timePeriod,
    mainBusinessProblem: input.mainBusinessProblem,
    summary: input.summary,
    mechanisms: input.mechanisms,
    readTime: "4-5 min",
    contentStatus: "complete",
    markdown: `# ${input.title}

**Industry:** ${input.industry}  
**Crisis / Outcome:** ${input.crisisOutcome}  
**Time Period:** ${input.timePeriod}  
**Main Business Problem:** ${input.mainBusinessProblem}  
**Read Time:** 4-5 min

## Executive Summary

${input.executiveSummary}

## Company Background

${input.background}

## Root Causes

${rootCauses}

## Key Decisions and Timeline

${timeline}

## Business Impact

${input.businessImpact}

## What Could Have Been Done Differently

${input.whatCouldChange}

## Takeaways for Students

${takeaways}

## Sources

${sources}`,
    sources: input.sources,
  };
}

const source = (label: string, url: string): EditorialSource => ({ label, url });

export const additionalCorporateAutopsyReports: CorporateAutopsyReport[] = [
  buildReport({
    slug: "wework",
    title: "Corporate Autopsy: WeWork",
    industry: "Flexible office space / commercial real estate",
    crisisOutcome: "Failed IPO, liquidity crisis, and 2023 Chapter 11 restructuring",
    timePeriod: "2010-2024",
    mainBusinessProblem: "Long-term lease obligations funded by short-term, flexible memberships",
    summary: "WeWork’s collapse grew from a structural mismatch: flexible customer commitments sat on top of inflexible long-term leases, and rapid growth made that exposure harder to manage.",
    mechanisms: ["Strategy", "Liquidity", "Governance"],
    executiveSummary: "WeWork filed for Chapter 11 protection in November 2023 after a failed IPO, recurring losses, weak office demand, and difficult lease obligations exhausted its room to maneuver. The business did create revenue and a recognizable brand, but its contracts put the company at risk when occupancy, pricing, or financing weakened. A member could leave much sooner than WeWork could exit a lease. The later bankruptcy was therefore not simply a pandemic story; remote work revealed a vulnerability that had been built into the model during expansion.",
    background: "Founded in 2010, WeWork leased office buildings, redesigned them, and sold flexible workspace memberships to individuals and companies. The service appealed to users who wanted shorter commitments than conventional office leases. But the company itself generally signed much longer leases with landlords. This made WeWork a real-estate operating business with technology-style growth expectations. Its 2019 registration statement made investors question whether the company’s governance, losses, and expansion pace matched the public-market story it was trying to tell.",
    rootCauses: [
      { title: "Contract mismatch", detail: "Customer memberships could be reduced or canceled far sooner than lease obligations. When a location performed poorly, rent did not fall at the same speed as revenue." },
      { title: "Expansion before durable unit economics", detail: "Opening more locations increased top-line revenue but also added build-out costs, rent, and operating commitments. Growth did not prove that a mature location could reliably produce cash after those costs." },
      { title: "Governance questions", detail: "The withdrawn 2019 IPO filing brought founder control, related-party arrangements, and recurring losses into public view. Those disclosures reduced confidence just as WeWork needed outside capital." },
      { title: "External office-market pressure", detail: "Remote and hybrid work weakened demand for office space. It did not create the lease mismatch, but it made the mismatch harder to finance or repair." },
    ],
    timeline: [
      { date: "2010", event: "WeWork is founded in New York." },
      { date: "August 2019", event: "The company files a registration statement for an IPO, disclosing large losses and unusual governance arrangements." },
      { date: "September 2019", event: "The IPO is withdrawn and co-founder Adam Neumann leaves the CEO role." },
      { date: "October 2021", event: "WeWork becomes publicly traded through a SPAC transaction." },
      { date: "August 2023", event: "The company states that substantial doubt exists about its ability to continue as a going concern." },
      { date: "November 6, 2023", event: "WeWork files for Chapter 11 protection." },
      { date: "May 2024", event: "A bankruptcy court confirms the company’s restructuring plan." },
    ],
    businessImpact: "Chapter 11 gave WeWork a legal process for renegotiating or exiting unprofitable leases and reorganizing its debt. The process preserved a smaller operating company but did not restore the private-market valuation implied during its high-growth years. The key business impact was not merely an accounting loss: clients, landlords, employees, lenders, and investors all had to reassess a model whose central promise was flexibility while its own costs remained rigid.",
    whatCouldChange: "WeWork could have required stronger evidence of location-level cash generation before adding leases, kept more liquidity against occupancy shocks, and used more management agreements that shift some real-estate risk to property owners. An independent board and simpler governance could also have tested the expansion plan earlier. The goal would not have been to eliminate risk; it would have been to avoid making growth dependent on uninterrupted access to capital.",
    takeaways: [
      "Revenue growth is not enough if every new sale adds a larger fixed obligation.",
      "A company’s contracts can matter as much as its product when conditions change.",
      "Governance concerns can cut off financing before an operating problem becomes visible to customers.",
    ],
    sources: [
      source("WeWork 2019 registration statement", "https://www.sec.gov/Archives/edgar/data/1533523/000119312519220499/d781982ds1.htm"),
      source("WeWork June 2023 Form 10-Q", "https://www.sec.gov/Archives/edgar/data/1813756/000181375623000059/we-20230630.htm"),
      source("WeWork September 2023 Form 10-Q", "https://www.sec.gov/Archives/edgar/data/1813756/000181375623000067/wework2023q310q.htm"),
      source("WeWork restructuring-plan approval", "https://www.reuters.com/legal/wework-cleared-exit-bankruptcy-slash-4-billion-debt-court-says-2024-05-30/"),
    ],
  }),
  buildReport({
    slug: "silicon-valley-bank",
    title: "Corporate Autopsy: Silicon Valley Bank",
    industry: "Commercial banking",
    crisisOutcome: "Closed by regulators on March 10, 2023; deposits and assets transferred through an FDIC bridge-bank resolution",
    timePeriod: "2020-2023",
    mainBusinessProblem: "A concentrated, rate-sensitive balance sheet combined with deposits that could leave quickly",
    summary: "Silicon Valley Bank became a textbook asset-liability-management case: long-duration securities lost value as rates rose while a concentrated base of largely uninsured deposits became unstable.",
    mechanisms: ["Liquidity", "Capital allocation", "Governance"],
    executiveSummary: "Silicon Valley Bank failed in March 2023 after a rapid run on deposits exposed weaknesses in its balance sheet and liquidity planning. The Federal Reserve’s review found that the bank grew quickly, failed to manage interest-rate and liquidity risk adequately, and was not supervised forcefully enough as its risk profile changed. Higher interest rates reduced the market value of the bank’s long-duration securities. When SVB announced a securities sale and capital plan, confidence broke among depositors who were unusually concentrated and often uninsured.",
    background: "SVB served venture-backed technology and life-sciences businesses, their founders, and investment funds. That specialization made it valuable to its customers, but it also meant its deposits were tied to a narrower economic ecosystem than those of a broadly diversified consumer bank. During the low-rate period, deposits grew rapidly. The bank invested a large share of those funds in longer-duration securities. That decision was not automatically irrational, but it left the bank especially exposed if rates rose and deposits stopped being stable.",
    rootCauses: [
      { title: "Interest-rate exposure", detail: "When market rates rose, the value of fixed-rate securities fell. The Federal Reserve review concluded that SVB had not effectively managed the resulting interest-rate risk." },
      { title: "Unstable funding base", detail: "A large share of deposits exceeded the insured limit and belonged to interconnected venture and technology customers. That made withdrawal behavior more correlated during a confidence shock." },
      { title: "Weak liquidity planning", detail: "The bank did not hold enough immediately available liquidity for a severe run scenario. Selling securities to meet withdrawals made losses and stress visible at the worst possible time." },
      { title: "Governance and supervision gaps", detail: "The Federal Reserve review described weaknesses in risk management, internal challenge, and supervisory escalation as the bank grew." },
    ],
    timeline: [
      { date: "2020-2021", event: "SVB’s deposits grow rapidly during the low-rate, venture-funding boom." },
      { date: "2022", event: "Rising rates reduce the market value of long-duration securities while venture funding and deposits slow." },
      { date: "March 8, 2023", event: "SVB announces securities sales and a plan to raise capital." },
      { date: "March 9, 2023", event: "Customers attempt to withdraw deposits at extraordinary speed." },
      { date: "March 10, 2023", event: "California regulators close SVB and appoint the FDIC as receiver." },
      { date: "March 12, 2023", event: "Federal authorities invoke a systemic-risk exception to protect all depositors." },
    ],
    businessImpact: "The bank’s closure disrupted companies that used SVB for payroll, deposits, credit, and payment services. The FDIC created Silicon Valley Bridge Bank and later arranged a sale of the bridge bank to First Citizens. The case also changed the banking conversation: investors and regulators began paying closer attention to uninsured-deposit concentration, unrealized losses on securities, and whether reported capital truly represented resources that could be used during a run.",
    whatCouldChange: "SVB could have shortened the duration of its securities portfolio, hedged more of its rate exposure, diversified deposits, and maintained a larger buffer of immediately available liquidity. Its board and risk leaders also needed to run severe but plausible withdrawal scenarios before a capital raise was necessary. Better communication might have helped at the margin, but it could not substitute for a balance sheet designed to withstand loss of confidence.",
    takeaways: [
      "A bank can appear well capitalized while still lacking cash for a fast withdrawal shock.",
      "Deposit concentration is a funding risk, not simply a customer-growth success story.",
      "Interest-rate risk and liquidity risk often become dangerous together, not separately.",
    ],
    sources: [
      source("Federal Reserve review of SVB supervision and regulation", "https://www.federalreserve.gov/publications/files/svb-review-20230428.pdf"),
      source("FDIC failed-bank record", "https://www.fdic.gov/resources/resolutions/bank-failures/failed-bank-list/silicon-valley.html"),
      source("FDIC announcement on the Silicon Valley Bridge Bank", "https://www.fdic.gov/news/press-releases/2023/pr23020.html"),
    ],
  }),
  buildReport({
    slug: "bed-bath-beyond",
    title: "Corporate Autopsy: Bed Bath & Beyond",
    industry: "Specialty retail",
    crisisOutcome: "2023 Chapter 11 filing followed by a wind-down and liquidation plan",
    timePeriod: "2019-2023",
    mainBusinessProblem: "A weakening retail proposition met inventory, financing, and liquidity stress before the company could reset the business",
    summary: "Bed Bath & Beyond’s bankruptcy illustrates how declining sales, merchandising disruption, financing strain, and supplier confidence can narrow a retailer’s options at the same time.",
    mechanisms: ["Capital allocation", "Strategy", "Liquidity"],
    executiveSummary: "Bed Bath & Beyond filed for Chapter 11 protection in April 2023 after years of declining sales, strategic reversals, liquidity stress, and supplier concerns. The company’s failure was not one bad quarter or one new competitor. A retailer must keep inventory fresh, stores relevant, digital operations competitive, and suppliers willing to extend credit. By 2023, the company had less cash and less time to fix all of those systems at once. Its court-approved plan provided for an orderly wind-down, not a return to the former business model.",
    background: "Bed Bath & Beyond became a well-known home-goods retailer through large stores, a broad assortment, and coupon-driven customer traffic. That model worked in an era when physical retail had fewer digital alternatives. As e-commerce, big-box competitors, and changing consumer habits intensified, the company faced a harder question: how could it update its merchandise and online experience without losing the customers who relied on familiar brands, promotions, and store inventory?",
    rootCauses: [
      { title: "Strategy disruption", detail: "Changes to assortment, private-label emphasis, and promotions made it harder to maintain customer loyalty before a replacement value proposition had proven itself." },
      { title: "Inventory and supplier pressure", detail: "Retailers depend on suppliers to ship products and on working capital to stock stores. When liquidity and confidence weaken, inventory availability can become an operating problem as well as a finance problem." },
      { title: "Capital-allocation limits", detail: "Years of financial pressure left less room to invest in stores, e-commerce, data, or competitive pricing while also meeting obligations." },
      { title: "Liquidity crisis", detail: "By the Chapter 11 filing, the company’s disclosures made clear that financing and liquidity were central constraints rather than a temporary inconvenience." },
    ],
    timeline: [
      { date: "2019", event: "The company begins a period of activist pressure and strategic change." },
      { date: "2020-2021", event: "Management attempts major assortment, private-label, and store-strategy changes." },
      { date: "2022", event: "Sales decline and financing pressure intensify; supplier and inventory concerns become more visible." },
      { date: "January 2023", event: "The company warns of substantial doubt about its ability to continue as a going concern." },
      { date: "April 23, 2023", event: "Bed Bath & Beyond files for Chapter 11 protection." },
      { date: "September 2023", event: "A court confirms the company’s wind-down plan, canceling existing equity interests." },
    ],
    businessImpact: "The bankruptcy process led to store closures, asset sales, job losses, and the cancellation of existing shares under the plan. The brand and intellectual property could still have value to buyers, but that is different from preserving the former operating company. The case demonstrates that a familiar name can outlive a business model, while employees, suppliers, and shareholders experience very different outcomes in a wind-down.",
    whatCouldChange: "Leadership could have used smaller, measured tests before changing core promotions and assortment, linked capital spending to clear store-level outcomes, and rebuilt supplier confidence before inventory availability became a severe constraint. Earlier recognition of the liquidity problem could have forced a more realistic reset, even if it meant fewer stores and slower growth. In retail, a turnaround plan must be funded long enough to reach customers, not simply announced.",
    takeaways: [
      "A retail strategy can fail operationally before the financial statements show the full damage.",
      "Supplier confidence is part of a retailer’s ability to serve customers.",
      "Bankruptcy can preserve a process for selling assets; it does not prove a business model has been repaired.",
    ],
    sources: [
      source("Bed Bath & Beyond Form 10-K and bankruptcy disclosures", "https://www.sec.gov/Archives/edgar/data/886158/000088615823000059/bbby-20230225.htm"),
      source("Bed Bath & Beyond Form 8-K on its Chapter 11 plan", "https://www.sec.gov/Archives/edgar/data/886158/000119312523238592/d521320d8k.htm"),
      source("Chapter 11 petition and case docket", "https://restructuring.ra.kroll.com/bbby/"),
    ],
  }),
  buildReport({
    slug: "general-electric",
    title: "Corporate Autopsy: General Electric",
    industry: "Industrial conglomerate",
    crisisOutcome: "Multi-year restructuring, asset sales, deleveraging, and separation into focused companies",
    timePeriod: "2001-2024",
    mainBusinessProblem: "Conglomerate complexity, uneven capital allocation, leverage, and weakening confidence in earnings quality reduced GE’s strategic flexibility",
    summary: "General Electric did not become a bankruptcy case. It became a long repair: simplify a complex portfolio, reduce leverage, rebuild cash discipline, and separate businesses whose risks no longer fit together.",
    mechanisms: ["Capital allocation", "Strategy", "Governance"],
    executiveSummary: "General Electric’s crisis was a prolonged loss of operating and financial flexibility rather than a single collapse. Over time, the company accumulated a complicated mix of industrial businesses, financial exposure, acquisition commitments, and debt. Problems in Power, insurance reserves, and cash generation reduced confidence in the company’s reported performance. Management responded through asset sales, dividend cuts, debt reduction, and eventual separation into focused public companies. The case is useful because it shows that value destruction can be repaired without a bankruptcy filing, but the repair may take years.",
    background: "For much of its history, GE was a model conglomerate: a company operating across aviation, power, healthcare, finance, and other industries. Diversification created scale and access to capital, but it also made performance hard to interpret. Different businesses had different cycles, regulatory demands, and investment needs. The central question eventually became whether the company’s complexity was still an advantage or whether it had become a barrier to accountability and capital allocation.",
    rootCauses: [
      { title: "Portfolio complexity", detail: "A broad mix of businesses could obscure which units generated durable cash and which required more capital, reserves, or restructuring." },
      { title: "Capital-allocation pressure", detail: "Acquisitions, dividends, repurchases, and financial commitments reduced room to respond when operating performance weakened." },
      { title: "Power-market deterioration", detail: "The Power business faced weaker demand and a changing energy market, forcing the company to reassess assets and expectations." },
      { title: "Credibility and governance stress", detail: "Insurance-reserve charges, changing guidance, and cash-flow concerns made external users question whether the company’s reporting and risk controls were keeping pace with the portfolio." },
    ],
    timeline: [
      { date: "2001", event: "GE’s post-Jack Welch era begins with a broad industrial and financial portfolio." },
      { date: "2015", event: "GE announces the acquisition of Alstom’s power and grid businesses." },
      { date: "2017", event: "The company begins major asset-sale and restructuring actions." },
      { date: "2018", event: "GE reports major Power and insurance-related pressures and reduces its dividend." },
      { date: "2021", event: "GE announces plans to separate into three focused public companies." },
      { date: "2023-2024", event: "GE HealthCare and GE Vernova separate, leaving GE Aerospace as the remaining parent company." },
    ],
    businessImpact: "GE sold assets, cut costs, reduced debt, and reorganized major business units. The separations gave investors clearer exposure to healthcare, energy, and aerospace instead of a single large conglomerate. That does not mean every past decision was reversed; the company spent years rebuilding balance-sheet capacity, management attention, and credibility. The outcome was a transformation of the organization, not merely a short-term turnaround announcement.",
    whatCouldChange: "GE could have imposed clearer capital-return limits, stress-tested large acquisitions and insurance commitments under worse scenarios, and simplified its reporting and accountability earlier. A conglomerate can succeed, but management needs to prove that complexity improves capital allocation rather than hiding it. Giving each business clearer cash, risk, and return targets earlier would have made problems easier to see and address.",
    takeaways: [
      "Diversification can reduce risk, but it can also hide weak economics and slow accountability.",
      "Capital allocation is a long-term operating decision, not just a finance function.",
      "A turnaround may mean changing the organization itself, not merely improving a quarterly result.",
    ],
    sources: [
      source("GE 2018 annual report", "https://www.sec.gov/Archives/edgar/data/40545/000004054519000011/ge201810-k.htm"),
      source("GE annual reports archive", "https://www.ge.com/investor-relations/annual-reports"),
      source("GE announcement of planned separations", "https://www.ge.com/news/reports/ge-to-form-three-public-companies-focused-on-aviation-healthcare-and-energy"),
    ],
  }),
  buildReport({
    slug: "toys-r-us",
    title: "Corporate Autopsy: Toys “R” Us",
    industry: "Specialty retail",
    crisisOutcome: "Chapter 11 process and U.S. liquidation after an unsuccessful restructuring",
    timePeriod: "2005-2018",
    mainBusinessProblem: "A debt-heavy capital structure limited the company’s ability to modernize while retail competition and customer expectations shifted",
    summary: "Toys “R” Us entered the retail transition with too little financial flexibility. Debt did not cause every operating problem, but it made investment in stores, digital commerce, and pricing harder to fund.",
    mechanisms: ["Capital allocation", "Strategy", "Liquidity"],
    executiveSummary: "Toys “R” Us filed for Chapter 11 protection in September 2017 and moved toward a U.S. liquidation the following year. The company’s core problem was not that toys suddenly stopped selling. It was that a highly leveraged retailer faced the same digital disruption and price competition as other chains while devoting significant attention and cash to its capital structure. The bankruptcy process gave the company time to explore options, but it could not restore the investment capacity or customer momentum required for a lasting turnaround.",
    background: "Toys “R” Us was once a dominant specialty retailer for toys and juvenile products. Its scale, vendor relationships, and brand made it a major destination for families. In 2005, a private-equity consortium took the company private in a leveraged buyout. A leveraged buyout uses borrowed money to help fund an acquisition, making the acquired company responsible for a large debt burden. That structure can work when cash flows are durable and investment needs are controlled; retail was becoming a much less forgiving environment.",
    rootCauses: [
      { title: "Leverage reduced flexibility", detail: "Debt service and refinancing needs competed directly with the money required for store updates, price matching, inventory systems, and e-commerce." },
      { title: "Retail disruption", detail: "Amazon, mass merchants, and online competitors changed discovery, convenience, and pricing. A specialty chain needed to invest to keep its distinctive role with customers." },
      { title: "Seasonal business risk", detail: "Toy retail depends heavily on the holiday season. A company with limited liquidity has less room to absorb inventory mistakes or a weak selling season." },
      { title: "Late strategic options", detail: "By the time the restructuring began, the business had to solve debt, stores, supplier confidence, and customer relevance simultaneously." },
    ],
    timeline: [
      { date: "2005", event: "A private-equity consortium acquires Toys “R” Us in a leveraged buyout." },
      { date: "2010s", event: "E-commerce and mass-merchant competition change the economics of specialty toy retail." },
      { date: "September 18, 2017", event: "Toys “R” Us and affiliates file for Chapter 11 protection." },
      { date: "March 2018", event: "The company announces a process to wind down U.S. operations after restructuring alternatives do not succeed." },
      { date: "June 2018", event: "Most U.S. stores close as the liquidation proceeds." },
    ],
    businessImpact: "The liquidation affected employees, landlords, suppliers, customers, and communities that relied on the stores. The brand later returned in smaller forms under different ownership, but brand survival is not the same as preserving the original operating company. The core lesson is that an otherwise recognizable retailer can be unable to adapt when financial obligations consume the resources required to change.",
    whatCouldChange: "A less leveraged ownership structure would have preserved more capital for store experience, online ordering, inventory systems, and competitive pricing. Management could also have focused earlier on a smaller but differentiated format rather than trying to maintain a broad footprint while competitors were changing the rules of the category. A restructuring works best when it begins while there is still cash and customer relevance to protect.",
    takeaways: [
      "Debt is especially risky when a business must spend heavily to adapt.",
      "A familiar brand can outlast an operating company, so brand recognition is not a measure of financial health.",
      "Bankruptcy buys time; it does not create a competitive strategy or the cash to execute one.",
    ],
    sources: [
      source("U.S. Bankruptcy Court case record", "https://www.vaeb.uscourts.gov/servecal/files/megadkt/677269.html"),
      source("Toys “R” Us restructuring case information", "https://restructuring.ra.kroll.com/toysrus/"),
      source("Toys “R” Us Chapter 11 announcement", "https://www.prnewswire.com/news-releases/toysrus-inc-and-certain-of-its-us-subsidiaries-file-voluntary-petitions-for-business-reorganization-under-chapter-11-in-the-us-bankruptcy-court-for-the-eastern-district-of-virginia-300521263.html"),
    ],
  }),
  buildReport({
    slug: "southwest-airlines",
    title: "Corporate Autopsy: Southwest Airlines",
    industry: "Airlines",
    crisisOutcome: "2022 holiday operational collapse followed by regulatory penalties and a multi-year technology-and-operations remediation effort",
    timePeriod: "2022-2024",
    mainBusinessProblem: "An operating system that struggled to recover once weather disruption pushed crews, aircraft, customers, and communications out of sync",
    summary: "Southwest’s 2022 holiday breakdown shows that a company’s operating systems are part of its business model: severe weather was the trigger, but the recovery failure determined the scale of the crisis.",
    mechanisms: ["Operations", "Strategy", "Governance"],
    executiveSummary: "Southwest Airlines’ December 2022 holiday disruption was caused by more than weather. Winter Storm Elliott affected multiple airlines, but Southwest’s point-to-point network, crew-scheduling tools, customer-service systems, and recovery processes struggled to regain control as disruptions spread. The U.S. Department of Transportation later imposed a civil penalty and required remedies related to consumer-protection failures. For a low-cost airline, operational reliability is part of the value proposition; when the network fails, the damage reaches revenue, expenses, employee morale, customer loyalty, and regulatory trust at once.",
    background: "Southwest built a distinct business model around point-to-point flying, rapid aircraft turns, and a largely single-fleet strategy. Unlike a traditional hub-and-spoke carrier, its crews and aircraft move through many connected city pairs. That can be efficient in normal operations, but recovery becomes complicated when weather affects a large part of the country. The business model therefore depends not only on planes and pilots, but also on accurate crew visibility, communication, and software that can quickly rebuild a disrupted schedule.",
    rootCauses: [
      { title: "Network-recovery complexity", detail: "A point-to-point network can transmit disruption across many cities. Once crews and aircraft were misplaced, normal recovery processes became less effective." },
      { title: "Technology constraints", detail: "The incident exposed gaps in crew scheduling, rebooking, and communication systems. Operational software is not back-office support; it directly affects whether an airline can fly its schedule." },
      { title: "Customer-care breakdown", detail: "The DOT’s enforcement action focused on failures related to refunds, reimbursements, and communications as passengers were stranded or unable to reach the company." },
      { title: "Governance and investment priorities", detail: "The event raised the question of whether operational-resilience investments had kept pace with the scale and complexity of the network." },
    ],
    timeline: [
      { date: "December 21-26, 2022", event: "Winter Storm Elliott disrupts air travel across the United States." },
      { date: "Late December 2022", event: "Southwest cancels a large share of its flights as its network recovery breaks down." },
      { date: "January 2023", event: "The company begins outlining technology, operations, and customer-service investments." },
      { date: "December 18, 2023", event: "The DOT announces a $140 million civil penalty and consumer-remediation terms." },
      { date: "2024", event: "Southwest continues operational modernization and broader strategic changes." },
    ],
    businessImpact: "The disruption produced direct costs from refunds, reimbursements, lost bookings, and operational repairs, as well as long-term reputational damage. It also turned internal technology investment into a public business issue. The DOT’s action made clear that an external weather event does not remove a company’s responsibility to communicate, refund, and care for customers once its own system cannot recover. The airline could continue operating, but it had to commit capital and leadership attention to reliability.",
    whatCouldChange: "Southwest could have stress-tested its crew and customer systems against nationwide weather disruption, accelerated modernization before a crisis, and created clearer manual fallback processes for employees when software could not keep up. Board oversight should treat resilience metrics, including crew recovery time, refund completion, and communication capacity, as operating performance indicators, not only IT matters.",
    takeaways: [
      "An external shock tests a company’s systems; it does not automatically explain a failed response.",
      "Technology spending can be a safety and customer-trust investment, not just a cost line.",
      "Operating models must be judged by how they recover under stress, not only by their efficiency on normal days.",
    ],
    sources: [
      source("U.S. Department of Transportation enforcement action", "https://www.transportation.gov/briefing-room/us-department-transportation-fines-southwest-airlines-140-million-over-2022-holiday"),
      source("Southwest Airlines SEC filings", "https://www.southwestairlinesinvestorrelations.com/financials/sec-filings/default.aspx"),
      source("Southwest Airlines 2022 annual report", "https://www.sec.gov/Archives/edgar/data/92380/000009238023000018/luv-20221231.htm"),
    ],
  }),
  buildReport({
    slug: "blackberry",
    title: "Corporate Autopsy: BlackBerry",
    industry: "Mobile devices and software",
    crisisOutcome: "Smartphone leadership eroded; company exited most hardware activity and shifted toward software and cybersecurity",
    timePeriod: "2007-2016",
    mainBusinessProblem: "A successful hardware and messaging franchise did not adapt fast enough to touch-screen, app-ecosystem, and consumer-experience competition",
    summary: "BlackBerry’s decline is a strategic-adaptation case: product security and installed-base strength were real assets, but they did not automatically produce a competitive smartphone ecosystem.",
    mechanisms: ["Strategy", "Operations", "Capital allocation"],
    executiveSummary: "BlackBerry did not file for bankruptcy, but it lost the smartphone leadership it had built during the early mobile-internet era. Its core products were trusted for secure messaging and physical keyboards, especially among business and government users. The market changed rapidly after touch-screen devices, app stores, and developer ecosystems became central to consumer choice. BlackBerry’s response was slowed by product delays, ecosystem weakness, and the difficulty of changing a company organized around a formerly dominant hardware model. It eventually shifted away from designing its own phones toward software and security.",
    background: "Research In Motion, later renamed BlackBerry, helped define the early smartphone market. Its devices combined mobile email, messaging, and security in a way that appealed to professionals and organizations. That success created a powerful installed base and brand. It also created path dependence: executives and engineers had to decide whether to preserve the features that made BlackBerry successful or rebuild around a different kind of user experience, developer platform, and software ecosystem.",
    rootCauses: [
      { title: "Ecosystem shift", detail: "Consumers increasingly chose phones based on touch-screen usability, app availability, and integration with other services. Hardware features and secure messaging were no longer sufficient differentiation." },
      { title: "Delayed platform transition", detail: "BlackBerry’s operating-system transition arrived after rivals had gained developer and consumer momentum, making it harder to attract applications and partners." },
      { title: "Product-strategy conflict", detail: "The company had to protect business customers while competing for consumers, but those groups increasingly expected a unified modern platform." },
      { title: "Capital and focus", detail: "Resources spent defending a shrinking hardware position were resources not fully available for a faster software-focused transition." },
    ],
    timeline: [
      { date: "2007", event: "Apple introduces the iPhone, changing consumer expectations for smartphones." },
      { date: "2008", event: "Google’s Android platform begins expanding the competing app ecosystem." },
      { date: "2012", event: "BlackBerry’s annual report describes intensifying competition and a major platform transition." },
      { date: "January 2013", event: "The company launches BlackBerry 10 and renames itself BlackBerry." },
      { date: "September 2016", event: "BlackBerry announces it will stop all internal hardware development and focus on software." },
    ],
    businessImpact: "The company’s device share and hardware revenue declined sharply from its earlier leadership position. BlackBerry preserved parts of its enterprise and security capabilities, but the transformation required a different business model and a smaller role in consumer devices. The case makes an important distinction: a company can survive, even pivot, without preserving the market position that originally made it famous.",
    whatCouldChange: "BlackBerry could have treated developer tools, consumer software, and a modern touch interface as strategic priorities earlier, even if that meant disrupting its own keyboard-centered franchise. It also could have separated hardware and software decisions more clearly so that a declining device business did not dominate the pace of the security and enterprise transition.",
    takeaways: [
      "A strong product can become a constraint when the basis of competition changes.",
      "Platforms win through users, developers, and partners, not hardware features alone.",
      "A pivot is more credible when resources move early enough to build the next business before the old one collapses.",
    ],
    sources: [
      source("BlackBerry 2012 annual report", "https://www.sec.gov/Archives/edgar/data/1070235/000119312512261041/d318998d20f.htm"),
      source("BlackBerry financial reports archive", "https://www.blackberry.com/us/en/company/investors/financial-reports"),
      source("BlackBerry announcement on ending internal hardware development", "https://www.blackberry.com/us/en/company/newsroom/press-releases/2016/blackberry-to-end-all-internal-hardware-development-and-outsource-that-function-to-partners"),
    ],
  }),
  buildReport({
    slug: "jc-penney",
    title: "Corporate Autopsy: J.C. Penney",
    industry: "Department-store retail",
    crisisOutcome: "2020 Chapter 11 filing and sale of operating assets after years of declining sales and financial pressure",
    timePeriod: "2011-2020",
    mainBusinessProblem: "A disrupted pricing and merchandising strategy, changing customer behavior, and debt obligations left too little room to absorb the 2020 shock",
    summary: "J.C. Penney’s decline shows how a retailer can lose core customers when a strategy reset is too abrupt, then face a liquidity crisis before it has rebuilt relevance.",
    mechanisms: ["Strategy", "Liquidity", "Capital allocation"],
    executiveSummary: "J.C. Penney filed for Chapter 11 protection in May 2020 after years of sales pressure, strategic disruption, debt obligations, and the sudden pandemic closure of stores. The pandemic accelerated the crisis, but it did not create it. Earlier changes to pricing, promotions, and merchandising alienated parts of the company’s core customer base without producing a durable replacement. The company then had to compete with e-commerce and discount retailers while working with a legacy store footprint and less liquidity. Its operating assets were ultimately sold to new owners.",
    background: "J.C. Penney was a long-established department-store chain offering apparel, home goods, beauty, and services through a national store base. The business had relied on promotions and coupons to attract value-oriented shoppers. Leaders tried to change that model by emphasizing simpler everyday pricing and a different merchandising strategy. The question was reasonable: could a department store become more modern and less dependent on promotions? The execution, however, tested customer habits that had developed over decades.",
    rootCauses: [
      { title: "Abrupt customer-value change", detail: "Changes to promotions and pricing weakened the familiar value signal for core customers before the new strategy had earned their loyalty." },
      { title: "Legacy footprint and e-commerce pressure", detail: "Large department stores faced declining mall traffic and rising online competition, requiring investment at a time when cash generation was under pressure." },
      { title: "Debt and liquidity limits", detail: "Obligations constrained the company’s ability to endure a long turnaround or absorb a severe disruption to store traffic." },
      { title: "Pandemic acceleration", detail: "Temporary store closures and the sudden decline in in-person shopping turned existing strain into an immediate liquidity problem." },
    ],
    timeline: [
      { date: "2011", event: "New leadership begins planning a major reset of pricing, promotions, and merchandise presentation." },
      { date: "2012", event: "The new pricing strategy rolls out and sales decline sharply." },
      { date: "2013", event: "The company reverses parts of the strategy and begins restoring promotions." },
      { date: "2017-2019", event: "Store closures and financial pressure continue as the company searches for a sustainable model." },
      { date: "May 15, 2020", event: "J.C. Penney files for Chapter 11 protection." },
      { date: "December 2020", event: "The operating business is sold to Simon Property Group and Brookfield Asset Management." },
    ],
    businessImpact: "The Chapter 11 process threatened jobs, vendor relationships, and mall traffic across the country. The sale preserved an operating company under new owners, but it did not remove the fundamental challenge of making department stores relevant and profitable in a changed retail landscape. The case also shows how a strategy shift can become a balance-sheet issue when a company loses sales faster than it can rebuild demand.",
    whatCouldChange: "Management could have tested the pricing change in selected markets, preserved a clear value signal for loyal shoppers, and measured customer behavior before rolling out a nationwide reset. Earlier store rationalization, digital investment, and debt reduction might have created more room to maneuver. The necessary lesson is not that old strategies should never change; it is that a customer-facing reset needs staged evidence and financial endurance.",
    takeaways: [
      "A good strategic question can still produce a bad outcome if execution ignores customer habits.",
      "Retail turnarounds need enough liquidity to survive the period when customers are deciding whether to return.",
      "A shock often reveals weakness that was already present in the model.",
    ],
    sources: [
      source("J.C. Penney Form 8-K on its Chapter 11 filing", "https://www.sec.gov/Archives/edgar/data/1166126/000119312520136392/d907918d8k.htm"),
      source("J.C. Penney bankruptcy case information", "https://restructuring.ra.kroll.com/JCPenney/"),
      source("J.C. Penney 2019 annual report", "https://www.sec.gov/Archives/edgar/data/1166126/000116612620000009/jcp-20200201.htm"),
    ],
  }),
  buildReport({
    slug: "ftx",
    title: "Corporate Autopsy: FTX",
    industry: "Cryptocurrency exchange",
    crisisOutcome: "2022 bankruptcy and criminal proceedings involving former leadership",
    timePeriod: "2019-2024",
    mainBusinessProblem: "Inadequate governance, recordkeeping, and separation of customer assets made a liquidity shock impossible to manage transparently",
    summary: "FTX is a controls case before it is a crypto case: basic records, customer-asset protections, and independent oversight were too weak for an institution holding other people’s money.",
    mechanisms: ["Governance", "Liquidity", "Capital allocation"],
    executiveSummary: "FTX’s November 2022 bankruptcy exposed a breakdown of governance, recordkeeping, and customer-asset controls at a large cryptocurrency exchange. A market decline and loss of confidence accelerated withdrawals, but the bankruptcy record made clear that the company lacked the dependable internal controls expected of a financial intermediary. Court filings, regulatory actions, and criminal proceedings established facts through different processes, so this report distinguishes public allegations, judicial findings, and the later bankruptcy administration. The durable business lesson is that growth and brand visibility cannot replace basic financial controls.",
    background: "FTX operated a platform for buying, selling, and trading crypto assets. Like other financial intermediaries, it depended on customers believing that deposits, liabilities, and conflicts were accurately recorded and protected. The company grew rapidly and became a prominent name in sports, marketing, and venture investing. That visibility was not evidence that its governance systems could safely handle customer assets, related-party risks, or a sudden demand for withdrawals.",
    rootCauses: [
      { title: "Weak governance and records", detail: "The bankruptcy estate’s first-day materials described severe deficiencies in corporate controls, reliable financial information, and recordkeeping." },
      { title: "Customer-asset and conflict controls", detail: "Public court and regulatory records described failures in the treatment of customer funds and related-party relationships. The exact legal consequences were established through separate proceedings, not by inference." },
      { title: "Liquidity shock", detail: "Once confidence broke, customers sought to withdraw assets quickly. A platform that cannot clearly show what it holds and owes cannot credibly manage that pressure." },
      { title: "Lack of independent oversight", detail: "A financial intermediary needs independent challenge, reconciliations, and transparent governance before a crisis. Those controls are most valuable when management is under pressure." },
    ],
    timeline: [
      { date: "2019", event: "FTX begins operations." },
      { date: "Early November 2022", event: "Public reporting and market concerns intensify scrutiny of FTX and affiliated entities." },
      { date: "November 11, 2022", event: "FTX and affiliated debtors file for Chapter 11 protection in Delaware." },
      { date: "December 2022", event: "Federal criminal charges are announced against former CEO Sam Bankman-Fried." },
      { date: "November 2023", event: "A federal jury finds Bankman-Fried guilty on fraud and conspiracy counts." },
      { date: "2024", event: "The bankruptcy process continues through plan and asset-recovery work." },
    ],
    businessImpact: "The failure froze customer access to assets, created a complex bankruptcy estate, and triggered civil and criminal proceedings. It also damaged confidence in crypto platforms more broadly and increased attention to custody, proof-of-reserves claims, audit quality, and regulatory oversight. Importantly, the bankruptcy estate’s work to recover and distribute value should not be confused with an ordinary operating turnaround; it is a legal and financial process for resolving a failure.",
    whatCouldChange: "FTX needed basic financial-intermediary controls from the start: clear legal separation of customer assets, independent board oversight, routine reconciliations, transparent related-party policies, credible financial statements, and tested liquidity procedures. Those steps are not bureaucratic extras. They are the operating system of a business that holds assets belonging to other people.",
    takeaways: [
      "Growth, valuation, and celebrity marketing do not prove that a financial platform is safe.",
      "Customer assets require clear segregation, records, and independent verification.",
      "When legal cases are ongoing, strong analysis distinguishes proven facts from allegations and uncertainty.",
    ],
    sources: [
      source("FTX Chapter 11 case information", "https://restructuring.ra.kroll.com/FTX/"),
      source("United States v. Samuel Bankman-Fried", "https://www.justice.gov/usao-sdny/united-states-v-samuel-bankman-fried"),
      source("Delaware Bankruptcy Court docket", "https://www.deb.uscourts.gov/"),
      source("SEC enforcement action concerning FTX", "https://www.sec.gov/newsroom/press-releases/2022-219"),
    ],
  }),
];
