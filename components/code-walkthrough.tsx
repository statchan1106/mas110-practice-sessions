'use client';

import { useId, useMemo, useState } from 'react';
import { ArrowLeft, ArrowRight, ChevronDown, RotateCcw } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export type CellTone =
  | 'source'
  | 'target'
  | 'result'
  | 'block-a'
  | 'block-b'
  | 'muted';

export type WalkthroughMatrix = {
  label: string;
  values: (string | number)[][];
  dividerBefore?: number;
  rowDividerBefore?: number;
  cellTones?: Record<string, CellTone>;
};

export type WalkthroughGraph = {
  nodes: Array<{
    id: string;
    label: string;
    x: number;
    y: number;
    tone?: 'source' | 'target' | 'result';
  }>;
  edges: Array<{
    from: string;
    to: string;
    active?: boolean;
    directed?: boolean;
  }>;
};

export type WalkthroughVisual = {
  title: string;
  description: string;
  equation?: string;
  matrices?: WalkthroughMatrix[];
  graph?: WalkthroughGraph;
  callout?: string;
};

export type WalkthroughStep = {
  sourceCell?: string;
  sourceKind?: 'source' | 'correction';
  code: string;
  lineNotes?: Array<{ action: string }>;
  title: string;
  explanation: string;
  drives: string;
  watchFor: string;
  variables?: Array<{
    name: string;
    value: string;
    meaning: string;
    before?: string;
  }>;
  after: WalkthroughVisual;
};

export type CodeWalkthroughData = {
  title: string;
  eyebrow: string;
  objective: string;
  source?: {
    filename: string;
    url: string;
    note: string;
  };
  initial: WalkthroughVisual;
  steps: WalkthroughStep[];
};

const toneClass: Record<CellTone, string> = {
  source: 'walk-cell-source',
  target: 'walk-cell-target',
  result: 'walk-cell-result',
  'block-a': 'walk-cell-block-a',
  'block-b': 'walk-cell-block-b',
  muted: 'walk-cell-muted',
};

const toneLabel: Record<CellTone, string> = {
  source: 'SOURCE',
  target: 'TARGET',
  result: 'NEW',
  'block-a': 'BLOCK A',
  'block-b': 'BLOCK B',
  muted: 'INACTIVE',
};

const toneOrder: CellTone[] = [
  'source',
  'target',
  'result',
  'block-a',
  'block-b',
  'muted',
];

function collectVisualTones(visual: WalkthroughVisual) {
  const tones = new Set<CellTone>();
  visual.matrices?.forEach((matrix) => {
    Object.values(matrix.cellTones ?? {}).forEach((tone) => tones.add(tone));
  });
  visual.graph?.nodes.forEach((node) => {
    if (node.tone) tones.add(node.tone);
  });
  return tones;
}

function MatrixView({ matrix }: { matrix: WalkthroughMatrix }) {
  const columnCount = matrix.values[0]?.length ?? 1;
  const spokenValues = matrix.values.map((row) => row.join(', ')).join('; ');
  return (
    <div className={cn('walk-matrix-card', columnCount >= 6 && 'is-dense')}>
      <p className="walk-matrix-label">{matrix.label}</p>
      <div className="walk-matrix-frame">
        <figure
          className="walk-matrix-bracket"
          style={{
            gridTemplateColumns: `repeat(${columnCount}, minmax(0, 1fr))`,
          }}
          aria-label={`${matrix.label}: ${spokenValues}`}
        >
          {matrix.values.flatMap((row, rowIndex) =>
            row.map((value, columnIndex) => {
              const tone = matrix.cellTones?.[`${rowIndex}-${columnIndex}`];
              return (
                <span
                  key={`${rowIndex}-${columnIndex}`}
                  aria-hidden="true"
                  className={cn(
                    'walk-matrix-cell',
                    matrix.dividerBefore === columnIndex &&
                      'walk-matrix-column-divider',
                    matrix.rowDividerBefore === rowIndex &&
                      'walk-matrix-row-divider',
                    tone && toneClass[tone],
                  )}
                >
                  {value}
                </span>
              );
            }),
          )}
        </figure>
      </div>
    </div>
  );
}

