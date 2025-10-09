"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizeWheel = normalizeWheel;
var normalize_wheel_1 = __importDefault(require("normalize-wheel"));
/**
 * Normalize wheel delta. This function is re-exported from `normalize-wheel` for convenience.
 * It helps normalize the wheel event's delta values (spinX, spinY, pixelX, pixelY) across different browsers.
 *
 * @see https://www.npmjs.com/package/normalize-wheel
 *
 * @group Utils
 *
 * @example
 *
 * document.addEventListener('wheel', (event) => {
 *   const normalized = normalizeWheel(event);
 *   console.log(normalized);
 *   // => { spinX: -0, spinY: 1.25, pixelX: -0, pixelY: 125 }
 * });
 */
function normalizeWheel(event) {
    return (0, normalize_wheel_1.default)(event);
}
//# sourceMappingURL=normalizeWheel.js.map