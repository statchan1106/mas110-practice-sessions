import { numericalRankSection } from '@/lib/chapter-five/numerical-rank';
import { projectionsSection } from '@/lib/chapter-five/projections';
import { stableQrSection } from '@/lib/chapter-five/stable-qr';
import { svdSection } from '@/lib/chapter-five/svd';

export const chapterFiveSections = [
  svdSection,
  projectionsSection,
  stableQrSection,
  numericalRankSection,
];

export const chapterFivePrimer = [
  {
    term: 'Singular triplet',
    definition:
      'A unit input direction, its paired output direction, and the stretch between them.',
    relation: '$Av_i=\\sigma_i u_i$',
    watchFor:
      'Right directions live in feature space and left directions live in the output space.',
  },
  {
    term: 'Compact SVD',
    definition:
      'Assemble the $r$ positive singular triplets, where $r$ is the rank.',
    relation: '$A=UDV^{\\top}$',
    watchFor:
      'The lecture calls the diagonal matrix $D$. NumPy returns its entries as a one-dimensional array.',
  },
  {
    term: 'Orthogonal projection',
    definition:
      'Project an observed output onto the space the matrix can reach.',
    relation: '$P_{\\mathrm{col}}=AA^+=UU^{\\top}$',
    watchFor: 'The residual is orthogonal to every column of $A$.',
  },
];
