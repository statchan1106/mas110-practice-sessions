# KAIST MAS110 Practice Sessions

A course companion and project page for **MAS110: Linear Algebra for Data Science** at KAIST (Fall 2026).

**[Open the project page](https://statchan1106.github.io/mas110-practice-sessions/)**

## Purpose

The Friday practice sessions support students as they move from lecture concepts to readable code. The materials are designed to help students:

- reconnect each lab with the mathematical ideas introduced in class;
- read Python code one line at a time;
- see how matrices, vectors, and intermediate states change;
- think about an expected result before revealing it; and
- continue with the complete notebook in Google Colab.

The sessions review class material and implement key ideas in code rather than focus on problem solving. They are learning aids, not a homework-solution bank. Attendance is not recorded.

## Project page

The project page is the course-wide home for the practice materials. Students can browse chapters in course order, open any available lab, and see which materials are still in preparation.

Each lab contains:

- a clear learning goal;
- lecture-note concepts and a short reference;
- a short line-by-line teaching example adapted from the upstream notebook;
- the active line’s action, input/output shape, and concrete operation;
- one short prediction prompt;
- a persistent before-and-after visualization; and
- links to the original source and a runnable Colab notebook.

For Chapters 2–3, each walkthrough keeps the central operations from the source notebook but uses smaller deterministic inputs. The page is intentionally not a cell-for-cell reproduction: large matrices, repeated experiments, and advanced extensions stay in the linked Colab notebook. Every adaptation is labeled as a simplified teaching example. The browser explains prepared states and does not execute Python.

Chapter 3 follows one structural question: what does a matrix keep, collapse, and reach? Its three labs build a null-space direction, compare rotation with projection and reflection, and test reachable versus unreachable right-hand sides.

## Maintainer and questions

Practice materials are prepared and maintained by **Seongchan Lee**. Questions about the materials or code can be sent to `statchan1106 [at] kaist.ac.kr`.

## Content structure

- `app/page.tsx` — course-wide project page and chapter index
- `app/chapter-*` — chapter overview and lab routes
- `lib/chapter-*` — lab goals, explanations, code traces, and visual states
- `components/code-walkthrough.tsx` — shared line-by-line learning interface
- `components/chapter-section-page.tsx` — shared lab-page structure

When adding or updating a lab:

1. Use the same core terms as the lecture notes in the learning goal and concept tags.
2. Keep each teaching-example line, plain-English explanation, and resulting visual state together.
3. Show matrices separately before combining them when that order helps students understand the construction.
4. Use `Action / Shape / Operation` to connect syntax, dimensions, and the
   concrete calculation.
5. Keep the visualization responsive; do not add fixed matrix widths or horizontal-scroll wrappers.
6. Link the guided page to both the full source notebook and Colab.

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

## Deployment

The public project page is deployed through GitHub Pages after every push to `main`. The same source can also be published through OpenAI Sites using the existing hosting configuration.

## Acknowledgment

These practice materials are based on [Foundations of Linear Algebra for Data Science](https://github.com/kyunghyuncho/Foundations_of_LADS) by Wanmo Kang and Kyunghyun Cho. The original notebooks are distributed under the [MIT License](https://github.com/kyunghyuncho/Foundations_of_LADS/blob/main/LICENSE).
