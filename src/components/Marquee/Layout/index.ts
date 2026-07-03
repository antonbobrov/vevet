import { isFiniteNumber } from '@/internal/isFiniteNumber';
import { ModulePart } from '@/shared/ModulePart';
import { loop } from '@/utils';

import { MarqueeNodes } from '../Nodes';

import type { Marquee } from '..';

/**
 * Layout and transform pipeline for {@link Marquee}.
 *
 * Measures container/item sizes, decides how many clones are required for a
 * seamless loop, and applies translated positions during render.
 *
 * Despite the name, this part owns both resize calculations and per-frame item
 * transforms.
 *
 * @internal
 */
export class MarqueeLayout extends ModulePart<Marquee> {
  /** Current container size (width or height depending on direction) */
  private _containerSize = 0;

  /** Array of sizes of each child element */
  private _sizes: number[] = [];

  /** Total size of all elements in the marquee */
  private _totalSize = 0;

  /** Defines how many times items should be copied */
  private _copyTimes = 0;

  constructor(
    parent: Marquee,
    private _nodes: MarqueeNodes,
  ) {
    super(parent);
  }

  /** Total loop length including gap compensation and clone coverage. */
  get totalSize() {
    return this._totalSize;
  }

  /** Current container size along the active axis. */
  get containerSize() {
    return this._containerSize;
  }

  /** Cached item sizes including the configured gap. */
  get sizes() {
    return this._sizes;
  }

  /** Update elements sizes */
  private _recalculate() {
    const { props, isVertical, gap } = this.parent;
    const { container } = props;

    const containerSize = isVertical
      ? container.offsetHeight
      : container.offsetWidth;

    this._containerSize = containerSize;

    this._sizes = this._nodes.elements.map(
      (el) => (isVertical ? el.offsetHeight : el.offsetWidth) + gap,
    );

    this._totalSize = this._sizes.reduce((a, b) => a + b, 0);

    // Determine how many times to duplicate elements
    const maxSize = Math.max(...this._sizes);
    this._copyTimes = Math.ceil((containerSize + maxSize) / this._totalSize);

    // update total size
    this._totalSize = Math.max(this._totalSize, containerSize + maxSize);
  }

  /** Resizes the marquee, recalculating element positions and cloning if necessary. */
  public resize() {
    const { props } = this;

    this._recalculate();

    const times = this._copyTimes;

    if (props.cloneNodes && isFiniteNumber(times) && times > 1) {
      this._nodes.cloneAll(times - 1);
      this.resize();
    }
  }

  /** Position all marquee items for the provided global coordinate. */
  public render(coord: number) {
    const { props, gap, isVertical } = this.parent;
    const { containerSize, sizes, totalSize } = this;
    const { elements } = this._nodes;

    const centerCoord = containerSize * 0.5 + sizes[0] / 2 - gap;
    const position = coord + (props.centered ? centerCoord : 0);

    let prevStaticCoord = 0;

    for (let index = 0; index < elements.length; index += 1) {
      const element = elements[index];
      const elementSize = sizes[index];
      const { style } = element;

      const coord = loop(
        position + prevStaticCoord,
        -elementSize,
        totalSize - elementSize,
      );

      // Apply transformations to position the element
      if (isVertical) {
        const x = style.position === 'relative' ? '0' : '-50%';
        style.transform = `translate(${x}, ${coord}px)`;
      } else {
        const y = style.position === 'relative' ? '0' : '-50%';
        style.transform = `translate(${coord}px, ${y})`;
      }

      prevStaticCoord += elementSize;
    }
  }
}
