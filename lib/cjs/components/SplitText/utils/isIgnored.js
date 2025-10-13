"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isIgnored = isIgnored;
function isIgnored(element, ignore) {
    if (!ignore) {
        return false;
    }
    if (typeof ignore === 'string') {
        return element.matches(ignore);
    }
    if (typeof ignore === 'function') {
        return ignore(element);
    }
    return ignore.includes(element);
}
//# sourceMappingURL=isIgnored.js.map