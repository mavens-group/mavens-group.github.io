# Determination of Hall coefficient, carrier density and carrier mobility

## 1. Aim

To determine the Hall coefficient \(R_H\), the sign and concentration of the dominant charge carriers, the resistivity \(\rho\), and the carrier mobility \(\mu\) of a semiconductor wafer.

## 2. Learning outcomes

After completing this experiment, you should be able to:

1. derive the Hall field from the semiclassical equation of motion;
2. distinguish the sign convention for electron and hole conduction;
3. determine \(R_H\), carrier density, resistivity, and mobility from four-probe measurements;
4. separate the odd-in-field Hall signal from even-in-field contact and thermoelectric offsets;
5. identify the limitations of the single-carrier Hall model.

## 3. Physical background

Consider a rectangular wafer carrying current in the \(+x\) direction while a magnetic flux density is applied along \(+z\). A carrier with charge \(q\) and drift velocity \(\mathbf v_d\) experiences the Lorentz force

$$
\mathbf F_B=q(\mathbf v_d\times\mathbf B).
$$

The carriers initially deflect toward one side of the wafer. Charge accumulation produces a transverse Hall electric field \(\mathbf E_H\). At steady state, the transverse force vanishes:

$$
q(\mathbf E_H+\mathbf v_d\times\mathbf B)=0.
$$

The Hall coefficient is defined by

$$
R_H=\frac{E_y}{J_xB_z}.
$$

For a specimen of thickness \(t\), \(V_H=E_yw\) and \(J_x=I/(wt)\), giving

$$
R_H=\frac{V_Ht}{IB}.
$$

In the usual convention, \(R_H<0\) indicates electron-dominated conduction (n-type), while \(R_H>0\) indicates hole-dominated conduction (p-type). The sign must always be reported together with the chosen directions of \(I\), \(B\), and the voltage leads.

## 4. Single-carrier model

For one dominant carrier species with density \(N\) and charge magnitude \(e\),

$$
R_H=\frac{1}{qN}=
\begin{cases}
-\dfrac{1}{ne}, & \text{electrons},\\[6pt]
\dfrac{1}{pe}, & \text{holes}.
\end{cases}
$$

Thus the effective Hall density is

$$
N=\frac{1}{e|R_H|},
\qquad e=1.602176634\times10^{-19}\ \mathrm{C}.
$$

This is an effective Hall density. In real semiconductors, Hall factors, multiband conduction, compensation, degeneracy, and temperature dependence can make it differ from the chemical dopant concentration.

## 5. Resistivity and mobility

For longitudinal probe separation \(L\), wafer width \(w\), and thickness \(t\),

$$
\rho=\frac{V_L}{I}\frac{wt}{L},
\qquad
\sigma=\frac{1}{\rho}.
$$

The Hall mobility is

$$
\mu_H=\frac{|R_H|}{\rho}.
$$

Use \(R_H\) in \(\mathrm{m^3\,C^{-1}}\), \(N\) in \(\mathrm{m^{-3}}\), \(\rho\) in \(\Omega\,\mathrm m\), and \(\mu_H\) in \(\mathrm{m^2\,V^{-1}\,s^{-1}}\). To report mobility in \(\mathrm{cm^2\,V^{-1}\,s^{-1}}\), multiply the SI value by \(10^4\).

## 6. Experimental arrangement

Use a four-contact geometry:

- outer contacts source and sink \(I\);
- inner longitudinal contacts measure \(V_L\);
- transverse contacts measure \(V_H\);
- an electromagnet produces \(B\) normal to the wafer.

The transverse voltmeter should have high input impedance. The wafer should be uniform in thickness, and the field should be uniform over the active region.

## 7. Measurement procedure

1. Measure \(t\), \(w\), and \(L\), including instrument resolution.
2. Set a small constant current and allow the reading to stabilise.
3. Measure \(V_L(+B)\) and \(V_H(+B)\).
4. Reverse the field without changing the wiring, then measure \(V_L(-B)\) and \(V_H(-B)\).
5. Repeat at additional current values if a linearity check is required.
6. Remove offsets using

$$
V_H^{\mathrm{odd}}=\frac{V_H(+B)-V_H(-B)}{2}.
$$

For the longitudinal voltage, use the field-even component

$$
V_L^{\mathrm{even}}=\frac{V_L(+B)+V_L(-B)}{2}.
$$

7. Substitute SI values and compare the sign of \(R_H\) with the expected carrier type.

## 8. Worked example

Let \(I=8.0\ \mathrm{mA}\), \(B=0.42\ \mathrm T\), \(t=0.50\ \mathrm{mm}\), \(w=5.0\ \mathrm{mm}\), \(L=10.0\ \mathrm{mm}\), \(V_H=13.1\ \mathrm{\mu V}\), and \(V_L=42.0\ \mathrm{mV}\). Then

$$
R_H=\frac{(13.1\times10^{-6})(0.50\times10^{-3})}
{(8.0\times10^{-3})(0.42)}
\approx1.95\times10^{-6}\ \mathrm{m^3\,C^{-1}}.
$$

The carrier density is approximately \(3.20\times10^{24}\ \mathrm{m^{-3}}\). The resistivity is approximately \(1.31\times10^{-3}\ \Omega\,\mathrm m\), giving \(\mu_H\approx1.49\times10^{-3}\ \mathrm{m^2\,V^{-1}\,s^{-1}}\), or \(14.9\ \mathrm{cm^2\,V^{-1}\,s^{-1}}\). The sign depends on the terminal polarity and field direction.

## 9. Uncertainty and error analysis

For \(R_H=V_Ht/(IB)\), the approximate independent uncertainty is

$$
\left(\frac{u_{R_H}}{|R_H|}\right)^2
=\left(\frac{u_{V_H}}{|V_H|}\right)^2+
\left(\frac{u_t}{t}\right)^2+
\left(\frac{u_I}{I}\right)^2+
\left(\frac{u_B}{B}\right)^2.
$$

Because \(N=1/(e|R_H|)\), the relative uncertainty in \(N\) is approximately that in \(R_H\). For mobility,

$$
\left(\frac{u_\mu}{\mu}\right)^2
\approx
\left(\frac{u_{R_H}}{|R_H|}\right)^2+
\left(\frac{u_\rho}{\rho}\right)^2.
$$

Important practical errors include nanovoltmeter resolution, contact misalignment, thermoelectric offsets, thickness uncertainty, field calibration, and Joule heating. A non-zero \(V_H\) at \(B=0\) is an offset, not a Hall signal.

## 10. Limitations and discussion

The single-carrier expression assumes one dominant band and field-independent mobility. In compensated or multiband semiconductors,

$$
R_H=\frac{p\mu_h^2-n\mu_e^2}{e(p\mu_h+n\mu_e)^2}.
$$

Therefore, the sign may depend on temperature and magnetic field. A p-n junction depletion region is a separate electrostatic phenomenon; it is not required for a bulk Hall measurement.

## 11. Precautions

- Keep current low enough to avoid self-heating.
- Reverse the magnetic field rather than swapping leads during offset correction.
- Do not trust a Hall voltage comparable to the instrument offset without symmetrisation.
- Convert millimetres, millivolts, and microvolts to SI units before calculation.
- Report sign convention, temperature, field direction, and uncertainty with the final result.
