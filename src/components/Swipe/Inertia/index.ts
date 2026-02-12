import { Timeline } from '@/components/Timeline';
import { isFiniteNumber } from '@/internal/isFiniteNumber';

import { ISwipeMatrix, ISwipeVelocity } from '../global';

import type { Swipe } from '..';

const VELOCITIES_COUNT = 4;

export class SwipeInertia {
  constructor(private _ctx: Swipe) {}

  /** Inertia animation */
  private _timeline?: Timeline;

  /** Velocity tracking */
  private _velocities: ISwipeVelocity[] = [];

  /**
   * Add new velocity sample
   */
  public addVelocity(velocity: ISwipeVelocity) {
    if (this.has) {
      return;
    }

    this._velocities.push(velocity);

    if (this._velocities.length > VELOCITIES_COUNT) {
      this._velocities.shift();
    }
  }

  /** Update last timestamp */
  public updateLastTimestamp() {
    const velocities = this._velocities;
    const { length } = velocities;

    if (length > 0) {
      velocities[length - 1].timestamp = performance.now();
    }
  }

  /** Returns current velocity */
  public get velocity(): ISwipeMatrix {
    const samples = this._velocities;

    if (samples.length < 2) {
      return { x: 0, y: 0, angle: 0 };
    }

    let totalWeight = 0;
    let wvx = 0;
    let wvy = 0;
    let wva = 0;

    for (let i = 1; i < samples.length; i += 1) {
      const current = samples[i];
      const previous = samples[i - 1];

      const deltaX = current.x - previous.x;
      const deltaY = current.y - previous.y;

      let angleDiff = current.angle - previous.angle;
      if (angleDiff > 180) angleDiff -= 360;
      if (angleDiff < -180) angleDiff += 360;

      const deltatTime = Math.max(current.timestamp - previous.timestamp, 1);

      const sx = (deltaX / deltatTime) * 1000;
      const sy = (deltaY / deltatTime) * 1000;
      const sa = (angleDiff / deltatTime) * 1000;

      const weight = 1 / Math.exp(-deltatTime * 0.1);
      wvx += sx * weight;
      wvy += sy * weight;
      wva += sa * weight;
      totalWeight += weight;
    }

    if (totalWeight > 0) {
      return {
        x: wvx / totalWeight,
        y: wvy / totalWeight,
        angle: wva / totalWeight,
      };
    }

    return { x: 0, y: 0, angle: 0 };
  }

  /** Check if inertia is active */
  get has() {
    return !!this._timeline;
  }

  /** Apply inertia-based movement */
  public release(onUpdate: (matrix: ISwipeMatrix) => void) {
    const swipe = this._ctx;
    const { props, callbacks } = swipe;
    const { inertiaRatio: ratio, velocityModifier } = props;

    const rawVelocity = this.velocity;

    const sourceVelocity = {
      x: rawVelocity.x * ratio,
      y: rawVelocity.y * ratio,
      angle: rawVelocity.angle * ratio,
    };

    const finalVelocity = velocityModifier
      ? velocityModifier(sourceVelocity)
      : sourceVelocity;

    const { x: velocityX, y: velocityY, angle: velocityA } = finalVelocity;
    const distance = Math.sqrt(velocityX ** 2 + velocityY ** 2);

    // Check if we have sufficient velocity
    if (distance < props.inertiaDistanceThreshold) {
      callbacks.emit('inertiaFail', undefined);

      return;
    }

    // Calculate animation duration
    const duration = props.inertiaDuration(distance);

    // Check if the animation duration is positive
    if (!isFiniteNumber(duration) || duration <= 0) {
      callbacks.emit('inertiaFail', undefined);

      return;
    }

    // Calculate the start and add matrices
    const addMatrix = { x: 0, y: 0, angle: 0 };

    // Start the inertia animation
    this._timeline = new Timeline({ duration, easing: props.inertiaEasing });

    this._timeline.on('start', () => callbacks.emit('inertiaStart', undefined));

    this._timeline.on('update', ({ eased }) => {
      addMatrix.x = velocityX * eased;
      addMatrix.y = velocityY * eased;
      addMatrix.angle = velocityA * eased;

      onUpdate(addMatrix);

      callbacks.emit('inertia', undefined);
    });

    this._timeline.on('end', () => {
      this.cancel();

      callbacks.emit('inertiaEnd', undefined);
    });

    setTimeout(() => this._timeline?.play(), 0);
  }

  /** Destroy inertia animation */
  public cancel() {
    if (!this._timeline) {
      return;
    }

    if (this._timeline.progress < 1) {
      this._ctx.callbacks.emit('inertiaCancel', undefined);
    }

    this._timeline?.destroy();
    this._timeline = undefined;
  }

  /** Destroy instance */
  public destroy() {
    this._timeline?.destroy();
  }
}
