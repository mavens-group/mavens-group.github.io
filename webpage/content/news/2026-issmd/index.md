---
title: "Beyond Diamond: spin-qubit hosts at ISSMD-2026, IIT Ropar"
date: 2026-11-03
summary: "From an interpretable ML screen of 45,000 compounds for nuclear-spin-quiet qubit hosts to the ¹⁷O hyperfine bath of Ce³⁺ polarons in CeO₂, with a pulsed-EPR test we would like to see done."
tags: ["Talk"]
featured: true
image:
  caption: "Session 1, Quantum Materials and Devices, ISSMD-2026, IIT Ropar."
  focal_point: "Smart"
resources:
  - src: "gallery/1-rashomon-slide.webp"
    title: "Rashomon sets: models with the same score but different decision functions."
  - src: "gallery/2-podium.webp"
    title: "Rudra Banerjee speaking at ISSMD-2026."
  - src: "gallery/3-memento.webp"
    title: "Receiving the invited speaker memento."
---

Dr. Banerjee gave an invited talk, *Beyond Diamond: Finding and understanding nuclear-spin-quiet hosts for solid-state spin qubits*, at [ISSMD-2026](https://sites.google.com/iitrpr.ac.in/issmd2026/home), IIT Ropar, on 23–25 October 2026.

## Where to look

Work by [Md Mahshook A](/author/md-mahshook-a), [published in Physical Review Materials](/news/2026-prm/).

The screen uses composition alone, so each compound costs milliseconds. Models with near-identical scores can explain the data in opposite ways (the Rashomon effect). We therefore keep a candidate only when independent model families agree.

Of about 45,000 stable compounds, 122 pass. The screen recovers diamond, SiC and ZnO. It also recovers MgO, CaO, CaS, WO₃ and SiO₂, which independent DFT studies had proposed, without being trained on them. About 40% of the candidates appear in no earlier screen. They fall into four families:

- layered chalcogenides (HfS₂, ZrS₂, SnS₂)
- alkaline-earth tellurides (CaTe, SrTe, BaTe)
- high-ε oxides (TiO₂, BaO, PbWO₄)
- ternaries (SrZrO₃, CaZrO₃)

{{< figure src="slides/screening-funnel.webp" caption="The screening funnel, with known hosts as a sanity check." >}}

The screen is a pre-filter. It says where to look, not what the nuclear-spin bath looks like.

## What is there, in CeO₂

Work by Chithresh T M, in revision at Physical Review B.

Each oxygen vacancy in ceria leaves two localised Ce³⁺ polarons (4f¹, S = 1/2). Cerium has no magnetic isotope, so the only nuclear spins are ¹⁷O, at 0.038% abundance.

Each Ce³⁺ has seven oxygen neighbours, all at almost the same distance, but only one couples strongly. The occupied 4f orbital picks it, not distance. A point-dipole model predicts an isotropic coupling of exactly zero; DFT gives 2.02 MHz.

The result is a very quiet bath. At natural abundance, fewer than 1 centre in 2,000 has a strongly coupled ¹⁷O. For NV⁻ in diamond the figure is 1 in 30.

{{< figure src="slides/one-strong-o17.webp" caption="One strong ¹⁷O per polaron. Numbers are isotropic couplings in MHz." >}}

## For EPR groups

This is testable. In ¹⁷O-enriched, reduced CeO₂ at X band, the strongly coupled first-shell ¹⁷O should give deep ESEEM modulation. In HYSCORE, its strong-coupling cross-peaks should resolve from a weak ridge at the ¹⁷O Larmor frequency (about 2 MHz). If your group can run this measurement, please [get in touch](/contact/).

{{< figure src="slides/what-to-measure.webp" caption="The prediction, and what is still open." >}}

Next, we will compute T₂ directly on this bath and apply the same workflow to TiO₂.

{{< photo-grid dir="gallery" >}}

Thanks to the organisers at IIT Ropar for the invitation.
