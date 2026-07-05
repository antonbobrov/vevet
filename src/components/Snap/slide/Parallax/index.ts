import { Destroyable } from '@/internal';
import { clamp } from '@/utils';

import { SnapSlide } from '..';

import { PARALLAX_GROUPS, PARALLAX_TYPES } from './constants';
import { ISnapParallaxItem, ISnapParallaxType } from './types';
import { getAttr, getFloatAttr, getScope, isParallaxAttr } from './utils';

/** @internal */
export class SnapParallax extends Destroyable {
  private _observer: MutationObserver;

  private _items: ISnapParallaxItem[] = [];

  private _prevStyles: Record<string, string> = {};

  private _debounceInit: NodeJS.Timeout | null = null;

  constructor(
    private _slide: SnapSlide,
    private _element: HTMLElement,
    private _getImpulse: () => number,
  ) {
    super();

    this._initDebounce();

    this._observer = new MutationObserver((mutations) => {
      mutations.forEach(({ attributeName }) => {
        if (attributeName && isParallaxAttr(attributeName)) {
          this._initDebounce();
        }
      });
    });

    this._observer.observe(_element, { attributes: true });
  }

  private get element() {
    return this._element;
  }

  private get items() {
    return this._items;
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
    this._mapItems();

    this.render();
  }

  /** Collect parallax items */
  private _mapItems() {
    const { element } = this;

    const defaultScope = getScope(element, `scope`, [-1, 1]);

    const types = PARALLAX_TYPES.filter(({ attr }) =>
      element.hasAttribute(attr),
    );

    this._items = types.map((type) => this._typeToItem(type, defaultScope));
  }

  /** Parse parallax type and collect item data */
  private _typeToItem(type: ISnapParallaxType, defaultScope: number[]) {
    const { element } = this;
    const { attr, unit: defaultUnit, isAbs: isAbsProp, prop, modifier } = type;

    const group = PARALLAX_GROUPS.find(({ types }) =>
      types.find((type) => type.attr === attr),
    );

    const scopeAttr = `${attr}-scope`;

    const scope = element.hasAttribute(scopeAttr)
      ? getScope(element, scopeAttr, [-1, 1])
      : defaultScope;

    const attrValue = getAttr(element, attr);
    const unit = attrValue.replace(/[-\d.]+/g, '') || defaultUnit;
    const target = getFloatAttr(element, attr, 0);

    const offset = getFloatAttr(element, `${attr}-offset`, 0);
    const min = getFloatAttr(element, `${attr}-min`, -Infinity);
    const max = getFloatAttr(element, `${attr}-max`, Infinity);

    const impulseAttr = `${attr}-impulse`;
    const impulse = element.hasAttribute(impulseAttr)
      ? getFloatAttr(element, impulseAttr, 1)
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
      impulse,
      isDirectional,
      isAbs,
    } satisfies ISnapParallaxItem;
  }

  /** Render parallax */
  public render() {
    const { element, items, _slide: slide } = this;
    const impulse = this._getImpulse();

    const globalProgress = slide.progress;

    // Calculate parallax values

    items.forEach((item) => {
      let progress = clamp(globalProgress, ...item.scope);

      if (Math.abs(item.impulse) > 0) {
        progress *= Math.abs(impulse) * item.impulse;
      }

      if (item.isDirectional) {
        progress = Math.abs(progress) * Math.sign(impulse);
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

      if (this._prevStyles[groupProp] !== styleString) {
        element.style[groupProp as any] = styleString;
        this._prevStyles[groupProp] = styleString;
      }
    });
  }

  /** Restores the initial nodes */
  protected _destroy() {
    this._observer.disconnect();

    if (this._debounceInit) {
      clearTimeout(this._debounceInit);
    }
  }
}
