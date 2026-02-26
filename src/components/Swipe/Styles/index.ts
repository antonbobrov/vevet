import { body } from '@/internal/env';

import { cursorStyles } from './styles';

import type { Swipe } from '..';

export class SwipeStyles {
  /** Styles */
  private _styles?: HTMLStyleElement;

  constructor(private _ctx: Swipe) {
    this._styles = cursorStyles?.cloneNode(true) as HTMLStyleElement;

    this.setInline();
  }

  /** Applies touch-action and cursor styles */
  public setInline() {
    const { props } = this._ctx;
    const { container, axis, enabled, grabCursor: hasGrabCursor } = props;
    const { style } = container;

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
    const swipe = this._ctx;

    if (swipe.props.grabCursor && this._styles) {
      body.append(this._styles);
    }
  }

  /** Remove styles */
  public remove() {
    this._styles?.remove();
  }
}
