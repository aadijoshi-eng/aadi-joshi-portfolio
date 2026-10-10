export const researchSummary = {
  "version": "1.0.1-provisional",
  "date": "October 4, 2026",
  "descriptive": {
    "branchCount2013": 2554,
    "branchCount2022": 1998,
    "branchCountPercentChange": -21.8,
    "branchDensity2013": 2.606008,
    "branchDensity2022": 1.865408,
    "branchDensityPercentChange": -28.4,
    "candidateCountyYears": 1000,
    "usableStartupObservations": 995,
    "suppressedStartupCells": 5
  },
  "models": {
    "frozenHeadline": {
      "specId": "M2",
      "label": "County/year FE + controls",
      "effectLabel": "Full sample slope",
      "estimate": -1.822803,
      "stdError": 1.809045,
      "ciLow": -5.412341,
      "ciHigh": 1.766735,
      "pValue": 0.316101,
      "n": 995,
      "clusters": 100
    },
    "cleanPreperiod": {
      "specId": "A4",
      "label": "Clean-preperiod exposure and controls (t-2)",
      "effectLabel": "Audit-added diagnostic slope",
      "estimate": 2.027805,
      "stdError": 1.719083,
      "ciLow": -1.383228,
      "ciHigh": 5.438838,
      "pValue": 0.240992,
      "n": 895,
      "clusters": 100
    },
    "poisson": {
      "specId": "R10",
      "label": "Poisson count with exposure offset",
      "effectLabel": "Slope",
      "estimate": -0.040415,
      "stdError": 0.018422,
      "ciLow": -0.07652,
      "ciHigh": -0.004309,
      "pValue": 0.028244,
      "n": 995,
      "clusters": 100
    },
    "selectedModels": [
      {
        "specId": "M1",
        "label": "County and year FE",
        "effectLabel": "Full sample slope",
        "estimate": -1.418282,
        "stdError": 1.866256,
        "ciLow": -5.121338,
        "ciHigh": 2.284775,
        "pValue": 0.449084,
        "n": 995,
        "clusters": 100
      },
      {
        "specId": "M2",
        "label": "County/year FE + controls",
        "effectLabel": "Full sample slope",
        "estimate": -1.822803,
        "stdError": 1.809045,
        "ciLow": -5.412341,
        "ciHigh": 1.766735,
        "pValue": 0.316101,
        "n": 995,
        "clusters": 100
      },
      {
        "specId": "M3_metro",
        "label": "Metro/nonmetro slopes",
        "effectLabel": "Metro slope",
        "estimate": 1.575307,
        "stdError": 2.920592,
        "ciLow": -4.219782,
        "ciHigh": 7.370395,
        "pValue": 0.590836,
        "n": 995,
        "clusters": 100
      },
      {
        "specId": "M3_nonmetro",
        "label": "Metro/nonmetro slopes",
        "effectLabel": "Nonmetro slope",
        "estimate": -2.312194,
        "stdError": 1.817895,
        "ciLow": -5.919293,
        "ciHigh": 1.294904,
        "pValue": 0.206386,
        "n": 995,
        "clusters": 100
      },
      {
        "specId": "M4",
        "label": "Official BDS entry rate",
        "effectLabel": "Full sample slope",
        "estimate": -0.210295,
        "stdError": 0.221779,
        "ciLow": -0.650353,
        "ciHigh": 0.229764,
        "pValue": 0.345328,
        "n": 997,
        "clusters": 100
      },
      {
        "specId": "M5",
        "label": "Startup job creation intensity",
        "effectLabel": "Full sample slope",
        "estimate": -1.223316,
        "stdError": 1.387133,
        "ciLow": -3.975688,
        "ciHigh": 1.529056,
        "pValue": 0.379966,
        "n": 995,
        "clusters": 100
      },
      {
        "specId": "A4",
        "label": "Clean-preperiod exposure and controls (t-2)",
        "effectLabel": "Audit-added diagnostic slope",
        "estimate": 2.027805,
        "stdError": 1.719083,
        "ciLow": -1.383228,
        "ciHigh": 5.438838,
        "pValue": 0.240992,
        "n": 895,
        "clusters": 100
      }
    ],
    "timingConclusion": "The frozen and clean-preperiod estimates are both imprecise and have opposite signs; the data do not establish a precise, temporally stable sign."
  }
} as const;
