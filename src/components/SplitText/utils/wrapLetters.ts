import { NSplitText } from '../types';

interface IProps {
  words: NSplitText.IWord[];
  classname: string;
}

/** Wrap each word inside the container */
export function wrapLetters({ words, classname }: IProps) {
  const letters: NSplitText.ILetter[] = [];

  words.forEach((word) => {
    const textNode = word.element.childNodes[0];
    const text = textNode.textContent;

    if (!text) {
      return;
    }

    const slitLetters = text.split('');

    slitLetters.forEach((splitLetter) => {
      const element = document.createElement('span');
      element.style.display = 'inline-block';
      element.classList.add(classname);
      element.appendChild(document.createTextNode(splitLetter));

      word.element.appendChild(element);

      const letter: NSplitText.ILetter = { element, text: splitLetter };

      word.letters.push(letter);
      letters.push(letter);
    });

    textNode.remove();
  });

  return { letters };
}
