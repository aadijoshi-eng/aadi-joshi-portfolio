#!/usr/bin/env node

import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import * as shapefile from "shapefile";

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const inputDirectory = process.argv[2];
const outputPath = path.join(root, "public", "data", "nc_counties.json");

if (!inputDirectory) {
  throw new Error("Usage: node scripts/build_map_data.mjs <directory containing cb_2023_us_county_500k.shp/.dbf>");
}

const shpPath = path.join(inputDirectory, "cb_2023_us_county_500k.shp");
const dbfPath = path.join(inputDirectory, "cb_2023_us_county_500k.dbf");
const source = await shapefile.open(shpPath, dbfPath);
const features = [];

while (true) {
  const item = await source.read();
  if (item.done) break;
  const feature = item.value;
  if (String(feature.properties.STATEFP).padStart(2, "0") === "37") {
    features.push(feature);
  }
}

if (features.length !== 100) {
  throw new Error(`Expected 100 North Carolina counties, found ${features.length}`);
}

const polygons = (geometry) => {
  if (geometry.type === "Polygon") return [geometry.coordinates];
  if (geometry.type === "MultiPolygon") return geometry.coordinates;
  throw new Error(`Unsupported geometry type: ${geometry.type}`);
};

const points = [];
for (const feature of features) {
  for (const polygon of polygons(feature.geometry)) {
    for (const ring of polygon) points.push(...ring);
  }
}

const meanLatitude = points.reduce((total, [, latitude]) => total + latitude, 0) / points.length;
const longitudeScale = Math.cos((meanLatitude * Math.PI) / 180);
const projected = points.map(([longitude, latitude]) => [longitude * longitudeScale, latitude]);
const minX = Math.min(...projected.map(([x]) => x));
const maxX = Math.max(...projected.map(([x]) => x));
const minY = Math.min(...projected.map(([, y]) => y));
const maxY = Math.max(...projected.map(([, y]) => y));
const width = 1000;
const padding = 18;
const scale = (width - 2 * padding) / (maxX - minX);
const height = Math.round((maxY - minY) * scale + 2 * padding);

const project = ([longitude, latitude]) => [
  padding + (longitude * longitudeScale - minX) * scale,
  padding + (maxY - latitude) * scale,
];

const round = (value) => Number(value.toFixed(1));
const pathForGeometry = (geometry) => {
  const commands = [];
  for (const polygon of polygons(geometry)) {
    for (const ring of polygon) {
      ring.forEach((point, index) => {
        const [x, y] = project(point);
        commands.push(`${index === 0 ? "M" : "L"}${round(x)},${round(y)}`);
      });
      commands.push("Z");
    }
  }
  return commands.join("");
};

const centroidForGeometry = (geometry) => {
  let xTotal = 0;
  let yTotal = 0;
  let count = 0;
  for (const polygon of polygons(geometry)) {
    for (const ring of polygon) {
      for (const point of ring) {
        const [x, y] = project(point);
        xTotal += x;
        yTotal += y;
        count += 1;
      }
    }
  }
  return [round(xTotal / count), round(yTotal / count)];
};

const counties = features
  .map((feature) => {
    const properties = feature.properties;
    const fips = String(properties.GEOID ?? `${properties.STATEFP}${properties.COUNTYFP}`).padStart(5, "0");
    return {
      fips,
      name: String(properties.NAME),
      path: pathForGeometry(feature.geometry),
      centroid: centroidForGeometry(feature.geometry),
    };
  })
  .sort((a, b) => a.fips.localeCompare(b.fips));

if (new Set(counties.map((county) => county.fips)).size !== 100) {
  throw new Error("County FIPS identifiers are not unique");
}

await fs.mkdir(path.dirname(outputPath), { recursive: true });
await fs.writeFile(
  outputPath,
  JSON.stringify({
    metadata: {
      source: "U.S. Census Bureau 2023 1:500,000 county cartographic boundaries",
      stateFips: "37",
      countyCount: counties.length,
      viewBox: `0 0 ${width} ${height}`,
    },
    counties,
  }),
  "utf8",
);

console.log(JSON.stringify({ status: "PASS", counties: counties.length, viewBox: `0 0 ${width} ${height}`, outputPath }, null, 2));
