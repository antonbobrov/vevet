"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.wrapWords = wrapWords;
var isIgnored_1 = require("./isIgnored");
/**
 * Wraps each word inside the container in an HTML element with the specified tag and class.
 */
function wrapWords(_a) {
    var container = _a.container, classname = _a.classname, tagName = _a.tagName, ignore = _a.ignore;
    var whitespace = String.fromCharCode(32); // ASCII for space
    var baseElement = document.createElement(tagName);
    baseElement.style.display = 'inline-block';
    baseElement.setAttribute('aria-hidden', 'true');
    baseElement.classList.add(classname);
    var wordsMeta = [];
    var prevNonBreakingWord = null;
    /**
     * Recursively processes each child node within the container to wrap words.
     */
    function recursive(node) {
        var _a, _b;
        // If the node is an element, process its children
        if (node instanceof HTMLElement || node instanceof DocumentFragment) {
            if ('tagName' in node && node.tagName !== 'BR') {
                if ((0, isIgnored_1.isIgnored)(node, ignore)) {
                    if (prevNonBreakingWord) {
                        prevNonBreakingWord.append(node);
                    }
                    else {
                        wordsMeta.push({ element: node, letters: [] });
                    }
                    return;
                }
                // eslint-disable-next-line no-param-reassign
                node.style.display = 'inline-block';
            }
            prevNonBreakingWord = null;
            var children = __spreadArray([], Array.from(node.childNodes), true);
            children.forEach(function (child) { return recursive(child); });
            return;
        }
        // If the node is a text node, split it into words
        if (node.nodeType === 3) {
            var parent_1 = (_a = node.parentElement) !== null && _a !== void 0 ? _a : container;
            var text = (_b = node.nodeValue) !== null && _b !== void 0 ? _b : '';
            // Handle case where node contains only whitespace
            if (text === whitespace) {
                prevNonBreakingWord = null;
                parent_1 === null || parent_1 === void 0 ? void 0 : parent_1.insertBefore(document.createTextNode(whitespace), node);
                node.remove();
                return;
            }
            // Wrap each word in an element and insert it into the DOM
            var splitWords_1 = text.split(whitespace);
            splitWords_1.forEach(function (wordContents, index) {
                if (wordContents) {
                    var element = baseElement.cloneNode(false);
                    element.appendChild(document.createTextNode(wordContents));
                    prevNonBreakingWord = element;
                    wordsMeta.push({ element: element, letters: [] });
                    parent_1 === null || parent_1 === void 0 ? void 0 : parent_1.insertBefore(element, node);
                }
                // Add a whitespace between words, except after the last word
                if (index < splitWords_1.length - 1) {
                    parent_1 === null || parent_1 === void 0 ? void 0 : parent_1.insertBefore(document.createTextNode(whitespace), node);
                }
            });
            node.remove();
        }
    }
    // Begin processing the container
    recursive(container);
    return wordsMeta;
}
//# sourceMappingURL=wrapWords.js.map