"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.easing = exports.EaseOutSine = exports.EaseOutQuint = exports.EaseOutQuart = exports.EaseOutQuad = exports.EaseOutExpo = exports.EaseOutElastic = exports.EaseOutCubic = exports.EaseOutCirc = exports.EaseOutBounce = exports.EaseOutBack = exports.EaseInSine = exports.EaseInQuint = exports.EaseInQuart = exports.EaseInQuad = exports.EaseInOutSine = exports.EaseInOutQuint = exports.EaseInOutQuart = exports.EaseInOutQuad = exports.EaseInOutExpo = exports.EaseInOutElastic = exports.EaseInOutCubic = exports.EaseInOutCirc = exports.EaseInOutBounce = exports.EaseInOutBack = exports.EaseInExpo = exports.EaseInElastic = exports.EaseInCubic = exports.EaseInCirc = exports.EaseInBounce = exports.EaseInBack = void 0;
var easing_progress_1 = require("easing-progress");
var initVevet_1 = require("../../global/initVevet");
var easing_progress_2 = require("easing-progress");
Object.defineProperty(exports, "EaseInBack", { enumerable: true, get: function () { return easing_progress_2.EaseInBack; } });
Object.defineProperty(exports, "EaseInBounce", { enumerable: true, get: function () { return easing_progress_2.EaseInBounce; } });
Object.defineProperty(exports, "EaseInCirc", { enumerable: true, get: function () { return easing_progress_2.EaseInCirc; } });
Object.defineProperty(exports, "EaseInCubic", { enumerable: true, get: function () { return easing_progress_2.EaseInCubic; } });
Object.defineProperty(exports, "EaseInElastic", { enumerable: true, get: function () { return easing_progress_2.EaseInElastic; } });
Object.defineProperty(exports, "EaseInExpo", { enumerable: true, get: function () { return easing_progress_2.EaseInExpo; } });
Object.defineProperty(exports, "EaseInOutBack", { enumerable: true, get: function () { return easing_progress_2.EaseInOutBack; } });
Object.defineProperty(exports, "EaseInOutBounce", { enumerable: true, get: function () { return easing_progress_2.EaseInOutBounce; } });
Object.defineProperty(exports, "EaseInOutCirc", { enumerable: true, get: function () { return easing_progress_2.EaseInOutCirc; } });
Object.defineProperty(exports, "EaseInOutCubic", { enumerable: true, get: function () { return easing_progress_2.EaseInOutCubic; } });
Object.defineProperty(exports, "EaseInOutElastic", { enumerable: true, get: function () { return easing_progress_2.EaseInOutElastic; } });
Object.defineProperty(exports, "EaseInOutExpo", { enumerable: true, get: function () { return easing_progress_2.EaseInOutExpo; } });
Object.defineProperty(exports, "EaseInOutQuad", { enumerable: true, get: function () { return easing_progress_2.EaseInOutQuad; } });
Object.defineProperty(exports, "EaseInOutQuart", { enumerable: true, get: function () { return easing_progress_2.EaseInOutQuart; } });
Object.defineProperty(exports, "EaseInOutQuint", { enumerable: true, get: function () { return easing_progress_2.EaseInOutQuint; } });
Object.defineProperty(exports, "EaseInOutSine", { enumerable: true, get: function () { return easing_progress_2.EaseInOutSine; } });
Object.defineProperty(exports, "EaseInQuad", { enumerable: true, get: function () { return easing_progress_2.EaseInQuad; } });
Object.defineProperty(exports, "EaseInQuart", { enumerable: true, get: function () { return easing_progress_2.EaseInQuart; } });
Object.defineProperty(exports, "EaseInQuint", { enumerable: true, get: function () { return easing_progress_2.EaseInQuint; } });
Object.defineProperty(exports, "EaseInSine", { enumerable: true, get: function () { return easing_progress_2.EaseInSine; } });
Object.defineProperty(exports, "EaseOutBack", { enumerable: true, get: function () { return easing_progress_2.EaseOutBack; } });
Object.defineProperty(exports, "EaseOutBounce", { enumerable: true, get: function () { return easing_progress_2.EaseOutBounce; } });
Object.defineProperty(exports, "EaseOutCirc", { enumerable: true, get: function () { return easing_progress_2.EaseOutCirc; } });
Object.defineProperty(exports, "EaseOutCubic", { enumerable: true, get: function () { return easing_progress_2.EaseOutCubic; } });
Object.defineProperty(exports, "EaseOutElastic", { enumerable: true, get: function () { return easing_progress_2.EaseOutElastic; } });
Object.defineProperty(exports, "EaseOutExpo", { enumerable: true, get: function () { return easing_progress_2.EaseOutExpo; } });
Object.defineProperty(exports, "EaseOutQuad", { enumerable: true, get: function () { return easing_progress_2.EaseOutQuad; } });
Object.defineProperty(exports, "EaseOutQuart", { enumerable: true, get: function () { return easing_progress_2.EaseOutQuart; } });
Object.defineProperty(exports, "EaseOutQuint", { enumerable: true, get: function () { return easing_progress_2.EaseOutQuint; } });
Object.defineProperty(exports, "EaseOutSine", { enumerable: true, get: function () { return easing_progress_2.EaseOutSine; } });
/**
 * Applies an easing function to a given progress value.
 *
 * This function calculates eased progress using a specified easing function,
 * bezier curve, or custom easing function.
 *
 * @param {number} progress - The current progress value, typically between 0 and 1.
 * @param {TEasingType} easingType - The easing method to apply. It can be:
 *   - A predefined easing function (e.g., `EaseInBounce`).
 *   - A bezier array (e.g., `[0.25, 0.1, 0.25, 1]`).
 *   - A custom easing function (e.g., `(value) => Math.sin(Math.PI * 0.5 * value)`).
 * @returns {number} - The eased progress value.
 *
 * @group Utils
 *
 * @example
 * easing(0.35, EaseInBounce);
 * // => 0.167 (eased progress using EaseInBounce)
 *
 * easing(0.35, [0.25, 0.1, 0.25, 1]);
 * // => 0.604 (eased progress using a bezier curve)
 *
 * easing(0.35, (value) => Math.sin(Math.PI * 0.5 * value));
 * // => 0.522 (eased progress using a custom easing function)
 */
var easing = function (progress, easingType) {
    var _a;
    if (easingType === void 0) { easingType = (_a = (0, initVevet_1.initVevet)().props.easing) !== null && _a !== void 0 ? _a : false; }
    return (0, easing_progress_1.easing)(progress, easingType);
};
exports.easing = easing;
//# sourceMappingURL=easing.js.map