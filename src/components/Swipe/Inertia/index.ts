import { Raf } from '@/components/Raf';
import { isFiniteNumber } from '@/internal/isFiniteNumber';
import { clamp, lerp } from '@/utils';

import { Swipe } from '..';
import { SwipeCoords } from '../Coords';
import { ISwipeState, ISwipeVec3 } from '../global';

const IDLE_VEC3 = { x: 0, y: 0, angle: 0 };
const IDLE_STATE = { ...IDLE_VEC3, time: 0 };

const LERP_APPROX = 0.01;
const BELOW_THRESHOLD = 0.1;

interface IProps {
  props: () => typeof Swipe.prototype.props;
  coords: SwipeCoords;
  onStart: () => void;
  onFail: () => void;
  onCancel: () => void;
  onEnd: () => void;
}

export class SwipeInertia {
  constructor(private ctx: IProps) {}

  private _raf?: Raf;

  private _velocity: ISwipeState = { ...IDLE_STATE };

  private _initialVelocity: ISwipeState = { ...IDLE_STATE };

  private _modifiedDistance?: ISwipeVec3 | null;

  private _saveRawMovement: ISwipeVec3 = { ...IDLE_VEC3 };

  private _rawMovement: ISwipeVec3 = { ...IDLE_VEC3 };

  private _saveStep: ISwipeState = { ...IDLE_STATE };

  private _saveCurrent: ISwipeState = { ...IDLE_STATE };

  private _onUpdate?: (state: ISwipeVec3) => void;

  /** Check if inertia is active */
  get has() {
    return !!this._raf;
  }

  /** Apply inertia-based movement */
  public release(onUpdate: (state: ISwipeVec3) => void) {
    const { ctx } = this;
    const props = ctx.props();

    this._modifiedDistance = undefined;
    this._saveCurrent = { ...ctx.coords.current };
    this._saveStep = { ...ctx.coords.step };
    this._saveRawMovement = { ...ctx.coords.rawMovement };
    this._rawMovement = { ...ctx.coords.rawMovement };

    const data = this._calcVelocity();

    if (!data || !isFiniteNumber(data.dt) || data.dt <= 0) {
      ctx.onFail();

      return false;
    }

    const { linearSpeed, angularSpeed, vx, vy, va, threshold } = data;

    if (
      !isFiniteNumber(linearSpeed) ||
      !isFiniteNumber(angularSpeed) ||
      (linearSpeed < threshold && angularSpeed < threshold)
    ) {
      ctx.onFail();

      return false;
    }

    this._onUpdate = onUpdate;

    this._velocity = { x: vx, y: vy, angle: va, time: performance.now() };
    this._initialVelocity = { ...this._velocity };

    if (
      Math.abs(vx) < BELOW_THRESHOLD &&
      Math.abs(vy) < BELOW_THRESHOLD &&
      Math.abs(va) < BELOW_THRESHOLD
    ) {
      ctx.onFail();

      return false;
    }

    if (props.inertiaDistanceModifier) {
      this._modifiedDistance = props.inertiaDistanceModifier({
        x: this._predictDistance(vx, props.inertiaDecay),
        y: this._predictDistance(vy, props.inertiaDecay),
        angle: this._predictDistance(va, props.inertiaDecay),
      });
    }

    this._raf = new Raf({
      enabled: true,
      onFrame: this._handleRaf.bind(this),
    });

    this.ctx.onStart();

    return true;
  }

  /** Calculate velocity */
  private _calcVelocity() {
    const { _saveCurrent: current, _saveStep: step } = this;
    const { inertiaRatio, ratio, maxVelocity, ...props } = this.ctx.props();

    if (!current || !step) {
      return null;
    }

    const gap = performance.now() - current.time;
    const dt = Math.max(step.time, gap, 1);

    const iRatio = isFiniteNumber(inertiaRatio) ? inertiaRatio : 1;
    const sRatio = isFiniteNumber(ratio) ? ratio : 1;
    const finalRatio = sRatio * iRatio;

    const maxVX = maxVelocity.x ? Math.abs(maxVelocity.x) : 0;
    let vx = (step.x / dt) * finalRatio;
    vx = clamp(vx, -maxVX, maxVX);

    const maxVY = maxVelocity.y ? Math.abs(maxVelocity.y) : 0;
    let vy = (step.y / dt) * finalRatio;
    vy = clamp(vy, -maxVY, maxVY);

    const maxVA = maxVelocity.angle ? Math.abs(maxVelocity.angle) : 0;
    let va = (step.angle / dt) * finalRatio;
    va = clamp(va, -maxVA, maxVA);

    const linearSpeed = Math.hypot(vx, vy) * 1000;
    const angularSpeed = Math.abs(va) * 1000;
    const threshold = props.inertiaThreshold;

    return { dt, vx, vy, va, linearSpeed, angularSpeed, threshold };
  }

