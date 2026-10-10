import assert from "node:assert/strict";
import test from "node:test";

import { exportedPage } from "./static-site.mjs";

const basePath = process.env.GITHUB_PAGES_BASE_PATH || "";

const routes = [
  ["/", "Banking networks changed"],
  ["/atlas", "One state. One hundred county trajectories."],
  ["/trends", "Look for patterns without turning them into causes."],
  ["/findings", "A clear network contraction"],
  ["/methodology", "transparent fixed-effects design"],
  ["/data", "Every public value has a source"],
  ["/limitations", "The limits are part of the result"],
  ["/paper", "reproducible working paper"],
  ["/projects", "One portfolio, organized for a fast scan and a deep read."],
  ["/valuation", "Three businesses. Three different valuation problems."],
  ["/valuation/copart", "Reference price exceeds the base value and lies near the upside case."],
  ["/valuation/cava", "Reference price exceeds all three modeled operating cases."],
  ["/valuation/adp", "The base case offers no margin of safety at the reference price."],
  ["/corporate-autopsies", "Failure is rarely one bad decision."],
  ["/corporate-autopsies/arthur-andersen", "commercial survival depended on trust"],
  ["/corporate-autopsies/red-lobster", "Falling customer traffic combined with expensive leases"],
  ["/corporate-autopsies/boeing", "Repeated failures in engineering oversight"],
  ["/corporate-autopsies/wework", "Long-term lease obligations funded by short-term"],
  ["/corporate-autopsies/silicon-valley-bank", "concentrated, rate-sensitive balance sheet"],
  ["/corporate-autopsies/bed-bath-beyond", "wind-down and liquidation plan"],
  ["/corporate-autopsies/general-electric", "conglomerate complexity, uneven capital allocation"],
  ["/corporate-autopsies/toys-r-us", "debt-heavy capital structure"],
  ["/corporate-autopsies/southwest-airlines", "holiday operational collapse"],
  ["/corporate-autopsies/blackberry", "Smartphone leadership eroded"],
  ["/corporate-autopsies/jc-penney", "2020 Chapter 11 filing"],
  ["/corporate-autopsies/ftx", "2022 bankruptcy and criminal proceedings"],
  ["/corporate-autopsies/signals", "Evidence, not a magic score"],
  ["/carolina-business-brief", "Track the promise. Verify the progress."],
  ["/carolina-business-brief/avidxchange-goes-private", "A Charlotte company enters a new chapter"],
  ["/carolina-business-brief/genentech-holly-springs", "A much bigger commitment than originally planned"],
  ["/carolina-business-brief/jetzero-greensboro", "A rendering is becoming a real construction site"],
  ["/carolina-business-brief/river-district", "A project begins to feel real"],
  ["/carolina-business-brief/citi-charlotte-expansion", "Finance is not one job"],
  ["/carolina-business-brief/amazon-richmond-county-ai-campus", "AI still needs land, power, and people"],
  ["/carolina-business-brief/toyota-liberty-battery-plant", "The project has crossed an important line"],
  ["/carolina-business-brief/jabil-rowan-county-ai-supply-chain", "The AI economy is not only software"],
  ["/carolina-business-brief/scout-motors-charlotte-headquarters", "Charlotte won a different kind of automotive project"],
  ["/carolina-business-brief/wolfspeed-financial-restructuring", "The bankruptcy changed the balance sheet first"],
];

for (const [route, expected] of routes) {
  test(`renders ${route}`, async () => {
    const response = await exportedPage(new Request(`http://localhost${route}`, { headers: { accept: "text/html" } }));
    assert.equal(response.status, 200);
    assert.match(await response.text(), new RegExp(expected.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i"));
  });
}

test("section indexes expose every requested detail route", async () => {
  const indexes = [
    ["/valuation", ["/valuation/copart", "/valuation/cava", "/valuation/adp"]],
    ["/corporate-autopsies", [
      "/corporate-autopsies/arthur-andersen",
      "/corporate-autopsies/red-lobster",
      "/corporate-autopsies/boeing",
      "/corporate-autopsies/wework",
      "/corporate-autopsies/silicon-valley-bank",
      "/corporate-autopsies/bed-bath-beyond",
      "/corporate-autopsies/general-electric",
      "/corporate-autopsies/toys-r-us",
      "/corporate-autopsies/southwest-airlines",
      "/corporate-autopsies/blackberry",
      "/corporate-autopsies/jc-penney",
      "/corporate-autopsies/ftx",
      "/corporate-autopsies/signals",
    ]],
    ["/carolina-business-brief", [
      "/carolina-business-brief/avidxchange-goes-private",
      "/carolina-business-brief/genentech-holly-springs",
      "/carolina-business-brief/jetzero-greensboro",
      "/carolina-business-brief/river-district",
      "/carolina-business-brief/citi-charlotte-expansion",
      "/carolina-business-brief/amazon-richmond-county-ai-campus",
      "/carolina-business-brief/toyota-liberty-battery-plant",
      "/carolina-business-brief/jabil-rowan-county-ai-supply-chain",
      "/carolina-business-brief/scout-motors-charlotte-headquarters",
      "/carolina-business-brief/wolfspeed-financial-restructuring",
    ]],
  ];

  for (const [route, hrefs] of indexes) {
    const response = await exportedPage(new Request(`http://localhost${route}`, { headers: { accept: "text/html" } }));
    assert.equal(response.status, 200);
    const html = await response.text();
    for (const href of hrefs) {
      assert.match(html, new RegExp(`href=["']${basePath}${href.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}/?["']`));
    }
  }
});

test("legacy mini-case routes export a redirect to their full reports", async () => {
  const response = await exportedPage(new Request("http://localhost/corporate-autopsies/case/wework", { headers: { accept: "text/html" } }));
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /http-equiv="refresh"/i);
  assert.ok(html.includes(`${basePath}/corporate-autopsies/wework`));
});

test("the supplied Citi draft retains its complete ending and all three source links", async () => {
  const response = await exportedPage(new Request("http://localhost/carolina-business-brief/citi-charlotte-expansion", { headers: { accept: "text/html" } }));
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /future of business careers in Charlotte will be built by more than just bankers/i);
  assert.match(html, /commerce\.nc\.gov\/news\/press-releases\/2025\/07\/08\/governor-stein-announces-510-new-jobs/i);
  assert.match(html, /charlottenc\.gov\/City-News\/Citigroup-to-Establish-Major-Office-Facility-in-Charlotte/i);
  assert.match(html, /reuters\.com\/business\/finance\/citigroup-add-over-500-jobs-charlotte/i);
});

test("the Carolina Business Monitor distinguishes commitments from verified milestones", async () => {
  const response = await exportedPage(new Request("http://localhost/carolina-business-brief", { headers: { accept: "text/html" } }));
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /Announcements are not outcomes/i);
  assert.match(html, /planned capital investment/i);
  assert.match(html, /Verified now/i);
  assert.match(html, /Next checkpoint/i);
  assert.match(html, /AvidXchange/i);
  assert.match(html, /Genentech/i);
  assert.match(html, /JetZero/i);
  assert.match(html, /Crescent Communities/i);
  assert.match(html, /Citigroup/i);
  assert.match(html, /Amazon Web Services/i);
  assert.match(html, /Toyota Battery Manufacturing North Carolina/i);
  assert.match(html, /Jabil/i);
  assert.match(html, /Scout Motors/i);
  assert.match(html, /Wolfspeed/i);
});
