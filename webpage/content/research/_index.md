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
At [MAVENs](../), we study how chemical disorder — substitution, vacancies and mixing, random or short-range ordered — shapes the electronic structure of a material, and whether that material then works as intended. In magnetism and in spin coherence the same question recurs: how does disorder limit the lifetime of an excitation? We have studied this through magnetic damping in substituted alloys ([*Physical Review B*, 2019](../publication/fe-co/)) and through the couplings that limit the coherence of spin centres in oxides ([arXiv:2607.12080, preprint](../publication/chithresh-2026/)).

A defect can carry a local magnetic moment and the material still end up a paramagnet rather than a ferromagnet. A dopant can shift the d-band in the right direction on average, yet the adsorption energy is set site by site. A spin centre with the right spin state can lose its single-centre character once neighbouring centres crowd together. Local electronic features are necessary for function, but they are rarely sufficient.

Whether a local feature survives into a macroscopic response often depends on the disorder around it: the topology of exchange pathways, the statistics of substitution, the geometry of a defect network. Disorder is not noise to be averaged away; it is frequently the variable that decides the outcome.


<div class="callout-question">Disorder is the central focus of our research: how substitution, vacancies and mixing set a material's electronic structure, and when that local picture is enough to predict its collective response.</div>


<!-- {{< video src="research.mp4" controls=false autoplay=true loop=true muted=true >}} -->

## When Local Descriptors Fail

We choose systems — substitutional magnetic alloys, defect-bearing oxides, two-dimensional catalysts — where one variable can be changed at a time: concentration at fixed geometry, geometry at fixed concentration, hole doping against electron doping on the same sublattice. The recurring question across these systems is the same:


<div class="callout-question">When does a local descriptor remain predictive, and when does the arrangement of disorder become decisive?</div>


Part of what we report is where local descriptors succeed, and part is where they fail. That boundary is often where the arrangement of disorder, not just its amount, starts to matter.

## How We Compute

We treat random substitutional disorder with the coherent potential approximation, which describes a disordered alloy as an effective medium without building supercells. Where the arrangement of individual defects matters, we use plane-wave density functional theory on explicit supercells. We compute the interatomic exchange interactions J<sub>ij</sub> from first principles, and obtain magnetic ordering temperatures from mean-field treatments of them. Where a compositional space is too large to compute directly, we use interpretable machine learning.

## Research Software

We also build tools where existing workflows become restrictive.

[**cview**](https://github.com/mavensgroup/cview) is an open-source crystallographic interface that connects structure visualisation with _ab-initio_ workflow generation across multiple formats ([paper](../publication/banerjee-2026/)).

## Experimental Constraints and Validation

Collective behaviour is ultimately constrained by synthesis, morphology and disorder, so we work closely with experimental collaborators to keep our computational predictions physically accessible.

Current collaborations include:

- [Dr Ashutosh Kumar Singh, CeNS](https://sites.google.com/view/ashutoshksingh-cens/team/dr-ashutosh-k-singh) — quantum materials
- [Dr Payel Bandyopadhyay, SRMIST](https://sites.google.com/srmist.edu.in/primelab/) — polymers and soft materials
- [Dr Pralay K. Santra, CeNS](https://www.santragroup.in/group/pralay-k-santra) — two-dimensional materials

## Research Pillars

Three disorder pillars, and machine learning as a method that serves all three.
