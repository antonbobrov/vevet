/* eslint-disable no-underscore-dangle */
import { initVevet } from '../../global/initVevet';
import { Module } from '../Module';
export * from './types';
export class Responsive {
    /** Current props */
    get props() {
        return this._props;
    }
    constructor(_source, _rules, _onChange) {
        this._source = _source;
        this._rules = _rules;
        this._onChange = _onChange;
        /** Tracks whether the instance has been destroyed */
        this._isDestroyed = false;
        /** Destroyable actions */
        this._destructors = [];
        /** Previously active breakpoints */
        this._prevBreakpoints = '[]';
        const source = _source;
        const app = initVevet();
        const sourceName = source instanceof Module ? source.name : 'Object';
        // Fetch initial props
        this._fetchInitProps();
        // Save current props
        this._props = Object.assign({}, this._initProps);
        // Override Module's `updateProps`
        if (source instanceof Module) {
            source.on('destroy', () => this.destroy(), {
                name: this.constructor.name,
                protected: true,
            });
            const saveUpdateProps = source.updateProps.bind(source);
            source.updateProps = (p) => {
                saveUpdateProps(p);
                this._initProps = Object.assign(Object.assign({}, this._initProps), p);
            };
            Object.defineProperty(source, '_$_responseProps', {
                value: (p) => {
                    saveUpdateProps(p);
                },
            });
        }
        // Update Props
        this._handleUpdate();
        // Add viewport listener
        this._destructors.push(app.onResize('any', () => this._handleUpdate(), {
            name: `${this.constructor.name} / ${sourceName}`,
        }));
    }
    /** Set initial props */
    _fetchInitProps() {
        const source = this._source;
        if (source instanceof Module) {
            this._initProps = {};
            const mutableKeys = Object.keys(source._getMutable());
            mutableKeys.forEach((key) => {
                // @ts-ignore
                this._initProps[key] = source.props[key];
            });
            return;
        }
        this._initProps = this._source;
    }
    /** Get active rules */
    _getActiveRules() {
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
                const isMediaActive = window.matchMedia(at.replace('@media', '')).matches;
                return isMediaActive;
            }
            return false;
        });
        return rules;
    }
    /** Get responsive props */
    _getResponsiveProps() {
        const rules = this._getActiveRules();
        let newProps = {};
        rules.forEach(({ props }) => {
            newProps = Object.assign(Object.assign({}, newProps), props);
        });
        return newProps;
    }
    /** Update properties */
    _handleUpdate() {
        var _a;
        const activeRules = this._getActiveRules();
        const activeBreakpoints = activeRules.map(({ at }) => at);
        const json = JSON.stringify(activeBreakpoints);
        if (this._prevBreakpoints === json) {
            return;
        }
        this._prevBreakpoints = json;
        this._props = Object.assign(Object.assign({}, this._initProps), this._getResponsiveProps());
        if (this._source instanceof Module) {
            // @ts-ignore
            this._source._$_responseProps(this._props);
        }
        (_a = this._onChange) === null || _a === void 0 ? void 0 : _a.call(this, this.props);
    }
    /**
     * Destroy the instance and clean up resources.
     *
     * The instance is destroyed automatically when it is used to mutate Module's props.
     */
    destroy() {
        if (this._isDestroyed) {
            return;
        }
        this._isDestroyed = true;
        this._destructors.forEach((destructor) => destructor());
    }
}
//# sourceMappingURL=index.js.map