import normalizeWheel from 'normalize-wheel';

import { WHEEL_END_DEBOUNCE } from '@/components/Snap/constants';
import { addEventListener } from '@/utils';

import { IProps } from './types';

const DELTAS_COUNT = 6;

/**
 * Raw `wheel` listener: normalizes deltas, debounces `wheelEnd`, tracks delta history.
 *
 * @internal
 */
export class SnapWheelEvents {
  private _deltas: number[] = [];

  private _started = false;

  private _debounceEnd?: NodeJS.Timeout;

  private _listener: () => void;

  constructor(
    container: HTMLElement,
    private _props: IProps,
  ) {
    this._listener = addEventListener(
      container,
      'wheel',
      (event) => this._handle(event),
      { passive: false },
    );
  }

  get isWheeling() {
    return this._started;
  }

  get deltas() {
    return this._deltas;
  }

  private _push(delta: number) {
    if (this._deltas.length >= DELTAS_COUNT) {
      this._deltas.shift();
    }

    this._deltas.push(delta);
  }

  private _handle(evt: WheelEvent) {
    if (!this._props.getEnabled()) {
      return;
    }

    evt.preventDefault();

    const wheelData = normalizeWheel(evt);
    const axis = this._props.getAxis();
    const delta = axis === 'x' ? wheelData.pixelX : wheelData.pixelY;

    this._push(delta);

    this._requestStart(delta);
    this._requestMove(evt, delta);

    this._clearDebounceEnd();
    this._debounceEnd = setTimeout(
      () => this._requestEnd(),
      WHEEL_END_DEBOUNCE,
    );
  }

  private _requestStart(delta: number) {
    if (this._started || Math.abs(delta) < 2) {
      return;
    }

    this._started = true;
    this._props.onStart();
  }

  private _requestMove(evt: WheelEvent, delta: number) {
    if (!this._started) {
      return;
    }

    this._props.onMove(evt, delta);
  }

  private _requestEnd() {
    if (!this._started) {
      return;
    }

    this._props.onEnd();
    this._clear();
  }

  private _clearDebounceEnd() {
    if (this._debounceEnd) {
      clearTimeout(this._debounceEnd);
      this._debounceEnd = undefined;
    }
  }

  private _clear() {
    this._clearDebounceEnd();
    this._deltas = [];
    this._started = false;
  }

  public destroy() {
    this._clear();
    this._listener();
  }
}
