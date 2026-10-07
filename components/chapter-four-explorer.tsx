'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  evaluatePolynomial,
  leastSquaresGeometry,
  polynomialProjection,
  qrGeometry,
  vectorGeometry,
  type ExplorerKind,
  type Point,
} from '@/lib/chapter-four/geometry';

type Series = {
  label: string;
  points: Point[];
  tone: 'source' | 'target' | 'result' | 'neutral';
  vector?: boolean;
  dashed?: boolean;
};
const fmt = (value: number) =>
  Math.abs(value) < 1e-10 ? '0' : Number(value.toFixed(5)).toString();
const tuple = (values: number[]) => `(${values.map(fmt).join(', ')})`;

function Plot({
  series,
  xLabel,
  yLabel,
  equalUnits = true,
  summary,
}: {
  series: Series[];
  xLabel: string;
  yLabel: string;
  equalUnits?: boolean;
  summary: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const id = useId().replace(/:/g, '');
  const [width, setWidth] = useState(540);
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const observer = new ResizeObserver(() =>
      setWidth(Math.round(element.getBoundingClientRect().width)),
    );
    observer.observe(element);
    setWidth(Math.round(element.getBoundingClientRect().width));
    return () => observer.disconnect();
  }, []);
  const height = width < 400 ? 285 : 330;
  const padding = { left: 48, right: 24, top: 24, bottom: 52 };
  const plotWidth = Math.max(1, width - padding.left - padding.right);
  const plotHeight = height - padding.top - padding.bottom;
  const all = series.flatMap((s) => s.points).concat([[0, 0]]);
  const xs = all.map((p) => p[0]),
    ys = all.map((p) => p[1]);
  const xMin = Math.min(...xs),
    xMax = Math.max(...xs),
    yMin = Math.min(...ys),
    yMax = Math.max(...ys);
  let xSpan = Math.max(0.5, xMax - xMin) * 1.25,
    ySpan = Math.max(0.5, yMax - yMin) * 1.25;
  if (equalUnits) {
    const unit = Math.max(xSpan / plotWidth, ySpan / plotHeight);
    xSpan = unit * plotWidth;
    ySpan = unit * plotHeight;
  }
  const xLo = (xMin + xMax - xSpan) / 2,
    yLo = (yMin + yMax - ySpan) / 2;
  const x = (v: number) => padding.left + ((v - xLo) / xSpan) * plotWidth;
  const y = (v: number) =>
    height - padding.bottom - ((v - yLo) / ySpan) * plotHeight;
  const ticks = (lo: number, span: number) => [
    lo + span * 0.1,
    lo + span * 0.5,
    lo + span * 0.9,
  ];
  return (
    <div ref={ref} className="geometry-plot">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        aria-labelledby={`${id}-title ${id}-desc`}
      >
        <title id={`${id}-title`}>{summary}</title>
        <desc id={`${id}-desc`}>
          {series.map((s) => s.label).join('; ')}.{' '}
          {equalUnits
            ? 'Both axes use the same scale.'
            : 'Function values are plotted against their argument.'}
        </desc>
        <defs>
          {['source', 'target', 'result', 'neutral'].map((tone) => (
            <marker
              key={tone}
              id={`${id}-${tone}`}
              viewBox="0 0 10 10"
              refX="8"
              refY="5"
              markerWidth="5"
              markerHeight="5"
              orient="auto-start-reverse"
            >
              <path
                d="M 0 0 L 10 5 L 0 10 z"
                className={`geometry-marker is-${tone}`}
              />
            </marker>
          ))}
        </defs>
        <rect
          x={padding.left}
          y={padding.top}
          width={plotWidth}
          height={plotHeight}
          className="geometry-frame"
        />
        <g className="geometry-grid">
          {ticks(xLo, xSpan).map((t) => (
            <line
              key={`x${t}`}
              x1={x(t)}
              x2={x(t)}
              y1={padding.top}
              y2={height - padding.bottom}
            />
          ))}
          {ticks(yLo, ySpan).map((t) => (
            <line
              key={`y${t}`}
              x1={padding.left}
              x2={width - padding.right}
              y1={y(t)}
              y2={y(t)}
            />
          ))}
        </g>
        <g className="geometry-axis">
          <line
            x1={padding.left}
            x2={width - padding.right}
            y1={y(0)}
            y2={y(0)}
          />
          <line
            x1={x(0)}
            x2={x(0)}
            y1={padding.top}
            y2={height - padding.bottom}
          />
        </g>
        <g className="geometry-ticks">
          {ticks(xLo, xSpan).map((t) => (
            <text
              key={`x${t}`}
              x={x(t)}
              y={height - padding.bottom + 19}
              textAnchor="middle"
            >
              {Number(t.toFixed(1))}
            </text>
          ))}
          {ticks(yLo, ySpan).map((t) => (
            <text
              key={`y${t}`}
              x={padding.left - 7}
              y={y(t) + 4}
              textAnchor="end"
            >
              {Number(t.toFixed(1))}
            </text>
          ))}
        </g>
        <text
          className="geometry-axis-label"
          x={width - padding.right}
          y={height - 8}
          textAnchor="end"
        >
          {xLabel}
        </text>
        <text className="geometry-axis-label" x={padding.left} y={14}>
          {yLabel}
        </text>
        {series.map((s) => (
          <path
            key={s.label}
            d={s.points
              .map((p, i) => `${i === 0 ? 'M' : 'L'}${x(p[0])},${y(p[1])}`)
              .join(' ')}
            className={`geometry-series is-${s.tone}${s.dashed ? ' is-dashed' : ''}`}
            markerEnd={
              s.vector &&
              s.points.some(
                (p) =>
                  Math.hypot(p[0] - s.points[0][0], p[1] - s.points[0][1]) >
                  1e-10,
              )
                ? `url(#${id}-${s.tone})`
                : undefined
            }
          />
        ))}
      </svg>
      <ul className="geometry-legend">
        {series.map((s) => (
          <li key={s.label}>
            <i
              aria-hidden="true"
              className={`is-${s.tone}${s.dashed ? ' is-dashed' : ''}`}
            />
            {s.label}
          </li>
        ))}
      </ul>
    </div>
  );
}

