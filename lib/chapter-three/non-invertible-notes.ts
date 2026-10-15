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
      symbol: '$A \\in  \\mathbb R^{m\\times n}$; here $m = 3, n = 4$',
      meaning:
        'm counts equations (rows); n counts unknowns (columns). A maps inputs in $\\mathbb R^{n}$ to outputs in $\\mathbb R^{m}$. $\\mathbb R$ means the real numbers; ∈ means “belongs to.”',
    },
    {
      symbol:
        '$x = (u, v, w, y)^{\\mathsf T}; b = (b_{1}, b_{2}, b_{3})^{\\mathsf T}$',
      meaning:
        'x is the unknown input; b is the given target. Superscript T transposes a written row into a column. The scalar y is the fourth coordinate, not an entire vector.',
    },
    {
      symbol: '$a_{j}; U; R$',
      meaning:
        '$a_{j}$ is column j of the original A. U is a row echelon form; R is its reduced row echelon form. Lowercase u is a coordinate of x; uppercase U is a matrix.',
    },
    {
      symbol: '$E = L^{-1}; c = Eb; [A | b] \\to  [U | c]$',
      meaning:
        'E collects the downward row operations and satisfies $EA = U$. E is invertible even though A has no inverse. The vertical bar separates coefficients from the right-hand side; b must undergo the same operations.',
    },
    {
      symbol: '$r = \\operatorname{rank}(A) = 2; n - r = 2$',
      meaning:
        'r counts pivots and equals dim Col(A). n − r counts free variables and equals dim Null(A). Dimension and number of coordinates differ: a two-dimensional plane can lie inside $\\mathbb R^{4}$.',
    },
    {
      symbol: '$x_{p}; n_{1}, n_{2}; \\alpha , \\beta  \\in  \\mathbb R$',
      meaning:
        '$x_{p}$ is one particular solution. $n_{1}$ and $n_{2}$ are null-space basis vectors (called $x_{1}$ and $x_{2}$ on printed slide 27); this page uses $n_{1}$ and $n_{2}$ to avoid confusion with coordinates. $\\alpha$ and $\\beta$ are free scalars, equal to v and y.',
    },
    {
      symbol:
        '$\\operatorname{span}\\{n_{1}, n_{2}\\}; x_{p} + \\operatorname{Null}(A)$',
      meaning:
        'span means every linear combination $\\alpha n_{1} + \\beta n_{2}$. Adding $x_{p}$ to a set means adding it to every vector in that set. ⇔ means “if and only if”: both directions hold.',
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
        'Each row operation can be undone, so their product E is invertible. Multiplying both sides of $Ax = b$ by E gives $Ux = c$; multiplying by $E^{-1}$ recovers the original system. Here no row exchanges are needed, so $E = L^{-1}$ and $A = LU$. If rows are exchanged in another problem, their permutation must act on b too.',
        'Further invertible row operations take U to R. Thus $Ax = 0, Ux = 0$, and $Rx = 0$ have the same solutions. For a nonzero right-hand side, reducing U further also requires reducing $c; Rx = c$ would generally be a different system. Row operations preserve null space and rank but generally change column space: $\\operatorname{Col}(EA) = E \\operatorname{Col}(A)$.',
      ],
      equation:
        '$Ax = b \\Longleftrightarrow  EAx = Eb \\Longleftrightarrow  Ux = c$',
    },
    {
      title: 'Existence is a condition on the target b',
      paragraphs: [
        'The last row of U is zero, so the transformed system requires $c_{3} = 5b_{1} - 2b_{2} + b_{3} = 0$. This condition is also sufficient: when it holds, choose v and y freely, then use the two nonzero pivots to solve for w and u. For $\\mathtt{b\\_good} = (1,5,5)^{\\mathsf T}$ it holds; for $\\mathtt{b\\_bad} = (1,5,6)^{\\mathsf T}$ the last equation is $0 = 1$.',
        'This condition describes a plane through the origin in $\\mathbb R^{3}: \\operatorname{Col}(A)$. Pivot columns 1 and 3 of the original A give a basis $a_{1} = (1,2,-1)^{\\mathsf T}, a_{3} = (3,9,3)^{\\mathsf T}$. Column 2 equals $3a_{1}$; column 4 equals $a_{3} - a_{1}$. The vector $\\ell  = (5,-2,1)^{\\mathsf T}$ satisfies $A^{\\mathsf T}\\ell  = 0$, so the consistency condition is also $\\ell ^{\\mathsf T}b = 0$.',
      ],
      equation:
        '$Ax = b$ is consistent $\\Longleftrightarrow  b \\in  \\operatorname{Col}(A) \\Longleftrightarrow  \\operatorname{rank}([A | b]) = \\operatorname{rank}(A)$',
    },
    {
      title: 'Free variables produce a basis, not just sample solutions',
      paragraphs: [
        'For $Rx = 0$, the pivot equations give $u = -3v + y$ and $w = -y$. Substitute $v = \\alpha$ and $y = \\beta : x = \\alpha (-3,1,0,0)^{\\mathsf T} + \\beta (1,0,-1,1)^{\\mathsf T}$. Every homogeneous solution is in this span because the formula comes from all its equations.',
        'The two vectors are independent: if $\\alpha n_{1} + \\beta n_{2} = 0$, the second coordinate forces $\\alpha  = 0$ and the fourth forces $\\beta  = 0$. They form a basis of Null(A). Rank–nullity gives $2 + 2 = 4$, the number of input coordinates, not 3, the number of equations.',
      ],
      equation:
        '$\\operatorname{Null}(A)=\\{\\alpha n_1+\\beta n_2:\\alpha,\\beta\\in\\mathbb R\\}$; $\\operatorname{rank}(A)+\\dim\\operatorname{Null}(A)=n$',
    },
    {
      title: 'Prove the complete solution formula in both directions',
      paragraphs: [
        'Assume consistency and choose $x_{p}$ with $Ax_{p} = b$. For any z in $\\operatorname{Null}(A), A(x_{p} + z) = Ax_{p} + Az = b + 0 = b$. Every vector in the proposed family is therefore a solution.',
        'Conversely, take any solution x. Then $A(x - x_{p}) = b - b = 0$, so $x - x_{p}$ belongs to Null(A) and equals $\\alpha n_{1} + \\beta n_{2}$. The family therefore misses no solutions. A different particular solution changes the starting point, but not the set.',
      ],
      equation:
        '$\\{x : Ax = b\\} = x_{p} + \\operatorname{Null}(A) = \\{x_{p} + \\alpha n_{1} + \\beta n_{2} : \\alpha , \\beta  \\in  \\mathbb R\\}$',
    },
    {
      title: 'Separate existence, uniqueness, and geometry',
      paragraphs: [
        'For a consistent system, the solution is unique exactly when $\\operatorname{Null}(A) = \\{0\\}$, equivalently $r = n$. If r < n, a nonzero null-space direction produces infinitely many solutions over $\\mathbb R$. Without consistency there is no solution: $\\operatorname{Null}(A) = \\{0\\}$ alone does not guarantee existence for an arbitrary b.',
        'Here $r = 2 < 4$, so every reachable b has infinitely many solutions forming an affine plane in $\\mathbb R^{4}$. For $b \\ne  0$ it misses the origin and is not a vector subspace. For $b = 0$ it is Null(A). Separately, the reachable targets form a plane in $\\mathbb R^{3}$. These planes live in different spaces.',
      ],
      equation:
        'inconsistent: none; consistent and $r = n$: one; consistent and r < n: infinitely many',
    },
    {
      title: 'Apply the method to another m × n system',
      paragraphs: [
        '1. Row-reduce [A | b], keeping the variable order fixed and applying every operation to the whole augmented row. Identify the r coefficient pivots. 2. Check every all-zero coefficient row: a nonzero right-hand side proves inconsistency, so stop. Otherwise the system is consistent.',
        '3. Set the $n-r$ free variables to zero and solve the pivot equations for $x_p$. 4. Return to $Ax=0$; set one free variable to 1 and all other free variables to 0 in turn, solving for the pivot variables each time. This gives a basis $n_1,\\ldots,n_{n-r}$. 5. Write $x=x_p+t_1n_1+\\cdots+t_{n-r}n_{n-r}$ with arbitrary real parameters, and check using the original A and b.',
        'The walkthrough follows a known pivot sequence for this matrix, not a general elimination routine. With floating-point or noisy data, choose scale-appropriate tolerances. np.linalg.matrix_rank estimates rank numerically; np.allclose checks approximate equality. Neither replaces the exact proof of the full solution set.',
      ],
    },
  ],
  checks: [
    {
      question: 'Does a zero row of U automatically mean no solution?',
      answer:
        'No. Check the matching entry of $c = Eb$. Zero gives the redundant equation $0 = 0$; a nonzero entry gives a contradiction. Here check $5b_{1} - 2b_{2} + b_{3}$.',
    },
    {
      question: 'Can R’s pivot columns be used as a basis of Col(A)?',
      answer:
        'Use their column indices, then take those columns of the original A. R’s pivot columns span the plane whose third coordinate is zero; Col(A) is the different plane $5b_{1} - 2b_{2} + b_{3} = 0$.',
    },
    {
      question:
        'For $b = (1,5,5)^{\\mathsf T}$, what happens at $\\alpha  = 0$ and $\\beta  = 1$?',
      answer:
        '$x = x_{p} + n_{2} = (-1,0,0,1)^{\\mathsf T}$. Its image is $-a_{1} + a_{4} = (1,5,5)^{\\mathsf T}$. The input changes, but b does not.',
    },
    {
      question: 'Why do we need two free parameters?',
      answer:
        'Four unknowns minus two pivots leaves $n - r = 2$ free variables. Both independent null-space directions are needed: $x_{p} + n_{2}$ cannot be obtained from $x_{p} + \\alpha n_{1}$ alone.',
    },
    {
      question: 'Could a rectangular matrix have a unique solution?',
      answer:
        'Yes, for a consistent target if it has full column $\\operatorname{rank} (r = n)$, requiring $m \\ge  n$. This particular 3 × 4 matrix has $r = 2$, so every consistent target has infinitely many solutions.',
    },
  ],
};
