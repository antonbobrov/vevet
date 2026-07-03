import { Raf } from '@/components/Raf';
import { isFiniteNumber } from '@/internal/isFiniteNumber';
import { now } from '@/internal/now';
import { ModulePart } from '@/shared/ModulePart';
import { clamp, lerp } from '@/utils';

import { Swipe } from '..';
import { SwipeCoords } from '../Coords';
import { ISwipeState, ISwipeVec3 } from '../global';

const IDLE_VEC3 = { x: 0, y: 0, angle: 0 };
const IDLE_STATE = { ...IDLE_VEC3, time: 0 };

const LERP_APPROX = 0.01;
const BELOW_THRESHOLD = 0.01;

/**
 * Release inertia via {@link Raf} after pointer up.
 *
 * Velocity is derived from the last `step` and decayed each frame.
 * When `inertiaDistanceModifier` is set, movement follows a predicted
 * distance curve instead of integrating velocity directly.
 *
 * @internal
 */
export class SwipeInertia extends ModulePart<Swipe> {
  constructor(
    parent: Swipe,
    private coords: SwipeCoords,
    /** Syncs {@link SwipeCoords} angle state when inertia starts. */
    private _onStart: () => void,
  ) {
    super(parent);
  }

  private _raf?: Raf;

  private _velocity: ISwipeState = { ...IDLE_STATE };

  private _initialVelocity: ISwipeState = { ...IDLE_STATE };

  private _distance?: ISwipeVec3 | null;

  private _saveMovement: ISwipeVec3 = { ...IDLE_VEC3 };

  private _movement: ISwipeVec3 = { ...IDLE_VEC3 };

  private _saveStep: ISwipeState = { ...IDLE_STATE };

  private _saveCurrent: ISwipeState = { ...IDLE_STATE };

  private _onUpdate?: (state: ISwipeVec3) => void;

  /** Whether release inertia animation is running. */
  get has() {
    return !!this._raf;
  }

  /**
   * Starts release inertia from the last pointer velocity.
   *
   * @returns `false` when momentum is below threshold (`inertiaFail`).
   */
  public release(onUpdate: (state: ISwipeVec3) => void) {
    const { coords, props } = this;

    this._distance = undefined;

    this._saveCurrent = { ...coords.current };
    this._saveStep = { ...coords.step };
    this._saveMovement = { ...coords.rawMovement };
    this._movement = { ...coords.rawMovement };

    const data = this._getVelocityData();

    if (!data) {
      this.callbacks.emit('inertiaFail', undefined);

      return false;
    }

    this._velocity = {
      x: data.vx,
      y: data.vy,
      angle: data.va,
      time: now(),
    };

    this._initialVelocity = { ...this._velocity };

    if (props.inertiaDistanceModifier) {
      this._distance = props.inertiaDistanceModifier({
        x: this._predictDistance(data.vx, props.inertiaDecay),
        y: this._predictDistance(data.vy, props.inertiaDecay),
        angle: this._predictDistance(data.va, props.inertiaDecay),
      });
    }

    this._onUpdate = onUpdate;

    this._raf = new Raf({ enabled: true, onFrame: this._handleRaf.bind(this) });

    this._onStart();
    this.callbacks.emit('inertiaStart', undefined);

    return true;
  }

  /** Get velocity data if can start */
  private _getVelocityData() {
    const data = this._calcVelocity();

    if (!data || !isFiniteNumber(data.dt) || data.dt <= 0) {
      return null;
    }

    const { linearSpeed, angularSpeed, vx, vy, va, threshold } = data;

    if (
      !isFiniteNumber(linearSpeed) ||
      !isFiniteNumber(angularSpeed) ||
      (linearSpeed < threshold && angularSpeed < threshold)
    ) {
      return null;
    }

    if (
      Math.abs(vx) < BELOW_THRESHOLD &&
      Math.abs(vy) < BELOW_THRESHOLD &&
      Math.abs(va) < BELOW_THRESHOLD
    ) {
      return null;
    }

    return data;
  }

  /** Calculate velocity */
  private _calcVelocity() {
    const { _saveCurrent: current, _saveStep: step } = this;
    const { inertiaRatio, ratio, maxVelocity, ...props } = this.props;

    if (!current || !step) {
      return null;
    }

    const gap = now() - current.time;
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
    const threshold = Math.abs(props.inertiaThreshold);

    return { dt, vx, vy, va, linearSpeed, angularSpeed, threshold };
  }

