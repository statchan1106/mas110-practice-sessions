import type { ChapterSection } from '@/lib/chapter/shared';

export const nonInvertibleLectureNotes: NonNullable<
  ChapterSection['lectureNotes']
> = {
  reference:
    'Wooseok Ha, MAS110 Lecture 3: Vector Spaces (Fall 2026), lec03.pdf. Main example: printed slides 17–31 / PDF pages 21–35. Solution-set theorem: printed slides 15–16 / PDF pages 18–19.',
  introduction:
    '“Non-invertible” includes the rectangular system studied here: A has three rows and four columns, so there is no ordinary two-sided inverse. A square non-invertible matrix is also called singular. Elimination answers two separate questions: does a solution exist for this b, and, if it does, how many solutions are there?',
  notation: [
    {
      symbol: 'A ∈ ℝᵐˣⁿ; here m = 3, n = 4',
      meaning:
        'm counts equations (rows); n counts unknowns (columns). A maps inputs in ℝⁿ to outputs in ℝᵐ. ℝ means the real numbers; ∈ means “belongs to.”',
    },
    {
      symbol: 'x = (u, v, w, y)ᵀ; b = (b₁, b₂, b₃)ᵀ',
      meaning:
        'x is the unknown input; b is the given target. Superscript T transposes a written row into a column. The scalar y is the fourth coordinate, not an entire vector.',
    },
    {
      symbol: 'aⱼ; U; R',
      meaning:
        'aⱼ is column j of the original A. U is a row echelon form; R is its reduced row echelon form. Lowercase u is a coordinate of x; uppercase U is a matrix.',
    },
    {
      symbol: 'E = L⁻¹; c = Eb; [A | b] → [U | c]',
      meaning:
        'E collects the downward row operations and satisfies EA = U. E is invertible even though A has no inverse. The vertical bar separates coefficients from the right-hand side; b must undergo the same operations.',
    },
    {
      symbol: 'r = rank(A) = 2; n − r = 2',
      meaning:
        'r counts pivots and equals dim Col(A). n − r counts free variables and equals dim Null(A). Dimension and number of coordinates differ: a two-dimensional plane can lie inside ℝ⁴.',
    },
    {
      symbol: 'xₚ; n₁, n₂; α, β ∈ ℝ',
      meaning:
        'xₚ is one particular solution. n₁ and n₂ are null-space basis vectors (called x₁ and x₂ on printed slide 27); this page uses n₁ and n₂ to avoid confusion with coordinates. α and β are free scalars, equal to v and y.',
    },
    {
      symbol: 'span{n₁, n₂}; xₚ + Null(A)',
      meaning:
        'span means every linear combination αn₁ + βn₂. Adding xₚ to a set means adding it to every vector in that set. ⇔ means “if and only if”: both directions hold.',
    },
    {
      symbol: 'NumPy: (3, 4), (4,), @, [1, 2]',
      meaning:
        'A.shape is (3, 4). A 1D vector array has shape (4,), not (4, 1); transposing it does not create a column array. @ is matrix multiplication; * is elementwise multiplication or scalar scaling. A[1, 2] selects lecture row 2, column 3 because Python counts from 0.',
    },
  ],
  reasoning: [
    {
      title: 'Elimination changes equations without losing solutions',
      paragraphs: [
        'Each row operation can be undone, so their product E is invertible. Multiplying both sides of Ax = b by E gives Ux = c; multiplying by E⁻¹ recovers the original system. Here no row exchanges are needed, so E = L⁻¹ and A = LU. If rows are exchanged in another problem, their permutation must act on b too.',
        'Further invertible row operations take U to R. Thus Ax = 0, Ux = 0, and Rx = 0 have the same solutions. For a nonzero right-hand side, reducing U further also requires reducing c; Rx = c would generally be a different system. Row operations preserve null space and rank but generally change column space: Col(EA) = E Col(A).',
      ],
      equation: 'Ax = b ⇔ EAx = Eb ⇔ Ux = c',
    },
    {
      title: 'Existence is a condition on the target b',
      paragraphs: [
        'The last row of U is zero, so the transformed system requires c₃ = 5b₁ − 2b₂ + b₃ = 0. This condition is also sufficient: when it holds, choose v and y freely, then use the two nonzero pivots to solve for w and u. For b_good = (1,5,5)ᵀ it holds; for b_bad = (1,5,6)ᵀ the last equation is 0 = 1.',
        'This condition describes a plane through the origin in ℝ³: Col(A). Pivot columns 1 and 3 of the original A give a basis a₁ = (1,2,−1)ᵀ, a₃ = (3,9,3)ᵀ. Column 2 equals 3a₁; column 4 equals a₃ − a₁. The vector ℓ = (5,−2,1)ᵀ satisfies Aᵀℓ = 0, so the consistency condition is also ℓᵀb = 0.',
      ],
      equation: 'Ax = b is consistent ⇔ b ∈ Col(A) ⇔ rank([A | b]) = rank(A)',
    },
    {
      title: 'Free variables produce a basis, not just sample solutions',
      paragraphs: [
        'For Rx = 0, the pivot equations give u = −3v + y and w = −y. Substitute v = α and y = β: x = α(−3,1,0,0)ᵀ + β(1,0,−1,1)ᵀ. Every homogeneous solution is in this span because the formula comes from all its equations.',
        'The two vectors are independent: if αn₁ + βn₂ = 0, the second coordinate forces α = 0 and the fourth forces β = 0. They form a basis of Null(A). Rank–nullity gives 2 + 2 = 4, the number of input coordinates, not 3, the number of equations.',
      ],
      equation: 'Null(A) = {αn₁ + βn₂ : α, β ∈ ℝ}; rank(A) + dim Null(A) = n',
    },
    {
      title: 'Prove the complete solution formula in both directions',
      paragraphs: [
        'Assume consistency and choose xₚ with Axₚ = b. For any z in Null(A), A(xₚ + z) = Axₚ + Az = b + 0 = b. Every vector in the proposed family is therefore a solution.',
        'Conversely, take any solution x. Then A(x − xₚ) = b − b = 0, so x − xₚ belongs to Null(A) and equals αn₁ + βn₂. The family therefore misses no solutions. A different particular solution changes the starting point, but not the set.',
      ],
      equation: '{x : Ax = b} = xₚ + Null(A) = {xₚ + αn₁ + βn₂ : α, β ∈ ℝ}',
    },
    {
      title: 'Separate existence, uniqueness, and geometry',
      paragraphs: [
        'For a consistent system, the solution is unique exactly when Null(A) = {0}, equivalently r = n. If r < n, a nonzero null-space direction produces infinitely many solutions over ℝ. Without consistency there is no solution: Null(A) = {0} alone does not guarantee existence for an arbitrary b.',
        'Here r = 2 < 4, so every reachable b has infinitely many solutions forming an affine plane in ℝ⁴. For b ≠ 0 it misses the origin and is not a vector subspace. For b = 0 it is Null(A). Separately, the reachable targets form a plane in ℝ³. These planes live in different spaces.',
      ],
      equation:
        'inconsistent: none; consistent and r = n: one; consistent and r < n: infinitely many',
    },
    {
      title: 'Apply the method to another m × n system',
      paragraphs: [
        '1. Row-reduce [A | b], keeping the variable order fixed and applying every operation to the whole augmented row. Identify the r coefficient pivots. 2. Check every all-zero coefficient row: a nonzero right-hand side proves inconsistency, so stop. Otherwise the system is consistent.',
        '3. Set the n − r free variables to zero and solve the pivot equations for xₚ. 4. Return to Ax = 0; set one free variable to 1 and all other free variables to 0 in turn, solving for the pivot variables each time. This gives a basis n₁,…,nₙ₋ᵣ. 5. Write x = xₚ + t₁n₁ + ⋯ + tₙ₋ᵣnₙ₋ᵣ with arbitrary real parameters, and check using the original A and b.',
        'The walkthrough follows a known pivot sequence for this matrix, not a general elimination routine. With floating-point or noisy data, choose scale-appropriate tolerances. np.linalg.matrix_rank estimates rank numerically; np.allclose checks approximate equality. Neither replaces the exact proof of the full solution set.',
      ],
    },
  ],
  checks: [
    {
      question: 'Does a zero row of U automatically mean no solution?',
      answer:
        'No. Check the matching entry of c = Eb. Zero gives the redundant equation 0 = 0; a nonzero entry gives a contradiction. Here check 5b₁ − 2b₂ + b₃.',
    },
    {
      question: 'Can R’s pivot columns be used as a basis of Col(A)?',
      answer:
        'Use their column indices, then take those columns of the original A. R’s pivot columns span the plane whose third coordinate is zero; Col(A) is the different plane 5b₁ − 2b₂ + b₃ = 0.',
    },
    {
      question: 'For b = (1,5,5)ᵀ, what happens at α = 0 and β = 1?',
      answer:
        'x = xₚ + n₂ = (−1,0,0,1)ᵀ. Its image is −a₁ + a₄ = (1,5,5)ᵀ. The input changes, but b does not.',
    },
    {
      question: 'Why do we need two free parameters?',
      answer:
        'Four unknowns minus two pivots leaves n − r = 2 free variables. Both independent null-space directions are needed: xₚ + n₂ cannot be obtained from xₚ + αn₁ alone.',
    },
    {
      question: 'Could a rectangular matrix have a unique solution?',
      answer:
        'Yes, for a consistent target if it has full column rank (r = n), requiring m ≥ n. This particular 3 × 4 matrix has r = 2, so every consistent target has infinitely many solutions.',
    },
  ],
};