function GraphView({
  graph,
  label,
}: {
  graph: WalkthroughGraph;
  label: string;
}) {
  const markerId = useId().replace(/:/g, '');
  const nodeById = new Map(graph.nodes.map((node) => [node.id, node]));
  const activeEdges = graph.edges
    .filter((edge) => edge.active)
    .map((edge) => `${edge.from} to ${edge.to}`)
    .join(', ');
  return (
    <figure
      className="walk-graph"
      aria-label={`${label}. ${graph.nodes.length} nodes and ${graph.edges.length} edges.${activeEdges ? ` Active edges: ${activeEdges}.` : ''}`}
    >
      <svg viewBox="0 0 340 190" className="h-auto w-full" aria-hidden="true">
        <defs>
          <marker
            id={markerId}
            viewBox="0 0 10 10"
            refX="8"
            refY="5"
            markerWidth="5"
            markerHeight="5"
            orient="auto-start-reverse"
          >
            <path d="M 0 0 L 10 5 L 0 10 z" fill="currentColor" />
          </marker>
        </defs>
        {graph.edges.map((edge, index) => {
          const from = nodeById.get(edge.from);
          const to = nodeById.get(edge.to);
          if (!from || !to) return null;
          return (
            <line
              key={`${edge.from}-${edge.to}-${index}`}
              x1={from.x}
              y1={from.y}
              x2={to.x}
              y2={to.y}
              className={cn('walk-graph-edge', edge.active && 'is-active')}
              markerEnd={edge.directed ? `url(#${markerId})` : undefined}
            />
          );
        })}
        {graph.nodes.map((node) => (
          <g
            key={node.id}
            className={cn('walk-graph-node', node.tone && `is-${node.tone}`)}
          >
            <circle cx={node.x} cy={node.y} r="20" />
            <text x={node.x} y={node.y + 1}>
              {node.label}
            </text>
          </g>
        ))}
      </svg>
    </figure>
  );
}

function VisualPanel({
  visual,
  stateKey,
  showCallout = true,
}: {
  visual: WalkthroughVisual;
  stateKey: string;
  showCallout?: boolean;
}) {
  return (
    <div key={stateKey} className="walk-visual-enter">
      <h4 className="font-semibold">{visual.title}</h4>
      <p className="mt-1 text-base leading-7 text-muted-foreground">
        {visual.description}
      </p>
      {visual.equation && (
        <div className="walk-equation">{visual.equation}</div>
      )}
      {visual.graph && (
        <div className="mt-4">
          <GraphView graph={visual.graph} label={visual.description} />
        </div>
      )}
      {visual.matrices && (
        <div className="walk-matrix-list">
          {visual.matrices.map((matrix) => (
            <MatrixView key={matrix.label} matrix={matrix} />
          ))}
        </div>
      )}
      {showCallout && visual.callout && (
        <p className="mt-4 border-l-2 border-primary pl-3 text-base leading-7 text-muted-foreground">
          {visual.callout.replace(/^Think first:\s*/i, '')}
        </p>
      )}
    </div>
  );
}

type LineMeaning = {
  kind: string;
  action: string;
};

