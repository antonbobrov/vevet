const DELTAS_GAIN_COUNT = 3;
const SMALL_DELTA_THRESHOLD = 50;
const GAIN_THRESHOLD = 1;
const THROTTLE_DEBOUNCE = 250;

/**
 * Throttles discrete wheel steps in `followWheel: false` mode.
 * Distinguishes touchpad momentum from mouse-wheel clicks via delta shape.
 *
 * @internal
 */
export class SnapWheelThrottler {
  private _throttling = false;

  private _debounce?: NodeJS.Timeout;

  private _deltaMode = 0;

  private _prevSnapshot?: number[];

  constructor(private _getDeltas: () => number[]) {}

  private get abs() {
    return this._getDeltas().map((delta) => Math.abs(delta));
  }

  private get length() {
    return this.abs.length;
  }

  private get consistency() {
    if (!this.length) {
      return 1;
    }

    return this.abs.reduce((s, n) => s + this._roundness(n), 0) / this.length;
  }

  private get consistent() {
    return this.consistency > 0.95;
  }

  private get small() {
    return this.abs.some((d) => d < SMALL_DELTA_THRESHOLD);
  }

  private get likeTouchPad() {
    return this._deltaMode === 0 && (this.small || !this.consistent);
  }

  private get isIncreasing() {
    if (this.length < DELTAS_GAIN_COUNT) {
      return false;
    }

    const last = this.abs.slice(-DELTAS_GAIN_COUNT);

    return last.every(
      (value, i) => i === 0 || last[i - 1] + GAIN_THRESHOLD < value,
    );
  }

  public test(delta: number, deltaMode?: number) {
    if (!(delta > 1 || delta < -1)) {
      this._prevSnapshot = undefined;

      return false;
    }

    this._deltaMode = deltaMode ?? 0;

    if (this._throttling) {
      this._prevSnapshot = undefined;

      return false;
    }

    if ((this.likeTouchPad && this.isIncreasing) || !this.likeTouchPad) {
      if (this.likeTouchPad && this._prevSnapshot) {
        const currentTotal = this.abs.reduce((p, c) => p + c, 0);
        const prevTotal = this._prevSnapshot.reduce((p, c) => p + c, 0);

        this._prevSnapshot = undefined;

        if (Math.abs(prevTotal / currentTotal) > 3) {
          return false;
        }
      }

      this._prevSnapshot = [...this.abs];
      this._startThrottle();

      return true;
    }

    return false;
  }

  private _startThrottle() {
    this._throttling = true;

    if (this._debounce) {
      clearTimeout(this._debounce);
      this._debounce = undefined;
    }

    this._debounce = setTimeout(() => {
      this._throttling = false;
      this._debounce = undefined;
    }, THROTTLE_DEBOUNCE);
  }

  private _roundness(n: number) {
    const steps = [10, 100, 1000];

    return Math.max(
      ...steps.map((step) => {
        const d = Math.abs(n - Math.round(n / step) * step);

        return Math.exp(-d / (step * 0.05));
      }),
    );
  }

  public destroy() {
    this._throttling = false;

    if (this._debounce) {
      clearTimeout(this._debounce);
      this._debounce = undefined;
    }
  }
}
