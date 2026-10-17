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

  const omega = Math.sqrt(spring.stiffness);
  const zeta = spring.damping / (2 * Math.sqrt(spring.stiffness));
  const dt = Math.min(Math.max(duration, 0) / 1000, 1 / 30);

  const acceleration =
    omega * omega * (target - current) - 2 * zeta * omega * velocity;
  const nextVelocity = velocity + acceleration * dt;
  const nextValue = current + nextVelocity * dt;

  if (
    appx > 0 &&
    Math.abs(target - nextValue) <= appx &&
    Math.abs(nextVelocity) <= appx
  ) {
    return { value: target, velocity: 0 };
  }

  return { value: nextValue, velocity: nextVelocity };
}
