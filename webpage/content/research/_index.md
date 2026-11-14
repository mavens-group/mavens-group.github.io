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
A perfect crystal is easy to compute. Bloch's theorem turns 10²³ atoms into one unit cell and a set of sharp states.

No real material is a perfect crystal. At [MAVENs](../), we start from the material as it is: its symmetry broken by substitution, vacancies, or design.

## Broken Symmetry Creates Function

- Pristine TiS₂ is non-magnetic. A vacancy makes a local moment ([*PRB*, 2026](../publication/dutta-2026/)).
- Pristine CeO₂ has no unpaired spins. An oxygen vacancy makes a Ce³⁺ spin centre ([preprint](../publication/chithresh-2026/)).
- Two different metals make the faces of a Janus MXene distinct, and one pair binds hydrogen near thermoneutrality ([*RSC Adv.*, 2026](../publication/dutta-2026-a/)).

## Broken Symmetry Limits Function

- TiS₂ is a half-metallic ferromagnet only between 11% and 15% vacancies.
- Mn in FeRh lowers the Curie temperature by about 450 K; Co keeps it ([*JMMM*, 2026](../publication/greeshma-2026/)).
- Re in FeCo raises magnetic damping almost fourfold ([*PRB*, 2019](../publication/fe-co/)).

<div class="callout-question">When does one site tell you what a material will do, and when does the broken symmetry around it decide?</div>

## How We Compute

We compute random alloys directly with the coherent potential approximation, and individual defects with density functional theory. From the electronic structure we obtain the magnetic exchange interactions, and from those the temperature up to which magnetic order survives. When there are too many compositions to compute, interpretable machine learning narrows the search.

## Tools and Collaborators

We build [**cview**](https://github.com/mavensgroup/cview), an open-source crystallographic interface ([paper](../publication/banerjee-2026/)), and test our predictions with experimental groups:

- [Dr Ashutosh Kumar Singh, CeNS](https://sites.google.com/view/ashutoshksingh-cens/team/dr-ashutosh-k-singh) — quantum materials
- [Dr Payel Bandyopadhyay, SRMIST](https://sites.google.com/srmist.edu.in/primelab/) — polymers and soft materials
- [Dr Pralay K. Santra, CeNS](https://www.santragroup.in/group/pralay-k-santra) — two-dimensional materials

## Research Pillars

Each pillar takes one consequence of broken symmetry in depth; machine learning serves all three.
