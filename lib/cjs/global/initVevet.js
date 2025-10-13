"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initVevet = initVevet;
var core_1 = require("../core");
/**
 * @group Utils
 */
function initVevet() {
    var _a;
    if (window.vevet5) {
        return window.vevet5;
    }
    var coreProps = (_a = window.VEVET_PROPS) !== null && _a !== void 0 ? _a : {};
    var core = (0, core_1.Core)(coreProps);
    window.vevet5 = core;
    return window.vevet5;
}
// auto initialize
if (typeof window !== 'undefined') {
    window.vevet5 = initVevet();
}
//# sourceMappingURL=initVevet.js.map