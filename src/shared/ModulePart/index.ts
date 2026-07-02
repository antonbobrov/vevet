import { Destroyable } from '../Destroyable';

import { IModulePartParent } from './types';

export * from './types';

/**
 * Base class for internal subsystems owned by a {@link Module}.
 *
 * A part shares the parent's `props`, `prefix`, and `callbacks`, and is
 * destroyed automatically when the parent is destroyed.
 *
 * @typeParam Parent - Parent instance implementing {@link IModulePartParent}.
 */
export class ModulePart<
  Parent extends IModulePartParent<Parent['props'], Parent['callbacks']>,
> extends Destroyable {
  constructor(private _parent: Parent) {
    super();

    this._parent.onDestroy(() => this.destroy());
  }

  /**
   * Parent properties.
   *
   * Do not mutate directly; use the parent's `updateProps()` when available.
   */
  protected get props(): Parent['props'] {
    return this._parent.props;
  }

  /**
   * CSS class name prefix from the parent module.
   */
  protected get prefix(): Parent['prefix'] {
    return this._parent.prefix;
  }

  /**
   * Parent callbacks registry.
   */
  protected get callbacks(): Parent['callbacks'] {
    return this._parent.callbacks;
  }

  /**
   * Builds one or more prefixed class names.
   *
   * @param classes - Unprefixed class name segments.
   * @returns Space-separated prefixed class string.
   */
  protected _cn(...classes: string[]) {
    return classes.map((value) => `${this.prefix}${value}`).join(' ');
  }

  /**
   * Adds prefixed classes to an element and removes them on destroy.
   *
   * Skips classes that are already present on the element.
   *
   * @param element - Target DOM element.
   * @param classes - Unprefixed class name segments.
   */
  protected _tempCn(element: Element, ...classes: string[]) {
    const nextClassNames = classes.filter(
      (name) => !element.classList.contains(this._cn(name)),
    );

    nextClassNames.forEach((name) => {
      element.classList.add(this._cn(name));
    });

    this.onDestroy(() => {
      nextClassNames.forEach((name) => {
        element.classList.remove(this._cn(name));
      });
    });
  }
}
