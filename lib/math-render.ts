import katex from 'katex';

const rendered = new Map<string, string>();

export function renderMath(tex: string) {
  const cached = rendered.get(tex);
  if (cached !== undefined) return cached;
  const html = katex.renderToString(tex, {
    output: 'htmlAndMathml',
    throwOnError: true,
    strict: 'error',
    trust: false,
  });
  if (rendered.size >= 512) rendered.delete(rendered.keys().next().value!);
  rendered.set(tex, html);
  return html;
}
