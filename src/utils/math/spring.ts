import { isFiniteNumber } from '@/internal';

export type TSpring = {
  /** Spring stiffness. Higher values move faster and snap harder. */
  stiffness: number;

  /** Damping coefficient. Higher values reduce bounce. */
  damping: number;
};

const FALLBACK: TSpring = {
  stiffness: 100,
  damping: 10,
};

const APPROXIMATION = 0.001;
const SETTLE_STEP = 1 / 6;
const SETTLE_REST_STEPS = 16;
const SETTLE_LOOP_LIMIT = 1000;

const settleDurationCache = new Map<string, number>();

function clampPositive(value: number, fallback: number) {
  if (!isFiniteNumber(value) || value <= 0) {
    return fallback;
  }

  return value;
}

type TResolvedSpringConfig = TSpring & {
  omega: number;
  zeta: number;
};

function resolveSpringConfig(config: TSpring): TResolvedSpringConfig {
  const stiffness = clampPositive(config.stiffness, FALLBACK.stiffness);
  const damping = clampPositive(config.damping, FALLBACK.damping);

  return {
    stiffness,
    damping,
    omega: Math.sqrt(stiffness),
    zeta: damping / (2 * Math.sqrt(stiffness)),
  };
}

function cacheKey(config: TResolvedSpringConfig) {
  return [config.stiffness, config.damping].join(':');
}

function sampleSpring(time: number, config: TResolvedSpringConfig) {
  const { omega: w0, zeta } = config;

  if (zeta < 1) {
    const wd = w0 * Math.sqrt(1 - zeta * zeta);
    const b = (zeta * w0) / wd;
    const envelope = Math.exp(-time * zeta * w0);

    return 1 - envelope * (Math.cos(wd * time) + b * Math.sin(wd * time));
  }

  return 1 - (1 + w0 * time) * Math.exp(-time * w0);
}

function getSettleDuration(config: TResolvedSpringConfig) {
  const key = cacheKey(config);
  const cached = settleDurationCache.get(key);

  if (cached !== undefined) {
    return cached;
  }

  let time = 0;
  let steps = 0;

  while (steps < SETTLE_LOOP_LIMIT) {
    steps += 1;

    if (Math.abs(1 - sampleSpring(time, config)) < APPROXIMATION) {
      const restStart = time;
      let restSteps = 1;

      while (steps < SETTLE_LOOP_LIMIT) {
        steps += 1;
        time += SETTLE_STEP;

        if (Math.abs(1 - sampleSpring(time, config)) >= APPROXIMATION) {
          break;
        }

        restSteps += 1;

        if (restSteps === SETTLE_REST_STEPS) {
          const duration = restStart * 1000;
          settleDurationCache.set(key, duration);

          return duration;
        }
      }

      continue;
    }

    time += SETTLE_STEP;
  }

  const duration = time * 1000;
  settleDurationCache.set(key, duration);

  return duration;
}

/**
 * Applies spring physics to linear progress (`0 → 1`).
 *
 * Time is normalized to the spring’s settle duration so `progress = 1` lands on rest.
 * Mid-curve values may overshoot outside `0…1`.
 *
 * @group Utils
 *
 * @example
 * spring(0.5, { stiffness: 100, damping: 10 });
 */
export function spring(progress: number, config: TSpring): number {
  if (progress <= 0) {
    return 0;
  }

  if (progress >= 1) {
    return 1;
  }

  const resolved = resolveSpringConfig(config);
  const duration = getSettleDuration(resolved);
  const time = (duration * progress) / 1000;

  return sampleSpring(time, resolved);
}

/** Type guard for {@link TSpring}. */
export function isSpring(source: unknown): source is TSpring {
  if (typeof source !== 'object' || source === null) {
    return false;
  }

  const { stiffness, damping } = source as TSpring;

  return isFiniteNumber(stiffness) && isFiniteNumber(damping);
}
