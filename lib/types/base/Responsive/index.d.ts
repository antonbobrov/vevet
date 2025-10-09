import { TResponsiveProps, TResponsiveRule, TResponsiveSource } from './types';
export * from './types';
export declare class Responsive<T extends TResponsiveSource> {
    protected _source: T;
    protected _rules: TResponsiveRule<T>[];
    protected _onChange?: ((props: TResponsiveProps<T>) => void) | undefined;
    /** Tracks whether the instance has been destroyed */
    protected _isDestroyed: boolean;
    /** Destroyable actions */
    protected _destructors: (() => void)[];
    /** Previously active breakpoints */
    protected _prevBreakpoints: string;
    /** Initial props */
    protected _initProps: TResponsiveProps<T>;
    /** Current props */
    protected _props: TResponsiveProps<T>;
    /** Current props */
    get props(): TResponsiveProps<T>;
    constructor(_source: T, _rules: TResponsiveRule<T>[], _onChange?: ((props: TResponsiveProps<T>) => void) | undefined);
    /** Set initial props */
    protected _fetchInitProps(): void;
    /** Get active rules */
    protected _getActiveRules(): TResponsiveRule<T>[];
    /** Get responsive props */
    protected _getResponsiveProps(): {};
    /** Update properties */
    protected _handleUpdate(): void;
    /**
     * Destroy the instance and clean up resources.
     *
     * The instance is destroyed automatically when it is used to mutate Module's props.
     */
    destroy(): void;
}
//# sourceMappingURL=index.d.ts.map