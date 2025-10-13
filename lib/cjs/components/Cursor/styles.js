"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCursorStyles = createCursorStyles;
var style = null;
function createCursorStyles(prefix) {
    if (style) {
        return style;
    }
    style = document.createElement('style');
    document.body.appendChild(style);
    style.innerHTML = "\n    .".concat(prefix, "-container.").concat(prefix, "-hide-default,\n    .").concat(prefix, "-container.").concat(prefix, "-hide-default * {\n      cursor: none;\n    }\n\n    .").concat(prefix, " {\n      position: absolute;\n      top: 0;\n      left: 0;\n      width: 0;\n      height: 0;\n      z-index: 999;\n      pointer-events: none;\n\n      transition: opacity 0.25s;\n      opacity: 0;\n\n      --cursor-w: 50px;\n      --cursor-h: 50px;\n    }\n    \n    .").concat(prefix, "-in-window {\n      position: fixed;\n    }\n      \n    .").concat(prefix, "-visible {\n      opacity: 1;\n    }\n\n    .").concat(prefix, "-disabled {\n      opacity: 0;\n    }\n\n    .").concat(prefix, "__inner {\n      position: relative;\n      width: var(--cursor-w);\n      height: var(--cursor-h);\n      margin-left: calc(var(--cursor-w) / -2);\n      margin-top: calc(var(--cursor-h) / -2);\n\n      background-color: rgba(0, 0, 0, 0.25);\n\n      transition: transform 0.25s;\n    }\n\n    .").concat(prefix, "__inner > * {\n      position: absolute;\n      top: 50%;\n      left: 50%;\n      transform: scale(0.75) translate(-62.5%, -62.5%);\n      opacity: 0;\n      transition: opacity 0.25s linear, transform 0.25s linear;\n    }\n\n    .").concat(prefix, "__inner > *.active {\n      opacity: 1;\n      transform: scale(1) translate(-50%, -50%);\n    }\n  ");
    return style;
}
//# sourceMappingURL=styles.js.map