function inferLineMeaning(
  source: string,
  step: WalkthroughStep,
  lineIndex: number,
): LineMeaning {
  const supplied = step.lineNotes?.[lineIndex];
  if (supplied) return { kind: 'line action', action: supplied.action };
  const line = source.trim();
  if (line.startsWith('#'))
    return {
      kind: 'comment',
      action: 'Labels the next step without changing a value.',
    };
  if (/^(import |from )/.test(line))
    return {
      kind: 'import',
      action: 'Loads reusable code under the imported name.',
    };
  if (line.startsWith('def '))
    return {
      kind: 'define',
      action: 'Defines a function; its body runs only when called.',
    };
  if (line.startsWith('for '))
    return {
      kind: 'loop',
      action: 'Moves to the next loop index.',
    };
  if (line.startsWith('if '))
    return {
      kind: 'condition',
      action: 'Checks the condition and chooses a branch.',
    };
  if (line === 'try:')
    return {
      kind: 'control',
      action: 'Runs the following block and watches for an exception.',
    };
  if (line.startsWith('except'))
    return {
      kind: 'error handler',
      action:
        'Catches the matching exception and stores it under the stated name.',
    };
  if (/^(else|elif)/.test(line))
    return {
      kind: 'control',
      action: 'Chooses the next branch without changing a value itself.',
    };
  if (line === 'break')
    return {
      kind: 'control',
      action: 'Stops the current loop immediately.',
    };
  if (line === 'pass')
    return {
      kind: 'control',
      action: 'Intentionally makes no data change in this branch.',
    };
  if (line.startsWith('raise '))
    return {
      kind: 'error',
      action: 'Stops this function call with the stated error.',
    };
  if (line.startsWith('return '))
    return {
      kind: 'return',
      action: 'Returns the result and ends this function call.',
    };
  if (/^(print|display|assert)\b/.test(line))
    return {
      kind: line.startsWith('assert') ? 'check' : 'inspect',
      action: line.startsWith('assert')
        ? 'Checks the condition without changing the data.'
        : 'Shows a value without changing it.',
    };
  const closingExpression = line.replace(/[,;]$/, '');
  let onlyClosingCharacters = closingExpression.length > 0;
  for (const character of closingExpression) {
    if (!']})'.includes(character)) onlyClosingCharacters = false;
  }
  if ('[({'.includes(line.charAt(0)) || onlyClosingCharacters)
    return {
      kind: 'continue',
      action:
        'Continues or closes the multi-line array or function call started above.',
    };

  const assignment = line.match(/^(.+?)\s*(\+=|-=|\*=|\/=|=)\s*(.+)$/);
  if (assignment) {
    const [, left, operator, right] = assignment;
    const mutates = operator !== '=' || left.includes('[');
    return {
      kind: mutates ? 'update' : 'store',
      action:
        operator === '='
          ? /^[A-Za-z_]\w*\s*=/.test(right)
            ? 'Evaluates the rightmost expression and stores that value in each name.'
            : `Evaluates the right side and stores it as ${left.trim()}.`
          : `Applies “${operator}” and updates ${left.trim()}.`,
    };
  }

  return {
    kind: 'call',
    action: 'Runs the function call.',
  };
}

function splitLines(step: WalkthroughStep) {
  return step.code.split('\n').filter((line) => line.trim().length > 0);
}

function SourceList({
  steps,
  stepIndex,
  lineIndex,
  unlockedThrough,
  onSelect,
}: {
  steps: WalkthroughStep[];
  stepIndex: number;
  lineIndex: number;
  unlockedThrough: number;
  onSelect: (step: number, line: number) => void;
}) {
  const sourceLines = steps.flatMap((step, currentStep) => {
    const offset = steps
      .slice(0, currentStep)
      .reduce((count, item) => count + splitLines(item).length, 0);
    return splitLines(step).map((line, currentLine) => ({
      step,
      currentStep,
      currentLine,
      line,
      number: offset + currentLine + 1,
    }));
  });
  return (
    <ol className="trace-source" aria-label="Teaching trace source lines">
      {sourceLines.map(({ step, currentStep, currentLine, line, number }) => {
        const available = currentStep <= unlockedThrough;
        const active = currentStep === stepIndex && currentLine === lineIndex;
        const complete = currentStep < unlockedThrough;
        return (
          <li key={`${currentStep}-${currentLine}`}>
            {currentLine === 0 && (
              <span
                className={cn(
                  'trace-block-label',
                  step.sourceKind === 'correction' && 'is-correction',
                )}
              >
                {step.sourceCell ? `${step.sourceCell} · ` : ''}
                {step.title}
              </span>
            )}
            <button
              type="button"
              disabled={!available}
              onClick={() => available && onSelect(currentStep, currentLine)}
              className={cn(
                'trace-source-line',
                active && 'is-active',
                complete && 'is-complete',
              )}
              aria-current={active ? 'step' : undefined}
            >
              <span>L{String(number).padStart(2, '0')}</span>
              <code>{line}</code>
            </button>
          </li>
        );
      })}
    </ol>
  );
}

