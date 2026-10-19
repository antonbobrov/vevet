import { resolveSpring, springStep } from '@/internal';
import { TSpring } from '@/utils';

export type TRafSpringProps = {
  current: number;
  target: number;
  velocity: number;
  duration: number;
  appx?: number;
  spring: TSpring;
};

export function rafSpring({
  current,
  target,
  velocity,
  spring,
  duration,
  appx = 0,
}: TRafSpringProps) {
  if (
    appx > 0 &&
    Math.abs(target - current) <= appx &&
    Math.abs(velocity) <= appx
  ) {
    return { value: target, velocity: 0 };
  }

  const resolved = resolveSpring(spring);
  const dt = Math.min(Math.max(duration, 0) / 1000, 1 / 30);

  const next = springStep({ current, target, velocity, dt, spring: resolved });

  if (
    appx > 0 &&
    Math.abs(target - next.value) <= appx &&
    Math.abs(next.velocity) <= appx
  ) {
    return { value: target, velocity: 0 };
  }

  return next;
}
