---
title: "CView: Crystal Structure Visualization & Analysis"
summary: "A free, open-source crystal-structure viewer built for disordered materials: view, build and check a structure, then write the input for VASP, Quantum ESPRESSO or SPR-KKR."
date: "2026-11-15"
weight: 1
featured: true

tags:
  - Crystallography
  - Visualization
  - Materials Science
  - Desktop App
  - GTK4
  - Rust

# Featured image (Upload a screenshot named 'featured.png' to this folder)
image:
    preview_only: true

links:
  - icon: book
    icon_pack: fas
    name: Website
    url: https://mavensgroup.github.io/cview/
  - icon: github
    icon_pack: fab
    name: Source Code
    url: https://github.com/mavensgroup/cview
  - icon: file-alt
    icon_pack: fas
    name: Paper
    url: /publication/banerjee-2026/
---

## What it does

**CView** is a desktop crystal-structure viewer, written in Rust with GTK 4. It sits between looking at a structure and setting up a calculation on it: you open a file, check and modify the structure, and write the input for the next calculation. It is built for disordered materials — alongside ordered structures it handles the site occupations that describe a random alloy, and exports them to SPR-KKR for coherent-potential calculations.

* **Read and write the common formats**: VASP, Quantum ESPRESSO (including the final structure of a `vc-relax` run), SPR-KKR, CIF, XYZ and extended XYZ, PDB, and LAMMPS trajectories.
* **Symmetry**: space-group detection, and conversion between primitive and conventional cells.
* **Build structures**: supercells, surface slabs for any Miller plane, and searches for voids and intercalation sites.
* **Reciprocal space**: the first Brillouin zone and its standard high-symmetry k-path, drawn in 3D.
* **Simulated X-ray diffraction**, to compare a model structure with a measured pattern.
* **Figures**: export the view as PDF or transparent PNG for papers.

The main view draws on the CPU, so it runs on an ordinary laptop. Only the charge-density isosurface and trajectory player windows use OpenGL.

The method and its validation are described in the paper in the [*Journal of Applied Crystallography*](/publication/banerjee-2026/).

## Quick Start

CView runs on Linux, Windows and macOS. Ready-to-install packages are on the [Releases page](https://github.com/mavensgroup/cview/releases/latest). To build from source, you need Rust and the GTK 4 development files (on Fedora: `sudo dnf install gtk4-devel`):

```bash
git clone https://github.com/mavensgroup/cview.git
cd cview
cargo run --release
```

The [documentation](https://mavensgroup.github.io/cview/) covers installation on every platform and each tool in detail.
