# ATR-FTIR Spectroscopy

*Graduate-level reference notes. This lab simulates an ATR-FTIR spectrum (400–4000 cm⁻¹) of a metal-oxide nanoparticle capped with an organic surfactant/polymer, and is meant to build systematic band-assignment and evidence-based reasoning, not to substitute for a normal-mode calculation.*

## 1. Introduction to Infrared Spectroscopy

Infrared spectroscopy is an analytical technique based on the interaction between matter and light. The electromagnetic spectrum encompasses all possible frequencies of radiation, with the infrared region being divided into three primary categories:

*   **Near-infrared (12820–4000 cm⁻¹):** Consists of overtones and combination bands resulting from mid-infrared vibrations.
*   **Mid-infrared (4000–400 cm⁻¹):** Provides the most critical structural information for a wide variety of organic molecules.
*   **Far-infrared (400–33 cm⁻¹):** Utilized for studying crystal lattice vibrations, molecular skeleton torsions, and molecules containing heavy atoms.

## 2. Physical Basis and Molecular Vibrations

A molecule containing N atoms has $3N-6$ normal vibrational modes, or $3N-5$ if the molecule is linear.

*   A vibrational mode is IR-active only if it produces a change in the dipole moment along the normal coordinate.
*   Symmetrical, non-polar bonds are typically IR-silent or exhibit very weak absorbance.
*   Polar or partially-polar bonds (such as O–H, C=O, and M–O) absorb IR radiation strongly.
*   The simplest IR-active modes of vibration include stretching (symmetrical and antisymmetrical) and bending (scissoring, rocking, wagging, and twisting).

In the harmonic approximation, a chemical bond can be treated as a simple harmonic oscillator. The fundamental vibrational frequency scales according to Hooke's Law:

$$ \overline{v} = \frac{1}{2\pi c} \sqrt{\frac{k}{\mu}} $$

*   The variable $k$ represents the force constant of the bond.
*   The variable $\mu$ represents the reduced mass of the atoms involved.
*   Vibrational frequency increases as the bond strength increases.
*   Vibrational frequency also increases as the reduced mass decreases.
*   This mathematical relationship provides the basis for the "group frequency" approach, where a given functional group absorbs in a largely transferable range across different molecules.

## 3. Absorption and The IR Spectrum

The amount of infrared radiation absorbed by a sample is most commonly evaluated by measuring transmittance.

*   Transmittance is the percentage of the incident IR radiation that successfully passes through the sample and reaches the detector.
*   Absorbance is mathematically related to transmittance by the equation $A = 2 - \log(\%T)$.
*   Absorbance is directly related to sample concentration via the Beer-Lambert law, $A = \epsilon lc$.
*   A typical IR spectrum plots the percent transmittance against the wavenumber, conventionally plotted in decreasing order from left to right.

## 4. FTIR Instrumentation

Modern Fourier Transform Infrared (FTIR) spectrometers consist of an IR source, a sample cell, a detector, an internal laser, and a crucial optical device known as an interferometer.

![Michelson Interferometer Schematic](/diagrams/ftir-interferometer-diagram.svg)

*Figure 1 — Schematic representation of a Michelson Interferometer used in modern FTIR spectrometers.*

*   The interferometer utilizes a beam splitter to divide the incident beam, sending one half to a fixed mirror and the other half to a rapidly moving mirror.
*   When these beams recombine, they interfere to produce an interferogram, which contains information regarding every emitted infrared frequency.
*   A mathematical algorithm called a Fourier transformation converts this raw interferogram into a standard IR spectrum.
*   **Felgett Advantage (Speed):** All IR frequencies are measured simultaneously, allowing data collection in seconds rather than minutes.
*   **Jacquinot Advantage (Sensitivity):** Photonic detectors utilized in FTIR systems are highly sensitive, resulting in excellent signal-to-noise ratios.
*   **Connes Advantage (Calibration):** An internal Helium-Neon laser continuously calibrates the exact position of the moving mirror, providing supreme wavelength accuracy.

## 5. Attenuated Total Reflectance (ATR) Geometry

