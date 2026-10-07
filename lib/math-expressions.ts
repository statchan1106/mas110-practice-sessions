// Explicit TeX for mathematical UI labels. Keep readable source strings in the
// lessons and notebooks; never guess whether prose or Python code is a formula.
const expressions: Array<[string, string]> = [
  ['⟨u,v⟩ = uᵀv', String.raw`\langle u,v\rangle = u^{\mathsf T}v`],
  [
    '⟨f,g⟩ = ∫₋₁¹ fg = cᵀGd',
    String.raw`\langle f,g\rangle = \int_{-1}^{1} f(t)g(t)\,dt = c^{\mathsf T}Gd`,
  ],
  ['A = QR; QᵀQ = Iₙ', String.raw`A = QR;\quad Q^{\mathsf T}Q = I_n`],
  ['Aᵀ(b − Aθ̂) = 0', String.raw`A^{\mathsf T}(b-A\hat\theta)=0`],
  [
    '⟨u,v⟩; ‖u‖; u ⊥ v',
    String.raw`\langle u,v\rangle;\quad \lVert u\rVert;\quad u\perp v`,
  ],
  ['φ; θ; θ̂', String.raw`\varphi;\quad \theta;\quad \hat\theta`],
  ['A; G; Q; R; P', String.raw`A;\quad G;\quad Q;\quad R;\quad P`],
  [
    '⟨·,·⟩ and ‖·‖',
    String.raw`\langle\cdot,\cdot\rangle\ \text{and}\ \lVert\cdot\rVert`,
  ],
  ['φ and θ̂', String.raw`\varphi\ \text{and}\ \hat\theta`],
  ['A and G', String.raw`A\ \text{and}\ G`],
  ['Q, R, P', String.raw`Q,\ R,\ P`],
  [
    'θ̂ = (2/3,4/3)ᵀ',
    String.raw`\hat\theta=\begin{pmatrix}2/3\\4/3\end{pmatrix}`,
  ],
  ['b̂ = Aθ̂', String.raw`\hat b=A\hat\theta`],
  ['Aᵀ(b − b̂) = 0', String.raw`A^{\mathsf T}(b-\hat b)=0`],
  ['e = b − b̂', String.raw`e=b-\hat b`],
  [
    'u,v ∈ ℝ²; q = v/‖v‖₂',
    String.raw`u,v\in\mathbb R^2;\quad q=\frac{v}{\lVert v\rVert_2}`,
  ],
  [
    'cos φ = uᵀv/(‖u‖₂‖v‖₂)',
    String.raw`\cos\varphi=\frac{u^{\mathsf T}v}{\lVert u\rVert_2\lVert v\rVert_2}`,
  ],
  [
    'p = λv; λ = uᵀv/(vᵀv); e = u − p',
    String.raw`p=\lambda v;\quad \lambda=\frac{u^{\mathsf T}v}{v^{\mathsf T}v};\quad e=u-p`,
  ],
  [
    'Q ∈ ℝᵐˣᵏ; QᵀQ = Iₖ',
    String.raw`Q\in\mathbb R^{m\times k};\quad Q^{\mathsf T}Q=I_k`,
  ],
  ['W⊥; V = W ⊕ W⊥', String.raw`W^\perp;\quad V=W\oplus W^\perp`],
  [
    '‖u‖₂ = √(uᵀu); cos φ = ⟨u,v⟩/(‖u‖₂‖v‖₂)',
    String.raw`\lVert u\rVert_2=\sqrt{u^{\mathsf T}u};\quad \cos\varphi=\frac{\langle u,v\rangle}{\lVert u\rVert_2\lVert v\rVert_2}`,
  ],
  ['p = (qᵀu)q; e = u − p', String.raw`p=(q^{\mathsf T}u)q;\quad e=u-p`],
  [
    '|⟨u,v⟩| ≤ ‖u‖₂‖v‖₂; here cos φ = 4/5',
    String.raw`|\langle u,v\rangle|\le\lVert u\rVert_2\lVert v\rVert_2;\quad \text{here }\cos\varphi=\frac45`,
  ],
  [
    'p = (uᵀv)/(vᵀv) · v = (qᵀu)q',
    String.raw`p=\frac{u^{\mathsf T}v}{v^{\mathsf T}v}\,v=(q^{\mathsf T}u)q`,
  ],
  [
    '‖u − μv‖₂² = ‖e‖₂² + (μ − λ)²‖v‖₂²',
    String.raw`\lVert u-\mu v\rVert_2^2=\lVert e\rVert_2^2+(\mu-\lambda)^2\lVert v\rVert_2^2`,
  ],
  [
    'q = (2,1)ᵀ/√5 ⇒ P = 1/5 · [[4,2],[2,1]] ≠ I₂',
    String.raw`q=\frac1{\sqrt5}\begin{pmatrix}2\\1\end{pmatrix}\ \Rightarrow\ P=\frac15\begin{pmatrix}4&2\\2&1\end{pmatrix}\ne I_2`,
  ],
  ['⟨u,v⟩ = 4', String.raw`\langle u,v\rangle=4`],
  [
    '‖u‖₂ = ‖v‖₂ = √5; ‖q‖₂ = 1',
    String.raw`\lVert u\rVert_2=\lVert v\rVert_2=\sqrt5;\quad \lVert q\rVert_2=1`,
  ],
  [
    'cos φ = 4/5; φ ≈ 36.87°',
    String.raw`\cos\varphi=\frac45;\quad \varphi\approx36.87^\circ`,
  ],
  ['u = p + e; vᵀe = 0', String.raw`u=p+e;\quad v^{\mathsf T}e=0`],
  ['QᵀQ = [1]; QQᵀ = P', String.raw`Q^{\mathsf T}Q=[1];\quad QQ^{\mathsf T}=P`],
  [
    '‖u‖₂² = 16/5 + 9/5 = 5; Q_fullQ_fullᵀ = I₂',
    String.raw`\lVert u\rVert_2^2=\frac{16}5+\frac95=5;\quad Q_{\mathrm{full}}Q_{\mathrm{full}}^{\mathsf T}=I_2`,
  ],
  ['𝒫ₙ; B = (1,t,…,tⁿ)', String.raw`\mathcal P_n;\quad B=(1,t,\ldots,t^n)`],
  [
    'f(t) = c₀ + c₁t + c₂t²; [f]ᴮ = c',
    String.raw`f(t)=c_0+c_1t+c_2t^2;\quad [f]^B=c`,
  ],
  [
    'Gᵢⱼ = ∫₋₁¹ tⁱ⁺ʲ dt, i,j = 0,…,n',
    String.raw`G_{ij}=\int_{-1}^1t^{i+j}\,dt,\quad i,j=0,\ldots,n`,
  ],
  [
    '⟨f,g⟩ = cᵀGd; ‖f‖² = cᵀGc',
    String.raw`\langle f,g\rangle=c^{\mathsf T}Gd;\quad \lVert f\rVert^2=c^{\mathsf T}Gc`,
  ],
  [
    'q₀,q₁,q₂; C = [[q₀]ᴮ | [q₁]ᴮ | [q₂]ᴮ]',
    String.raw`q_0,q_1,q_2;\quad C=\bigl[\,[q_0]^B\mid[q_1]^B\mid[q_2]^B\,\bigr]`,
  ],
  [
    'Legendre Pₖ(t); normalized qₖ(t)',
    String.raw`\text{Legendre }P_k(t);\quad \text{normalized }q_k(t)`,
  ],
  ['f(t) = c₀ + c₁t + c₂t²', String.raw`f(t)=c_0+c_1t+c_2t^2`],
  ['CᵀGC = I', String.raw`C^{\mathsf T}GC=I`],
  [
    '⟨t,t²⟩ = 0; ‖t‖² = 2/3; ‖t²‖² = 2/5',
    String.raw`\langle t,t^2\rangle=0;\quad \lVert t\rVert^2=\frac23;\quad \lVert t^2\rVert^2=\frac25`,
  ],
  [
    'G = [[2,0,2/3],[0,2/3,0],[2/3,0,2/5]]',
    String.raw`G=\begin{pmatrix}2&0&2/3\\0&2/3&0\\2/3&0&2/5\end{pmatrix}`,
  ],
  [
    'q₂(t) = √(45/8)(t² − 1/3); ∫₋₁¹ (t² − 1/3)² dt = 8/45',
    String.raw`q_2(t)=\sqrt{\frac{45}8}\bigl(t^2-\tfrac13\bigr);\quad \int_{-1}^1\bigl(t^2-\tfrac13\bigr)^2\,dt=\frac8{45}`,
  ],
  [
    '‖t² − (a + bt)‖² = 8/45 + 2(a − 1/3)² + (2/3)b²',
    String.raw`\lVert t^2-(a+bt)\rVert^2=\frac8{45}+2\bigl(a-\tfrac13\bigr)^2+\frac23b^2`,
  ],
  [
    'G-weighted projection: ĉ = E(EᵀGE)⁻¹EᵀGc',
    String.raw`\text{G-weighted projection: }\hat c=E(E^{\mathsf T}GE)^{-1}E^{\mathsf T}Gc`,
  ],
  ['f(t) = t; g(t) = t²', String.raw`f(t)=t;\quad g(t)=t^2`],
  [
    '⟨f,g⟩ = [f]ᴮᵀG[g]ᴮ',
    String.raw`\langle f,g\rangle=([f]^B)^{\mathsf T}G[g]^B`,
  ],
  [
    'q₀ = 1/√2; q₁ = √(3/2)t; q₂ = √(45/8)(t²−1/3)',
    String.raw`q_0=\frac1{\sqrt2};\quad q_1=\sqrt{\frac32}\,t;\quad q_2=\sqrt{\frac{45}8}\bigl(t^2-\tfrac13\bigr)`,
  ],
  [
    'p(t) = 1/3; min ∫₋₁¹ (t²−p(t))² dt = 8/45',
    String.raw`p(t)=\frac13;\quad \min_{p\in\mathcal P_1}\int_{-1}^1(t^2-p(t))^2\,dt=\frac8{45}`,
  ],
  [
    '(EᵀGE)α = EᵀG[target]; projection_gram = projection',
    String.raw`(E^{\mathsf T}GE)\alpha=E^{\mathsf T}G[\mathrm{target}];\quad \mathtt{projection\_gram}=\mathtt{projection}`,
  ],
  ['A = [a₁ | a₂] ∈ ℝ³ˣ²', String.raw`A=[a_1\mid a_2]\in\mathbb R^{3\times2}`],
  [
    'wⱼ; qⱼ = wⱼ/‖wⱼ‖₂',
    String.raw`w_j;\quad q_j=\frac{w_j}{\lVert w_j\rVert_2}`,
  ],
  [
    'rᵢⱼ = qᵢᵀaⱼ (i < j); rⱼⱼ = ‖wⱼ‖₂',
    String.raw`r_{ij}=q_i^{\mathsf T}a_j\ (i<j);\quad r_{jj}=\lVert w_j\rVert_2`,
  ],
  [
    'Q ∈ ℝᵐˣⁿ; R ∈ ℝⁿˣⁿ, m ≥ n',
    String.raw`Q\in\mathbb R^{m\times n};\quad R\in\mathbb R^{n\times n},\quad m\ge n`,
  ],
  [
    'Complete QR; Q_full ∈ ℝᵐˣᵐ',
    String.raw`\text{Complete QR};\quad Q_{\mathrm{full}}\in\mathbb R^{m\times m}`,
  ],
  [
    'wⱼ = aⱼ − Σᵢ<ⱼ(qᵢᵀaⱼ)qᵢ',
    String.raw`w_j=a_j-\sum_{i<j}(q_i^{\mathsf T}a_j)q_i`,
  ],
  [
    '‖A−QR‖; ‖QᵀQ−I‖',
    String.raw`\lVert A-QR\rVert;\quad \lVert Q^{\mathsf T}Q-I\rVert`,
  ],
  ['aⱼ = Σᵢ<ⱼ rᵢⱼqᵢ + rⱼⱼqⱼ', String.raw`a_j=\sum_{i<j}r_{ij}q_i+r_{jj}q_j`],
  [
    'span{a₁,…,aⱼ} = span{q₁,…,qⱼ}; A = QR',
    String.raw`\operatorname{span}\{a_1,\ldots,a_j\}=\operatorname{span}\{q_1,\ldots,q_j\};\quad A=QR`,
  ],
  [
    'a₂ = −(1/√2)q₁ + (√6/2)q₂',
    String.raw`a_2=-\frac1{\sqrt2}q_1+\frac{\sqrt6}2q_2`,
  ],
  [
    'Qᵀb = (0,4/√6)ᵀ; Rθ̂ = Qᵀb; b̂ = QQᵀb',
    String.raw`Q^{\mathsf T}b=\begin{pmatrix}0\\4/\sqrt6\end{pmatrix};\quad R\hat\theta=Q^{\mathsf T}b;\quad \hat b=QQ^{\mathsf T}b`,
  ],
  ['a₁ᵀa₂ = −1', String.raw`a_1^{\mathsf T}a_2=-1`],
  ['r₁₁ = √2; q₁ᵀq₁ = 1', String.raw`r_{11}=\sqrt2;\quad q_1^{\mathsf T}q_1=1`],
  [
    'a₂ = r₁₂q₁ + w₂; q₁ᵀw₂ = 0',
    String.raw`a_2=r_{12}q_1+w_2;\quad q_1^{\mathsf T}w_2=0`,
  ],
  [
    'A = QR; R is upper triangular',
    String.raw`A=QR;\quad R\text{ is upper triangular}`,
  ],
  [
    'P = QQᵀ; P² = P; P ≠ I₃',
    String.raw`P=QQ^{\mathsf T};\quad P^2=P;\quad P\ne I_3`,
  ],
  [
    'Rθ̂ = Qᵀb; Aθ̂ = QQᵀb',
    String.raw`R\hat\theta=Q^{\mathsf T}b;\quad A\hat\theta=QQ^{\mathsf T}b`,
  ],
  [
    'rank([a₁ | 2a₁]) = 1; R is singular',
    String.raw`\operatorname{rank}([a_1\mid2a_1])=1;\quad R\text{ is singular}`,
  ],
  [
    'φ; θ; qⱼ; wⱼ; G',
    String.raw`\varphi;\quad\theta;\quad q_j;\quad w_j;\quad G`,
  ],
  [
    'A ∈ ℝᵐˣⁿ; here m = 3, n = 2',
    String.raw`A\in\mathbb R^{m\times n};\quad\text{here }m=3,\ n=2`,
  ],
  [
    'aᵢ ∈ ℝⁿ; row i is aᵢᵀ',
    String.raw`a_i\in\mathbb R^n;\quad\text{row }i\text{ is }a_i^{\mathsf T}`,
  ],
  ['θ; θ̂; b̂ = Aθ̂', String.raw`\theta;\quad\hat\theta;\quad\hat b=A\hat\theta`],
  [
    'e = b − b̂; f(θ) = ‖Aθ − b‖₂²',
    String.raw`e=b-\hat b;\quad f(\theta)=\lVert A\theta-b\rVert_2^2`,
  ],
  [
    '⟨u,v⟩ = uᵀv; e ⊥ Col(A)',
    String.raw`\langle u,v\rangle=u^{\mathsf T}v;\quad e\perp\operatorname{Col}(A)`,
  ],
  [
    'G = AᵀA; h = Aᵀb; Gθ̂ = h',
    String.raw`G=A^{\mathsf T}A;\quad h=A^{\mathsf T}b;\quad G\hat\theta=h`,
  ],
  [
    'P = A(AᵀA)⁻¹Aᵀ; b̂ = Pb',
    String.raw`P=A(A^{\mathsf T}A)^{-1}A^{\mathsf T};\quad\hat b=Pb`,
  ],
  [
    'A = QR; QᵀQ = Iₙ; P = QQᵀ',
    String.raw`A=QR;\quad Q^{\mathsf T}Q=I_n;\quad P=QQ^{\mathsf T}`,
  ],
  [
    'arg min; rank(A); Null(A)',
    String.raw`\operatorname*{arg\,min};\quad\operatorname{rank}(A);\quad\operatorname{Null}(A)`,
  ],
  [
    'f(θ) = ‖Aθ − b‖₂²; θ̂ ∈ arg min f',
    String.raw`f(\theta)=\lVert A\theta-b\rVert_2^2;\quad\hat\theta\in\operatorname*{arg\,min}_{\theta}f(\theta)`,
  ],
  [
    'AᵀAθ̂ = Aᵀb ⇔ Aᵀe = 0',
    String.raw`A^{\mathsf T}A\hat\theta=A^{\mathsf T}b\ \Longleftrightarrow\ A^{\mathsf T}e=0`,
  ],
  [
    'b = b̂ + e; b̂ ∈ Col(A), e ∈ Null(Aᵀ)',
    String.raw`b=\hat b+e;\quad\hat b\in\operatorname{Col}(A),\quad e\in\operatorname{Null}(A^{\mathsf T})`,
  ],
  [
    'all minimizers = θ̂ + Null(A)',
    String.raw`\text{all minimizers}=\hat\theta+\operatorname{Null}(A)`,
  ],
  [
    'θ̂ minimizes ‖Aθ − b‖₂²; b̂ = Aθ̂ is the closest point of Col(A) to b',
    String.raw`\hat\theta\in\operatorname*{arg\,min}_{\theta}\lVert A\theta-b\rVert_2^2;\quad\hat b=A\hat\theta=\operatorname{proj}_{\operatorname{Col}(A)}b`,
  ],
  [
    '∇f(θ̂) = 0 ⇔ Aᵀ(Aθ̂ − b) = 0 ⇔ Aᵀe = 0',
    String.raw`\nabla f(\hat\theta)=0\ \Longleftrightarrow\ A^{\mathsf T}(A\hat\theta-b)=0\ \Longleftrightarrow\ A^{\mathsf T}e=0`,
  ],
  [
    '‖b − Aθ‖₂² = ‖e‖₂² + ‖A(θ − θ̂)‖₂² ≥ ‖e‖₂²',
    String.raw`\lVert b-A\theta\rVert_2^2=\lVert e\rVert_2^2+\lVert A(\theta-\hat\theta)\rVert_2^2\ge\lVert e\rVert_2^2`,
  ],
  [
    'rank(A) = n ⇒ unique θ̂; rank(A) < n ⇒ multiple θ̂, one fitted output Aθ̂',
    String.raw`\operatorname{rank}(A)=n\ \Rightarrow\ \text{unique }\hat\theta;\quad\operatorname{rank}(A)<n\ \Rightarrow\ \text{multiple }\hat\theta,\ \text{one }A\hat\theta`,
  ],
  [
    'Rθ̂ = Qᵀb; Aθ̂ = QRθ̂ = QQᵀb = Pb',
    String.raw`R\hat\theta=Q^{\mathsf T}b;\quad A\hat\theta=QR\hat\theta=QQ^{\mathsf T}b=Pb`,
  ],
  [
    'ŝ = p₀ + P(s − p₀); s − ŝ = b − Pb = e',
    String.raw`\hat s=p_0+P(s-p_0);\quad s-\hat s=b-Pb=e`,
  ],
  [
    'Aᵀℓ = 0; ℓᵀb = 1 ≠ 0',
    String.raw`A^{\mathsf T}\ell=0;\quad\ell^{\mathsf T}b=1\ne0`,
  ],
  ['f(0) = ‖b‖₂² = 3', String.raw`f(0)=\lVert b\rVert_2^2=3`],
  [
    'Gθ̂ = h; θ̂ = (2/3,4/3)ᵀ',
    String.raw`G\hat\theta=h;\quad\hat\theta=\begin{pmatrix}2/3\\4/3\end{pmatrix}`,
  ],
  [
    'b = b̂ + e; Aᵀe = 0; min f = 1/3',
    String.raw`b=\hat b+e;\quad A^{\mathsf T}e=0;\quad\min_{\theta}f(\theta)=\frac13`,
  ],
  [
    'Pᵀ = P; P² = P; Pb = b̂; (I₃ − P)b = e',
    String.raw`P^{\mathsf T}=P;\quad P^2=P;\quad Pb=\hat b;\quad (I_3-P)b=e`,
  ],
  [
    'θ_qr = θ_normal; QQᵀ = P ≠ I₃',
    String.raw`\theta_{\mathrm{qr}}=\theta_{\mathrm{normal}};\quad QQ^{\mathsf T}=P\ne I_3`,
  ],
  [
    'θ_normal ≈ θ_qr ≈ θ_hat; ‖b − Aθ̂‖₂² ≈ 1/3',
    String.raw`\theta_{\mathrm{normal}}\approx\theta_{\mathrm{qr}}\approx\hat\theta;\quad\lVert b-A\hat\theta\rVert_2^2\approx\frac13`,
  ],
  [
    'all minimizers = θ_dep + t(0,1,−1)ᵀ, t ∈ ℝ',
    String.raw`\text{all minimizers}=\theta_{\mathrm{dep}}+t\begin{pmatrix}0\\1\\-1\end{pmatrix},\quad t\in\mathbb R`,
  ],
  ['⟨u,v⟩', String.raw`\langle u,v\rangle`],
  ['cos φ', String.raw`\cos\varphi`],
  ['vᵀe', String.raw`v^{\mathsf T}e`],
  ['r₁₂', String.raw`r_{12}`],
  ['r₂₂ = ‖w₂‖₂', String.raw`r_{22}=\lVert w_2\rVert_2`],
  ['Largest |⟨e,qⱼ⟩|', String.raw`\text{Largest }|\langle e,q_j\rangle|`],
  ['Length ‖u‖₂', String.raw`\text{Length }\lVert u\rVert_2`],
];

export const mathExpressions = new Map(expressions);
