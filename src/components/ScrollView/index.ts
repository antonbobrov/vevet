import { Component as ComponentClass } from '@/base/Component';
import { NScrollView } from './types';
import { isIntersectionObserverSupported } from '@/utils/listeners';
import { clamp } from '@/utils/math';
import { normalizedTimeoutCallback } from '@/utils/common';
import { IRemovable } from '@/types/general';
import { getApp } from '@/utils/internal/getApp';

export type { NScrollView };

/**
 * Detect when elements enter or leave the viewport
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

  /** Intersection observer - type IN */
  protected _intersectionObserverIn?: IntersectionObserver;

  /** Intersection observer - type OUT */
  protected _intersectionObserverOut?: IntersectionObserver;

  /** If first start */
  protected _isFirstStart: boolean;

  /** If first start */
  get isFirstStart() {
    return this._isFirstStart;
  }

  /** Elements */
  protected _elements: NScrollView.IElement[];

  /** If intersection observer is supported */
  protected _isIntersectionObserverSupported: boolean;

  /** Elements */
  get elements() {
    return this._elements;
  }

  constructor(initialProps?: StaticProps & ChangeableProps, canInit = true) {
    super(initialProps, false);

    this._isFirstStart = true;
    this._elements = [];
    this._isIntersectionObserverSupported = isIntersectionObserverSupported();

    // initialize the class
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

  /** Set class events */
  protected _setEvents() {
    const { viewportTarget, resizeDebounce } = this.props;

    this.resize();

    this.addViewportCallback(viewportTarget, () => this.resize(), {
      timeout: resizeDebounce,
    });
  }

  /** Resize the scene */
  public resize() {
    this._removeViewEvents();

    if (this.props.isEnabled) {
      this._setViewEvents();
    }
  }

  /** Root bounding rect */
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

    const { viewport } = getApp();

    return {
      top: 0,
      left: 0,
      width: viewport.width,
      height: viewport.height,
    };
  }

  /** Set view events */
  protected _setViewEvents() {
    if (!this._isIntersectionObserverSupported) {
      return;
    }

    const { rootBounding, isFirstStart, props } = this;

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

  /** Remove View events */
  protected _removeViewEvents() {
    this._intersectionObserverIn?.disconnect();
    this._intersectionObserverIn = undefined;

    this._intersectionObserverOut?.disconnect();
    this._intersectionObserverOut = undefined;
  }

  /** Event on IntersectionObserver In */
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

    // change states
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

  /** Event on IntersectionObserver Out */
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
   * Event that is triggered when an element appears or disappears
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

    // update props
    element.isScrollViewIn = isInViewport;

    // toggle classes
    if (classToToggle) {
      normalizedTimeoutCallback(() => {
        element.classList.toggle(classToToggle, isInViewport);
      }, delay);
    }

    // process callbacks
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

  /** Add an element */
  public addElement(elementProp: Element): IRemovable {
    const element = elementProp as NScrollView.IElement;

    element.isScrollViewIn = undefined;

    if (this._isIntersectionObserverSupported) {
      this._elements.push(element);

      this._intersectionObserverIn?.observe(element);
      this._intersectionObserverOut?.observe(element);
    } else {
      this._handleInOut(element, true);
    }

    return {
      remove: () => this.removeElement(element),
    };
  }

  /** Remove an element */
  public removeElement(elementProp: Element) {
    const element = elementProp as NScrollView.IElement;

    this._intersectionObserverIn?.unobserve(element);
    this._intersectionObserverOut?.unobserve(element);
    element.isScrollViewIn = undefined;

    this._elements = this._elements.filter((el) => el !== element);
  }

  /** Remove all elements */
  public removeElements() {
    this._elements.forEach((element) => this.removeElement(element));
    this._elements = [];
  }

  /** Destroy the module */
  protected _destroy() {
    super._destroy();

    this._removeViewEvents();
  }
}
