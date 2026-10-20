import { Raf } from '@/components/Raf';
import { ModulePart } from '@/internal';
import { toPixels } from '@/utils';

import { APPX } from '../constants';

import type { Cursor } from '..';

/**
 * Cursor `x` / `y` / `width` / `height` / `angle` / `velocity` as named {@link Raf}
 * entries. Pointer and hover targets live in `_targets`; values lerp each frame.
 *
 * @internal
 */
export class CursorCoords extends ModulePart<Cursor> {
  private _targets: {
    x: number;
    y: number;
    width: number;
    height: number;
  };

  constructor(
    parent: Cursor,
    private raf: Raf,
  ) {
    super(parent);

    const { initialWidth, initialHeight } = this;

    this._targets = { x: 0, y: 0, width: initialWidth, height: initialHeight };

    raf.add('x', {
      value: this._targets.x,
      target: () => this._targets.x,
      appx: APPX,
      ease: () => this.easeCoords,
    });

    raf.add('y', {
      value: this._targets.y,
      target: () => this._targets.y,
      appx: APPX,
      ease: () => this.easeCoords,
    });

    raf.add('angle', {
      value: 0,
      appx: APPX,
      ease: () => this.easeAngle,
    });

    raf.add('velocity', {
      value: 0,
      appx: APPX,
      ease: () => this.easeVelocity,
      friction: true,
    });

    raf.add('width', {
      value: this._targets.width,
      target: () => this._targets.width,
      appx: APPX,
      ease: () => this.easeSize,
    });

    raf.add('height', {
      value: this._targets.height,
      target: () => this._targets.height,
      appx: APPX,
      ease: () => this.easeSize,
    });
  }

  get easeCoords() {
    return this.props.easeCoords === 'auto'
      ? this.parent.ease
      : this.props.easeCoords;
  }

  get easeSize() {
    return this.props.easeSize === 'auto'
      ? this.parent.ease
      : this.props.easeSize;
  }

  get easeAngle() {
    return this.props.easeAngle === 'auto'
      ? this.parent.ease
      : this.props.easeAngle;
  }

  get easeVelocity() {
    return this.props.easeVelocity === 'auto'
      ? this.parent.ease
      : this.props.easeVelocity;
  }

  get initialWidth() {
    return toPixels(this.props.width);
  }

  get initialHeight() {
    return toPixels(this.props.height);
  }

  /** Current (lerped) values. */
  get current() {
    const { raf } = this;

    return {
      x: raf.value('x'),
      y: raf.value('y'),
      width: raf.value('width'),
      height: raf.value('height'),
      angle: raf.value('angle'),
      velocity: raf.value('velocity'),
    };
  }

  /** Current targets (pointer / hover, plus angle / velocity). */
  get target() {
    const { raf } = this;

    return {
      x: raf.target('x'),
      y: raf.target('y'),
      width: raf.target('width'),
      height: raf.target('height'),
      angle: raf.target('angle'),
      velocity: raf.target('velocity'),
    };
  }

  /** Refresh `_targets` from optional pointer coords and the active hover. */
  public updateTargets(targetX?: number, targetY?: number) {
    const { initialWidth, initialHeight, parent } = this;

    this._targets.x = targetX ?? this._targets.x;
    this._targets.y = targetY ?? this._targets.y;

    this._targets.width = initialWidth;
    this._targets.height = initialHeight;

    if (parent.hoveredElement) {
      const dimensions = parent.hoveredElement.getDimensions();
      const { padding } = dimensions;

      this._targets.x = dimensions.x ?? this._targets.x;
      this._targets.y = dimensions.y ?? this._targets.y;

      this._targets.width = (dimensions.width ?? initialWidth) + padding * 2;
      this._targets.height = (dimensions.height ?? initialHeight) + padding * 2;
    }
  }

  /**
   * Set pointer target and derive `angle` / `velocity` from lerp lag,
   * then {@link updateTargets}.
   */
  public move(x: number, y: number) {
    const { raf } = this;

    const prevX = raf.target('x');
    const prevY = raf.target('y');
    const prevAngle = raf.target('angle');

    const deltaX = prevX - raf.value('x');
    const deltaY = prevY - raf.value('y');
    const rawAngle = (Math.atan2(deltaY, deltaX) * 180) / Math.PI;
    const targetAngle =
      prevAngle + ((((rawAngle - prevAngle) % 360) + 540) % 360) - 180;
    const velocity =
      Math.min(Math.sqrt(deltaX ** 2 + deltaY ** 2) * 2, 150) / 150;

    this.updateTargets(x, y);

    raf.target('angle', targetAngle);
    raf.target('velocity', velocity);
  }
}
