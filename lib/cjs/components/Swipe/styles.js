"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cursorStyles = void 0;
exports.cursorStyles = typeof window !== 'undefined' ? document.createElement('style') : null;
if (exports.cursorStyles) {
    exports.cursorStyles.innerHTML = '* { cursor: grabbing !important; }';
}
//# sourceMappingURL=styles.js.map