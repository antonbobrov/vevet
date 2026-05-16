import { Raf } from '@/components/Raf';
import { Timeline } from '@/components/Timeline';
import { isFiniteNumber } from '@/internal/isFiniteNumber';
import { clamp, lerp } from '@/utils';

import { ISwipeState } from '../global';
import { LERP_APPROX, LERP_THRESHOLD } from '../props';

import type { ISwipeBounds, Swipe } from '..';

const IDLE_STATE = { x: 0, y: 0, angle: 0, time: 0 };

export class SwipeInertia {
  constructor(private _ctx: Swipe) {}

  /** Inertia exponential RAF */
  private _expRaf?: Raf;

  /** Timeline inertia */
  private _tm?: Timeline;

  /** Velocity */
  private _velocity: ISwipeState = { ...IDLE_STATE };

  /** Accumulated coordinates */
  private _accum: ISwipeState = { ...IDLE_STATE };

  /** Inertia bounds */
  private _bounds?: ISwipeBounds | null;

  /** Update callback */
  private _onUpdate?: (state: ISwipeState) => void;

  /** Check if inertia is active */
  get has() {
    return !!this._expRaf || !!this._tm;
  }

  /** Apply inertia-based movement (per-frame decay, same idea as t.ts glide) */
  public release(onStart: () => void, onUpdate: (state: ISwipeState) => void) {
    const { props, callbacks, step, current } = this._ctx;
    const { inertiaRatio, maxVelocity } = props;

    const gap = performance.now() - current.time;
    const dt = Math.max(step.time, gap, 1);

    if (!isFiniteNumber(dt) || dt <= 0) {
      callbacks.emit('inertiaFail', undefined);

      return false;
    }

    const ratio = isFiniteNumber(inertiaRatio) ? inertiaRatio : 1;

    const maxVX = maxVelocity.x ? Math.abs(maxVelocity.x) : 0;
    let vx = (step.x / dt) * ratio;
    vx = clamp(vx, -maxVX, maxVX);

    const maxVY = maxVelocity.y ? Math.abs(maxVelocity.y) : 0;
    let vy = (step.y / dt) * ratio;
    vy = clamp(vy, -maxVY, maxVY);

    const maxVA = maxVelocity.angle ? Math.abs(maxVelocity.angle) : 0;
    let va = (step.angle / dt) * ratio;
    va = clamp(va, -maxVA, maxVA);

    const linearSpeed = Math.hypot(vx, vy) * 1000;
    const angularSpeed = Math.abs(va) * 1000;
    const threshold = props.inertiaThreshold ?? props.inertiaDistanceThreshold;
    const isTimeline = props.inertiaType === 'timeline';

    if (isTimeline) {
      if (!isFiniteNumber(linearSpeed) || linearSpeed < threshold) {
        callbacks.emit('inertiaFail', undefined);

        return false;
      }
    } else if (
      !isFiniteNumber(linearSpeed) ||
      !isFiniteNumber(angularSpeed) ||
      (linearSpeed < threshold && angularSpeed < threshold)
    ) {
      callbacks.emit('inertiaFail', undefined);

      return false;
    }

    this._onUpdate = onUpdate;
    onStart();

    this._bounds = props.bakeBounds && props.bakeBounds();

    if (isTimeline) {
      return this._startTm(vx, vy, va);
    }

    return this._startExpRaf(vx, vy, va);
  }

  /**
   * Timeline inertia.
   * `vx`/`vy`/`va` are in coordinate-units/ms; amplitudes match old px/s and deg/s targets.
   */
  private _startTm(vx: number, vy: number, va: number) {
    const { props, callbacks } = this._ctx;
    const bounds = this._bounds;

    const rawAmp = { x: vx * 1000, y: vy * 1000, angle: va * 1000 };

    let modifiedAmp = { ...rawAmp };

    if (props.velocityModifier) {
      modifiedAmp = props.velocityModifier(rawAmp);
    } else {
      if (bounds?.x) {
        modifiedAmp.x = clamp(modifiedAmp.x, ...bounds.x);
      }

      if (bounds?.y) {
        modifiedAmp.y = clamp(modifiedAmp.y, ...bounds.y);
      }

      if (bounds?.angle) {
        modifiedAmp.angle = clamp(modifiedAmp.angle, ...bounds.angle);
      }
    }

    const distance = Math.hypot(modifiedAmp.x, modifiedAmp.y);
    const duration = props.inertiaDuration(distance);

    if (!isFiniteNumber(duration) || duration <= 0) {
      callbacks.emit('inertiaFail', undefined);

      return false;
    }

    this._accum = { ...IDLE_STATE };
    this._velocity = { x: vx, y: vy, angle: va, time: performance.now() };
    const velocity = this._velocity;

    this._tm = new Timeline({ duration, easing: props.inertiaEasing });

    this._tm.on('start', () => callbacks.emit('inertiaStart', undefined));

    this._tm.on('update', ({ eased }) => {
      this._accum.x = modifiedAmp.x * eased;
      this._accum.y = modifiedAmp.y * eased;
      this._accum.angle = modifiedAmp.angle * eased;
      this._accum.time = performance.now();

      velocity.x = lerp(velocity.x, 0, eased);
      velocity.y = lerp(velocity.y, 0, eased);
      velocity.angle = lerp(velocity.angle, 0, eased);

      callbacks.emit('inertia', undefined);
      this._onUpdate?.({ ...this._accum });
    });

    this._tm.on('end', () => {
      callbacks.emit('inertiaEnd', undefined);
      this._clear();
    });

    setTimeout(() => this._tm?.play(), 0);

    return true;
  }

