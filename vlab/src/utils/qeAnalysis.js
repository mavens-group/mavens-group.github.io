const BOHR_PER_ANGSTROM = 1.889726125;
const RY_TO_EV = 13.605693122994;

export function buildScfInput(source, cutoffRy, cellAngstrom) {
  const shift = (cellAngstrom - 14) / 2;
  let inPositions = false;
  return source.split("\n").map((line) => {
    const trimmed = line.trim();
    if (/^ATOMIC_POSITIONS/i.test(trimmed)) {
      inPositions = true;
      return line;
    }
    if (/^(K_POINTS|CELL_PARAMETERS|ATOMIC_SPECIES)/i.test(trimmed)) inPositions = false;
    if (inPositions && /^\s*[A-Z][a-z]?\s+[-+\d.]+\s+[-+\d.]+\s+[-+\d.]+/.test(line)) {
      const [symbol, x, y, z, ...rest] = trimmed.split(/\s+/);
      return `  ${symbol}  ${(Number(x) + shift).toFixed(6)}  ${(Number(y) + shift).toFixed(6)}  ${(Number(z) + shift).toFixed(6)}${rest.length ? `  ${rest.join("  ")}` : ""}`;
    }
    if (/^\s*celldm\(1\)/i.test(line)) return `  celldm(1) = ${(cellAngstrom * BOHR_PER_ANGSTROM).toFixed(6)}`;
    if (/^\s*ecutwfc/i.test(line)) return `  ecutwfc = ${cutoffRy.toFixed(1)}`;
    if (/^\s*ecutrho/i.test(line)) return `  ecutrho = ${(cutoffRy * 8).toFixed(1)}`;
    return line;
  }).join("\n");
}

export function buildDosInput(source, sigmaEv) {
  const sigmaRy = sigmaEv / RY_TO_EV;
  return source.replace(/^\s*degauss\s*=.*$/im, `  degauss = ${sigmaRy.toFixed(5)}`);
}

export function broadenLevels(levels, sigmaEv, step = 0.05) {
  if (!levels?.length) return [];
  const sigma = Math.max(0.03, sigmaEv);
  const minimum = Math.floor((Math.min(...levels.map((level) => level.energy)) - 2) / step) * step;
  const maximum = Math.ceil((Math.max(...levels.map((level) => level.energy)) + 2) / step) * step;
  const normalization = 1 / (sigma * Math.sqrt(2 * Math.PI));
  let integratedDos = 0;
  const samples = [];
  for (let energy = minimum; energy <= maximum + step / 2; energy += step) {
    const dos = levels.reduce((sum, level) => {
      const offset = (energy - level.energy) / sigma;
      return sum + 2 * normalization * Math.exp(-0.5 * offset * offset);
    }, 0);
    integratedDos += dos * step;
    samples.push({
      energy: Number(energy.toFixed(4)),
      dos: Number(dos.toFixed(6)),
      integratedDos: Number(integratedDos.toFixed(5)),
    });
  }
  return samples;
}

export function levelsToCsv(levels) {
  return `index,energy_ev,occupied\n${levels.map((level) => `${level.index},${level.energy},${level.occupied ? 1 : 0}`).join("\n")}\n`;
}

export function dosToCsv(dos) {
  return `energy_ev,dos_states_per_ev,integrated_dos\n${dos.map((point) => `${point.energy},${point.dos},${point.integratedDos}`).join("\n")}\n`;
}

export function convergenceDelta(sweep, key) {
  const convergedValue = sweep.at(-1)?.[key];
  return sweep.map((point) => ({
    ...point,
    energyDeltaMilliRy: convergedValue == null || point[key] == null
      ? null
      : Math.abs(point[key] - convergedValue) * 1000,
  }));
}
