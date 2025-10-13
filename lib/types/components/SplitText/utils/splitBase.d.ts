import { ISplitTextLetterMeta, ISplitTextStaticProps } from '../types';
interface IProps {
    container: HTMLElement;
    letterClassName: string;
    wordClassName: string;
    hasLetters: boolean;
    letterTag: keyof HTMLElementTagNameMap;
    wordTag: keyof HTMLElementTagNameMap;
    ignore: ISplitTextStaticProps['ignore'];
}
/**
 * Splits text in the container into words and optionally into letters.
 */
export declare function splitBase({ container, letterClassName, wordClassName, hasLetters, letterTag, wordTag, ignore, }: IProps): {
    wordsMeta: import("../types").ISplitTextWordMeta[];
    lettersMeta: ISplitTextLetterMeta[];
};
export {};
//# sourceMappingURL=splitBase.d.ts.map