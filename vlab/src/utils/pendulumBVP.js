// Boundary-value solver for the nonlinear pendulum  θ'' + (g/L) sin θ = 0.
//
// A boundary-value problem fixes conditions at TWO points in time. Here the
// pendulum is released from rest at θ0 and we require it to reach θ = 0 at the
// (unknown) quarter period τ:
//
//     θ(0) = θ0,   θ'(0) = 0,   θ(τ) = 0.
//
// Three conditions for a second-order equation is one too many, which is
// exactly what lets the period τ be found as part of the solution. Rescaling
// time with s = t/τ ∈ [0, 1] turns this into a fixed-interval problem
//
//     d²θ/ds² = −τ² (g/L) sin θ,   θ(0)=θ0, θ'(0)=0, θ(1)=0,
//
// with the unknown parameter τ. We discretise on N uniform intervals
// (second-order central differences) and solve the N+2 nonlinear algebraic
// equations for (θ_0 … θ_N, τ) by Newton's method, using continuation in θ0
// so that each solve starts close to a converged solution.

/** Solve the dense linear system A x = b in place (Gaussian elimination, partial pivoting). */
function solveLinear(A, b) {
  const n = b.length;
  for (let col = 0; col < n; col += 1) {
    let pivot = col;
    for (let r = col + 1; r < n; r += 1) if (Math.abs(A[r][col]) > Math.abs(A[pivot][col])) pivot = r;
    if (Math.abs(A[pivot][col]) < 1e-300) throw new Error("singular Jacobian");
    if (pivot !== col) { [A[pivot], A[col]] = [A[col], A[pivot]]; [b[pivot], b[col]] = [b[col], b[pivot]]; }
    for (let r = col + 1; r < n; r += 1) {
      const f = A[r][col] / A[col][col];
      if (f === 0) continue;
      for (let c = col; c < n; c += 1) A[r][c] -= f * A[col][c];
      b[r] -= f * b[col];
    }
  }
  const x = new Array(n);
  for (let r = n - 1; r >= 0; r -= 1) {
    let s = b[r];
    for (let c = r + 1; c < n; c += 1) s -= A[r][c] * x[c];
    x[r] = s / A[r][r];
  }
  return x;
}

function residual(u, N, gl, theta0) {
  const h = 1 / N, tau = u[N + 1], F = new Array(N + 2);
  F[0] = u[0] - theta0;
  for (let i = 1; i < N; i += 1) F[i] = u[i - 1] - 2 * u[i] + u[i + 1] + h * h * tau * tau * gl * Math.sin(u[i]);
  F[N] = u[N];
  F[N + 1] = (-3 * u[0] + 4 * u[1] - u[2]) / (2 * h); // θ'(0) = 0, second-order one-sided
  return F;
}

function jacobian(u, N, gl) {
  const h = 1 / N, tau = u[N + 1], n = N + 2;
  const J = Array.from({ length: n }, () => new Array(n).fill(0));
  J[0][0] = 1;
  for (let i = 1; i < N; i += 1) {
    J[i][i - 1] = 1;
    J[i][i] = -2 + h * h * tau * tau * gl * Math.cos(u[i]);
    J[i][i + 1] = 1;
    J[i][N + 1] = 2 * h * h * tau * gl * Math.sin(u[i]);
  }
  J[N][N] = 1;
  J[N + 1][0] = -3 / (2 * h); J[N + 1][1] = 4 / (2 * h); J[N + 1][2] = -1 / (2 * h);
  return J;
}

const norm = (v) => Math.sqrt(v.reduce((s, x) => s + x * x, 0));

/** Newton iteration with step halving. Returns { u, iterations, residual }. */
function newton(u0, N, gl, theta0, tol = 1e-11, maxIter = 40) {
  let u = u0.slice(), F = residual(u, N, gl, theta0), r = norm(F), iterations = 0;
  while (r > tol && iterations < maxIter) {
    const du = solveLinear(jacobian(u, N, gl), F.map((x) => -x));
    let lambda = 1, accepted = false;
    for (let k = 0; k < 20; k += 1) {
      const trial = u.map((x, i) => x + lambda * du[i]);
      const Ft = residual(trial, N, gl, theta0), rt = norm(Ft);
      if (Number.isFinite(rt) && rt < r) { u = trial; F = Ft; r = rt; accepted = true; break; }
      lambda /= 2;
    }
    iterations += 1;
    if (!accepted) break;
  }
  return { u, iterations, residual: r };
}

/** Arithmetic–geometric mean, used for the exact large-angle period. */
export function agm(a, b) {
  let x = a, y = b;
  for (let i = 0; i < 40 && Math.abs(x - y) > 1e-15 * x; i += 1) [x, y] = [(x + y) / 2, Math.sqrt(x * y)];
  return (x + y) / 2;
}

/** Exact period T = 2π √(L/g) / AGM(1, cos(θ0/2)) (complete elliptic integral of the first kind). */
export function exactPeriod(angleDeg, length, g = 9.81) {
  const theta0 = (angleDeg * Math.PI) / 180;
  return (2 * Math.PI * Math.sqrt(length / g)) / agm(1, Math.cos(theta0 / 2));
}

/**
 * Solve the pendulum BVP for release angle `angleDeg` (degrees) on N intervals.
 * Returns { theta (rad, length N+1), quarterPeriod, period, iterations, steps, residual, converged }.
 */
export function solvePendulumBVP({ angle, length, N = 120, g = 9.81 }) {
  const gl = g / length;
  const steps = Math.max(1, Math.ceil(angle / 15)); // continuation: ≤15° per stage
  let u = null, total = 0, last = null;
  for (let k = 1; k <= steps; k += 1) {
    const theta0 = ((angle * k) / steps) * (Math.PI / 180);
    if (!u) {
      u = Array.from({ length: N + 2 }, (_, i) => (i <= N ? theta0 * Math.cos((Math.PI / 2) * (i / N)) : (Math.PI / 2) / Math.sqrt(gl)));
    }
    last = newton(u, N, gl, theta0);
    u = last.u;
    total += last.iterations;
  }
  const tau = u[N + 1];
  return {
    theta: u.slice(0, N + 1), quarterPeriod: tau, period: 4 * tau, iterations: total, steps,
    residual: last.residual, converged: last.residual < 1e-8 && tau > 0,
  };
}

/**
 * Reconstruct θ(t) over [0, duration] from the quarter-period solution using the
 * symmetries of the pendulum: even about t=0 and odd about t=τ.
 * θ is linearly interpolated on the BVP mesh — adequate for plotting.
 */
export function bvpTrace(solution, duration, points = 600) {
  const { theta, quarterPeriod: tau } = solution, N = theta.length - 1, T = 4 * tau;
  const quarter = (t) => { // 0 ≤ t ≤ τ
    const x = (t / tau) * N, i = Math.min(N - 1, Math.floor(x)), f = x - i;
    return theta[i] * (1 - f) + theta[i + 1] * f;
  };
  const at = (t) => {
    const m = ((t % T) + T) % T;
    if (m <= tau) return quarter(m);
    if (m <= 2 * tau) return -quarter(2 * tau - m);
    if (m <= 3 * tau) return -quarter(m - 2 * tau);
    return quarter(T - m);
  };
  return Array.from({ length: points + 1 }, (_, k) => { const t = (duration * k) / points; return { time: t, theta: at(t) * (180 / Math.PI) }; });
}