  /** Predict inertia distance */
  private _predictDistance(
    velocity: number,
    decay: number,
    frameMs = 1000 / 60,
  ) {
    const k = (decay * 60) / 1000;
    const r = Math.exp(-k * frameMs);

    return (velocity * frameMs) / (1 - r);
  }

  /** Handle RAF update */
  private _handleRaf() {
    if (!this._raf) {
      return;
    }

    const { _raf: raf } = this;
    const duration = this._raf.duration;

    const { coords, props } = this;

    const {
      _velocity: velocity,
      _saveCurrent: startCurrent,
      _saveMovement: startMovement,
      _movement: movement,
      _distance: distance,
    } = this;

    const frameMs = duration;

    // Delta
    const dx = velocity.x * frameMs;
    const dy = velocity.y * frameMs;
    const dAngle = velocity.angle * frameMs;

    // Friction
    const decay = raf.lerpFactor(props.inertiaDecay);
    velocity.x = lerp(velocity.x, 0, decay);
    velocity.y = lerp(velocity.y, 0, decay);
    velocity.angle = lerp(velocity.angle, 0, decay);

    // Movement
    if (distance) {
      const xP = this._getVelocityProgress('x');
      const yP = this._getVelocityProgress('y');
      const aP = this._getVelocityProgress('angle');

      movement.x = startMovement.x + distance.x * xP;
      movement.y = startMovement.y + distance.y * yP;
      movement.angle = startMovement.angle + distance.angle * aP;
    } else {
      movement.x += dx;
      movement.y += dy;
      movement.angle += dAngle;
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
        movement.x,
        velocity.x,
        bounds.x,
        bounceEase,
      );

      movement.x = bx.value;
      velocity.x = bx.velocity;

      isBouncing =
        'bounceFinished' in bx && !bx.bounceFinished ? true : isBouncing;
    }

    if (bounds?.y) {
      const by = this._applyAxisBounce(
        'y',
        movement.y,
        velocity.y,
        bounds.y,
        bounceEase,
      );

      movement.y = by.value;
      velocity.y = by.velocity;

      isBouncing =
        'bounceFinished' in by && !by.bounceFinished ? true : isBouncing;
    }

    if (bounds?.angle) {
      const ba = this._applyAxisBounce(
        'angle',
        movement.angle,
        velocity.angle,
        bounds.angle,
        bounceEase,
      );

      movement.angle = ba.value;
      velocity.angle = ba.velocity;

      isBouncing =
        'bounceFinished' in ba && !ba.bounceFinished ? true : isBouncing;
    }

    // Callbacks

    const totalX = movement.x - startMovement.x;
    const totalY = movement.y - startMovement.y;
    const totalA = movement.angle - startMovement.angle;

    const x = startCurrent.x + totalX;
    const y = startCurrent.y + totalY;
    const angle = startCurrent.angle + totalA;

    this._onUpdate?.({ x, y, angle });

    // Stop

    const linearStep = Math.hypot(dx, dy);
    const angularStep = Math.abs(dAngle);

    const shouldStop =
      linearStep < BELOW_THRESHOLD && angularStep < BELOW_THRESHOLD;

    if (!isBouncing && shouldStop) {
      this.callbacks.emit('inertiaEnd', undefined);
      this._clear();
    }
  }

  /** Calculate velocity progress */
  private _getVelocityProgress(axis: 'x' | 'y' | 'angle') {
    const v = this._velocity[axis];
    const initial = this._initialVelocity[axis];

    if (Math.abs(initial) === 0) {
      return 1;
    }

    const p = 1 - Math.abs(v / initial);

    if (Math.abs(1 - p) < LERP_APPROX / 10) {
      return 1;
    }

    return p;
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

    const snappy = this.coords.snap[axis];

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

  /** Stops release inertia and emits `inertiaCancel`. */
  public cancel() {
    if (this._raf) {
      this.callbacks.emit('inertiaCancel', undefined);
    }

    this._clear();
  }

  /** Destroy instance */
  protected _destroy() {
    this._clear();

    super._destroy();
  }
}
