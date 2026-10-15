import { cnToggle, ModulePart } from '@/internal';

import { Cursor } from '..';

import { ICursorType } from './types';

/**
 * Stack of named cursor types with `active` class toggling and type callbacks.
 *
 * @internal
 */
export class CursorType extends ModulePart<Cursor> {
  private _types: ICursorType[] = [];

  private _actives: string[] = [];

  constructor(parent: Cursor) {
    super(parent);
  }

  private get activeType() {
    if (this._actives.length === 0) {
      return null;
    }

    return this._actives[this._actives.length - 1];
  }

  private _addActive(type: string) {
    this._actives.push(type);
  }

  private _removeActive(type: string) {
    this._actives = this._actives.filter((item) => type !== item);
  }

  add(element: Element, type: string) {
    this._types.push({ element, type });
  }

  public toggle(type: string, enabled: boolean) {
    if (enabled) {
      this._addActive(type);
    } else {
      this._removeActive(type);
    }

    const targetType = this._types.find((item) => item.type === type);
    const { activeType } = this;

    this._types.forEach((item) => {
      cnToggle(item.element, 'active', item.type === activeType);
    });

    if (targetType) {
      this.callbacks.emit(enabled ? 'typeShow' : 'typeHide', targetType);
    }

    if (!activeType) {
      this.callbacks.emit('noType', undefined);
    }
  }
}
