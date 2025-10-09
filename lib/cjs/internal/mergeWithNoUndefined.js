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
Object.defineProperty(exports, "__esModule", { value: true });
exports.mergeWithNoUndefined = mergeWithNoUndefined;
function mergeWithNoUndefined(source, add) {
    var addKeys = Object.keys(add);
    var addNonUndefinedKeys = addKeys.filter(function (key) { return add[key] !== undefined; });
    var newAdd = addNonUndefinedKeys.reduce(function (acc, key) {
        acc[key] = add[key];
        return acc;
    }, {});
    return __assign(__assign({}, source), newAdd);
}
//# sourceMappingURL=mergeWithNoUndefined.js.map