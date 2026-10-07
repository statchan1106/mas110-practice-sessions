export type Point = [number, number];
export type ExplorerKind =
  | 'inner-products'
  | 'polynomials'
  | 'qr'
  | 'least-squares';

export function dot(a: number[], b: number[]) {
  return a.reduce((sum, x, i) => sum + x * b[i], 0);
}
export function length(a: number[]) {
  return Math.sqrt(dot(a, a));
}

export function vectorGeometry(angle: number, magnitude: number) {
  const v: Point = [2, 1];
  const orientation = Math.atan2(v[1], v[0]) + (angle * Math.PI) / 180;
  const u: Point = [
    magnitude * Math.cos(orientation),
    magnitude * Math.sin(orientation),
  ];
  const lambda = dot(u, v) / dot(v, v);
  const projected: Point = [lambda * v[0], lambda * v[1]];
  const residual: Point = [u[0] - projected[0], u[1] - projected[1]];
  return {
    u,
    v,
    projected,
    residual,
    lambda,
    dot: dot(u, v),
    cosine: magnitude === 0 ? null : dot(u, v) / (magnitude * length(v)),
  };
}

export function polynomialInner(a: number[], b: number[]) {
  let result = 0;
  a.forEach((ai, i) =>
    b.forEach((bj, j) => {
      if ((i + j) % 2 === 0) result += (ai * bj * 2) / (i + j + 1);
    }),
  );
  return result;
}

export function evaluatePolynomial(coefficients: number[], t: number) {
  return coefficients.reduceRight((result, c) => result * t + c, 0);
}

const orthonormalPolynomials = [
  [Math.sqrt(1 / 2)],
  [0, Math.sqrt(3 / 2)],
  [-Math.sqrt(5 / 8), 0, 3 * Math.sqrt(5 / 8)],
  [0, -3 * Math.sqrt(7 / 8), 0, 5 * Math.sqrt(7 / 8)],
];

export function polynomialProjection(
  degree: number,
  approximationDegree: number,
) {
  const size = Math.max(degree, approximationDegree) + 1;
  const target = Array<number>(size).fill(0);
  target[degree] = 1;
  const projected = Array<number>(size).fill(0);
  orthonormalPolynomials.slice(0, approximationDegree + 1).forEach((q) => {
    const coefficient = polynomialInner(target, q);
    q.forEach((value, i) => {
      projected[i] += coefficient * value;
    });
  });
  const residual = target.map((value, i) => value - projected[i]);
  return {
    target,
    projected,
    residual,
    error: Math.max(0, polynomialInner(residual, residual)),
    orthogonality: orthonormalPolynomials
      .slice(0, approximationDegree + 1)
      .map((q) => polynomialInner(residual, q)),
  };
}

export function qrGeometry(angle: number) {
  const phi = (angle * Math.PI) / 180;
  const a1: Point = [Math.sqrt(2), 0];
  const a2: Point = [
    Math.sqrt(2) * Math.cos(phi),
    Math.sqrt(2) * Math.sin(phi),
  ];
  const old: Point = [a2[0], 0];
  const remainder: Point = [0, a2[1]];
  const r22 = length(remainder);
  const dependent = r22 <= 1e-10 * Math.sqrt(2);
  return {
    a1,
    a2,
    old,
    remainder,
    r12: a2[0],
    r22,
    dependent,
    q2: dependent ? null : ([0, Math.sign(a2[1])] as Point),
  };
}

export function leastSquaresGeometry(
  secondObservation: number,
  nullShift: number,
) {
  const b = [1, secondObservation, 1];
  const theta = [
    (secondObservation + 1) / 3,
    (2 * (secondObservation + 1)) / 3,
  ];
  const fitted = [-theta[0] + theta[1], theta[1], theta[0]];
  const residual = b.map((value, i) => value - fitted[i]);
  const coefficients = [
    theta[0],
    theta[1] / 2 + nullShift,
    theta[1] / 2 - nullShift,
  ];
  return {
    b,
    theta,
    fitted,
    residual,
    coefficients,
    sse: dot(residual, residual),
    sliceNormal: (2 - secondObservation) / Math.sqrt(3),
    sliceFit: length(fitted),
  };
}
