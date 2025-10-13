import { isIgnored } from './isIgnored';
/**
 * Wraps each word inside the container in an HTML element with the specified tag and class.
 */
export function wrapWords({ container, classname, tagName, ignore }) {
    const whitespace = String.fromCharCode(32); // ASCII for space
    const baseElement = document.createElement(tagName);
    baseElement.style.display = 'inline-block';
    baseElement.setAttribute('aria-hidden', 'true');
    baseElement.classList.add(classname);
    const wordsMeta = [];
    let prevNonBreakingWord = null;
    /**
     * Recursively processes each child node within the container to wrap words.
     */
    function recursive(node) {
        var _a, _b;
        // If the node is an element, process its children
        if (node instanceof HTMLElement || node instanceof DocumentFragment) {
            if ('tagName' in node && node.tagName !== 'BR') {
                if (isIgnored(node, ignore)) {
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
            const children = [...Array.from(node.childNodes)];
            children.forEach((child) => recursive(child));
            return;
        }
        // If the node is a text node, split it into words
        if (node.nodeType === 3) {
            const parent = (_a = node.parentElement) !== null && _a !== void 0 ? _a : container;
            const text = (_b = node.nodeValue) !== null && _b !== void 0 ? _b : '';
            // Handle case where node contains only whitespace
            if (text === whitespace) {
                prevNonBreakingWord = null;
                parent === null || parent === void 0 ? void 0 : parent.insertBefore(document.createTextNode(whitespace), node);
                node.remove();
                return;
            }
            // Wrap each word in an element and insert it into the DOM
            const splitWords = text.split(whitespace);
            splitWords.forEach((wordContents, index) => {
                if (wordContents) {
                    const element = baseElement.cloneNode(false);
                    element.appendChild(document.createTextNode(wordContents));
                    prevNonBreakingWord = element;
                    wordsMeta.push({ element, letters: [] });
                    parent === null || parent === void 0 ? void 0 : parent.insertBefore(element, node);
                }
                // Add a whitespace between words, except after the last word
                if (index < splitWords.length - 1) {
                    parent === null || parent === void 0 ? void 0 : parent.insertBefore(document.createTextNode(whitespace), node);
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