import React, { useState } from 'react';

import { ThemeProvider } from './theme/ThemeContext';
import ThemeSwitcher from './components/ThemeSwitcher';
import LabShell from './components/LabShell';
import MavensLogo from './components/MavensLogo';

// 1. Import your lab components here
import PXRDLab from './components/PXRD';
import FTIRLab from './components/FTIR';
import UVVisLab from './components/UVVIS'; // <-- CASE MUST MATCH the actual filename exactly
import QuantumEspressoLab from './components/QuantumEspresso';
import SchrodingerLab from './components/Schrodinger';

// 2. Import each lab's documentation + sample record book (?raw loads the
//    markdown file's text content at build time via Vite)
import pxrdDocs from './content/docs/pxrd.md?raw';
import pxrdRecord from './content/records/pxrd.md?raw';
import ftirDocs from './content/docs/ftir.md?raw';
import ftirRecord from './content/records/ftir.md?raw';
import uvvisDocs from './content/docs/uvvis.md?raw';
import uvvisRecord from './content/records/uvvis.md?raw';
import qeDocs from './content/docs/qe.md?raw';
import qeRecord from './content/records/qe.md?raw';
import schrodingerDocs from './content/docs/schrodinger.md?raw';
import schrodingerRecord from './content/records/schrodinger.md?raw';
import { MEDIA_MANIFEST } from './content/media';

// 3. Register all available apps in this array
const APPS = [
  {
    id: 'pxrd',
    name: 'Powder XRD Lab',
    description: 'Phase, Size, Strain & Lattice Parameter Analysis',
    component: PXRDLab,
    category: 'Crystallography',
    docs: pxrdDocs,
    // docsPdf: '/docs/pxrd.pdf', // uncomment to show a native PDF viewer instead
    record: pxrdRecord,
    media: MEDIA_MANIFEST.pxrd,
  },
  {
    id: 'ftir',
    name: 'ATR-FTIR Spectroscopy Lab',
    description: 'Vibrational Modes, Functional Groups & Unknown Identification',
    component: FTIRLab,
    category: 'Spectroscopy',
    docs: ftirDocs,
    record: ftirRecord,
    media: MEDIA_MANIFEST.ftir,
  },
  {
    id: 'uvvis',
    name: 'UV-Vis Spectroscopy',
    description: 'Absorbance & Band Gap Determination',
    component: UVVisLab,
    category: 'Spectroscopy',
    docs: uvvisDocs,
    record: uvvisRecord,
    media: MEDIA_MANIFEST.uvvis,
  },
  {
    id: 'qe',
    name: 'Quantum ESPRESSO Lab',
    description: 'DFT Frontier Orbitals & HOMO–LUMO Gap',
    component: QuantumEspressoLab,
    category: 'Computational Chemistry',
    docs: qeDocs,
    record: qeRecord,
    media: MEDIA_MANIFEST.qe,
  },
  {
    id: 'schrodinger',
    name: 'Schrödinger Equation Lab',
    description: 'Numerov Solutions for a Potential Well & 1D Harmonic Oscillator',
    component: SchrodingerLab,
    category: 'Quantum Mechanics',
    docs: schrodingerDocs,
    record: schrodingerRecord,
    media: MEDIA_MANIFEST.schrodinger,
  },
];

