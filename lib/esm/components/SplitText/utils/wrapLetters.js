import split from 'lodash.split';
import { isIgnored } from './isIgnored';
/**
 * Wraps each letter in every word inside the container with the specified HTML tag and class name.
 */
export function wrapLetters({ wordsMeta, classname, tagName, ignore }) {
    const lettersMeta = [];
    const baseElement = document.createElement(tagName);
    baseElement.style.display = 'inline-block';
    baseElement.classList.add(classname);
    // Iterate over each word to wrap its letters
    wordsMeta.forEach((wordMeta) => {
        if (isIgnored(wordMeta.element, ignore)) {
            return;
        }
        const textNode = wordMeta.element.childNodes[0];
        if (!textNode) {
            return;
        }
        const text = textNode.textContent;
        if (!text) {
            return;
        }
        // Split the word into individual letters
        const splitLetters = split(text, '');
        splitLetters.forEach((letterContents) => {
            const element = baseElement.cloneNode(false);
            element.appendChild(document.createTextNode(letterContents));
            // Append the letter element to the word's container
            wordMeta.element.insertBefore(element, textNode);
            const letter = { element };
            // Add the letter to the word's letters array and the global letters array
            wordMeta.letters.push(letter);
            lettersMeta.push(letter);
        });
        // Remove the original text node after wrapping the letters
        textNode.remove();
    });
    return { lettersMeta };
}
//# sourceMappingURL=wrapLetters.js.map