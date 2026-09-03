'use client';

import { BookOpenText, Code2, ExternalLink } from 'lucide-react';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { buttonVariants } from '@/components/ui/button';
import { courseGroups, courseNotebookCount } from '@/lib/course-data';
import { sitePath } from '@/lib/site-path';
import { cn } from '@/lib/utils';

const statusLabel = {
  interactive: 'Interactive walkthrough',
  notebook: 'Original notebook',
  optional: 'Optional notebook',
};

const guidedNotebookRoutes: Record<string, string> = {
  'Ch2-1 Gaussian Elimination.ipynb': '/chapter-2/gaussian-elimination',
  'Ch2-2 Block Matrices & Graphs.ipynb': '/chapter-2/block-matrices-graphs',
  'Ch2-3 Test LU-Decomposition.ipynb': '/chapter-2/lu-decomposition',
  'Ch2-4 Gaussian elimination in detail (Optional).ipynb':
    '/chapter-2/gaussian-detail',
};

export function CourseLibrary() {
  return (
    <div>
      <div className="mb-6 grid gap-3 sm:grid-cols-3">
        <div className="rounded-xl border bg-card/80 p-4">
          <p className="font-mono text-2xl font-semibold">
            {courseGroups.length}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">teaching modules</p>
        </div>
        <div className="rounded-xl border bg-card/80 p-4">
          <p className="font-mono text-2xl font-semibold">
            {courseNotebookCount}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            original notebooks mapped
          </p>
        </div>
        <div className="rounded-xl border bg-primary p-4 text-primary-foreground">
          <p className="font-mono text-2xl font-semibold">
            {String(Object.keys(guidedNotebookRoutes).length).padStart(2, '0')}
          </p>
          <p className="mt-1 text-xs opacity-75">guided walkthroughs live</p>
        </div>
      </div>

      <Accordion defaultValue={['systems-elimination']} className="gap-3">
        {courseGroups.map((group, groupIndex) => (
          <AccordionItem
            key={group.id}
            value={group.id}
            className="rounded-2xl border bg-card/86 px-5 shadow-sm backdrop-blur-sm sm:px-6"
          >
            <AccordionTrigger className="gap-4 py-5 hover:no-underline">
              <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-muted font-mono text-xs text-muted-foreground">
                {String(groupIndex + 1).padStart(2, '0')}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-xs font-normal uppercase tracking-[0.1em] text-primary">
                  {group.chapters}
                </span>
                <span className="mt-1 block text-base font-semibold text-foreground">
                  {group.title}
                </span>
                <span className="mt-1 block max-w-3xl text-xs font-normal leading-5 text-muted-foreground">
                  {group.idea}
                </span>
              </span>
              <Badge
                variant="outline"
                className="mr-2 hidden shrink-0 sm:inline-flex"
              >
                {group.notebooks.length} notebooks
              </Badge>
            </AccordionTrigger>

            <AccordionContent className="pb-6">
              <div className="border-t pt-5">
                <div className="mb-3 flex items-center gap-2">
                  <BookOpenText
                    className="size-4 text-primary"
                    aria-hidden="true"
                  />
                  <h3 className="text-sm font-semibold">Concept primer</h3>
                  <span className="text-xs text-muted-foreground">
                    Read these before opening the notebooks.
                  </span>
                </div>
                <div className="grid gap-2 md:grid-cols-3">
                  {group.primer.map((item) => (
                    <article
                      key={item.term}
                      className="rounded-xl border bg-muted/30 p-4"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <h4 className="font-semibold">{item.term}</h4>
                        <code className="shrink-0 rounded bg-background px-2 py-1 text-[11px] text-primary">
                          {item.relation}
                        </code>
                      </div>
                      <p className="mt-2 text-xs leading-5 text-muted-foreground">
                        {item.definition}
                      </p>
                      <p className="mt-3 border-l-2 border-accent pl-2 text-[11px] leading-4 text-muted-foreground">
                        <strong className="text-foreground">
                          Prediction cue:
                        </strong>{' '}
                        {item.watchFor}
                      </p>
                    </article>
                  ))}
                </div>
              </div>

              <div className="mt-5 overflow-hidden rounded-xl border">
                {group.notebooks.map((item, notebookIndex) => {
                  const guidedRoute = guidedNotebookRoutes[item.filename];
                  return (
                    <div
                      key={item.filename}
                      className={cn(
                        'flex flex-col gap-3 bg-background/72 p-4 sm:flex-row sm:items-center sm:justify-between',
                        notebookIndex > 0 && 'border-t',
                      )}
                    >
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <Badge
                            variant={
                              guidedRoute
                                ? 'default'
                                : item.status === 'optional'
                                  ? 'secondary'
                                  : 'outline'
                            }
                          >
                            {guidedRoute
                              ? item.status === 'optional'
                                ? 'Optional · interactive'
                                : 'Interactive walkthrough'
                              : statusLabel[item.status]}
                          </Badge>
                          <h4 className="font-medium">{item.title}</h4>
                        </div>
                        <p className="mt-1 truncate font-mono text-[11px] text-muted-foreground">
                          {item.filename}
                        </p>
                      </div>
                      <div className="flex shrink-0 gap-2">
                        {guidedRoute && (
                          <a
                            className={buttonVariants({
                              variant: 'secondary',
                              size: 'sm',
                            })}
                            href={sitePath(guidedRoute)}
                          >
                            Start guide
                          </a>
                        )}
                        <a
                          className={buttonVariants({
                            variant: 'outline',
                            size: 'sm',
                          })}
                          href={item.githubUrl}
                          target="_blank"
                          rel="noreferrer"
                        >
                          <Code2 data-icon="inline-start" aria-hidden="true" />
                          GitHub
                        </a>
                        <a
                          className={buttonVariants({
                            variant: 'outline',
                            size: 'sm',
                          })}
                          href={item.colabUrl}
                          target="_blank"
                          rel="noreferrer"
                        >
                          Colab
                          <ExternalLink
                            data-icon="inline-end"
                            aria-hidden="true"
                          />
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
