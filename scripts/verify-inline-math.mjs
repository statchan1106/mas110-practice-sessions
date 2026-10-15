import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import ts from 'typescript';
import katex from 'katex';
import { createServer } from 'vite';

const loader = await createServer({
  configFile: false,
  resolve: { alias: { '@': process.cwd() } },
  cacheDir: 'tmp/vite-math-check',
  optimizeDeps: { noDiscovery: true },
  server: { middlewareMode: true, hmr: false },
});
let splitMathProse, plainMathProse, mathExpressions;
try {
  ({ splitMathProse, plainMathProse } =
    await loader.ssrLoadModule('/lib/math-prose.ts'));
  ({ mathExpressions } = await loader.ssrLoadModule(
    '/lib/math-expressions.ts',
  ));
} finally {
  await loader.close();
}

assert.deepEqual(
  splitMathProse(
    String.raw`Use $\hat\theta$ and \`A @ x\`.`.replaceAll('\\`', '`'),
  ).map((p) => p.kind),
  ['text', 'math', 'text', 'code', 'text'],
);
assert.deepEqual(
  splitMathProse('Python `x = "$not math$"` stays literal.').map((p) => p.kind),
  ['text', 'code', 'text'],
);
assert.deepEqual(splitMathProse(String.raw`A price is \$5.`), [
  { kind: 'text', value: String.raw`A price is \$5.` },
]);
assert.equal(
  plainMathProse(
    String.raw`Use $\theta$ and \`A @ x\`.`.replaceAll('\\`', '`'),
  ),
  'Use θ and A @ x.',
);

const proseFields = new Set([
  'introduction',
  'meaning',
  'definition',
  'watchFor',
  'explanation',
  'action',
  'operation',
  'paragraphs',
  'question',
  'answer',
  'summary',
  'learningGoal',
  'codeExtension',
  'objective',
  'callout',
]);
const legacy = /[∫∑Σ‖⟨⟩𝒫ℝᵀᴮ₀-₉ₐ-ₜ⁰-⁹]/u;
const files = ['lib', 'app', 'components'].flatMap((root) =>
  fs
    .readdirSync(root, { recursive: true })
    .map(String)
    .filter(
      (file) =>
        /\.(ts|tsx)$/.test(file) &&
        !file.startsWith('ui' + path.sep) &&
        !file.startsWith('math-') &&
        !file.endsWith('geometry.ts'),
    )
    .map((file) => path.join(root, file)),
);
let formulas = 0;
const unmarked = [];
for (const file of files) {
  const source = fs.readFileSync(file, 'utf8'),
    ast = ts.createSourceFile(
      file,
      source,
      ts.ScriptTarget.Latest,
      true,
      file.endsWith('.tsx') ? ts.ScriptKind.TSX : ts.ScriptKind.TS,
    );
  function visit(node) {
    if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) {
      const value = node.text,
        parts = splitMathProse(value),
        location = `${file}:${ast.getLineAndCharacterOfPosition(node.getStart(ast)).line + 1}`;
      let field,
        ancestor = node.parent,
        literal = false;
      while (ancestor && !ts.isSourceFile(ancestor)) {
        if (ts.isPropertyAssignment(ancestor)) {
          const key = ancestor.name.getText(ast);
          field ??= key;
          if (['code', 'graph', 'plane', 'values'].includes(key))
            literal = true;
        }
        ancestor = ancestor.parent;
      }
      if (literal) {
        ts.forEachChild(node, visit);
        return;
      }
      for (const part of parts)
        if (part.kind === 'math') {
          katex.renderToString(part.value, {
            strict: 'error',
            throwOnError: true,
            trust: false,
          });
          formulas++;
        }
      const raw = parts
        .filter((part) => part.kind === 'text')
        .map((part) => part.value)
        .join('');
      if (
        proseFields.has(field) &&
        !mathExpressions.has(value) &&
        (legacy.test(raw) || raw.includes('\u0302'))
      )
        unmarked.push(`${location}: ${raw}`);
      if (value.includes('$'))
        assert(
          !/(?<!\\)\$/.test(raw),
          `${location}: unbalanced math delimiters`,
        );
    }
    ts.forEachChild(node, visit);
  }
  visit(ast);
}
assert.deepEqual(
  unmarked,
  [],
  `Unmarked inline notation:\n${unmarked.join('\n')}`,
);
console.log(
  `Verified ${formulas} authored inline expressions and prose notation across the course.`,
);
