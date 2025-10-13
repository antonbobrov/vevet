"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.splitBase = splitBase;
var wrapLetters_1 = require("./wrapLetters");
var wrapWords_1 = require("./wrapWords");
/**
 * Splits text in the container into words and optionally into letters.
 */
function splitBase(_a) {
    var container = _a.container, letterClassName = _a.letterClassName, wordClassName = _a.wordClassName, hasLetters = _a.hasLetters, letterTag = _a.letterTag, wordTag = _a.wordTag, ignore = _a.ignore;
    // Prepare the fragment
    var prepareFragment = document.createDocumentFragment();
    while (container.childNodes[0]) {
        prepareFragment.appendChild(container.childNodes[0]);
    }
    // Wrap the text into words
    var wordsMeta = (0, wrapWords_1.wrapWords)({
        container: prepareFragment,
        classname: wordClassName,
        tagName: wordTag,
        ignore: ignore,
    });
    var lettersMeta = [];
    // If enabled, wrap words into letters
    if (hasLetters) {
        var wrappedLetters = (0, wrapLetters_1.wrapLetters)({
            wordsMeta: wordsMeta,
            classname: letterClassName,
            tagName: letterTag,
            ignore: ignore,
        });
        lettersMeta.push.apply(lettersMeta, wrappedLetters.lettersMeta);
    }
    // Append the prepared fragment
    container.appendChild(prepareFragment);
    return { wordsMeta: wordsMeta, lettersMeta: lettersMeta };
}
//# sourceMappingURL=splitBase.js.map