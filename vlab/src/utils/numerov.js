const DEFAULT_TOLERANCE = 1e-14;

function makeGrid(start, end, intervals) {
  const step = (end - start) / intervals;
  return Array.from({ length: intervals + 1 }, (_, index) => start + index * step);
}

function integrateNumerov(x, energy, potential, initial) {
  const step = x[1] - x[0];
  const stepSquared = step * step;
  const q = x.map((position) => 2 * (potential(position) - energy));
  const psi = new Array(x.length).fill(0);
  psi[0] = initial[0];
  psi[1] = initial[1];

  for (let index = 1; index < x.length - 1; index += 1) {
    const previousFactor = 1 - (stepSquared * q[index - 1]) / 12;
    const currentFactor = 2 * (1 + (5 * stepSquared * q[index]) / 12);
    const nextFactor = 1 - (stepSquared * q[index + 1]) / 12;
    psi[index + 1] = (currentFactor * psi[index] - previousFactor * psi[index - 1]) / nextFactor;
  }

  return psi;
}

function bracketedRoot(residual, low, high, target) {
  const samples = 240;
  const brackets = [];
  let left = low;
  let leftValue = residual(left);

  for (let index = 1; index <= samples; index += 1) {
    const right = low + ((high - low) * index) / samples;
    const rightValue = residual(right);
    if (Number.isFinite(leftValue) && Number.isFinite(rightValue)) {
      if (leftValue === 0) return left;
      if (leftValue * rightValue < 0) brackets.push([left, right]);
    }
    left = right;
    leftValue = rightValue;
  }

  if (!brackets.length) return target;
  let [a, b] = brackets.reduce((nearest, candidate) => {
    const nearestDistance = Math.abs((nearest[0] + nearest[1]) / 2 - target);
    const candidateDistance = Math.abs((candidate[0] + candidate[1]) / 2 - target);
    return candidateDistance < nearestDistance ? candidate : nearest;
  });
  let fa = residual(a);

  for (let iteration = 0; iteration < 90 && b - a > DEFAULT_TOLERANCE; iteration += 1) {
    const midpoint = (a + b) / 2;
    const fm = residual(midpoint);
    if (fa * fm <= 0) {
      b = midpoint;
    } else {
      a = midpoint;
      fa = fm;
    }
  }

  return (a + b) / 2;
}

function normalizeWavefunction(x, psi) {
  let integral = 0;
  for (let index = 1; index < x.length; index += 1) {
    const step = x[index] - x[index - 1];
    integral += 0.5 * step * (psi[index - 1] ** 2 + psi[index] ** 2);
  }
  const scale = integral > 0 ? 1 / Math.sqrt(integral) : 1;
  const normalized = psi.map((value) => value * scale);

  const largest = normalized.reduce(
    (best, value) => (Math.abs(value) > Math.abs(best) ? value : best),
    normalized[0] || 1,
  );
  const phase = largest < 0 ? -1 : 1;
  return normalized.map((value) => value * phase);
}

function countNodes(psi) {
  const amplitude = Math.max(...psi.map(Math.abs));
  // Ignore sign changes in the exponentially small numerical tail. Shooting
  // solutions inevitably contain a tiny admixture of the growing solution
  // near a finite boundary, but that tail is not a physical node.
  const threshold = amplitude * 1e-4;
  let previousSign = 0;
  let nodes = 0;

  for (let index = 1; index < psi.length - 1; index += 1) {
    if (Math.abs(psi[index]) < threshold) continue;
    const sign = Math.sign(psi[index]);
    if (previousSign && sign !== previousSign) nodes += 1;
    previousSign = sign;
  }
  return nodes;
}

function finishSolution({ x, psi, energy, exactEnergy, potential, boundaryResidual, method }) {
  const normalized = normalizeWavefunction(x, psi);
  return {
    energy,
    exactEnergy,
    relativeError: Math.abs((energy - exactEnergy) / exactEnergy),
    boundaryResidual,
    nodes: countNodes(normalized),
    step: x[1] - x[0],
    method,
    points: x.map((position, index) => ({
      x: position,
      psi: normalized[index],
      probability: normalized[index] ** 2,
      potential: potential(position),
    })),
  };
}

export function solveInfiniteWell({ quantumNumber, width, intervals = 800 }) {
  const halfWidth = width / 2;
  const x = makeGrid(-halfWidth, halfWidth, intervals);
  const potential = () => 0;
  const exactEnergy = (quantumNumber ** 2 * Math.PI ** 2) / (2 * width ** 2);
  const previousEnergy = quantumNumber === 1
    ? 0
    : ((quantumNumber - 1) ** 2 * Math.PI ** 2) / (2 * width ** 2);
  const nextEnergy = ((quantumNumber + 1) ** 2 * Math.PI ** 2) / (2 * width ** 2);
  const step = x[1] - x[0];
  const initialFor = (energy) => [
    0,
    step - (energy * step ** 3) / 3 + (energy ** 2 * step ** 5) / 30,
  ];
  const residual = (energy) => {
    const psi = integrateNumerov(x, energy, potential, initialFor(energy));
    return psi.at(-1);
  };
  const energy = bracketedRoot(
    residual,
    (previousEnergy + exactEnergy) / 2,
    (exactEnergy + nextEnergy) / 2,
    exactEnergy,
  );
  const psi = integrateNumerov(x, energy, potential, initialFor(energy));

  return finishSolution({
    x,
    psi,
    energy,
    exactEnergy,
    potential,
    boundaryResidual: psi.at(-1),
    method: "left-to-right Dirichlet shooting",
  });
}

export function solveHarmonicOscillator({ quantumNumber, omega, halfIntervals = 600 }) {
  const extent = 7 / Math.sqrt(omega);
  const halfX = makeGrid(0, extent, halfIntervals);
  const step = halfX[1] - halfX[0];
  const potential = (position) => 0.5 * omega ** 2 * position ** 2;
  const exactEnergy = omega * (quantumNumber + 0.5);
  const even = quantumNumber % 2 === 0;
  const initialFor = (energy) => even
    ? [
        1,
        1 - energy * step ** 2 + ((omega ** 2 + 2 * energy ** 2) * step ** 4) / 12,
      ]
    : [
        0,
        step - (energy * step ** 3) / 3 + (omega ** 2 / 20 + energy ** 2 / 30) * step ** 5,
      ];
  const residual = (energy) => integrateNumerov(
    halfX,
    energy,
    potential,
    initialFor(energy),
  ).at(-1);
  const energy = bracketedRoot(
    residual,
    Math.max(1e-8, exactEnergy - 0.8 * omega),
    exactEnergy + 0.8 * omega,
    exactEnergy,
  );
  const halfPsi = integrateNumerov(halfX, energy, potential, initialFor(energy));
  const negativeX = halfX.slice(1).reverse().map((value) => -value);
  const negativePsi = halfPsi.slice(1).reverse().map((value) => (even ? value : -value));
  const x = [...negativeX, ...halfX];
  const psi = [...negativePsi, ...halfPsi];

  return finishSolution({
    x,
    psi,
    energy,
    exactEnergy,
    potential,
    boundaryResidual: halfPsi.at(-1),
    method: `${even ? "even" : "odd"}-parity half-domain shooting`,
  });
}
