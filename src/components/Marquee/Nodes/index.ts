import { doc } from '@/internal/env';
import { isFiniteNumber } from '@/internal/isFiniteNumber';

import type { Marquee } from '..';

export class MarqueeNodes {
  /** Initial child nodes of the container */
  private _initial: ChildNode[] = [];

  /** Elements array */
  private _elements: HTMLElement[] = [];

  constructor(private _ctx: Marquee) {}

  /** Elements array */
  get elements() {
    return this._elements;
  }

  /* Save initial nodes */
  public save() {
    const { container } = this._ctx.props;

    this._initial = [...Array.from(container.childNodes)];
  }

  /**
   * Wraps the first text node in the container in a span if no other elements exist.
   */
  public wrap() {
    const { container } = this._ctx.props;
    const nodes = this._initial;

    nodes.forEach((node) => {
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
  public applyStyles() {
    this._elements.forEach((element, index) =>
      this._applyElementStyles(element, index !== 0),
    );
  }

  /**
   * Adds necessary styles to a given element.
   */
  private _applyElementStyles(element: HTMLElement, isAbsolute: boolean) {
    const { isVertical, props } = this._ctx;

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

  /**
   * Clone elements
   */
  public cloneAll(times: number) {
    if (!isFiniteNumber(times) || times <= 0) {
      return;
    }

    const elements = [...this.elements];
    const { container } = this._ctx.props;

    for (let i = 0; i < times; i += 1) {
      elements.forEach((element) => {
        const copy = element.cloneNode(true) as HTMLElement;
        this._applyElementStyles(copy, true);
        container.appendChild(copy);
      });
    }

    // Update element references after cloning
    this._elements = Array.from(container.children) as any;
  }

  /** Restores the initial nodes */
  public destroy() {
    const { container } = this._ctx.props;

    this._initial.forEach((node) => container.appendChild(node));

    this._elements.forEach((element) => {
      const { style } = element;
      style.position = '';
      style.top = '';
      style.left = '';
      style.flexShrink = '';
      style.width = '';
      style.transform = '';
      style.willChange = '';
    });
  }
}
