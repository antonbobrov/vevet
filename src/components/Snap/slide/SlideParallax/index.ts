import { clamp } from '@/utils';
import {
  opacity,
  parallaxAttributes,
  parallaxGroups,
  parallaxTypes,
} from './constants';
import { parallaxAttrPrefix } from './globals';
import { ISnapSlideParallaxItem, ISnapSlideParallaxType } from './types';
import { Snap, SnapSlide } from '../..';

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

    this._types = parallaxTypes.filter(({ name }) =>
      element.hasAttribute(name),
    );

    this._items = this._types.map(
      ({ name, prop, belongsTo, unit: defaultUnit }) => {
        const scopeAttr = `${name}-scope`;

        const scopeValue = element.hasAttribute(scopeAttr)
          ? this._getScope(element, scopeAttr, [-1, 1])
          : defaultScope;

        const attrValue = element.getAttribute(name) ?? '';
        const target = parseFloat(attrValue.replace('|', '')) || 0;
        const unit = attrValue.replace(/[-\d.]+/g, '') || defaultUnit;

        const influenceAttr = `${name}-influence`;
        const isInfluence = element.hasAttribute(influenceAttr);

        const directionalAttr = `${name}-directional`;
        const isDirectional = element.hasAttribute(directionalAttr);

        const absAttr = `${name}-abs`;
        const isAbs = element.hasAttribute(absAttr);

        return {
          name,
          prop,
          belongsTo,
          unit,
          scope: scopeValue,
          progress: 0,
          target,
          value: 0,
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

    items.forEach((item) => {
      let progress = clamp(globalProgress, ...item.scope);

      if (item.isInfluence) {
        progress *= Math.abs(snap.track.influence);
      }

      if (item.isDirectional) {
        progress = Math.abs(progress) * Math.sign(snap.track.influence);
      }

      if (item.isAbs || item.prop === opacity) {
        progress = Math.abs(progress);
      }

      item.progress = progress;
      item.value = progress * item.target;

      if (item.prop.includes('scale') || item.prop === opacity) {
        item.value = 1 + item.value;
      }
    });

    parallaxGroups.forEach((group) => {
      const groupItems = items.filter((item) => item.belongsTo === group);

      const styles = groupItems.map(({ value, prop, unit }) => {
        if (group === opacity) {
          return `${value}`;
        }

        return `${prop}(${value}${unit})`;
      });

      const styleString = styles.join(' ');

      element.style[group as any] = styleString;
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
