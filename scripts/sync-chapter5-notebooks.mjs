import assert from 'node:assert/strict';
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
  ({ chapterFiveSections: sections } = await loader.ssrLoadModule(
    '/lib/chapter-five-data.ts',
  ));
} finally {
  await loader.close();
}

const inspect = {
  'svd-basics': [
    'print("D diagonal =", s, "\\nU =", U, "\\nV =", V)',
    'print("Reconstructed A =", rebuilt, "\\nNumPy singular values =", s_lib)',
    'print("Rank-two A =", A_k, "\\nError =", E, "\\nSpectral and Frobenius norms =", errors)',
  ],
  'svd-projections': [
    'print("Singular values =", s, "\\nKept =", keep, "\\nA_plus =", A_plus)',
    'print("Output projector =", P_col, "\\nFit =", b_hat, "\\nResidual =", residual)',
    'print("Input projector =", P_row, "\\nShortest input =", x_hat, "\\nShifted input =", x_other, "\\nProjected input =", x_projected)',
  ],
  'stable-qr': ['print("Singular values =", s)', '', ''],
  'numerical-rank': [
    'print("Direct singular values =", s)',
    'print("Cutoffs =", rtols, "\\nRanks =", ranks, "\\nRescaled ranks =", scaled_ranks)',
    'print("Rounded Gram matrix =", G, "\\nGram eigenvalues =", gram_eigenvalues, "\\nDefault rank =", default_rank)',
  ],
};

const checks = {
  'svd-basics': `assert np.allclose(U.T @ U, np.eye(3))
assert np.allclose(V.T @ V, np.eye(3))
assert np.allclose(A @ V, U * s)
assert np.allclose(A.T @ U, V * s)
assert np.allclose(rebuilt, A)
assert np.allclose((U_lib * s_lib) @ Vt_lib, A)
assert np.allclose(s_lib, [6, 4, 2, 0])
assert np.linalg.matrix_rank(A_k) == 2
assert np.allclose(errors, [2, 2])
E1 = A - s[0] * np.outer(U[:, 0], V[:, 0])
assert np.isclose(np.linalg.norm(E1, 2), 4)
assert np.isclose(np.linalg.norm(E1, "fro"), np.sqrt(20))`,
  'svd-projections': `assert A_plus.shape == (3, 4)
assert np.allclose(A_plus, np.linalg.pinv(A))
assert np.allclose(P_col.T, P_col) and np.allclose(P_row.T, P_row)
assert np.allclose(P_col @ A, A) and np.allclose(P_row @ A_plus, A_plus)
assert np.allclose(P_col @ P_col, P_col) and np.allclose(P_row @ P_row, P_row)
assert np.allclose(b_hat, [2, 2, 2, 0])
assert np.allclose(residual, [-1, 1, 0, 4])
assert np.allclose(A.T @ residual, 0)
assert np.allclose(x_hat, [1, 1, 2]) and np.allclose(x_projected, x_hat)
assert np.allclose(A @ x_other, b_hat)
assert np.allclose([x_hat @ x_hat, x_other @ x_other], [6, 8])`,
  'stable-qr': `assert np.allclose(s, [np.sqrt(3), eps, eps], rtol=1e-6, atol=0)
orthogonality_errors = []
for Q, R in factors:
    assert np.linalg.norm(A - Q @ R) / np.linalg.norm(A) < 1e-12
    orthogonality_errors.append(np.linalg.norm(Q.T @ Q - np.eye(3)))
assert orthogonality_errors[0] > 1e-3
assert orthogonality_errors[1] < orthogonality_errors[0]
assert orthogonality_errors[2] < 1e-12`,
  'numerical-rank': `assert np.allclose(s, [np.sqrt(2), eps / np.sqrt(2)], rtol=1e-6, atol=0)
assert ranks == scaled_ranks == [1, 2]
assert np.allclose(s_scaled, 1e6 * s, atol=0)
assert np.array_equal(G, np.ones((2, 2)))
assert np.allclose(gram_eigenvalues, [0, 2], atol=1e-14)
assert default_rank == 2
A_dependent = A.copy()
A_dependent[1, 1] = 0
assert np.linalg.matrix_rank(A_dependent) == 1
assert np.allclose(A_dependent @ [1, -1], 0)`,
};

