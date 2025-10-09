"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.styles = void 0;
exports.styles = typeof window !== 'undefined' ? document.createElement('style') : null;
if (exports.styles) {
    exports.styles.innerHTML = '* { user-select: none !important; }';
}
//# sourceMappingURL=styles.js.map