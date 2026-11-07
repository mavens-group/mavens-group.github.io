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
*   **Fellgett Advantage (Multiplex):** All IR frequencies are measured simultaneously, so for the same total time the signal-to-noise ratio is higher than for a scanning (dispersive) instrument by a factor of order $\sqrt{M}$, where $M$ is the number of resolution elements.
*   **Jacquinot Advantage (Throughput):** The interferometer has no entrance slit, so far more radiation reaches the detector at a given resolution than in a slit-limited dispersive instrument.
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

## 8. Band positions from first principles

### 8.1 Worked examples with Hooke's law

With $\overline{\nu}=\dfrac{1}{2\pi c}\sqrt{k/\mu}$, $\mu=\dfrac{m_1m_2}{m_1+m_2}$, and $k$ in N m⁻¹:

| Bond | $\mu$ (amu) | Typical $k$ (N m⁻¹) | $\overline{\nu}$ (cm⁻¹) |
|---|---:|---:|---:|
| O–H (free) | 0.95 | 745 | 3650 |
| C=O (ketone) | 6.86 | 1190 | 1715 |
| C=O (amide I) | 6.86 | 1100 | 1650 |

The same force constant for an O–D bond (where $\mu$ rises from 0.95 to 1.79 amu) predicts

$$
\frac{\overline{\nu}_{\mathrm{OD}}}{\overline{\nu}_{\mathrm{OH}}}=\sqrt{\frac{\mu_{\mathrm{OH}}}{\mu_{\mathrm{OD}}}}\approx0.73,
\qquad
3650\to\approx2660\ \mathrm{cm^{-1}},
$$

which is the isotope shift observed on deuteration and is a standard way to confirm an O–H or N–H assignment. The relation also explains why the metal–oxide bands lie so low: the heavy atoms give a large $\mu$, and the lattice force constants are comparable to or smaller than those of molecular bonds.

### 8.2 Why the model is only a guide

Real bonds are anharmonic, so overtones occur slightly below integer multiples of the fundamental, and strongly coupled bonds (for example the C–O and C–C stretches of a ring) share vibrational energy and do not behave as isolated oscillators. Hydrogen bonding lowers the O–H or N–H stretching frequency and broadens the band by tens to hundreds of cm⁻¹, because it weakens the O–H bond and distributes the molecules over many bonding environments. The Hooke estimate therefore predicts *where to look*, but the group-frequency table is what is used to *assign*.

### 8.3 Carboxylate coordination

For a carboxylate bound to a metal, the separation $\Delta\nu=\nu_{\mathrm{as}}(\mathrm{COO^-})-\nu_{\mathrm{s}}(\mathrm{COO^-})$ is compared with that of the free (ionic) salt, $\Delta\nu_{\mathrm{ionic}}$ (Deacon–Phillips):

- $\Delta\nu>\Delta\nu_{\mathrm{ionic}}$: unidentate;
- $\Delta\nu\ll\Delta\nu_{\mathrm{ionic}}$: chelating bidentate;
- $\Delta\nu\approx\Delta\nu_{\mathrm{ionic}}$: bridging.

The classification is an empirical rule with exceptions, and it requires the reference value for the *same* carboxylate.

## 9. Quantitative aspects of ATR

### 9.1 Penetration depth

For light incident at angle $\theta$ on an interface from a crystal of index $n_1$ into a sample of index $n_2$, the evanescent field decays with the depth

$$
d_p=\frac{\lambda}{2\pi n_1\sqrt{\sin^2\theta-(n_2/n_1)^2}},
$$

which is the depth at which the field amplitude has fallen to $1/e$. Total internal reflection requires $\theta>\theta_c=\arcsin(n_2/n_1)$.

For a sample with $n_2=1.5$ and a $45^\circ$ angle of incidence:

| $\overline{\nu}$ (cm⁻¹) | $d_p$, diamond ($n_1=2.40$) | $d_p$, Ge ($n_1=4.01$) |
|---:|---:|---:|
| 3000 | 0.67 µm | 0.22 µm |
| 1650 | 1.22 µm | 0.40 µm |
| 1000 | 2.01 µm | 0.66 µm |
| 500 | 4.01 µm | 1.32 µm |

The critical angles are $38.7^\circ$ for diamond and $22.0^\circ$ for Ge, so both support total reflection at $45^\circ$. The germanium crystal gives a probe depth about three times smaller, which suits strongly absorbing or highly scattering samples and surface studies.

### 9.2 Consequences for band intensities

Because $d_p\propto\lambda=1/\overline{\nu}$, the effective path length, and with it the absorbance, is **three times larger at 1000 cm⁻¹ than at 3000 cm⁻¹** for the same material. For this lab that has two consequences:

1. Bands in the M–O lattice region (below 700 cm⁻¹) are exaggerated relative to the organic C–H and O–H stretches. A weak-looking O–H band compared with a strong M–O band therefore says little about the relative amounts.
2. A capping layer a few nanometres thick is much thinner than $d_p$ at every wavenumber, so the beam samples the whole shell *and* part of the core. The relative intensity of shell and core bands depends on the shell thickness, the packing of the particles on the crystal, and $d_p$, not only on composition.

An ATR correction multiplies the intensity at each wavenumber by roughly $\overline{\nu}/\overline{\nu}_{\mathrm{ref}}$ to compare with a transmission spectrum. It does not recover the physics of a core–shell geometry.

### 9.3 Beer–Lambert in ATR

