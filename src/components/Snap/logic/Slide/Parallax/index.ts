import { SnapSlide } from '@/components/Snap';
import { clamp } from '@/utils';

import { PARALLAX_GROUPS, PARALLAX_TYPES } from './constants';
import { ISnapSlideParallaxItem } from './types';
import { getAttr, getFloatAttr, isParallaxAttr } from './utils';

export class SnapSlideParallax {
  private _observer: MutationObserver;

  private _items: ISnapSlideParallaxItem[] = [];

  private _debounceInit: NodeJS.Timeout | null = null;

  constructor(
    private _slide: SnapSlide,
    private _element: HTMLElement,
    private _getInfluence: () => number,
  ) {
    this._initDebounce();

    this._observer = new MutationObserver((mutations) => {
      mutations.forEach(({ attributeName }) => {
        if (attributeName && isParallaxAttr(attributeName)) {
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
    this._fetchItems();

    this.render();
  }

  /** Fetch parallax items */
  private _fetchItems() {
    const element = this._element;

    const defaultScope = this._getScope(this._element, `scope`, [-1, 1]);

    const types = PARALLAX_TYPES.filter(({ attr }) =>
      element.hasAttribute(attr),
    );

    this._items = types.map(
      ({ attr, prop, unit: defaultUnit, isAbs: isAbsProp, modifier }) => {
        const group = PARALLAX_GROUPS.find(({ types }) =>
          types.find((type) => type.attr === attr),
        );

        const scopeAttr = `${attr}-scope`;

        const scope = element.hasAttribute(scopeAttr)
          ? this._getScope(element, scopeAttr, [-1, 1])
          : defaultScope;

        const attrValue = getAttr(element, attr);
        const unit = attrValue.replace(/[-\d.]+/g, '') || defaultUnit;
        const target = getFloatAttr(element, attr, 0);

        const offset = getFloatAttr(element, `${attr}-offset`, 0);
        const min = getFloatAttr(element, `${attr}-min`, -Infinity);
        const max = getFloatAttr(element, `${attr}-max`, Infinity);

        const influenceAttr = `${attr}-influence`;
        const influence = element.hasAttribute(influenceAttr)
          ? getFloatAttr(element, `${attr}-influence`, 1)
          : 0;

        const directionalAttr = `${attr}-directional`;
        const isDirectional = element.hasAttribute(directionalAttr);

        const absAttr = `${attr}-abs`;
        const isAbs = isAbsProp || element.hasAttribute(absAttr);

        return {
          attr,
          prop,
          unit,
          group: group?.prop ?? '',
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
        } satisfies ISnapSlideParallaxItem;
      },
    );
  }

  /** Get parallax scope */
  private _getScope(
    element: HTMLElement,
    suffix: string,
    defaultValue: number[],
  ) {
    const attrValue = getAttr(element, suffix);
    const stringValue = attrValue.toLowerCase();

    if (stringValue === 'none') {
      return [-Infinity, Infinity];
    }

    if (stringValue === 'const') {
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
    const { _element: element, _items: items, _slide: slide } = this;
    const influence = this._getInfluence();

    const globalProgress = slide.progress;

    // Calculate parallax values

    items.forEach((item) => {
      let progress = clamp(globalProgress, ...item.scope);

      if (Math.abs(item.influence) > 0) {
        progress *= Math.abs(influence) * item.influence;
      }

      if (item.isDirectional) {
        progress = Math.abs(progress) * Math.sign(influence);
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

    PARALLAX_GROUPS.forEach(({ prop: groupProp }) => {
      const groupItems = items.filter((item) => item.group === groupProp);

      const styles = groupItems.map(({ value, prop, unit }) => {
        if (groupProp === 'opacity') {
          return `${value}`;
        }

        return `${prop}(${value}${unit})`;
      });

      const styleString = styles.join(' ');

      element.style[groupProp as any] = styleString;
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
