---
title: "Ptbl: Periodic Table"
summary: "A desktop periodic table for Linux: pick an element and browse its physical data, with legacy element utilities rebuilt for GTK4. Beta."
date: "2026-11-05"
weight: 3
featured: false

tags:
  - Periodic Table
  - Desktop App
  - GTK4
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

**Ptbl** is a GTK4 desktop periodic table. Select an element to browse its physical data, search by symbol or name to jump straight to it, and open **Tools** for legacy element utilities, now rebuilt for GTK4.

Core atomic and thermal properties come from a bundled snapshot of the [PubChem periodic table](https://pubchem.ncbi.nlm.nih.gov/periodic-table/). Some specialist crystal, electrical and nuclear values are older data still being checked source by source, so treat those as provisional.

## Quick Start

Ptbl needs Python 3 with PyGObject and GTK 4 (`gtk4` and `python3-gobject` on Fedora; `gir1.2-gtk-4.0` and `python3-gi` on Debian/Ubuntu).

```bash
python3 -m pip install git+https://github.com/mavens-group/Ptbl.git
ptbl
```
