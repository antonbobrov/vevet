import { initVevet } from '@/global/initVevet';
import { cnToggle, ModulePart } from '@/internal';
import { clamp } from '@/utils';

import { InView } from '..';
import { TInViewElementDirection } from '../global';

/**
 * Per-element visibility state: stagger delay, direction, and `data-in-view-class`.
 *
 * `toggle(true)` schedules a delayed `in` on the first pass; `toggle(false)` emits `out`.
 * Pending timeouts are cleared on destroy.
 *
 * @internal
 */
export class InViewElement extends ModulePart<InView> {
  private _isIn = false;

  private _timeout?: NodeJS.Timeout;

  constructor(
    parent: InView,
    private _element: Element,
    /** Called after a successful `in` emit (e.g. one-shot unobserve). */
    private _onIn: () => void,
  ) {
    super(parent);

    this.onDestroy(() => this._clearTimeout());
  }

  private _clearTimeout() {
    if (this._timeout) {
      clearTimeout(this._timeout);
      this._timeout = undefined;
    }
  }

  /**
   * Schedules enter/leave handling.
   *
   * @param init — when `true` on enter, applies position-based stagger from `maxInitialDelay`
   */
  public toggle(bool: boolean, init?: boolean) {
    if (bool === this._isIn) {
      return;
    }

    this._isIn = bool;
    this._clearTimeout();

    const delay = init && bool ? this._getDelay() : 0;
    this._timeout = setTimeout(() => this._handleInOut(bool, init), delay);
  }

  /** Position-based stagger for the initial observation pass. */
  private _getDelay() {
    const app = initVevet();

    const { scrollDirection, maxInitialDelay } = this.props;
    const { isRtl } = this.parent;

    if (maxInitialDelay <= 0) {
      return 0;
    }

    const bounding = this._element.getBoundingClientRect();

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

    if (isRtl && scrollDirection === 'horizontal') {
      progress = 1 - progress;
    }

    return progress * maxInitialDelay;
  }

  private _handleInOut(bool: boolean, init?: boolean) {
    const direction = this._getDirection(bool, init);

    this._toggleClass(bool, direction);

    this.callbacks.emit(bool ? 'in' : 'out', {
      element: this._element,
      direction,
    });

    if (bool) {
      this._onIn();
    }
  }

  /** Resolves enter/leave direction from viewport geometry. */
  private _getDirection(bool: boolean, init?: boolean) {
    const app = initVevet();
    const bounding = this._element.getBoundingClientRect();

    if (this.props.scrollDirection === 'horizontal') {
      let direction: TInViewElementDirection = 'fromRight';

      if ((bool && !init) || !bool) {
        if (bounding.left > app.width / 2) {
          direction = 'fromRight';
        } else if (bounding.right < app.width / 2) {
          direction = 'fromLeft';
        }
      }

      return direction;
    }

    let direction: TInViewElementDirection = 'fromBottom';

    if ((bool && !init) || !bool) {
      if (bounding.top > app.height / 2) {
        direction = 'fromBottom';
      } else if (bounding.bottom < app.height / 2) {
        direction = 'fromTop';
      }
    }

    return direction;
  }

  private _toggleClass(bool: boolean, direction: TInViewElementDirection) {
    const element = this._element;

    const classes = element.getAttribute('data-in-view-class');
    if (!classes) {
      return;
    }

    const split = classes.split('|');
    const direct = split[0].trim();
    const reverse = split[1]?.trim() || direct;

    if (!direct) {
      return;
    }

    if (bool) {
      const isReverse = direction === 'fromRight' || direction === 'fromTop';
      const className = isReverse ? reverse.trim() : direct.trim();

      cnToggle(element, className, bool);

      return;
    }

    cnToggle(element, direct, bool);
    cnToggle(element, reverse, bool);
  }
}
