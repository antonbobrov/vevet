import { ModulePart } from '@/internal';

import type { Swipe } from '..';

/**
 * Inline `touch-action` and grab-cursor styles for the swipe target.
 *
 * @internal
 */
export class SwipeStyles extends ModulePart<Swipe> {
  constructor(parent: Swipe) {
    super(parent);

    this.setInline();

    this.onDestroy(() => this.remove());
  }

  private get target() {
    return this.props.thumb || this.props.container;
  }

  private get canGrab() {
    return this.props.enabled && this.props.grabCursor;
  }

  /** Applies touch-action and cursor styles */
  public setInline() {
    const { props, target, canGrab } = this;
    const { axis } = props;

    const cursor = canGrab ? 'grab' : '';

    let touchAction = 'none';
    if (axis === 'x') {
      touchAction = 'pan-y';
    } else if (axis === 'y') {
      touchAction = 'pan-x';
    }

    target.style.cursor = cursor;
    target.style.touchAction = touchAction;
  }

  /** Appends styles */
  public append() {
    const { props, target } = this;

    if (props.grabCursor) {
      target.style.cursor = 'grabbing';
    }
  }

  /** Remove styles */
  public remove() {
    const { props, target } = this;

    if (props.grabCursor) {
      target.style.cursor = 'grab';
    }
  }
}
