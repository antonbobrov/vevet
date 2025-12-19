import { isNumber } from '@/internal/isNumber';
import {
  ICursorHoverElementProps,
  TCursorHoverElementStickyAmplitude,
} from './types';
import { addEventListener, clamp, lerp, toPixels } from '@/utils';
import { LERP_APPROXIMATION } from '../constants';
import { isString } from '@/internal/isString';

export class CursorHoverElement {
  protected _debounce: NodeJS.Timeout | null = null;

  protected _mouseEnter: () => void;

  protected _mouseLeave: () => void;

  protected _mouseMove: () => void;

  protected _isHovered = false;

  protected _parallaxX = { current: 0, target: 0 };

  protected _parallaxY = { current: 0, target: 0 };

  constructor(
    protected _data: ICursorHoverElementProps,
    protected _onEnter: (element: CursorHoverElement) => void,
    protected _onLeave: (element: CursorHoverElement) => void,
  ) {
    const { element } = this;

    if (element.matches(':hover')) {
      this._handleElementEnter();
    }

    this._mouseEnter = addEventListener(element, 'mouseenter', () => {
      this._debounce = setTimeout(
        () => this._handleElementEnter(),
        _data.hoverDebounce ?? 16,
      );
    });

    this._mouseLeave = addEventListener(element, 'mouseleave', () => {
      if (this._debounce) {
        clearTimeout(this._debounce);
      }

      this._handleElementLeave();
    });

    this._mouseMove = addEventListener(element, 'mousemove', (evt) => {
      this._handleElementMove(evt);
    });
  }

  get element() {
    return this._data.element;
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

  /** X value for sticky parallax */
  get stickyX() {
    return this._parallaxX.current;
  }

  /** Y value for sticky parallax */
  get stickyY() {
    return this._parallaxY.current;
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
    this._mouseLeave();

    if (this._debounce) {
      clearTimeout(this._debounce);
    }
  }

  /** Handle element enter */
  protected _handleElementEnter() {
    this._isHovered = true;

    this._onEnter(this);
  }

  /** Handle element leave */
  protected _handleElementLeave() {
    this._isHovered = false;
    this._parallaxX.target = 0;
    this._parallaxY.target = 0;

    this._onLeave(this);
  }

  /** Handle element move */
  protected _handleElementMove(evt: MouseEvent) {
    if (!this.sticky || !this._isHovered) {
      return;
    }

    const { element } = this;
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

    this._parallaxX.target = clamp(distanceX, -maxX, maxX);
    this._parallaxY.target = clamp(distanceY, -maxY, maxY);
  }

  /** Get sticky amplitude for both axis */
  protected _getStickyAmplitude() {
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
  protected _getStickyAmplitudeAxis(
    value?: TCursorHoverElementStickyAmplitude,
  ) {
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
  public render(lerpFactor: number) {
    const { _parallaxX: parallaxX, _parallaxY: parallaxY } = this;
    const element = this.element as HTMLElement;

    if (!this.sticky || this.isInterpolated) {
      return;
    }

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
