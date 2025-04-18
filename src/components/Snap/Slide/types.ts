export interface ISnapSlideProps {
  /**
   * Size of the slide in pixels or 'auto'. 'auto' detects slide size depending on the element or container size.
   * Supports css units like `px`, `rem`, `vw`, `vh`, `svh`.
   * @default 'auto'
   */
  size?: number | 'auto' | (string & {});

  /**
   * If the slide is virtual. When true, the element will be automatically appended to the container when it becomes visible.
   * @default false
   */
  virtual?: boolean;
}
