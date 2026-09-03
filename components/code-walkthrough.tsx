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
  code: string;
  lineNotes?: Array<{ uses: string; does: string; updates: string }>;
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
}: {
  visual: WalkthroughVisual;
  stateKey: string;
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
      {(visual.matrices || visual.graph) && (
        <div
          className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-sm text-muted-foreground"
          aria-label="Visual state legend"
        >
          <span className="walk-legend">
            <i className="walk-legend-source" />
            PIVOT / SOURCE
          </span>
          <span className="walk-legend">
            <i className="walk-legend-target" />
            TARGET
          </span>
          <span className="walk-legend">
            <i className="walk-legend-result" />
            NEW
          </span>
        </div>
      )}
      {visual.callout && (
        <p className="mt-4 border-l-2 border-primary pl-3 text-base leading-7 text-muted-foreground">
          {visual.callout}
        </p>
      )}
    </div>
  );
}

type LineMeaning = {
  kind: string;
  uses: string;
  does: string;
  updates: string;
};

function inferLineMeaning(
  source: string,
  step: WalkthroughStep,
  lineIndex: number,
): LineMeaning {
  const supplied = step.lineNotes?.[lineIndex];
  if (supplied) return { kind: 'notebook line', ...supplied };
  const line = source.trim();
  if (line.startsWith('#'))
    return {
      kind: 'comment',
      uses: 'No program values.',
      does: 'Documents the intention of the next statement.',
      updates: 'Nothing in program state.',
    };
  if (/^(import |from )/.test(line))
    return {
      kind: 'import',
      uses: 'An installed Python package or symbol.',
      does: 'Loads reusable functions into this notebook.',
      updates: 'Stores the imported module or name.',
    };
  if (line.startsWith('def '))
    return {
      kind: 'define',
      uses: 'The parameter names in the function signature.',
      does: 'Creates a reusable procedure; its body does not run yet.',
      updates: 'Stores the new function name.',
    };
  if (line.startsWith('for '))
    return {
      kind: 'loop',
      uses: `The iteration range in “${line.replace(/:$/, '')}”.`,
      does: 'Chooses the next loop index.',
      updates:
        'Only the loop cursor changes on this line; matrix entries change inside the body.',
    };
  if (line.startsWith('if '))
    return {
      kind: 'condition',
      uses: `The values used by “${line.replace(/:$/, '')}”.`,
      does: 'Evaluates a Boolean condition.',
      updates: 'No matrix entry changes unless the indented branch runs.',
    };
  if (/^(else|elif|try|except)/.test(line))
    return {
      kind: 'control',
      uses: 'The outcome of the preceding branch or attempted operation.',
      does: 'Selects which indented statements execute next.',
      updates: 'No numerical value changes on this line.',
    };
  if (line.startsWith('return '))
    return {
      kind: 'return',
      uses: line.slice(7),
      does: 'Collects the function result.',
      updates: 'Ends this function call and passes the result outward.',
    };
  if (/^(print|display|assert)\b/.test(line))
    return {
      kind: line.startsWith('assert') ? 'check' : 'inspect',
      uses: line.replace(/^(print|display|assert)\s*/, ''),
      does: line.startsWith('assert')
        ? 'Checks that the stated condition is true.'
        : 'Formats a value for inspection.',
      updates: 'The numerical state is unchanged.',
    };

  const assignment = line.match(/^(.+?)\s*(\+=|-=|\*=|\/=|=)\s*(.+)$/);
  if (assignment) {
    const [, left, operator, right] = assignment;
    const mutates = operator !== '=' || left.includes('[');
    return {
      kind: mutates ? 'update' : 'store',
      uses: right,
      does:
        operator === '='
          ? `Evaluates the expression on the right of “=”. ${step.explanation}`
          : `Combines the current ${left.trim()} with the right-hand expression using ${operator[0]}.`,
      updates: mutates
        ? `${left.trim()} is updated in place. ${step.drives}`
        : `${left.trim()} receives the computed value. ${step.drives}`,
    };
  }

  return {
    kind: 'call',
    uses: `The arguments in “${line}”.`,
    does: step.explanation,
    updates: step.drives,
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
              <span className="trace-block-label">
                Step {currentStep + 1} · {step.title}
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

function MeaningLedger({ meaning }: { meaning: LineMeaning }) {
  return (
    <div>
      <p className="line-meaning-key">
        <strong>What this line does</strong> · Uses = values it looks at · Does
        = its operation · Updates = what changes
      </p>
      <dl className="line-meaning">
        <div>
          <dt>Uses</dt>
          <dd>{meaning.uses}</dd>
        </div>
        <div>
          <dt>Does</dt>
          <dd>{meaning.does}</dd>
        </div>
        <div>
          <dt>Updates</dt>
          <dd>{meaning.updates}</dd>
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
              {revealed ? variable.value : 'think first'}
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
  return (
    <div className="state-compare-grid">
      <section className="state-sheet" aria-label={`Before step ${stepNumber}`}>
        <span className="state-sheet-label">Before step {stepNumber}</span>
        <VisualPanel visual={before} stateKey={`${stepNumber}-before`} />
      </section>
      <section
        className={cn('state-sheet is-after', !revealed && 'is-pending')}
        aria-label={`After step ${stepNumber}`}
      >
        <span className="state-sheet-label">After step {stepNumber}</span>
        {revealed ? (
          <VisualPanel visual={after} stateKey={`${stepNumber}-after`} />
        ) : (
          <div className="state-prediction">
            <span>?</span>
            <p>
              Think about which row, entry, or variable will change. Then show
              the expected before-and-after. This page does not run Python.
            </p>
          </div>
        )}
      </section>
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
      ? 'Show expected result'
      : !isLastStep
        ? 'Next code step'
        : 'Trace again';

  return (
    <section className="trace-workbench" aria-label={walkthrough.title}>
      <header className="trace-header">
        <div>
          <p className="section-kicker">
            {walkthrough.eyebrow} · Guided code trace
          </p>
          <h2>{walkthrough.title}</h2>
          <p>{walkthrough.objective}</p>
        </div>
        <div
          className="trace-progress"
          aria-label={`Line ${globalLine} of ${totalLines}`}
        >
          <strong>L{String(globalLine).padStart(2, '0')}</strong>
          <span>/ {totalLines} source lines</span>
        </div>
      </header>

      <p className="trace-mode-note">
        <strong>How it works:</strong> choose a line, see what it uses, does,
        and updates, think about the result, then show the expected change. The
        full Python code runs in Colab.
      </p>

      <output className="sr-only" aria-live="polite">
        {revealed
          ? `Line ${globalLine}: ${lines[lineIndex]}. Expected result for step ${stepIndex + 1} is shown.`
          : `Line ${globalLine}: ${lines[lineIndex]}`}
      </output>

      <div className="trace-causal-bar">
        <span>L{String(globalLine).padStart(2, '0')}</span>
        <code>{lines[lineIndex].trim()}</code>
        <ArrowRight className="size-3.5" aria-hidden="true" />
        <strong>{revealed ? step.after.title : step.title}</strong>
      </div>

      <div className="trace-grid">
        <aside
          className="trace-code-pane"
          aria-label="Python source and line explanation"
        >
          <div className="hidden lg:block">
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
              <span>L{String(globalLine).padStart(2, '0')}</span>
              <b>{meaning.kind}</b>
            </div>
            <pre>
              <code>{lines[lineIndex]}</code>
            </pre>
          </div>
          <MeaningLedger meaning={meaning} />

          <div className="trace-teaching-note">
            <span>Step {stepIndex + 1} · why it matters</span>
            <h3>{step.title}</h3>
            <p>{step.explanation}</p>
            <small>
              <strong>Think first:</strong> {step.watchFor}
            </small>
          </div>

          <details className="trace-mobile-source lg:hidden">
            <summary>
              View every source line{' '}
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
          <div className="lg:sticky lg:top-24">
            <div className="trace-prediction">
              <span>Think first</span>
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