function MeaningLedger({
  meaning,
  explanation,
}: {
  meaning: LineMeaning;
  explanation: string;
}) {
  return (
    <div>
      <dl className="line-meaning">
        <div>
          <dt>Code</dt>
          <dd>{meaning.action}</dd>
        </div>
        <div>
          <dt>Why</dt>
          <dd>{explanation}</dd>
        </div>
      </dl>
    </div>
  );
}

function VariableLedger({
  step,
  revealed,
}: {
  step: WalkthroughStep;
  revealed: boolean;
}) {
  if (!step.variables?.length) return null;
  return (
    <div className="variable-ledger">
      {step.variables.map((variable) => (
        <div key={variable.name}>
          <code>{variable.name}</code>
          <span>
            {variable.before ?? 'not stored'} <b aria-hidden="true">→</b>{' '}
            <strong className={cn(!revealed && 'is-hidden')}>
              {revealed ? variable.value : '?'}
            </strong>
          </span>
          <small>{variable.meaning}</small>
        </div>
      ))}
    </div>
  );
}

function StateComparison({
  before,
  after,
  revealed,
  stepNumber,
}: {
  before: WalkthroughVisual;
  after: WalkthroughVisual;
  revealed: boolean;
  stepNumber: number;
}) {
  const usedTones = new Set([
    ...collectVisualTones(before),
    ...collectVisualTones(after),
  ]);
  const legendTones = toneOrder.filter((tone) => usedTones.has(tone));

  return (
    <div className="state-compare-grid">
      <section className="state-sheet" aria-label={`Before step ${stepNumber}`}>
        <span className="state-sheet-label">Before</span>
        <VisualPanel
          visual={before}
          stateKey={`${stepNumber}-before`}
          showCallout={false}
        />
      </section>
      <section
        className={cn('state-sheet is-after', !revealed && 'is-pending')}
        aria-label={`After step ${stepNumber}`}
      >
        <span className="state-sheet-label">After</span>
        {revealed ? (
          <VisualPanel visual={after} stateKey={`${stepNumber}-after`} />
        ) : (
          <div className="state-prediction">
            <span>?</span>
            <p>Reveal to compare.</p>
          </div>
        )}
      </section>
      {legendTones.length > 0 && (
        <div className="walk-legend-row" aria-label="Visual state legend">
          {legendTones.map((tone) => (
            <span className="walk-legend" key={tone}>
              <i className={toneClass[tone]} />
              {toneLabel[tone]}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

export function CodeWalkthrough({
  walkthrough,
}: {
  walkthrough: CodeWalkthroughData;
}) {
  const [stepIndex, setStepIndex] = useState(0);
  const [lineIndex, setLineIndex] = useState(0);
  const [unlockedThrough, setUnlockedThrough] = useState(0);
  const step = walkthrough.steps[stepIndex];
  const lines = splitLines(step);
  const revealed = stepIndex < unlockedThrough;
  const isLastStep = stepIndex === walkthrough.steps.length - 1;
  const isLastLine = lineIndex === lines.length - 1;
  const totalLines = useMemo(
    () =>
      walkthrough.steps.reduce(
        (count, item) => count + splitLines(item).length,
        0,
      ),
    [walkthrough.steps],
  );
  const globalLine =
    walkthrough.steps
      .slice(0, stepIndex)
      .reduce((count, item) => count + splitLines(item).length, 0) +
    lineIndex +
    1;
  const meaning = inferLineMeaning(lines[lineIndex], step, lineIndex);
  const before =
    stepIndex === 0
      ? walkthrough.initial
      : walkthrough.steps[stepIndex - 1].after;

  function selectLine(nextStep: number, nextLine: number) {
    setStepIndex(nextStep);
    setLineIndex(nextLine);
  }
  function previousLine() {
    if (lineIndex > 0) setLineIndex((current) => current - 1);
    else if (stepIndex > 0) {
      const previous = stepIndex - 1;
      setStepIndex(previous);
      setLineIndex(splitLines(walkthrough.steps[previous]).length - 1);
    }
  }
  function advance() {
    if (!isLastLine) {
      setLineIndex((current) => current + 1);
      return;
    }
    if (!revealed) {
      setUnlockedThrough((current) => Math.max(current, stepIndex + 1));
      return;
    }
    if (!isLastStep) {
      setStepIndex((current) => current + 1);
      setLineIndex(0);
      return;
    }
    setStepIndex(0);
    setLineIndex(0);
    setUnlockedThrough(0);
  }

  const actionLabel = !isLastLine
    ? 'Next line'
    : !revealed
      ? 'Reveal change'
      : !isLastStep
        ? 'Next step'
        : 'Trace again';

  return (
    <section className="trace-workbench" aria-label={walkthrough.title}>
      <header className="trace-header">
        <div>
          <p className="section-kicker">{walkthrough.eyebrow}</p>
          <h2>{walkthrough.title}</h2>
          <p className="trace-objective">{walkthrough.objective}</p>
          {walkthrough.source && (
            <p className="trace-source-meta">
              <strong>Notebook-led trace</strong>
              <span aria-hidden="true">·</span>
              <a href={walkthrough.source.url} target="_blank" rel="noreferrer">
                {walkthrough.source.filename} ↗
              </a>
              <span>{walkthrough.source.note}</span>
            </p>
          )}
        </div>
      </header>

      <output className="sr-only" aria-live="polite">
        {revealed
          ? `Line ${globalLine}: ${lines[lineIndex]}. Expected result for step ${stepIndex + 1} is shown.`
          : `Line ${globalLine}: ${lines[lineIndex]}`}
      </output>

      <div
        className="trace-causal-bar"
        aria-label={`Line ${globalLine} of ${totalLines}`}
      >
        <span>
          L{String(globalLine).padStart(2, '0')} / {totalLines}
        </span>
        <strong>
          {step.sourceCell ? `${step.sourceCell} · ` : ''}
          {revealed ? step.after.title : step.title}
        </strong>
      </div>

      <div className="trace-grid">
        <aside
          className="trace-code-pane"
          aria-label="Python source and line explanation"
        >
          <div className="hidden min-[1680px]:block">
            <SourceList
              steps={walkthrough.steps}
              stepIndex={stepIndex}
              lineIndex={lineIndex}
              unlockedThrough={unlockedThrough}
              onSelect={selectLine}
            />
          </div>

          <div className="active-line-card">
            <div>
              {step.sourceCell && (
                <b
                  className={cn(
                    'trace-source-kind',
                    step.sourceKind === 'correction' && 'is-correction',
                  )}
                >
                  {step.sourceKind === 'correction'
                    ? 'corrected variant'
                    : 'source notebook'}
                </b>
              )}
              <b>{meaning.kind}</b>
            </div>
            <pre>
              <code>{lines[lineIndex]}</code>
            </pre>
          </div>
          <MeaningLedger meaning={meaning} explanation={step.explanation} />

          <details className="trace-mobile-source min-[1680px]:hidden">
            <summary>
              All traced lines{' '}
              <ChevronDown className="size-4" aria-hidden="true" />
            </summary>
            <SourceList
              steps={walkthrough.steps}
              stepIndex={stepIndex}
              lineIndex={lineIndex}
              unlockedThrough={unlockedThrough}
              onSelect={selectLine}
            />
          </details>
        </aside>

        <section
          className="trace-state-pane"
          aria-label="Before and after visualization"
        >
          <div className="xl:sticky xl:top-20">
            <div className="trace-prediction">
              <span>Predict</span>
              <p>{step.watchFor}</p>
            </div>
            <StateComparison
              before={before}
              after={step.after}
              revealed={revealed}
              stepNumber={stepIndex + 1}
            />
            <VariableLedger step={step} revealed={revealed} />
            <div className="trace-controls">
              <Button
                type="button"
                variant="ghost"
                onClick={previousLine}
                disabled={stepIndex === 0 && lineIndex === 0}
              >
                <ArrowLeft data-icon="inline-start" aria-hidden="true" />
                Previous line
              </Button>
              <Button type="button" onClick={advance}>
                {isLastStep && isLastLine && revealed ? (
                  <RotateCcw data-icon="inline-start" aria-hidden="true" />
                ) : null}
                {actionLabel}
                {!(isLastStep && isLastLine && revealed) && (
                  <ArrowRight data-icon="inline-end" aria-hidden="true" />
                )}
              </Button>
            </div>
          </div>
        </section>
      </div>
    </section>
  );
}
