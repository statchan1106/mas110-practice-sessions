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
  return Number.isInteger(value) ? String(value) : value.toFixed(1);
}

export function LessonPlayer({ lesson }: { lesson: Lesson }) {
  const [stepIndex, setStepIndex] = useState(0);
  const [choice, setChoice] = useState('');
  const [checked, setChecked] = useState(false);
  const [showMeaning, setShowMeaning] = useState(false);

  const step = lesson.steps[stepIndex];
  const isComplete = stepIndex === lesson.steps.length - 1;
  const isCorrect = checked && choice === step.answer;
  const progress = (stepIndex / (lesson.steps.length - 1)) * 100;
  const matrixLabel = useMemo(() => step.matrix.map((row) => row.join(', ')).join('; '), [step.matrix]);

  function resetReflection() {
    setChoice('');
    setChecked(false);
    setShowMeaning(false);
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

  return (
    <Card className="lesson-shell bg-card/94 py-0 backdrop-blur-sm">
      <CardHeader className="border-b px-5 py-5 sm:px-7 sm:py-6">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
          <div>
            <p className="mb-1 font-mono text-xs uppercase tracking-[0.12em] text-primary">{lesson.eyebrow}</p>
            <CardTitle className="text-xl sm:text-2xl">{lesson.title}</CardTitle>
            <CardDescription className="mt-1.5">코드를 실행하기 전에 값과 변화를 먼저 예상해 보세요.</CardDescription>
          </div>
          <Badge variant="outline" className="font-mono">STEP {stepIndex + 1} / {lesson.steps.length}</Badge>
        </div>
        <Progress value={progress} className="mt-5">
          <ProgressLabel>{step.shortLabel}</ProgressLabel>
          <ProgressValue>{Math.round(progress)}%</ProgressValue>
        </Progress>
      </CardHeader>

      <CardContent className="grid gap-0 p-0 lg:grid-cols-[190px_minmax(300px,0.9fr)_minmax(360px,1.1fr)]">
        <aside className="border-b bg-muted/42 p-4 lg:border-r lg:border-b-0" aria-label="실습 단계">
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
          <div className="mb-6 flex items-center justify-between gap-3">
            <div>
              <p className="text-xs text-muted-foreground">현재 상태</p>
              <h3 id="matrix-heading" className="mt-1 font-semibold">확대행렬 [A | b]</h3>
            </div>
            {!isComplete && <Badge variant="secondary">pivot column {Number(step.pivotColumn) + 1}</Badge>}
          </div>

          <div className="mx-auto max-w-sm py-5" role="img" aria-label={`현재 확대행렬: ${matrixLabel}`}>
            <div className="matrix-bracket">
              {step.matrix.flatMap((row, rowIndex) =>
                row.map((value, columnIndex) => {
                  const pivot = rowIndex === step.pivotRow;
                  const target = rowIndex === step.targetRow;
                  const eliminated = target && columnIndex === step.pivotColumn;
                  return (
                    <span
                      key={`${rowIndex}-${columnIndex}`}
                      className={cn(
                        'matrix-cell',
                        columnIndex === 3 && 'matrix-cell-separator',
                        pivot && 'bg-primary/12 text-primary',
                        target && 'bg-accent/70 text-accent-foreground',
                        eliminated && 'ring-2 ring-accent-foreground/30',
                      )}
                    >
                      {formatNumber(value)}
                    </span>
                  );
                }),
              )}
            </div>
          </div>

          <div className="mt-7 rounded-xl border bg-muted/35 p-4">
            <p className="text-xs text-muted-foreground">이번 단계의 행 연산</p>
            <p className="mt-1.5 font-mono text-base font-semibold text-foreground">{step.operation}</p>
          </div>
        </section>

        <section className="p-5 sm:p-7" aria-labelledby="code-heading">
          <div className="mb-4">
            <p className="text-xs text-muted-foreground">Python / NumPy</p>
            <h3 id="code-heading" className="mt-1 font-semibold">{isComplete ? '소거 완료' : '다음에 실행할 코드'}</h3>
          </div>

          <pre className="code-window overflow-x-auto rounded-xl p-4 text-[13px] leading-6 shadow-inner"><code>{step.code}</code></pre>

          {!isComplete ? (
            <div className="mt-6">
              <p className="text-sm font-medium">{step.prompt}</p>
              <div className="mt-3 grid grid-cols-3 gap-2" role="group" aria-label="factor 값 선택">
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
                  <Check data-icon="inline-start" aria-hidden="true" />예상 확인
                </Button>
                <Button type="button" variant="ghost" onClick={() => setShowMeaning((current) => !current)} aria-expanded={showMeaning}>
                  <Eye data-icon="inline-start" aria-hidden="true" />수학적 의미
                </Button>
              </div>

              <div className="min-h-24 pt-4" aria-live="polite">
                {checked && (
                  <div className={cn('rounded-lg border p-3 text-sm leading-6', isCorrect ? 'border-primary/25 bg-primary/8 text-foreground' : 'border-destructive/25 bg-destructive/6 text-destructive')}>
                    {isCorrect ? '맞았습니다. 코드를 실행해 행렬의 변화를 확인하세요.' : '아직 아닙니다. 없애려는 원소를 pivot으로 나누어 보세요.'}
                  </div>
                )}
                {showMeaning && <p className="mt-3 border-l-2 border-primary pl-3 text-sm leading-6 text-muted-foreground">{step.meaning}</p>}
              </div>
            </div>
          ) : (
            <div className="mt-6 rounded-xl border border-primary/25 bg-primary/8 p-5">
              <div className="flex gap-3">
                <span className="grid size-8 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground"><Check className="size-4" aria-hidden="true" /></span>
                <div><p className="font-semibold">상삼각행렬 완성</p><p className="mt-1 text-sm leading-6 text-muted-foreground">{step.meaning}</p></div>
              </div>
            </div>
          )}

          <div className="mt-6 flex items-center justify-between gap-3 border-t pt-5">
            <Button type="button" variant="ghost" onClick={isComplete ? restart : goPrevious} disabled={!isComplete && stepIndex === 0}>
              {isComplete ? <RotateCcw data-icon="inline-start" aria-hidden="true" /> : <ArrowLeft data-icon="inline-start" aria-hidden="true" />}
              {isComplete ? '처음부터' : '이전'}
            </Button>
            {!isComplete && (
              <Button type="button" size="lg" onClick={goNext}>이 코드 실행<ArrowRight data-icon="inline-end" aria-hidden="true" /></Button>
            )}
          </div>
        </section>
      </CardContent>
    </Card>
  );
}
