# -*- coding: utf-8 -*-
from __future__ import annotations

from pathlib import Path
import math
import numpy as np

import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt


RNG = np.random.default_rng(42)


def _save(fig, output_dir: Path, name: str = "visualization.png") -> Path:
    output_dir.mkdir(parents=True, exist_ok=True)
    path = output_dir / name
    fig.tight_layout()
    fig.savefig(path, dpi=160)
    plt.close(fig)
    print(f"saved: {path}")
    return path


def _style(ax, title: str | None = None) -> None:
    if title:
        ax.set_title(title)
    ax.grid(True, alpha=0.25)


def _normal_pdf(x, mu=0.0, sigma=1.0):
    return np.exp(-0.5 * ((x - mu) / sigma) ** 2) / (sigma * np.sqrt(2 * np.pi))


def _comb(n, k):
    if k < 0 or k > n:
        return 0
    return math.comb(int(n), int(k))


def calculus_limit(output_dir: Path):
    x = np.r_[np.linspace(-1.0, -0.04, 240), np.linspace(0.04, 1.0, 240)]
    y = np.sin(x) / x
    eps = [0.3, 0.15, 0.07]
    fig, ax = plt.subplots(figsize=(7, 4.5))
    ax.plot(x, y, label="sin(x)/x")
    ax.axhline(1, color="black", linestyle="--", linewidth=1, label="limit = 1")
    for e in eps:
        ax.fill_between(x, 1 - e, 1 + e, where=np.abs(x) < 0.35, alpha=0.08, label=f"epsilon={e}")
    ax.set_xlabel("x")
    ax.set_ylabel("value")
    _style(ax, "Limit by local zoom")
    ax.legend(fontsize=8)
    _save(fig, output_dir)


def calculus_derivative(output_dir: Path):
    f = lambda x: x**3 - x
    df = lambda x: 3 * x**2 - 1
    x0 = 0.8
    xs = np.linspace(-1.4, 1.4, 400)
    tangent = f(x0) + df(x0) * (xs - x0)
    h = np.logspace(-4, -0.2, 80)
    err = np.abs((f(x0 + h) - f(x0)) / h - df(x0))
    fig, axes = plt.subplots(1, 2, figsize=(10, 4))
    axes[0].plot(xs, f(xs), label="f(x)=x^3-x")
    axes[0].plot(xs, tangent, "--", label="tangent")
    axes[0].scatter([x0], [f(x0)], color="crimson")
    _style(axes[0], "Derivative as tangent")
    axes[0].legend(fontsize=8)
    axes[1].loglog(h, err)
    axes[1].set_xlabel("h")
    axes[1].set_ylabel("finite difference error")
    _style(axes[1], "Numerical derivative error")
    _save(fig, output_dir)


def calculus_integral(output_dir: Path):
    f = lambda x: 0.4 + np.sin(x) ** 2 + 0.15 * x
    xs = np.linspace(0, 6, 500)
    fig, axes = plt.subplots(1, 2, figsize=(10, 4))
    axes[0].plot(xs, f(xs), color="black")
    n = 18
    left = np.linspace(0, 6, n, endpoint=False)
    dx = 6 / n
    axes[0].bar(left, f(left), width=dx, align="edge", alpha=0.35, edgecolor="tab:blue", label="Riemann rectangles")
    axes[0].fill_between(xs, 0, f(xs), alpha=0.12)
    _style(axes[0], "Integral as accumulated area")
    axes[0].legend(fontsize=8)
    ns = np.arange(5, 151, 5)
    estimates = []
    for m in ns:
        left_m = np.linspace(0, 6, m, endpoint=False)
        estimates.append(np.sum(f(left_m)) * 6 / m)
    true_est = np.trapezoid(f(xs), xs)
    axes[1].plot(ns, estimates, label="left sum")
    axes[1].axhline(true_est, color="black", linestyle="--", label="fine-grid trapz")
    axes[1].set_xlabel("number of intervals")
    axes[1].set_ylabel("area")
    _style(axes[1], "Convergence of sums")
    axes[1].legend(fontsize=8)
    _save(fig, output_dir)


