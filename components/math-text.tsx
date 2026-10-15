import { mathExpressions } from '@/lib/math-expressions';
import { renderMath } from '@/lib/math-render';
import { MathProse } from '@/components/math-prose';
import type { ReactNode } from 'react';

export function MathText({
  children,
  tex,
}: {
  children: ReactNode;
  tex?: string;
}) {
  const expression =
    tex ??
    (typeof children === 'string' ? mathExpressions.get(children) : undefined);
  if (!expression)
    return (
      <span className="math-plain">
        <MathProse>{children}</MathProse>
      </span>
    );

  // Repository-authored TeX only. Invalid expressions fail the static build;
  // HTML extensions are disabled and MathML supplies screen-reader semantics.
  const html = renderMath(expression);
  return (
    <span
      className="math-text"
      data-math-source={typeof children === 'string' ? children : tex}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
