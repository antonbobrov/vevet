import { clamp } from '@/utils';

import { Snap, SnapSlide } from '../..';

import { parallaxAttributes, parallaxGroups, parallaxTypes } from './constants';
import { parallaxAttrPrefix } from './globals';
import { ISnapSlideParallaxItem, ISnapSlideParallaxType } from './types';

export class SnapSlideParallax {
  private _observer: MutationObserver;

  private _types: ISnapSlideParallaxType[] = [];

  private _items: ISnapSlideParallaxItem[] = [];

  private _debounceInit: NodeJS.Timeout | null = null;

  constructor(
    private _snap: Snap,
    private _slide: SnapSlide,
    private _element: HTMLElement,
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
  private _initDebounce() {
    if (this._debounceInit) {
      clearTimeout(this._debounceInit);
    }

    this._debounceInit = setTimeout(() => this._init(), 16);
  }

  /** Initialize parallax */
  private _init() {
    this._updateItems();

    this.render();
  }

  /** Update parallax items */
  private _updateItems() {
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
          // eslint-disable-next-line @typescript-eslint/no-extra-non-null-assertion
          ({ types }) => types.find((type) => type.n === n)!!,
        );

        const scopeAttr = `${n}-scope`;
        const scope = element.hasAttribute(scopeAttr)
          ? this._getScope(element, scopeAttr, [-1, 1])
          : defaultScope;

        const attrValue = this._getAttr(element, n);
        const unit = attrValue.replace(/[-\d.]+/g, '') || defaultUnit;
        const target = this._getFloatAttr(element, n, 0);

        const offset = this._getFloatAttr(element, `${n}-offset`, 0);
        const min = this._getFloatAttr(element, `${n}-min`, -Infinity);
        const max = this._getFloatAttr(element, `${n}-max`, Infinity);

        const influenceAttr = `${n}-influence`;
        const influence = element.hasAttribute(influenceAttr)
          ? this._getFloatAttr(element, `${n}-influence`, 1)
          : 0;

        const directionalAttr = `${n}-directional`;
        const isDirectional = element.hasAttribute(directionalAttr);

        const absAttr = `${n}-abs`;
        const isAbs = isAbsProp || element.hasAttribute(absAttr);

        return {
          n,
          p,
          u: unit,
          group: group?.name ?? '',
          modifier,
          scope,
          progress: 0,
          target,
          value: 0,
          offset,
          min,
          max,
          influence,
          isDirectional,
          isAbs,
        };
      },
    );
  }

  /** Get parallax attribute */
  private _getAttr(element: HTMLElement, name: string) {
    return element.getAttribute(name) ?? '';
  }

  /** Get parallax float attribute */
  private _getFloatAttr(
    element: HTMLElement,
    name: string,
    defaultValue: number,
  ) {
    const float = parseFloat(this._getAttr(element, name));

    return Number.isNaN(float) ? defaultValue : float;
  }

  /** Get parallax scope */
  private _getScope(
    element: HTMLElement,
    name: string,
    defaultValue: number[],
  ) {
    const attrValue = this._getAttr(element, name);
    const attrStringValue = attrValue.trim().toLowerCase();

    if (attrStringValue === 'none') {
      return [-Infinity, Infinity];
    }

    if (attrStringValue === 'const') {
      return [1, 1];
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

      if (Math.abs(item.influence) > 0) {
        progress *= Math.abs(snap.influence) * item.influence;
      }

      if (item.isDirectional) {
        progress = Math.abs(progress) * Math.sign(snap.influence);
      }

      if (item.isAbs) {
        progress = Math.abs(progress);
      }

      item.progress = progress;
      item.value = item.offset + progress * item.target;

      if (item.modifier) {
        item.value = item.modifier(item.value);
      }

      item.value = clamp(item.value, item.min, item.max);
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
