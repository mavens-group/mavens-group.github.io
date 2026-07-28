# ATR-FTIR Spectroscopy

*Graduate-level reference notes. This lab simulates an ATR-FTIR spectrum
(400–4000 cm⁻¹) of a metal-oxide nanoparticle capped with an organic
surfactant/polymer, and is meant to build systematic band-assignment and
evidence-based reasoning, not to substitute for a normal-mode
calculation.*

## 1. Physical basis

A molecule with *N* atoms has 3N−6 (3N−5 if linear) normal vibrational
modes. A mode is IR-active only if it produces a **change in dipole
moment** along the normal coordinate, ∂μ/∂Q ≠ 0 — this selection rule is
why symmetric, non-polar bonds (e.g. a symmetric C–C stretch in a
non-polar environment) are IR-silent or very weak, while polar/
partially-polar bonds (O–H, N–H, C=O, C–O–C, M–O) absorb strongly. In
the harmonic approximation, a bond's fundamental frequency scales as

```
ν̃ = (1/2πc) √(k/μ)
```

with *k* the force constant and μ the reduced mass — the basis for the
"group frequency" approach used throughout this lab: a given functional
group absorbs in a characteristic, largely *transferable* range across
different molecules, with the exact position perturbed by conjugation,
hydrogen bonding, ring strain, and electronic/inductive effects from
neighboring groups.

## 2. ATR geometry and its practical consequences

Attenuated total reflectance works via an evanescent wave that decays
exponentially into the sample from the crystal/sample interface. The
**penetration depth**,

```
d_p = λ / (2π n₁ √(sin²θ − (n₂/n₁)²))
```

(n₁ = crystal refractive index, n₂ = sample refractive index, θ = angle
of incidence) is **wavenumber-dependent** — lower wavenumber (longer λ)
probes deeper into the sample. Two practical consequences worth knowing,
neither of which this simplified simulation reproduces:

- Raw ATR spectra are systematically intensity-distorted relative to a
  transmission spectrum (stronger relative absorbance at low
  wavenumber) and are normally corrected with an **ATR correction**
  algorithm before comparison to transmission-mode reference libraries.
- Very thin surface layers (e.g. a capping-agent monolayer) can be
  under- or over-represented relative to bulk core material depending
  on the probe depth at the wavenumber of interest — relevant when
  judging capping-agent coverage from relative peak depths.

## 3. Reading a spectrum — beyond single-band lookup

- **Position** identifies the vibration; **absence** of an expected band
  is frequently as diagnostic as presence (e.g. no ether C–O–C rules out
  a simple polyether capping agent).
- **Carboxylate coordination mode** is a classic quantitative use of
  band position: the separation Δν = ν_asym(COO⁻) − ν_sym(COO⁻)
  distinguishes unidentate (Δν large, >200 cm⁻¹, close to free ionic
  carboxylate), bridging (Δν ≈ 140–190 cm⁻¹), and chelating bidentate
  (Δν small, <110 cm⁻¹) coordination of an oleate/carboxylate ligand to
  a metal-oxide surface — a direct, quantitative way to argue *how* a
  ligand is chemisorbed, not just *that* it is present.
- **Metal–oxide lattice bands** below ~700 cm⁻¹ are IR-active
  transverse-optical (TO) phonon modes of the extended lattice, not a
  single-bond vibration; they are typically broad in nanoparticles due
  to a finite size distribution and surface/subsurface bond disorder,
  and their exact position is somewhat oxide-morphology-dependent
  relative to bulk single-crystal values.

## 4. Using this lab

1. **Explore mode** — choose a metal oxide and capping agent, and
   observe realistic band overlap in the combined spectrum.
2. **Unknown mode** — assign bands on an unlabelled spectrum using the
   functional-group reference table, decide on capping agent and oxide
   core, then reveal the answer.
3. Build your reasoning as a **process of elimination** using both
   presence and absence of bands together, the way the built-in
   per-agent "clues" are constructed — this mirrors real spectral
   interpretation far more than matching a single strongest peak.

## 5. Limitations of this simulation (state these in any report)

- No ATR-depth correction, Fresnel/dispersion artifacts, or Christiansen
  effect are modeled.
- No baseline drift, atmospheric CO₂ (~2350 cm⁻¹) / H₂O vapor
  interference, or instrument apodization artifacts are included.
- No overtone/combination bands or Fermi resonance are modeled — real
  spectra, particularly in the 1900–2500 cm⁻¹ region, often show weak
  combination bands absent here.
- Band positions/depths are representative literature-typical values
  chosen for teaching, not fit to a specific measured reference
  spectrum or computed via DFT normal-mode analysis.

## Further reading

- G. Socrates, *Infrared and Raman Characteristic Group Frequencies*,
  3rd ed.
- P. R. Griffiths & J. A. de Haseth, *Fourier Transform Infrared
  Spectrometry*, 2nd ed.
- K. Nakamoto, *Infrared and Raman Spectra of Inorganic and
  Coordination Compounds*, Part B (metal–ligand and carboxylate
  coordination modes).
- M. Milosevic, *Internal Reflection and ATR Spectroscopy*.
- G. B. Deacon & R. J. Phillips, *Coord. Chem. Rev.* 33 (1980) 227–250
  (carboxylate coordination modes from IR Δν).