function AppShell() {
  const [activeAppId, setActiveAppId] = useState(null); // null shows the dashboard grid

  const activeApp = APPS.find((app) => app.id === activeAppId);
  const ActiveComponent = activeApp?.component;

  return (
    <div className="min-h-screen bg-[var(--bg-canvas)] text-[var(--text-primary)] font-sans">
      {/* Global Navigation Header */}
      <header className="bg-[var(--bg-surface)] border-b border-[var(--border)] px-4 sm:px-6 py-3 sm:py-4 sticky top-0 z-50 flex items-center justify-between gap-2 shadow-lg overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-2 sm:gap-3 cursor-pointer flex-shrink-0" onClick={() => setActiveAppId(null)}>
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-[var(--accent)]/10 border border-[var(--accent)]/30 flex items-center justify-center p-1.5 flex-shrink-0">
            <MavensLogo className="w-full h-full" />
          </div>
          <div>
            <h1 className="text-sm sm:text-base font-bold text-[var(--text-primary)] tracking-tight leading-none whitespace-nowrap">
              Virtual Lab Suite
            </h1>
            <p className="hidden sm:block text-xs text-[var(--text-quaternary)] mt-0.5">Interactive Scientific Benchtop</p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
          {/* Top bar quick switcher */}
          {activeAppId && (
            <>
              <button
                onClick={() => setActiveAppId(null)}
                className="text-xs font-medium px-2.5 sm:px-3 py-1.5 rounded-md bg-[var(--bg-surface-2)] hover:bg-[var(--border)] text-[var(--text-secondary)] transition-colors whitespace-nowrap flex-shrink-0"
              >
                <span className="sm:hidden">← Back</span>
                <span className="hidden sm:inline">← Back to Dashboard</span>
              </button>
              <div className="hidden sm:block h-4 w-px bg-[var(--border)] flex-shrink-0" />
              <select
                value={activeAppId}
                onChange={(e) => setActiveAppId(e.target.value)}
                className="bg-[var(--bg-surface-2)] border border-[var(--border)] text-[var(--text-secondary)] text-xs rounded-md px-2 py-1.5 outline-none focus:border-[var(--accent)] max-w-[100px] sm:max-w-none flex-shrink-0"
              >
                {APPS.map((app) => (
                  <option key={app.id} value={app.id}>
                    {app.name}
                  </option>
                ))}
              </select>
              <div className="hidden sm:block h-4 w-px bg-[var(--border)] flex-shrink-0" />
            </>
          )}

          {/* Central theme control — always available, affects dashboard + every lab */}
          <ThemeSwitcher />
        </div>
      </header>

      {/* Main Content Area */}
      <main>
        {activeAppId && ActiveComponent ? (
          /* Render Active Virtual Lab, wrapped with shared Docs/Record tabs */
          <LabShell docs={activeApp.docs} docsPdf={activeApp.docsPdf} record={activeApp.record} media={activeApp.media}>
            <ActiveComponent />
          </LabShell>
        ) : (
          /* Render Main Dashboard View */
          <div className="max-w-6xl mx-auto p-6 md:p-10">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-[var(--text-primary)]">Available Experiments</h2>
              <p className="text-sm text-[var(--text-tertiary)] mt-1">
                Select a virtual simulation lab below to begin experiment analysis.
              </p>
            </div>

            {/* App Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {APPS.map((app) => (
                <div
                  key={app.id}
                  onClick={() => setActiveAppId(app.id)}
                  className="group relative bg-[var(--bg-surface)] border border-[var(--border)] hover:border-[var(--accent)]/50 rounded-2xl p-6 cursor-pointer transition-all hover:-translate-y-1 hover:shadow-xl flex flex-col justify-between"
                >
                  <div>
                    <span className="inline-block text-[10px] font-mono font-medium tracking-wider text-[var(--accent)] uppercase bg-[var(--accent)]/10 border border-[var(--accent)]/20 px-2 py-0.5 rounded mb-3">
                      {app.category}
                    </span>
                    <h3 className="text-lg font-semibold text-[var(--text-primary)] group-hover:text-[var(--accent-soft)] transition-colors">
                      {app.name}
                    </h3>
                    <p className="text-xs text-[var(--text-tertiary)] mt-2 leading-relaxed">
                      {app.description}
                    </p>
                  </div>
                  <div className="mt-6 flex items-center justify-between text-xs font-medium text-[var(--accent)]">
                    <span>Launch Lab</span>
                    <span className="transform group-hover:translate-x-1 transition-transform">→</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppShell />
    </ThemeProvider>
  );
}
