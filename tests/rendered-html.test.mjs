import assert from "node:assert/strict";
import test from "node:test";

import { exportedPage } from "./static-site.mjs";

const basePath = process.env.GITHUB_PAGES_BASE_PATH || "";

function metaTag(html, attribute, value) {
  const escaped = value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return html.match(new RegExp(`<meta(?=[^>]*\\b${attribute}=["']${escaped}["'])[^>]*>`, "i"))?.[0] ?? "";
}

test("root metadata uses the portfolio identity and published social image", async () => {
  const response = await exportedPage(new Request("http://localhost/", { headers: { accept: "text/html", host: "portfolio.test" } }));

  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);
  const html = await response.text();
  assert.match(html, /<title>Research &amp; Analysis<\/title>/i);
  assert.match(metaTag(html, "property", "og:title"), /Aadi Joshi \| Research &amp; Analysis/i);
  assert.ok(metaTag(html, "property", "og:image").includes(`https://aadijoshi-eng.github.io${basePath}/og.png`));
  assert.match(metaTag(html, "name", "twitter:card"), /summary_large_image/i);
});

for (const [route, visibleTitle, metadataTitle, descriptionNeedle] of [
  ["/valuation/copart", "Copart", "Copart DCF Case Study", "yard investment limits distributable cash"],
  ["/corporate-autopsies/boeing", "Boeing", "Corporate Autopsy: Boeing", "engineering oversight"],
  ["/carolina-business-brief/citi-charlotte-expansion", "Citi’s 510-Job", "Citi’s 510-Job Charlotte Expansion", "finance career is much broader"],
]) {
  test(`${route} emits record-specific share metadata without the root social card`, async () => {
    const response = await exportedPage(new Request(`http://portfolio.test${route}`, { headers: { accept: "text/html" } }));
    assert.equal(response.status, 200);
    const html = await response.text();
    assert.match(html, new RegExp(visibleTitle, "i"));
    assert.match(html, new RegExp(`<title>[^<]*${metadataTitle.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}[^<]*<\\/title>`, "i"));
    assert.match(metaTag(html, "property", "og:title"), new RegExp(metadataTitle.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i"));
    assert.match(metaTag(html, "property", "og:description"), new RegExp(descriptionNeedle, "i"));
    assert.match(metaTag(html, "name", "twitter:title"), new RegExp(metadataTitle.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i"));
    assert.match(metaTag(html, "name", "twitter:description"), new RegExp(descriptionNeedle, "i"));
    assert.doesNotMatch(html, /og\.png/i);
  });
}
