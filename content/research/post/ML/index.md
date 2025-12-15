---
title: Machine Learning driven Materials Discovery
summary: What if we could predict optimal materials for quantum devices from millions of candidates before synthesis?
show_date: false
profile: false
weight: 3
---
### Scientific Challenge
Discovering functional materials with targeted properties is critical for technological advancement, but the **vast chemical composition space** and complex structure-property relationships make this task extremely challenging. Traditional approaches, including **trial-and-error experiments** and exhaustive ab initio calculations, are time-consuming and resource-intensive, **limiting exploration** and slowing the pace of discovery.

However, **purely data-driven approaches risk sacrificing physical insight for predictive accuracy**. A central challenge is therefore to develop methods that efficiently predict material properties while **maintaining interpretability and scientific understanding**, ensuring that predictions are physically grounded and experimentally actionable.

### Our Approach
We leverage **Machine Learning (ML)** integrated with **DFT validation** to accelerate materials discovery through **physics-informed, interpretable models**:

- Identify patterns and correlations in chemical and structural datasets to predict material properties rapidly
- Develop **hybrid ML approaches** that combine predictive power with **physical interpretability**, mapping feature vectors to meaningful descriptors
- Validate ML predictions through targeted DFT calculations and high-throughput screening
- Apply ML systematically across **defect-host systems for qubits, catalytic materials for hydrogen evolution, and functional alloys**

We explicitly prioritize physical interpretability over marginal gains in predictive accuracy, ensuring that machine-learning models serve as tools for scientific understanding rather than black-box optimizers detached from materials physics.

### Key Insights & Achievements
- Designed ML models targeting **defect-host systems for quantum information processing**, specifically defects analogous to nitrogen-vacancy (NV) centers in diamond
- Achieved **F1 scores > 0.98** and **Matthews correlation coefficients > 0.90** on imbalanced datasets while maintaining model interpretability
- Predicted materials suitable for building **qubit arrays with long coherence times at room temperature**, providing a roadmap for experimental validation
- Applied interpretable ML frameworks to accelerate screening of **catalytic materials and compositionally complex alloys**, identifying physically plausible candidates for targeted validation

Collectively, these results establish a **mechanism-aware approach to ML-driven materials discovery**, where predictive models reveal governing descriptors and guide experimental synthesis rather than replace first-principles understanding.

{{% cta cta_link="./research/" cta_text="← Go back to Research" %}}
