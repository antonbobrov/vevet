# Callbacks

<!-- -->

note

All **[Module callbacks](https://vevetjs.com/docs/base/Module/.md#callbacks)** are available in this class.

### `in`[​](#in "Direct link to in")

Fires when an element enters the viewport. The callback receives the element and the direction from which it appeared.

**Callback Arguments:**

* `element` - The DOM element that entered the viewport
* `direction` - The direction from which the element entered: `'fromBottom'`, `'fromTop'`, `'fromLeft'`, or `'fromRight'`

```
const observer = new InView({

  onIn: ({ element, direction }) => {

    console.log(element, 'entered viewport from', direction);



    // Use direction for conditional logic

    if (direction === 'fromBottom') {

      // Animate from bottom

    } else if (direction === 'fromTop') {

      // Animate from top

    }

  },

});
```

or using the event listener pattern:

```
const destruct = observer.on('in', ({ element, direction }) => {

  console.log(element, 'entered viewport from', direction);

});



// Cancel the callback

destruct();
```

### `out`[​](#out "Direct link to out")

Fires when an element leaves the viewport. The callback receives the element and the direction from which it disappeared.

**Callback Arguments:**

* `element` - The DOM element that left the viewport
* `direction` - The direction from which the element left: `'fromBottom'`, `'fromTop'`, `'fromLeft'`, or `'fromRight'`

note

The `out` callback only fires if `hasOut: true` (default). Set `hasOut: false` to disable out events for better performance when you only need one-time triggers.

```
const observer = new InView({

  onOut: ({ element, direction }) => {

    console.log(element, 'left viewport from', direction);

  },

});
```

or using the event listener pattern:

```
const destruct = observer.on('out', ({ element, direction }) => {

  console.log(element, 'left viewport from', direction);

});



// Cancel the callback

destruct();
```
