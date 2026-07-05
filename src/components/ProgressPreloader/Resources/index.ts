import { cnHas } from '@/internal/cn';
import { isFiniteNumber } from '@/internal/isFiniteNumber';
import { ModulePart } from '@/shared/ModulePart';
import { clamp } from '@/utils';

import { ProgressPreloader } from '..';
import { ProgressPreloaderCustom } from '../Custom';
import { IProgressPreloaderResource } from '../global';
import { ProgressPreloaderImage } from '../Image';
import { ProgressPreloaderVideo } from '../Video';

const INITIAL_RESOURCE = `vevet-page-${Math.random()}`;

/**
 * Weighted resource registry and DOM discovery.
 *
 * Scans {@link ProgressPreloader.resourceContainer} for images, videos, and
 * `customSelector` matches. Resolving any item notifies the parent via `_onResolve`.
 *
 * @internal
 */
export class ProgressPreloaderResources extends ModulePart<ProgressPreloader> {
  private _items: IProgressPreloaderResource[] = [
    { id: INITIAL_RESOURCE, weight: 1, loaded: 0 },
  ];

  constructor(
    parent: ProgressPreloader,
    private _container: HTMLElement,
    private _onResolve: (resource: IProgressPreloaderResource) => void,
  ) {
    super(parent);

    if (this.props.preloadImages) {
      this._fetchImages();
    }

    if (this.props.preloadVideos) {
      this._fetchVideos();
    }

    if (this.props.customSelector) {
      this._fetchCustom();
    }
  }

  get items() {
    return this._items;
  }

  get totalWeight() {
    return this._items.reduce((acc, { weight }) => acc + weight, 0);
  }

  get loadedWeight() {
    return this._items.reduce((acc, { loaded }) => acc + loaded, 0);
  }

  private _select<T extends Element>(selector: string) {
    return Array.from(this._container.querySelectorAll<T>(selector));
  }

  private _isIgnored(element: Element) {
    return cnHas(element, this.props.ignoreClassName);
  }

  private _fetchImages() {
    const all = this._select<HTMLImageElement>('img');

    const list = all.filter((element) => {
      const isIgnored = this._isIgnored(element);

      return !isIgnored && element.loading !== 'lazy';
    });

    this._items.push(
      ...list.map((resource) => ({ id: resource, weight: 1, loaded: 0 })),
    );

    list.forEach((element) => {
      new ProgressPreloaderImage(this.parent, element, () =>
        this.resolve(element),
      );
    });
  }

  private _fetchVideos() {
    const all = this._select<HTMLVideoElement>('video');
    const list = all.filter((element) => !this._isIgnored(element));

    this._items.push(
      ...list.map((resource) => ({ id: resource, weight: 1, loaded: 0 })),
    );

    list.forEach((element) => {
      new ProgressPreloaderVideo(this.parent, element, () =>
        this.resolve(element),
      );
    });
  }

  private _fetchCustom() {
    const all = this._select(this.props.customSelector);
    const list = all.filter((element) => !this._isIgnored(element));

    list.forEach((element) => {
      let weight = parseInt(element.getAttribute('data-weight') || '1', 10);
      weight = isFiniteNumber(weight) ? clamp(weight, 1, Infinity) : 1;

      const resource: IProgressPreloaderResource = {
        id: element,
        weight,
        loaded: 0,
      };

      this._items.push(resource);

      new ProgressPreloaderCustom(
        this.parent,
        element,
        weight,
        (loadedWeight) => this.resolve(element, loadedWeight),
      );
    });
  }

  private _get(id: Element | string) {
    return this._items.find((item) => item.id === id);
  }

  /** Marks the virtual page resource loaded when `initVevet().onLoad` fires. */
  public resolveInitial() {
    this.resolve(INITIAL_RESOURCE);
  }

  /** @throws When the resource id already exists. */
  public add(id: Element | string, weight = 1) {
    if (this._get(id)) {
      return;
    }

    this._items.push({ id, weight, loaded: 0 });
  }

  /** Updates `loaded` (clamped) and invokes `_onResolve`. */
  public resolve(id: Element | string, loadedWeight?: number) {
    const resource = this._get(id);

    if (!resource) {
      return;
    }

    if (resource.loaded >= 1) {
      return;
    }

    const targetWeight = loadedWeight ?? resource.weight;
    resource.loaded = clamp(targetWeight, 0, resource.weight);

    this._onResolve(resource);
  }
}