def calculus_series(output_dir: Path):
    xs = np.linspace(-2.5, 2.5, 500)
    fig, ax = plt.subplots(figsize=(7, 4.5))
    ax.plot(xs, np.sin(xs), color="black", label="sin(x)")
    for order in [1, 3, 5, 7]:
        approx = np.zeros_like(xs)
        for k in range((order + 1) // 2):
            approx += (-1) ** k * xs ** (2 * k + 1) / math.factorial(2 * k + 1)
        ax.plot(xs, approx, label=f"Taylor degree {order}")
    ax.set_ylim(-1.6, 1.6)
    _style(ax, "Taylor approximation")
    ax.legend(fontsize=8)
    _save(fig, output_dir)


def multivariable(output_dir: Path):
    x = np.linspace(-2.5, 2.5, 80)
    y = np.linspace(-2.5, 2.5, 80)
    X, Y = np.meshgrid(x, y)
    Z = X * np.exp(-X**2 - Y**2)
    dZdy, dZdx = np.gradient(Z, y, x)
    fig, ax = plt.subplots(figsize=(6, 5))
    cs = ax.contourf(X, Y, Z, levels=20, cmap="viridis")
    ax.quiver(X[::6, ::6], Y[::6, ::6], dZdx[::6, ::6], dZdy[::6, ::6], color="white", alpha=0.8)
    fig.colorbar(cs, ax=ax, shrink=0.8)
    ax.set_aspect("equal")
    _style(ax, "Contours and gradient field")
    _save(fig, output_dir)


def linear_algebra_transform(output_dir: Path):
    A = np.array([[1.2, 0.7], [-0.25, 0.9]])
    grid = np.linspace(-1, 1, 9)
    fig, axes = plt.subplots(1, 2, figsize=(9, 4))
    for g in grid:
        pts = np.vstack([np.full_like(grid, g), grid])
        img = A @ pts
        axes[0].plot(pts[0], pts[1], color="gray", alpha=0.5)
        axes[0].plot(pts[1], pts[0], color="gray", alpha=0.5)
        axes[1].plot(img[0], img[1], color="tab:blue", alpha=0.55)
        pts2 = np.vstack([grid, np.full_like(grid, g)])
        img2 = A @ pts2
        axes[1].plot(img2[0], img2[1], color="tab:orange", alpha=0.55)
    for ax, title in zip(axes, ["Original grid", "Transformed by matrix A"]):
        ax.set_aspect("equal")
        ax.set_xlim(-2.2, 2.2)
        ax.set_ylim(-2.2, 2.2)
        _style(ax, title)
    det = np.linalg.det(A)
    axes[1].text(-2.1, 1.85, f"det(A)={det:.2f}")
    _save(fig, output_dir)


def eigen_markov(output_dir: Path):
    P = np.array([[0.86, 0.10, 0.25], [0.10, 0.80, 0.20], [0.04, 0.10, 0.55]])
    state = np.array([1.0, 0.0, 0.0])
    history = [state]
    for _ in range(35):
        state = P @ state
        history.append(state)
    H = np.vstack(history)
    vals, vecs = np.linalg.eig(P)
    idx = np.argmin(np.abs(vals - 1))
    stationary = np.real(vecs[:, idx])
    stationary = stationary / stationary.sum()
    fig, axes = plt.subplots(1, 2, figsize=(10, 4))
    axes[0].plot(H)
    axes[0].set_xlabel("step")
    axes[0].set_ylabel("state probability")
    axes[0].legend(["A", "B", "C"], fontsize=8)
    _style(axes[0], "Markov chain convergence")
    axes[1].bar(["A", "B", "C"], stationary, color=["tab:blue", "tab:orange", "tab:green"])
    axes[1].set_ylim(0, 1)
    _style(axes[1], "Stationary distribution")
    _save(fig, output_dir)


def least_squares(output_dir: Path):
    x = np.linspace(0, 10, 35)
    y = 2.3 + 0.75 * x + RNG.normal(0, 1.0, size=x.size)
    A = np.c_[np.ones_like(x), x]
    beta, *_ = np.linalg.lstsq(A, y, rcond=None)
    pred = A @ beta
    fig, axes = plt.subplots(1, 2, figsize=(10, 4))
    axes[0].scatter(x, y, label="data")
    axes[0].plot(x, pred, color="crimson", label="least squares fit")
    _style(axes[0], "Least squares line")
    axes[0].legend(fontsize=8)
    axes[1].scatter(pred, y - pred)
    axes[1].axhline(0, color="black", linewidth=1)
    axes[1].set_xlabel("fitted value")
    axes[1].set_ylabel("residual")
    _style(axes[1], "Residual plot")
    _save(fig, output_dir)


def logic_truth(output_dir: Path):
    rows = []
    labels = ["P", "Q", "P=>Q", "Q=>P", "contrapositive"]
    for P in [False, True]:
        for Q in [False, True]:
            implies = (not P) or Q
            converse = (not Q) or P
            contra = (not Q) or (not P)
            rows.append([P, Q, implies, converse, contra])
    data = np.array(rows, dtype=int)
    fig, ax = plt.subplots(figsize=(7, 3.5))
    ax.imshow(data, cmap="Greens", vmin=0, vmax=1)
    ax.set_xticks(range(len(labels)), labels=labels, rotation=25, ha="right")
    ax.set_yticks(range(4), labels=["F,F", "F,T", "T,F", "T,T"])
    for i in range(data.shape[0]):
        for j in range(data.shape[1]):
            ax.text(j, i, str(data[i, j]), ha="center", va="center")
    _style(ax, "Truth table as a matrix")
    _save(fig, output_dir)


def set_relation(output_dir: Path):
    U = np.arange(1, 25)
    A = set(U[U % 2 == 0])
    B = {2, 3, 5, 7, 11, 13, 17, 19, 23}
    C = set(U[U % 3 == 0])
    sizes = [len(A), len(B), len(C), len(A & B), len(A | C), len((A | B) - C)]
    labels = ["A even", "B prime", "C mult3", "A∩B", "A∪C", "(A∪B)-C"]
    rel = np.zeros((len(U), len(U)))
    for i, a in enumerate(U):
        for j, b in enumerate(U):
            rel[i, j] = 1 if b % a == 0 else 0
    fig, axes = plt.subplots(1, 2, figsize=(10, 4))
    axes[0].bar(range(len(sizes)), sizes, color="tab:blue")
    axes[0].set_xticks(range(len(labels)), labels=labels, rotation=30, ha="right")
    axes[0].set_ylabel("count")
    _style(axes[0], "Set operation sizes")
    axes[1].imshow(rel, cmap="Blues")
    axes[1].set_title("Relation matrix: a divides b")
    axes[1].set_xlabel("b")
    axes[1].set_ylabel("a")
    _save(fig, output_dir)


def graph_paths(output_dir: Path):
    nodes = ["A", "B", "C", "D", "E", "F"]
    pos = {
        "A": (0, 0), "B": (1, 1.3), "C": (1, -1.0),
        "D": (2.4, 1.0), "E": (2.4, -0.9), "F": (3.6, 0),
    }
    edges = {
        "A": [("B", 2), ("C", 4)],
        "B": [("D", 3), ("E", 2)],
        "C": [("E", 1)],
        "D": [("F", 2)],
        "E": [("D", 1), ("F", 5)],
        "F": [],
    }
    dist = {n: float("inf") for n in nodes}
    dist["A"] = 0
    used = set()
    while len(used) < len(nodes):
        u = min((n for n in nodes if n not in used), key=lambda n: dist[n])
        used.add(u)
        for v, w in edges[u]:
            dist[v] = min(dist[v], dist[u] + w)
    fig, axes = plt.subplots(1, 2, figsize=(10, 4))
    ax = axes[0]
    for u, adj in edges.items():
        x1, y1 = pos[u]
        for v, w in adj:
            x2, y2 = pos[v]
            ax.plot([x1, x2], [y1, y2], color="gray")
            ax.text((x1 + x2) / 2, (y1 + y2) / 2, str(w), color="crimson")
    for n in nodes:
        x, y = pos[n]
        ax.scatter([x], [y], s=500, color="white", edgecolor="black", zorder=3)
        ax.text(x, y, n, ha="center", va="center", zorder=4)
    ax.axis("off")
    ax.set_title("Weighted network")
    axes[1].bar(dist.keys(), dist.values(), color="tab:green")
    axes[1].set_ylabel("distance from A")
    _style(axes[1], "Shortest path distances")
    _save(fig, output_dir)


def combinatorics(output_dir: Path):
    nmax = 12
    tri = np.zeros((nmax + 1, nmax + 1))
    for n in range(nmax + 1):
        for k in range(n + 1):
            tri[n, k] = _comb(n, k)
    n = 20
    p = 0.35
    ks = np.arange(n + 1)
    pmf = np.array([_comb(n, k) * p**k * (1 - p) ** (n - k) for k in ks])
    fig, axes = plt.subplots(1, 2, figsize=(10, 4))
    axes[0].imshow(np.ma.masked_where(tri == 0, tri), cmap="magma")
    axes[0].set_title("Pascal triangle")
    axes[1].bar(ks, pmf, color="tab:purple")
    axes[1].set_xlabel("k successes")
    axes[1].set_ylabel("probability")
    _style(axes[1], "Binomial counting model")
    _save(fig, output_dir)


def programming_error(output_dir: Path):
    f = np.sin
    df = np.cos
    x0 = 1.0
    h = np.logspace(-16, -1, 160)
    forward = np.abs((f(x0 + h) - f(x0)) / h - df(x0))
    central = np.abs((f(x0 + h) - f(x0 - h)) / (2 * h) - df(x0))
    fig, ax = plt.subplots(figsize=(7, 4.5))
    ax.loglog(h, forward, label="forward difference")
    ax.loglog(h, central, label="central difference")
    ax.set_xlabel("step size h")
    ax.set_ylabel("absolute error")
    _style(ax, "Truncation error vs roundoff error")
    ax.legend(fontsize=8)
    _save(fig, output_dir)


def probability_distribution(output_dir: Path):
    n, p = 30, 0.35
    samples = RNG.binomial(n, p, size=6000)
    ks = np.arange(n + 1)
    pmf = np.array([_comb(n, k) * p**k * (1 - p) ** (n - k) for k in ks])
    mu, sigma = n * p, math.sqrt(n * p * (1 - p))
    x = np.linspace(0, n, 400)
    fig, ax = plt.subplots(figsize=(7, 4.5))
    ax.hist(samples, bins=np.arange(n + 2) - 0.5, density=True, alpha=0.35, label="simulation")
    ax.plot(ks, pmf, "o-", label="binomial pmf")
    ax.plot(x, _normal_pdf(x, mu, sigma), label="normal approximation")
    ax.set_xlabel("success count")
    ax.set_ylabel("probability")
    _style(ax, "Distribution: simulation and formula")
    ax.legend(fontsize=8)
    _save(fig, output_dir)


def clt(output_dir: Path):
    n_values = [1, 3, 10, 40]
    fig, axes = plt.subplots(2, 2, figsize=(9, 6))
    axes = axes.ravel()
    for ax, n in zip(axes, n_values):
        means = RNG.exponential(scale=1.0, size=(6000, n)).mean(axis=1)
        ax.hist(means, bins=40, density=True, alpha=0.55, color="tab:blue")
        mu, sigma = 1.0, 1 / math.sqrt(n)
        x = np.linspace(means.min(), means.max(), 300)
        ax.plot(x, _normal_pdf(x, mu, sigma), color="crimson")
        _style(ax, f"sample size n={n}")
    _save(fig, output_dir)


def bayes_coin(output_dir: Path):
    successes = np.array([0, 1, 1, 0, 1, 1, 1, 0, 1, 1])
    alpha, beta = 2, 2
    x = np.linspace(0.001, 0.999, 400)
    fig, ax = plt.subplots(figsize=(7, 4.5))
    for i in [0, 2, 5, 10]:
        a = alpha + successes[:i].sum()
        b = beta + i - successes[:i].sum()
        log_pdf = (a - 1) * np.log(x) + (b - 1) * np.log(1 - x)
        pdf = np.exp(log_pdf - log_pdf.max())
        pdf = pdf / np.trapezoid(pdf, x)
        ax.plot(x, pdf, label=f"after {i} tosses")
    ax.set_xlabel("coin bias theta")
    ax.set_ylabel("posterior density")
    _style(ax, "Bayesian updating")
    ax.legend(fontsize=8)
    _save(fig, output_dir)


def distribution_inference(output_dir: Path):
    true_mu = 3.0
    sigma = 1.2
    ns = np.array([5, 10, 20, 40, 80, 160])
    means = []
    ci = []
    for n in ns:
        data = RNG.normal(true_mu, sigma, size=(500, n))
        m = data.mean(axis=1)
        means.append(m.mean())
        ci.append(1.96 * sigma / math.sqrt(n))
    fig, axes = plt.subplots(1, 2, figsize=(10, 4))
    axes[0].errorbar(ns, means, yerr=ci, fmt="o-", capsize=4)
    axes[0].axhline(true_mu, color="black", linestyle="--")
    axes[0].set_xscale("log")
    axes[0].set_xlabel("sample size")
    axes[0].set_ylabel("estimated mean")
    _style(axes[0], "Confidence interval shrinks")
    a = RNG.normal(0.0, 1.0, 50)
    b = RNG.normal(0.35, 1.0, 50)
    observed = b.mean() - a.mean()
    pooled = np.r_[a, b]
    diffs = []
    for _ in range(1000):
        perm = RNG.permutation(pooled)
        diffs.append(perm[50:].mean() - perm[:50].mean())
    axes[1].hist(diffs, bins=35, alpha=0.65)
    axes[1].axvline(observed, color="crimson", linewidth=2, label="observed")
    _style(axes[1], "Permutation test")
    axes[1].legend(fontsize=8)
    _save(fig, output_dir)


def real_sequence(output_dir: Path):
    n = np.arange(1, 101)
    seq = 1 - 1 / n
    partial = np.cumsum(1 / n**2)
    x = np.linspace(-1, 1, 300)
    functions = [(x**2 + 1 / k) for k in [1, 2, 5, 20]]
    fig, axes = plt.subplots(1, 2, figsize=(10, 4))
    axes[0].plot(n, seq, label="1-1/n")
    axes[0].plot(n, partial, label="sum 1/n^2")
    axes[0].set_xlabel("n")
    _style(axes[0], "Sequence and partial sums")
    axes[0].legend(fontsize=8)
    for y, k in zip(functions, [1, 2, 5, 20]):
        axes[1].plot(x, y, label=f"k={k}")
    axes[1].plot(x, x**2, color="black", linestyle="--", label="limit")
    _style(axes[1], "Uniform-looking convergence")
    axes[1].legend(fontsize=8)
    _save(fig, output_dir)


def epsilon_delta(output_dir: Path):
    f = lambda x: x**2
    x0 = 1.0
    L = f(x0)
    eps = 0.25
    delta = min(0.5, eps / (2 * abs(x0) + 1))
    xs = np.linspace(0.2, 1.8, 400)
    fig, ax = plt.subplots(figsize=(7, 4.5))
    ax.plot(xs, f(xs), label="f(x)=x^2")
    ax.axhspan(L - eps, L + eps, color="tab:green", alpha=0.18, label="epsilon band")
    ax.axvspan(x0 - delta, x0 + delta, color="tab:blue", alpha=0.12, label="delta neighborhood")
    ax.scatter([x0], [L], color="crimson")
    ax.set_xlabel("x")
    ax.set_ylabel("f(x)")
    _style(ax, "epsilon-delta neighborhood")
    ax.legend(fontsize=8)
    _save(fig, output_dir)


def metric_space(output_dir: Path):
    pts = RNG.normal(size=(80, 2))
    center = np.array([0.25, -0.15])
    d = np.linalg.norm(pts - center, axis=1)
    r = 1.0
    z = np.array([2.5, 1.2])
    fixed = []
    for _ in range(30):
        z = 0.55 * z + np.array([0.2, -0.1])
        fixed.append(z.copy())
    fixed = np.vstack(fixed)
    fig, axes = plt.subplots(1, 2, figsize=(10, 4))
    axes[0].scatter(pts[:, 0], pts[:, 1], c=d < r, cmap="coolwarm", edgecolor="black", linewidth=0.2)
    circle = plt.Circle(center, r, fill=False, color="black", linestyle="--")
    axes[0].add_patch(circle)
    axes[0].set_aspect("equal")
    _style(axes[0], "Open ball in a metric space")
    axes[1].plot(fixed[:, 0], fixed[:, 1], "o-")
    axes[1].scatter([0.2 / 0.45], [-0.1 / 0.45], color="crimson", label="fixed point")
    axes[1].set_aspect("equal")
    _style(axes[1], "Contraction to fixed point")
    axes[1].legend(fontsize=8)
    _save(fig, output_dir)


def ode_logistic(output_dir: Path):
    r, K = 1.1, 10.0
    t = np.linspace(0, 8, 400)
    y0 = 0.8
    exact = K / (1 + (K / y0 - 1) * np.exp(-r * t))
    dt = 0.2
    ts = np.arange(0, 8 + dt, dt)
    y = np.zeros_like(ts)
    y[0] = y0
    for i in range(len(ts) - 1):
        y[i + 1] = y[i] + dt * r * y[i] * (1 - y[i] / K)
    T, Y = np.meshgrid(np.linspace(0, 8, 20), np.linspace(0, 12, 20))
    S = r * Y * (1 - Y / K)
    fig, ax = plt.subplots(figsize=(7, 4.5))
    ax.quiver(T, Y, np.ones_like(S), S, alpha=0.35)
    ax.plot(t, exact, label="exact")
    ax.plot(ts, y, "o--", label="Euler")
    ax.set_xlabel("time")
    ax.set_ylabel("population")
    _style(ax, "Logistic ODE")
    ax.legend(fontsize=8)
    _save(fig, output_dir)


def ode_phase(output_dir: Path):
    x = np.linspace(-3, 3, 22)
    y = np.linspace(-3, 3, 22)
    X, Y = np.meshgrid(x, y)
    U = Y
    V = -0.8 * X - 0.25 * Y
    fig, ax = plt.subplots(figsize=(6, 5))
    ax.streamplot(X, Y, U, V, density=1.0, color=np.sqrt(U**2 + V**2), cmap="viridis")
    ax.scatter([0], [0], color="crimson")
    ax.set_aspect("equal")
    _style(ax, "Phase portrait")
    _save(fig, output_dir)


def group_table(output_dir: Path):
    n = 8
    table = np.fromfunction(lambda i, j: (i + j) % n, (n, n), dtype=int)
    fig, ax = plt.subplots(figsize=(5, 4.5))
    ax.imshow(table, cmap="tab20")
    ax.set_xticks(range(n))
    ax.set_yticks(range(n))
    for i in range(n):
        for j in range(n):
            ax.text(j, i, int(table[i, j]), ha="center", va="center", fontsize=8)
    ax.set_xlabel("b")
    ax.set_ylabel("a")
    _style(ax, "Cayley table for addition mod 8")
    _save(fig, output_dir)


def ring_polynomial(output_dir: Path):
    x = np.linspace(-2.5, 2.5, 500)
    y = x**3 - x - 1
    mods = [2, 3, 5, 7]
    roots = {p: [a for a in range(p) if (a**3 - a - 1) % p == 0] for p in mods}
    fig, axes = plt.subplots(1, 2, figsize=(10, 4))
    axes[0].plot(x, y)
    axes[0].axhline(0, color="black", linewidth=1)
    _style(axes[0], "Polynomial over real numbers")
    counts = [len(roots[p]) for p in mods]
    axes[1].bar([str(p) for p in mods], counts, color="tab:orange")
    for idx, p in enumerate(mods):
        axes[1].text(idx, counts[idx] + 0.05, str(roots[p]), ha="center")
    axes[1].set_xlabel("mod p")
    axes[1].set_ylabel("number of roots")
    _style(axes[1], "Roots over finite fields")
    _save(fig, output_dir)


def finite_field(output_dir: Path):
    p = 11
    mult = np.fromfunction(lambda i, j: (i * j) % p, (p, p), dtype=int)
    inverses = [next((b for b in range(1, p) if (a * b) % p == 1), 0) for a in range(1, p)]
    fig, axes = plt.subplots(1, 2, figsize=(10, 4))
    axes[0].imshow(mult, cmap="viridis")
    axes[0].set_title("Multiplication mod 11")
    axes[0].set_xlabel("b")
    axes[0].set_ylabel("a")
    axes[1].bar(range(1, p), inverses, color="tab:green")
    axes[1].set_xlabel("a")
    axes[1].set_ylabel("inverse of a")
    _style(axes[1], "Multiplicative inverses")
    _save(fig, output_dir)


def geometry_curve(output_dir: Path):
    t = np.linspace(0, 2 * np.pi, 600)
    x = np.cos(t) + 0.35 * np.cos(3 * t)
    y = np.sin(t) - 0.35 * np.sin(3 * t)
    dx = np.gradient(x, t)
    dy = np.gradient(y, t)
    ddx = np.gradient(dx, t)
    ddy = np.gradient(dy, t)
    curvature = np.abs(dx * ddy - dy * ddx) / (dx**2 + dy**2) ** 1.5
    fig, ax = plt.subplots(figsize=(6, 5))
    sc = ax.scatter(x, y, c=curvature, cmap="plasma", s=8)
    fig.colorbar(sc, ax=ax, label="curvature")
    ax.set_aspect("equal")
    _style(ax, "Parametric curve colored by curvature")
    _save(fig, output_dir)


def complex_map(output_dir: Path):
    lines = []
    vals = np.linspace(-1.2, 1.2, 13)
    t = np.linspace(-1.2, 1.2, 200)
    for a in vals:
        lines.append(t + 1j * a)
        lines.append(a + 1j * t)
    fig, axes = plt.subplots(1, 2, figsize=(10, 4))
    for z in lines:
        axes[0].plot(z.real, z.imag, color="gray", alpha=0.45)
        w = z**2
        axes[1].plot(w.real, w.imag, color="tab:blue", alpha=0.45)
    for ax, title in zip(axes, ["z-plane grid", "image under w=z^2"]):
        ax.set_aspect("equal")
        _style(ax, title)
    _save(fig, output_dir)


def contour_integral(output_dir: Path):
    theta = np.linspace(0, 2 * np.pi, 300)
    circle = np.exp(1j * theta)
    x = np.linspace(-2, 2, 25)
    y = np.linspace(-2, 2, 25)
    X, Y = np.meshgrid(x, y)
    R2 = X**2 + Y**2
    R2[R2 < 0.12] = np.nan
    U = -Y / R2
    V = X / R2
    fig, ax = plt.subplots(figsize=(6, 5))
    ax.streamplot(X, Y, U, V, density=1.2, color="tab:blue")
    ax.plot(circle.real, circle.imag, color="crimson", linewidth=2, label="contour")
    ax.scatter([0], [0], color="black", s=25, label="singularity")
    ax.set_aspect("equal")
    _style(ax, "Circulation around a singularity")
    ax.legend(fontsize=8)
    _save(fig, output_dir)


def topology_space(output_dir: Path):
    t = np.linspace(0, 2 * np.pi, 400)
    circle = np.c_[np.cos(t), np.sin(t)]
    deformed = np.c_[1.4 * np.cos(t), 0.65 * np.sin(t) + 0.12 * np.sin(3 * t)]
    fig, axes = plt.subplots(1, 2, figsize=(10, 4))
    axes[0].plot(circle[:, 0], circle[:, 1], label="circle")
    axes[0].plot(deformed[:, 0], deformed[:, 1], label="deformed")
    axes[0].set_aspect("equal")
    _style(axes[0], "Continuous deformation")
    axes[0].legend(fontsize=8)
    xs = np.linspace(0, 1, 15)
    ys = np.linspace(0, 1, 15)
    for x in xs:
        axes[1].plot([x, x], [0, 1], color="gray", alpha=0.25)
    for y in ys:
        axes[1].plot([0, 1], [y, y], color="gray", alpha=0.25)
    axes[1].annotate("", xy=(1, 0.5), xytext=(0, 0.5), arrowprops=dict(arrowstyle="<->", color="crimson"))
    axes[1].annotate("", xy=(0.5, 1), xytext=(0.5, 0), arrowprops=dict(arrowstyle="<->", color="crimson"))
    axes[1].set_aspect("equal")
    axes[1].set_title("Opposite edges identified")
    axes[1].axis("off")
    _save(fig, output_dir)


def measure_integral(output_dir: Path):
    x = np.linspace(0, 1, 800)
    f = np.where(x < 0.2, 0.5, np.where(x < 0.65, 1.6, 0.8))
    fine = np.sin(24 * x) * 0.15 + f
    thresholds = np.linspace(0, fine.max(), 80)
    layer_lengths = np.array([(fine > y).mean() for y in thresholds])
    fig, axes = plt.subplots(1, 2, figsize=(10, 4))
    axes[0].plot(x, fine)
    axes[0].fill_between(x, 0, fine, alpha=0.25)
    _style(axes[0], "Function and area")
    axes[1].plot(thresholds, layer_lengths)
    axes[1].fill_between(thresholds, 0, layer_lengths, alpha=0.25)
    axes[1].set_xlabel("level y")
    axes[1].set_ylabel("measure of {f>y}")
    _style(axes[1], "Layer-cake view of integral")
    _save(fig, output_dir)


def pde_heat(output_dir: Path):
    nx = 80
    nt = 260
    alpha = 0.45
    u = np.exp(-140 * (np.linspace(0, 1, nx) - 0.35) ** 2)
    history = [u.copy()]
    for _ in range(nt):
        u[1:-1] = u[1:-1] + alpha * (u[:-2] - 2 * u[1:-1] + u[2:])
        u[0] = u[-1] = 0
        if _ % 8 == 0:
            history.append(u.copy())
    H = np.vstack(history)
    fig, axes = plt.subplots(1, 2, figsize=(10, 4))
    axes[0].imshow(H, aspect="auto", cmap="inferno", origin="lower")
    axes[0].set_xlabel("space")
    axes[0].set_ylabel("time snapshot")
    axes[0].set_title("Heat diffusion")
    for idx in [0, len(H)//4, len(H)//2, -1]:
        axes[1].plot(np.linspace(0, 1, nx), H[idx], label=f"step {idx}")
    _style(axes[1], "Temperature profiles")
    axes[1].legend(fontsize=8)
    _save(fig, output_dir)


def pde_wave(output_dir: Path):
    nx = 120
    nt = 260
    cfl = 0.9
    x = np.linspace(0, 1, nx)
    u_prev = np.exp(-200 * (x - 0.35) ** 2)
    u = u_prev.copy()
    frames = [u.copy()]
    for step in range(nt):
        u_next = np.zeros_like(u)
        u_next[1:-1] = 2 * u[1:-1] - u_prev[1:-1] + cfl**2 * (u[:-2] - 2 * u[1:-1] + u[2:])
        u_prev, u = u, u_next
        if step % 8 == 0:
            frames.append(u.copy())
    H = np.vstack(frames)
    fig, axes = plt.subplots(1, 2, figsize=(10, 4))
    axes[0].imshow(H, aspect="auto", cmap="RdBu", origin="lower")
    axes[0].set_title("Wave propagation")
    axes[0].set_xlabel("space")
    axes[0].set_ylabel("time snapshot")
    for idx in [0, len(H)//3, 2*len(H)//3, -1]:
        axes[1].plot(x, H[idx], label=f"step {idx}")
    _style(axes[1], "String displacement")
    axes[1].legend(fontsize=8)
    _save(fig, output_dir)


def numerical_root(output_dir: Path):
    f = lambda x: np.cos(x) - x
    df = lambda x: -np.sin(x) - 1
    xs = np.linspace(0, 1.2, 400)
    xk = 1.1
    seq = [xk]
    for _ in range(6):
        xk = xk - f(xk) / df(xk)
        seq.append(xk)
    fig, axes = plt.subplots(1, 2, figsize=(10, 4))
    axes[0].plot(xs, f(xs))
    axes[0].axhline(0, color="black", linewidth=1)
    axes[0].scatter(seq, f(np.array(seq)), color="crimson")
    _style(axes[0], "Newton iterates")
    errors = np.abs(np.array(seq) - seq[-1])
    axes[1].semilogy(errors + 1e-16, "o-")
    axes[1].set_xlabel("iteration")
    axes[1].set_ylabel("error")
    _style(axes[1], "Convergence")
    _save(fig, output_dir)


def numerical_interpolation(output_dir: Path):
    f = lambda x: 1 / (1 + 25 * x**2)
    xx = np.linspace(-1, 1, 500)
    fig, ax = plt.subplots(figsize=(7, 4.5))
    ax.plot(xx, f(xx), color="black", label="Runge function")
    for n in [5, 9, 13]:
        xp = np.linspace(-1, 1, n)
        coef = np.polyfit(xp, f(xp), deg=n - 1)
        ax.plot(xx, np.polyval(coef, xx), label=f"degree {n-1}")
        ax.scatter(xp, f(xp), s=12)
    ax.set_ylim(-0.5, 1.4)
    _style(ax, "Polynomial interpolation")
    ax.legend(fontsize=8)
    _save(fig, output_dir)


def numerical_linear(output_dir: Path):
    sizes = np.arange(2, 15)
    conds = []
    for n in sizes:
        H = np.array([[1 / (i + j + 1) for j in range(n)] for i in range(n)])
        conds.append(np.linalg.cond(H))
    A = np.array([[4, -1, 0], [-1, 4, -1], [0, -1, 3]], dtype=float)
    b = np.array([15, 10, 10], dtype=float)
    x = np.zeros(3)
    hist = []
    for _ in range(25):
        x_new = x.copy()
        for i in range(3):
            x_new[i] = (b[i] - np.dot(A[i], x_new) + A[i, i] * x_new[i]) / A[i, i]
        x = x_new
        hist.append(np.linalg.norm(A @ x - b))
    fig, axes = plt.subplots(1, 2, figsize=(10, 4))
    axes[0].semilogy(sizes, conds, "o-")
    axes[0].set_xlabel("Hilbert matrix size")
    axes[0].set_ylabel("condition number")
    _style(axes[0], "Ill-conditioning")
    axes[1].semilogy(hist, "o-")
    axes[1].set_xlabel("iteration")
    axes[1].set_ylabel("residual norm")
    _style(axes[1], "Gauss-Seidel residual")
    _save(fig, output_dir)


def optimization_gradient(output_dir: Path):
    f = lambda x, y: (x - 1.2) ** 2 + 2 * (y + 0.5) ** 2 + 0.3 * x * y
    grad = lambda v: np.array([2 * (v[0] - 1.2) + 0.3 * v[1], 4 * (v[1] + 0.5) + 0.3 * v[0]])
    starts = [np.array([-2.2, 2.0]), np.array([2.2, 1.6])]
    X, Y = np.meshgrid(np.linspace(-3, 3, 120), np.linspace(-3, 3, 120))
    Z = f(X, Y)
    fig, ax = plt.subplots(figsize=(6, 5))
    ax.contour(X, Y, Z, levels=25, cmap="viridis")
    for s in starts:
        v = s.copy()
        path = [v.copy()]
        for _ in range(35):
            v = v - 0.12 * grad(v)
            path.append(v.copy())
        P = np.vstack(path)
        ax.plot(P[:, 0], P[:, 1], "o-", markersize=3)
    ax.set_aspect("equal")
    _style(ax, "Gradient descent paths")
    _save(fig, output_dir)


def linear_programming(output_dir: Path):
    x = np.linspace(0, 8, 300)
    y1 = (10 - x) / 2
    y2 = 6 - x
    y3 = np.full_like(x, 3.5)
    feasible_top = np.minimum(np.minimum(y1, y2), y3)
    feasible_top = np.maximum(feasible_top, 0)
    objective = lambda x, y: 3 * x + 4 * y
    vertices = np.array([[0, 0], [0, 3.5], [3, 3], [6, 0]])
    vals = objective(vertices[:, 0], vertices[:, 1])
    best = vertices[np.argmax(vals)]
    fig, ax = plt.subplots(figsize=(6, 5))
    ax.fill_between(x, 0, feasible_top, where=feasible_top >= 0, alpha=0.25, label="feasible region")
    ax.plot(x, y1, label="x+2y<=10")
    ax.plot(x, y2, label="x+y<=6")
    ax.axhline(3.5, label="y<=3.5")
    ax.scatter(vertices[:, 0], vertices[:, 1], color="black")
    ax.scatter([best[0]], [best[1]], color="crimson", s=80, label="best vertex")
    ax.set_xlim(0, 8)
    ax.set_ylim(0, 6)
    _style(ax, "Linear programming in 2D")
    ax.legend(fontsize=8)
    _save(fig, output_dir)


def fourier_series(output_dir: Path):
    x = np.linspace(-np.pi, np.pi, 900)
    target = np.sign(np.sin(x))
    fig, axes = plt.subplots(1, 2, figsize=(10, 4))
    axes[0].plot(x, target, color="black", label="square wave")
    for terms in [1, 3, 9, 25]:
        approx = np.zeros_like(x)
        for k in range(terms):
            n = 2 * k + 1
            approx += (4 / np.pi) * np.sin(n * x) / n
        axes[0].plot(x, approx, label=f"{terms} odd terms")
    _style(axes[0], "Fourier series approximation")
    axes[0].legend(fontsize=7)
    signal = np.sin(3 * x) + 0.45 * np.sin(9 * x) + 0.2 * RNG.normal(size=x.size)
    freq = np.fft.rfftfreq(x.size, d=(x[1] - x[0]))
    amp = np.abs(np.fft.rfft(signal))
    axes[1].plot(freq[:80], amp[:80])
    axes[1].set_xlabel("frequency")
    axes[1].set_ylabel("amplitude")
    _style(axes[1], "Frequency spectrum")
    _save(fig, output_dir)


def functional_projection(output_dir: Path):
    x = np.linspace(0, 1, 500)
    f = x * (1 - x) + 0.08 * np.sin(10 * np.pi * x)
    basis = [np.sqrt(2) * np.sin(k * np.pi * x) for k in range(1, 5)]
    coeffs = [np.trapezoid(f * b, x) for b in basis]
    proj = sum(c * b for c, b in zip(coeffs, basis))
    fig, axes = plt.subplots(1, 2, figsize=(10, 4))
    axes[0].plot(x, f, label="function")
    axes[0].plot(x, proj, label="projection")
    _style(axes[0], "Projection onto finite basis")
    axes[0].legend(fontsize=8)
    axes[1].bar(range(1, 5), coeffs, color="tab:orange")
    axes[1].set_xlabel("basis index")
    axes[1].set_ylabel("coefficient")
    _style(axes[1], "Hilbert coefficients")
    _save(fig, output_dir)


def commutative_algebra(output_dir: Path):
    x = np.linspace(-2, 2, 500)
    X, Y = np.meshgrid(np.linspace(-2, 2, 300), np.linspace(-2, 2, 300))
    F = Y**2 - X**3 + X
    G = X**2 + Y**2 - 1
    fig, axes = plt.subplots(1, 2, figsize=(10, 4))
    axes[0].contour(X, Y, F, levels=[0], colors="tab:blue")
    axes[0].contour(X, Y, G, levels=[0], colors="crimson")
    axes[0].set_aspect("equal")
    _style(axes[0], "Polynomial zero sets")
    axes[1].plot(x, x**3 - x, label="y=x^3-x")
    axes[1].plot(x, np.sqrt(np.maximum(0, 1 - x**2)), color="crimson", label="unit circle upper")
    axes[1].plot(x, -np.sqrt(np.maximum(0, 1 - x**2)), color="crimson")
    axes[1].set_ylim(-2, 2)
    _style(axes[1], "Varieties as constraints")
    axes[1].legend(fontsize=8)
    _save(fig, output_dir)


def galois_roots(output_dir: Path):
    roots = np.roots([1, 0, 0, 0, -2])
    unit = np.exp(2j * np.pi * np.arange(4) / 4)
    fig, axes = plt.subplots(1, 2, figsize=(10, 4))
    axes[0].scatter(roots.real, roots.imag, s=80, color="tab:blue")
    for r in roots:
        axes[0].plot([0, r.real], [0, r.imag], color="gray", alpha=0.5)
    axes[0].set_aspect("equal")
    _style(axes[0], "Roots of x^4-2")
    axes[1].scatter(unit.real, unit.imag, s=80, color="tab:orange")
    for z in unit:
        axes[1].annotate("", xy=(z.real, z.imag), xytext=(0, 0), arrowprops=dict(arrowstyle="->", alpha=0.5))
    axes[1].set_aspect("equal")
    _style(axes[1], "Symmetry by roots of unity")
    _save(fig, output_dir)


def riemann_geometry(output_dir: Path):
    u = np.linspace(0, 2 * np.pi, 60)
    v = np.linspace(0.05, np.pi - 0.05, 30)
    U, V = np.meshgrid(u, v)
    X = np.cos(U) * np.sin(V)
    Y = np.sin(U) * np.sin(V)
    Z = np.cos(V)
    theta = np.linspace(0, 2 * np.pi, 300)
    fig = plt.figure(figsize=(10, 4))
    ax1 = fig.add_subplot(1, 2, 1, projection="3d")
    ax1.plot_wireframe(X, Y, Z, color="gray", alpha=0.35, linewidth=0.5)
    ax1.plot(np.cos(theta), np.sin(theta), 0 * theta, color="crimson", linewidth=2, label="great circle")
    ax1.set_title("Sphere and a geodesic")
    ax1.set_box_aspect((1, 1, 1))
    ax2 = fig.add_subplot(1, 2, 2)
    lat = [0, np.pi / 6, np.pi / 3]
    for phi in lat:
        ax2.plot(theta, np.sin(phi) * theta, label=f"latitude {phi:.2f}")
    _style(ax2, "Metric changes with latitude")
    ax2.legend(fontsize=8)
    _save(fig, output_dir)


def algebraic_topology(output_dir: Path):
    vertices = np.array([[0, 0], [1, 0], [0.5, 0.9], [2, 0], [3, 0], [2.5, 0.9]])
    edges = [(0, 1), (1, 2), (2, 0), (3, 4), (4, 5), (5, 3), (1, 3), (2, 5)]
    faces = [(0, 1, 2)]
    V = len(vertices)
    E = len(edges)
    F = len(faces)
    euler = V - E + F
    fig, axes = plt.subplots(1, 2, figsize=(10, 4))
    ax = axes[0]
    for face in faces:
        tri = vertices[list(face)]
        ax.fill(tri[:, 0], tri[:, 1], alpha=0.25, color="tab:blue")
    for i, j in edges:
        ax.plot(vertices[[i, j], 0], vertices[[i, j], 1], color="black")
    ax.scatter(vertices[:, 0], vertices[:, 1], color="crimson", zorder=3)
    ax.set_aspect("equal")
    ax.axis("off")
    ax.set_title("Simplicial complex")
    axes[1].bar(["V", "E", "F", "chi"], [V, E, F, euler], color=["tab:blue", "tab:orange", "tab:green", "tab:red"])
    _style(axes[1], "Euler characteristic")
    _save(fig, output_dir)


def stochastic_process(output_dir: Path):
    steps = RNG.normal(size=(12, 400))
    walks = np.cumsum(steps, axis=1)
    rate = 2.0
    inter = RNG.exponential(1 / rate, size=80)
    arrivals = np.cumsum(inter)
    arrivals = arrivals[arrivals < 20]
    fig, axes = plt.subplots(1, 2, figsize=(10, 4))
    axes[0].plot(walks.T, alpha=0.6)
    axes[0].set_xlabel("time")
    axes[0].set_ylabel("position")
    _style(axes[0], "Random walks")
    axes[1].step(np.r_[0, arrivals], np.arange(len(arrivals) + 1), where="post")
    axes[1].set_xlabel("time")
    axes[1].set_ylabel("event count")
    _style(axes[1], "Poisson process sample path")
    _save(fig, output_dir)


def regression(output_dir: Path):
    x = np.linspace(0, 8, 70)
    y = 1.5 + 0.9 * x + 0.25 * (x - 4) ** 2 + RNG.normal(0, 1.0, size=x.size)
    A1 = np.c_[np.ones_like(x), x]
    A2 = np.c_[np.ones_like(x), x, x**2]
    b1, *_ = np.linalg.lstsq(A1, y, rcond=None)
    b2, *_ = np.linalg.lstsq(A2, y, rcond=None)
    pred1 = A1 @ b1
    pred2 = A2 @ b2
    fig, axes = plt.subplots(1, 2, figsize=(10, 4))
    axes[0].scatter(x, y, s=18, alpha=0.7)
    axes[0].plot(x, pred1, label="linear")
    axes[0].plot(x, pred2, label="quadratic")
    _style(axes[0], "Regression fit")
    axes[0].legend(fontsize=8)
    axes[1].scatter(pred1, y - pred1, label="linear residuals")
    axes[1].axhline(0, color="black", linewidth=1)
    _style(axes[1], "Residual diagnostics")
    axes[1].legend(fontsize=8)
    _save(fig, output_dir)


def bayesian_statistics(output_dir: Path):
    alpha, beta = 3, 7
    successes, trials = 18, 30
    post_a, post_b = alpha + successes, beta + trials - successes
    theta = np.linspace(0.001, 0.999, 500)
    def beta_shape(a, b):
        log_pdf = (a - 1) * np.log(theta) + (b - 1) * np.log(1 - theta)
        pdf = np.exp(log_pdf - log_pdf.max())
        return pdf / np.trapezoid(pdf, theta)
    predictive = RNG.beta(post_a, post_b, size=5000)
    future = RNG.binomial(20, predictive)
    fig, axes = plt.subplots(1, 2, figsize=(10, 4))
    axes[0].plot(theta, beta_shape(alpha, beta), label="prior")
    axes[0].plot(theta, beta_shape(post_a, post_b), label="posterior")
    _style(axes[0], "Bayesian posterior")
    axes[0].legend(fontsize=8)
    axes[1].hist(future, bins=np.arange(22) - 0.5, density=True, alpha=0.65)
    axes[1].set_xlabel("future successes out of 20")
    _style(axes[1], "Posterior predictive")
    _save(fig, output_dir)


def math_physics(output_dir: Path):
    t = np.linspace(0, 20, 800)
    gamma = 0.08
    omega = 1.2
    x = np.exp(-gamma * t) * np.cos(omega * t)
    v = np.gradient(x, t)
    energy = 0.5 * (v**2 + omega**2 * x**2)
    fig, axes = plt.subplots(1, 2, figsize=(10, 4))
    axes[0].plot(t, x, label="position")
    axes[0].plot(t, v, label="velocity", alpha=0.7)
    _style(axes[0], "Damped oscillator")
    axes[0].legend(fontsize=8)
    axes[1].plot(t, energy, color="crimson")
    axes[1].set_xlabel("time")
    axes[1].set_ylabel("energy")
    _style(axes[1], "Energy decay")
    _save(fig, output_dir)


def computational_math(output_dir: Path):
    n = 6000
    pts = RNG.uniform(-1, 1, size=(n, 2))
    inside = np.sum(pts**2, axis=1) <= 1
    estimates = 4 * np.cumsum(inside) / np.arange(1, n + 1)
    fig, axes = plt.subplots(1, 2, figsize=(10, 4))
    axes[0].scatter(pts[:1200, 0], pts[:1200, 1], c=inside[:1200], cmap="coolwarm", s=6)
    axes[0].set_aspect("equal")
    _style(axes[0], "Monte Carlo area samples")
    axes[1].plot(estimates)
    axes[1].axhline(np.pi, color="black", linestyle="--", label="pi")
    axes[1].set_xlabel("samples")
    axes[1].set_ylabel("estimate")
    _style(axes[1], "Convergence of estimate")
    axes[1].legend(fontsize=8)
    _save(fig, output_dir)


def financial_math(output_dir: Path):
    s0, mu, sigma, T = 100, 0.06, 0.22, 1
    n_steps = 252
    dt = T / n_steps
    paths = np.zeros((40, n_steps + 1))
    paths[:, 0] = s0
    for t in range(n_steps):
        z = RNG.normal(size=paths.shape[0])
        paths[:, t + 1] = paths[:, t] * np.exp((mu - 0.5 * sigma**2) * dt + sigma * np.sqrt(dt) * z)
    K = 105
    ST = paths[:, -1]
    call = np.maximum(ST - K, 0)
    fig, axes = plt.subplots(1, 2, figsize=(10, 4))
    axes[0].plot(paths.T, alpha=0.45)
    axes[0].axhline(K, color="crimson", linestyle="--", label="strike")
    _style(axes[0], "Simulated price paths")
    axes[0].legend(fontsize=8)
    axes[1].hist(call, bins=20, alpha=0.7, color="tab:green")
    axes[1].set_xlabel("call payoff")
    _style(axes[1], "Option payoff distribution")
    _save(fig, output_dir)


def machine_learning_math(output_dir: Path):
    cov = np.array([[2.2, 1.2], [1.2, 0.9]])
    data = RNG.multivariate_normal([0, 0], cov, size=240)
    C = np.cov(data.T)
    vals, vecs = np.linalg.eigh(C)
    pc = vecs[:, np.argmax(vals)]
    w = np.array([-2.0, 1.5])
    b = 0.0
    labels = (data[:, 0] + 0.7 * data[:, 1] > 0).astype(float)
    losses = []
    for _ in range(80):
        z = data @ w + b
        p = 1 / (1 + np.exp(-z))
        losses.append(-np.mean(labels * np.log(p + 1e-9) + (1 - labels) * np.log(1 - p + 1e-9)))
        grad_w = data.T @ (p - labels) / len(labels)
        grad_b = np.mean(p - labels)
        w -= 0.2 * grad_w
        b -= 0.2 * grad_b
    fig, axes = plt.subplots(1, 2, figsize=(10, 4))
    axes[0].scatter(data[:, 0], data[:, 1], c=labels, cmap="coolwarm", s=16, alpha=0.75)
    origin = data.mean(axis=0)
    axes[0].arrow(origin[0], origin[1], pc[0] * 2, pc[1] * 2, color="black", width=0.02, label="PC1")
    axes[0].set_aspect("equal")
    _style(axes[0], "PCA direction")
    axes[1].plot(losses)
    axes[1].set_xlabel("iteration")
    axes[1].set_ylabel("logistic loss")
    _style(axes[1], "Gradient training")
    _save(fig, output_dir)


def data_analysis(output_dir: Path):
    t = np.arange(48)
    trend = 0.08 * t
    season = 1.5 * np.sin(2 * np.pi * t / 12)
    noise = RNG.normal(0, 0.45, size=t.size)
    y = 10 + trend + season + noise
    window = 5
    smooth = np.convolve(y, np.ones(window) / window, mode="same")
    fig, axes = plt.subplots(1, 2, figsize=(10, 4))
    axes[0].plot(t, y, "o-", label="observed")
    axes[0].plot(t, smooth, linewidth=2, label="moving average")
    _style(axes[0], "Time series with smoothing")
    axes[0].legend(fontsize=8)
    axes[1].hist(y - smooth, bins=14, color="tab:orange", alpha=0.75)
    axes[1].set_xlabel("residual")
    _style(axes[1], "Residual distribution")
    _save(fig, output_dir)


def capstone_project(output_dir: Path):
    stages = ["question", "model", "code", "evidence", "writing"]
    effort = np.array([2, 3, 4, 3, 2])
    risk = np.array([4, 3, 2, 3, 5])
    fig, axes = plt.subplots(1, 2, figsize=(10, 4))
    axes[0].bar(stages, effort, label="effort")
    axes[0].plot(stages, risk, "o-", color="crimson", label="risk")
    axes[0].tick_params(axis="x", rotation=25)
    _style(axes[0], "Research project planning")
    axes[0].legend(fontsize=8)
    x = np.arange(1, 11)
    baseline = 1 / np.sqrt(x)
    improved = baseline * 0.78
    axes[1].plot(x, baseline, "o-", label="baseline error")
    axes[1].plot(x, improved, "o-", label="new method error")
    axes[1].set_xlabel("experiment batch")
    axes[1].set_ylabel("error")
    _style(axes[1], "Reproducible experiment trace")
    axes[1].legend(fontsize=8)
    _save(fig, output_dir)


PROFILES = {
    "calculus_limit": calculus_limit,
    "calculus_derivative": calculus_derivative,
    "calculus_integral": calculus_integral,
    "calculus_series": calculus_series,
    "multivariable": multivariable,
    "linear_algebra_transform": linear_algebra_transform,
    "eigen_markov": eigen_markov,
    "least_squares": least_squares,
    "logic_truth": logic_truth,
    "set_relation": set_relation,
    "graph_paths": graph_paths,
    "combinatorics": combinatorics,
    "programming_error": programming_error,
    "probability_distribution": probability_distribution,
    "clt": clt,
    "bayes_coin": bayes_coin,
    "distribution_inference": distribution_inference,
    "real_sequence": real_sequence,
    "epsilon_delta": epsilon_delta,
    "metric_space": metric_space,
    "ode_logistic": ode_logistic,
    "ode_phase": ode_phase,
    "group_table": group_table,
    "ring_polynomial": ring_polynomial,
    "finite_field": finite_field,
    "geometry_curve": geometry_curve,
    "complex_map": complex_map,
    "contour_integral": contour_integral,
    "topology_space": topology_space,
    "measure_integral": measure_integral,
    "pde_heat": pde_heat,
    "pde_wave": pde_wave,
    "numerical_root": numerical_root,
    "numerical_interpolation": numerical_interpolation,
    "numerical_linear": numerical_linear,
    "optimization_gradient": optimization_gradient,
    "linear_programming": linear_programming,
    "fourier_series": fourier_series,
    "functional_projection": functional_projection,
    "commutative_algebra": commutative_algebra,
    "galois_roots": galois_roots,
    "riemann_geometry": riemann_geometry,
    "algebraic_topology": algebraic_topology,
    "stochastic_process": stochastic_process,
    "regression": regression,
    "bayesian_statistics": bayesian_statistics,
    "math_physics": math_physics,
    "computational_math": computational_math,
    "financial_math": financial_math,
    "machine_learning_math": machine_learning_math,
    "data_analysis": data_analysis,
    "capstone_project": capstone_project,
}


def run_profile(profile: str, title: str, concept: str, application: str, output_dir: Path) -> None:
    print("=" * 72)
    print(title)
    print(f"concept example: {concept}")
    print(f"application example: {application}")
    if profile not in PROFILES:
        raise KeyError(f"Unknown visualization profile: {profile}")
    PROFILES[profile](output_dir)
