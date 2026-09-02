import {
  ArrowRight,
  BookOpenText,
  Code2,
  ExternalLink,
  GraduationCap,
  Grid3X3,
  Play,
} from 'lucide-react';

import { LessonPlayer } from '@/components/lesson-player';
import { Badge } from '@/components/ui/badge';
import { buttonVariants } from '@/components/ui/button';
import { gaussianLesson, roadmap } from '@/lib/lesson-data';
import { cn } from '@/lib/utils';

export default function Home() {
  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-40 border-b bg-background/88 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <a className="flex items-center gap-3" href="#top" aria-label="LADS Lab 처음으로">
            <span className="grid size-9 place-items-center rounded-lg bg-primary text-primary-foreground">
              <Grid3X3 className="size-4" aria-hidden="true" />
            </span>
            <span>
              <span className="block text-sm font-semibold tracking-tight">LADS Lab</span>
              <span className="hidden text-xs text-muted-foreground sm:block">Linear Algebra for Data Science</span>
            </span>
          </a>

          <nav className="flex items-center gap-1" aria-label="주요 메뉴">
            <a className={buttonVariants({ variant: 'ghost' })} href="#lab">실습</a>
            <a className={cn(buttonVariants({ variant: 'ghost' }), 'hidden sm:inline-flex')} href="#roadmap">학습 경로</a>
            <a
              className={buttonVariants({ variant: 'outline', size: 'icon' })}
              href="https://github.com/kyunghyuncho/Foundations_of_LADS"
              target="_blank"
              rel="noreferrer"
              aria-label="원본 GitHub 저장소 열기"
            >
              <Code2 aria-hidden="true" />
            </a>
          </nav>
        </div>
      </header>

      <main id="top" className="mx-auto max-w-7xl px-4 pb-20 pt-9 sm:px-6 sm:pt-12 lg:px-8">
        <section className="mb-8 grid gap-7 lg:grid-cols-[1.3fr_0.7fr] lg:items-end">
          <div>
            <div className="mb-4 flex flex-wrap items-center gap-2">
              <Badge variant="secondary">Week 01</Badge>
              <span className="text-sm text-muted-foreground">Orientation · Gaussian elimination</span>
            </div>
            <h1 className="max-w-3xl text-3xl font-semibold leading-tight tracking-[-0.035em] text-balance sm:text-5xl">
              실행하기 전에 생각하고,
              <br />행렬이 변하는 이유를 확인합니다.
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
              자동 재생 없이 한 줄씩 멈춰서 예측하세요. 코드는 계산을 수행하고, 화면은 그 계산이 가진 선형대수학적 의미를 보여줍니다.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              <a className={buttonVariants({ size: 'lg' })} href="#lab">
                <Play data-icon="inline-start" aria-hidden="true" />첫 실습 시작
              </a>
              <a className={buttonVariants({ variant: 'outline', size: 'lg' })} href={gaussianLesson.colabUrl} target="_blank" rel="noreferrer">
                Colab에서 전체 코드<ExternalLink data-icon="inline-end" aria-hidden="true" />
              </a>
            </div>
          </div>

          <div className="rounded-2xl border bg-card/88 p-5 shadow-sm backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <span className="grid size-10 place-items-center rounded-xl bg-accent text-accent-foreground">
                <GraduationCap className="size-5" aria-hidden="true" />
              </span>
              <div>
                <p className="text-sm font-semibold">오늘의 도착점</p>
                <p className="text-xs text-muted-foreground">수업이 끝나면 설명할 수 있어야 합니다.</p>
              </div>
            </div>
            <ul className="mt-4 space-y-3 text-sm leading-6">
              <li className="flex gap-3"><span className="font-mono text-primary">01</span>어떤 원소를 왜 0으로 만드는가</li>
              <li className="flex gap-3"><span className="font-mono text-primary">02</span>코드 한 줄이 어떤 행 연산인가</li>
              <li className="flex gap-3"><span className="font-mono text-primary">03</span>상삼각행렬이 왜 계산을 쉽게 만드는가</li>
            </ul>
          </div>
        </section>

        <section id="lab" className="scroll-mt-24"><LessonPlayer lesson={gaussianLesson} /></section>

        <section id="roadmap" className="scroll-mt-24 pt-20">
          <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="mb-2 text-sm font-medium text-primary">Course map</p>
              <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">하나의 틀로 확장되는 학습 경로</h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
                각 단원은 예측, 한 단계 실행, 시각적 변화, Colab 실험이라는 같은 흐름을 사용합니다.
              </p>
            </div>
            <a className={buttonVariants({ variant: 'outline' })} href={gaussianLesson.sourceUrl} target="_blank" rel="noreferrer">
              원본 노트북 보기<ArrowRight data-icon="inline-end" aria-hidden="true" />
            </a>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {roadmap.map((item) => (
              <article key={item.week} className="rounded-xl border bg-card/82 p-5 backdrop-blur-sm">
                <div className="mb-8 flex items-center justify-between">
                  <span className="font-mono text-xs text-muted-foreground">W{item.week}</span>
                  {item.active ? <Badge>현재</Badge> : <Badge variant="outline">예정</Badge>}
                </div>
                <h3 className="font-semibold">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-20 flex flex-col gap-5 rounded-2xl bg-primary px-6 py-7 text-primary-foreground sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <div className="flex gap-4">
            <BookOpenText className="mt-1 size-5 shrink-0" aria-hidden="true" />
            <div>
              <h2 className="font-semibold">이 페이지는 노트북을 대체하지 않습니다.</h2>
              <p className="mt-1 max-w-2xl text-sm leading-6 opacity-80">여기서는 개념을 함께 탐색하고, Colab에서는 코드를 수정하고 더 큰 행렬로 실험합니다.</p>
            </div>
          </div>
          <a className={cn(buttonVariants({ variant: 'secondary', size: 'lg' }), 'shrink-0')} href={gaussianLesson.colabUrl} target="_blank" rel="noreferrer">
            Colab 열기<ExternalLink data-icon="inline-end" aria-hidden="true" />
          </a>
        </section>
      </main>

      <footer className="border-t bg-background/75">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-7 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <p>LADS Lab · 수업 중 함께 생각하기 위한 인터랙티브 학습 자료</p>
          <p>Based on Foundations of Linear Algebra for Data Science</p>
        </div>
      </footer>
    </div>
  );
}
