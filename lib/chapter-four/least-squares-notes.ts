import type { ChapterSection } from '@/lib/chapter/shared';

export const leastSquaresLectureNotes: NonNullable<
  ChapterSection['lectureNotes']
> = {
  readingLabel: 'Lecture 4 · Reading guide',
  reasoningTitle: 'Why least squares is projection',
  reference:
    'Wooseok Ha, MAS110 Lecture 4: Orthogonality and Projections (Fall 2026), lec04.pdf. Least squares: printed slides 61–68 / PDF pages 71–78. Projection: slides 29–33 and 39 / PDF pages 33–37 and 44. QR example: slides 49–51 / PDF pages 57–59.',
  introduction:
    'Chapter 3 asked whether Aθ = b has an exact solution. Here b may lie outside Col(A), so we choose coefficients whose output is as close to b as possible. Throughout this lab, vectors and matrices are real and distance means the standard Euclidean distance. The running example is exactly the lecture’s 3 × 2 matrix, not a square system with an inverse.',
  notation: [
    {
      symbol: 'A ∈ ℝᵐˣⁿ; here m = 3, n = 2',
      meaning:
        'A is the design matrix: m measurements (rows) and n coefficients (columns). θ ∈ ℝⁿ is an input; Aθ and b ∈ ℝᵐ are outputs in measurement space. More rows than columns does not itself prove inconsistency; b ∉ Col(A) does.',
    },
    {
      symbol: 'aᵢ ∈ ℝⁿ; row i is aᵢᵀ',
      meaning:
        'In the lecture’s data model, aᵢ is the feature vector for measurement i, so (Aθ)ᵢ = aᵢᵀθ = θᵀaᵢ. This notation names rows via their transposes. A[:, j] in Python instead selects a column of A, a vector in ℝᵐ.',
    },
    {
      symbol: 'θ; θ̂; b̂ = Aθ̂',
      meaning:
        'θ is any candidate coefficient vector; the hat marks a minimizing choice θ̂. b̂ is the fitted output, not another name for the coefficients. Here θ̂ has 2 coordinates and b̂ has 3. The lecture writes the fitted vector as Aθ̂; b̂ is an added shorthand on this page.',
    },
    {
      symbol: 'e = b − b̂; f(θ) = ‖Aθ − b‖₂²',
      meaning:
        'e is the observed-minus-fitted residual vector. At θ̂, Aθ̂ − b = −e; both signs have the same squared length. The lecture uses |v| for Euclidean vector length; this page writes ‖v‖₂. The actual measurement noise εᵢ in the model need not equal the fitted residual eᵢ.',
    },
    {
      symbol: '⟨u,v⟩ = uᵀv; e ⊥ Col(A)',
      meaning:
        'ᵀ means transpose; ⊥ means orthogonal. The condition means e has zero inner product with every column combination of A. It is equivalent to Aᵀe = 0, not to e = 0.',
    },
    {
      symbol: 'G = AᵀA; h = Aᵀb; Gθ̂ = h',
      meaning:
        'G is an n × n Gram matrix and h has n entries. These names abbreviate the normal equations; G is not the original design matrix A. “Normal” refers to a perpendicular residual, not a normal probability distribution.',
    },
    {
      symbol: 'P = A(AᵀA)⁻¹Aᵀ; b̂ = Pb',
      meaning:
        'This formula requires independent columns: rank(A) = n. P has shape m × m, acts on outputs, and satisfies Pᵀ = P and P² = P. The map (AᵀA)⁻¹Aᵀ has shape n × m and computes coefficients; it is not the projection matrix.',
    },
    {
      symbol: 'A = QR; QᵀQ = Iₙ; P = QQᵀ',
      meaning:
        'For a full-column-rank A, reduced Q has shape m × n and orthonormal columns; R is an invertible n × n upper triangular matrix. For m > n, Q is not a square orthogonal matrix: QᵀQ = Iₙ but QQᵀ = P generally differs from Iₘ.',
    },
    {
      symbol: 'arg min; rank(A); Null(A)',
      meaning:
        'arg min names the coefficient vectors attaining the smallest objective, not the objective value itself. They form θ̂ + Null(A). Rank counts independent columns. If rank(A) = n the coefficient is unique; otherwise the fitted output stays unique while coefficients may differ.',
    },
    {
      symbol: 'NumPy: (3, 2), (2,), .T, @, **2',
      meaning:
        'A.shape is (3, 2); a 1D θ array has shape (2,), not (2, 1). .T transposes a matrix, but does not turn a 1D array into a column array. @ is matrix multiplication; * is elementwise multiplication or scalar scaling; **2 squares entries. Python indices start at 0.',
    },
    {
      symbol: 'lstsq: theta_hat, sums_squared, rank_A, singular_values',
      meaning:
        'np.linalg.lstsq returns four results. sums_squared contains sums of squared residuals, not the residual vector e. It is empty when rank(A) < n or m ≤ n; empty does not mean zero error. Compute e = b − A @ theta_hat and e @ e directly.',
    },
  ],
  reasoning: [
    {
      title: 'An unreachable target still has a nearest reachable output',
      paragraphs: [
        'The outputs Aθ fill Col(A), a finite-dimensional subspace of ℝᵐ. Every b has a unique orthogonal projection onto that subspace. Because this projection belongs to Col(A), some coefficient vector produces it. Thus least squares always has a minimizer, even when the exact equation has none.',
        'For the running example, ℓ = (1,−1,1)ᵀ satisfies Aᵀℓ = 0. Every reachable output obeys ℓᵀAθ = 0, but b = (1,1,1)ᵀ gives ℓᵀb = 1. This certifies b ∉ Col(A). The obstruction is a nonzero component perpendicular to the reachable plane.',
      ],
      equation:
        'θ̂ minimizes ‖Aθ − b‖₂²; b̂ = Aθ̂ is the closest point of Col(A) to b',
    },
    {
      title: 'The normal equations follow from the objective',
      paragraphs: [
        'Expand f(θ) = (Aθ − b)ᵀ(Aθ − b) = θᵀAᵀAθ − 2bᵀAθ + bᵀb. AᵀA is symmetric, so the gradient is ∇f(θ) = 2AᵀAθ − 2Aᵀb. At a minimum, the gradient is zero, giving AᵀAθ̂ = Aᵀb.',
        'This condition is sufficient as well as necessary: the Hessian is 2AᵀA and zᵀAᵀAz = ‖Az‖₂² ≥ 0. The objective is convex, so a stationary point is a global minimizer. When the columns are independent, this squared length is positive for every nonzero z; the objective is strictly convex and the coefficient is unique. The geometric proof below establishes sufficiency without calculus.',
      ],
      equation: '∇f(θ̂) = 0 ⇔ Aᵀ(Aθ̂ − b) = 0 ⇔ Aᵀe = 0',
    },
    {
      title: 'A perpendicular residual proves global optimality',
      paragraphs: [
        'Suppose Aᵀe = 0 with e = b − Aθ̂. For any candidate θ, b − Aθ = e − A(θ − θ̂). The two terms are perpendicular: e is orthogonal to Col(A), while A(θ − θ̂) belongs to that subspace. Pythagoras therefore splits the squared error into the best error plus a nonnegative extra term.',
        'Equality holds precisely when A(θ − θ̂) = 0. This proves both optimality and the full minimizer set θ̂ + Null(A). For our example, e = (1/3,−1/3,1/3)ᵀ, so the minimum squared error is 1/3. The minimum residual length is √(1/3); these are different numbers. The coefficient norm ‖θ̂‖₂ is a third quantity and is not the ordinary least-squares objective.',
      ],
      equation: '‖b − Aθ‖₂² = ‖e‖₂² + ‖A(θ − θ̂)‖₂² ≥ ‖e‖₂²',
    },
    {
      title: 'The inverse formula has a rank assumption',
      paragraphs: [
        'For z ∈ ℝⁿ, zᵀGz = ‖Az‖₂². Thus G = AᵀA is invertible exactly when Null(A) = {0}, equivalently rank(A) = n. Under this assumption θ̂ = (AᵀA)⁻¹Aᵀb and b̂ = Pb, with P = A(AᵀA)⁻¹Aᵀ.',
        'The normal equations remain valid when columns are dependent, but the displayed inverse does not exist. Projection onto Col(A) still exists and is unique. One can use an orthonormal basis Qᵣ of its r-dimensional column space to obtain P = QᵣQᵣᵀ, or write P = AA⁺ using the Moore–Penrose pseudoinverse A⁺. The rank-deficient code example avoids using the invalid inverse formula.',
      ],
      equation:
        'rank(A) = n ⇒ unique θ̂; rank(A) < n ⇒ multiple θ̂, one fitted output Aθ̂',
    },
    {
      title: 'QR computes the same projection with orthonormal coordinates',
      paragraphs: [
        'For full column rank, A = QR with reduced Q having orthonormal columns. Split b into QQᵀb and its perpendicular residual. Then ‖Aθ − b‖₂² = ‖Rθ − Qᵀb‖₂² + ‖(I − QQᵀ)b‖₂². The second term cannot be changed by θ; the first becomes zero when Rθ̂ = Qᵀb.',
        'This gives the same fitted output QQᵀb as the Gram-matrix formula. In this example Q is 3 × 2, so QᵀQ = I₂, while QQᵀ is a rank-two projection in ℝ³. Different sign choices for columns of Q and matching rows of R leave QR and QQᵀ unchanged.',
      ],
      equation: 'Rθ̂ = Qᵀb; Aθ̂ = QRθ̂ = QQᵀb = Pb',
    },
    {
      title: 'Distinguish a linear subspace from a shifted tangent plane',
      paragraphs: [
        'Printed slide 33 projects s = (2,3,0)ᵀ onto the tangent plane through p₀ = (1,2,−1)ᵀ. That plane is p₀ + Col(A). First use the displacement b = s − p₀ = (1,1,1)ᵀ, which is exactly the target in our least-squares example.',
        'Pb = (2/3,4/3,2/3)ᵀ is the projected displacement. To recover the projected point in the original coordinates, add p₀: ŝ = p₀ + Pb = (5/3,10/3,−1/3)ᵀ. The projection onto the shifted plane is an affine map of s; P itself projects onto the subspace through the origin.',
      ],
      equation: 'ŝ = p₀ + P(s − p₀); s − ŝ = b − Pb = e',
    },
    {
      title:
        'Use the formulas to understand the problem and a solver to compute it',
      paragraphs: [
        'The Gram-matrix step exposes the lecture’s normal equations and uses np.linalg.solve(G, h) rather than explicitly computing G⁻¹. Forming AᵀA can worsen conditioning: for full column rank, its spectral condition number is the square of A’s. Solving with G instead of inverting it does not remove that effect. The small well-conditioned example is suitable for inspecting the formula.',
        'For general data, use np.linalg.lstsq(A, b, rcond=None), which works directly with A and supports rank-deficient systems. It returns a minimum-Euclidean-norm coefficient if minimizers are not unique. The rank cutoff depends on singular values and numerical precision, so near-dependent columns require attention to scale and tolerance. An approximately zero Aᵀe checks stationarity to the chosen tolerance; the algebra above proves optimality.',
      ],
    },
  ],
  checks: [
    {
      question: 'If Aᵀe = 0, must every residual entry be zero?',
      answer:
        'No. It means the residual is perpendicular to the column space. Here e = (1/3,−1/3,1/3)ᵀ is nonzero, yet Aᵀe = 0. Zero residual occurs exactly when b is reachable.',
    },
    {
      question: 'What lives in ℝ², and what lives in ℝ³?',
      answer:
        'θ and θ̂ have two coefficient coordinates. b, b̂ = Aθ̂, and e have three measurement coordinates. P acts in ℝ³; the coefficient map (AᵀA)⁻¹Aᵀ maps ℝ³ to ℝ².',
    },
    {
      question: 'Why minimize squared distance rather than distance?',
      answer:
        'For a nonnegative length, squaring is strictly increasing, so both objectives have the same minimizers. Their minimum values differ: the squared error is 1/3 here, while the residual length is 1/√3.',
    },
    {
      question: 'Does least squares always give unique coefficients?',
      answer:
        'It always gives a unique fitted output, the projection of b onto Col(A). Coefficients are unique exactly when A has independent columns. With dependent columns, adding any z in Null(A) preserves the output and error.',
    },
    {
      question: 'Can we use (AᵀA)⁻¹ if a column is duplicated?',
      answer:
        'No: duplicate columns make AᵀA singular. The normal equations still characterize minimizers. Use lstsq, an orthonormal basis of Col(A), or a pseudoinverse.',
    },
    {
      question: 'What does an empty sums_squared array from lstsq mean?',
      answer:
        'It means that this summary is not returned for the matrix shape or rank; it does not mean a perfect fit. Our 3 × 3 rank-two example returns an empty array and still has squared error 1/3. Compute e @ e.',
    },
    {
      question:
        'Is Pb the final point on the tangent plane in printed slide 33?',
      answer:
        'Pb is a displacement from p₀. The final point is p₀ + Pb = (5/3,10/3,−1/3)ᵀ. This distinction connects the linear projection to a plane that does not pass through the origin.',
    },
  ],
  references: [
    {
      title: 'NumPy: lstsq results and rank cutoff',
      url: 'https://numpy.org/doc/stable/reference/generated/numpy.linalg.lstsq.html',
    },
    {
      title: 'NumPy: reduced QR shapes',
      url: 'https://numpy.org/doc/stable/reference/generated/numpy.linalg.qr.html',
    },
  ],
};