function Slider({
  label,
  value,
  min,
  max,
  step = 1,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number | 'any';
  onChange: (value: number) => void;
}) {
  const id = useId();
  return (
    <div className="geometry-field">
      <label htmlFor={id}>
        {label} <output htmlFor={id}>{fmt(value)}</output>
      </label>
      <input
        id={id}
        type="range"
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    </div>
  );
}

function Metrics({ items }: { items: Array<[string, string]> }) {
  return (
    <dl className="geometry-values" aria-live="polite">
      {items.map(([name, value]) => (
        <div key={name}>
          <dt>{name}</dt>
          <dd>{value}</dd>
        </div>
      ))}
    </dl>
  );
}

function InnerProductExplorer() {
  const [angle, setAngle] = useState(36.86989764584402);
  const [magnitude, setMagnitude] = useState(Math.sqrt(5));
  const g = vectorGeometry(angle, magnitude);
  return (
    <>
      <p>
        Keep v = (2,1)ᵀ fixed. Rotate u relative to v or change its length. At
        90° the projection vanishes; at length zero the angle is undefined.
      </p>
      <div className="geometry-controls">
        <Slider
          label="Angle φ (degrees)"
          value={angle}
          min={0}
          max={180}
          step="any"
          onChange={setAngle}
        />
        <Slider
          label="Length ‖u‖₂"
          value={magnitude}
          min={0}
          max={3}
          step="any"
          onChange={setMagnitude}
        />
      </div>
      <Metrics
        items={[
          ['⟨u,v⟩', fmt(g.dot)],
          [
            'cos φ',
            g.cosine === null ? 'undefined · zero vector' : fmt(g.cosine),
          ],
          ['vᵀe', fmt(g.v[0] * g.residual[0] + g.v[1] * g.residual[1])],
        ]}
      />
      <Plot
        summary="Projection of u onto the line through v"
        xLabel="first coordinate"
        yLabel="second coordinate"
        series={[
          {
            label: 'v · fixed direction',
            points: [[0, 0], g.v],
            tone: 'neutral',
            vector: true,
          },
          {
            label: 'u · input',
            points: [[0, 0], g.u],
            tone: 'target',
            vector: true,
          },
          {
            label: 'p · projection',
            points: [[0, 0], g.projected],
            tone: 'source',
            vector: true,
          },
          {
            label: 'e = u − p · residual',
            points: [g.projected, g.u],
            tone: 'result',
            dashed: true,
            vector: true,
          },
        ]}
      />
      <p className="geometry-result">
        u = {tuple(g.u)}; p = {tuple(g.projected)}; e = {tuple(g.residual)}. The
        perpendicularity check stays zero as the input changes.
      </p>
    </>
  );
}

