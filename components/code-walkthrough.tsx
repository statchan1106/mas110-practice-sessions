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
  lineNotes?: Array<{ reads: string; computes: string; changes: string }>;
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
    <div className="walk-matrix-card">
      <p className="mb-2 text-center font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
        {matrix.label}
      </p>
      <div className="overflow-x-auto pb-1">
        <figure
          className="walk-matrix-bracket min-w-max"
          style={{
            gridTemplateColumns: `repeat(${columnCount}, minmax(2.1rem, 1fr))`,
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
      className="walk-graph overflow-x-auto"
      aria-label={`${label}. ${graph.nodes.length} nodes and ${graph.edges.length} edges.${activeEdges ? ` Active edges: ${activeEdges}.` : ''}`}
    >
      <svg
        viewBox="0 0 340 190"
        className="h-48 w-full min-w-[300px]"
        aria-hidden="true"
      >
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
      <p className="mt-1 text-xs leading-5 text-muted-foreground">
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
        <div className="mt-4 grid gap-3 xl:grid-cols-[repeat(auto-fit,minmax(170px,1fr))]">
          {visual.matrices.map((matrix) => (
            <MatrixView key={matrix.label} matrix={matrix} />
          ))}
        </div>
      )}
      {(visual.matrices || visual.graph) && (
        <div
          className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-[10px] text-muted-foreground"
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
        <p className="mt-4 border-l-2 border-primary pl-3 text-xs leading-5 text-muted-foreground">
          {visual.callout}
        </p>
      )}
    </div>
  );
}

type LineMeaning = {
  kind: string;
  reads: string;
  computes: string;
  changes: string;
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
      reads: 'No program values.',
      computes: 'Documents the intention of the next statement.',
      changes: 'Nothing in program state.',
    };
  if (/^(import |from )/.test(line))
    return {
      kind: 'import',
      reads: 'An installed Python package or symbol.',
      computes: 'Loads reusable functions into this notebook.',
      changes: 'Binds the imported module or name.',
    };
  if (line.startsWith('def '))
    return {
      kind: 'define',
      reads: 'The parameter names in the function signature.',
      computes: 'Creates a reusable procedure; its body does not run yet.',
      changes: 'Binds the new function name.',
    };
  if (line.startsWith('for '))
    return {
      kind: 'loop',
      reads: `The iteration range in “${line.replace(/:$/, '')}”.`,
      computes: 'Chooses the next loop index.',
      changes:
        'Only the loop cursor changes on this line; matrix entries change inside the body.',
    };
  if (line.startsWith('if '))
    return {
      kind: 'condition',
      reads: `The values used by “${line.replace(/:$/, '')}”.`,
      computes: 'Evaluates a Boolean condition.',
      changes: 'No matrix entry changes unless the indented branch runs.',
    };
  if (/^(else|elif|try|except)/.test(line))
    return {
      kind: 'control',
      reads: 'The outcome of the preceding branch or attempted operation.',
      computes: 'Selects which indented statements execute next.',
      changes: 'No numerical value changes on this line.',
    };
  if (line.startsWith('return '))
    return {
      kind: 'return',
      reads: line.slice(7),
      computes: 'Collects the function result.',
      changes: 'Ends this function call and passes the result outward.',
    };
  if (/^(print|display|assert)\b/.test(line))
    return {
      kind: line.startsWith('assert') ? 'check' : 'inspect',
      reads: line.replace(/^(print|display|assert)\s*/, ''),
      computes: line.startsWith('assert')
        ? 'Checks that the stated condition is true.'
        : 'Formats a value for inspection.',
      changes: 'The numerical state is unchanged.',
    };

  const assignment = line.match(/^(.+?)\s*(\+=|-=|\*=|\/=|=)\s*(.+)$/);
  if (assignment) {
    const [, left, operator, right] = assignment;
    const mutates = operator !== '=' || left.includes('[');
    return {
      kind: mutates ? 'mutate' : 'bind',
      reads: right,
      computes:
        operator === '='
          ? `Evaluates the expression on the right of “=”. ${step.explanation}`
          : `Combines the current ${left.trim()} with the right-hand expression using ${operator[0]}.`,
      changes: mutates
        ? `${left.trim()} is updated in place. ${step.drives}`
        : `${left.trim()} receives the computed value. ${step.drives}`,
    };
  }

  return {
    kind: 'call',
    reads: `The arguments in “${line}”.`,
    computes: step.explanation,
    changes: step.drives,
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
                Block {currentStep + 1} · {step.title}
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
    <dl className="line-meaning">
      <div>
        <dt>Reads</dt>
        <dd>{meaning.reads}</dd>
      </div>
      <div>
        <dt>Computes</dt>
        <dd>{meaning.computes}</dd>
      </div>
      <div>
        <dt>Changes</dt>
        <dd>{meaning.changes}</dd>
      </div>
    </dl>
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
            {variable.before ?? 'not bound'} <b aria-hidden="true">→</b>{' '}
            <strong className={cn(!revealed && 'is-hidden')}>
              {revealed ? variable.value : 'predict'}
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
      <section
        className="state-sheet"
        aria-label={`Before block ${stepNumber}`}
      >
        <span className="state-sheet-label">
          Before · B{String(stepNumber).padStart(2, '0')}
        </span>
        <VisualPanel visual={before} stateKey={`${stepNumber}-before`} />
      </section>
      <section
        className={cn('state-sheet is-after', !revealed && 'is-pending')}
        aria-label={`After block ${stepNumber}`}
      >
        <span className="state-sheet-label">
          After · B{String(stepNumber).padStart(2, '0')}
        </span>
        {revealed ? (
          <VisualPanel visual={after} stateKey={`${stepNumber}-after`} />
        ) : (
          <div className="state-prediction">
            <span>?</span>
            <p>
              Predict the changed row, entry, or variable before revealing this
              state.
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
    ? 'Explain next line'
    : !revealed
      ? 'Reveal resulting state'
      : !isLastStep
        ? 'Next source block'
        : 'Trace again';

  return (
    <section className="trace-workbench" aria-label={walkthrough.title}>
      <header className="trace-header">
        <div>
          <p className="section-kicker">
            {walkthrough.eyebrow} · Adapted teaching trace
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

      <output className="sr-only" aria-live="polite">
        {revealed
          ? `Resulting state for block ${stepIndex + 1} revealed.`
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
            <span>Block {stepIndex + 1} · teaching note</span>
            <h3>{step.title}</h3>
            <p>{step.explanation}</p>
            <small>
              <strong>Watch:</strong> {step.watchFor}
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
              <span>Before revealing</span>
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
