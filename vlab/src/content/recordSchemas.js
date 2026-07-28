// Defines the shape of each lab's fillable Record Book — the metadata
// fields, the measurement table columns, and the free-text sections.
// Add a new entry here (and pass it to LabShell as `recordSchema`) when
// wiring up a new lab's worksheet.

export const RECORD_SCHEMAS = {
  pxrd: {
    title: "PXRD Record Book",
    meta: [
      { key: "sampleId", label: "Sample ID" },
      { key: "operator", label: "Operator" },
      { key: "date", label: "Date" },
      { key: "mode", label: "Mode (explore / unknown)" },
    ],
    tableLabel: "Peak measurements",
    tableColumns: [
      { key: "hkl", label: "hkl", placeholder: "1 0 1" },
      { key: "twoTheta", label: "2θ (°)", placeholder: "36.25" },
      { key: "fwhmMeas", label: "FWHM meas. (°)", placeholder: "0.640" },
      { key: "fwhmCorr", label: "FWHM corr. (°)", placeholder: "0.624" },
      { key: "d", label: "D (Scherrer, nm)", placeholder: "13.9" },
    ],
    sections: [
      { key: "objective", label: "1. Objective", placeholder: "What are you trying to determine from this sample?" },
      { key: "whAnalysis", label: "2. Williamson–Hall analysis", placeholder: "Intercept (D) and slope (ε) from your plot..." },
      { key: "phaseId", label: "3. Phase identification", placeholder: "Any secondary phase peaks observed?" },
      { key: "conclusion", label: "4. Conclusion", placeholder: "Summarize crystallite size, strain, and phase purity." },
      { key: "reflection", label: "5. Reflection", placeholder: "What was tricky? What would you do differently?" },
    ],
  },
  ftir: {
    title: "ATR-FTIR Record Book",
    meta: [
      { key: "sampleId", label: "Sample ID" },
      { key: "operator", label: "Operator" },
      { key: "date", label: "Date" },
      { key: "mode", label: "Mode (explore / unknown)" },
    ],
    tableLabel: "Observed bands",
    tableColumns: [
      { key: "band", label: "Band (cm⁻¹)", placeholder: "1050" },
      { key: "assignment", label: "Assignment", placeholder: "C–O (ring) stretch" },
      { key: "present", label: "Present?", placeholder: "Yes / No / Weak" },
    ],
    sections: [
      { key: "objective", label: "1. Objective", placeholder: "What are you trying to identify from this spectrum?" },
      { key: "reasoning", label: "2. Reasoning", placeholder: "Which bands are present/absent, and what does that rule in or out?" },
      { key: "conclusion", label: "3. Conclusion", placeholder: "Capping agent + metal oxide core identified." },
      { key: "reflection", label: "4. Reflection", placeholder: "What was tricky? What would you do differently?" },
    ],
  },
};
