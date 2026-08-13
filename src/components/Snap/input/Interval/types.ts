export interface ISnapIntervalProps {
  /**
   * Interval between automatic slide changes in milliseconds. If `null`, the interval is disabled.
   * @default null
   */
  interval?: number | null;

  /**
   * Direction of automatic slide changes. Can be either 'next' or 'prev'.
   * @default 'next'
   */
  intervalDirection?: 'next' | 'prev';
}
