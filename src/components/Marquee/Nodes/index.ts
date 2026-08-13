import { isFiniteNumber, ModulePart, doc } from '@/internal';

import type { Marquee } from '..';

/**
 * Manages original, wrapped, and cloned marquee nodes.
 *
 * Saves the initial DOM, wraps text nodes when needed, applies positioning
 * styles, and can restore the original container contents on destroy.
 *
 * @internal
 */
export class MarqueeNodes extends ModulePart<Marquee> {
  private _initial: ChildNode[] = [];

  private _elements: HTMLElement[] = [];

  constructor(parent: Marquee) {
    super(parent);

    this._save();
    this._wrap();
    this._applyStyles();
  }

  private get container() {
    return this.props.container;
  }

  /** Elements array */
  get elements() {
    return this._elements;
  }

  /** Snapshot current child nodes before wrapping/cloning. */
  private _save() {
    const { container } = this;

    this._initial = [...Array.from(container.childNodes)];
  }

  /**
   * Wraps the first text node in the container in a span if no other elements exist.
   */
  private _wrap() {
    const { container } = this;

    this._initial.forEach((node) => {
      if (node.nodeType === 3) {
        if (node.textContent?.trim()?.length === 0) {
          return;
        }

        const wrapper = doc.createElement('span');
        const { style } = wrapper;

        style.position = 'relative';
        style.display = 'block';
        style.width = 'max-content';
        style.whiteSpace = 'nowrap';

        container.insertBefore(wrapper, node);
        wrapper.appendChild(node);
      }
    });

    this._elements = Array.from(container.children) as any;
  }

  /**
   * Adds necessary styles to all elements.
   */
  private _applyStyles() {
    this._elements.forEach((element, index) =>
      this._applyElementStyles(element, index !== 0),
    );
  }

  /**
   * Adds necessary styles to a given element.
   */
  private _applyElementStyles(element: HTMLElement, isAbsolute: boolean) {
    const { isVertical, props } = this.parent;

    const el = element;
    const { style } = el;

    style.position = isAbsolute ? 'absolute' : 'relative';
    style.top = isAbsolute && !isVertical ? '50%' : '0';
    style.left = isAbsolute && isVertical ? '50%' : '0';
    style.willChange = props.hasWillChange ? 'transform' : '';
    style.flexShrink = '0';

    if (isVertical) {
      style.height = style.height || 'max-content';
    } else {
      style.width = style.width || 'max-content';
    }
  }

  /** Clone all current elements `times` times and append copies to the container. */
  public cloneAll(times: number) {
    if (!isFiniteNumber(times) || times <= 0) {
      return;
    }

    const elements = [...this.elements];

    for (let i = 0; i < times; i += 1) {
      elements.forEach((element) => {
        const copy = element.cloneNode(true) as HTMLElement;
        this._applyElementStyles(copy, true);
        this.container.appendChild(copy);
      });
    }

    // Update element references after cloning
    this._elements = Array.from(this.container.children) as any;
  }

  /** Restore original child nodes and clear inline styles applied by the marquee. */
  public restore() {
    const { container } = this.props;

    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }

    this._initial.forEach((node) => container.appendChild(node));

    this._elements.forEach((element) => {
      const { style } = element;

      style.position = '';
      style.top = '';
      style.left = '';
      style.flexShrink = '';
      style.width = '';
      style.height = '';
      style.transform = '';
      style.willChange = '';
    });
  }
}
