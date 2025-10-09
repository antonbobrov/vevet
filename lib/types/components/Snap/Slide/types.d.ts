export interface ISnapSlideProps {
    /**
     * Slide size. Supported values:
     * - `auto` detects slide size depending on the element or container size.
     * - `stretch` detects slide size as the container size.
     * - `number` defines the slide size in pixels.
     * - css units like `px`, `rem`, `vw`, `vh`, `svh`.
     */
    size?: number | 'auto' | 'stretch' | (string & {}) | null;
    /**
     * If the slide is virtual. When true, the element will be automatically appended to the container when it becomes visible.
     * @default false
     */
    virtual?: boolean;
}
//# sourceMappingURL=types.d.ts.map