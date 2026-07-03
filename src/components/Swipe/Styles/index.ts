import { body } from '@/internal/env';
import { ModulePart } from '@/shared/ModulePart';

import { swipeStyles } from './styles';

import type { Swipe } from '..';

/**
 * Inline `touch-action` and grab-cursor styles for the swipe target.
 *
 * @internal
 */
export class SwipeStyles extends ModulePart<Swipe> {
  private _styles?: HTMLStyleElement;

  constructor(parent: Swipe) {
    super(parent);

    this._styles = swipeStyles?.cloneNode(true) as HTMLStyleElement;

    this.setInline();

    this.onDestroy(() => this.remove());
  }

  /** Applies touch-action and cursor styles */
  public setInline() {
    const { props } = this;

    const target = props.thumb || props.container;

    const { axis, enabled, grabCursor: hasGrabCursor } = props;
    const { style } = target;

    const cursor = enabled && hasGrabCursor ? 'grab' : '';

    let touchAction = 'none';
    if (axis === 'x') {
      touchAction = 'pan-y';
    } else if (axis === 'y') {
      touchAction = 'pan-x';
    }

    style.cursor = cursor;
    style.touchAction = touchAction;
  }

  /** Appends styles */
  public append() {
    const { props } = this;

    if (props.grabCursor && this._styles) {
      body.append(this._styles);
    }
  }

  /** Remove styles */
  public remove() {
    this._styles?.remove();
  }
}
