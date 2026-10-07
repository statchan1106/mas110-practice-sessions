// Regenerate Chapter 4 notebooks from the maintained lessons, then sync 4.4.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createServer } from 'vite';

const root = fileURLToPath(new URL('..', import.meta.url));
const loader = await createServer({
  root,
  configFile: false,
  resolve: { alias: { '@': root } },
  server: { middlewareMode: true, hmr: false },
});
let sections;
try {
  ({ chapterFourSections: sections } = await loader.ssrLoadModule(
    '/lib/chapter-four-data.ts',
  ));
} finally {
  await loader.close();
}

const extras = {
  'inner-products': {
    inspect: [
      'print("u =", u, "v =", v, "dot product =", dot_uv, sep="\\n")',
      'print("norms =", norm_u, norm_v, "q =", q)',
      'print("cosine =", cos_phi, "angle in degrees =", phi_degrees)',
      'print("coordinate =", coordinate, "projection =", projected, "residual =", residual, "q.T @ residual =", perpendicular, sep="\\n")',
      'print("Q =", Q, "P =", P, "P @ u =", projected_again, "projector check =", projector_check, sep="\\n")',
      'print("squared parts =", squared_parts, "Pythagoras =", pythagoras, "Q_full =", Q_full, sep="\\n")',
    ],
    checks: `assert np.allclose(u * v, [2, 2]) and np.isclose(dot_uv, 4)
assert np.allclose([norm_u, norm_v], np.sqrt(5))
assert np.isclose(cos_phi, 4 / 5)
assert np.isclose(phi_degrees, 36.86989764584402)
assert np.allclose(projected, [8 / 5, 4 / 5])
assert np.allclose(residual, [-3 / 5, 6 / 5])
assert np.isclose(v @ residual, 0, atol=1e-12)
assert Q.shape == (2, 1) and P.shape == (2, 2)
assert np.allclose(P, np.array([[4, 2], [2, 1]]) / 5)
assert projector_check and pythagoras
assert np.allclose(squared_parts, [16 / 5, 9 / 5])
assert np.allclose(Q_full.T @ Q_full, np.eye(2))
assert np.allclose(Q_full @ Q_full.T, np.eye(2))
def unit_direction(vector):
    vector = np.asarray(vector, dtype=float)
    norm = np.linalg.norm(vector)
    if norm == 0:
        raise ValueError("A zero vector has no unit direction.")
    return vector / norm
try:
    unit_direction(np.zeros(2))
except ValueError:
    pass
else:
    raise AssertionError("Expected a zero-vector guard.")
for candidate in [[0, 0], [2, -1], [3, 1], [-1, -2]]:
    candidate = np.array(candidate, dtype=float)
    p = P @ candidate
    e = candidate - p
    assert np.isclose(v @ e, 0, atol=1e-12)
    assert np.isclose(candidate @ candidate, p @ p + e @ e)
print("All inner-product checks passed.")`,
    exerciseTitle: 'Try a different direction and see the vectors',
    exerciseCopy:
      'Change v_new and u_new. A new line changes the projection matrix; positive scaling of v_new preserves the line and its projection. The zero direction is rejected before division.',
    exercise: `v_new = np.array([1., -1.])
u_new = np.array([2., 1.])
q_new = unit_direction(v_new)
p_new = (q_new @ u_new) * q_new
e_new = u_new - p_new
assert np.isclose(v_new @ e_new, 0, atol=1e-12)
assert np.allclose(np.outer(q_new, q_new), np.outer(unit_direction(3 * v_new), unit_direction(3 * v_new)))
import matplotlib.pyplot as plt
fig, ax = plt.subplots()
for vector, label in [(u_new, "u"), (p_new, "p"), (v_new, "v")]:
    ax.quiver(0, 0, *vector, angles="xy", scale_units="xy", scale=1, label=label)
ax.plot([p_new[0], u_new[0]], [p_new[1], u_new[1]], "--", label="residual e")
ax.set(xlim=(-2, 3), ylim=(-2, 3), xlabel="first coordinate", ylabel="second coordinate")
ax.set_aspect("equal")
ax.legend()
plt.show()`,
  },
  polynomials: {
    inspect: [
      'print("f coefficients =", f, "g coefficients =", g)',
      'print("<f,g> =", dot_fg, "integral norms =", lengths)',
      'print("G =", G, "<t,t^2> from coordinates =", coefficient_inner, "dot vs integral for 1,t^2 =", contrast, sep="\\n")',
      'print("q0 =", q0, "q1 =", q1, "w2 =", w2, "q2 =", q2, "C.T @ G @ C =", orthonormal_gram, sep="\\n")',
      'print("projection =", projection, "residual =", residual, "orthogonality =", orthogonality, "minimum squared error =", minimum_error, sep="\\n")',
      'print("E =", E, "H =", H, "rhs =", rhs, "alpha =", alpha, "projection_gram =", projection_gram, sep="\\n")',
    ],
    checks: `assert np.isclose(dot_fg, 0)
assert np.allclose(lengths ** 2, [2 / 3, 2 / 5])
assert np.allclose(G, [[2, 0, 2 / 3], [0, 2 / 3, 0], [2 / 3, 0, 2 / 5]])
assert np.all(np.linalg.eigvalsh(G) > 0)
assert np.allclose(contrast, [0, 2 / 3])
assert np.allclose(w2, [-1 / 3, 0, 1])
assert np.allclose(orthonormal_gram, np.eye(3), rtol=0, atol=1e-12)
assert np.allclose(projection, [1 / 3, 0, 0])
assert np.allclose(orthogonality, 0, rtol=0, atol=1e-12)
assert np.isclose(minimum_error, 8 / 45)
assert np.allclose(projection_gram, projection)
for a, b in [(0, 0), (1 / 3, 0), (-2, 0.5)]:
    candidate = np.array([a, b, 0.])
    error = target - candidate
    assert np.isclose(inner_poly(error, error), 8 / 45 + 2 * (a - 1 / 3) ** 2 + (2 / 3) * b ** 2)

def orthonormal_polynomials(degree):
    """Low-degree teaching routine; coefficient columns use ascending powers."""
    monomials = np.eye(degree + 1)
    accepted = []
    for j in range(degree + 1):
        w = monomials[j].copy()
        # All previous vectors: range(j), never range(j - 1).
        for i in range(j):
            w -= inner_poly(w, accepted[i]) * accepted[i]
        norm_squared = inner_poly(w, w)
        if norm_squared <= 1e-14:
            raise ValueError("Cannot normalize a numerically vanishing polynomial.")
        accepted.append(w / np.sqrt(norm_squared))
    return np.column_stack(accepted)

C3 = orthonormal_polynomials(3)
B3 = np.eye(4)
G3 = np.array([[inner_poly(bi, bj) for bj in B3] for bi in B3])
assert np.allclose(C3.T @ G3 @ C3, np.eye(4), rtol=0, atol=1e-11)
assert np.allclose(C3[:3, :3], C, rtol=0, atol=1e-11)
assert np.allclose(C3[:, 3], np.sqrt(7 / 8) * np.array([0., -3., 0., 5.]))
# Standard Legendre normalization fixes the value at 1, not the integral norm.
P2 = np.array([-0.5, 0., 1.5])
assert np.isclose(poly.polyval(1., P2), 1)
assert np.isclose(inner_poly(P2, P2), 2 / 5)
assert np.allclose(q2, np.sqrt(5 / 2) * P2)
print("All polynomial checks passed.")`,
    exerciseTitle: 'Find the closest cubic to t⁴',
    exerciseCopy:
      'Use all four allowed orthonormal directions q₀,…,q₃, exactly as the corrected general projection loop requires. The resulting approximation has degree two by symmetry, but it lies in the space of degree at most three. The graph shows function values; the assertions check the integral metric.',
    exercise: `target4 = np.array([0., 0., 0., 0., 1.])
best_cubic = np.zeros(5)
for j in range(4):
    basis_function = np.pad(C3[:, j], (0, 1))
    best_cubic += inner_poly(target4, basis_function) * basis_function
error4 = target4 - best_cubic
assert np.allclose(best_cubic, [-3 / 35, 0, 6 / 7, 0, 0], rtol=0, atol=1e-11)
assert np.isclose(inner_poly(error4, error4), 128 / 11025)
for j in range(4):
    assert np.isclose(inner_poly(error4, C3[:, j]), 0, atol=1e-11)
print("Closest cubic coefficients =", best_cubic)
import matplotlib.pyplot as plt
t_values = np.linspace(-1, 1, 201)
fig, ax = plt.subplots()
for c, label in [(target4, "t^4"), (best_cubic, "closest polynomial in P3"), (error4, "residual")]:
    ax.plot(t_values, poly.polyval(t_values, c), label=label)
ax.set(xlabel="argument t", ylabel="function value")
ax.legend()
plt.show()`,
  },
  'qr-decomposition': {
    inspect: [
      'print("A =", A, "a1 =", a1, "a2 =", a2, sep="\\n")',
      'print("r11 =", r11, "q1 =", q1)',
      'print("r12 =", r12, "old component =", old_component, "w2 =", w2, "r22 =", r22, sep="\\n")',
      'print("Q =", Q, "R =", R, sep="\\n")',
      'print("reconstruction error =", reconstruction_error, "orthogonality error =", orthogonality_error, "P =", P, sep="\\n")',
      'print("Q.T @ b =", coordinates, "theta_hat =", theta_hat, "fitted =", fitted, "Q_library =", Q_library, "R_library =", R_library, sep="\\n")',
      'print("dependent column =", dependent_column, "remaining vector =", w_dependent, "no new direction =", no_new_direction, sep="\\n")',
    ],
    checks: `assert A.shape == (3, 2) and Q.shape == (3, 2) and R.shape == (2, 2)
assert np.allclose(q1, np.array([-1, 0, 1]) / np.sqrt(2))
assert np.allclose(q2, np.array([1, 2, 1]) / np.sqrt(6))
assert np.allclose(w2, [0.5, 1., 0.5])
assert np.allclose(R, [[np.sqrt(2), -1 / np.sqrt(2)], [0, np.sqrt(6) / 2]])
assert reconstruction_error < 1e-12 and orthogonality_error < 1e-12
assert np.allclose(np.tril(R, -1), 0, rtol=0, atol=1e-12)
assert np.allclose(P.T, P) and np.allclose(P @ P, P)
assert np.allclose(theta_hat, [2 / 3, 4 / 3])
assert np.allclose(fitted, P @ b)
assert np.allclose(Q_library @ R_library, A)
assert np.allclose(Q_library.T @ Q_library, np.eye(2))
assert np.allclose(Q_library @ Q_library.T, P)
assert no_new_direction

def gram_schmidt(matrix, modified=True, rtol=1e-12):
    """Full-column-rank real teaching routine with a scaled remainder guard."""
    matrix = np.asarray(matrix, dtype=float)
    if matrix.ndim != 2 or not np.all(np.isfinite(matrix)):
        raise ValueError("Expected a finite real matrix.")
    m, n = matrix.shape
    if not (m >= n > 0):
        raise ValueError("This teaching routine requires m >= n > 0.")
    threshold = rtol * np.linalg.norm(matrix, 2)
    Q_out = np.zeros((m, n))
    R_out = np.zeros((n, n))
    for j in range(n):
        w = matrix[:, j].copy()
        for i in range(j):
            reference = w if modified else matrix[:, j]
            R_out[i, j] = Q_out[:, i] @ reference
            w -= R_out[i, j] * Q_out[:, i]
        R_out[j, j] = np.linalg.norm(w)
        # This guards j = 0 as well as every later column.
        if R_out[j, j] <= threshold:
            raise ValueError("No new direction at the chosen tolerance.")
        Q_out[:, j] = w / R_out[j, j]
    return Q_out, R_out

Q_mgs, R_mgs = gram_schmidt(A)
assert np.allclose(Q_mgs @ R_mgs, A)
assert np.allclose(Q_mgs.T @ Q_mgs, np.eye(2))
for bad in [np.column_stack((np.zeros(3), a2)), np.column_stack((a1, 2 * a1))]:
    try:
        gram_schmidt(bad)
    except ValueError:
        pass
    else:
        raise AssertionError("A vanishing remainder was not rejected.")
Q_complete, R_complete = np.linalg.qr(A, mode="complete")
assert Q_complete.shape == (3, 3) and R_complete.shape == (3, 2)
assert np.allclose(Q_complete @ Q_complete.T, np.eye(3))
assert np.allclose(Q_complete[:, :2] @ Q_complete[:, :2].T, P)
print("All lecture QR checks passed.")`,
    exerciseTitle: 'Measure reconstruction and orthogonality separately',
    exerciseCopy:
      'The original notebook’s small ε example exposes cancellation in classical Gram–Schmidt. Compare classical, modified, and library QR on the same matrix. All reconstruction errors may be small even when the classical Q is far from orthonormal. Modified Gram–Schmidt is still a teaching algorithm; severe conditioning can require reorthogonalization.',
    exercise: `epsilon = 1e-8
A_near = np.array([[1., 1., 1.], [epsilon, 0., 0.], [0., epsilon, 0.], [0., 0., epsilon]])
methods = [("classical", gram_schmidt(A_near, modified=False)),
           ("modified", gram_schmidt(A_near, modified=True)),
           ("library QR", np.linalg.qr(A_near, mode="reduced"))]
errors = []
for name, (Q_near, R_near) in methods:
    reconstruction = np.linalg.norm(A_near - Q_near @ R_near) / np.linalg.norm(A_near)
    orthogonality = np.linalg.norm(Q_near.T @ Q_near - np.eye(3))
    errors.append([reconstruction, orthogonality])
    print(f"{name:12s}: relative reconstruction={reconstruction:.3e}; orthogonality={orthogonality:.3e}")
errors = np.array(errors)
assert np.all(errors[:, 0] < 1e-10)
assert errors[0, 1] > 1e-3
assert errors[1, 1] < errors[0, 1]
assert errors[2, 1] < 1e-12
import matplotlib.pyplot as plt
fig, ax = plt.subplots()
ax.bar([name for name, _ in methods], np.maximum(errors[:, 1], 1e-17))
ax.set(yscale="log", ylabel="Frobenius norm of Q.T @ Q - I", title="Orthogonality errors on the same input")
plt.show()`,
  },
};

