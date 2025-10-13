"use strict";
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
exports.app = exports.vevet = exports.initVevet = void 0;
var initVevet_1 = require("./global/initVevet");
Object.defineProperty(exports, "initVevet", { enumerable: true, get: function () { return initVevet_1.initVevet; } });
/**
 * Vevet Core
 *
 * @group Core
 */
exports.vevet = (typeof window !== 'undefined' ? (0, initVevet_1.initVevet)() : undefined);
exports.app = exports.vevet;
__exportStar(require("./core/exported"), exports);
__exportStar(require("./utils"), exports);
__exportStar(require("./base"), exports);
__exportStar(require("./components"), exports);
//# sourceMappingURL=index.js.map