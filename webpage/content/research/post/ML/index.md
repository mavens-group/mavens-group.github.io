---
# research/post/ml
title: Machine Learning Across the Pillars
summary: "A cross-cutting method serving the three disorder pillars: how do we use machine learning to discover materials without surrendering the physical insight that makes a discovery transferable?"
show_date: false
profile: false
weight: 4
image:
  placement: 1
  caption: "Machine learning animation"
  focal_point: "Center"
  preview_only: true
---
{{< inline-svg "figure.svg" >}}

### Scientific Challenge
In this group machine learning is not a research pillar of its own but a method in the service of the three disorder pillars — magnetism, coherence and catalysis. The compositional space of functional materials is too large for exhaustive *ab initio* screening and too structured for blind data-driven search. Machine learning offers an obvious route through it, but the easy route is not the useful one: a model that predicts a target property accurately while obscuring the physics behind the prediction tells us where to look next time but not why. The question that organises our work here is therefore methodological: **how do we use machine learning to discover materials without surrendering the physical insight that makes a discovery transferable?** A model whose features map to recognisable electronic-structure descriptors can be reasoned about, falsified, and extended to systems outside its training set. A model that achieves the same accuracy through opaque feature combinations can do none of these things. The distinction matters most precisely where the rest of our work lives — in disordered systems, where the quantity that governs behaviour is rarely a single local descriptor and a model that cannot be read cannot be trusted to have found the right one.

### Our Approach
We pair machine learning tightly with first-principles validation, building models on physically interpretable feature spaces — chemical, structural, and electronic descriptors whose individual contributions can be read against known materials physics — rather than on opaque embeddings tuned for accuracy alone. Predictions are validated by targeted DFT calculations, and the loop closes when the descriptors that emerge as predictive in the model are also the descriptors that emerge as causal in the validation.

This is a deliberate trade, and it costs accuracy: where the choice is interpretability against opacity, we take interpretability. A marginal gain in F1 score on a held-out test set is worth less to us than a model whose governing descriptors can be read, criticised, and used to guide the next round of screening or synthesis. The same choice makes the method a natural partner to the group's disorder work: when a training set is built from disordered configurations, an interpretable model is what lets the resulting descriptor be checked against the underlying physics rather than taken on faith.

### Findings
We can already build models that hold high accuracy without surrendering the descriptors that explain it — the combination the methodological commitment demands:

- **Interpretable models for defect-based qubits.** Machine-learning frameworks designed around physically meaningful descriptors identify candidate defect–host systems analogous to NV centres in diamond, achieving F1 scores above 0.98 and Matthews correlation coefficients above 0.90 on imbalanced datasets without sacrificing the descriptor-level interpretability that makes the predictions chemically meaningful.
- **Candidates for experimental testing.** The models identify candidate defect–host combinations for experimental testing, providing a concrete target list rather than an abstract performance ceiling.
- **Design rules that recover the known hosts.** Contrasting the feature attributions of several different classifiers yields consensus, composition-level design rules that no single model identifies alone; screening tens of thousands of stable compounds with them recovers the experimentally established hosts and points to unexplored ones, with first-principles calculations on a representative subset as the check.

These results establish a mechanism-aware approach to ML-driven materials discovery, where predictive models reveal the descriptors that govern a target property rather than obscuring them — and where the same interpretability that makes a prediction trustworthy is what lets it feed back into the group's first-principles work on disordered magnets, defects, and catalysts.

### Outlook
The direction is to turn interpretation into prediction across the group's disordered systems. The quantities that govern behaviour in the three pillars — the exchange topology that fixes a transition temperature, the site statistics that set catalytic activity, the couplings that limit coherence — are exactly what a first-principles calculation returns at high cost, for a handful of compositions at a time. An interpretable model trained on those calculations is a way to carry them across composition space without losing the thread back to the physics: not a surrogate that returns a number and hides its reasoning, but one whose predictive descriptors stay the causal ones. The results above show the models can be built to that standard on real classification problems; the open problem is to train them on disordered configurations and have them point, ahead of any new calculation, to where in composition space the disorder is arranged to do what we want.

### Selected publications

{{< cite page="/publication/mahshook-2026" view="4" >}}

{{% cta cta_link="../../" cta_text="← Go back to Research" %}}
