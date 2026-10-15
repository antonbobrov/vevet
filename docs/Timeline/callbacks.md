# Callbacks

<!-- -->

note

All **[Module callbacks](https://vevetjs.com/docs/base/Module/.md#callbacks)** are available in this class.

### `start`[​](#start "Direct link to start")

Fired when linear progress is set to `0` (including via [`reset`](https://vevetjs.com/docs/Timeline/methods.md#reset)).

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

Fired on every progress change.

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

Fired when linear progress reaches `1`.

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

### `play`[​](#play "Direct link to play")

Fired when [`play()`](https://vevetjs.com/docs/Timeline/methods.md#play) is called.

```
const tm = new Timeline({

  onPlay: () => console.log('play'),

});
```

or:

```
const destruct = tm.on('play', () => console.log('play'));



// Cancel the callback

destruct();
```

### `pause`[​](#pause "Direct link to pause")

Fired when an active rAF loop is paused via [`pause()`](https://vevetjs.com/docs/Timeline/methods.md#pause).

```
const tm = new Timeline({

  onPause: () => console.log('pause'),

});
```

or:

```
const destruct = tm.on('pause', () => console.log('pause'));



// Cancel the callback

destruct();
```

### `reverse`[​](#reverse "Direct link to reverse")

Fired when [`reverse()`](https://vevetjs.com/docs/Timeline/methods.md#reverse) is called.

```
const tm = new Timeline({

  onReverse: () => console.log('reverse'),

});
```

or:

```
const destruct = tm.on('reverse', () => console.log('reverse'));



// Cancel the callback

destruct();
```

### `reset`[​](#reset "Direct link to reset")

Fired when [`reset()`](https://vevetjs.com/docs/Timeline/methods.md#reset) is called, before progress is set to `0`.

```
const tm = new Timeline({

  onReset: () => console.log('reset'),

});
```

or:

```
const destruct = tm.on('reset', () => console.log('reset'));



// Cancel the callback

destruct();
```

### `resume`[​](#resume "Direct link to resume")

Fired when playback resumes after a pause via [`play()`](https://vevetjs.com/docs/Timeline/methods.md#play) or [`reverse()`](https://vevetjs.com/docs/Timeline/methods.md#reverse).

Emitted before `play` / `reverse`.

```
const tm = new Timeline({

  onResume: () => console.log('resume'),

});
```

or:

```
const destruct = tm.on('resume', () => console.log('resume'));



// Cancel the callback

destruct();
```
