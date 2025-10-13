"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.wrapLetters = wrapLetters;
var lodash_split_1 = __importDefault(require("lodash.split"));
var isIgnored_1 = require("./isIgnored");
/**
 * Wraps each letter in every word inside the container with the specified HTML tag and class name.
 */
function wrapLetters(_a) {
    var wordsMeta = _a.wordsMeta, classname = _a.classname, tagName = _a.tagName, ignore = _a.ignore;
    var lettersMeta = [];
    var baseElement = document.createElement(tagName);
    baseElement.style.display = 'inline-block';
    baseElement.classList.add(classname);
    // Iterate over each word to wrap its letters
    wordsMeta.forEach(function (wordMeta) {
        if ((0, isIgnored_1.isIgnored)(wordMeta.element, ignore)) {
            return;
        }
        var textNode = wordMeta.element.childNodes[0];
        if (!textNode) {
            return;
        }
        var text = textNode.textContent;
        if (!text) {
            return;
        }
        // Split the word into individual letters
        var splitLetters = (0, lodash_split_1.default)(text, '');
        splitLetters.forEach(function (letterContents) {
            var element = baseElement.cloneNode(false);
            element.appendChild(document.createTextNode(letterContents));
            // Append the letter element to the word's container
            wordMeta.element.insertBefore(element, textNode);
            var letter = { element: element };
            // Add the letter to the word's letters array and the global letters array
            wordMeta.letters.push(letter);
            lettersMeta.push(letter);
        });
        // Remove the original text node after wrapping the letters
        textNode.remove();
    });
    return { lettersMeta: lettersMeta };
}
//# sourceMappingURL=wrapLetters.js.map