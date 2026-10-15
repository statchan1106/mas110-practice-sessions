import { Children, cloneElement, isValidElement, type ReactNode } from 'react';
import { splitMathProse } from '@/lib/math-prose';
import { renderMath } from '@/lib/math-render';

const literalTags = new Set([
  'code',
  'pre',
  'svg',
  'math',
  'script',
  'style',
  'textarea',
  'option',
]);

function typeset(children: ReactNode): ReactNode {
  if (typeof children === 'string') {
    if (!children.includes('$') && !children.includes('`')) return children;
    return splitMathProse(children).map((part, index) => {
      if (part.kind === 'text') return part.value;
      if (part.kind === 'code')
        return (
          <code key={index} data-prose-code>
            {part.value}
          </code>
        );
      return (
        <span
          key={index}
          className="inline-math"
          data-math-source={part.value}
          dangerouslySetInnerHTML={{ __html: renderMath(part.value) }}
        />
      );
    });
  }
  return Children.map(children, (child) => {
    if (typeof child === 'string') return typeset(child);
    if (!isValidElement<{ children?: ReactNode }>(child)) return child;
    // Visit authored children only, never arbitrary component props or source
    // code, SVG labels, form values, or already-rendered math.
    if (typeof child.type === 'string' && literalTags.has(child.type))
      return child;
    if (
      'dangerouslySetInnerHTML' in child.props ||
      typeof child.props.children === 'function'
    )
      return child;
    return cloneElement(child, {}, typeset(child.props.children));
  });
}

export function MathProse({ children }: { children: ReactNode }) {
  return <>{typeset(children)}</>;
}

export function renderMathProse(children: ReactNode) {
  return typeset(children);
}
