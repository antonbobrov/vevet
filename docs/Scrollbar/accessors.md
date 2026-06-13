# Accessors

<!-- -->

note

All **[Module accessors](https://vevetjs.com/docs/base/Module/.md#accessors)** are available in this class.

### `axis`[​](#axis "Direct link to axis")

Type: `"x" | "y"`

Scrolling direction.

```
const instance = new Scrollbar();



instance.axis; // returns "x" or "y"
```

### `container`[​](#container "Direct link to container")

Type: `Window | HTMLElement`

The element to which the scrollbar is applied.

```
const instance = new Scrollbar();



instance.container; // returns Window or HTMLElement
```

### `outer`[​](#outer "Direct link to outer")

Type: `HTMLElement`

Scrollbar outer element.

```
const instance = new Scrollbar();



instance.outer; // returns the scrollbar wrapper element
```

### `parent`[​](#parent "Direct link to parent")

Type: `HTMLElement`

The element where the scrollbar is appended. If `parent` is not set, it defaults to `container` or `document.body` (if applied to `window`).

```
const instance = new Scrollbar();



instance.parent; // returns the element inside which scrollbar is appended
```

### `scrollableSize`[​](#scrollablesize "Direct link to scrollablesize")

Type: `number`

Returns the total scrollable distance.

```
const instance = new Scrollbar();



instance.scrollableSize; // returns container scrollable size
```

### `scrollElement`[​](#scrollelement "Direct link to scrollelement")

Type: `HTMLElement`

The actual scrollable element. Returns `document.documentElement` for `window`, otherwise the `container` itself.

```
const instance = new Scrollbar();



instance.scrollElement; // returns target scrollable element
```

### `scrollSize`[​](#scrollsize "Direct link to scrollsize")

Type: `number`

Returns the total scroll width/height of the content.

```
const instance = new Scrollbar();



instance.scrollSize;
```

### `scrollValue`[​](#scrollvalue "Direct link to scrollvalue")

Type: `number`

Returns scrollTop or scrollLeft of the scrollable element.

```
const instance = new Scrollbar();



instance.scrollValue; // returns scrollTop or scrollLeft value
```

### `thumb`[​](#thumb "Direct link to thumb")

Type: `HTMLElement`

Scrollbar thumb element (draggable handle).

```
const instance = new Scrollbar();



instance.thumb; // returns the scrollbar lever element
```

### `thumbSize`[​](#thumbsize "Direct link to thumbsize")

Type: `number`

Returns the current thumb size.

```
const instance = new Scrollbar();



instance.thumbSize; // returns size of the scrollbar lever element
```

### `track`[​](#track "Direct link to track")

Type: `HTMLElement`

Scrollbar track element (the container of the thumb).

```
const instance = new Scrollbar();



instance.track; // returns the scrollbar track container
```

### `trackSize`[​](#tracksize "Direct link to tracksize")

Type: `number`

Returns the current track size.

```
const instance = new Scrollbar();



instance.trackSize; // returns size of the scrollbar track container
```
