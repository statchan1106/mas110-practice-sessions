import type { WalkthroughLineNote } from '@/components/code-walkthrough';

export function maintainedNotebook(filename: string) {
  const suffix = `/statchan1106/mas110-practice-sessions/blob/main/notebooks/${encodeURIComponent(filename)}`;
  return {
    filename,
    githubUrl: `https://github.com${suffix}`,
    colabUrl: `https://colab.research.google.com/github${suffix}`,
  };
}

export function line(
  action: string,
  shape: string,
  operation: string,
): WalkthroughLineNote {
  return { action, shape, operation };
}

export const realGeometryNotation = [
  {
    symbol: '⟨u,v⟩; ‖u‖; u ⊥ v',
    meaning:
      'An inner product gives one real number, ‖u‖ = √⟨u,u⟩ is its induced norm, and u ⊥ v means ⟨u,v⟩ = 0. The lecture writes |u| for this norm. In Euclidean space the default is uᵀv and the norm is ‖u‖₂; for polynomials it is the stated integral norm.',
  },
  {
    symbol: 'φ; θ; θ̂',
    meaning:
      'This chapter uses φ for an angle and θ for model coefficients in Lab 4.4. The lecture sometimes uses θ for the angle too; the distinction here prevents mixing an angle with a coefficient vector. A hat marks a minimizing coefficient, not a unit vector.',
  },
  {
    symbol: 'A; G; Q; R; P',
    meaning:
      'A stores input columns in the Euclidean QR and least-squares labs. G denotes a Gram matrix of inner products, including the polynomial metric (which the lecture locally calls A). Q stores orthonormal columns, R stores their reconstruction coefficients, and P projects onto a subspace. These matrices have different jobs and shapes.',
  },
];

export const lectureNotebookNote =
  'This maintained notebook uses the same notation and worked example as the web lab. Run all cells in order, then change the inputs. NumPy is required; the final plot also uses Matplotlib, available in Colab.';
