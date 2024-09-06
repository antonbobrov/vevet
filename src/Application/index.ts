import version from '../version';
import { NApplication } from './types';
import { getDeviceInfo } from '@/utils/internal/getDeviceInfo';
import { fetchWebpSupport } from '@/utils/internal/fetchWebpSupport';
import { PCancelable } from '@/utils/common/PCancelable';
import { createOnPageLoad } from './events/createOnPageLoad';
import { createViewport, NViewport } from './events/createViewport';

/**
 * Vevet Application. This is the base Vevet class
 * that should be initialized first.
 */
export class Application {
  /** Vevet version */
  get version() {
    return version;
  }

  private _props: NApplication.IProps;

  /** Application properties */
  get props() {
    return this._props;
  }

  /** Default properties */
  get defaultProps(): NApplication.IProps {
    return {
      tablet: 1199,
      phone: 899,
      prefix: 'v-',
      easing: [0.25, 0.1, 0.25, 1],
      resizeDebounce: 16,
      shouldCheckWebpSupport: true,
      widthDetection: 'boundingRect',
    };
  }

  /** Vevet prefix */
  get prefix() {
    return this._props.prefix;
  }

  /** Is phone device */
  private _isPhone!: boolean;

  /** Is phone device */
  get isPhone() {
    return this._isPhone;
  }

  /** Is phone device */
  private _isTablet!: boolean;

  /** Is tablet device */
  get isTablet() {
    return this._isTablet;
  }

  /** Is mobile device */
  private _isMobile!: boolean;

  /** Is phone device */
  get isMobile() {
    return this._isMobile;
  }

  /** Is desktop device */
  private _isDesktop!: boolean;

  /** Is desktop device */
  get isDesktop() {
    return this._isDesktop;
  }

  /** Operating system name */
  private _osName!: string;

  /** Operating system name */
  get osName() {
    return this._osName;
  }

  /** Browser name */
  private _browserName!: string;

  /** Browser name */
  get browserName() {
    return this._browserName;
  }

  /** WebP supported */
  private _isWebpSupported: boolean;

  /** WebP supported */
  get isWebpSupported() {
    return this._isWebpSupported;
  }

  private _pageLoad: ReturnType<typeof createOnPageLoad>;

  private _viewport: ReturnType<typeof createViewport>;

  /** Viewport Callbacks */
  get viewport() {
    return this._viewport;
  }

  /**
   * @example
   * const app = Application();
   */
  constructor(data: Partial<NApplication.IProps> = {}) {
    // check if the application already exists
    if (window.vevetApp) {
      throw new Error('Vevet Application already exists!');
    }

    // set defaults
    this._props = {
      ...this.defaultProps,
      ...data,
    };
    this._isWebpSupported = false;

    // initialize the application
    this._setDeviceFeatures();

    // add the application to the window
    window.vevetApp = this;

    // create default helpers
    this._pageLoad = createOnPageLoad();
    this._viewport = createViewport();
  }

  /** Get and set device info */
  private _setDeviceFeatures() {
    const { prefix, html } = this;
    const { osName, browserName, device } = getDeviceInfo();

    html.classList.add(`${prefix}os-${osName}`);
    this._osName = osName;

    html.classList.add(`${prefix}browser-${browserName}`);
    this._browserName = browserName;

    this._isPhone = device.phone;
    html.classList.toggle(`${prefix}phone`, this._isPhone);

    this._isTablet = device.tablet;
    html.classList.toggle(`${prefix}tablet`, this._isTablet);

    this._isMobile = device.phone || device.tablet;
    html.classList.toggle(`${prefix}mobile`, this._isMobile);

    this._isDesktop = !this._isMobile;
    html.classList.toggle(`${prefix}desktop`, this._isDesktop);

    // check webp support
    if (this.props.shouldCheckWebpSupport) {
      fetchWebpSupport()
        .then(() => {
          this._isWebpSupported = true;
        })
        .catch(() => {});
    }
  }

  /** Document element */
  get doc() {
    return document;
  }

  /** HTML element */
  get html() {
    return document.documentElement;
  }

  /** Body element */
  get body() {
    return document.body;
  }

  /** Action on page load */
  public onPageLoad() {
    return new PCancelable((resolve: (...arg: any) => void) =>
      this._pageLoad.onLoad(resolve),
    );
  }

  /** Check if page is loaded */
  get isPageLoaded() {
    return this._pageLoad.getIsLoaded();
  }
}

export type { NApplication, NViewport };

declare global {
  interface Window {
    vevetApp: Application;
  }
}
