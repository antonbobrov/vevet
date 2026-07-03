import { ModulePart } from '@/shared/ModulePart';

import { InView } from '..';

/**
 * Enter/leave `IntersectionObserver` instances and the initial observation pass.
 *
 * - **Enter** — `rootMargin` is zero on the first pass, then follows `props.rootMargin`
 * - **Leave** — zero margin when `hasOut` is true
 *
 * After the first enter batch, `_isStart` becomes `false` and observers reconnect.
 *
 * @internal
 */
export class InViewObservers extends ModulePart<InView> {
  private _in?: IntersectionObserver;

  private _out?: IntersectionObserver;

  /** Whether the zero-`rootMargin` initial pass is still active. */
  private _isStart = true;

  constructor(
    parent: InView,
    private _onInit: () => void,
    private _handleIn: (entries: IntersectionObserverEntry[]) => void,
    private _handleOut: (entries: IntersectionObserverEntry[]) => void,
  ) {
    super(parent);

    this.setup();
    this.onDestroy(() => this.clear());
  }

  /** Mirrors public {@link InView.isInitialStart}. */
  get isStart() {
    return this._isStart;
  }

  /** Reconnects observers when props or the initial pass state changes. */
  public setup() {
    this.clear();

    if (this.props.enabled) {
      this._setEvents();
    }
  }

  /** Disconnects both intersection observers. */
  public clear() {
    this._in?.disconnect();
    this._in = undefined;

    this._out?.disconnect();
    this._out = undefined;
  }

  private _setEvents() {
    const { props } = this.parent;
    const rootMargin = this._isStart ? '0% 0% 0% 0%' : props.rootMargin;

    this._in = new IntersectionObserver(
      (data) => {
        this._handleIn(data);

        if (this._isStart) {
          this._isStart = false;
          this.setup();
        }
      },
      {
        root: null,
        threshold: 0,
        rootMargin,
      },
    );

    if (props.hasOut) {
      this._out = new IntersectionObserver((data) => this._handleOut(data), {
        root: null,
        threshold: 0,
        rootMargin: '0px 0px 0px 0px',
      });
    }

    this._onInit();
  }

  public observe(element: Element) {
    this._in?.observe(element);
    this._out?.observe(element);
  }

  public unobserve(element: Element) {
    this._in?.unobserve(element);
    this._out?.unobserve(element);
  }
}
