import { ModulePart } from '@/shared/ModulePart';
import { addEventListener } from '@/utils';

import type { Marquee } from '..';

/**
 * Gates marquee playback from hover and viewport visibility.
 *
 * Pauses on `mouseenter` when `pauseOnHover` is enabled and uses
 * `IntersectionObserver` to pause/play when `pauseOnOut` is enabled.
 *
 * @internal
 */
export class MarqueePlaybackGate extends ModulePart<Marquee> {
  constructor(
    parent: Marquee,
    private _onToggle: (bool: boolean) => void,
  ) {
    super(parent);

    const { container } = this.props;

    this.onDestroy(
      addEventListener(container, 'mouseenter', this._handleEnter.bind(this)),
    );

    this.onDestroy(
      addEventListener(container, 'mouseleave', this._handleLeave.bind(this)),
    );

    const intersection = new IntersectionObserver(
      this._handleIntersection.bind(this),
      { root: null },
    );

    intersection.observe(container);

    this.onDestroy(() => intersection.disconnect());
  }

  /** Pause while hovered when `pauseOnHover` is enabled. */
  private _handleEnter() {
    if (this.props.pauseOnHover) {
      this._pause();
    }
  }

  /** Resume after hover ends if playback is still allowed. */
  private _handleLeave() {
    this._requestPlay();
  }

  /** Pause/play when the marquee leaves or enters the viewport. */
  private _handleIntersection(entries: IntersectionObserverEntry[]) {
    if (!this.props.pauseOnOut) {
      return;
    }

    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        this._requestPlay();
      } else {
        this._pause();
      }
    });
  }

  /** Request playback through the parent-provided toggle callback. */
  private _requestPlay() {
    if (this.props.enabled) {
      this._onToggle(true);
    }
  }

  /** Pause playback through the parent-provided toggle callback. */
  private _pause() {
    this._onToggle(false);
  }
}
