import { ModulePart } from '@/shared/ModulePart';

import { Pointers } from '..';

import { IPointersItem } from './types';

/**
 * Active pointer registry keyed by `pointerId`.
 */
export class PointersPoints extends ModulePart<Pointers> {
  private _map: Map<number, IPointersItem> = new Map();

  /** Active pointers keyed by native `pointerId`. */
  get map() {
    return this._map;
  }

  /** Number of active pointers. */
  get size() {
    return this._map.size;
  }

  /** Active pointers sorted by stable `index`. */
  get sorted() {
    return Array.from(this._map.values()).sort((a, b) => a.index - b.index);
  }

  public has(id: number) {
    return this._map.has(id);
  }

  public get(id: number) {
    return this._map.get(id);
  }

  public delete(id: number) {
    this._map.delete(id);
  }

  public clear() {
    this._map.clear();
  }

  /** Reassigns `index` after add/remove. */
  private _updateIndices() {
    let index = 0;
    this._map.forEach((pointer) => {
      pointer.index = index;
      index += 1;
    });
  }

  /** Registers a new pointer and returns its item. */
  public add(x: number, y: number, id: number) {
    const pointer: IPointersItem = {
      id,
      index: this.size,
      start: { x, y },
      prev: { x, y },
      current: { x, y },
      diff: { x: 0, y: 0 },
      step: { x: 0, y: 0 },
      accum: { x: 0, y: 0 },
    };

    this._map.set(id, pointer);
    this._updateIndices();

    return pointer;
  }

  /** Updates pointer position and movement deltas. */
  public move(id: number, x: number, y: number) {
    const pointer = this._map.get(id);

    if (!pointer) {
      return;
    }

    pointer.prev = { ...pointer.current };
    pointer.current = { x, y };

    pointer.diff.x = pointer.current.x - pointer.start.x;
    pointer.diff.y = pointer.current.y - pointer.start.y;

    pointer.step.x = pointer.current.x - pointer.prev.x;
    pointer.step.y = pointer.current.y - pointer.prev.y;

    pointer.accum.x += Math.abs(pointer.step.x);
    pointer.accum.y += Math.abs(pointer.step.y);

    return pointer;
  }
}