const pca = `observations = np.array([[5., 2.], [1., 2.], [3., 3.], [3., 1.]])
mean = observations.mean(axis=0)
centered = observations - mean
U_pca, s_pca, Vt_pca = np.linalg.svd(centered, full_matrices=False)
v1 = Vt_pca[0]
scores = centered @ v1
fit = mean + np.outer(scores, v1)
variance = s_pca**2 / (len(observations) - 1)
assert np.allclose(mean, [3, 2])
assert np.allclose(variance, [8 / 3, 2 / 3])
assert np.isclose(variance[0] / variance.sum(), 0.8)
assert np.allclose(fit, [[5, 2], [1, 2], [3, 2], [3, 2]])
print("Scores =", scores)
print("Fitted points =", fit)
print("Explained fraction =", variance[0] / variance.sum())`;

function display(equation) {
  if (!equation) return '';
  assert.match(equation, /^\$[^$]+\$$/);
  return '$$' + equation.slice(1, -1) + '$$';
}

for (const section of sections) {
  const notes = section.lectureNotes;
  const outputs = inspect[section.slug];
  const cells = [];
  function cell(type, source) {
    cells.push({
      cell_type: type,
      id:
        'ch' +
        section.number.replace('.', '') +
        '-' +
        String(cells.length + 1).padStart(3, '0'),
      metadata: {},
      ...(type === 'code' ? { execution_count: null, outputs: [] } : {}),
      source: source.match(/[^\n]*\n|[^\n]+$/g) ?? [],
    });
  }
  cell(
    'markdown',
    [
      '# Lab ' + section.number + ' · ' + section.title,
      section.learningGoal,
      notes.reference,
      notes.introduction,
      'Run the cells in order with NumPy. The code and notation follow the web lab.',
    ].join('\n\n'),
  );
  cell(
    'markdown',
    '## Notation\n\n' +
      notes.notation
        .map(({ symbol, meaning }) => '- ' + symbol + ' · ' + meaning)
        .join('\n\n'),
  );
  assert.equal(outputs.length, section.walkthrough.steps.length);
  for (const [i, step] of section.walkthrough.steps.entries()) {
    assert.equal(step.code.split('\n').length, step.lineNotes.length);
    cell(
      'markdown',
      [
        '## ' + (i + 1) + '. ' + step.title,
        step.explanation,
        '**Predict first.** ' + step.watchFor,
      ].join('\n\n'),
    );
    cell('code', [step.code, outputs[i]].filter(Boolean).join('\n'));
    cell(
      'markdown',
      [step.after.description, display(step.after.equation)]
        .filter(Boolean)
        .join('\n\n'),
    );
  }
  cell(
    'markdown',
    '## ' +
      notes.reasoningTitle +
      '\n\n' +
      notes.reasoning
        .map(({ title, paragraphs, equation }) =>
          ['### ' + title, ...paragraphs, display(equation)]
            .filter(Boolean)
            .join('\n\n'),
        )
        .join('\n\n'),
  );
  cell(
    'markdown',
    '## Verify the example\n\nRun these checks on the example before changing the input.',
  );
  cell('code', checks[section.slug]);
  if (section.slug === 'svd-basics') {
    cell(
      'markdown',
      '## Centered PCA\n\nReproduce the example on the chapter page. Centering moves the fit through the mean in the original coordinates. The sign of the scores can vary with the sign of the returned direction.',
    );
    cell('code', pca);
  }
  cell(
    'markdown',
    '## Check your understanding\n\n' +
      notes.checks
        .map(({ question, answer }) => question + '\n\n' + answer)
        .join('\n\n'),
  );
  cell(
    'markdown',
    '## References\n\n' +
      notes.references
        .map(({ title, url }) => '- [' + title + '](' + url + ')')
        .join('\n'),
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
          language_info: { name: 'python' },
        },
        nbformat: 4,
        nbformat_minor: 5,
      },
      null,
      2,
    ) + '\n',
  );
  console.log('Updated ' + section.filename);
}
