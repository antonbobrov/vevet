"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Responsive = void 0;
/* eslint-disable no-underscore-dangle */
var initVevet_1 = require("../../global/initVevet");
var Module_1 = require("../Module");
__exportStar(require("./types"), exports);
var Responsive = /** @class */ (function () {
    function Responsive(_source, _rules, _onChange) {
        var _this = this;
        this._source = _source;
        this._rules = _rules;
        this._onChange = _onChange;
        /** Tracks whether the instance has been destroyed */
        this._isDestroyed = false;
        /** Destroyable actions */
        this._destructors = [];
        /** Previously active breakpoints */
        this._prevBreakpoints = '[]';
        var source = _source;
        var app = (0, initVevet_1.initVevet)();
        var sourceName = source instanceof Module_1.Module ? source.name : 'Object';
        // Fetch initial props
        this._fetchInitProps();
        // Save current props
        this._props = __assign({}, this._initProps);
        // Override Module's `updateProps`
        if (source instanceof Module_1.Module) {
            source.on('destroy', function () { return _this.destroy(); }, {
                name: this.constructor.name,
                protected: true,
            });
            var saveUpdateProps_1 = source.updateProps.bind(source);
            source.updateProps = function (p) {
                saveUpdateProps_1(p);
                _this._initProps = __assign(__assign({}, _this._initProps), p);
            };
            Object.defineProperty(source, '_$_responseProps', {
                value: function (p) {
                    saveUpdateProps_1(p);
                },
            });
        }
        // Update Props
        this._handleUpdate();
        // Add viewport listener
        this._destructors.push(app.onResize('any', function () { return _this._handleUpdate(); }, {
            name: "".concat(this.constructor.name, " / ").concat(sourceName),
        }));
    }
    Object.defineProperty(Responsive.prototype, "props", {
        /** Current props */
        get: function () {
            return this._props;
        },
        enumerable: false,
        configurable: true
    });
    /** Set initial props */
    Responsive.prototype._fetchInitProps = function () {
        var _this = this;
        var source = this._source;
        if (source instanceof Module_1.Module) {
            this._initProps = {};
            var mutableKeys = Object.keys(source._getMutable());
            mutableKeys.forEach(function (key) {
                // @ts-ignore
                _this._initProps[key] = source.props[key];
            });
            return;
        }
        this._initProps = this._source;
    };
    /** Get active rules */
    Responsive.prototype._getActiveRules = function () {
        var app = (0, initVevet_1.initVevet)();
        var rules = this._rules.filter(function (_a) {
            var at = _a.at;
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
                var isMediaActive = window.matchMedia(at.replace('@media', '')).matches;
                return isMediaActive;
            }
            return false;
        });
        return rules;
    };
    /** Get responsive props */
    Responsive.prototype._getResponsiveProps = function () {
        var rules = this._getActiveRules();
        var newProps = {};
        rules.forEach(function (_a) {
            var props = _a.props;
            newProps = __assign(__assign({}, newProps), props);
        });
        return newProps;
    };
    /** Update properties */
    Responsive.prototype._handleUpdate = function () {
        var _a;
        var activeRules = this._getActiveRules();
        var activeBreakpoints = activeRules.map(function (_a) {
            var at = _a.at;
            return at;
        });
        var json = JSON.stringify(activeBreakpoints);
        if (this._prevBreakpoints === json) {
            return;
        }
        this._prevBreakpoints = json;
        this._props = __assign(__assign({}, this._initProps), this._getResponsiveProps());
        if (this._source instanceof Module_1.Module) {
            // @ts-ignore
            this._source._$_responseProps(this._props);
        }
        (_a = this._onChange) === null || _a === void 0 ? void 0 : _a.call(this, this.props);
    };
    /**
     * Destroy the instance and clean up resources.
     *
     * The instance is destroyed automatically when it is used to mutate Module's props.
     */
    Responsive.prototype.destroy = function () {
        if (this._isDestroyed) {
            return;
        }
        this._isDestroyed = true;
        this._destructors.forEach(function (destructor) { return destructor(); });
    };
    return Responsive;
}());
exports.Responsive = Responsive;
//# sourceMappingURL=index.js.map