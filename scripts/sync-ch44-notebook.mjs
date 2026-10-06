// Generate the maintained notebook from the guided lesson's code and prose.
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
let section;
try {
  ({ leastSquaresSection: section } = await loader.ssrLoadModule(
    '/lib/chapter-four/least-squares.ts',
  ));
} finally {
  await loader.close();
}
const notes = section.lectureNotes;
const cells = [];
function cell(type, text) {
  cells.push({
    cell_type: type,
    id: `ch44-${String(cells.length + 1).padStart(3, '0')}`,
    metadata: {},
    ...(type === 'code' ? { execution_count: null, outputs: [] } : {}),
    source: text
      .split('\n')
      .map((line, i, rows) => line + (i < rows.length - 1 ? '\n' : '')),
  });
}
cell(
  'markdown',
  `# Lab 4.4 · ${section.title}\n\n${section.learningGoal}\n\n${notes.reference}\n\nMaintained in [MAS110 Practice Sessions](https://github.com/statchan1106/mas110-practice-sessions). Course companion to [Foundations of LADS](https://github.com/kyunghyuncho/Foundations_of_LADS) by Wanmo Kang and Kyunghyun Cho.\n\nRun the cells from top to bottom. Only NumPy is required (available in Colab). The normal-equation and explicit QR calculations explain this lecture example; use lstsq directly on A for general fitting.\n\n${notes.introduction}`,
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
const inspect = [
  'print("A =", A, "b =", b, "(A.T @ ell, ell @ b) =", reachability_check, sep="\\n")',
  'print("theta_trial =", theta_trial, "fitted_trial =", fitted_trial, "residual_trial =", residual_trial, "SSE =", sse_trial, sep="\\n")',
  'print("G =", G, "h =", h, "theta_normal =", theta_normal, sep="\\n")',
  'print("fitted =", fitted, "residual =", residual, "A.T @ residual =", orthogonality, "SSE =", sse, sep="\\n")',
  'print("P =", P, "P @ b =", projected, "symmetric and idempotent =", projector_ok, sep="\\n")',
  'print("Q =", Q, "R =", R, "theta_qr =", theta_qr, sep="\\n")',
  'print("theta_hat =", theta_hat, "SSE summary =", sums_squared, "rank =", rank_A, "singular values =", singular_values, "agreement =", agreement, "direct SSE =", sse_direct, sep="\\n")',
  'print("theta_dep =", theta_dep, "theta_shifted =", theta_shifted, "fitted outputs =", fits_dep, "SSE summary =", sums_dep, "rank =", rank_dep, "singular values =", singular_dep, "direct SSE =", sse_dep, sep="\\n")',
];
if (inspect.length !== section.walkthrough.steps.length)
  throw new Error('Update notebook result displays for the changed steps.');
for (const [i, step] of section.walkthrough.steps.entries()) {
  const lines = step.code.split('\n');
  if (lines.length !== step.lineNotes.length)
    throw new Error(`Missing line explanation in step ${i + 1}`);
  cell(
    'markdown',
    `## ${i + 1}. ${step.title}\n\n${step.explanation}\n\n**Predict first:** ${step.watchFor}\n\n` +
      step.lineNotes
        .map(
          (note, j) =>
            `- Line ${j + 1}, \`${lines[j]}\`: ${note.action} Shape: ${note.shape}. Operation: ${note.operation}`,
        )
        .join('\n\n'),
  );
  cell('code', step.code);
  cell('code', inspect[i]);
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
  '## Numerical checks\n\nThe arguments above explain existence, uniqueness of the fit, and the full family of coefficients. These numerical checks verify the displayed example. Floating-point comparisons use an explicit absolute tolerance.',
);
cell(
  'code',
  `def close(actual, expected):
    return np.allclose(actual, expected, rtol=0, atol=1e-10)

assert A.shape == (3, 2) and b.shape == (3,)
assert close(A.T @ left_normal, np.zeros(2)) and close(left_normal @ b, 1)
assert close(G, [[2, -1], [-1, 2]]) and close(h, [0, 2])
assert close(theta_normal, [2 / 3, 4 / 3])
assert close(theta_qr, theta_normal) and close(theta_hat, theta_normal)
assert close(fitted, [2 / 3, 4 / 3, 2 / 3])
assert close(residual, [1 / 3, -1 / 3, 1 / 3])
assert close(A.T @ residual, np.zeros(2))
assert close(sse, 1 / 3) and close(sse_direct, 1 / 3)
assert close(P, np.array([[2, 1, -1], [1, 2, 1], [-1, 1, 2]]) / 3)
assert close(P.T, P) and close(P @ P, P)
assert close(P @ b, fitted) and close((np.eye(3) - P) @ b, residual)
assert close(Q.T @ Q, np.eye(2)) and close(Q @ R, A)
assert close(Q @ Q.T, P) and close(np.tril(R, -1), np.zeros((2, 2)))
assert rank_A == 2 and close(singular_values, [np.sqrt(3), 1])
assert sums_squared.shape == (1,) and close(sums_squared, [1 / 3])
assert A_dep.shape == (3, 3) and rank_dep == 2
assert sums_dep.shape == (0,) and close(sse_dep, 1 / 3)
assert close(theta_dep, [2 / 3, 2 / 3, 2 / 3])
assert close(theta_shifted, [2 / 3, 5 / 3, -1 / 3])
assert close(A_dep @ null_direction, np.zeros(3))
assert close(fits_dep, np.column_stack((fitted, fitted)))
for t in [-3., -0.5, 0., 1., 4.]:
    candidate = theta_dep + t * null_direction
    assert close(A_dep @ candidate, fitted)
    assert close(candidate @ candidate, theta_dep @ theta_dep + 2 * t ** 2)
print("All example checks passed.")`,
);
cell(
  'markdown',
  '## Use NumPy’s reduced QR\n\nA library may choose different column signs from the lecture. Check the reconstructed matrix, projection, and coefficients rather than expecting identical entries in Q and R. This solve assumes full column rank.',
);
cell(
  'code',
  `Q_library, R_library = np.linalg.qr(A, mode="reduced")
theta_library = np.linalg.solve(R_library, Q_library.T @ b)
assert Q_library.shape == (3, 2) and R_library.shape == (2, 2)
assert close(Q_library @ R_library, A)
assert close(Q_library @ Q_library.T, P)
assert close(theta_library, theta_hat)
print("Q_library =", Q_library, "R_library =", R_library, "theta_library =", theta_library, sep="\\n")`,
);
cell(
  'markdown',
  '## Project onto the lecture’s tangent plane\n\nThe lecture first subtracts the base point p₀ = (1,2,−1)ᵀ from s = (2,3,0)ᵀ. P projects that displacement onto Col(A). Add p₀ back to obtain a point on the affine plane p₀ + Col(A).',
);
cell(
  'code',
  `p0 = np.array([1., 2., -1.])
s = np.array([2., 3., 0.])
displacement = s - p0
projected_point = p0 + P @ displacement
assert close(displacement, b)
assert close(projected_point, [5 / 3, 10 / 3, -1 / 3])
assert close(A.T @ (s - projected_point), np.zeros(2))
print("projected displacement =", P @ displacement, "projected point =", projected_point, sep="\\n")`,
);
cell(
  'markdown',
  '## Try another target and check Pythagoras\n\nChange b_new and a candidate coefficient. Even for another target, the minimizing residual is perpendicular to all reachable directions. The squared error of a candidate is the minimum squared error plus the squared distance between its fitted output and the optimal fitted output.',
);
cell(
  'code',
  `b_new = np.array([2., -1., 0.5])
theta_new, _, rank_new, _ = np.linalg.lstsq(A, b_new, rcond=None)
fit_new = A @ theta_new
e_new = b_new - fit_new
candidate = np.array([-1., 2.])
error_candidate = b_new - A @ candidate
fit_difference = A @ (candidate - theta_new)
assert rank_new == 2 and close(A.T @ e_new, np.zeros(2))
assert close(P @ b_new, fit_new)
assert close(error_candidate @ error_candidate,
             e_new @ e_new + fit_difference @ fit_difference)
print("new coefficients =", theta_new, "minimum SSE =", e_new @ e_new,
      "candidate SSE =", error_candidate @ error_candidate, sep="\\n")`,
);
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

const output = path.join(root, 'notebooks', section.filename);
fs.mkdirSync(path.dirname(output), { recursive: true });
fs.writeFileSync(
  output,
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
if (process.argv.includes('--export-data')) {
  fs.mkdirSync(path.join(root, 'tmp'), { recursive: true });
  fs.writeFileSync(
    path.join(root, 'tmp/ch44-data.json'),
    JSON.stringify(section, null, 2),
  );
}
console.log(`Updated ${path.relative(root, output)} (${cells.length} cells).`);
