# Aadi Joshi | Research & Analysis

A portfolio site for applied economics, equity valuation, corporate analysis, and North Carolina business reporting. The North Carolina Banking & Startup Opportunity Atlas is the flagship project.

## Run locally

Requirements: Node.js 22.13 or newer and npm.

```sh
npm ci
npm run dev
```

Open the local URL printed by Next.js (normally `http://localhost:3000`).

## Build and deploy

The site uses Next.js static export and includes a GitHub Actions workflow for GitHub Pages. Push to the `main` branch, enable **Settings → Pages → GitHub Actions** in the repository, and the workflow builds and deploys the `out/` directory. The workflow sets the correct base path for either a user site or a project site.

To build the static site locally:

```sh
npm run build:github-pages
```

## Portfolio sections

- **Research Atlas:** interactive North Carolina county atlas, findings, methodology, data, and limitations.
- **Valuation:** driver-based DCF case studies and reports for Copart, CAVA, and ADP.
- **Corporate Autopsies:** source-linked corporate case studies.
- **Carolina Business Brief:** reporting on investment, expansion, development, and acquisitions in North Carolina.

## Research and data

The reproducible research scripts are in `scripts/research/`; derived and source datasets are in `data/`; public downloads and visualizations are in `public/`. The site includes a source manifest and project pages that describe definitions, assumptions, and limitations. Review those materials before reusing the analysis or data.

## Useful commands

```sh
npm run typecheck
npm run lint
npm run data
```

`npm run data` rebuilds the atlas data from the local research inputs. Python dependencies for the research scripts are listed in `scripts/research/requirements.txt`.