Attenuated Total Reflectance (ATR) is a sampling technique that measures changes in a totally internally reflected IR beam when it is in contact with a sample. It is heavily favored over transmission methods due to a lack of necessary sample preparation.

![ATR Crystal Schematic](/diagrams/atr-crystal-diagram.svg)

*Figure 2 — The geometry of an Attenuated Total Reflectance (ATR) crystal, illustrating total internal reflection and the generation of the evanescent wave.*

*   The IR beam enters an optically dense crystal, reflecting internally and producing an evanescent wave that extends beyond the crystal surface.
*   This evanescent wave decays exponentially into the sample at the crystal interface.
*   The penetration depth of this wave typically ranges between 0.5 and 2 µm.
*   The penetration depth is highly wavenumber-dependent, meaning lower wavenumbers probe much deeper into the sample.
*   Because of this depth variance, raw ATR spectra are systematically intensity-distorted (showing stronger relative absorbance at low wavenumbers) and normally require an ATR correction algorithm before they can be compared to transmission-mode reference libraries.
*   Very thin surface layers, such as a capping-agent monolayer on a nanoparticle, can be under- or over-represented relative to the bulk core material depending on the probe depth at specific wavenumbers.

### Common ATR Crystal Materials

| Material | Wavelength Range (cm⁻¹) | Refractive Index | Application Notes |
| :--- | :--- | :--- | :--- |
| **Zinc Selenide (ZnSe)** | 20,000 – 500 | 2.43 | Suitable for liquids and non-abrasive pastes with a working pH range of 5–9. |
| **Germanium (Ge)** | 5,000 – 600 | 4.01 | Robust against weak acids and alkalis with a broader working pH range of 1–14. |
| **Diamond** | 45,000 – 10 | 2.40 | Exhibits greater durability and robustness for high-pressure single reflection analysis. |

## 6. Reading a Spectrum — Beyond Single-Band Lookup

*   **Position and Absence:** The position of a band identifies the specific vibration, but the absolute absence of an expected band is frequently just as diagnostic as its presence.
*   **Carboxylate Coordination Mode:** The wavenumber separation $\Delta\nu$ between asymmetric and symmetric carboxylate stretches directly distinguishes unidentate, bridging, and chelating bidentate coordination.
*   **Metal–Oxide Lattice Bands:** Bands located below ~700 cm⁻¹ are IR-active transverse-optical (TO) phonon modes of the extended lattice rather than single-bond vibrations.

## 7. Using This Virtual Lab

*   **Explore Mode:** Choose a metal oxide and a capping agent to visually observe realistic band overlap in the combined spectrum.
*   **Unknown Mode:** Assign specific bands on an unlabelled spectrum using the functional-group reference table, decide on the capping agent and oxide core, and then reveal the answer.
*   **Process of Elimination:** Build your analytical reasoning by evaluating both the presence and absence of structural bands together.

### Evidence-first unknown-sample algorithm

1. Measure at least three absorption minima, including one below 700 cm⁻¹ when a metal-oxide core assignment is required.
2. Classify bands as organic-group evidence, lattice evidence, or non-diagnostic overlap.
3. Form a capping-agent hypothesis from a **set** of bands and missing expected bands; no single broad O–H/N–H feature is decisive.
4. Form a core hypothesis from the M–O region, while noting that this band alone is broad and should be treated as supporting evidence.
5. Record both hypotheses before revealing the answer, then export the measured-band table for the record book.

The unknown mode deliberately hides both the organic capping agent and the oxide core. It is therefore an identification exercise, not merely a functional-group lookup.

## 8. Limitations of This Simulation

*(Note: State these limitations in any formal lab report)*

*   No ATR-depth corrections, Christiansen effects, or Fresnel/dispersion artifacts are actively modeled.
*   No baseline drift, atmospheric CO₂, or H₂O vapor interferences are included.
*   No overtone bands, combination bands, or Fermi resonance are modeled.
*   Band positions and peak depths are representative, literature-typical values chosen primarily for teaching rather than being computed via DFT normal-mode analysis.
