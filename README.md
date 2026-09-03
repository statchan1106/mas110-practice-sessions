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

Each guided lab contains:

- a clear learning goal;
- lecture-note concepts and a short reference;
- a line-by-line code trace using plain language;
- a “Think first” prompt;
- a persistent before-and-after visualization; and
- links to the original source and a runnable Colab notebook.

The browser walkthroughs use small, fixed teaching examples. They explain how the code works but do not execute Python. The live chapter index always reflects the materials currently available.

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
2. Keep each source line, plain-English explanation, and resulting visual state together.
3. Show matrices separately before combining them when that order helps students understand the construction.
4. Use `Uses / Does / Updates` to explain what a line reads, computes, and changes.
5. Keep the visualization responsive; do not add fixed matrix widths or horizontal-scroll wrappers.
6. Link the guided page to both the exact source notebook and Colab.

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