  /** Handle RAF update */
  private _handleRaf() {
    if (!this._raf) {
      return;
    }

    const { _raf: raf } = this;
    const duration = this._raf.duration;

    const { coords } = this.ctx;
    const props = this.ctx.props();

    const {
      _velocity: velocity,
      _saveCurrent: startCurrent,
      _saveRawMovement: startRawMovement,
      _rawMovement: rawMovement,
      _modifiedDistance: distance,
      _initialVelocity: initial,
    } = this;

    const frameMs = duration;

    // Delta
    const dx = velocity.x * frameMs;
    const dy = velocity.y * frameMs;
    const dAngle = velocity.angle * frameMs;

    // Friction
    const frictionEase = raf.lerpFactor(props.inertiaDecay);
    velocity.x = lerp(velocity.x, 0, frictionEase);
    velocity.y = lerp(velocity.y, 0, frictionEase);
    velocity.angle = lerp(velocity.angle, 0, frictionEase);

    // Movement
    if (distance) {
      const xP = this._getVelocityProgress(velocity.x, initial.x);
      const yP = this._getVelocityProgress(velocity.y, initial.y);
      const aP = this._getVelocityProgress(velocity.angle, initial.angle);

      rawMovement.x = startRawMovement.x + distance.x * xP;
      rawMovement.y = startRawMovement.y + distance.y * yP;
      rawMovement.angle = startRawMovement.angle + distance.angle * aP;
    } else {
      rawMovement.x += dx;
      rawMovement.y += dy;
      rawMovement.angle += dAngle;
    }

    // Bounce
    let isBouncing = false;
    const rawBounceEase = props.inertiaBounceEase;
    const bounceEase = rawBounceEase >= 1 ? 1 : raf.lerpFactor(rawBounceEase);

    // Bounce within bounds

    const { bounds } = coords;

    if (bounds?.x) {
      const bx = this._applyAxisBounce(
        'x',
        rawMovement.x,
        velocity.x,
        bounds.x,
        bounceEase,
      );

      rawMovement.x = bx.value;
      velocity.x = bx.velocity;

      isBouncing =
        'bounceFinished' in bx && !bx.bounceFinished ? true : isBouncing;
    }

    if (bounds?.y) {
      const by = this._applyAxisBounce(
        'y',
        rawMovement.y,
        velocity.y,
        bounds.y,
        bounceEase,
      );

      rawMovement.y = by.value;
      velocity.y = by.velocity;

      isBouncing =
        'bounceFinished' in by && !by.bounceFinished ? true : isBouncing;
    }

    if (bounds?.angle) {
      const ba = this._applyAxisBounce(
        'angle',
        rawMovement.angle,
        velocity.angle,
        bounds.angle,
        bounceEase,
      );

      rawMovement.angle = ba.value;
      velocity.angle = ba.velocity;

      isBouncing =
        'bounceFinished' in ba && !ba.bounceFinished ? true : isBouncing;
    }

    // Callbacks

    const totalX = rawMovement.x - startRawMovement.x;
    const totalY = rawMovement.y - startRawMovement.y;
    const totalA = rawMovement.angle - startRawMovement.angle;

    const x = startCurrent.x + totalX;
    const y = startCurrent.y + totalY;
    const angle = startCurrent.angle + totalA;

    this._onUpdate?.({ x, y, angle });

    // Stop

    const linearStep = Math.hypot(dx, dy);
    const angularStep = Math.abs(dAngle);

    let shouldStop =
      linearStep < BELOW_THRESHOLD && angularStep < BELOW_THRESHOLD;

    if (distance) {
      shouldStop =
        Math.abs(totalX - distance.x) < LERP_APPROX &&
        Math.abs(totalY - distance.y) < LERP_APPROX &&
        Math.abs(totalA - distance.angle) < LERP_APPROX;
    }

    if (!isBouncing && shouldStop) {
      this.ctx.onEnd();
      this._clear();
    }
  }

  /** Calculate velocity progress */
  private _getVelocityProgress(v: number, initial: number) {
    if (Math.abs(initial) < BELOW_THRESHOLD) {
      return 1;
    }

    const p = 1 - Math.abs(v / initial);

    if (Math.abs(1 - p) < LERP_APPROX / 10) {
      return 1;
    }

    return p;
  }

  private _predictDistance(
    velocity: number,
    decay: number,
    frameMs = 1000 / 60,
  ) {
    const k = (decay * 60) / 1000;
    const r = Math.exp(-k * frameMs);

    return (velocity * frameMs) / (1 - r);
  }

  /** Apply exponential axis bounce overflow */
  private _applyAxisBounce(
    axis: 'x' | 'y' | 'angle',
    value: number,
    velocity: number,
    bounds: number[],
    ease: number,
  ) {
    if (!bounds.length) {
      return { value, velocity };
    }

    const snappy = this.ctx.coords.snap[axis];

    const lo = typeof snappy === 'number' ? snappy : Math.min(...bounds);
    const hi = typeof snappy === 'number' ? snappy : Math.max(...bounds);

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
    this._raf?.destroy();
    this._raf = undefined;

    this._velocity = { ...IDLE_STATE };
  }

  /** Stop inertia animation */
  public cancel() {
    if (this._raf) {
      this.ctx.onCancel();
    }

    this._clear();
  }

  /** Destroy instance */
  public destroy() {
    this._clear();
  }
}
