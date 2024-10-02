import { NSplitText } from '../types';

interface IProps {
  words: NSplitText.IWord[];
  classname: string;
  tagName: keyof HTMLElementTagNameMap;
}

/**
 * Wraps each letter in every word inside the container with the specified HTML tag and class name.
 */
export function wrapLetters({ words, classname, tagName }: IProps) {
  const letters: NSplitText.ILetter[] = [];

  // Iterate over each word to wrap its letters
  words.forEach((word) => {
    const textNode = word.element.childNodes[0];
    const text = textNode.textContent;

    if (!text) {
      return;
    }

    // Split the word into individual letters
    const splitLetters = text.split('');

    splitLetters.forEach((splitLetter) => {
      // Create a new element for each letter
      const element = document.createElement(tagName);
      element.style.display = 'inline-block';
      element.classList.add(classname);
      element.appendChild(document.createTextNode(splitLetter));

      // Append the letter element to the word's container
      word.element.appendChild(element);

      const letter: NSplitText.ILetter = { element, text: splitLetter };

      // Add the letter to the word's letters array and the global letters array
      word.letters.push(letter);
      letters.push(letter);
    });

    // Remove the original text node after wrapping the letters
    textNode.remove();
  });

  return { letters };
}
