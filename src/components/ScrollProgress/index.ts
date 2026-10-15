import { Module } from '@/base/Module';
import { TModuleProps } from '@/base/Module/types';
import { initVevet } from '@/global/initVevet';
import { noopIfDestroyed, TRequiredProps } from '@/internal';
import { addEventListener, clampScope } from '@/utils';

import { MUTABLE_PROPS, STATIC_PROPS } from './props';
import {
  IScrollProgressBounds,
  IScrollProgressCallbacksMap,
  IScrollProgressMutableProps,
  IScrollProgressStaticProps,
} from './types';

type TC = IScrollProgressCallbacksMap;
type TS = IScrollProgressStaticProps;
type TM = IScrollProgressMutableProps;

/**
 * Tracks scroll progress of a section relative to the viewport or a scroll root.
 *
 * - Emits `update` on scroll (and optionally only while the section is visible)
 * - Exposes `inProgress`, `outProgress`, `moveProgress`, and `progress`
 * - Supports a custom scroll container via `root` and optional `useSvh` height
 *
 * [Documentation](https://vevetjs.com/docs/ScrollProgress)
 *
 * @group Components
 */
export class ScrollProgress extends Module<TC, TS, TM> {
  public _getStatic(): TRequiredProps<TS> {
    return { ...super._getStatic(), ...STATIC_PROPS };
  }

  public _getMutable(): TRequiredProps<TM> {
    return { ...super._getMutable(), ...MUTABLE_PROPS };
  }

  private _isVisible = false;

  private _rootBounds: IScrollProgressBounds = {
    top: 0,
    left: 0,
    width: 1,
    height: 1,
  };

  private _sectionBounds: IScrollProgressBounds = {
    top: 0,
    left: 0,
    width: 1,
    height: 1,
  };

  constructor(props?: TModuleProps<TC, TS, TM, ScrollProgress>) {
    super(props);

    this._isVisible = !this.props.optimized;

    this._setup();
  }

  /** Section element whose progress is tracked. */
  get section() {
    return this.props.section;
  }

  /** Whether the section is currently considered visible (`optimized` mode). */
  get isVisible() {
    return this._isVisible;
  }

  /** Root bounds used for progress math (viewport or `root` element). */
  get rootBounds() {
    return this._rootBounds;
  }

  /** Section bounds relative to {@link rootBounds}. */
  get sectionBounds() {
    return this._sectionBounds;
  }

  private _setup() {
    this._setupObserver();
    this._setupScroll();
  }

  /**
   * When `optimized` is enabled, toggles updates via `IntersectionObserver`.
   * Otherwise runs an initial forced {@link update}.
   */
  private _setupObserver() {
    if (!this.props.optimized) {
      this.update(true);

      return;
    }

    const { section } = this.props;

    const bounding = section.getBoundingClientRect();
    this._isVisible = bounding.top < window.innerHeight || bounding.bottom > 0;
    this.update(true);

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

  /** Listens to scroll on `root` or `window`. */
  private _setupScroll() {
    const listener = addEventListener(
      this.props.root || window,
      'scroll',
      () => this.update(),
      { passive: false },
    );

    this.onDestroy(listener);
  }

  /**
   * Refreshes root/section bounds and emits `update`.
   *
   * @param isForce - When `true`, updates even if the section is not visible.
   */
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
   * Progress of the section's top/left corner between the given thresholds.
   *
   * @param topThreshold - Y start threshold.
   * @param rightThreshold - X end threshold.
   * @param bottomThreshold - Y end threshold.
   * @param leftThreshold - X start threshold.
   * @returns Progress along `x` and `y`.
   *
   * @example
   * const progress = getProgress(0, vevet.width, vevet.height / 2, 0)
   * // progress.y is 0 at the start of the root, 1 at the vertical midpoint
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

  /** Progress while the section is entering the root. */
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

  /** Progress while the section is leaving the root. */
  get outProgress() {
    const { rootBounds, sectionBounds } = this;

    const top = Math.min(rootBounds.height - sectionBounds.height, 0);
    const right = -sectionBounds.width;
    const bottom = -sectionBounds.height;
    const left = Math.min(rootBounds.width - sectionBounds.width, 0);

    return this.getProgress(top, right, bottom, left);
  }

  /** Progress while the section moves through the root (pin-like range). */
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

  /** Full travel progress from entering to fully leaving the root. */
  get progress() {
    const { sectionBounds, rootBounds } = this;

    const top = rootBounds.height;
    const right = -sectionBounds.width;
    const bottom = -sectionBounds.height;
    const left = rootBounds.width;

    return this.getProgress(top, right, bottom, left);
  }
}
