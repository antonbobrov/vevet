# Props

<!-- -->

## Static Props[​](#static-props "Direct link to Static Props")

Static properties are set during initialization and cannot be modified later.

### `hasOut`[​](#props.hasOut "Direct link to props.hasOut")

* **Type:** `boolean`
* **Default:** `true`
* Determines whether elements leaving the viewport should trigger an `out` event.
* Set to `false` for one-time triggers to improve performance and reduce callback spam.
* **See [demo](https://vevetjs.com/docs/InView/demos.md#in-out-animation)**

```
// Enable out events (default)

const observer = new InView({

  hasOut: true,

});



// Disable out events for one-time triggers

const observer = new InView({

  hasOut: false,

});
```

### `maxInitialDelay`[​](#props.maxInitialDelay "Direct link to props.maxInitialDelay")

* **Type:** `number`
* **Default:** `1000`
* Sets the maximum delay (in milliseconds) for initial element visibility detection on page load.
* The delay is calculated based on the element's position relative to the viewport, creating a staggered animation effect.
* Elements closer to the viewport have shorter delays, while elements further away have longer delays (up to `maxInitialDelay`).
* Set to `0` to disable initial delays.
* **See [demo](https://vevetjs.com/docs/InView/demos.md#control)**

```
// Stagger animations over 1 second (default)

const observer = new InView({

  maxInitialDelay: 1000,

});



// Longer stagger effect

const observer = new InView({

  maxInitialDelay: 2000,

});



// No initial delay

const observer = new InView({

  maxInitialDelay: 0,

});
```

### `scrollDirection`[​](#props.scrollDirection "Direct link to props.scrollDirection")

* **Type:** `'horizontal' | 'vertical'`
* **Default:** `'vertical'`
* Defines the primary scrolling axis used for delay calculations and direction detection.
* Use `'horizontal'` for horizontal scrolling pages or carousels.
* Direction values will be `'fromLeft'`/`'fromRight'` for horizontal, `'fromTop'`/`'fromBottom'` for vertical.
* **See [demo](https://vevetjs.com/docs/InView/demos.md#horizontal-inview)**

```
// Vertical scrolling (default)

const observer = new InView({

  scrollDirection: 'vertical',

});



// Horizontal scrolling

const observer = new InView({

  scrollDirection: 'horizontal',

});
```

## Mutable Props[​](#mutable-props "Direct link to Mutable Props")

Mutable properties can be updated at runtime using `.updateProps()`.

Adaptive props

To apply different values by viewport or device, use **[Responsive](https://vevetjs.com/docs/base/Responsive/.md#example-with-module)** with this component as the source. Props will update automatically when breakpoints change.

### `enabled`[​](#props.enabled "Direct link to props.enabled")

* **Type:** `boolean`
* **Default:** `true`
* Enables or disables the `IntersectionObserver` instance.
* When disabled, no visibility events are triggered, but elements remain registered.
* Useful for temporarily pausing observation without removing elements.
* **See [demo](https://vevetjs.com/docs/InView/demos.md#control)**

```
const observer = new InView({

  enabled: false, // Start disabled

});



// Enable later

observer.updateProps({

  enabled: true,

});



// Disable temporarily

observer.updateProps({

  enabled: false,

});
```

### `rootMargin`[​](#props.rootMargin "Direct link to props.rootMargin")

* **Type:** `string`
* **Default:** `'0% 0% -5% 0%'`
* Specifies the root margin offsets for the `IntersectionObserver`, allowing fine-tuned visibility detection.
* The format is `'top right bottom left'` (same as CSS margin).
* Negative values shrink the detection area, positive values expand it.
* The default `'0% 0% -5% 0%'` means elements trigger when 5% of their height is visible from the bottom.
* **Read more about [rootMargin](https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver/rootMargin)**

```
// Default: trigger when 5% visible from bottom

const observer = new InView({

  rootMargin: '0% 0% -5% 0%',

});



// Trigger earlier (when 20% visible)

observer.updateProps({

  rootMargin: '0% 0% -20% 0%',

});



// Trigger later (only when fully visible)

observer.updateProps({

  rootMargin: '0% 0% 0% 0%',

});



// Trigger before element enters viewport

observer.updateProps({

  rootMargin: '0% 0% 10% 0%',

});
```
