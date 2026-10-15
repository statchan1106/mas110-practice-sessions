import { renderMath } from '@/lib/math-render';

export type ProsePart = { kind: 'text' | 'math' | 'code'; value: string };

// Only author-marked $TeX$ and `code` are interpreted. Ordinary prose, Python
// operators, and dollar amounts are never guessed to be mathematical notation.
export function splitMathProse(text: string): ProsePart[] {
  const parts: ProsePart[] = [];
  const marked = /`([^`\n]+)`|(?<!\\)\$((?:\\.|[^$\\])+?)\$/g;
  let start = 0;
  for (const match of text.matchAll(marked)) {
    if (match.index > start)
      parts.push({ kind: 'text', value: text.slice(start, match.index) });
    parts.push({
      kind: match[1] === undefined ? 'math' : 'code',
      value: match[1] ?? match[2],
    });
    start = match.index + match[0].length;
  }
  if (start < text.length)
    parts.push({ kind: 'text', value: text.slice(start) });
  return parts;
}

export function plainMathProse(text: string) {
  return splitMathProse(text)
    .map((part) => {
      if (part.kind !== 'math') return part.value;
      const mathml =
        renderMath(part.value).match(/<math\b[\s\S]*?<\/math>/)?.[0] ?? '';
      return mathml
        .replace(/<annotation\b[\s\S]*?<\/annotation>/g, '')
        .replace(/<[^>]+>/g, '')
        .replace(/&#x([\da-f]+);/gi, (_, hex) =>
          String.fromCodePoint(parseInt(hex, 16)),
        )
        .replace(/&#(\d+);/g, (_, decimal) =>
          String.fromCodePoint(Number(decimal)),
        )
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&amp;/g, '&')
        .replace(/&nbsp;/g, ' ');
    })
    .join('');
}
