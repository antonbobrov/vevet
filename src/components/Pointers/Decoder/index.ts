import { isNumber } from '@/internal/isNumber';
import { ModulePart } from '@/shared/ModulePart';
import { clamp } from '@/utils';

import { Pointers } from '..';

import { TPointersType } from './types';

/**
 * Resolves {@link Pointers} props and normalizes pointer events.
 *
 * @internal
 */
export class PointersDecoder extends ModulePart<Pointers> {
  /**
   * Returns the minimum active pointers required to start a gesture.
   */
  public minPointers(type: TPointersType) {
    const { minPointers } = this.props;
    const val = isNumber(minPointers) ? minPointers : minPointers(type);

    return clamp(val, 1, Infinity);
  }

  /**
   * Returns the maximum number of pointers tracked at once.
   */
  public maxPointers(type: TPointersType) {
    const { maxPointers } = this.props;
    const val = isNumber(maxPointers) ? maxPointers : maxPointers(type);

    return clamp(val, this.minPointers(type), Infinity);
  }

  /**
   * Normalizes {@link PointerEvent.pointerType} to `mouse` or `touch`.
   */
  public pointerType(event: PointerEvent) {
    const types: TPointersType[] = ['mouse', 'touch'];

    if (types.includes(event.pointerType as TPointersType)) {
      return event.pointerType as TPointersType;
    }

    return 'mouse';
  }

  /**
   * Returns allowed mouse buttons for the given pointer type.
   */
  public buttons(type: TPointersType) {
    const { buttons } = this.props;

    return Array.isArray(buttons) ? buttons : buttons(type);
  }

  /**
   * Returns pointer coordinates.
   *
   * When `container` is `null` (`relative: false`), uses viewport (`clientX` / `clientY`).
   * Otherwise returns coordinates relative to the container bounding box.
   */
  public coords(event: PointerEvent, container: Element | null) {
    if (!container) {
      return { x: event.clientX, y: event.clientY };
    }

    const bounding = container.getBoundingClientRect();

    const x = event.clientX - bounding.left;
    const y = event.clientY - bounding.top;

    return { x, y };
  }
}
