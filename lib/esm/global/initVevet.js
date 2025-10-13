import { Core } from '../core';
/**
 * @group Utils
 */
export function initVevet() {
    var _a;
    if (window.vevet5) {
        return window.vevet5;
    }
    const coreProps = (_a = window.VEVET_PROPS) !== null && _a !== void 0 ? _a : {};
    const core = Core(coreProps);
    window.vevet5 = core;
    return window.vevet5;
}
// auto initialize
if (typeof window !== 'undefined') {
    window.vevet5 = initVevet();
}
//# sourceMappingURL=initVevet.js.map