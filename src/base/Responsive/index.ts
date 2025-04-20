/* eslint-disable no-underscore-dangle */
import { initVevet } from '@/global/initVevet';
import { TResponsiveProps, TResponsiveRule, TResponsiveSource } from './types';
import { Module } from '../Module';

export * from './types';

export class Responsive<T extends TResponsiveSource> {
  /** Tracks whether the instance has been destroyed */
  protected _isDestroyed = false;

  /** Destroyable actions */
  protected _destructors: (() => void)[] = [];

  /** Previously active breakpoints */
  protected _prevBreakpoints = '[]';

  /** Initial props */
  protected _initProps!: TResponsiveProps<T>;

  /** Current props */
  protected _props: TResponsiveProps<T>;

  /** Current props */
  get props() {
    return this._props;
  }

  constructor(
    protected _source: T,
    protected _rules: TResponsiveRule<T>[],
    protected _onChange?: (props: TResponsiveProps<T>) => void,
  ) {
    const source = _source;

    const app = initVevet();
    const sourceName = source instanceof Module ? source.name : 'Object';

    // Fetch initial props
    this._fetchInitProps();

    // Save current props
    this._props = { ...this._initProps };

    // Override Module's `updateProps`
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

    // Update Props
    this._handleUpdate();

    // Add viewport listener
    this._destructors.push(
      app.onResize('any', () => this._handleUpdate(), {
        name: `${this.constructor.name} / ${sourceName}`,
      }),
    );
  }

  /** Set initial props */
  protected _fetchInitProps() {
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

  /** Get active rules */
  protected _getActiveRules() {
    const app = initVevet();

    const rules = this._rules.filter(({ at }) => {
      if (at === 'tablet ' && app.tablet) {
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
      if (at === 'lg' && app.lg) {
        return true;
      }

      if (at === 'md' && app.md) {
        return true;
      }

      if (at === 'sm' && app.sm) {
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

  /** Get responsive props */
  protected _getResponsiveProps() {
    const rules = this._getActiveRules();
    let newProps = {};

    rules.forEach(({ props }) => {
      newProps = { ...newProps, ...props };
    });

    return newProps;
  }

  /** Update properties */
  protected _handleUpdate() {
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

  /**
   * Destroy the instance and clean up resources.
   *
   * The instance is destroyed automatically when it is used to mutate Module's props.
   */
  public destroy() {
    if (this._isDestroyed) {
      return;
    }

    this._isDestroyed = true;

    this._destructors.forEach((destructor) => destructor());
  }
}
