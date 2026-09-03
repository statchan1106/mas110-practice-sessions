# KAIST MAS110 · Foundations of LADS companion

An independent interactive TA companion for KAIST MAS110, based on the notebooks in [Foundations of Linear Algebra for Data Science](https://github.com/kyunghyuncho/Foundations_of_LADS) by Wanmo Kang and Kyunghyun Cho.

The teaching pattern is consistent across every guided section:

1. Read a short concept primer.
2. Predict what the current Python code will change.
3. Run one teaching step.
4. Compare the visible program state before and after.
5. Explain why the mathematical change is valid.
6. Open the original notebook in Colab for real Python execution.

## Local development

Requires Node.js 22 or later.

```bash
npm ci
npm run dev
```

The normal production build keeps the Vinext/Cloudflare runtime used by OpenAI Sites:

```bash
npm run build
```

## Content structure

- `app/page.tsx`: course home
- `app/chapter-2/page.tsx`: Chapter 2 section menu
- `app/chapter-2/*/page.tsx`: static section routes
- `lib/chapter-two/*.ts`: primers, code steps, numerical snapshots, and visual states
- `components/code-walkthrough.tsx`: shared step runner and visualization renderer
- `components/chapter-section-page.tsx`: shared lesson-page layout

To add a guided section, create one `ChapterSection` data module, add it to `lib/chapter-two-data.ts`, and create a thin static route page. Keep the exact source notebook and Colab links in the data module.

## GitHub Pages

The included `.github/workflows/pages.yml` creates a static Vinext export and publishes `dist/client`. It supports both a root Pages repository and a project URL such as `https://owner.github.io/repository/`.

After pushing the project to GitHub:

1. Open **Settings → Pages**.
2. Set **Build and deployment → Source** to **GitHub Actions**.
3. Push to `main` or run the workflow manually.

GitHub Pages is public hosting. Do not put private course data or credentials in this repository or site.

## Source acknowledgment

The companion explanations and visual state models are paired with, and do not replace, the original notebooks. The source repository is distributed under the [MIT License](https://github.com/kyunghyuncho/Foundations_of_LADS/blob/main/LICENSE).
