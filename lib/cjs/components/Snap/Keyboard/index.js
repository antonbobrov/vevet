"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SnapKeyboard = void 0;
var utils_1 = require("../../../utils");
var SnapKeyboard = /** @class */ (function () {
    function SnapKeyboard(_snap) {
        var _this = this;
        this._snap = _snap;
        /** Listeners to destruct */
        this._destructors = [];
        _snap.on('destroy', function () { return _this._destroy(); }, { protected: true });
        this._destructors.push((0, utils_1.addEventListener)(_snap.container, 'scroll', function () { return _this._handleScroll(); }));
    }
    Object.defineProperty(SnapKeyboard.prototype, "snap", {
        /** Snap component */
        get: function () {
            return this._snap;
        },
        enumerable: false,
        configurable: true
    });
    /** Handle scroll lock */
    SnapKeyboard.prototype._handleScroll = function () {
        this.snap.container.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    };
    /** Destroy wheel listeners */
    SnapKeyboard.prototype._destroy = function () {
        this._destructors.forEach(function (destructor) { return destructor(); });
    };
    return SnapKeyboard;
}());
exports.SnapKeyboard = SnapKeyboard;
//# sourceMappingURL=index.js.map