  /** Start exponential RAF animation */
  private _startExpRaf(vx: number, vy: number, va: number) {
    this._accum = { ...IDLE_STATE };
    this._velocity = { x: vx, y: vy, angle: va, time: performance.now() };

    this._expRaf = new Raf({
      enabled: true,
      onFrame: () => this._handleExpRaf(),
    });

    this._ctx.callbacks.emit('inertiaStart', undefined);

    return true;
  }

  /** Handle exponential RAF update */
  private _handleExpRaf() {
    if (!this._expRaf) {
      return;
    }

    const { _expRaf: raf, _bounds: bounds } = this;
    const { props, callbacks } = this._ctx;
    const duration = this._expRaf.duration;

    const velocity = this._velocity;
    const accum = this._accum;
    const frameMs = duration;

    // Detla
    const dx = velocity.x * frameMs;
    const dy = velocity.y * frameMs;
    const dAngle = velocity.angle * frameMs;

    // Friction
    const frictionEase = raf.lerpFactor(Math.abs(props.inertiaDecay));
    velocity.x = lerp(velocity.x, 0, frictionEase);
    velocity.y = lerp(velocity.y, 0, frictionEase);
    velocity.angle = lerp(velocity.angle, 0, frictionEase);

    // Accum
    accum.x += dx;
    accum.y += dy;
    accum.angle += dAngle;
    accum.time = performance.now();

    // Bounce
    let isBouncing = false;
    const rawBounceEase = props.inertiaBounceEase;
    const bounceEase = rawBounceEase >= 1 ? 1 : raf.lerpFactor(rawBounceEase);

    // Bounce within bounds
    if (bounds?.x) {
      const bx = this._applyExpAxisBounce(
        accum.x,
        velocity.x,
        bounds.x,
        bounceEase,
      );

      accum.x = bx.value;
      velocity.x = bx.velocity;

      isBouncing = 'bounceFinished' in bx ? true : isBouncing;
    }

    if (bounds?.y) {
      const by = this._applyExpAxisBounce(
        accum.y,
        velocity.y,
        bounds.y,
        bounceEase,
      );

      accum.y = by.value;
      velocity.y = by.velocity;

      isBouncing = 'bounceFinished' in by ? true : isBouncing;
    }

    if (bounds?.angle) {
      const ba = this._applyExpAxisBounce(
        accum.angle,
        velocity.angle,
        bounds.angle,
        bounceEase,
      );

      accum.angle = ba.value;
      velocity.angle = ba.velocity;

      isBouncing = 'bounceFinished' in ba ? true : isBouncing;
    }

    // Callbacks
    callbacks.emit('inertia', undefined);
    this._onUpdate?.({ ...accum });

    // Stop
    if (!isBouncing) {
      const linearStep = Math.hypot(dx, dy);
      const angularStep = Math.abs(dAngle);
      const isBelow =
        linearStep < LERP_THRESHOLD && angularStep < LERP_THRESHOLD;

      if (isBelow) {
        callbacks.emit('inertiaEnd', undefined);
        this._clear();
      }
    }
  }

  /** Apply exponential axis bounce overflow */
  private _applyExpAxisBounce(
    value: number,
    velocity: number,
    bounds: number[],
    ease: number,
  ) {
    if (!bounds.length) {
      return { value, velocity };
    }

    const overflow = Math.abs(this._ctx.props.overflow());

    const lo = Math.min(...bounds);
    const hi = Math.max(...bounds);
    const loExt = lo - overflow;
    const hiExt = hi + overflow;

    if (value < loExt) {
      return { value: loExt, velocity: 0, bounceFinished: false };
    }

    if (value > hiExt) {
      return { value: hiExt, velocity: 0, bounceFinished: false };
    }

    if (value < lo || value > hi) {
      const target = clamp(value, lo, hi);

      const val = lerp(value, target, ease, LERP_APPROX);
      const vel = lerp(velocity, 0, ease, LERP_APPROX);

      return {
        value: val,
        velocity: vel,
        bounceFinished: val === target && vel === 0,
      };
    }

    return { value, velocity };
  }

  /** Clear data and stop animation */
  private _clear() {
    this._expRaf?.destroy();
    this._expRaf = undefined;

    this._tm?.destroy();
    this._tm = undefined;

    this._velocity = { ...IDLE_STATE };
    this._accum = { ...IDLE_STATE };
  }

  /** Stop inertia animation */
  public cancel() {
    if (this._expRaf || this._tm) {
      this._ctx.callbacks.emit('inertiaCancel', undefined);
    }

    this._clear();
  }

  /** Destroy instance */
  public destroy() {
    this._clear();
  }
}
