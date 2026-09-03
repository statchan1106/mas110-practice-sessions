'use client';

import { useId, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronDown,
  Play,
  RotateCcw,
} from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Progress,
  ProgressLabel,
  ProgressValue,
} from '@/components/ui/progress';
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
      <p className="mb-2 text-center font-mono text-[11px] uppercase tracking-[0.1em] text-muted-foreground">
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
      <div className="mb-4">
        <h3 className="font-semibold">{visual.title}</h3>
        <p className="mt-1 text-sm leading-6 text-muted-foreground">
          {visual.description}
        </p>
      </div>
      {visual.equation && (
        <div className="mb-4 overflow-x-auto rounded-xl border bg-background px-4 py-3 text-center font-mono text-sm font-semibold text-primary">
          {visual.equation}
        </div>
      )}
      {visual.graph && (
        <GraphView graph={visual.graph} label={visual.description} />
      )}
      {visual.matrices && (
        <div className="grid gap-3 xl:grid-cols-[repeat(auto-fit,minmax(180px,1fr))]">
          {visual.matrices.map((matrix) => (
            <MatrixView key={matrix.label} matrix={matrix} />
          ))}
        </div>
      )}
      {(visual.matrices || visual.graph) && (
        <div
          className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-[11px] text-muted-foreground"
          aria-label="Visual state legend"
        >
          <span className="walk-legend">
            <i className="walk-legend-source" />
            source or pivot
          </span>
          <span className="walk-legend">
            <i className="walk-legend-target" />
            target or attention
          </span>
          <span className="walk-legend">
            <i className="walk-legend-result" />
            new result
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

function SourceList({
  steps,
  stepIndex,
  unlockedThrough,
  onSelect,
}: {
  steps: WalkthroughStep[];
  stepIndex: number;
  unlockedThrough: number;
  onSelect: (index: number) => void;
}) {
  return (
    <ol className="code-walkthrough-window" aria-label="Teaching code sequence">
      {steps.map((item, index) => {
        const completed = index < unlockedThrough;
        const active = index === stepIndex;
        const available = index <= unlockedThrough;
        return (
          <li key={`${item.code}-${index}`}>
            <button
              type="button"
              disabled={!available}
              onClick={() => available && onSelect(index)}
              className={cn(
                'code-walkthrough-line',
                active && 'is-active',
                completed && 'is-complete',
              )}
              aria-current={active ? 'step' : undefined}
              aria-label={`Step ${index + 1}: ${item.title}${completed ? ', executed' : active ? ', ready' : ', locked'}`}
            >
              <span className="code-walkthrough-number">
                {completed ? (
                  <Check className="size-3" aria-hidden="true" />
                ) : (
                  index + 1
                )}
              </span>
              <code>{item.code}</code>
            </button>
          </li>
        );
      })}
    </ol>
  );
}

function ExplanationCard({
  step,
  index,
}: {
  step: WalkthroughStep;
  index: number;
}) {
  return (
    <div className="rounded-xl border bg-muted/35 p-4">
      <p className="text-[11px] uppercase tracking-[0.1em] text-primary">
        What code step {index + 1} controls
      </p>
      <h3 className="mt-1 font-semibold">{step.title}</h3>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        {step.explanation}
      </p>
      <div className="mt-3 rounded-lg bg-background p-3 text-xs leading-5">
        <strong>This code drives:</strong> {step.drives}
      </div>
      <p className="mt-3 text-xs leading-5 text-muted-foreground">
        <strong className="text-foreground">Watch for:</strong> {step.watchFor}
      </p>
    </div>
  );
}

function VariableCards({
  step,
  hasRun,
}: {
  step: WalkthroughStep;
  hasRun: boolean;
}) {
  if (!step.variables?.length) return null;
  return (
    <div className="grid gap-2 sm:grid-cols-2">
      {step.variables.map((variable) => (
        <div
          key={variable.name}
          className={cn(
            'rounded-lg border p-3 transition-colors',
            hasRun ? 'bg-background' : 'bg-muted/25',
          )}
        >
          <div className="flex items-center justify-between gap-3">
            <code className="text-xs font-semibold text-primary">
              {variable.name}
            </code>
            <code className="text-right text-xs">
              {hasRun
                ? variable.value
                : (variable.before ?? 'reveal after run')}
            </code>
          </div>
          <p className="mt-1 text-[11px] leading-4 text-muted-foreground">
            {variable.meaning}
          </p>
        </div>
      ))}
    </div>
  );
}

function StatePanel({
  visual,
  hasRun,
  stepIndex,
}: {
  visual: WalkthroughVisual;
  hasRun: boolean;
  stepIndex: number;
}) {
  return (
    <>
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <p className="text-xs text-muted-foreground">
            {hasRun
              ? `After step ${stepIndex + 1}`
              : `Before step ${stepIndex + 1}`}
          </p>
          <h3 className="mt-0.5 font-semibold">Visible program state</h3>
        </div>
        <span className={cn('state-indicator', hasRun && 'is-after')}>
          <span />
          {hasRun ? 'after' : 'before'}
        </span>
      </div>
      <div className="min-h-[280px] rounded-xl border bg-muted/22 p-4 sm:p-5">
        <VisualPanel
          visual={visual}
          stateKey={`${stepIndex}-${hasRun ? 'after' : 'before'}`}
        />
      </div>
    </>
  );
}

export function CodeWalkthrough({
  walkthrough,
}: {
  walkthrough: CodeWalkthroughData;
}) {
  const [stepIndex, setStepIndex] = useState(0);
  const [unlockedThrough, setUnlockedThrough] = useState(0);
  const step = walkthrough.steps[stepIndex];
  const hasRun = stepIndex < unlockedThrough;
  const isLast = stepIndex === walkthrough.steps.length - 1;
  const visible = hasRun
    ? step.after
    : stepIndex === 0
      ? walkthrough.initial
      : walkthrough.steps[stepIndex - 1].after;
  const progress = (unlockedThrough / walkthrough.steps.length) * 100;

  function runStep() {
    setUnlockedThrough((current) => Math.max(current, stepIndex + 1));
  }
  function nextStep() {
    if (hasRun && !isLast) setStepIndex((current) => current + 1);
  }
  function previousStep() {
    if (stepIndex > 0) setStepIndex((current) => current - 1);
  }
  function restart() {
    setStepIndex(0);
    setUnlockedThrough(0);
  }

  const nextControl = isLast ? (
    <Button
      type="button"
      size="lg"
      variant="secondary"
      onClick={restart}
      className="min-h-11"
    >
      <RotateCcw data-icon="inline-start" aria-hidden="true" />
      Run again
    </Button>
  ) : (
    <Button
      type="button"
      size="lg"
      onClick={nextStep}
      disabled={!hasRun}
      className="min-h-11"
    >
      Next step
      <ArrowRight data-icon="inline-end" aria-hidden="true" />
    </Button>
  );

  return (
    <section
      className="overflow-hidden rounded-2xl border bg-card/94 shadow-sm"
      aria-label={walkthrough.title}
    >
      <header className="border-b px-5 py-5 sm:px-7 sm:py-6">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.12em] text-primary">
              {walkthrough.eyebrow}
            </p>
            <h2 className="mt-1 text-xl font-semibold tracking-tight sm:text-2xl">
              {walkthrough.title}
            </h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
              {walkthrough.objective}
            </p>
            <p className="mt-2 text-xs text-muted-foreground">
              Here, <strong className="text-foreground">Run</strong> advances a
              faithful visual state model. Use the linked Colab notebook to
              execute the original Python.
            </p>
          </div>
          <Badge variant="outline" className="w-fit font-mono">
            STEP {stepIndex + 1} / {walkthrough.steps.length}
          </Badge>
        </div>
        <Progress value={progress} className="mt-5">
          <ProgressLabel>
            {unlockedThrough === walkthrough.steps.length
              ? 'Walkthrough complete'
              : `${unlockedThrough} steps executed`}
          </ProgressLabel>
          <ProgressValue>
            {(_formattedValue, value) => `${Math.round(value ?? 0)}%`}
          </ProgressValue>
        </Progress>
      </header>

      <output className="sr-only" aria-live="polite">
        {hasRun
          ? `Executed step ${stepIndex + 1}. ${step.after.title}`
          : `Step ${stepIndex + 1} is ready. ${step.title}`}
      </output>

      <div className="hidden lg:grid lg:grid-cols-[minmax(330px,0.86fr)_minmax(420px,1.14fr)]">
        <section className="border-r p-6" aria-label="Source code">
          <div className="mb-3 flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground">Teaching snippet</p>
              <h3 className="mt-0.5 font-semibold">
                Run the code step by step
              </h3>
            </div>
            <Badge variant={hasRun ? 'default' : 'secondary'}>
              {hasRun ? 'executed' : 'ready'}
            </Badge>
          </div>
          <SourceList
            steps={walkthrough.steps}
            stepIndex={stepIndex}
            unlockedThrough={unlockedThrough}
            onSelect={setStepIndex}
          />
          <div className="mt-5">
            <ExplanationCard step={step} index={stepIndex} />
          </div>
        </section>
        <section className="p-6" aria-label="Visualization and variables">
          <StatePanel visual={visible} hasRun={hasRun} stepIndex={stepIndex} />
          <div className="mt-4">
            <VariableCards step={step} hasRun={hasRun} />
          </div>
          <div className="mt-5 flex items-center justify-between gap-3 border-t pt-5">
            <Button
              type="button"
              variant="ghost"
              onClick={previousStep}
              disabled={stepIndex === 0}
              className="min-h-11"
            >
              <ArrowLeft data-icon="inline-start" aria-hidden="true" />
              Previous step
            </Button>
            {!hasRun ? (
              <Button
                type="button"
                size="lg"
                onClick={runStep}
                className="min-h-11"
              >
                <Play data-icon="inline-start" aria-hidden="true" />
                Run step {stepIndex + 1}
              </Button>
            ) : (
              nextControl
            )}
          </div>
        </section>
      </div>

      <div className="lg:hidden">
        <section className="p-5" aria-label="Current code step">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-xs font-medium text-primary">Current code</p>
            <Badge variant={hasRun ? 'default' : 'secondary'}>
              {hasRun ? 'executed' : 'ready'}
            </Badge>
          </div>
          <pre className="mobile-active-code">
            <code>{step.code}</code>
          </pre>
          {!hasRun && (
            <Button
              type="button"
              size="lg"
              onClick={runStep}
              className="mt-3 min-h-11 w-full"
            >
              <Play data-icon="inline-start" aria-hidden="true" />
              Run step {stepIndex + 1}
            </Button>
          )}
        </section>
        <section className="border-t p-5" aria-label="Visualization">
          <StatePanel visual={visible} hasRun={hasRun} stepIndex={stepIndex} />
        </section>
        <section
          className="space-y-4 border-t p-5"
          aria-label="Explanation and variables"
        >
          <ExplanationCard step={step} index={stepIndex} />
          <VariableCards step={step} hasRun={hasRun} />
          <details className="rounded-xl border bg-background">
            <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between px-4 py-3 text-sm font-medium">
              View all code steps
              <ChevronDown
                className="size-4 text-muted-foreground"
                aria-hidden="true"
              />
            </summary>
            <div className="border-t p-3">
              <SourceList
                steps={walkthrough.steps}
                stepIndex={stepIndex}
                unlockedThrough={unlockedThrough}
                onSelect={setStepIndex}
              />
            </div>
          </details>
          <div className="grid grid-cols-2 gap-2 border-t pt-4">
            <Button
              type="button"
              variant="ghost"
              onClick={previousStep}
              disabled={stepIndex === 0}
              className="min-h-11"
            >
              <ArrowLeft data-icon="inline-start" aria-hidden="true" />
              Previous
            </Button>
            {hasRun ? (
              nextControl
            ) : (
              <Button
                type="button"
                variant="secondary"
                disabled
                className="min-h-11"
              >
                Run first
              </Button>
            )}
          </div>
        </section>
      </div>
    </section>
  );
}
