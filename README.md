# KAIST MAS110 Practice Sessions

Interactive practice materials for **MAS110: Linear Algebra for Data Science** at KAIST (Fall 2026).

- Purpose: review lecture material and implement key ideas in code; these are not problem-solving sessions
- Attendance: not recorded for the practice sessions
- Questions about the materials or code: `statchan1106@kaist.ac.kr`
- Practice materials: Seongchan Lee

## Practice library

The homepage is the course-wide chapter index. Chapter 2 is available now, and Chapters 3–11 are visibly marked **In preparation** until their guided materials are ready.

## Available now · Chapter 2

Chapter 2 is organized as four guided labs:

1. Gaussian elimination and solving `Ax = b`
2. Block matrices, Schur complements, and graph matrices
3. Numerical tests for pivoted LU decomposition
4. A detailed elimination trace

The browser walkthroughs are deterministic teaching traces. They do not execute Python. Each source line is paired with:

- the values it reads;
- the operation it computes;
- the variable or matrix region it changes;
- a prediction prompt; and
- a persistent before/after visualization.

Every lab links to the complete source notebook in Colab for real Python execution.

## Local development

Node.js 22 or later is required.

```bash
npm ci
npm run dev
```

Create a production build with:

```bash
npm run build
```

## Content maintenance

- `app/page.tsx` — course-wide chapter hub and session guidance
- `app/chapter-2/page.tsx` — Chapter 2 concept map and lab index
- `lib/chapter-two/*.ts` — lesson copy, code traces, and visual states
- `components/code-walkthrough.tsx` — shared line-by-line learning interface
- `components/chapter-section-page.tsx` — shared lab-page structure

When changing a trace, keep the source line, its explanation, and its resulting visual state in the same `WalkthroughStep`. Use `lineNotes` when the automatic Reads / Computes / Changes explanation is not precise enough.

## Deployment

`.github/workflows/pages.yml` builds a static export and deploys it to GitHub Pages after every push to `main`. In the repository settings, set **Pages → Build and deployment → Source** to **GitHub Actions**.

The project can also be deployed through OpenAI Sites because `.openai/hosting.json` remains part of the workspace.

## Acknowledgment

These practice materials are based on [Foundations of Linear Algebra for Data Science](https://github.com/kyunghyuncho/Foundations_of_LADS) by Wanmo Kang and Kyunghyun Cho. The original notebooks are distributed under the [MIT License](https://github.com/kyunghyuncho/Foundations_of_LADS/blob/main/LICENSE).
