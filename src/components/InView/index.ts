import { TRequiredProps } from '@/internal/requiredProps';
import { clamp } from '@/utils/math';
import {
  IInViewCallbacksMap,
  IInViewElement,
  IInViewMutableProps,
  IInViewStaticProps,
  TInViewElementDirection,
} from './types';
import { Module, TModuleOnCallbacksProps } from '@/base/Module';
import { initVevet } from '@/global/initVevet';
import { noopIfDestroyed } from '@/internal/noopIfDestroyed';
import { cnToggle } from '@/internal/cn';
import { getTextDirection } from '@/internal/textDirection';
import { body } from '@/internal/env';

export * from './types';

/**
 * InView is a visibility detection utility that leverages the `IntersectionObserver` API to monitor when elements enter or leave the viewport.
 * It provides customizable options for triggering events, delaying visibility changes, and dynamically adding CSS classes to elements based on their visibility state.
 *
 * [Documentation](https://vevetjs.com/docs/InView)
 *
 * @group Components
 */
export class InView<
  C extends IInViewCallbacksMap = IInViewCallbacksMap,
  S extends IInViewStaticProps = IInViewStaticProps,
  M extends IInViewMutableProps = IInViewMutableProps,
> extends Module<C, S, M> {
  /**
   * Returns default static properties.
   */
  public _getStatic(): TRequiredProps<S> {
    return {
      ...super._getStatic(),
      hasOut: true,
      maxInitialDelay: 1000,
      scrollDirection: 'vertical',
    } as TRequiredProps<S>;
  }

  /**
   * Returns default mutable properties.
   */
  public _getMutable(): TRequiredProps<M> {
    return {
      ...super._getMutable(),
      enabled: true,
      rootMargin: '0% 0% -5% 0%',
    } as TRequiredProps<M>;
  }

  /** Intersection observer for detecting elements entering the viewport. */
  protected _observerIn?: IntersectionObserver;

  /** Intersection observer for detecting elements leaving the viewport. */
  protected _observerOut?: IntersectionObserver;

  /** Tracks whether this is the first time the elements are being observed. */
  protected _isInitialStart = true;

  /**
   * Indicates whether the observation has started for the first time.
   */
  get isInitialStart() {
    return this._isInitialStart;
  }

  /** Stores the elements being observed. */
  protected _elements: IInViewElement[] = [];

  /**
   * Returns all elements currently being observed.
   */
  get elements() {
    return this._elements;
  }

  /** Detects if the container is RTL */
  protected _isRtl = false;

  /**
   * Initializes the `InView` module.
   */
  constructor(
    props?: S & M,
    onCallbacks?: TModuleOnCallbacksProps<C, InView<C, S, M>>,
  ) {
    super(props, onCallbacks as any);

    // get direction
    this._isRtl = getTextDirection(body) === 'rtl';

    this._setup();
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
  protected _setup() {
    this._removeViewEvents();

    if (this.props.enabled) {
      this._setViewEvents();
    }
  }

  /**
   * Removes all observation events and disconnects observers.
   */
  protected _removeViewEvents() {
    this._observerIn?.disconnect();
    this._observerIn = undefined;

    this._observerOut?.disconnect();
    this._observerOut = undefined;
  }

  /**
   * Sets up `IntersectionObserver` instances to detect visibility changes.
   */
  protected _setViewEvents() {
    const { isInitialStart, props } = this;
    const rootMargin = isInitialStart ? '0% 0% 0% 0%' : props.rootMargin;

    this._observerIn = new IntersectionObserver(
      (data) => this._handleIn(data, isInitialStart),
      { root: null, threshold: 0, rootMargin },
    );

    this.elements.forEach((element) => this._observerIn?.observe(element));

    if (props.hasOut) {
      this._observerOut = new IntersectionObserver(
        (data) => this._handleOut(data),
        { root: null, threshold: 0, rootMargin: '0px 0px 0px 0px' },
      );

      this.elements.forEach((element) => this._observerOut?.observe(element));
    }
  }

  /**
   * Handles elements entering the viewport.
   */
  protected _handleIn(
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
      }

      element.$vevetInViewTimeout = setTimeout(
        () => this._handleInOut(entry, true, isInitialStart),
        this._getElementDelay(element),
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
  protected _handleOut(data: IntersectionObserverEntry[]) {
    data.forEach((entry) => {
      const element = entry.target as IInViewElement;

      if (entry.isIntersecting || !element.$vevetInViewBool) {
        return;
      }

      element.$vevetInViewBool = false;

      if (element.$vevetInViewTimeout) {
        clearTimeout(element.$vevetInViewTimeout);
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
  protected _handleInOut(
    entry: IntersectionObserverEntry,
    isInView: boolean,
    isInitialStart = false,
  ) {
    const element = entry.target as IInViewElement;

    const className = element.getAttribute('data-in-view-class');
    const direction = this._getElementDirection(
      entry,
      isInView,
      isInitialStart,
    );

    if (className) {
      cnToggle(element, className, isInView);
    }

    this.callbacks.emit(isInView ? 'in' : 'out', { element, direction });
  }

  protected _getElementDirection(
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
  protected _getElementDelay(element: IInViewElement) {
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

    this._observerIn?.observe(finalElement);
    this._observerOut?.observe(finalElement);

    return () => this.removeElement(finalElement);
  }

  /**
   * Removes an element from observation, preventing further visibility tracking.
   */
  @noopIfDestroyed
  public removeElement(element: Element) {
    const finalElement = element as IInViewElement;

    this._observerIn?.unobserve(finalElement);
    this._observerOut?.unobserve(finalElement);

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
