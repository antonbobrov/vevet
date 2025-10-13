import { wrapLetters } from './wrapLetters';
import { wrapWords } from './wrapWords';
/**
 * Splits text in the container into words and optionally into letters.
 */
export function splitBase({ container, letterClassName, wordClassName, hasLetters, letterTag, wordTag, ignore, }) {
    // Prepare the fragment
    const prepareFragment = document.createDocumentFragment();
    while (container.childNodes[0]) {
        prepareFragment.appendChild(container.childNodes[0]);
    }
    // Wrap the text into words
    const wordsMeta = wrapWords({
        container: prepareFragment,
        classname: wordClassName,
        tagName: wordTag,
        ignore,
    });
    const lettersMeta = [];
    // If enabled, wrap words into letters
    if (hasLetters) {
        const wrappedLetters = wrapLetters({
            wordsMeta,
            classname: letterClassName,
            tagName: letterTag,
            ignore,
        });
        lettersMeta.push(...wrappedLetters.lettersMeta);
    }
    // Append the prepared fragment
    container.appendChild(prepareFragment);
    return { wordsMeta, lettersMeta };
}
//# sourceMappingURL=splitBase.js.map