import katex from 'katex';
import { mathExpressions } from '@/lib/math-expressions';

export function MathText({
  children,
  tex,
}: {
  children: string;
  tex?: string;
}) {
  const expression = tex ?? mathExpressions.get(children);
  if (!expression) return <span className="math-plain">{children}</span>;

  // Repository-authored TeX only. Invalid expressions fail the static build;
  // HTML extensions are disabled and MathML supplies screen-reader semantics.
  const html = katex.renderToString(expression, {
    output: 'htmlAndMathml',
    throwOnError: true,
    strict: 'error',
    trust: false,
  });
  return (
    <span
      className="math-text"
      data-math-source={children}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
