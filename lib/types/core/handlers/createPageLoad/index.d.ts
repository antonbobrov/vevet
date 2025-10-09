interface IProps {
    prefix: string;
    applyClassNames: boolean;
}
export declare function createPageLoad({ prefix, applyClassNames }: IProps): {
    onLoad: (callback: () => void) => () => void;
    getIsLoaded: () => boolean;
};
export {};
//# sourceMappingURL=index.d.ts.map