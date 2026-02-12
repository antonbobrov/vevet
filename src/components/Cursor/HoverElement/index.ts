import { isFiniteNumber } from '@/internal/isFiniteNumber';
import { isNumber } from '@/internal/isNumber';
import { isString } from '@/internal/isString';
import { addEventListener, clamp, lerp, toPixels } from '@/utils';

import { LERP_APPROXIMATION } from '../constants';

import {
  ICursorHoverElementProps,
  TCursorHoverElementStickyAmplitude,
  TCursorHoverElementStickyParallax,
} from './types';

export class CursorHoverElement {
  private _debounce: NodeJS.Timeout | null = null;

  private _mouseEnter: () => void;

  private _mouseLeave: () => void;

  private _mouseMove: () => void;

  private _isHovered = false;

  private _parallaxX: TCursorHoverElementStickyParallax = {
    current: 0,
    target: 0,
    prevTarget: null,
  };

  private _parallaxY: TCursorHoverElementStickyParallax = {
    current: 0,
    target: 0,
    prevTarget: null,
  };

  constructor(
    private _data: ICursorHoverElementProps,
    private _onEnter: (element: CursorHoverElement) => void,
    private _onLeave: (element: CursorHoverElement) => void,
  ) {
    const { emitter } = this;

    if (emitter.matches(':hover')) {
      this._handleElementEnter();
    }

    this._mouseEnter = addEventListener(emitter, 'mouseenter', () => {
      this._debounce = setTimeout(
        () => this._handleElementEnter(),
        _data.hoverDebounce ?? 16,
      );
    });

    this._mouseLeave = addEventListener(emitter, 'mouseleave', () => {
      if (this._debounce) {
        clearTimeout(this._debounce);
      }

      this._handleElementLeave();
    });

    this._mouseMove = addEventListener(emitter, 'mousemove', (evt) => {
      this._handleElementMove(evt);
    });
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
    return this._data.stickyFriction ?? 0;
  }

  get hasStickyFriction() {
    return isFiniteNumber(this.stickyFriction) && this.stickyFriction > 0;
  }

  /** Get element dimensions */
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

  /** Destroy all events */
  public destroy() {
    this._mouseEnter();
    this._mouseMove();
    this._mouseLeave();

    if (this._debounce) {
      clearTimeout(this._debounce);
    }
  }

  /** Handle element enter */
  private _handleElementEnter() {
    this._isHovered = true;

    this._onEnter(this);
  }

  /** Handle element leave */
  private _handleElementLeave() {
    this._isHovered = false;

    this._parallaxX.target = 0;
    this._parallaxX.prevTarget = null;

    this._parallaxY.target = 0;
    this._parallaxY.prevTarget = null;

    this._onLeave(this);
  }

  /** Handle element move */
  private _handleElementMove(evt: MouseEvent) {
    if (!this.sticky || !this._isHovered) {
      return;
    }

    const { element, _parallaxX: parallaxX, _parallaxY: parallaxY } = this;
    const { clientX, clientY } = evt;

    const bounding = element.getBoundingClientRect();
    const computed = getComputedStyle(element).transform;
    const matrix =
      computed === 'none' ? new DOMMatrix() : new DOMMatrix(computed);

    const { width, height } = bounding;
    const translateX = matrix.e;
    const translateY = matrix.f;

    const basicLeft = bounding.left - translateX;
    const basicTop = bounding.top - translateY;

    const basicCenterX = basicLeft + width / 2;
    const basicCenterY = basicTop + height / 2;

    const distanceX = clientX - basicCenterX;
    const distanceY = clientY - basicCenterY;

    const amp = this._getStickyAmplitude();

    const maxX = amp.x === 'auto' ? width : Math.abs(amp.x);
    const maxY = amp.y === 'auto' ? height : Math.abs(amp.y);

    const parallaxXTarget = clamp(distanceX, -maxX, maxX);
    const parallaxYTarget = clamp(distanceY, -maxY, maxY);

    if (parallaxX.prevTarget === null) {
      parallaxX.prevTarget = parallaxXTarget;
    }

    if (parallaxY.prevTarget === null) {
      parallaxY.prevTarget = parallaxYTarget;
    }

    if (this.hasStickyFriction) {
      const parallaxXDelta = parallaxXTarget - parallaxX.prevTarget;
      const parallaxYDelta = parallaxYTarget - parallaxY.prevTarget;

      parallaxX.target += parallaxXDelta;
      parallaxY.target += parallaxYDelta;
    } else {
      parallaxX.target = parallaxXTarget;
      parallaxY.target = parallaxYTarget;
    }

    parallaxX.prevTarget = parallaxXTarget;
    parallaxY.prevTarget = parallaxYTarget;
  }

  /** Get sticky amplitude for both axis */
  private _getStickyAmplitude() {
    const { stickyAmplitude } = this._data;

    let x: 'auto' | number = 'auto';
    let y: 'auto' | number = 'auto';

    if (!stickyAmplitude) {
      return { x, y };
    }

    if (isNumber(stickyAmplitude) || isString(stickyAmplitude)) {
      x = this._getStickyAmplitudeAxis(stickyAmplitude);
      y = this._getStickyAmplitudeAxis(stickyAmplitude);
    } else {
      if ('x' in stickyAmplitude) {
        x = this._getStickyAmplitudeAxis(stickyAmplitude.x);
      }

      if ('y' in stickyAmplitude) {
        y = this._getStickyAmplitudeAxis(stickyAmplitude.y);
      }
    }

    return { x, y };
  }

  /** Get sticky amplitude for one axis */
  private _getStickyAmplitudeAxis(value?: TCursorHoverElementStickyAmplitude) {
    if (isNumber(value)) {
      return value;
    }

    if (!value || value === 'auto') {
      return 'auto';
    }

    return toPixels(value);
  }

  /** Check if the element is interpolated */
  get isInterpolated() {
    return (
      this._parallaxX.current === this._parallaxX.target &&
      this._parallaxY.current === this._parallaxY.target
    );
  }

  /** Render the element */
  public render(getLerp: (source?: number) => number) {
    const { _parallaxX: parallaxX, _parallaxY: parallaxY } = this;

    const element = this.element as HTMLElement;

    if (!this.sticky || this.isInterpolated) {
      return;
    }

    // Friction

    if (this.hasStickyFriction) {
      const frictionLerp = getLerp(this.stickyFriction);

      parallaxX.target = lerp(
        parallaxX.target,
        0,
        frictionLerp,
        LERP_APPROXIMATION,
      );

      parallaxY.target = lerp(
        parallaxY.target,
        0,
        frictionLerp,
        LERP_APPROXIMATION,
      );
    }

    // Magnet

    const lerpFactor = getLerp(this.stickyLerp);

    parallaxX.current = lerp(
      parallaxX.current,
      parallaxX.target,
      lerpFactor,
      LERP_APPROXIMATION,
    );

    parallaxY.current = lerp(
      parallaxY.current,
      parallaxY.target,
      lerpFactor,
      LERP_APPROXIMATION,
    );

    element.style.transform = `translate3d(${parallaxX.current}px, ${parallaxY.current}px, 0)`;
  }
}