function PolynomialExplorer() {
  const [degree, setDegree] = useState(2);
  const [approximation, setApproximation] = useState(1);
  const id = useId();
  const g = polynomialProjection(degree, approximation);
  const sample = (coefficients: number[]): Point[] =>
    Array.from({ length: 121 }, (_, i) => {
      const t = -1 + i / 60;
      return [t, evaluatePolynomial(coefficients, t)];
    });
  const equation =
    g.projected
      .map((c, i) =>
        Math.abs(c) < 1e-10
          ? null
          : `${fmt(c)}${i === 0 ? '' : i === 1 ? 't' : `t^${i}`}`,
      )
      .filter(Boolean)
      .join(' + ')
      .replace(/\+ -/g, '− ') || '0';
  return (
    <>
      <p>
        Project f(t) = tⁿ onto 𝒫ₖ using ∫₋₁¹ fg. Compare the target, its closest
        polynomial, and the residual over the whole interval. The curve’s
        vertical axis shows values, not coefficient coordinates.
      </p>
      <div className="geometry-controls">
        <Slider
          label="Target degree n"
          value={degree}
          min={2}
          max={8}
          onChange={setDegree}
        />
        <div className="geometry-field">
          <label htmlFor={id}>Approximation space</label>
          <select
            id={id}
            value={approximation}
            onChange={(e) => setApproximation(Number(e.target.value))}
          >
            {[0, 1, 2, 3].map((k) => (
              <option key={k} value={k}>
                𝒫{k} · degree at most {k}
              </option>
            ))}
          </select>
        </div>
      </div>
      <Metrics
        items={[
          ['Integrated squared error', fmt(g.error)],
          ['Largest |⟨e,qⱼ⟩|', fmt(Math.max(...g.orthogonality.map(Math.abs)))],
        ]}
      />
      <Plot
        summary={`Projection of t^${degree} onto polynomials of degree at most ${approximation}`}
        xLabel="argument t"
        yLabel="function value"
        equalUnits={false}
        series={[
          {
            label: `f(t) = t^${degree}`,
            points: sample(g.target),
            tone: 'target',
          },
          {
            label: 'p(t) · closest polynomial',
            points: sample(g.projected),
            tone: 'source',
          },
          {
            label: 'e(t) = f(t) − p(t)',
            points: sample(g.residual),
            tone: 'result',
            dashed: true,
          },
        ]}
      />
      <p className="geometry-result">
        p(t) = {equation}.{' '}
        {g.error < 1e-10
          ? 'The approximation space contains this target, so the residual is zero.'
          : 'The residual is orthogonal in the integral inner product, even where the curves have different heights.'}
      </p>
    </>
  );
}

function QRExplorer() {
  const [angle, setAngle] = useState(120);
  const [phase, setPhase] = useState(0);
  const g = qrGeometry(angle);
  const series: Series[] = [
    {
      label: 'a₁ · first column',
      points: [[0, 0], g.a1],
      tone: 'neutral',
      vector: true,
    },
    {
      label: 'a₂ · second column',
      points: [[0, 0], g.a2],
      tone: 'target',
      vector: true,
    },
  ];
  if (phase >= 1)
    series.push(
      {
        label: 'r₁₂q₁ · old component',
        points: [[0, 0], g.old],
        tone: 'source',
        vector: true,
      },
      {
        label: 'w₂ · perpendicular remainder',
        points: [g.old, g.a2],
        tone: 'result',
        dashed: true,
        vector: true,
      },
    );
  if (phase >= 2 && g.q2)
    series.push({
      label: 'q₂ · normalized remainder',
      points: [[0, 0], g.q2],
      tone: 'result',
      vector: true,
    });
  return (
    <>
      <p>
        This is the plane of the lecture’s columns, shown in its orthonormal
        q₁,q₂ coordinates. The initial angle 120° gives the lecture’s exact
        components. Change the angle to see when the second column adds a new
        direction.
      </p>
      <div className="geometry-controls">
        <Slider
          label="Angle between columns (degrees)"
          value={angle}
          min={0}
          max={180}
          onChange={setAngle}
        />
        <div className="geometry-field">
          <span>
            Step {phase + 1} of 3 ·{' '}
            {
              [
                'original columns',
                'subtract old component',
                'normalize remainder',
              ][phase]
            }
          </span>
          <Button type="button" onClick={() => setPhase((phase + 1) % 3)}>
            {['Show subtraction', 'Show normalization', 'Start again'][phase]}
          </Button>
        </div>
      </div>
      <Metrics
        items={[
          ['r₁₂', fmt(g.r12)],
          ['r₂₂ = ‖w₂‖₂', fmt(g.r22)],
          ['Column rank', g.dependent ? '1 · dependent' : '2 · independent'],
        ]}
      />
      <Plot
        summary="Gram–Schmidt in the plane spanned by the lecture columns"
        xLabel="coordinate along lecture q₁"
        yLabel="coordinate along lecture q₂"
        series={series}
      />
      <p className="geometry-result" role={g.dependent ? 'status' : undefined}>
        {g.dependent
          ? 'The remainder is zero. Do not normalize it; there is no second column-space direction. A QR factorization can still exist with singular R.'
          : `a₂ = ${fmt(g.r12)}q₁ + ${fmt(g.r22)}q₂. The normalization changes the remainder’s length to 1, while R keeps the original scale.`}
      </p>
    </>
  );
}

