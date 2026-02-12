import { Module, TModuleOnCallbacksProps } from '@/base';
import { initVevet } from '@/global/initVevet';
import { noopIfDestroyed } from '@/internal/noopIfDestroyed';
import { TRequiredProps } from '@/internal/requiredProps';
import { addEventListener, clampScope } from '@/utils';

import { MUTABLE_PROPS, STATIC_PROPS } from './props';
import {
  IScrollProgressBounds,
  IScrollProgressCallbacksMap,
  IScrollProgressMutableProps,
  IScrollProgressStaticProps,
} from './types';

export * from './types';

type TC = IScrollProgressCallbacksMap;
type TS = IScrollProgressStaticProps;
type TM = IScrollProgressMutableProps;

/**
 * `ScrollProgress` is a component that tracks the scroll progress of a specified section element.
 *
 * This component can be used for creating scroll-based animations such as parallax effects.
 *
 * [Documentation](https://vevetjs.com/docs/ScrollProgress)
 *
 * @group Components
 */
export class ScrollProgress extends Module<TC, TS, TM> {
  /** Retrieves the default static properties. */
  public _getStatic(): TRequiredProps<TS> {
    return { ...super._getStatic(), ...STATIC_PROPS };
  }

  /** Retrieves the default mutable properties. */
  public _getMutable(): TRequiredProps<TM> {
    return { ...super._getMutable(), ...MUTABLE_PROPS };
  }

  /** Indicates whether the section is currently visible within the viewport or root element. */
  private _isVisible = false;

  /** The bounds of the root element used for scroll calculations. */
  private _rootBounds: IScrollProgressBounds = {
    top: 0,
    left: 0,
    width: 1,
    height: 1,
  };

  /** The bounds of the section element relative to the root element. */
  private _sectionBounds: IScrollProgressBounds = {
    top: 0,
    left: 0,
    width: 1,
    height: 1,
  };

  constructor(
    props?: TS & TM,
    onCallbacks?: TModuleOnCallbacksProps<TC, ScrollProgress>,
  ) {
    super(props, onCallbacks as any);

    this._isVisible = !this.props.optimized;

    this._setup();
  }

  /**
   * Returns the section element being tracked for scroll progress.
   */
  get section() {
    return this.props.section;
  }

  /** Indicates whether the section is currently visible within the viewport or root element. */
  get isVisible() {
    return this._isVisible;
  }

  /** The bounds of the root element used for scroll calculations. */
  get rootBounds() {
    return this._rootBounds;
  }

  /** The bounds of the section element relative to the root element. */
  get sectionBounds() {
    return this._sectionBounds;
  }

  /** Sets up events */
  private _setup() {
    this._setupObserver();
    this._setupScroll();
  }

