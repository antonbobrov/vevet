"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createScrollbarStyles = createScrollbarStyles;
var style = null;
function createScrollbarStyles(prefix) {
    if (style) {
        return style;
    }
    style = document.createElement('style');
    document.body.appendChild(style);
    style.innerHTML = "\n    .".concat(prefix, "-scrollable {\n      -ms-overflow-style: none;\n      scrollbar-width: none;\n    }\n\n    .").concat(prefix, "-scrollable::-webkit-scrollbar {\n      display: none;\n      appearance: none;\n      width: 0;\n      height: 0;\n    }\n\n    .").concat(prefix, " {\n      position: absolute;\n      z-index: 1;\n      display: flex;\n      flex-direction: column;\n      align-items: center;\n      justify-content: center;\n      box-sizing: border-box;\n      \n      opacity: 0;\n      visibility: hidden;\n      transition: opacity 0.25s linear, visibility 0.25s linear;\n    }\n\n    .").concat(prefix, ".").concat(prefix, "_in-window {\n      position: fixed;\n      z-index: 9;\n    }\n\n    .").concat(prefix, ".").concat(prefix, "_inited {\n      opacity: 1;\n      visibility: visible;\n    }\n\n    .").concat(prefix, ".").concat(prefix, "_empty {\n      opacity: 0;\n      visibility: hidden;\n    }\n\n    .").concat(prefix, ".").concat(prefix, "_auto-hide {\n      opacity: 0;\n    }\n\n    .").concat(prefix, ".").concat(prefix, "_auto-hide:hover,\n    .").concat(prefix, ".").concat(prefix, "_auto-hide:active,\n    .").concat(prefix, ".").concat(prefix, "_in-action {\n      opacity: 1;\n    }\n\n    .").concat(prefix, "_y {\n      top: 0;\n      right: 0;\n      width: 10px;\n      height: 100%;\n    }\n\n    .").concat(prefix, "_x {\n      bottom: 0;\n      left: 0;\n      width: 100%;\n      height: 10px;\n    }\n\n    .").concat(prefix, "__track {\n      position: relative;\n      width: 100%;\n      height: 100%;\n      background: #ccc;\n    }\n\n    .").concat(prefix, "__thumb {\n      position: absolute;\n      top: 0;\n      left: 0;\n      width: 100%;\n      height: 100%;\n      background: #333;\n    }\n  ");
    return style;
}
//# sourceMappingURL=styles.js.map