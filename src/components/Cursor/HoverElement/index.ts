import {
  Destroyable,
  getTransforms,
  isNumber,
  isString,
  onlyFinite,
} from '@/internal';
import { addEventListener, clamp, toPixels } from '@/utils';

import { LERP_APPROXIMATION } from '../constants';
import { ICursorVec2 } from '../global';
import { SmoothNumber } from '../SmoothNumber';

import {
  ICursorHoverElementProps,
  TCursorHoverElementStickyAmplitude,
} from './types';

/**
 * Hover target for {@link Cursor.attachHover}: size/snap/sticky and enter/leave.
 */
export class CursorHoverElement extends Destroyable {
  private _hovered = false;

  private _x: SmoothNumber;

  private _y: SmoothNumber;

  private _prevTarget: ICursorVec2 | null = null;

  constructor(
    private _data: ICursorHoverElementProps,
    private _onEnter: (element: CursorHoverElement) => void,
    private _onLeave: (element: CursorHoverElement) => void,
  ) {
    super();

    const { emitter } = this;

    this._x = new SmoothNumber(0);
    this._y = new SmoothNumber(0);

    if (emitter.matches(':hover')) {
      this._handleEnter();
    }

    this._setEvents();
  }

  get element() {
    return this._data.element;
  }

  get emitter() {
    return this._data.emitter ?? this._data.element;
  }

  get type() {
    return this._data.type;
  }

  get snap() {
    return this._data.snap ?? false;
  }

  get width() {
    if (this._data.width === 'auto') {
      return 'auto';
    }

    if (this._data.width) {
      return toPixels(this._data.width);
    }

    return null;
  }

  get height() {
    if (this._data.height === 'auto') {
      return 'auto';
    }

    if (this._data.height) {
      return toPixels(this._data.height);
    }

    return null;
  }

  get padding() {
    return this._data.padding ? toPixels(this._data.padding) : 0;
  }

  get sticky() {
    return this._data.sticky ?? false;
  }

  get stickyLerp() {
    return this._data.stickyLerp ?? undefined;
  }

  get stickyFriction() {
    return onlyFinite(this._data.stickyFriction ?? 0, 0);
  }

  get hasStickyFriction() {
    return this.stickyFriction > 0;
  }

  get isInterpolated() {
    return this._x.interpolated && this._y.interpolated;
  }

  public getDimensions() {
    let x: number | undefined;
    let y: number | undefined;
    let width: number | undefined;
    let height: number | undefined;
    let padding = 0;

    const bounding = this.element.getBoundingClientRect();

    if (this.snap) {
      x = bounding.left + bounding.width / 2;
      y = bounding.top + bounding.height / 2;
    }

    if (this.width === 'auto') {
      width = bounding.width;
    } else if (isNumber(this.width)) {
      width = this.width;
    }

    if (this.height === 'auto') {
      height = bounding.height;
    } else if (isNumber(this.height)) {
      height = this.height;
    }

    padding = this.padding;

    return { x, y, width, height, padding };
  }

  private _setEvents() {
    const { emitter, _data: data } = this;

    let debounceTimeout: NodeJS.Timeout | undefined;

    this.onDestroy(
      addEventListener(emitter, 'mouseenter', () => {
        debounceTimeout = setTimeout(
          () => this._handleEnter(),
          data.hoverDebounce ?? 16,
        );
      }),
    );

    this.onDestroy(
      addEventListener(emitter, 'mouseleave', () => {
        if (debounceTimeout) {
          clearTimeout(debounceTimeout);
          debounceTimeout = undefined;
        }

        this._handleLeave();
      }),
    );

    this.onDestroy(
      addEventListener(emitter, 'mousemove', (evt) => {
        this._handleMove(evt);
      }),
    );

    this.onDestroy(() => {
      if (debounceTimeout) {
        clearTimeout(debounceTimeout);
      }
    });
  }

  private _handleEnter() {
    this._hovered = true;

    this._onEnter(this);
  }

  private _handleLeave() {
    this._hovered = false;

    this._x.target = 0;
    this._y.target = 0;

    this._prevTarget = null;

    this._onLeave(this);
  }

  private _handleMove(evt: MouseEvent) {
    if (!this.sticky || !this._hovered) {
      return;
    }

    const { element } = this;

    const bounding = element.getBoundingClientRect();
    const { translateX, translateY } = getTransforms(element);

    const { width, height } = bounding;

    const basicCenterX = bounding.left - translateX + width / 2;
    const basicCenterY = bounding.top - translateY + height / 2;

    const distanceX = evt.clientX - basicCenterX;
    const distanceY = evt.clientY - basicCenterY;

    const amp = this._getStickyAmp();

    const maxX = amp.x === 'auto' ? width : Math.abs(amp.x);
    const maxY = amp.y === 'auto' ? height : Math.abs(amp.y);

    const xTarget = clamp(distanceX, -maxX, maxX);
    const yTarget = clamp(distanceY, -maxY, maxY);

    this._prevTarget = this._prevTarget ?? { x: xTarget, y: yTarget };

    if (this.hasStickyFriction) {
      const parallaxXDelta = xTarget - this._prevTarget.x;
      const parallaxYDelta = yTarget - this._prevTarget.y;

      this._x.target += parallaxXDelta;
      this._y.target += parallaxYDelta;
    } else {
      this._x.target = xTarget;
      this._y.target = yTarget;
    }

    this._prevTarget.x = xTarget;
    this._prevTarget.y = yTarget;
  }

  private _getStickyAmp() {
    const amp = this._data.stickyAmplitude;

    let x: 'auto' | number = 'auto';
    let y: 'auto' | number = 'auto';

    if (!amp) {
      return { x, y };
    }

    if (isNumber(amp) || isString(amp)) {
      x = this._parseAmp(amp);
      y = this._parseAmp(amp);
    } else {
      if ('x' in amp) {
        x = this._parseAmp(amp.x);
      }

      if ('y' in amp) {
        y = this._parseAmp(amp.y);
      }
    }

    return { x, y };
  }

  private _parseAmp(value?: TCursorHoverElementStickyAmplitude) {
    if (isNumber(value)) {
      return value;
    }

    if (!value || value === 'auto') {
      return 'auto';
    }

    return toPixels(value);
  }

  public render(getLerp: (source?: number) => number) {
    const element = this.element as HTMLElement;

    if (!this.sticky) {
      return;
    }

    if (this.isInterpolated) {
      return;
    }

    if (this.hasStickyFriction) {
      const frictionLerp = getLerp(this.stickyFriction);

      this._x.targetFriction(0, frictionLerp, LERP_APPROXIMATION);
      this._y.targetFriction(0, frictionLerp, LERP_APPROXIMATION);
    }

    const lerpFactor = getLerp(this.stickyLerp);

    this._x.toTarget(lerpFactor, LERP_APPROXIMATION);
    this._y.toTarget(lerpFactor, LERP_APPROXIMATION);

    element.style.transform = `translate3d(${this._x.current}px, ${this._y.current}px, 0)`;
  }
}
