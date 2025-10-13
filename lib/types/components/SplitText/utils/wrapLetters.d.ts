import { ISplitTextLetterMeta, ISplitTextStaticProps, ISplitTextWordMeta } from '../types';
interface IProps {
    wordsMeta: ISplitTextWordMeta[];
    classname: string;
    tagName: keyof HTMLElementTagNameMap;
    ignore: ISplitTextStaticProps['ignore'];
}
/**
 * Wraps each letter in every word inside the container with the specified HTML tag and class name.
 */
export declare function wrapLetters({ wordsMeta, classname, tagName, ignore }: IProps): {
    lettersMeta: ISplitTextLetterMeta[];
};
export {};
//# sourceMappingURL=wrapLetters.d.ts.map