import { ISplitTextLineMeta, ISplitTextWordMeta } from '../types';
interface IProps {
    container: HTMLElement;
    hasLinesWrapper: boolean;
    wordsMeta: ISplitTextWordMeta[];
    lineClassName: string;
    lineWrapperClassName: string;
    tagName: keyof HTMLElementTagNameMap;
}
interface ILine extends ISplitTextLineMeta {
    nodes: Node[];
}
export declare function childOf(element: Element, parent: Element): boolean;
/**
 * Wraps each word in the container into lines, based on their vertical position.
 */
export declare function wrapLines({ container, hasLinesWrapper, wordsMeta, lineClassName, lineWrapperClassName, tagName, }: IProps): {
    linesMeta: ILine[];
    destroy: () => boolean;
};
export {};
//# sourceMappingURL=wrapLines.d.ts.map