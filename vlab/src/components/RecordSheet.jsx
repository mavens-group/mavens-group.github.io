import React, { useEffect, useState } from "react";
import { Plus, Trash2, Download, RotateCcw, Check } from "lucide-react";

function emptyRow(columns) {
  return Object.fromEntries(columns.map((c) => [c.key, ""]));
}

function loadInitial(storageKey, schema) {
  try {
    const raw = localStorage.getItem(storageKey);
    if (raw) return JSON.parse(raw);
  } catch {
    /* ignore corrupt storage */
  }
  return {
    meta: Object.fromEntries(schema.meta.map((m) => [m.key, ""])),
    rows: [emptyRow(schema.tableColumns)],
    sections: Object.fromEntries(schema.sections.map((s) => [s.key, ""])),
  };
}

function toMarkdown(schema, state) {
  const lines = [`# ${schema.title}`, ""];
  schema.meta.forEach((m) => {
    lines.push(`**${m.label}:** ${state.meta[m.key] || "—"}`);
  });
  lines.push("", `## ${schema.tableLabel}`, "");
  const header = schema.tableColumns.map((c) => c.label);
  lines.push(`| ${header.join(" | ")} |`);
  lines.push(`|${header.map(() => "---").join("|")}|`);
  state.rows.forEach((row) => {
    lines.push(`| ${schema.tableColumns.map((c) => row[c.key] || "").join(" | ")} |`);
  });
  schema.sections.forEach((s) => {
    lines.push("", `## ${s.label}`, "", state.sections[s.key] || "_(not filled in)_");
  });
  return lines.join("\n");
}

/**
 * Fillable lab record worksheet. State autosaves to localStorage under
 * `storageKey` so a student's entries survive a page reload.
 */
export default function RecordSheet({ schema, storageKey }) {
  const [state, setState] = useState(() => loadInitial(storageKey, schema));
  const [savedFlash, setSavedFlash] = useState(false);

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(state));
    setSavedFlash(true);
    const t = setTimeout(() => setSavedFlash(false), 700);
    return () => clearTimeout(t);
  }, [state, storageKey]);

  const setMeta = (key, value) =>
    setState((s) => ({ ...s, meta: { ...s.meta, [key]: value } }));
  const setSection = (key, value) =>
    setState((s) => ({ ...s, sections: { ...s.sections, [key]: value } }));
  const setCell = (i, key, value) =>
    setState((s) => {
      const rows = [...s.rows];
      rows[i] = { ...rows[i], [key]: value };
      return { ...s, rows };
    });
  const addRow = () =>
    setState((s) => ({ ...s, rows: [...s.rows, emptyRow(schema.tableColumns)] }));
  const removeRow = (i) =>
    setState((s) => ({ ...s, rows: s.rows.filter((_, idx) => idx !== i) }));
  const reset = () => {
    if (!confirm("Clear this record book? This can't be undone.")) return;
    setState(loadInitial(null, schema));
  };
  const download = () => {
    const blob = new Blob([toMarkdown(schema, state)], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${(state.meta.sampleId || schema.title).replace(/\s+/g, "_")}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const inputCls =
    "w-full bg-[var(--bg-surface-2)] border border-[var(--border)] rounded-md px-2 py-1.5 text-sm text-[var(--text-primary)] outline-none focus:border-[var(--accent)] transition-colors placeholder:text-[var(--text-muted)]";

  return (
    <div className="space-y-4">
      {/* Header row: title + actions */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h2 className="text-lg font-semibold text-[var(--text-primary)]">{schema.title}</h2>
        <div className="flex items-center gap-2">
          <span
            className={`text-xs flex items-center gap-1 text-[var(--success)] transition-opacity ${
              savedFlash ? "opacity-100" : "opacity-0"
            }`}
          >
            <Check size={12} /> Saved
          </span>
          <button
            onClick={download}
            className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-md bg-[var(--accent)] text-[var(--text-on-accent)] hover:brightness-110 transition"
          >
            <Download size={13} /> Download .md
          </button>
          <button
            onClick={reset}
            className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-md bg-[var(--bg-surface-2)] border border-[var(--border)] text-[var(--text-tertiary)] hover:text-[var(--danger)] transition-colors"
          >
            <RotateCcw size={13} /> Reset
          </button>
        </div>
      </div>

      {/* Metadata */}
      <div className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-2xl p-4 grid grid-cols-2 md:grid-cols-4 gap-3">
        {schema.meta.map((m) => (
          <div key={m.key}>
            <label className="text-xs text-[var(--text-tertiary)] block mb-1">{m.label}</label>
            <input
              className={inputCls}
              value={state.meta[m.key]}
              onChange={(e) => setMeta(m.key, e.target.value)}
            />
          </div>
        ))}
      </div>

      {/* Measurement table */}
      <div className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-2xl p-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-[var(--text-secondary)]">{schema.tableLabel}</span>
          <button
            onClick={addRow}
            className="flex items-center gap-1 text-xs font-medium text-[var(--accent)] hover:text-[var(--accent-soft)] transition-colors"
          >
            <Plus size={13} /> Add row
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="text-[var(--text-quaternary)] border-b border-[var(--border)]">
                {schema.tableColumns.map((c) => (
                  <th key={c.key} className="text-left py-1.5 pr-3 font-medium">
                    {c.label}
                  </th>
                ))}
                <th className="w-8" />
              </tr>
            </thead>
            <tbody>
              {state.rows.map((row, i) => (
                <tr key={i} className="border-b border-[var(--border-soft)]">
                  {schema.tableColumns.map((c) => (
                    <td key={c.key} className="py-1.5 pr-3">
                      <input
                        className={inputCls}
                        placeholder={c.placeholder}
                        value={row[c.key]}
                        onChange={(e) => setCell(i, c.key, e.target.value)}
                      />
                    </td>
                  ))}
                  <td className="py-1.5 text-right">
                    <button
                      onClick={() => removeRow(i)}
                      className="text-[var(--text-muted)] hover:text-[var(--danger)]"
                    >
                      <Trash2 size={13} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Free-text sections */}
      {schema.sections.map((s) => (
        <div key={s.key} className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-2xl p-4">
          <label className="text-sm font-medium text-[var(--text-secondary)] block mb-2">{s.label}</label>
          <textarea
            rows={3}
            className={inputCls + " resize-y"}
            placeholder={s.placeholder}
            value={state.sections[s.key]}
            onChange={(e) => setSection(s.key, e.target.value)}
          />
        </div>
      ))}
    </div>
  );
}
