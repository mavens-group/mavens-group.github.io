function numbers(text) {
  return (text.match(/[+-]?(?:\d+\.?\d*|\.\d+)(?:[EeDd][+-]?\d+)?/g) || [])
    .map((value) => Number(value.replace(/[dD]/, "E")))
    .filter(Number.isFinite);
}

function lastMatch(text, regex) {
  let found = null;
  for (const match of text.matchAll(regex)) found = match;
  return found;
}

export function parseQuantumEspressoOutput(text) {
  const output = String(text || "");
  const electronMatch = lastMatch(output, /number of electrons\s*=\s*([\d.]+)/gi);
  const electrons = electronMatch ? Number(electronMatch[1]) : null;
  const directGap = lastMatch(output, /highest occupied, lowest unoccupied level \(ev\):\s*([-+\d.Ee]+)\s+([-+\d.Ee]+)/gi);
  const homoOnly = lastMatch(output, /highest occupied level \(ev\):\s*([-+\d.Ee]+)/gi);
  const totalEnergyMatch = lastMatch(output, /^!\s+total energy\s+=\s*([-+\d.Ee]+)\s+Ry/gim);
  const iterations = [...output.matchAll(/iteration #\s*(\d+)/gi)].map((m) => Number(m[1]));

  let eigenvalues = [];
  const bandHeaders = [...output.matchAll(/bands \(ev\):\s*\n/gi)];
  if (bandHeaders.length) {
    const start = bandHeaders.at(-1).index + bandHeaders.at(-1)[0].length;
    const tail = output.slice(start);
    const end = tail.search(/\n\s*(?:occupation numbers|the Fermi energy|highest occupied|Writing output data|End of self-consistent)/i);
    eigenvalues = numbers(end < 0 ? tail.slice(0, 4000) : tail.slice(0, end));
  }

  let homo = directGap ? Number(directGap[1]) : homoOnly ? Number(homoOnly[1]) : null;
  let lumo = directGap ? Number(directGap[2]) : null;
  if ((homo == null || lumo == null) && electrons != null && eigenvalues.length) {
    const occupiedCount = Math.ceil(electrons / 2);
    if (eigenvalues.length > occupiedCount) {
      homo = eigenvalues[occupiedCount - 1];
      lumo = eigenvalues[occupiedCount];
    }
  }

  const errors = output.split("\n").filter((line) => /(?:Error in routine|%%%%%%%%%%%%|stopping \.\.\.|convergence NOT achieved)/i.test(line)).slice(-8);
  return {
    program: output.match(/Program\s+PWSCF\s+v\.?(\S+)/i)?.[1] || null,
    jobDone: /JOB DONE\./i.test(output),
    scfConverged: /convergence has been achieved/i.test(output),
    electrons,
    eigenvalues,
    homo,
    lumo,
    gap: homo != null && lumo != null ? lumo - homo : null,
    totalEnergyRy: totalEnergyMatch ? Number(totalEnergyMatch[1]) : null,
    scfIterations: iterations.length ? Math.max(...iterations) : null,
    errors,
  };
}