for (const section of sections.slice(0, 3)) {
  const cells = [];
  const spec = extras[section.slug],
    notes = section.lectureNotes;
  function cell(type, text) {
    cells.push({
      cell_type: type,
      id: `ch${section.number.replace('.', '')}-${String(cells.length + 1).padStart(3, '0')}`,
      metadata: {},
      ...(type === 'code' ? { execution_count: null, outputs: [] } : {}),
      source: text
        .split('\n')
        .map((line, i, rows) => line + (i < rows.length - 1 ? '\n' : '')),
    });
  }
  cell(
    'markdown',
    `# Lab ${section.number} · ${section.title}\n\n${section.learningGoal}\n\n${notes.reference}\n\nMaintained in [MAS110 Practice Sessions](https://github.com/statchan1106/mas110-practice-sessions). Course companion to [Foundations of LADS](https://github.com/kyunghyuncho/Foundations_of_LADS) by Wanmo Kang and Kyunghyun Cho.\n\nRun all cells in order. NumPy handles the calculations; the final plot uses Matplotlib. Both are available in Colab.\n\n${notes.introduction}`,
  );
  cell(
    'markdown',
    '## Notation\n\n' +
      notes.notation.map((x) => `- **${x.symbol}**: ${x.meaning}`).join('\n\n'),
  );
  cell(
    'markdown',
    '## Key ideas\n\n' +
      section.primer
        .map(
          (x) =>
            `### ${x.term}\n\n${x.definition}\n\n${x.relation}\n\nKeep in mind: ${x.watchFor}`,
        )
        .join('\n\n'),
  );
  if (spec.inspect.length !== section.walkthrough.steps.length)
    throw new Error(`Inspection mismatch in ${section.number}`);
  for (const [i, step] of section.walkthrough.steps.entries()) {
    const lines = step.code.split('\n');
    if (lines.length !== step.lineNotes.length)
      throw new Error(`Missing line notes in ${section.number}, step ${i + 1}`);
    cell(
      'markdown',
      `## ${i + 1}. ${step.title}\n\n${step.explanation}\n\n**Predict first:** ${step.watchFor}\n\n` +
        step.lineNotes
          .map(
            (n, j) =>
              `- Line ${j + 1}, \`${lines[j]}\`: ${n.action} Shape: ${n.shape}. Operation: ${n.operation}`,
          )
          .join('\n\n'),
    );
    cell('code', step.code);
    cell('code', spec.inspect[i]);
    cell(
      'markdown',
      `**Read the result:** ${step.after.description}\n\n${step.after.equation ?? ''}\n\n${step.after.callout ?? ''}`,
    );
  }
  cell(
    'markdown',
    `## ${notes.reasoningTitle}\n\n` +
      notes.reasoning
        .map(
          (x) =>
            `### ${x.title}\n\n${x.paragraphs.join('\n\n')}\n\n${x.equation ?? ''}`,
        )
        .join('\n\n'),
  );
  cell(
    'markdown',
    '## Numerical checks\n\nThese checks verify the example and the correction described above. They support the algebraic arguments and do not replace them.',
  );
  cell('code', spec.checks);
  cell('markdown', `## ${spec.exerciseTitle}\n\n${spec.exerciseCopy}`);
  cell('code', spec.exercise);
  cell(
    'markdown',
    '## Check your understanding\n\n' +
      notes.checks
        .map(
          (x) =>
            `**${x.question}**\n\n<details><summary>Show explanation</summary>\n\n${x.answer}\n\n</details>`,
        )
        .join('\n\n'),
  );
  cell(
    'markdown',
    '## Code references\n\n' +
      notes.references.map((x) => `- [${x.title}](${x.url})`).join('\n'),
  );
  fs.writeFileSync(
    path.join(root, 'notebooks', section.filename),
    JSON.stringify(
      {
        cells,
        metadata: {
          kernelspec: {
            display_name: 'Python 3',
            language: 'python',
            name: 'python3',
          },
          language_info: { name: 'python', version: '3.11' },
        },
        nbformat: 4,
        nbformat_minor: 5,
      },
      null,
      2,
    ) + '\n',
  );
  console.log(`Updated ${section.filename} (${cells.length} cells).`);
}
if (process.argv.includes('--export-data')) {
  fs.mkdirSync(path.join(root, 'tmp'), { recursive: true });
  fs.writeFileSync(
    path.join(root, 'tmp/chapter4-data.json'),
    JSON.stringify(sections, null, 2),
  );
}
await import('./sync-ch44-notebook.mjs');
