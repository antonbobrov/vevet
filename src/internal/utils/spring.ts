import { isFiniteNumber } from './isFiniteNumber';

/** Minimal spring config (unit mass). */
type TInternalSpringConfig = {
  stiffness: number;
  damping: number;
};

export type TResolvedSpring = TInternalSpringConfig & {
  /** Natural frequency ω₀ = √k */
  omega: number;
  /** Damping ratio ζ = c / (2√k) */
  zeta: number;
};

const FALLBACK: TInternalSpringConfig = {
  stiffness: 100,
  damping: 10,
};

function clampPositive(value: number, fallback: number) {
  if (!isFiniteNumber(value) || value <= 0) {
    return fallback;
  }

  return value;
}

/**
 * Resolves stiffness/damping to ω₀ / ζ (mass = 1).
 */
export function resolveSpring(
  config: Partial<TInternalSpringConfig> = {},
  fallback: TInternalSpringConfig = FALLBACK,
): TResolvedSpring {
  const stiffness = clampPositive(config.stiffness ?? 0, fallback.stiffness);
  const damping = clampPositive(config.damping ?? 0, fallback.damping);

  return {
    stiffness,
    damping,
    omega: Math.sqrt(stiffness),
    zeta: damping / (2 * Math.sqrt(stiffness)),
  };
}

/**
 * Analytic step response `0 → 1` at time `t` (seconds), rest initial conditions.
 */
export function sampleSpring(time: number, spring: TResolvedSpring): number {
  const { omega: w0, zeta } = spring;

  if (zeta < 1) {
    const wd = w0 * Math.sqrt(1 - zeta * zeta);
    const b = (zeta * w0) / wd;
    const envelope = Math.exp(-time * zeta * w0);

    return 1 - envelope * (Math.cos(wd * time) + b * Math.sin(wd * time));
  }

  // critically damped (also used for ζ > 1)
  return 1 - (1 + w0 * time) * Math.exp(-time * w0);
}

type TSpringStepProps = {
  current: number;
  target: number;
  velocity: number;
  dt: number;
  spring: TResolvedSpring | Partial<TInternalSpringConfig>;
};

/**
 * One semi-implicit Euler step of ẍ = ω²(target − x) − 2ζωẋ (mass = 1).
 */
export function springStep({
  current,
  target,
  velocity,
  dt,
  spring,
}: TSpringStepProps) {
  const { omega, zeta } =
    'omega' in spring && 'zeta' in spring
      ? (spring as TResolvedSpring)
      : resolveSpring(spring);

  const acceleration =
    omega * omega * (target - current) - 2 * zeta * omega * velocity;
  const nextVelocity = velocity + acceleration * dt;
  const nextValue = current + nextVelocity * dt;

  return { value: nextValue, velocity: nextVelocity };
}