function LeastSquaresExplorer() {
  const [observation, setObservation] = useState(1);
  const [shift, setShift] = useState(0);
  const g = leastSquaresGeometry(observation, shift);
  return (
    <>
      <p>
        Keep A fixed and vary only b₂ in b = (1,b₂,1)ᵀ. The graph is a 2D
        orthonormal slice through the fitted vector and the residual in ℝ³. The
        vertical coordinate is along ℓ/√3, where ℓ = (1,−1,1)ᵀ; it can be
        negative.
      </p>
      <div className="geometry-controls">
        <Slider
          label="Observation b₂"
          value={observation}
          min={-2}
          max={3}
          step={0.25}
          onChange={setObservation}
        />
        <Slider
          label="Null-space shift t · duplicated column"
          value={shift}
          min={-2}
          max={2}
          step={0.25}
          onChange={setShift}
        />
      </div>
      <Metrics
        items={[
          ['Minimum squared error', fmt(g.sse)],
          ['Original coefficient θ̂', tuple(g.theta)],
          ['Aᵀe', '(0, 0)'],
        ]}
      />
      <Plot
        summary="Best fitted output and perpendicular residual"
        xLabel="along b̂ · reachable"
        yLabel="along ℓ/√3"
        series={[
          {
            label: 'b̂ · fitted output',
            points: [
              [0, 0],
              [g.sliceFit, 0],
            ],
            tone: 'source',
            vector: true,
          },
          {
            label: 'b · observation',
            points: [
              [0, 0],
              [g.sliceFit, g.sliceNormal],
            ],
            tone: 'target',
            vector: true,
          },
          {
            label: 'e · perpendicular residual',
            points: [
              [g.sliceFit, 0],
              [g.sliceFit, g.sliceNormal],
            ],
            tone: 'result',
            vector: true,
            dashed: true,
          },
        ]}
      />
      <p className="geometry-result">
        b̂ = {tuple(g.fitted)}; e = {tuple(g.residual)}.{' '}
        {g.sse < 1e-10
          ? 'This target is reachable, so the fit is exact.'
          : 'The residual is perpendicular even though it is nonzero.'}
      </p>
      <p>
        With column 2 duplicated, θ(t) = {tuple(g.coefficients)} = θ_min +
        t(0,1,−1)ᵀ. Changing t preserves the fitted output and squared error; t
        = 0 selects the smallest coefficient norm.
      </p>
    </>
  );
}

const explorers = {
  'inner-products': InnerProductExplorer,
  polynomials: PolynomialExplorer,
  qr: QRExplorer,
  'least-squares': LeastSquaresExplorer,
};
export function ChapterFourExplorer({ kind }: { kind: ExplorerKind }) {
  const Explorer = explorers[kind];
  return (
    <section
      className="geometry-explorer"
      aria-labelledby="geometry-heading"
      data-explorer={kind}
    >
      <p className="section-kicker">Change the input</p>
      <h2 id="geometry-heading" className="section-title mt-3">
        See the geometry respond
      </h2>
      <Explorer />
    </section>
  );
}
