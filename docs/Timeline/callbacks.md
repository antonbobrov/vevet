# Callbacks

<!-- -->

note

All **[Module callbacks](https://vevetjs.com/docs/base/Module/.md#callbacks)** are available in this class.

### `start`[​](#start "Direct link to start")

Triggered when the timeline starts.

```
const tm = new Timeline({

  onStart: () => console.log('start'),

});
```

or:

```
const destruct = tm.on('start', () => console.log('start'));



// Cancel the callback

destruct();
```

### `update`[​](#update "Direct link to update")

Triggered on every timeline update.

Provides both:

* `progress` — linear progress (`0 → 1`)
* `eased` — progress with easing applied

```
const tm = new Timeline({

  onUpdate: ({ progress, eased }) => {

    // progress — linear

    // eased — eased value

  },

});
```

or:

```
const destruct = tm.on('update', ({ progress, eased }) => {

  console.log('update', progress, eased);

});



// Cancel the callback

destruct();
```

This allows you to:

* use `progress` for logic,
* use `eased` for animation interpolation.

### `end`[​](#end "Direct link to end")

Triggered when the timeline completes.

```
const tm = new Timeline({

  onEnd: () => console.log('end'),

});
```

or:

```
const destruct = tm.on('end', () => console.log('end'));



// Cancel the callback

destruct();
```
