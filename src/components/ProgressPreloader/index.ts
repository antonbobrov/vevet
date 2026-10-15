import { TModuleProps } from '@/base/Module/types';
import { initVevet } from '@/global/initVevet';
import { doc, noopIfDestroyed, TRequiredProps } from '@/internal';
import { clamp } from '@/utils/math';

import { Preloader } from '../Preloader';
import { Raf } from '../Raf';
import { Timeline } from '../Timeline';

import { MUTABLE_PROPS, STATIC_PROPS } from './props';
import { ProgressPreloaderResources } from './Resources';
import {
  IProgressPreloaderCallbacksMap,
  IProgressPreloaderMutableProps,
  IProgressPreloaderStaticProps,
} from './types';

type TC = IProgressPreloaderCallbacksMap;
type TS = IProgressPreloaderStaticProps;
type TM = IProgressPreloaderMutableProps;

/**
 * Resource-aware page preloader with smooth progress display.
 *
 * - Tracks weighted resources (images, videos, DOM custom elements, virtual ids)
 * - Exposes raw `loadProgress` and smoothed `progress` for UI
 * - Inherits {@link Preloader} hide lifecycle after `loaded`
 *
 * Progress pipeline
 *
 * `resolveResource` → weighted `loadProgress` → {@link Raf} damp (`lerp`) →
 * `progress` → optional {@link Timeline} finish (`endDuration`) → `loaded`.
 *
 * [Documentation](https://vevetjs.com/docs/ProgressPreloader)
 *
 * @group Components
 */
export class ProgressPreloader extends Preloader<TC, TS, TM> {
  public _getStatic(): TRequiredProps<TS> {
    return { ...super._getStatic(), ...STATIC_PROPS };
  }

  public _getMutable(): TRequiredProps<TM> {
    return { ...super._getMutable(), ...MUTABLE_PROPS };
  }

  private _resources: ProgressPreloaderResources;

  /** Smoothed progress in the `0–1` range (UI value). */
  private _progress = 0;

  private _raf?: Raf | null;

  constructor(props?: TModuleProps<TC, TS, TM, ProgressPreloader>) {
    super(props as any);

    this._resources = new ProgressPreloaderResources(
      this,
      this.resourceContainer,
      (resource) => this._emit('resource', resource),
    );

    this._raf = new Raf({ enabled: true });
    this._raf.on('frame', () => this._handleUpdate());

    this.onDestroy(initVevet().onLoad(() => this._resources.resolveInitial()));
  }

  /** DOM root for scanning images, videos, and {@link IProgressPreloaderStaticProps.customSelector}. */
  get resourceContainer() {
    return this.props.resourceContainer ?? doc;
  }

  /** All tracked resources (DOM elements and virtual ids). */
  get resources() {
    return this._resources.items;
  }

  /** Sum of all resource `weight` values. */
  get totalWeight() {
    return this._resources.totalWeight;
  }

  /** Sum of all resource `loaded` values. */
  get loadedWeight() {
    return this._resources.loadedWeight;
  }

  /**
   * Actual weighted progress (`0–1`), not interpolated.
   *
   * Updates immediately when a resource resolves.
   */
  get loadProgress() {
    return this.loadedWeight / this.totalWeight;
  }

  /**
   * Smoothed progress (`0–1`) for UI animations.
   *
   * Follows `loadProgress` via {@link Raf.damp} using `lerp`.
   * {@link Preloader.loaded} waits for `progress >= 1`, not `loadProgress`.
   */
  get progress() {
    return this._progress;
  }

  /**
   * Registers a virtual resource by id.
   */
  @noopIfDestroyed
  public addResource(id: Element | string, weight = 1) {
    this._resources.add(id, weight);
  }

  /**
   * Updates loaded weight for a resource and emits {@link IProgressPreloaderCallbacksMap.resource}.
   *
   * For custom DOM elements, call as `data-loaded` changes (or use partial weights).
   */
  @noopIfDestroyed
  public resolveResource(id: Element | string, loadedWeight?: number) {
    this._resources.resolve(id, loadedWeight);
  }

  /** Damps `progress` toward `loadProgress` each frame; starts end timeline at `loadProgress >= 1`. */
  @noopIfDestroyed
  private _handleUpdate() {
    if (!this._raf) {
      return;
    }

    const ease = clamp(Math.abs(this.props.lerp));
    const newProgress = this._raf.damp(this._progress, this.loadProgress, ease);

    this._progress = newProgress;

    this._emit('progress', undefined);

    if (this.loadProgress >= 1) {
      this._endWithTm();
    }
  }

  /** Stops {@link Raf} and optionally animates `progress` to `1` via `endDuration`. Emits `timelineStart`, `timelineUpdate`, and `timelineEnd`. */
  private _endWithTm() {
    this._raf?.destroy();
    this._raf = undefined;

    const startProgress = this._progress;
    if (startProgress >= 1) {
      return;
    }

    const tm = new Timeline({ duration: this.props.endDuration });
    this.onDestroy(() => tm.destroy());

    tm.on('start', () => this._emit('timelineStart', undefined));

    tm.on('end', () => this._emit('timelineEnd', undefined));

    tm.on('update', (data) => {
      const diff = 1 - startProgress;
      this._progress = startProgress + diff * data.progress;

      this._emit('progress', undefined);
      this._emit('timelineUpdate', data);
    });

    tm.play();
  }

  /**
   * Waits for smoothed `progress >= 1`, then runs {@link Preloader} load handling.
   *
   * Overrides {@link Preloader._onLoaded} — does not use `initVevet().onLoad` directly.
   */
  protected _onLoaded(callback: () => void) {
    let isFinish = false;

    this.callbacks.on(
      'progress',
      () => {
        if (this.progress >= 1 && !isFinish) {
          isFinish = true;
          callback();
        }
      },
      { protected: true, name: this.name },
    );
  }

  protected _destroy() {
    super._destroy();

    this._raf?.destroy();
  }
}
