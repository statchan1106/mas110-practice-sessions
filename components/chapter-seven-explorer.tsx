'use client';

import { useId, useState } from 'react';
import { MathProse } from '@/components/math-prose';
import { MathText } from '@/components/math-text';

const pointLength = 1.3;
const unitsToPercent = 100 / 7;
const pointOffset = pointLength * unitsToPercent;

function decimal(value: number) {
  return (Math.abs(value) < 0.0005 ? 0 : value).toFixed(3);
}

export function ChapterSevenExplorer() {
  const id = useId();
  const [identity, setIdentity] = useState(false);
  const [angle, setAngle] = useState(45);
  const radians = (angle * Math.PI) / 180;
  const x1 = pointLength * Math.cos(radians);
  const x2 = pointLength * Math.sin(radians);
  const y1 = identity ? x1 : (x1 + x2) / Math.SQRT2;
  const y2 = identity ? x2 : (x1 - x2) / Math.SQRT2;
  const lambda1 = identity ? 1 : 9;
  const squaredDistance = y1 ** 2 / lambda1 + y2 ** 2;
  const distance = Math.sqrt(squaredDistance);
  const location =
    Math.abs(distance - 1) < 1e-10
      ? 'On the boundary'
      : distance < 1
        ? 'Inside the ellipsoid'
        : 'Outside the ellipsoid';
  const majorDiameter = 2 * Math.sqrt(lambda1) * unitsToPercent;
  const minorDiameter = 2 * unitsToPercent;

  return (
    <section
      id="explore"
      className="geometry-explorer scroll-mt-24"
      aria-labelledby={`${id}-heading`}
    >
      <h2 id={`${id}-heading`} className="section-title">
        Explore the ellipsoid
      </h2>
      <p>
        <MathProse>
          {
            'Rotate $x$ at a fixed Euclidean length $|x|=1.3$. Watch how its coordinates along the principal axes change $d_A(x,0)$ and whether it belongs to $\\mathcal E$.'
          }
        </MathProse>
      </p>
      <div className="mt-6 grid items-start gap-7 rounded-2xl border bg-card p-4 sm:p-6 lg:grid-cols-2">
        <div className="min-w-0 space-y-5">
          <div className="geometry-field">
            <label htmlFor={`${id}-matrix`} className="font-semibold">
              <span>
                <MathProse>{'Matrix $A$'}</MathProse>
              </span>
            </label>
            <select
              id={`${id}-matrix`}
              value={identity ? 'identity' : 'example'}
              onChange={(event) =>
                setIdentity(event.target.value === 'identity')
              }
            >
              <option value="example">Worked example</option>
              <option value="identity">Identity matrix</option>
            </select>
            <div className="flex flex-wrap items-center gap-x-3 text-sm">
              <MathText
                children={null}
                tex={
                  identity
                    ? String.raw`A=I_2`
                    : String.raw`A=\begin{bmatrix}5&4\\4&5\end{bmatrix}`
                }
              />
              <MathText
                children={null}
                tex={
                  identity
                    ? '\\lambda_1(A)=1,\\;\\lambda_2(A)=1'
                    : '\\lambda_1(A)=9,\\;\\lambda_2(A)=1'
                }
              />
            </div>
          </div>
          <div className="geometry-field">
            <label htmlFor={`${id}-angle`}>
              <span className="font-semibold">
                Angle from the horizontal axis
              </span>
              <span className="font-mono tabular-nums" aria-hidden="true">
                {Number(angle.toFixed(1))}°
              </span>
            </label>
            <input
              id={`${id}-angle`}
              type="range"
              min={0}
              max={180}
              step={0.1}
              value={angle}
              aria-valuetext={`${Number(angle.toFixed(1))} degrees`}
              onChange={(event) => setAngle(Number(event.target.value))}
            />
          </div>
          <dl className="geometry-values !my-0">
            <div>
              <dt>
                <MathProse>{'$(y_1,y_2)$'}</MathProse>
              </dt>
              <dd>
                ({decimal(y1)}, {decimal(y2)})
              </dd>
            </div>
            <div>
              <dt>
                <MathProse>{String.raw`$x^{\top}A^{-1}x$`}</MathProse>
              </dt>
              <dd>{decimal(squaredDistance)}</dd>
            </div>
            <div>
              <dt>
                <MathProse>{'$d_A(x,0)$'}</MathProse>
              </dt>
              <dd>{decimal(distance)}</dd>
            </div>
          </dl>
          <p className="geometry-result font-semibold" role="status">
            {location}
          </p>
        </div>

        <figure className="mx-auto w-full min-w-0 max-w-[25rem]">
          <div
            className="relative aspect-square overflow-hidden rounded-xl border bg-background"
            role="img"
            aria-label={`${identity ? 'Unit circle' : 'Ellipsoid with a rising major axis'}. A point at ${Number(angle.toFixed(1))} degrees is ${location.toLowerCase()}.`}
          >
            <div className="absolute top-1/2 left-[5%] h-px w-[90%] bg-border" />
            <div className="absolute top-[5%] left-1/2 h-[90%] w-px bg-border" />
            <span className="absolute top-1/2 right-[4%] translate-y-1 text-xs text-muted-foreground">
              <MathProse>{'$x_1$'}</MathProse>
            </span>
            <span className="absolute top-[4%] left-1/2 translate-x-2 text-xs text-muted-foreground">
              <MathProse>{'$x_2$'}</MathProse>
            </span>
            <div
              className="absolute top-1/2 left-1/2 rounded-[50%] border-2 border-[var(--source-fg)] bg-primary/5"
              style={{
                width: `${majorDiameter}%`,
                height: `${minorDiameter}%`,
                transform: `translate(-50%, -50%) rotate(${identity ? 0 : -45}deg)`,
              }}
            />
            {!identity && (
              <>
                <div
                  className="absolute top-1/2 left-1/2 border-t border-dashed border-muted-foreground"
                  style={{
                    width: `${majorDiameter}%`,
                    transform: 'translate(-50%, -50%) rotate(-45deg)',
                  }}
                />
                <div
                  className="absolute top-1/2 left-1/2 border-t border-dashed border-muted-foreground"
                  style={{
                    width: `${minorDiameter}%`,
                    transform: 'translate(-50%, -50%) rotate(45deg)',
                  }}
                />
              </>
            )}
            <div
              className="absolute top-1/2 left-1/2 h-0.5 origin-left bg-[var(--target-fg)]"
              style={{
                width: `${pointOffset}%`,
                transform: `translateY(-50%) rotate(${-angle}deg)`,
              }}
            />
            <div
              className="absolute size-3 -translate-1/2 rounded-full border-2 border-background bg-[var(--target-fg)]"
              style={{
                left: `${50 + x1 * unitsToPercent}%`,
                top: `${50 - x2 * unitsToPercent}%`,
              }}
            />
          </div>
          <figcaption>
            <ul className="geometry-legend">
              <li>
                <i className="is-source" aria-hidden="true" />
                <MathProse>{'Boundary $d_A(x,0)=1$'}</MathProse>
              </li>
              <li>
                <i className="is-target" aria-hidden="true" />
                <MathProse>{'Point $x$'}</MathProse>
              </li>
              {!identity && (
                <li>
                  <i className="is-dashed" aria-hidden="true" />
                  Principal axes
                </li>
              )}
            </ul>
            {identity && (
              <p className="mt-2 text-sm text-muted-foreground">
                <MathProse>
                  {'For $I_2$, the coordinate axes serve as principal axes.'}
                </MathProse>
              </p>
            )}
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
