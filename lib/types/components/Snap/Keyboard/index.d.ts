import { Snap } from '..';
export declare class SnapKeyboard {
    protected _snap: Snap;
    /** Listeners to destruct */
    protected _destructors: (() => void)[];
    constructor(_snap: Snap);
    /** Snap component */
    protected get snap(): Snap<import("..").ISnapCallbacksMap, import("..").ISnapStaticProps, import("..").ISnapMutableProps>;
    /** Handle scroll lock */
    protected _handleScroll(): void;
    /** Destroy wheel listeners */
    protected _destroy(): void;
}
//# sourceMappingURL=index.d.ts.map