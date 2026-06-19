---
# Landing Page
# Leave the homepage title empty to use the site title
title:
date: 2022-10-24
type: landing

sections:
  - block: slider
    content:
      slides:
        - title: '<span style="display: inline-block; margin-top: 35vh;">MAVENs</span>'
          content: Materials Advancing a Viable ENergy future
          align: center
          background:
            image:
              filename: group.webp
            position: center
            color: '#666'

        - title: Disorder and Coherence
          content: |
            When does a local electronic feature survive into a collective response, and when does the disorder around it take over? We track how symmetry breaking — a vacancy, a substitutional site, a defect cluster — propagates from local descriptor to spin-dependent behaviour and spin coherence.<br><small>doi: [10.1016/j.jssc.2024.124602](https://doi.org/10.1016/j.jssc.2024.124602)<br>doi: [10.1063/5.0238199](https://doi.org/10.1063/5.0238199)<br>doi: [10.1016/j.jpcs.2024.111914](https://doi.org/10.1016/j.jpcs.2024.111914)</small>
          align: left
          background:
            image:
              filename: heusler.webp
              filters:
                brightness: 0.5
            position: center
            color: '#555'

        - title: Disorder and Magnetism
          content: |
            Which features of the electronic structure survive the complexity of a real, disordered material? We isolate the control variables — d-band filling, Fermi-level position, exchange topology — that make compositional design predictive rather than exploratory.<br><small>doi: [10.1016/j.physb.2025.417148](https://doi.org/10.1016/j.physb.2025.417148)</small>
          align: left
          background:
            image:
              filename: mxene.webp
              filters:
                brightness: 0.5
            position: center
            color: '#555'

    design:
      is_fullscreen: true
      slide_height: ''
      loop: true
      interval: 5000
      css_class: "slider-fade"

  # ── About ──────────────────────────────────────────────────────────────────
  - block: markdown
    content:
      title:
      text: |

        <blockquote style="text-align:center; font-size: 2rem; font-style: italic; margin: 0; padding: 0;">
          You may say <b>we</b> are dreamers
          <footer style="text-align:center; font-size: 0.9rem; margin-top: 0.2rem;
          margin-bottom:.2rem">
            — <cite>John Lennon</cite>, <em>Imagine</em> (slightly modified)
          </footer>
        </blockquote>

        **MAVENs** (*Materials Advancing a Viable ENergy Future*), led by [Dr. Rudra Banerjee](./author/rudra-banerjee/), is based in the [Department of Physics and Nanotechnology](https://www.srmist.edu.in/department/department-of-physics-and-nanotechnology/) at the [SRM Institute of Science and Technology](https://srmist.edu.in).

        Bloch's theorem rewards a perfect crystal with clean, classifiable states — and almost no real material obliges. Substitution, vacancies, and chemical mixing are not blemishes on an ideal lattice; they are what the material actually is. Disorder is intrinsic, and it is often the thing that decides whether a material works.

        <div class="callout-question">Predicting how disorder controls functional behaviour — from first principles — is the central problem of our research.</div>

        We combine DFT, Monte Carlo, spin-dynamics, and machine learning — using each where the physics demands it: DFT for electronic structure, Monte Carlo and spin dynamics for finite-temperature collective behaviour, ML where compositional spaces become too large for direct first-principles study.




    design:
      columns: '1'

  # ── Research Themes ────────────────────────────────────────────────────────
  - block: markdown
    content:
      title:
      text: |
        ### Research Themes

        <div class="research-themes-grid research-themes-grid--two">
          <div class="theme-card">
            <a class="theme-title" href="/research/post/magnetism/">Disorder and Magnetism</a>
            <span class="theme-desc">How does chemical disorder decide whether a magnet orders, at what temperature, and how much magnetisation survives?</span>
          </div>
          <div class="theme-card">
            <a class="theme-title" href="/research/post/coherence/">Disorder and Coherence</a>
            <span class="theme-desc">What lets a chemically generated spin centre hold quantum phase information, and how does the disorder around it set the limit?</span>
          </div>
          <div class="theme-card">
            <a class="theme-title" href="/research/post/catalysis/">Disorder and Catalysis</a>
            <span class="theme-desc">In a compositionally complex catalyst no two sites are alike — so what sets the distribution of adsorption energies, and where it sits?</span>
          </div>
          <div class="theme-card">
            <a class="theme-title" href="/research/post/ml/">Machine Learning Driven Discovery</a>
            <span class="theme-desc">Machine-learning discovery that keeps the physical insight which makes a prediction transferable.</span>
          </div>
        </div>

        {{% cta cta_link="./research/" cta_text="Explore Our Research" %}}
    design:
      columns: '1'


  # ── Research Highlights ────────────────────────────────────────────────────
  - block: markdown
    content:
      title:
      text: |

       ### Research Highlights <a href="/news/" class="highlight-cta"><i data-feather="chevron-right"></i></a>

        {{% highlight-list %}}

    design:
      columns: '1'

  # ── Join the Discovery ─────────────────────────────────────────────────────
  - block: markdown
    content:
      title:
      text: |
        ### Open Positions

        We welcome M.Sc. and PhD students in physics, chemistry, or materials science. Projects span _ab-initio_ [DFT](blog/2024-07-dft), Monte Carlo, and ML-driven screening.

        {{% cta cta_link="./position/" cta_text="See Open Projects" %}}

    design:
      columns: '1'
---
