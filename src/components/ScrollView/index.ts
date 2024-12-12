import { Component as ComponentClass } from '@/base/Component';
import { NScrollView } from './types';
import { isIntersectionObserverSupported } from '@/utils/listeners';
import { clamp } from '@/utils/math';
import { normalizedTimeoutCallback } from '@/utils/common';
import { getApp } from '@/utils/internal/getApp';

export type { NScrollView };

/**
 * `ScrollView` detects when elements enter or leave the viewport.
 * It uses the `IntersectionObserver` API for efficient detection and triggers events when elements are visible or hidden.
 * Supports adding custom delay and class toggling when elements are in view.
 *
 * @link See examples https://antonbobrov.github.io/vevet-demo/scroll-view/
 *
 * @link See docs https://antonbobrov.github.io/vevet/classes/ScrollView.html
 */
export class ScrollView<
  StaticProps extends NScrollView.IStaticProps = NScrollView.IStaticProps,
  ChangeableProps extends
    NScrollView.IChangeableProps = NScrollView.IChangeableProps,
  CallbacksTypes extends
    NScrollView.ICallbacksTypes = NScrollView.ICallbacksTypes,
> extends ComponentClass<StaticProps, ChangeableProps, CallbacksTypes> {
  protected _getDefaultProps() {
    return {
      ...super._getDefaultProps(),
      intersectionRoot: null,
      isEnabled: true,
      rootMargin: 0.05,
      states: 'in',
      classToToggle: 'viewed',
      hasDelay: true,
      maxDelay: 1000,
      direction: 'vertical',
      viewportTarget: 'any',
      resizeDebounce: 0,
    };
  }

  /**
   * Intersection observer for detecting when elements come into view.
   */
  protected _intersectionObserverIn?: IntersectionObserver;

  /**
   * Intersection observer for detecting when elements leave the view.
   */
  protected _intersectionObserverOut?: IntersectionObserver;

  /**
   * Tracks if this is the first time the elements are being observed.
   */
  protected _isFirstStart: boolean;

  /**
   * Returns whether this is the first start of observing elements.
   */
  get isFirstStart() {
    return this._isFirstStart;
  }

  /**
   * Stores the elements being observed for entering and leaving the viewport.
   */
  protected _elements: NScrollView.IElement[];

  /**
   * Returns the elements being observed by the `ScrollView`.
   */
  get elements() {
    return this._elements;
  }

  constructor(initialProps?: StaticProps & ChangeableProps, canInit = true) {
    super(initialProps, false);

    this._isFirstStart = true;
    this._elements = [];

    // initialize the class if requested
    if (canInit) {
      this.init();
    }
  }

  protected _init() {
    super._init();

    this._setEvents();
  }

  protected _onPropsMutate() {
    super._onPropsMutate();

    this.resize();
  }

  /**
   * Sets up the events needed for viewport resizing and element observation.
   */
  protected _setEvents() {
    const { viewportTarget, resizeDebounce } = this.props;

    this.resize();

    // Set up a viewport callback to trigger the resize method
    this.onViewport(viewportTarget, () => this.resize(), {
      timeout: resizeDebounce,
    });
  }

  /**
   * Triggers a resize event to update the `ScrollView` tracking of elements.
   */
  public resize() {
    this._removeViewEvents();

    if (this.props.isEnabled) {
      this._setViewEvents();
    }
  }

  /**
   * Returns the bounding rectangle for the root element or the viewport.
   */
  protected get rootBounding() {
    const { props } = this;

    if (props.intersectionRoot) {
      const bounding = props.intersectionRoot.getBoundingClientRect();

      return {
        top: bounding.top,
        left: bounding.left,
        width: bounding.width,
        height: bounding.height,
      };
    }

    const app = getApp();

    return {
      top: 0,
      left: 0,
      width: app.width,
      height: app.height,
    };
  }

  /**
   * Sets up the `IntersectionObserver` to detect when elements come into view.
   */
  protected _setViewEvents() {
    if (!isIntersectionObserverSupported()) {
      return;
    }

    const { rootBounding, isFirstStart, props } = this;

    // Calculate margins for intersection detection
    const xMargin = isFirstStart
      ? 0
      : rootBounding.width * props.rootMargin * -1;

    const yMargin = isFirstStart
      ? 0
      : rootBounding.height * props.rootMargin * -1;

    this._intersectionObserverIn = new IntersectionObserver(
      (data) => this._handleIntersectionIn(data),
      {
        root: props.intersectionRoot,
        threshold: 0,
        rootMargin: `0px ${xMargin}px ${yMargin}px 0px`,
      },
    );

    this.elements.forEach((element) =>
      this._intersectionObserverIn?.observe(element),
    );

    if (props.states === 'inout') {
      this._intersectionObserverOut = new IntersectionObserver(
        (data) => this._handleIntersectionOut(data),
        {
          root: props.intersectionRoot,
          threshold: 0,
          rootMargin: '0px 0px 0px 0px',
        },
      );

      this.elements.forEach((element) =>
        this._intersectionObserverOut?.observe(element),
      );
    }
  }

  /**
   * Removes the view observation events by disconnecting the `IntersectionObserver`.
   */
  protected _removeViewEvents() {
    this._intersectionObserverIn?.disconnect();
    this._intersectionObserverIn = undefined;

    this._intersectionObserverOut?.disconnect();
    this._intersectionObserverOut = undefined;
  }

  /**
   * Handles when elements come into the viewport.
   *
   * @param data - The intersection data for the observed elements.
   */
  protected _handleIntersectionIn(data: IntersectionObserverEntry[]) {
    data.forEach((entry) => {
      if (!entry.isIntersecting) {
        return;
      }

      const element = entry.target;
      const delay = this._getElementDelay(element);

      this._handleInOut(element, true, delay);

      if (this.props.states === 'in') {
        this.removeElement(element);
      }
    });

    // Mark first start complete and trigger resize
    if (this.isFirstStart) {
      this._isFirstStart = false;
      this.resize();
    }
  }

  /** Get element delay */
  protected _getElementDelay(element: NScrollView.IElement) {
    const { isFirstStart, props } = this;
    const rootBounding = isFirstStart ? this.rootBounding : false;

    if (!isFirstStart || !rootBounding || !props.hasDelay) {
      return 0;
    }

    const bounding = element.getBoundingClientRect();

    const progress = clamp(
      props.direction === 'horizontal'
        ? (bounding.left - rootBounding.left) / rootBounding.width
        : (bounding.top - rootBounding.top) / rootBounding.height,
      [0, 1],
    );

    return progress * props.maxDelay;
  }

  /**
   * Handles when elements leave the viewport.
   *
   * @param data - The intersection data for the observed elements.
   */
  protected _handleIntersectionOut(data: IntersectionObserverEntry[]) {
    data.forEach((entry) => {
      if (entry.isIntersecting) {
        return;
      }

      const element = entry.target;
      this._handleInOut(element, false);
    });
  }

  /**
   * Toggles classes and triggers callbacks when elements enter or leave the viewport.
   */
  protected _handleInOut(
    elementProp: NScrollView.IElement,
    isInViewport: boolean,
    delay = 0,
  ) {
    const { classToToggle } = this.props;
    const element = elementProp;

    if (
      (element.isScrollViewIn && isInViewport) ||
      (!element.isScrollViewIn && !isInViewport)
    ) {
      return;
    }

    // Update element's viewport state
    element.isScrollViewIn = isInViewport;

    // Toggle class for the element
    if (classToToggle) {
      normalizedTimeoutCallback(() => {
        element.classList.toggle(classToToggle, isInViewport);
      }, delay);
    }

    // Trigger appropriate callback
    if (isInViewport) {
      normalizedTimeoutCallback(() => {
        this.callbacks.tbt('in', { element });
      }, delay);
    } else {
      normalizedTimeoutCallback(() => {
        this.callbacks.tbt('out', { element });
      }, delay);
    }
  }

  /**
   * Adds an element to the observer list and starts tracking its visibility in the viewport.
   */
  public addElement(elementProp: Element) {
    const element = elementProp as NScrollView.IElement;

    element.isScrollViewIn = undefined;

    if (isIntersectionObserverSupported()) {
      this._elements.push(element);

      this._intersectionObserverIn?.observe(element);
      this._intersectionObserverOut?.observe(element);
    } else {
      this._handleInOut(element, true);
    }

    return () => this.removeElement(element);
  }

  /**
   * Stops observing an element and removes it from the observer list.
   *
   * @param {Element} elementProp - The element to stop observing.
   */
  public removeElement(elementProp: Element) {
    const element = elementProp as NScrollView.IElement;

    this._intersectionObserverIn?.unobserve(element);
    this._intersectionObserverOut?.unobserve(element);
    element.isScrollViewIn = undefined;

    this._elements = this._elements.filter((el) => el !== element);
  }

  /**
   * Stops observing all elements and clears the observer list.
   */
  public removeElements() {
    this._elements.forEach((element) => this.removeElement(element));
    this._elements = [];
  }

  /**
   * Destroys the `ScrollView` and disconnects all observers and listeners.
   */
  protected _destroy() {
    super._destroy();

    this._removeViewEvents();
  }
}
