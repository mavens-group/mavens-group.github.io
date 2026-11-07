# Sample Record Book — ATR-FTIR

*This is a worked example of a completed record. Use it as a reference for
the level of detail and layout expected in your own submitted record.*

**Sample ID:** MO-cap-unknown-03
**Operator:** P. Sarvanan
**Technique (simulated):** ATR-FTIR, 400–4000 cm⁻¹
**Mode:** Unknown sample

## 1. Objective

Identify the capping agent and metal-oxide core of an unlabelled
nanoparticle sample from its simulated ATR-FTIR spectrum.

## 2. Observed bands

Positions were read with the cursor on the digitised minimum. Uncertainty: ±5 cm⁻¹ for
sharp bands, ±30 cm⁻¹ for the broad O–H/N–H band (baseline- and overlap-limited).
Noise level on the flat 1700–2700 cm⁻¹ region: about 0.5 % T peak-to-peak.

| Band (cm⁻¹) | Assignment | Present? |
|---|---|---|
| 3300–3500 (centre 3400 ± 30) | O–H / N–H stretch, broad | Yes — broad, overlapping |
| 2840–2980 | C–H stretch (alkyl) | Weak |
| 1630–1680 | C=O stretch (amide I) | No — nothing above the 0.5 % T noise |
| 1540–1580 (1580 ± 5) | Amide II (N–H bend) | Yes |
| 1000–1150 (1050 ± 5) | C–O (ring) stretch | Yes — dominant |
| 460 ± 5 | M–O lattice stretch | Yes |

## 3. Reasoning

- Broad overlapping O–H/N–H with **no distinct carbonyl (amide I)** band
  rules out PVP.
- A strong C–O ring band near 1050 cm⁻¹ **together with** an amide-II
  N–H bend near 1580 cm⁻¹ is characteristic of a polysaccharide backbone
  rather than a simple polyether (PEG) or surfactant (CTAB).
- The lattice band near 460 cm⁻¹ is consistent with a ZnO core rather
  than CeO₂ (~545 cm⁻¹), TiO₂ (~495 cm⁻¹), or Fe₃O₄ (~575 cm⁻¹).

## 4. Evidence classification and uncertainty

| Observation | Class | Why |
|---|---|---|
| No amide I band at 1630–1680 cm⁻¹ | **Diagnostic** | Every amide-containing capping agent (PVP) shows one; its absence is above the noise level, and the ATR depth at 1650 cm⁻¹ (≈ 1.2 µm) is sufficient to detect it |
| Strong C–O ring band at 1050 cm⁻¹ together with amide II at 1580 cm⁻¹ | **Diagnostic** (as a pair) | Together they point to a polysaccharide with amino groups; neither alone is conclusive |
| Broad O–H/N–H at 3400 cm⁻¹ | Non-diagnostic | Present for PVP (adsorbed water), PEG, chitosan |
| Weak C–H at 2900 cm⁻¹ | Supporting | Compatible with chitosan, but also with every other organic cap |
| Band at 460 ± 5 cm⁻¹ | Supporting | Broad M–O lattice band; separates ZnO from TiO₂ (≈ 495) only if its position is trusted to better than ≈ 20 cm⁻¹ |

**Intensity caveat.** ATR depth at 460 cm⁻¹ (≈ 4 µm) is about six times that at 3000 cm⁻¹ (≈ 0.7 µm). The M–O band is therefore exaggerated relative to the O–H and C–H bands, and the relative intensities were not used in the assignment.

**Strongest alternative ruled out.** PVP + ZnO: would require a carbonyl band near 1650 cm⁻¹, which was not observed. Confidence in the capping-agent assignment: high (a diagnostic absence plus a diagnostic pair). Confidence in the oxide assignment: moderate (single broad band).

## 5. Conclusion

The unknown sample is assessed as **chitosan-capped ZnO** nanoparticles.

## 6. Reflection

The absence of a clear carbonyl band was the deciding clue here — it's
easy to over-focus on which bands are present and forget that a missing
band can be just as diagnostic.

## 7. Submission quality check

- Attach the exported measured-band CSV.
- Include at least two organic-region observations and one lattice-region observation.
- State both the capping-agent and oxide-core hypotheses before disclosure.
- Separate direct evidence from supporting evidence and identify a plausible alternative that was ruled out.
- State the position uncertainty of each band class and the noise level used to call a band "absent".
- Classify each observation as diagnostic, supporting or non-diagnostic, and give a confidence for each of the two assignments.
