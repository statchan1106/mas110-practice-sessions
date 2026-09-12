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

For Chapter 2 and Labs 3.1–3.2, walkthroughs keep central operations from the source notebooks with smaller deterministic inputs. Lab 3.3 uses the exact 3 × 4 running matrix from Wooseok Ha’s **Lecture 3: Vector Spaces**, printed slides 17–31 (PDF pages 21–35 of `lec03.pdf`), and the solution-set theorem on printed slides 15–16. Its notation guide distinguishes input/output spaces, lecture and Python indices, coefficient and augmented matrices, and particular and homogeneous solutions. The browser explains prepared states and does not execute Python.

Lab 3.3’s [companion notebook](notebooks/Ch3-3%20Solving%20Non-invertible%20Linear%20System.ipynb) is maintained here. It uses the same code, notation, reasoning, and understanding checks as the page. Regenerate it after editing the lab with `node scripts/sync-ch33-notebook.mjs`, then run all its code cells in Python/Colab. The lecture PDF is a reference and is not redistributed by this project.

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
6. Link the guided page to both its source notebook and Colab; Lab 3.3 links to this repository’s companion notebook.

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

The maintained public project page is deployed through GitHub Pages after every push to `main`. Maintain and publish updates in this GitHub repository. The former OpenAI Sites configuration is retained for compatibility but is not an active publishing target. Do not update the upstream Foundations of LADS repository as part of this project’s maintenance; keep its links as attribution and references.

## Acknowledgment

These practice materials are based on [Foundations of Linear Algebra for Data Science](https://github.com/kyunghyuncho/Foundations_of_LADS) by Wanmo Kang and Kyunghyun Cho. The original notebooks are distributed under the [MIT License](https://github.com/kyunghyuncho/Foundations_of_LADS/blob/main/LICENSE).
