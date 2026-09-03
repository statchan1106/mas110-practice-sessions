'use client';

import { useMemo, useState } from 'react';
import { ArrowLeft, ArrowRight, Check, Eye, RotateCcw } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress, ProgressLabel, ProgressValue } from '@/components/ui/progress';
import type { Lesson } from '@/lib/lesson-data';
import { cn } from '@/lib/utils';

function formatNumber(value: number) {
  const normalized = Math.abs(value) < 1e-10 ? 0 : value;
  return Number.isInteger(normalized) ? String(normalized) : String(Number(normalized.toFixed(2)));
}

function RowVector({ values }: { values: number[] }) {
  return (
    <span className="mini-row" aria-label={values.map(formatNumber).join(', ')}>
      {values.map((value, index) => (
        <span key={`${value}-${index}`} className={cn(index === values.length - 1 && 'mini-row-augmented')}>
          {formatNumber(value)}
        </span>
      ))}
    </span>
  );
}

export function LessonPlayer({ lesson }: { lesson: Lesson }) {
  const [stepIndex, setStepIndex] = useState(0);
  const [choice, setChoice] = useState('');
  const [checked, setChecked] = useState(false);
  const [showMeaning, setShowMeaning] = useState(false);
  const [executed, setExecuted] = useState(false);

  const step = lesson.steps[stepIndex];
  const isComplete = stepIndex === lesson.steps.length - 1;
  const isCorrect = checked && choice === step.answer;
  const nextMatrix = isComplete ? step.matrix : lesson.steps[stepIndex + 1].matrix;
  const visibleMatrix = executed ? nextMatrix : step.matrix;
  const progress = ((stepIndex + (executed ? 1 : 0)) / (lesson.steps.length - 1)) * 100;
  const matrixLabel = useMemo(
    () => visibleMatrix.map((row) => row.join(', ')).join('; '),
    [visibleMatrix],
  );

  const hasOperation =
    !isComplete &&
    step.pivotRow !== null &&
    step.targetRow !== null &&
    step.pivotColumn !== null;
  const factor = hasOperation ? Number(step.answer) : 0;
  const sourceRow = hasOperation ? step.matrix[step.pivotRow!] : [];
  const targetRowBefore = hasOperation ? step.matrix[step.targetRow!] : [];
  const targetRowAfter = hasOperation ? nextMatrix[step.targetRow!] : [];
  const targetValue = hasOperation ? step.matrix[step.targetRow!][step.pivotColumn!] : 0;
  const pivotValue = hasOperation ? step.matrix[step.pivotRow!][step.pivotColumn!] : 0;
  const resultValue = hasOperation ? nextMatrix[step.targetRow!][step.pivotColumn!] : 0;

  function resetReflection() {
    setChoice('');
    setChecked(false);
    setShowMeaning(false);
    setExecuted(false);
  }

  function goNext() {
    if (stepIndex >= lesson.steps.length - 1) return;
    setStepIndex((current) => current + 1);
    resetReflection();
  }

  function goPrevious() {
    if (stepIndex <= 0) return;
    setStepIndex((current) => current - 1);
    resetReflection();
  }

  function restart() {
    setStepIndex(0);
    resetReflection();
  }

  function runOperation() {
    if (!isCorrect) return;
    setExecuted(true);
    setShowMeaning(true);
  }

  return (
    <Card className="lesson-shell bg-card/94 py-0 backdrop-blur-sm">
      <CardHeader className="border-b px-5 py-5 sm:px-7 sm:py-6">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
          <div>
            <p className="mb-1 font-mono text-xs uppercase tracking-[0.12em] text-primary">{lesson.eyebrow}</p>
            <CardTitle className="text-xl sm:text-2xl">{lesson.title}</CardTitle>
            <CardDescription className="mt-1.5">Predict first. Then reveal exactly how one entry cancels to zero.</CardDescription>
          </div>
          <Badge variant="outline" className="font-mono">STEP {stepIndex + 1} / {lesson.steps.length}</Badge>
        </div>
        <Progress value={progress} className="mt-5">
          <ProgressLabel>{step.shortLabel}</ProgressLabel>
          <ProgressValue>
            {(_formattedValue, value) => `${Math.round(value ?? 0)}%`}
          </ProgressValue>
        </Progress>
      </CardHeader>

      <CardContent className="grid gap-0 p-0 lg:grid-cols-[180px_minmax(360px,1.05fr)_minmax(340px,0.95fr)]">
        <aside className="border-b bg-muted/42 p-4 lg:border-r lg:border-b-0" aria-label="Walkthrough steps">
          <p className="mb-3 px-2 text-xs font-medium uppercase tracking-[0.1em] text-muted-foreground">Learning path</p>
          <ol className="grid gap-1.5 sm:grid-cols-4 lg:grid-cols-1">
            {lesson.steps.map((item, index) => {
              const active = index === stepIndex;
              const done = index < stepIndex;
              return (
                <li key={item.label}>
                  <button
                    type="button"
                    onClick={() => {
                      if (index <= stepIndex) {
                        setStepIndex(index);
                        resetReflection();
                      }
                    }}
                    disabled={index > stepIndex}
                    aria-current={active ? 'step' : undefined}
                    className={cn(
                      'flex min-h-12 w-full items-center gap-3 rounded-lg px-2.5 py-2 text-left text-sm transition-colors',
                      active && 'bg-background text-foreground shadow-sm ring-1 ring-foreground/8',
                      !active && 'text-muted-foreground',
                      index <= stepIndex && 'hover:bg-background/70',
                    )}
                  >
                    <span
                      className={cn(
                        'grid size-6 shrink-0 place-items-center rounded-full border font-mono text-[11px]',
                        active && 'border-primary bg-primary text-primary-foreground',
                        done && 'border-primary/30 bg-primary/12 text-primary',
                      )}
                    >
                      {done ? <Check className="size-3.5" aria-hidden="true" /> : index + 1}
                    </span>
                    <span className="hidden leading-5 lg:block">{item.label}</span>
                    <span className="leading-5 lg:hidden">{item.shortLabel}</span>
                  </button>
                </li>
              );
            })}
          </ol>
        </aside>

        <section className="border-b p-5 sm:p-7 lg:border-r lg:border-b-0" aria-labelledby="matrix-heading">
          <div className="mb-4 flex items-start justify-between gap-3">
            <div>
              <p className="text-xs text-muted-foreground">{executed ? 'After the row operation' : 'Before the row operation'}</p>
              <h3 id="matrix-heading" className="mt-1 font-semibold">Augmented matrix [A | b]</h3>
            </div>
            {!isComplete && <Badge variant={executed ? 'default' : 'secondary'}>{executed ? 'entry cancelled' : `pivot column ${Number(step.pivotColumn) + 1}`}</Badge>}
          </div>

          {!isComplete && (
            <div className="mb-2 flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-muted-foreground" aria-label="Matrix color legend">
              <span className="flex items-center gap-1.5"><span className="size-2.5 rounded-full bg-primary" />Pivot row stays fixed</span>
              <span className="flex items-center gap-1.5"><span className={cn('size-2.5 rounded-full', executed ? 'bg-emerald-500' : 'bg-amber-500')} />Target row {executed ? 'updated' : 'will change'}</span>
            </div>
          )}

          <div className="mx-auto max-w-sm py-4" role="img" aria-label={`Current augmented matrix: ${matrixLabel}`}>
            <div className="matrix-bracket">
              {visibleMatrix.flatMap((row, rowIndex) =>
                row.map((value, columnIndex) => {
                  const pivot = rowIndex === step.pivotRow;
                  const target = rowIndex === step.targetRow;
                  const eliminated = target && columnIndex === step.pivotColumn;
                  return (
                    <span
                      key={`${rowIndex}-${columnIndex}`}
                      className={cn(
                        'matrix-cell',
                        columnIndex === row.length - 1 && 'matrix-cell-separator',
                        pivot && 'matrix-cell-source',
                        target && !executed && 'matrix-cell-target',
                        target && executed && 'matrix-cell-result',
                        eliminated && !executed && 'matrix-cell-to-cancel',
                        eliminated && executed && 'elimination-zero',
                      )}
                    >
                      {formatNumber(value)}
                    </span>
                  );
                }),
              )}
            </div>
          </div>

          {hasOperation && (
            <div className={cn('operation-stage', executed && 'is-executed')} aria-live="polite">
              <div className="mb-3 flex items-center justify-between gap-3">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.1em] text-muted-foreground">The cancellation</p>
                  <p className="mt-0.5 font-mono text-sm font-semibold">{step.operation}</p>
                </div>
                <Badge variant="outline" className="font-mono">factor = {formatNumber(factor)}</Badge>
              </div>

              <div className="cancellation-track" aria-label={`${targetValue} minus ${factor} times ${pivotValue} equals ${resultValue}`}>
                <span className="cancellation-term is-target">{formatNumber(targetValue)}</span>
                <span aria-hidden="true">−</span>
                <span className="cancellation-term is-source">({formatNumber(factor)} × {formatNumber(pivotValue)})</span>
                <span aria-hidden="true">=</span>
                <span className={cn('cancellation-result', executed && 'is-zero')}>{executed ? formatNumber(resultValue) : '?'}</span>
              </div>

              <div className="mt-4 grid items-center gap-2 text-xs sm:grid-cols-[1fr_auto_1fr_auto_1fr]">
                <div className="row-chip is-target">
                  <span>target R{Number(step.targetRow) + 1}</span>
                  <RowVector values={targetRowBefore} />
                </div>
                <span className="hidden text-center text-muted-foreground sm:block">−</span>
                <div className="row-chip is-source">
                  <span>{formatNumber(factor)} × source R{Number(step.pivotRow) + 1}</span>
                  <RowVector values={sourceRow} />
                </div>
                <span className="hidden text-center text-muted-foreground sm:block">=</span>
                <div className={cn('row-chip is-result', !executed && 'is-pending')}>
                  <span>new R{Number(step.targetRow) + 1}</span>
                  {executed ? <RowVector values={targetRowAfter} /> : <span className="font-mono text-base">run to reveal</span>}
                </div>
              </div>

              <p className="mt-3 text-xs leading-5 text-muted-foreground">
                {executed ? step.completion : 'Only the target row changes. The pivot row is the scaled source we subtract.'}
              </p>
            </div>
          )}

          {isComplete && (
            <div className="rounded-xl border border-primary/25 bg-primary/8 p-4">
              <p className="font-semibold">Upper triangular form reached</p>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">{step.meaning}</p>
            </div>
          )}
        </section>

        <section className="p-5 sm:p-7" aria-labelledby="code-heading">
          <div className="mb-4">
            <p className="text-xs text-muted-foreground">Python / NumPy</p>
            <h3 id="code-heading" className="mt-1 font-semibold">{isComplete ? 'Elimination complete' : executed ? 'The row has changed' : 'The next two lines'}</h3>
          </div>

          <pre className="code-window overflow-x-auto rounded-xl p-2 text-[13px] leading-6 shadow-inner"><code>
            {step.code.split('\n').map((line, index) => (
              <span key={`${line}-${index}`} className={cn('code-line', !isComplete && ((index === 0 && !checked) || (index === 1 && checked)) && 'is-active')}>
                <span className="code-line-number" aria-hidden="true">{index + 1}</span>{line}
              </span>
            ))}
          </code></pre>

          {!isComplete ? (
            <div className="mt-6">
              {!executed && (
                <>
                  <p className="text-sm font-medium">{step.prompt}</p>
                  <div className="mt-3 grid grid-cols-3 gap-2" role="group" aria-label="Choose the elimination factor">
                    {step.choices.map((option) => (
                      <Button
                        key={option}
                        type="button"
                        variant={choice === option ? 'secondary' : 'outline'}
                        size="lg"
                        aria-pressed={choice === option}
                        onClick={() => {
                          setChoice(option);
                          setChecked(false);
                        }}
                        className="font-mono"
                      >
                        {option}
                      </Button>
                    ))}
                  </div>

                  <div className="mt-3 flex flex-wrap gap-2">
                    <Button type="button" variant="outline" onClick={() => setChecked(true)} disabled={!choice}>
                      <Check data-icon="inline-start" aria-hidden="true" />Check prediction
                    </Button>
                    <Button type="button" variant="ghost" onClick={() => setShowMeaning((current) => !current)} aria-expanded={showMeaning}>
                      <Eye data-icon="inline-start" aria-hidden="true" />Why this works
                    </Button>
                  </div>
                </>
              )}

              <div className="min-h-24 pt-4" aria-live="polite">
                {checked && !executed && (
                  <div className={cn('rounded-lg border p-3 text-sm leading-6', isCorrect ? 'border-primary/25 bg-primary/8 text-foreground' : 'border-destructive/25 bg-destructive/6 text-destructive')}>
                    {isCorrect ? 'Correct. Now run the row operation and watch the highlighted entry become zero.' : 'Not yet. Divide the target entry by the pivot entry, then try again.'}
                  </div>
                )}
                {showMeaning && <p className="mt-3 border-l-2 border-primary pl-3 text-sm leading-6 text-muted-foreground">{step.meaning}</p>}
                {executed && (
                  <div className="rounded-lg border border-emerald-500/25 bg-emerald-500/8 p-3 text-sm leading-6">
                    The target entry is now <strong className="font-mono text-emerald-700">0</strong>. Compare the full target row on the left before continuing.
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="mt-6 rounded-xl border border-primary/25 bg-primary/8 p-5">
              <div className="flex gap-3">
                <span className="grid size-8 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground"><Check className="size-4" aria-hidden="true" /></span>
                <div><p className="font-semibold">Ready for back substitution</p><p className="mt-1 text-sm leading-6 text-muted-foreground">{step.completion}</p></div>
              </div>
            </div>
          )}

          <div className="mt-6 flex items-center justify-between gap-3 border-t pt-5">
            <Button type="button" variant="ghost" onClick={isComplete ? restart : goPrevious} disabled={!isComplete && stepIndex === 0}>
              {isComplete ? <RotateCcw data-icon="inline-start" aria-hidden="true" /> : <ArrowLeft data-icon="inline-start" aria-hidden="true" />}
              {isComplete ? 'Start over' : 'Previous'}
            </Button>
            {!isComplete && (
              <Button type="button" size="lg" onClick={executed ? goNext : runOperation} disabled={!executed && !isCorrect}>
                {executed ? 'Continue' : 'Run this row operation'}<ArrowRight data-icon="inline-end" aria-hidden="true" />
              </Button>
            )}
          </div>
        </section>
      </CardContent>
    </Card>
  );
}
