---
# research/post/ml
title: Machine Learning Driven Materials Discovery
summary: How do we use machine learning to discover materials without surrendering the physical insight that makes a discovery transferable?
show_date: false
profile: false
weight: 4
image:
  placement: 1
  caption: "Machine learning animation"
  focal_point: "Center"
  preview_only: true
---
<video autoplay loop muted playsinline style="width: 100%; border-radius: 8px;">
  <source src="ml.mp4" type="video/mp4">
</video>

### Scientific Challenge
The compositional space of functional materials is too large for exhaustive *ab initio* screening and too structured for blind data-driven search. Machine learning offers an obvious route through it, but the easy route is not the useful one: a model that predicts a target property accurately while obscuring the physics behind the prediction tells us where to look next time but not why. The question that organises our work here is therefore methodological: **how do we use machine learning to discover materials without surrendering the physical insight that makes a discovery transferable?** A model whose features map to recognisable electronic-structure descriptors can be reasoned about, falsified, and extended to systems outside its training set. A model that achieves the same accuracy through opaque feature combinations can do none of these things. The distinction matters most precisely where the rest of our work lives — in disordered systems, where the quantity that governs behaviour is rarely a single local descriptor and a model that cannot be read cannot be trusted to have found the right one.

### Our Approach
We pair machine learning tightly with first-principles validation, building models on physically interpretable feature spaces — chemical, structural, and electronic descriptors whose individual contributions can be read against known materials physics — rather than on opaque embeddings tuned for accuracy alone. Predictions are validated by targeted DFT calculations, and the loop closes when the descriptors that emerge as predictive in the model are also the descriptors that emerge as causal in the validation.

This commitment imposes a real cost: we accept lower predictive accuracy where the trade is interpretability for opacity. The justification is that a marginal gain in F1 score on a held-out test set is worth less than a model whose governing descriptors can be read, criticised, and used to guide the next round of screening or synthesis. It also makes the method a natural partner to the group's disorder work: when a training set is built from disordered configurations, an interpretable model is what lets the resulting descriptor be checked against the underlying physics rather than taken on faith.

### Key Insights & Achievements
- **Interpretable models for defect-based qubits.** Machine-learning frameworks designed around physically meaningful descriptors identify candidate defect–host systems analogous to NV centres in diamond, achieving F1 scores above 0.98 and Matthews correlation coefficients above 0.90 on imbalanced datasets without sacrificing the descriptor-level interpretability that makes the predictions chemically meaningful.
- **Roadmaps for room-temperature qubit arrays.** Predicted defect–host combinations point to candidate platforms for qubit arrays with long coherence times at room temperature, providing a concrete target list for experimental validation rather than an abstract performance ceiling.
- **Cross-domain screening from a single methodological core.** The same interpretable-ML approach extends from quantum-information host materials to catalytic surfaces and compositionally complex alloys, identifying physically plausible candidates in each domain and demonstrating that the method generalises across functional contexts.

These results establish a mechanism-aware approach to ML-driven materials discovery, where predictive models reveal the descriptors that govern a target property rather than obscuring them — and where the same interpretability that makes a prediction trustworthy is what lets it feed back into the group's first-principles work on disordered magnets, defects, and catalysts.

{{% cta cta_link="../../" cta_text="← Go back to Research" %}}
