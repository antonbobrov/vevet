import { Raf } from '@/components/Raf';
import { isFiniteNumber, ModulePart, now } from '@/internal';
import { clamp } from '@/utils';

import { Swipe } from '..';
import { SwipeCoords } from '../Coords';
import { TSwipeAxis } from '../Coords/types';
import { ISwipeState, ISwipeVec3 } from '../global';
import {
  resolveInertiaEase,
  resolveInertiaMaxVelocity,
  resolveInertiaRubberEase,
  resolveModifyInertiaDistance,
} from '../resolveProps';

const IDLE_VEC3 = { x: 0, y: 0, angle: 0 };
const IDLE_STATE = { ...IDLE_VEC3, time: 0 };

const LERP_APPROX = 0.001;
const BELOW_THRESHOLD = 0.01;

/**
 * While freeflow |velocity| is above this (coord/ms), overscroll bounce waits
 * until movement passes bounds by {@link SwipeCoords.overscroll}.
 */
const COAST_VEL = 0.5;

function velKey(name: string) {
  return `vel-${name}`;
}

/**
 * Release inertia via {@link Raf} after pointer up.
 *
 * Velocity comes from the last `step` and decays each frame (`inertiaEase`).
 * Default mode integrates velocity into `rawMovement`. Distance mode runs when
 * `modifyInertiaDistance` returns a value or snap redirects the freeflow end
 * ({@link SwipeCoords.getSnapCoord} per axis).
 *
 * In distance mode, quiet axes (zero release velocity) borrow progress from the
 * slowest still-moving axis so they do not jump to `1` immediately.
 *
 * Overscroll past `bounds` springs back with `inertiaRubberEase`
 * (hard clamp when `overscroll <= 0`).
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

  private raf?: Raf;

  private bouncing = { x: false, y: false, angle: false };

  private onUpdate?: (state: ISwipeVec3) => void;

  private dist?: ISwipeVec3 | null;

  private saveMovement: ISwipeVec3 = { ...IDLE_VEC3 };

  private saveStep: ISwipeState = { ...IDLE_STATE };

  private saveCurrent: ISwipeState = { ...IDLE_STATE };

  private saveVelocity: ISwipeVec3 = { ...IDLE_VEC3 };

  /** Whether release inertia animation is running. */
  get has() {
    return !!this.raf;
  }

  /**
   * Starts release inertia from the last pointer velocity.
   *
   * @returns `false` when momentum is below threshold (`inertiaFail`).
   */
  public release(onUpdate: (state: ISwipeVec3) => void) {
    const { coords, props } = this;
    const { rawMovement, step, current } = coords;
    const inertiaEase = resolveInertiaEase(props);

    this.saveCurrent = { ...current };
    this.saveStep = { ...step };
    this.saveMovement = { ...rawMovement };

    const data = this._getVelocity();

    if (!data) {
      this.callbacks.emit('inertiaFail', undefined);

      return false;
    }

    const { vx, vy, va } = data;

    // resets
    this.onUpdate = onUpdate;
    this.dist = null;
    this.bouncing = { x: false, y: false, angle: false };
    this.saveVelocity = { x: vx, y: vy, angle: va };

    // predicted → optional modifier → snap via getSnapCoord (preferred when found)
    const predicted = {
      x: this._predictDistance(vx, inertiaEase),
      y: this._predictDistance(vy, inertiaEase),
      angle: this._predictDistance(va, inertiaEase),
    };

    const modifyDistance = resolveModifyInertiaDistance(props);
    const modified = modifyDistance ? modifyDistance(predicted) : null;
    const { dist, hasSnap } = this._preferSnapDistance(modified ?? predicted);

    this.dist = modified || hasSnap ? dist : null;

    // init raf

    this.raf = new Raf({ enabled: true, onFrame: this._handleRaf.bind(this) });

    const ease = () => resolveInertiaEase(this.props);
    this.raf.add(velKey('x'), { value: vx, ease, target: 0 });
    this.raf.add(velKey('y'), { value: vy, ease, target: 0 });
    this.raf.add(velKey('angle'), { value: va, ease, target: 0 });

    const moveEase = () => resolveInertiaRubberEase(this.props);
    this.raf.add('x', { value: rawMovement.x, ease: moveEase });
    this.raf.add('y', { value: rawMovement.y, ease: moveEase });
    this.raf.add('angle', { value: rawMovement.angle, ease: moveEase });

    this._onStart();
    this.callbacks.emit('inertiaStart', undefined);

    return true;
  }

  /** Returns clamped release velocity, or `null` when below threshold. */
  private _getVelocity() {
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

  /** Derives per-axis velocity from the last `step` and release gap. */
  private _calcVelocity() {
    const { saveCurrent, saveStep, props } = this;
    const { inertiaRatio, inertiaThreshold } = props;
    const maxVelocity = resolveInertiaMaxVelocity(props);

    if (!saveCurrent || !saveStep) {
      return null;
    }

    const gap = now() - saveCurrent.time;
    const dt = Math.max(saveStep.time, gap, 1);

    const iRatio = isFiniteNumber(inertiaRatio) ? inertiaRatio : 1;
    const sRatio = isFiniteNumber(props.ratio) ? props.ratio : 1;
    const finalRatio = sRatio * iRatio;

    const maxVX = maxVelocity.x ? Math.abs(maxVelocity.x) : 0;
    let vx = (saveStep.x / dt) * finalRatio;
    vx = clamp(vx, -maxVX, maxVX);

    const maxVY = maxVelocity.y ? Math.abs(maxVelocity.y) : 0;
    let vy = (saveStep.y / dt) * finalRatio;
    vy = clamp(vy, -maxVY, maxVY);

    const maxVA = maxVelocity.angle ? Math.abs(maxVelocity.angle) : 0;
    let va = (saveStep.angle / dt) * finalRatio;
    va = clamp(va, -maxVA, maxVA);

    const linearSpeed = Math.hypot(vx, vy) * 1000;
    const angularSpeed = Math.abs(va) * 1000;
    const threshold = Math.abs(inertiaThreshold);

    return { dt, vx, vy, va, linearSpeed, angularSpeed, threshold };
  }

  /** Predicted freeflow travel for exponential velocity decay. */
  private _predictDistance(
    velocity: number,
    decay: number,
    frameMs = 1000 / 60,
  ) {
    const k = (decay * 60) / 1000;
    const r = Math.exp(-k * frameMs);

    return (velocity * frameMs) / (1 - r);
  }

  /**
   * Per axis: if snap targets exist, redirect distance so freeflow ends on
   * the nearest target ({@link SwipeCoords.getSnapCoord}).
   */
  private _preferSnapDistance(dist: ISwipeVec3) {
    const { saveMovement, coords } = this;
    const next = { ...dist };
    const axes: TSwipeAxis[] = ['x', 'y', 'angle'];
    let hasSnap = false;

    axes.forEach((axis) => {
      const end = saveMovement[axis] + dist[axis];
      const snap = coords.getSnapCoord(axis, end);

      if (snap === undefined) {
        return;
      }

      next[axis] = snap - saveMovement[axis];
      hasSnap = true;
    });

    return { dist: next, hasSnap };
  }

  /** Integrates freeflow / distance mode and arms overscroll bounce. */
  private _handleRaf() {
    if (!this.raf) {
      return;
    }

    const { coords, saveCurrent, saveMovement, raf, dist, bouncing } = this;

    // Delta
    const dx = raf.value(velKey('x')) * raf.duration;
    const dy = raf.value(velKey('y')) * raf.duration;
    const dAngle = raf.value(velKey('angle')) * raf.duration;

    // Movement
    if (dist) {
      const xP = this._progressForAxis('x', ['y', 'angle']);
      const yP = this._progressForAxis('y', ['x', 'angle']);
      const aP = this._progressForAxis('angle', ['x', 'y']);

      if (!bouncing.x) {
        raf.target('x', saveMovement.x + dist.x * xP, true);
      }
      if (!bouncing.y) {
        raf.target('y', saveMovement.y + dist.y * yP, true);
      }
      if (!bouncing.angle) {
        raf.target('angle', saveMovement.angle + dist.angle * aP, true);
      }
    } else {
      if (!bouncing.x) {
        raf.target('x', raf.value('x') + dx, true);
      }
      if (!bouncing.y) {
        raf.target('y', raf.value('y') + dy, true);
      }
      if (!bouncing.angle) {
        raf.target('angle', raf.value('angle') + dAngle, true);
      }
    }

    // Bounce within bounds

    const { bounds } = coords;

    if (bounds?.x) {
      this._applyAxisBounce('x', raf.value('x'), bounds.x);
    }

    if (bounds?.y) {
      this._applyAxisBounce('y', raf.value('y'), bounds.y);
    }

    if (bounds?.angle) {
      this._applyAxisBounce('angle', raf.value('angle'), bounds.angle);
    }

    // Callbacks

    const totalX = raf.value('x') - saveMovement.x;
    const totalY = raf.value('y') - saveMovement.y;
    const totalA = raf.value('angle') - saveMovement.angle;

    const x = saveCurrent.x + totalX;
    const y = saveCurrent.y + totalY;
    const angle = saveCurrent.angle + totalA;

    this.onUpdate?.({ x, y, angle });

    // Freeflow settled (velocity near 0) and named entries reached targets
    const linearStep = Math.hypot(dx, dy);
    const angularStep = Math.abs(dAngle);
    const freeflowSettled =
      linearStep < BELOW_THRESHOLD && angularStep < BELOW_THRESHOLD;

    if (raf.interpolated() && freeflowSettled) {
      this.callbacks.emit('inertiaEnd', undefined);
      this._clear();
    }
  }

  /**
   * Decay progress for `axis`. Quiet axes follow the slowest still-moving
   * fallback (min progress) so a dead tiny-velocity axis cannot jump them to `1`.
   */
  private _progressForAxis(axis: TSwipeAxis, fallbacks: TSwipeAxis[]) {
    const { saveVelocity } = this;

    if (saveVelocity[axis] !== 0) {
      return this._getVelocityProgress(axis);
    }

    let borrowed: number | undefined;

    for (const other of fallbacks) {
      if (saveVelocity[other] === 0) {
        continue;
      }

      const p = this._getVelocityProgress(other);

      if (borrowed === undefined || p < borrowed) {
        borrowed = p;
      }
    }

    return borrowed ?? 1;
  }

  /** Decay progress `0 → 1` from initial velocity toward rest. */
  private _getVelocityProgress(axis: TSwipeAxis) {
    const { raf, saveVelocity } = this;

    if (!raf) {
      return 1;
    }

    const initial = saveVelocity[axis];

    if (Math.abs(initial) === 0) {
      return 1;
    }

    const p = 1 - Math.abs(raf.value(velKey(axis)) / initial);

    if (Math.abs(1 - p) < LERP_APPROX / 10) {
      return 1;
    }

    return p;
  }

  /**
   * Arms overscroll bounce toward the nearest bound edge.
   * Fast freeflow may pass bounds by `overscroll` before bounce starts.
   * With `overscroll <= 0`, clamps hard (no stretch / spring).
   */
  private _applyAxisBounce(
    axis: 'x' | 'y' | 'angle',
    value: number,
    bounds: number[],
  ) {
    const { raf, bouncing, coords } = this;

    if (!raf || bouncing[axis] || !bounds.length) {
      return;
    }

    const lo = Math.min(...bounds);
    const hi = Math.max(...bounds);

    const overscroll = coords.overscroll;
    const vel = raf.value(velKey(axis));
    const offset =
      overscroll <= 0 || Math.abs(vel) < COAST_VEL ? 0 : overscroll;

    if (value < lo - offset || value > hi + offset) {
      bouncing[axis] = true;
      // hard clamp when overscroll is disabled — no rubber stretch
      raf.target(axis, clamp(value, lo, hi), overscroll <= 0);
      raf.target(velKey(axis), 0, true);
    }
  }

  /** Destroys the RAF loop without emitting cancel. */
  private _clear() {
    this.raf?.destroy();
    this.raf = undefined;
  }

  /** Stops release inertia and emits `inertiaCancel`. */
  public cancel() {
    if (this.raf) {
      this.callbacks.emit('inertiaCancel', undefined);
    }

    this._clear();
  }

  protected _destroy() {
    this._clear();

    super._destroy();
  }
}
