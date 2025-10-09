import { ISplitTextStaticProps, ISplitTextWordMeta } from '../types';
interface IProps {
    container: ChildNode;
    classname: string;
    tagName: keyof HTMLElementTagNameMap;
    ignore: ISplitTextStaticProps['ignore'];
}
/**
 * Wraps each word inside the container in an HTML element with the specified tag and class.
 */
export declare function wrapWords({ container, classname, tagName, ignore }: IProps): ISplitTextWordMeta[];
export {};
//# sourceMappingURL=wrapWords.d.ts.map