  /**
   * Sets up an `IntersectionObserver` to track the visibility of the section.
   */
  private _setupObserver() {
    if (!this.props.optimized) {
      // Initial Update
      this.update(true);

      return;
    }

    const { section } = this.props;

    // Initial Update
    const bounding = section.getBoundingClientRect();
    this._isVisible = bounding.top < window.innerHeight || bounding.bottom > 0;
    this.update(true);

    // Observer Update
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.target === section) {
          const isNowVisible = entry.isIntersecting;
          if (isNowVisible === this._isVisible) {
            return;
          }

          this._isVisible = entry.isIntersecting;
          this.update();
        }
      });
    });

    observer.observe(section);

    this.onDestroy(() => observer.disconnect());
  }

  /**
   * Sets up a scroll event listener to track and update progress.
   */
  private _setupScroll() {
    const container = this.props.root || window;

    const listener = addEventListener(
      container,
      'scroll',
      () => this.update(),
      { passive: false },
    );

    this.onDestroy(listener);
  }

  /** Updates the section and root bounds, and emits an update callback. */
  @noopIfDestroyed
  public update(isForce = false) {
    if (!this.isVisible && !isForce) {
      return;
    }

    const { section, props } = this;
    const container = props.root;
    const core = initVevet();

    const sectionBounding = section.getBoundingClientRect();

    const viewportBounds = {
      top: 0,
      left: 0,
      width: core.width,
      height: props.useSvh ? core.sHeight : core.height,
    };

    this._rootBounds = container
      ? container.getBoundingClientRect()
      : viewportBounds;

    this._sectionBounds = {
      top: sectionBounding.top - this._rootBounds.top,
      left: sectionBounding.left - this._rootBounds.left,
      width: sectionBounding.width,
      height: sectionBounding.height,
    };

    this.callbacks.emit('update', undefined);
  }

  /**
   * Calculates the section scroll progress relative to the root element.
   *
   * The function takes top or left corner of the section as the reference point.
   *
   * @param topThreshold - Top threshold of the section position.
   * @param rightThreshold - Right threshold of the section position.
   * @param bottomThreshold - Bottom threshold of the section position.
   * @param leftThreshold - Left threshold of the section position.
   * @returns The scroll progress along the x and y axes.
   *
   * @example
   *
   * const progress = getProgress(0, vevet.width, vevet.height / 2, 0)
   *
   * // `progress.y` is `0` when the top corner of the section is at the beginning of the viewport or root element
   * // `progress.y` is `1` when the top corner of the section is at the center of the viewport or root element
   */
  public getProgress(
    topThreshold: number,
    rightThreshold: number,
    bottomThreshold: number,
    leftThreshold: number,
  ) {
    const y = clampScope(this._sectionBounds.top, [
      topThreshold,
      bottomThreshold,
    ]);

    const x = clampScope(this._sectionBounds.left, [
      leftThreshold,
      rightThreshold,
    ]);

    return {
      x: Number.isNaN(x) ? 0 : x,
      y: Number.isNaN(y) ? 0 : y,
    };
  }

  /** Calculates the progress of the section entering the root element. */
  get inProgress() {
    const { rootBounds, sectionBounds } = this;

    const top = this.rootBounds.height;

    const right =
      sectionBounds.width > rootBounds.width
        ? 0
        : rootBounds.width - sectionBounds.width;

    const bottom =
      sectionBounds.height > rootBounds.height
        ? 0
        : rootBounds.height - sectionBounds.height;

    const left = this.rootBounds.width;

    return this.getProgress(top, right, bottom, left);
  }

  /** Calculates the progress of the section leaving the root element. */
  get outProgress() {
    const { rootBounds, sectionBounds } = this;

    const top = Math.min(rootBounds.height - sectionBounds.height, 0);
    const right = -sectionBounds.width;
    const bottom = -sectionBounds.height;
    const left = Math.min(rootBounds.width - sectionBounds.width, 0);

    return this.getProgress(top, right, bottom, left);
  }

  /** Calculates the progress of the section's movement within the root element. */
  get moveProgress() {
    const { rootBounds, sectionBounds } = this;

    const top =
      sectionBounds.height > rootBounds.height
        ? 0
        : rootBounds.height - sectionBounds.height;

    const right =
      sectionBounds.width > rootBounds.width
        ? -(sectionBounds.width - rootBounds.width)
        : 0;

    const bottom =
      sectionBounds.height > rootBounds.height
        ? -(sectionBounds.height - rootBounds.height)
        : 0;

    const left =
      sectionBounds.width > rootBounds.width
        ? 0
        : rootBounds.width - sectionBounds.width;

    return this.getProgress(top, right, bottom, left);
  }

  /** Calculates the global scroll progress of the section relative to the root element. */
  get progress() {
    const { sectionBounds, rootBounds } = this;

    const top = rootBounds.height;
    const right = -sectionBounds.width;
    const bottom = -sectionBounds.height;
    const left = rootBounds.width;

    return this.getProgress(top, right, bottom, left);
  }
}
