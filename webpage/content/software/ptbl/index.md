---
title: "Ptbl: Periodic Table"
summary: "A periodic table for the Linux desktop: browse all 118 elements, colour the table by a property, plot trends, and estimate alloy structures with Vegard's law."
date: "2026-11-05"
weight: 3
featured: false

tags:
  - Periodic Table
  - Desktop App
  - GTK4
  - Alloys
  - Python

image:
    preview_only: true
links:
  - icon: github
    icon_pack: fab
    name: Source Code
    url: https://github.com/mavens-group/Ptbl
---

## What it does

**Ptbl** is a periodic table for the Linux desktop, built with GTK 4 and libadwaita. It works offline.

* **Browse** all 118 elements, coloured by category, with up to 40 properties per element on six tabs.
* **Search and filter**: find an element by symbol or name as you type, or highlight one category, such as the transition metals.
* **Colour by property**: turn the table into a heatmap of one of eight properties.
* **Trend charts**: plot atomic, covalent or van der Waals radius, or electron affinity, against atomic number.
* **Vegard's law calculator**: estimate the lattice parameters, cell volume and density of an alloy from its composition, then open the structure in [CView](../cview/) or export it as a CIF file.

Atomic and thermal properties come from a bundled snapshot of the [PubChem periodic table](https://pubchem.ncbi.nlm.nih.gov/periodic-table/). Some crystal, electrical, magnetic and nuclear values come from earlier versions of Ptbl and haven't yet been checked against current sources, so verify them before relying on them. Vegard's-law results are quick estimates, not a substitute for a calculation or a measurement.

## Quick Start

Ptbl needs Linux, Python 3.10 or newer, and GTK 4.12, libadwaita 1.5 and PyGObject from your distribution's packages (on Fedora: `sudo dnf install gtk4 libadwaita python3-gobject`).

```bash
python3 -m pip install --user git+https://github.com/mavens-group/Ptbl.git
ptbl
```

On Debian, Ubuntu and Arch Linux, add `--break-system-packages`. The [README](https://github.com/mavens-group/Ptbl#installation) covers every distribution, virtual environments and troubleshooting.
