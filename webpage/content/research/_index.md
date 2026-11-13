---
title: Research
type: research
view: card
sections:
  - block: collection
    id: posts
    content:
      count: 5
      filters:
        folders:
          - post
      offset: 0
      sort_by: 'Weight'
      sort_ascending: true
    design:
      view: card
---
At [MAVENs](../), we study how local electronic structure evolves into collective material behaviour — and how chemical disorder decides whether that transition delivers a material that functions. The through-line of our current work is how disorder — random or short-range ordered — limits the lifetimes of collective and single-spin excitations, from magnetic excitations in alloys to spin centres in oxides.

A magnetic moment may produce a paramagnet rather than a ferromagnet. A chemically ideal adsorption site may sit in a matrix that suppresses catalytic turnover. A defect with the correct spin state may still lose its coherence if the disorder around it is arranged the wrong way. Local electronic features are necessary for functionality, but they are rarely sufficient for it.

What decides whether a local feature survives into a macroscopic response is usually the disorder around it: the topology of exchange pathways, the statistics of substitution, the geometry of a defect network. Disorder is not noise to be averaged away; it is frequently the variable that decides the outcome.


<div class="callout-question">This intermediate scale — the physical bridge between local structure and collective response — is the central focus of our research.</div>


<!-- {{< video src="research.mp4" controls=false autoplay=true loop=true muted=true >}} -->

## What We Have Shown

One result from each:

- **[Disorder and magnetism](post/magnetism/).** In vacancy-doped monolayer TiS₂, every defect carries a local moment, yet half-metallic ferromagnetism appears only once the defect network percolates ([*Physical Review B*, 2026](../publication/dutta-2026/)).
- **[Disorder and coherence](post/coherence/).** In oxygen-deficient CeO₂, we have computed the hyperfine tensors and exchange couplings that a first-principles coherence-time calculation requires ([arXiv:2607.12080, preprint](../publication/chithresh-2026/)).
- **[Disorder and catalysis](post/catalysis/).** In bimetallic Janus MXenes, site-resolved d-band asymmetry, not an averaged descriptor, controls hydrogen adsorption near thermoneutrality ([*RSC Advances*, 2026](../publication/dutta-2026-a/)).
- **[Machine learning](post/ml/), across all three.** Consensus design rules from interpretable classifiers recover every experimentally verified quantum-defect host ([*Physical Review Materials*, 2026](../publication/mahshook-2026/)).

## Isolating the Intermediate Scale

We choose systems — substitutional magnetic alloys, defect-bearing oxides, disordered catalytic surfaces — where the intermediate scale takes a specific, computationally tractable form, and where one variable at a time can be cleanly isolated. The recurring question across these systems is the same:


<div class="callout-question">When does a local descriptor remain predictive, and when does an intermediate scale become decisive?</div>


Part of what we report is where local descriptors succeed — and where they fail. That boundary is often where the intermediate scale becomes physically important.

## Research Software and Computational Infrastructure

We also develop computational tools where existing workflows become restrictive.

[**cview**](https://github.com/mavensgroup/cview) is an open-source crystallographic interface designed to bridge structure visualisation and _ab-initio_ workflow generation across multiple formats.

A kinetic Monte Carlo engine for defect evolution and ordering dynamics is currently under active development.

## Experimental Constraints and Validation

Because collective behaviour is ultimately constrained by synthesis, morphology, and disorder, we work closely with experimental collaborators to ensure that computational predictions remain physically accessible.

Current collaborations include:

- [Dr Ashutosh Kumar Singh, CeNS](https://sites.google.com/view/ashutoshksingh-cens/team/dr-ashutosh-k-singh) — quantum materials
- [Dr Payel Bandyopadhyay, SRMIST](https://sites.google.com/srmist.edu.in/primelab/) — polymers and soft materials
- [Dr Pralay K. Santra, CeNS](https://www.santragroup.in/group/pralay-k-santra) — two-dimensional materials

## Research Pillars

Three disorder pillars, and machine learning as a method that serves all three.
