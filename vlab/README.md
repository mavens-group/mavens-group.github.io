# Virtual Lab Suite

## Running the Quantum ESPRESSO lab

The Quantum ESPRESSO demonstration is fully static and includes precomputed Quantum ESPRESSO 7.5 SCF eigenvalues, DOS curves, and portable input files for all four molecules. Clicking Run loads the matching stored data, so it works in GitLab Pages without `pw.x` or pseudopotentials on the web host.

The normal development command starts the static Vite application:

```bash
npm run dev
```

The current classroom demonstration does not call the execution bridge. For bridge development, use `npm run dev:full`, or run `npm run qe-server` and `npm run dev:vite` separately.

The bridge listens only on `127.0.0.1:8787`. It discovers executable `pw.x` files on `PATH`; additional trusted executables can be exposed with the platform path separator:

```bash
QE_PW_PATHS=/opt/qe/bin/pw.x npm run qe-server
```

Set `ESPRESSO_PSEUDO` or `QE_PSEUDO_DIR` to make a pseudopotential directory appear automatically. The lab also accepts an existing Quantum ESPRESSO `.out` file and parses it entirely in the browser.

Real jobs run in isolated temporary directories, use one OpenMP thread by default, have an execution timeout, and can be cancelled from the interface. The selected pseudopotential files must match the filenames shown in the generated input.

# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and Oxlint's TypeScript related rules in your project.
