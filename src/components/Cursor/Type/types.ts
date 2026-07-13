/**
 * Named cursor visual registered via {@link Cursor.attachCursor}.
 */
export interface ICursorType {
  /** Custom cursor element appended to {@link Cursor.inner} */
  element: Element;

  /** Unique type id; activated from {@link ICursorHoverElementProps.type} */
  type: string;
}
