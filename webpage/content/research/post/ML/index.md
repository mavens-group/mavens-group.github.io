---
title: Machine Learning driven Materials Discovery
summary: How do we use machine learning to discover materials without surrendering the physical insight that makes a discovery transferable?
show_date: false
profile: false
weight: 3
image:
  placement: 1
  caption: "Quantum materials animation"
  focal_point: "Center"
  preview_only: true
---
<video autoplay loop muted playsinline style="width: 100%; border-radius: 8px;">
  <source src="ml.mp4" type="video/mp4">
</video>

### Scientific Challenge
The compositional space of functional materials is too large for exhaustive ab initio screening and too structured for blind data-driven search. Machine learning offers an obvious route through it, but the easy route is not the useful one: a model that predicts a target property accurately while obscuring the physics behind the prediction tells us where to look next time but not why. The question that organises our work here is therefore methodological: **how do we use machine learning to discover materials without surrendering the physical insight that makes a discovery transferable?** A model whose features map to recognisable electronic-structure descriptors can be reasoned about, falsified, and extended to systems outside its training set. A model that achieves the same accuracy through opaque feature combinations can do none of these things. The distinction matters because the goal of the work is not to predict — it is to understand well enough that the next prediction is more than a guess.

### Our Approach
We treat machine learning as a hypothesis generator paired tightly with first-principles validation, not as a replacement for it. Models are built on feature spaces designed to be physically interpretable — chemical, structural, and electronic descriptors whose individual contributions can be read against known materials physics — rather than on opaque embeddings tuned for accuracy alone. Predictions are then validated by targeted DFT calculations, and the loop closes when the descriptors that emerge as predictive in the model are also the descriptors that emerge as causal in the validation.

This commitment imposes a real cost: we accept lower predictive accuracy where the trade is interpretability for opacity. The justification is that a marginal gain in F1 score on a held-out test set is worth less than a model whose governing descriptors can be read, criticised, and used to guide the next round of high-throughput screening or experimental synthesis. The method follows the question, and the question here is about understanding, not ranking.

### Key Insights & Achievements
- **Interpretable models for defect-based qubits.** Machine-learning frameworks designed around physically meaningful descriptors identify candidate defect-host systems analogous to NV centres in diamond, achieving F1 scores above 0.98 and Matthews correlation coefficients above 0.90 on imbalanced datasets without sacrificing the descriptor-level interpretability that makes the predictions chemically meaningful.
- **Roadmaps for room-temperature qubit arrays.** Predicted defect–host combinations point to candidate platforms for qubit arrays with long coherence times at room temperature, providing a concrete target list for experimental validation rather than an abstract performance ceiling.
- **Cross-domain screening from a single methodological core.** The same interpretable-ML approach extends from quantum-information host materials to catalytic surfaces and compositionally complex alloys, identifying physically plausible candidates in each domain and demonstrating that the method generalises across functional contexts.

Collectively, these results establish a mechanism-aware approach to ML-driven materials discovery, where predictive models reveal the descriptors that govern a target property and guide the next round of first-principles or experimental work — rather than substituting for either.

{{% cta cta_link="../../" cta_text="← Go back to Research" %}}
