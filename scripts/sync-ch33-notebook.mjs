// Keep the maintained notebook aligned with the guided lesson's code and prose.
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
  ({ nonInvertibleSystemSection: section } = await loader.ssrLoadModule(
    '/lib/chapter-three/non-invertible-system.ts',
  ));
} finally {
  await loader.close();
}
const notes = section.lectureNotes;
const cells = [];
function cell(type, text) {
  cells.push({
    cell_type: type,
    id: `ch33-${String(cells.length + 1).padStart(3, '0')}`,
    metadata: {},
    ...(type === 'code' ? { execution_count: null, outputs: [] } : {}),
    source: text
      .split('\n')
      .map((line, i, rows) => line + (i < rows.length - 1 ? '\n' : '')),
  });
}
cell(
  'markdown',
  `# Lab 3.3 · ${section.title}\n\n${section.learningGoal}\n\n${notes.reference}\n\nMaintained in [MAS110 Practice Sessions](https://github.com/statchan1106/mas110-practice-sessions). Course companion to [Foundations of LADS](https://github.com/kyunghyuncho/Foundations_of_LADS) by Wanmo Kang and Kyunghyun Cho. This notebook follows the supplied lecture example; the upstream repository is a reference.\n\nRun the cells from top to bottom. Only NumPy is required (available in Colab). The row operations below are chosen for this particular matrix, not a general-purpose solver.\n\n${notes.introduction}`,
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
  'print("A =", A, "U =", U, sep="\\n")',
  'print("U =", U, sep="\\n")',
  'print("R =", R, sep="\\n")',
  'print("N =", N, "A @ N =", null_check, sep="\\n")',
  'print("E @ A =", E @ A, "c_good =", c_good, "c_bad =", c_bad, sep="\\n")',
  'print("rank(A), rank([A|b_good]), rank([A|b_bad]) =", rank_A, rank_good, rank_bad)',
  'print("x_particular =", x_particular, "A @ x_particular =", A @ x_particular, sep="\\n")',
  'print("x =", x, "A @ x =", output, "verified =", verified, sep="\\n")',
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
  '## Why this gives every solution\n\n' +
    notes.reasoning
      .map(
        (x) =>
          `### ${x.title}\n\n${x.paragraphs.join('\n\n')}\n\n${x.equation ?? ''}`,
      )
      .join('\n\n'),
);
cell(
  'markdown',
  '## Numerical checks\n\nThe proof above establishes the full family. These checks verify the displayed example and several choices of the free parameters. Approximate equality uses an explicit absolute tolerance.',
);
cell(
  'code',
  `assert A.shape == (3, 4) and N.shape == (4, 2)
assert np.allclose(E @ A, U, rtol=0, atol=1e-10)
assert np.allclose(A @ N, np.zeros((3, 2)), rtol=0, atol=1e-10)
assert np.linalg.matrix_rank(N) == 2
assert (rank_A, rank_good, rank_bad) == (2, 2, 3)
assert np.allclose(c_good, [1, 3, 0], rtol=0, atol=1e-10)
assert np.allclose(c_bad, [1, 3, 1], rtol=0, atol=1e-10)
assert np.allclose(x_particular, [-2, 0, 1, 0], rtol=0, atol=1e-10)
assert np.allclose(x, [-9, 2, 2, -1], rtol=0, atol=1e-10)
ell = np.array([5., -2., 1.])
assert np.allclose(A.T @ ell, np.zeros(4), rtol=0, atol=1e-10)
for a, beta_value in [(0, 0), (0, 1), (2, -1), (-1.5, 3)]:
    candidate = x_particular + a * n1 + beta_value * n2
    assert np.allclose(A @ candidate, b, rtol=0, atol=1e-10)
print("All example checks passed.")`,
);
cell(
  'markdown',
  '## Try another consistent target\n\nChoose b₁ and b₂ first. Set b₃ = 2b₂ − 5b₁ to satisfy the consistency condition, then use the general particular-solution formula. Change the free parameters too.',
);
cell(
  'code',
  `b1, b2 = 2., -1.
b_new = np.array([b1, b2, 2 * b2 - 5 * b1])
xp_new = np.array([3 * b1 - b2, 0., (b2 - 2 * b1) / 3, 0.])
alpha_new, beta_new = -0.5, 2.
x_new = xp_new + alpha_new * n1 + beta_new * n2
assert np.allclose(A @ x_new, b_new, rtol=0, atol=1e-10)
print("b_new =", b_new, "x_new =", x_new, "A @ x_new =", A @ x_new, sep="\\n")`,
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
// Optional intermediate data for verifying the prepared visual states.
if (process.argv.includes('--export-data')) {
  fs.mkdirSync(path.join(root, 'tmp'), { recursive: true });
  fs.writeFileSync(
    path.join(root, 'tmp/ch33-data.json'),
    JSON.stringify(section, null, 2),
  );
}
console.log(`Updated ${path.relative(root, output)} (${cells.length} cells).`);
