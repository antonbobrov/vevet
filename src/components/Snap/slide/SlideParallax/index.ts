import { parallaxAttributes, parallaxGroups, parallaxTypes } from './constants';
import { parallaxAttrPrefix } from './globals';
import { ISnapSlideParallaxItem, ISnapSlideParallaxType } from './types';
import { Snap, SnapSlide } from '../..';
import { clamp } from '@/utils';

export class SnapSlideParallax {
  protected _observer: MutationObserver;

  protected _types: ISnapSlideParallaxType[] = [];

  protected _items: ISnapSlideParallaxItem[] = [];

  protected _debounceInit: NodeJS.Timeout | null = null;

  constructor(
    protected _snap: Snap,
    protected _slide: SnapSlide,
    protected _element: HTMLElement,
  ) {
    this._initDebounce();

    this._observer = new MutationObserver((mutations) => {
      mutations.forEach(({ attributeName }) => {
        if (attributeName && parallaxAttributes.includes(attributeName)) {
          this._initDebounce();
        }
      });
    });

    this._observer.observe(this._element, { attributes: true });
  }

  /** Initialize parallax with debounce */
  protected _initDebounce() {
    if (this._debounceInit) {
      clearTimeout(this._debounceInit);
    }

    this._debounceInit = setTimeout(() => this._init(), 16);
  }

  /** Initialize parallax */
  protected _init() {
    this._updateItems();

    this.render();
  }

  /** Update parallax items */
  protected _updateItems() {
    const element = this._element;

    const defaultScope = this._getScope(
      this._element,
      `${parallaxAttrPrefix}scope`,
      [-1, 1],
    );

    this._types = parallaxTypes.filter(({ n }) => element.hasAttribute(n));

    this._items = this._types.map(
      ({ n, p, u: defaultUnit, isAbs: isAbsProp, modifier }) => {
        const group = parallaxGroups.find(
          ({ types }) => types.find((type) => type.n === n)!!,
        );

        const scopeAttr = `${n}-scope`;
        const scope = element.hasAttribute(scopeAttr)
          ? this._getScope(element, scopeAttr, [-1, 1])
          : defaultScope;

        const attrValue = element.getAttribute(n) ?? '';
        const target = parseFloat(attrValue) || 0;
        const unit = attrValue.replace(/[-\d.]+/g, '') || defaultUnit;

        const offsetAttr = `${n}-offset`;
        const offset = parseFloat(element.getAttribute(offsetAttr) ?? '') || 0;

        const influenceAttr = `${n}-influence`;
        const isInfluence = element.hasAttribute(influenceAttr);

        const directionalAttr = `${n}-directional`;
        const isDirectional = element.hasAttribute(directionalAttr);

        const absAttr = `${n}-abs`;
        const isAbs = isAbsProp || element.hasAttribute(absAttr);

        return {
          n,
          p,
          u: unit,
          group: group?.name!,
          modifier,
          scope,
          progress: 0,
          target,
          value: 0,
          offset,
          isInfluence,
          isDirectional,
          isAbs,
        };
      },
    );
  }

  /** Get parallax scope */
  protected _getScope(
    element: HTMLElement,
    name: string,
    defaultValue: number[],
  ) {
    const attrValue = element.getAttribute(name) ?? '';

    if (attrValue.trim().toLowerCase() === 'none') {
      return [-Infinity, Infinity];
    }

    const cleanValue = attrValue.replace(/[\s\\[\]]+/g, '');
    const minMax = cleanValue.split(',');
    const minRaw = parseFloat(minMax[0]);
    const maxRaw = parseFloat(minMax[1]);

    const min = Number.isNaN(minRaw) ? defaultValue[0] : minRaw;
    const max = Number.isNaN(maxRaw) ? defaultValue[1] : maxRaw;

    return [min, max];
  }

  /** Render parallax */
  public render() {
    const {
      _snap: snap,
      _element: element,
      _items: items,
      _slide: slide,
    } = this;

    const globalProgress = slide.progress;

    // Calculate parallax values

    items.forEach((item) => {
      let progress = clamp(globalProgress, ...item.scope);

      if (item.isInfluence) {
        progress *= Math.abs(snap.track.influence);
      }

      if (item.isDirectional) {
        progress = Math.abs(progress) * Math.sign(snap.track.influence);
      }

      if (item.isAbs) {
        progress = Math.abs(progress);
      }

      item.progress = progress;
      item.value = item.offset + progress * item.target;

      if (item.modifier) {
        item.value = item.modifier(item.value);
      }
    });

    parallaxGroups.forEach(({ name: groupName }) => {
      const groupItems = items.filter((item) => item.group === groupName);

      const styles = groupItems.map(({ value, p, u }) => {
        if (groupName === 'opacity') {
          return `${value}`;
        }

        return `${p}(${value}${u})`;
      });

      const styleString = styles.join(' ');

      element.style[groupName as any] = styleString;
    });
  }

  /** Destroy parallax */
  public destroy() {
    this._observer.disconnect();

    if (this._debounceInit) {
      clearTimeout(this._debounceInit);
    }
  }
}
