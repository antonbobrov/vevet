import { Module, TModuleOnCallbacksProps } from '@/base/Module';
import { initVevet } from '@/global/initVevet';
import { cnToggle } from '@/internal/cn';
import { body } from '@/internal/env';
import { noopIfDestroyed } from '@/internal/noopIfDestroyed';
import { TRequiredProps } from '@/internal/requiredProps';
import { getTextDirection } from '@/internal/textDirection';
import { clamp } from '@/utils/math';

import { MUTABLE_PROPS, STATIC_PROPS } from './props';
import {
  IInViewCallbacksMap,
  IInViewElement,
  IInViewMutableProps,
  IInViewStaticProps,
  TInViewElementDirection,
} from './types';

export * from './types';

type TC = IInViewCallbacksMap;
type TS = IInViewStaticProps;
type TM = IInViewMutableProps;

/**
 * InView is a visibility detection utility that leverages the `IntersectionObserver` API to monitor when elements enter or leave the viewport.
 * It provides customizable options for triggering events, delaying visibility changes, and dynamically adding CSS classes to elements based on their visibility state.
 *
 * [Documentation](https://vevetjs.com/docs/InView)
 *
 * @group Components
 */
export class InView extends Module<TC, TS, TM> {
  /**
   * Returns default static properties.
   */
  public _getStatic(): TRequiredProps<TS> {
    return { ...super._getStatic(), ...STATIC_PROPS };
  }

  /**
   * Returns default mutable properties.
   */
  public _getMutable(): TRequiredProps<TM> {
    return { ...super._getMutable(), ...MUTABLE_PROPS };
  }

  /** Intersection observer for detecting elements entering the viewport. */
  private _in?: IntersectionObserver;

  /** Intersection observer for detecting elements leaving the viewport. */
  private _out?: IntersectionObserver;

  /** Tracks whether this is the first time the elements are being observed. */
  private _isInitialStart = true;

  /** Stores the elements being observed. */
  private _elements: IInViewElement[] = [];

  /** Detects if the container is RTL */
  private _isRtl = false;

  /**
   * Initializes the `InView` module.
   */
  constructor(
    props?: TS & TM & TModuleOnCallbacksProps<TC, InView>,
    onCallbacks?: TModuleOnCallbacksProps<TC, InView>,
  ) {
    super(props, onCallbacks as any);

    // get direction
    this._isRtl = getTextDirection(body) === 'rtl';

    this._setup();
  }

  /**
   * Indicates whether the observation has started for the first time.
   */
  get isInitialStart() {
    return this._isInitialStart;
  }

  /**
   * Returns all elements currently being observed.
   */
  get elements() {
    return this._elements;
  }

  /**
   * Handles property mutations and updates observation events accordingly.
   */
  protected _handleProps() {
    super._handleProps();

    this._setup();
  }

  /**
   * Configures or reconfigures the view observation events.
   */
  private _setup() {
    this._removeViewEvents();

    if (this.props.enabled) {
      this._setViewEvents();
    }
  }

  /**
   * Removes all observation events and disconnects observers.
   */
  private _removeViewEvents() {
    this._in?.disconnect();
    this._in = undefined;

    this._out?.disconnect();
    this._out = undefined;
  }

  /**
   * Sets up `IntersectionObserver` instances to detect visibility changes.
   */
  private _setViewEvents() {
    const { isInitialStart, props } = this;
    const rootMargin = isInitialStart ? '0% 0% 0% 0%' : props.rootMargin;

    this._in = new IntersectionObserver(
      (data) => this._handleIn(data, isInitialStart),
      { root: null, threshold: 0, rootMargin },
    );

    this.elements.forEach((element) => this._in?.observe(element));

    if (!props.hasOut) {
      return;
    }

    this._out = new IntersectionObserver((data) => this._handleOut(data), {
      root: null,
      threshold: 0,
      rootMargin: '0px 0px 0px 0px',
    });

    this.elements.forEach((element) => this._out?.observe(element));
  }

  /**
   * Handles elements entering the viewport.
   */
  private _handleIn(
    data: IntersectionObserverEntry[],
    isInitialStart: boolean,
  ) {
    data.forEach((entry) => {
      const element = entry.target as IInViewElement;

      if (!entry.isIntersecting || element.$vevetInViewBool) {
        return;
      }

      element.$vevetInViewBool = true;

      if (element.$vevetInViewTimeout) {
        clearTimeout(element.$vevetInViewTimeout);
        element.$vevetInViewTimeout = undefined;
      }

      element.$vevetInViewTimeout = setTimeout(
        () => this._handleInOut(entry, true, isInitialStart),
        this._getDelay(element),
      );

      if (!this.props.hasOut) {
        this.removeElement(element);
      }
    });

    if (this._isInitialStart) {
      this._isInitialStart = false;

      this._setup();
    }
  }

