# Interfaces

<!-- -->

## CursorHoverElement[​](#cursorhoverelement "Direct link to CursorHoverElement")

Runtime representation of a hoverable element attached to the cursor. This object is created internally and exposed via the<br />**[hoveredElement](https://vevetjs.com/docs/Cursor/accessors.md#hoveredelement)** accessor while the element is hovered.

```
class CursorHoverElement {

  /** Hoverable DOM element */

  get element(): Element;



  /** Cursor type applied for this element */

  get type(): string;



  /** Whether the cursor snaps to the element center */

  get snap(): boolean;



  /** Target cursor width while hovering */

  get width(): null | number | 'auto';



  /** Target cursor height while hovering */

  get height(): null | number | 'auto';



  /** Padding applied around the cursor */

  get padding(): number;



  /** Whether the element sticks to the cursor */

  get sticky(): boolean;



  /** Sticky parallax strength on the X axis */

  get stickyX(): number;



  /** Sticky parallax strength on the Y axis */

  get stickyY(): number;

}
```

## ICursorHoverElementProps[​](#icursorhoverelementprops "Direct link to ICursorHoverElementProps")

Configuration object passed to **[attachHover()](https://vevetjs.com/docs/Cursor/methods.md#attachhover)**<br /><!-- -->to define cursor behavior for a specific hoverable element.

```
interface ICursorHoverElementProps {

  /** Hoverable DOM element */

  element: Element;



  /**

   * Hover events emitter.

   * If not provided, the element itself will be used.

   * Useful when the visual element and the hover area are different nodes.

   * @default null

   */

  emitter?: Element | null;



  /** Cursor type to activate on hover */

  type?: string;



  /**

   * Debounce time for hover events, in milliseconds

   * @default 16

   */

  hoverDebounce?: number;



  /**

   * Snap cursor to the element center.

   * Does not work with `behavior: "path"`.

   * @default false

   */

  snap?: boolean;



  /**

   * Target cursor width on hover.

   * Supports css units like `px`, `rem`, `vw`, `vh`, `svh`.

   * @default null

   */

  width?: null | number | 'auto' | (string & {});



  /**

   * Target cursor height on hover.

   * Supports css units like `px`, `rem`, `vw`, `vh`, `svh`.

   * @default null

   */

  height?: null | number | 'auto' | (string & {});



  /**

   * Padding applied around the cursor.

   * Supports css units like `px`, `rem`, `vw`, `vh`, `svh`.

   * @default 0

   */

  padding?: number | string;



  /**

   * Enable sticky behavior for the hovered element.

   * @default false

   */

  sticky?: boolean;



  /**

   * Friction factor for smooth sticky animation.

   * When greater than `0`, the element is smoothly attracted back

   * to its original position while still reacting to pointer movement.

   * The higher the value, the stronger the pull-back effect.

   * @default 0

   */

  stickyFriction?: number;



  /**

   * Linear interpolation factor for smooth sticky animation.

   * @default this.props.lerp

   */

  stickyLerp?: number;



  /**

   * Sticky animation amplitude.

   * Supports css units like `px`, `rem`, `vw`, `vh`, `svh`.

   * @default 'auto'

   */

  stickyAmplitude?:

    | TCursorHoverElementStickyAmplitude

    | TCursorHoverElementStickyAmplitudeObject;

}
```

## TCursorHoverElementStickyAmplitude[​](#tcursorhoverelementstickyamplitude "Direct link to TCursorHoverElementStickyAmplitude")

Defines the amplitude of the sticky animation.

```
export type TCursorHoverElementStickyAmplitude =

  | number

  | 'auto'

  | (string & {});
```

## TCursorHoverElementStickyAmplitudeObject[​](#tcursorhoverelementstickyamplitudeobject "Direct link to TCursorHoverElementStickyAmplitudeObject")

Axis-based sticky amplitude configuration.

```
export type TCursorHoverElementStickyAmplitudeObject = {

  x: TCursorHoverElementStickyAmplitude;

  y: TCursorHoverElementStickyAmplitude;

};
```

## ICursorType[​](#icursortype "Direct link to ICursorType")

Custom cursor type configuration.

```
export type TCursorHoverElementStickyAmplitudeObject = {

  /** Custom cursor element */

  element: Element;



  /** Unique cursor type identifier */

  type: string;

};
```
