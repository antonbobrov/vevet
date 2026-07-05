/* eslint-disable no-underscore-dangle */
import { initVevet } from '@/global/initVevet';
import { Destroyable } from '@/internal';

import { Module } from '../Module';

import { TResponsiveProps, TResponsiveRule, TResponsiveSource } from './types';

/**
 * Applies different property values based on viewport and device.
 *
 * Pass a **Module** instance or a plain object as the source and a list of
 * rules. When the active breakpoint set changes, matching rule props are
 * merged and applied (via `updateProps()` for modules).
 *
 * Listens to `vevet.onResize('any')` and re-evaluates rules on viewport
 * changes. When the source is a **Module**, **Responsive** is destroyed
 * automatically on module `destroy`.
 *
 * @typeParam T - Source type (`Module` subclass or plain object).
 *
 * @group Base
 */
export class Responsive<T extends TResponsiveSource> extends Destroyable {
  /** Serialized list of currently active `at` values (change detection). */
  private _prevBreakpoints = '[]';

  /** Baseline props before responsive overrides. */
  private _initProps!: TResponsiveProps<T>;

  /** Current merged props (baseline + active rules). */
  private _props: TResponsiveProps<T>;

  /**
   * Current merged props (baseline + active rules).
   *
   * Read-only snapshot. For **Module** sources, mirrors `source.props`
   * after responsive updates.
   */
  get props() {
    return this._props;
  }

  constructor(
    private _source: T,
    private _rules: TResponsiveRule<T>[],
    private _onChange?: (props: TResponsiveProps<T>) => void,
  ) {
    super();

    const source = _source;

    const app = initVevet();
    const sourceName = source instanceof Module ? source.name : 'Object';

    this._fetchInitProps();

    this._props = { ...this._initProps };

    if (source instanceof Module) {
      source.on('destroy', () => this.destroy(), {
        name: this.constructor.name,
        protected: true,
      });

      const saveUpdateProps = source.updateProps.bind(source);

      source.updateProps = (p) => {
        saveUpdateProps(p);
        this._initProps = { ...this._initProps, ...p };
      };

      Object.defineProperty(source, '_$_responseProps', {
        value: (p: any) => {
          saveUpdateProps(p);
        },
      });
    }

    this._handleUpdate();

    const resizer = app.onResize('any', () => this._handleUpdate(), {
      name: `${this.constructor.name} / ${sourceName}`,
    });

    this.onDestroy(() => resizer());
  }

  /** Reads baseline props from the source. */
  private _fetchInitProps() {
    const source = this._source;

    if (source instanceof Module) {
      this._initProps = {} as any;

      const mutableKeys = Object.keys(source._getMutable());
      mutableKeys.forEach((key) => {
        // @ts-ignore
        this._initProps[key] = source.props[key];
      });

      return;
    }

    this._initProps = this._source as any;
  }

  /** Returns rules whose `at` query currently matches. */
  private _getActiveRules() {
    const app = initVevet();

    const rules = this._rules.filter(({ at }) => {
      if (at === 'tablet' && app.tablet) {
        return true;
      }

      if (at === 'phone' && app.phone) {
        return true;
      }

      if (at === 'mobile' && app.mobile) {
        return true;
      }

      if (at === 'non_mobile' && !app.mobile) {
        return true;
      }

      if (at === 'portrait' && app.portrait) {
        return true;
      }

      if (at === 'landscape' && app.landscape) {
        return true;
      }

      if (at.startsWith('@media')) {
        const isMediaActive = window.matchMedia(
          at.replace('@media', ''),
        ).matches;

        return isMediaActive;
      }

      return false;
    });

    return rules;
  }

  /** Merges `props` from all currently active rules. */
  private _getResponsiveProps() {
    const rules = this._getActiveRules();
    let newProps = {};

    rules.forEach(({ props }) => {
      newProps = { ...newProps, ...props };
    });

    return newProps;
  }

  /**
   * Recomputes merged props when the active breakpoint set changes.
   *
   * Applies props to a **Module** source and calls `onChange`.
   */
  private _handleUpdate() {
    const activeRules = this._getActiveRules();
    const activeBreakpoints = activeRules.map(({ at }) => at);
    const json = JSON.stringify(activeBreakpoints);

    if (this._prevBreakpoints === json) {
      return;
    }

    this._prevBreakpoints = json;

    this._props = { ...this._initProps, ...this._getResponsiveProps() };

    if (this._source instanceof Module) {
      // @ts-ignore
      this._source._$_responseProps(this._props);
    }

    this._onChange?.(this.props);
  }
}
