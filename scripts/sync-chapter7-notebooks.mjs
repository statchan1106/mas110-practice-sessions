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
  ({ chapterSevenSections: sections } = await loader.ssrLoadModule(
    '/lib/chapter-seven-data.ts',
  ));
} finally {
  await loader.close();
}

const notebookExamples = {
  'positive-definite': {
    outputs: [
      String.raw`print("Ax =", Ax, "\nQuadratic form =", quadratic)`,
      String.raw`print("L =\n", L, "\nR =\n", R, "\nRebuilt A =\n", rebuilt, "\nMatches A:", rebuild_ok)`,
      String.raw`print("Rx =", Rx, "\nSquared length =", squared_length, "\nMatches the quadratic form:", length_ok)`,
    ],
    checks: [
      'assert np.allclose(Ax, [1, -1])',
      'assert np.isclose(quadratic, 2)',
      'assert np.allclose(R, np.array([[5, 4], [0, 3]]) / np.sqrt(5))',
      'assert rebuild_ok and length_ok',
    ],
    experiment:
      'Change `x` to `np.array([1., 1.])` in the first cell. Predict the new quadratic form and whether the Cholesky factor changes. Rerun the three example cells and compare the two routes to the scalar.',
  },
  'symmetric-eigenvalues': {
    outputs: [
      String.raw`print("Ascending =", lam_asc, "\nDescending =", lam, "\nV =\n", V)`,
      String.raw`print("Eigenbasis coordinates =", coords, "\nWeights =", weights, "\nRayleigh quotient =", rayleigh, "\nDirect =", direct)`,
      String.raw`print("B =\n", B, "\nUpdated eigenvalues =", lam_updated, "\nInterlaces:", interlaces)`,
    ],
    checks: [
      'assert np.allclose(lam_asc, [1, 9]) and np.allclose(lam, [9, 1])',
      'assert np.allclose(A @ V, V * lam)',
      'assert np.allclose(weights, [0.5, 0.5]) and np.allclose([rayleigh, direct], [5, 5])',
      'assert np.allclose(lam_updated, [(11 + np.sqrt(65)) / 2, (11 - np.sqrt(65)) / 2])',
      'assert interlaces',
    ],
    experiment:
      'Change `q` to `np.array([1., 1.])`. This is parallel to the first eigenvector. Predict which eigenvalue will move and rerun the update cell to check.',
  },
};

for (const section of sections) {
  const { lectureNotes, walkthrough } = section;
  const { outputs, checks, experiment } = notebookExamples[section.slug];
  const cells = [];

  function cell(cell_type, source) {
    cells.push({
      cell_type,
      id: 'ch' + section.number.replace('.', '') + '-' + (cells.length + 1),
      metadata: {},
      ...(cell_type === 'code' ? { execution_count: null, outputs: [] } : {}),
      source: source.match(/[^\n]*\n|[^\n]+$/g) ?? [],
    });
  }

  cell(
    'markdown',
    [
      '# Lab ' + section.number + ' · ' + section.title,
      section.learningGoal,
      lectureNotes.reference,
      'Run the cells in order with NumPy. They use the same example as the web walkthrough.',
    ].join('\n\n'),
  );

  cell(
    'markdown',
    '## Notation\n\n' +
      lectureNotes.notation
        .map(({ symbol, meaning }) => '- ' + symbol + ' · ' + meaning)
        .join('\n\n'),
  );

  assert.equal(outputs.length, walkthrough.steps.length);
  for (const [index, step] of walkthrough.steps.entries()) {
    assert.equal(step.code.split('\n').length, step.lineNotes.length);
    cell(
      'markdown',
      [
        '## ' + (index + 1) + '. ' + step.title,
        step.explanation,
        '**Predict first.** ' + step.watchFor,
      ].join('\n\n'),
    );
    cell('code', step.code + '\n' + outputs[index]);
    const equation = step.after.equation;
    if (equation) assert.match(equation, /^\$[^$]+\$$/);
    cell(
      'markdown',
      [step.after.description, equation && '$$' + equation.slice(1, -1) + '$$']
        .filter(Boolean)
        .join('\n\n'),
    );
  }

  cell(
    'markdown',
    '## Verify the original inputs\n\nRun these checks before changing anything.',
  );
  cell('code', checks.join('\n'));
  cell('markdown', '## Try one change\n\n' + experiment);
  cell(
    'markdown',
    '## References\n\n' +
      lectureNotes.references
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
