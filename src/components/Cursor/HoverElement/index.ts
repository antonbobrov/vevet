import {
  getTransforms,
  isNumber,
  isString,
  ModulePart,
  onlyFinite,
} from '@/internal';
import { addEventListener, clamp, lerp, toPixels, uid } from '@/utils';

import { APPX } from '../constants';
import { ICursorVec2 } from '../global';

import {
  ICursorHoverElementData,
  TCursorHoverElementStickyAmplitude,
} from './types';

import type { Cursor } from '..';

/**
 * Hover target for {@link Cursor.attachHover}: size / snap / sticky and enter / leave.
 *
 * Sticky offsets use named {@link Raf} entries on the parent cursor loop.
 */
export class CursorHoverElement extends ModulePart<Cursor> {
  private _hovered = false;

  private _prevTarget: ICursorVec2 | null = null;

  private xKey: string;
  private yKey: string;

  constructor(
    parent: Cursor,
    private data: ICursorHoverElementData,
  ) {
    super(parent);

    const { emitter } = this;

    this.xKey = uid('cursor-hover-element-x');
    this.yKey = uid('cursor-hover-element-y');

    data.raf.add(this.xKey, { value: 0, appx: APPX, ease: () => this.ease });
    data.raf.add(this.yKey, { value: 0, appx: APPX, ease: () => this.ease });

    this.onDestroy(() => {
      this.raf.delete(this.xKey);
      this.raf.delete(this.yKey);
    });

    if (emitter.matches(':hover')) {
      this._handleEnter();
    }

    this._setEvents();
  }

  private get settings() {
    return this.data.settings;
  }

  private get raf() {
    return this.data.raf;
  }

  private get ease() {
    return this.settings.ease ?? this.settings.stickyLerp ?? this.parent.ease;
  }

  private get enabled() {
    return this.parent.props.enabled;
  }

  get element() {
    return this.settings.element;
  }

  get emitter() {
    return this.settings.emitter ?? this.settings.element;
  }

  get type() {
    return this.settings.type;
  }

  get snap() {
    return this.settings.snap ?? false;
  }

  get width() {
    if (this.settings.width === 'auto') {
      return 'auto';
    }

    if (this.settings.width) {
      return toPixels(this.settings.width);
    }

    return null;
  }

  get height() {
    if (this.settings.height === 'auto') {
      return 'auto';
    }

    if (this.settings.height) {
      return toPixels(this.settings.height);
    }

    return null;
  }

  get padding() {
    return this.settings.padding ? toPixels(this.settings.padding) : 0;
  }

  get sticky() {
    return this.settings.sticky ?? false;
  }

  get stickyLerp() {
    return this.settings.stickyLerp ?? undefined;
  }

  get friction() {
    const value = this.settings.friction ?? this.settings.stickyFriction ?? 0;

    return onlyFinite(value, 0);
  }

  get hasFriction() {
    return this.friction > 0;
  }

  /** Hover size / snap center used to update cursor targets. */
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
    const { emitter, settings: props } = this;

    let debounceTimeout: NodeJS.Timeout | undefined;

    this.onDestroy(
      addEventListener(emitter, 'mouseenter', () => {
        debounceTimeout = setTimeout(
          () => this._handleEnter(),
          props.hoverDebounce ?? 16,
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

    this.data.onEnter(this);
  }

  private _handleLeave() {
    if (!this.enabled) {
      return;
    }

    this._hovered = false;
    this._prevTarget = null;

    this.raf.target(this.xKey, 0);
    this.raf.target(this.yKey, 0);

    this.data.onLeave(this);
  }

  private _handleMove(evt: MouseEvent) {
    if (!this.enabled || !this.sticky || !this._hovered) {
      return;
    }

    const { element, raf, xKey, yKey } = this;

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

    if (this.hasFriction) {
      const parallaxXDelta = xTarget - this._prevTarget.x;
      const parallaxYDelta = yTarget - this._prevTarget.y;

      raf.target(xKey, raf.target(xKey) + parallaxXDelta);
      raf.target(yKey, raf.target(yKey) + parallaxYDelta);
    } else {
      this.raf.target(xKey, xTarget);
      this.raf.target(yKey, yTarget);
    }

    this._prevTarget.x = xTarget;
    this._prevTarget.y = yTarget;
  }

  private _getStickyAmp() {
    const amp = this.settings.amp ?? this.settings.stickyAmplitude;

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

  public render() {
    const element = this.element as HTMLElement;
    const { raf, xKey, yKey } = this;

    if (!this.enabled || !this.sticky) {
      return;
    }

    if (raf.interpolated(xKey) && raf.interpolated(yKey)) {
      return;
    }

    if (this.hasFriction) {
      const friction = raf.lerpFactor(clamp(this.friction, 0, 1));

      const targetX = lerp(raf.target(xKey), 0, friction, APPX);
      const targetY = lerp(raf.target(yKey), 0, friction, APPX);

      raf.target(xKey, targetX);
      raf.target(yKey, targetY);
    }

    const x = raf.value(xKey);
    const y = raf.value(yKey);
    element.style.transform = `translate3d(${x}px, ${y}px, 0)`;
  }
}
