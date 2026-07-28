import React, { useState } from "react";
import { FlaskConical, BookOpen, ClipboardList, Video } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";

const TABS = [
  { id: "sim", label: "Simulation", icon: FlaskConical },
  { id: "docs", label: "Documentation", icon: BookOpen },
  { id: "record", label: "Record Book", icon: ClipboardList },
  { id: "media", label: "Media", icon: Video },
];

/**
 * Wraps a lab's simulation component with shared Documentation, Record
 * Book, and Media tabs. The simulation itself never needs to know these
 * tabs exist.
 *
 * Props:
 *  - docs:    raw markdown string (import with `?raw` from src/content/docs)
 *  - docsPdf: optional URL to a PDF served from /public/docs/ — if set,
 *             this takes priority and renders natively via <iframe>
 *             instead of the markdown in `docs`
 *  - record:  raw markdown string (import with `?raw` from src/content/records)
 *  - media:   array of video filenames served from /public/media/ (see
 *             src/content/media.js)
 *  - children: the lab's simulation component, e.g. <PXRDLab />
 */
export default function LabShell({ docs, docsPdf, record, media = [], children }) {
  const [tab, setTab] = useState("sim");

  return (
    <div className="min-h-screen bg-[var(--bg-canvas)]">
      <div className="max-w-6xl mx-auto px-4 md:px-6 pt-4">
        <div className="flex gap-1.5 bg-[var(--bg-surface)] border border-[var(--border)] rounded-xl p-1 w-fit">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                tab === id
                  ? "bg-[var(--accent)] text-[var(--text-on-accent)]"
                  : "text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]"
              }`}
            >
              <Icon size={14} />
              {label}
            </button>
          ))}
        </div>
      </div>

      {tab === "sim" && children}

      {tab === "docs" && (
        docsPdf ? (
          <PdfPanel src={docsPdf} />
        ) : (
          <MarkdownPanel content={docs} fallback="Documentation for this lab is coming soon." />
        )
      )}
      {tab === "record" && <MarkdownPanel content={record} fallback="A sample record book for this lab is coming soon." />}
      {tab === "media" && <MediaPanel files={media} />}
    </div>
  );
}

function PdfPanel({ src }) {
  return (
    <div className="max-w-5xl mx-auto p-6 md:p-10">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-[var(--text-tertiary)]">
          If this doesn't display inline, your browser may be set to download PDFs automatically.
        </span>
        <a
          href={src}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs font-medium text-[var(--accent)] hover:text-[var(--accent-soft)] whitespace-nowrap ml-4"
        >
          Open in new tab ↗
        </a>
      </div>
      <div className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-2xl overflow-hidden h-[85vh]">
        <iframe title="Lab documentation" src={src} className="w-full h-full" />
      </div>
    </div>
  );
}

function MarkdownPanel({ content, fallback }) {
  return (
    <div className="max-w-4xl mx-auto p-6 md:p-10">
      <article className="prose-lab bg-[var(--bg-surface)] border border-[var(--border)] rounded-2xl p-6 md:p-10">
        {content ? (
          <ReactMarkdown remarkPlugins={[remarkGfm, remarkMath]} rehypePlugins={[rehypeKatex]}>
            {content}
          </ReactMarkdown>
        ) : (
          <p className="text-[var(--text-tertiary)] text-sm">{fallback}</p>
        )}
      </article>
    </div>
  );
}

function MediaPanel({ files }) {
  if (!files || files.length === 0) {
    return (
      <div className="max-w-4xl mx-auto p-6 md:p-10">
        <div className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-2xl p-10 text-center text-sm text-[var(--text-tertiary)]">
          No videos added yet for this lab. Drop files into{" "}
          <code className="bg-[var(--bg-surface-2)] border border-[var(--border)] rounded px-1.5 py-0.5 text-[var(--accent-soft)]">
            public/media/
          </code>{" "}
          and list them in{" "}
          <code className="bg-[var(--bg-surface-2)] border border-[var(--border)] rounded px-1.5 py-0.5 text-[var(--accent-soft)]">
            src/content/media.js
          </code>
          .
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 md:p-10 space-y-6">
      {files.map((file, i) => (
        <div key={file} className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-2xl p-4">
          <div className="text-sm font-medium text-[var(--text-secondary)] mb-3">
            Video {i + 1} of {files.length}
          </div>
          <video controls className="w-full rounded-lg bg-black" src={`/media/${file}`}>
            Your browser doesn't support embedded video playback.
          </video>
        </div>
      ))}
    </div>
  );
}
