---
title: 'CView : a Rust-based integrated environment for inorganic crystallographic
  analysis and high-fidelity visualization'

# Authors
# A YAML list of author names
# If you created a profile for a user (e.g. the default `admin` user at `content/authors/admin/`),
# write the username (folder name) here, and it will be replaced with their full name and linked to their profile.
authors:
- Rudra

# Author notes (such as 'Equal Contribution')
# A YAML list of notes for each author in the above `authors` list
author_notes: []

date: '2026-11-01'

# Date to publish webpage (NOT necessarily Bibtex publication's date).
publishDate: '2026-11-09T16:46:46.936968Z'

# Publication type.
# A single CSL publication type but formatted as a YAML list (for Hugo requirements).
publication_types:
- article-journal

# Publication name and optional abbreviated publication name.
publication: '*Journal of Applied Crystallography*'
publication_short: ''

doi: 10.1107/s1600576726009003

abstract: '
CView is a free, open-source desktop application for the visualization and analysis of inorganic crystal structures, written in Rust with a GTK4/Cairo front end and targeted at computational materials researchers preparing or interpreting plane-wave density-functional-theory calculations. It reads and writes the file formats most commonly encountered in such workflows — CIF, VASP POSCAR and CHGCAR, Quantum ESPRESSO input files, extended XYZ, and the sectioned .pot/.sys input format of the spin-polarized relativistic Korringa–Kohn–Rostoker Greens-function code, including native support for the chemical-disorder occupation blocks that describe coherent-potential-approximation alloys. CView provides, in a single graphical interface, ball-and-stick and coordination-polyhedron rendering with two-tier ghost-atom generation; bond-valence-sum analysis using the bvparm2020 parameter set with full periodic-image summation; space-group determination through the moyo Rust crystal-symmetry library, whose conventions follow spglib; automatic Bravais classification and Setyawan–Curtarolo high-symmetry k-path construction built from the standardized primitive cell; Voronoi construction of the first Brillouin zone through half-space intersection of the reciprocal lattice; powder X-ray diffraction simulation; slab generation along arbitrary Miller indices; CHGCAR charge-density visualization with user-selected (hkl) slices and isolines; and probe-accessible void analysis with Shannon ionic radii for screening candidate intercalation ions in cathode materials. All three-dimensional content is rendered through Cairo as resolution-independent vector graphics, so that figures exported as PDF or SVG from the interactive viewer drop directly into a publication without rasterization artefacts. CView is distributed under the MIT licence as pre-built .deb, .rpm, .dmg and .exe packages.
'

# Summary. An optional shortened abstract.
summary: ''

tags: []

# Display this page in a list of Featured pages?
featured: false

# Links
url_pdf: ''
url_code: ''
url_dataset: ''
url_poster: ''
url_project: ''
url_slides: ''
url_source: ''
url_video: ''

# Custom links (uncomment lines below)
# links:
# - name: Custom Link
#   url: http://example.org

# Publication image
# Add an image named `featured.jpg/png` to your page's folder then add a caption below.
image:
  caption: ''
  focal_point: ''
  preview_only: false

# Associated Projects (optional).
#   Associate this publication with one or more of your projects.
#   Simply enter your project's folder or file name without extension.
#   E.g. `projects: ['internal-project']` links to `content/project/internal-project/index.md`.
#   Otherwise, set `projects: []`.
projects: []
links:
- name: URL
  url: http://dx.doi.org/10.1107/S1600576726009003
---

Add the **full text** or **supplementary notes** for the publication here using Markdown formatting.