In transmission, $A=\varepsilon\,l\,c$ with a known path length $l$. In ATR the effective path length $l_{\mathrm{eff}}$ depends on $d_p$, on the number of reflections $N$, on the polarisation and on how well the sample contacts the crystal. Absolute concentrations therefore need a calibration with standards measured on the same accessory with the same contact pressure. **Ratios** of two bands in the same spectrum are more transferable than absolute absorbances, provided the correction for $d_p$ is applied.

## 10. Resolution, sampling and signal-to-noise

- **Resolution.** The spectral resolution is approximately $\Delta\overline{\nu}\approx1/\delta_{\max}$, where $\delta_{\max}$ is the maximum optical path difference. A resolution of 4 cm⁻¹ needs $\delta_{\max}\approx0.25$ cm. Condensed-phase bands are typically 10–100 cm⁻¹ wide, so 4 cm⁻¹ is more than sufficient and finer resolution mainly adds noise.
- **Sampling.** The internal He–Ne laser ($632.8$ nm) triggers sampling of the interferogram. Sampling once per laser fringe gives a Nyquist limit of $1/(2\times632.8\ \mathrm{nm})\approx7900$ cm⁻¹, comfortably above the mid-infrared range.
- **Apodisation.** The finite interferogram is multiplied by a weighting function (for example Happ–Genzel or Norton–Beer) to suppress the sidelobes of the instrument line shape, at the cost of a slightly broader line.
- **Signal-to-noise.** Averaging $N_s$ scans improves the signal-to-noise ratio as $\sqrt{N_s}$. Doubling the S/N costs four times the scans.
- **Background.** The spectrum is a ratio of the sample single-beam to the background single-beam, so it is only as good as the stability of the instrument between the two measurements. Atmospheric CO₂ (≈ 2350 cm⁻¹) and water vapour (rotational lines near 3900–3500 and 1900–1300 cm⁻¹) are the commonest artefacts.

## 11. Uncertainty and error analysis

A band assignment is a *qualitative* conclusion, but every number that feeds it has an uncertainty, and the conclusion should say how robust it is.

| Quantity | Typical uncertainty | Comment |
|---|---|---|
| Position of a sharp, isolated band | ≈ the instrument resolution or better (a few cm⁻¹) | the centroid can be located to better than the resolution if the signal-to-noise ratio is high |
| Position of a broad, overlapping band (O–H, N–H, C–O) | ±20 to ±50 cm⁻¹ | depends on baseline choice and on neighbouring bands, not on the instrument |
| $\Delta\nu$ between two bands | $\sqrt{u_1^2+u_2^2}$, for example $\sqrt{2}\times5\approx7$ cm⁻¹ | compare with the margin between coordination classes before classifying |
| Relative intensities across the spectrum | up to a factor of $\approx3$ between 3000 and 1000 cm⁻¹ | from $d_p\propto\lambda$; correct before comparing bands |
| Presence or absence of a weak band | set by the noise level | state the noise level; "absent" means "below the detection limit" |

Practical rules for the record:

1. State how band positions were read (cursor on a digitised minimum, peak-picking, or visual estimate) and give an uncertainty for each class of band.
2. Classify each piece of evidence as **diagnostic** (it discriminates between hypotheses), **supporting** (it is compatible with one but not exclusive) or **non-diagnostic** (it appears for every candidate). A broad O–H/N–H band is non-diagnostic for most capping agents.
3. For every conclusion, name the strongest alternative and the specific observation that rules it out. If none exists, the conclusion is a hypothesis.
4. Report a missing band only after confirming that the noise and the ATR depth at that wavenumber would have allowed you to see it.

## 12. Check your understanding

1. Use Hooke's law to explain why the C–H stretch (≈ 2950 cm⁻¹) lies well above the C–C stretch (≈ 1000 cm⁻¹) of the same molecule, and predict qualitatively where C–D appears.
2. Why are the M–O lattice bands of a metal oxide at lower wavenumber than the C=O stretch of a capping agent?
3. A symmetric diatomic such as N₂ shows no IR absorption. State the selection rule that explains this and name a vibration of CO₂ that is IR-active and one that is not.
4. For a diamond ATR crystal at $45^\circ$ and a sample with $n_2=1.5$, calculate $d_p$ at 1650 and 500 cm⁻¹. What does the ratio mean for the relative heights of an amide I band and an M–O band?
5. Why is the absence of a carbonyl band at 1650 cm⁻¹ a stronger argument against PVP than the presence of an O–H band is for chitosan?
6. You double the number of scans. By what factor does the signal-to-noise ratio improve, and what does that imply about reducing the noise on a very weak band by 10×?
7. A carboxylate pair appears at 1560 and 1415 cm⁻¹. Compute $\Delta\nu$ and its uncertainty if each position is known to ±6 cm⁻¹. Can you distinguish between bridging and unidentate coordination if the ionic reference is 145 cm⁻¹?
8. Two spectra of the same sample, taken at low and high contact pressure, give different band ratios. List two reasons.
9. Why is an ATR spectrum not directly comparable to a library transmission spectrum, and what correction is applied?

## 13. Limitations of This Simulation

*(Note: State these limitations in any formal lab report)*

*   No ATR-depth corrections, Christiansen effects, or Fresnel/dispersion artifacts are actively modeled.
*   No baseline drift, atmospheric CO₂, or H₂O vapor interferences are included.
*   No overtone bands, combination bands, or Fermi resonance are modeled.
*   Band positions and peak depths are representative, literature-typical values chosen primarily for teaching rather than being computed via DFT normal-mode analysis.
