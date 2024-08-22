import { IAddEventListener, addEventListener } from 'vevet-dom';
import { Callbacks } from '@/base/Callbacks';
import { EOrientationTypes, ESizeTypes, NViewport } from './types';
import { getApp } from '@/utils/internal/getApp';

export type { NViewport };

/**
 * Callbacks on window resize
 */
export class Viewport extends Callbacks<NViewport.ICallbacksTypes> {
  private _width: number;

  get width() {
    return this._width;
  }

  private _height: number;

  get height() {
    return this._height;
  }

  get radius() {
    return Math.sqrt(this.width ** 2 + this.height ** 2) / 2;
  }

  /** VW value */
  get vw() {
    return this.width / 100;
  }

  /** VH value */
  get vh() {
    return this.height / 100;
  }

  /** VR value (viewport radius / 100) */
  get vr() {
    return this.radius / 100;
  }

  /** Width greater than height */
  get isLandscape() {
    return this.width > this.height;
  }

  /** Width less than height */
  get isPortrait() {
    return this.width < this.height;
  }

  /** Is desktop size */
  get isDesktop() {
    return this.width > getApp().props.tablet;
  }

  /** Is tablet size */
  get isTablet() {
    return (
      this.width <= getApp().props.tablet && this.width > getApp().props.phone
    );
  }

  /** Is phone size */
  get isPhone() {
    return this.width <= getApp().props.phone;
  }

  /**
   * Device pixel ratio
   */
  get dpr() {
    return window.devicePixelRatio;
  }

  /**
   * Device pixel ratio. For non-mobile devices it is always 1.
   */
  get lowerDesktopDpr() {
    if (getApp().isDesktop) {
      return 1;
    }

    return this.dpr;
  }

  private _resizeTimeout?: NodeJS.Timeout;

  private _resizeListener?: IAddEventListener;

  constructor() {
    super(false);

    this._width = 0;
    this._height = 0;

    this._init();
  }

  protected _init() {
    this._updateValues();

    this._setEvents();
  }

  /** Set events on resize */
  private _setEvents() {
    this._resizeListener = addEventListener(window, 'resize', () => {
      if (this._resizeTimeout) {
        clearTimeout(this._resizeTimeout);
        this._resizeTimeout = undefined;
      }

      this._resizeTimeout = setTimeout(() => {
        this._onResize();
        this._resizeTimeout = undefined;
      }, getApp().props.resizeDebounce);
    });
  }

  /** Set viewport values */
  private _updateValues() {
    const { html, props } = getApp();

    // get width
    const width =
      props.widthDetection === 'boundingRect'
        ? parseFloat(html.getBoundingClientRect().width.toFixed(3))
        : html.clientWidth;

    // set sizes
    this._width = width;
    this._height = html.clientHeight;

    // update states
    this._updateClassNames();
    this._updateCSSVars();
  }

  /** Change classes of the document element */
  private _updateClassNames() {
    const viewportSizeTypes: ESizeTypes[] = [
      ESizeTypes.Desktop,
      ESizeTypes.Tablet,
      ESizeTypes.Phone,
    ];

    if (this.isDesktop) {
      this._updateBreakpointClassNames(ESizeTypes.Desktop, viewportSizeTypes);
    } else if (this.isTablet) {
      this._updateBreakpointClassNames(ESizeTypes.Tablet, viewportSizeTypes);
    } else {
      this._updateBreakpointClassNames(ESizeTypes.Phone, viewportSizeTypes);
    }

    const orientationTypes: EOrientationTypes[] = [
      EOrientationTypes.Landscape,
      EOrientationTypes.Portrait,
    ];

    if (this.isLandscape) {
      this._updateBreakpointClassNames(
        EOrientationTypes.Landscape,
        orientationTypes,
      );
    } else if (this.isPortrait) {
      this._updateBreakpointClassNames(
        EOrientationTypes.Portrait,
        orientationTypes,
      );
    } else {
      this._updateBreakpointClassNames('', orientationTypes);
    }
  }

  /** Change breakpoint classes of the document element */
  private _updateBreakpointClassNames(activeType: string, types: string[]) {
    const { html, prefix } = getApp();

    types.forEach((type) => {
      if (type === activeType) {
        html.classList.add(`${prefix}viewport-${type}`);
      } else {
        html.classList.remove(`${prefix}viewport-${type}`);
      }
    });
  }

  /** Update CSS vars */
  private _updateCSSVars() {
    const { html } = getApp();

    html.style.setProperty('--vw', `${this.vw}px`);
    html.style.setProperty('--vh', `${this.vh}px`);
    html.style.setProperty('--vr', `${this.vr}px`);
  }

  /** Launch callbacks on resize. */
  private _onResize(
    /** force all callbacks */
    force = false,
  ) {
    const { _width: prevWidth, _height: prevHeight } = this;

    this._updateValues();

    const { width, height } = this;

    // get changes in viewport
    const changes: NViewport.IChanges = {
      isWidthChanged: width !== prevWidth,
      isHeightChanged: height !== prevHeight,
      isOrientationChanged: width > height !== prevWidth > prevHeight,
    };

    if (force || (width !== prevWidth && height === prevHeight)) {
      this.tbt('widthOnly', changes);
    }
    if (force || (height !== prevHeight && width === prevWidth)) {
      this.tbt('heightOnly', changes);
    }
    if (force || (width !== prevWidth && height !== prevHeight)) {
      this.tbt('both', changes);
    }
    if (force || width !== prevWidth) {
      this.tbt('width', changes);
    }
    if (force || height !== prevHeight) {
      this.tbt('height', changes);
    }

    this.tbt('any', changes);
  }

  /**
   * Force launching all callbacks
   */
  public forceResize() {
    this._onResize(true);
  }

  public destroy() {
    super.destroy();

    if (this._resizeTimeout) {
      clearTimeout(this._resizeTimeout);
    }

    this._resizeListener?.remove();
  }
}
