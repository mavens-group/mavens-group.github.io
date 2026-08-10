import benzeneScfInput from "./qe/benzene/scf.in?raw";
import benzeneDosInput from "./qe/benzene/dos.in?raw";
import benzeneLevels from "./qe/benzene/benzene_levels.csv?raw";
import benzeneDos from "./qe/benzene/benzene_dos.csv?raw";
import ethyleneScfInput from "./qe/ethylene/scf.in?raw";
import ethyleneDosInput from "./qe/ethylene/dos.in?raw";
import ethyleneLevels from "./qe/ethylene/ethylene_levels.csv?raw";
import ethyleneDos from "./qe/ethylene/ethylene_dos.csv?raw";
import formaldehydeScfInput from "./qe/formaldehyde/scf.in?raw";
import formaldehydeDosInput from "./qe/formaldehyde/dos.in?raw";
import formaldehydeLevels from "./qe/formaldehyde/formaldehyde_levels.csv?raw";
import formaldehydeDos from "./qe/formaldehyde/formaldehyde_dos.csv?raw";
import ammoniaScfInput from "./qe/ammonia/scf.in?raw";
import ammoniaDosInput from "./qe/ammonia/dos.in?raw";
import ammoniaLevels from "./qe/ammonia/ammonia_levels.csv?raw";
import ammoniaDos from "./qe/ammonia/ammonia_dos.csv?raw";

function parseLevels(csv) {
  return csv.trim().split("\n").slice(1).map((line) => {
    const [index, energy, occupied] = line.split(",");
    return { index: Number(index), energy: Number(energy), occupied: occupied === "1" };
  });
}

function parseDos(csv) {
  return csv.trim().split("\n").slice(1).map((line) => {
    const [energy, dos, integratedDos] = line.split(",");
    return { energy: Number(energy), dos: Number(dos), integratedDos: Number(integratedDos) };
  });
}

function reference({ scfInput, dosInput, levelsCsv, dosCsv, totalEnergyRy, iterations }) {
  const levels = parseLevels(levelsCsv);
  const occupied = levels.filter((level) => level.occupied);
  const unoccupied = levels.filter((level) => !level.occupied);
  const homo = occupied.at(-1)?.energy ?? null;
  const lumo = unoccupied[0]?.energy ?? null;
  return {
    scfInput,
    dosInput,
    levelsCsv,
    dosCsv,
    levels,
    dos: parseDos(dosCsv),
    homo,
    lumo,
    gap: homo != null && lumo != null ? lumo - homo : null,
    totalEnergyRy,
    iterations,
    program: "Quantum ESPRESSO 7.5",
    method: "PBE / PAW · Γ point",
    ecutwfc: 30,
    ecutrho: 240,
    cellAngstrom: 14,
    convThr: "1.0d-6",
    calculatedAt: "11 Aug 2026",
  };
}

export const QE_REFERENCE_DATA = {
  benzene: reference({
    scfInput: benzeneScfInput,
    dosInput: benzeneDosInput,
    levelsCsv: benzeneLevels,
    dosCsv: benzeneDos,
    totalEnergyRy: -117.63020777,
    iterations: 8,
  }),
  ethylene: reference({
    scfInput: ethyleneScfInput,
    dosInput: ethyleneDosInput,
    levelsCsv: ethyleneLevels,
    dosCsv: ethyleneDos,
    totalEnergyRy: -41.52954260,
    iterations: 8,
  }),
  formaldehyde: reference({
    scfInput: formaldehydeScfInput,
    dosInput: formaldehydeDosInput,
    levelsCsv: formaldehydeLevels,
    dosCsv: formaldehydeDos,
    totalEnergyRy: -62.25661515,
    iterations: 8,
  }),
  ammonia: reference({
    scfInput: ammoniaScfInput,
    dosInput: ammoniaDosInput,
    levelsCsv: ammoniaLevels,
    dosCsv: ammoniaDos,
    totalEnergyRy: -31.76301548,
    iterations: 7,
  }),
};