  /**
   * Handles elements leaving the viewport.
   */
  private _handleOut(data: IntersectionObserverEntry[]) {
    data.forEach((entry) => {
      const element = entry.target as IInViewElement;

      if (entry.isIntersecting || !element.$vevetInViewBool) {
        return;
      }

      element.$vevetInViewBool = false;

      if (element.$vevetInViewTimeout) {
        clearTimeout(element.$vevetInViewTimeout);
        element.$vevetInViewTimeout = undefined;
      }

      element.$vevetInViewTimeout = setTimeout(
        () => this._handleInOut(entry, false),
        0,
      );
    });
  }

  /**
   * Toggles visibility classes and emits events for visibility changes.
   */
  private _handleInOut(
    entry: IntersectionObserverEntry,
    isInView: boolean,
    isInitialStart = false,
  ) {
    const element = entry.target as IInViewElement;

    const direction = this._getDirection(entry, isInView, isInitialStart);

    this._toggleClassname(element, isInView, direction);

    this.callbacks.emit(isInView ? 'in' : 'out', { element, direction });
  }

  /** Toggles visibility classes */
  private _toggleClassname(
    element: Element,
    isInView: boolean,
    direction: TInViewElementDirection,
  ) {
    const classNames = element.getAttribute('data-in-view-class');
    if (!classNames) {
      return;
    }

    const split = classNames.split('|');
    const direct = split[0].trim();
    const reverse = split[1]?.trim() || direct;

    if (!direct) {
      return;
    }

    if (isInView) {
      const isReverse = direction === 'fromRight' || direction === 'fromTop';

      const className = isReverse ? reverse.trim() : direct.trim();

      cnToggle(element, className, isInView);

      return;
    }

    cnToggle(element, direct, isInView);
    cnToggle(element, reverse, isInView);
  }

  /** Gets element direction */
  private _getDirection(
    entry: IntersectionObserverEntry,
    isInView: boolean,
    isInitialStart: boolean,
  ) {
    const app = initVevet();
    const bounding = entry.boundingClientRect;

    if (this.props.scrollDirection === 'horizontal') {
      let direction: TInViewElementDirection = 'fromRight';

      if ((isInView && !isInitialStart) || !isInView) {
        if (bounding.left > app.width / 2) {
          direction = 'fromRight';
        } else if (bounding.right < app.width / 2) {
          direction = 'fromLeft';
        }
      }

      return direction;
    }

    let direction: TInViewElementDirection = 'fromBottom';

    if ((isInView && !isInitialStart) || !isInView) {
      if (bounding.top > app.height / 2) {
        direction = 'fromBottom';
      } else if (bounding.bottom < app.height / 2) {
        direction = 'fromTop';
      }
    }

    return direction;
  }

  /**
   * Calculates the delay before triggering an element's visibility event.
   */
  private _getDelay(element: IInViewElement) {
    const { scrollDirection, maxInitialDelay } = this.props;
    const app = initVevet();

    if (!this.isInitialStart || maxInitialDelay <= 0) {
      return 0;
    }

    const bounding = element.getBoundingClientRect();

    const rootBounding = {
      top: 0,
      left: 0,
      width: app.width,
      height: app.height,
    };

    let progress = clamp(
      scrollDirection === 'horizontal'
        ? (bounding.left - rootBounding.left) / rootBounding.width
        : (bounding.top - rootBounding.top) / rootBounding.height,
    );

    if (this._isRtl && scrollDirection === 'horizontal') {
      progress = 1 - progress;
    }

    return progress * maxInitialDelay;
  }

  /**
   * Registers an element for visibility observation.
   *
   * If the element has a `data-in-view-class` attribute, the specified class will be applied upon entering the viewport.
   *
   * @returns A function to stop observing the element.
   */
  @noopIfDestroyed
  public addElement(element: Element) {
    const finalElement = element as IInViewElement;
    finalElement.$vevetInViewBool = undefined;

    this._elements.push(finalElement);

    this._in?.observe(finalElement);
    this._out?.observe(finalElement);

    return () => this.removeElement(finalElement);
  }

  /**
   * Removes an element from observation, preventing further visibility tracking.
   */
  @noopIfDestroyed
  public removeElement(element: Element) {
    const finalElement = element as IInViewElement;

    this._in?.unobserve(finalElement);
    this._out?.unobserve(finalElement);

    this._elements = this._elements.filter((el) => el !== element);

    finalElement.$vevetInViewBool = undefined;
  }

  /**
   * Cleans up the module and disconnects all observers and listeners.
   */
  protected _destroy() {
    super._destroy();

    this._removeViewEvents();
  }
}
