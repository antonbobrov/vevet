import { Module, TModuleProps } from '@/base/Module';
import { body } from '@/internal/env';
import { noopIfDestroyed } from '@/internal/noopIfDestroyed';
import { TRequiredProps } from '@/internal/requiredProps';
import { isRtl } from '@/internal/textDirection';

import { InViewElement } from './Element';
import { InViewObservers } from './Observers';
import { MUTABLE_PROPS, STATIC_PROPS } from './props';
import {
  IInViewCallbacksMap,
  IInViewMutableProps,
  IInViewStaticProps,
} from './types';

export * from './types';
export * from './global';

type TC = IInViewCallbacksMap;
type TS = IInViewStaticProps;
type TM = IInViewMutableProps;

/**
 * Visibility detection via `IntersectionObserver`.
 *
 * - Monitors elements entering and optionally leaving the viewport
 * - Staggered initial delays via `maxInitialDelay` and element position
 * - Direction detection for scroll-aware animations
 * - Optional CSS classes via `data-in-view-class`
 *
 * Observation lifecycle
 *
 * The first pass uses zero `rootMargin` and `isInitialStart` semantics.
 * After the first enter batch, observers reconnect with `rootMargin`.
 *
 * [Documentation](https://vevetjs.com/docs/InView)
 *
 * @group Components
 */
export class InView extends Module<TC, TS, TM> {
  public _getStatic(): TRequiredProps<TS> {
    return { ...super._getStatic(), ...STATIC_PROPS };
  }

  public _getMutable(): TRequiredProps<TM> {
    return { ...super._getMutable(), ...MUTABLE_PROPS };
  }

  private _observers: InViewObservers;

  /** Registered elements. */
  private _elements: Map<Element, InViewElement> = new Map();

  /** Document `direction: rtl` — flips horizontal initial-delay progress. */
  private _rtl = false;

  constructor(props?: TModuleProps<TC, TS, TM, InView>) {
    super(props);

    this._rtl = isRtl(body);

    this._observers = new InViewObservers(
      this,
      this._handleInit.bind(this),
      this._handleIn.bind(this),
      this._handleOut.bind(this),
    );
  }

  /**
   * Whether the first observation pass is still active.
   *
   * Becomes `false` after the first enter batch is processed, before delayed
   * `in` callbacks fire. Prefer tracking initial vs scroll animations yourself
   * if you rely on staggered `maxInitialDelay`.
   */
  get isInitialStart() {
    return this._observers?.isStart ?? true;
  }

  /**
   * Whether the document uses `direction: rtl`.
   */
  get isRtl() {
    return this._rtl;
  }

  /** Elements currently registered via {@link addElement}. */
  get elements() {
    return Array.from(this._elements.keys());
  }

  protected _handleProps(props: TM) {
    super._handleProps(props);

    this._observers.setup();
  }

  /** Re-attaches all registered elements after observers reconnect. */
  private _handleInit() {
    this.elements.forEach((element) => this._observers.observe(element));
  }

  /**
   * Dispatches enter intersection entries to registered {@link InViewElement} instances.
   */
  private _handleIn(data: IntersectionObserverEntry[]) {
    data.forEach((entry) => {
      if (!entry.isIntersecting) {
        return;
      }

      const element = entry.target as Element;
      const target = this._elements.get(element);

      target?.toggle(true, this._observers.isStart);
    });
  }

  /**
   * Dispatches leave intersection entries to registered {@link InViewElement} instances.
   */
  private _handleOut(data: IntersectionObserverEntry[]) {
    data.forEach((entry) => {
      if (entry.isIntersecting) {
        return;
      }

      const element = entry.target as Element;
      const target = this._elements.get(element);

      target?.toggle(false);
    });
  }

  /**
   * Registers an element for visibility observation.
   *
   * When `data-in-view-class` is set, the matching class is toggled on enter/leave.
   *
   * @returns A function that calls {@link removeElement} for this element.
   */
  @noopIfDestroyed
  public addElement(element: Element) {
    this.removeElement(element);

    const instance = new InViewElement(this, element, () => {
      if (!this.props.hasOut) {
        this.removeElement(element);
      }
    });

    this._elements.set(element, instance);
    this._observers.observe(element);

    return () => this.removeElement(element);
  }

  /** Stops observing an element and clears its in-view flag. */
  @noopIfDestroyed
  public removeElement(element: Element) {
    this._observers.unobserve(element);

    const target = this._elements.get(element);
    target?.destroy();

    this._elements.delete(element);
  }

  /** Disconnects observers and clears the element registry. */
  protected _destroy() {
    super._destroy();

    this._elements.forEach((element) => element.destroy());
    this._elements.clear();
  }
}
