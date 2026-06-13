# Callbacks

<!-- -->

note

All **[Module callbacks](https://vevetjs.com/docs/base/Module/.md#callbacks)** are available in this class.

### `update`[​](#update "Direct link to update")

Triggered when the scrollbar updates its position.

```
const instance = new Scrollbar({

  onUpdate: () => console.log('update'),

});
```

or:

```
const destruct = instance.on('update', () => console.log('update'));



// Cancel the callback

destruct();
```

### `resize`[​](#resize "Direct link to resize")

Triggered when the scrollbar resizes.

```
const instance = new Scrollbar({

  onResize: () => console.log('resize'),

});
```

or:

```
const destruct = instance.on('resize', () => console.log('resize'));



// Cancel the callback

destruct();
```

### `show`[​](#show "Direct link to show")

Triggered when the scrollbar is shown.

```
const instance = new Scrollbar({

  onShow: () => console.log('show'),

});
```

or:

```
const destruct = instance.on('show', () => console.log('show'));



// Cancel the callback

destruct();
```

### `hide`[​](#hide "Direct link to hide")

Triggered when the scrollbar is hidden.

```
const instance = new Scrollbar({

  onHide: () => console.log('hide'),

});
```

or:

```
const destruct = instance.on('hide', () => console.log('hide'));



// Cancel the callback

destruct();
```

### `swipeStart`[​](#swipestart "Direct link to swipestart")

Triggered when swipe starts.

```
const instance = new Scrollbar({

  onSwipeStart: (coords) => console.log(coords),

});
```

or:

```
const destruct = instance.on('swipeStart', (coords) => console.log(coords));



// Cancel the callback

destruct();
```

### `swipe`[​](#swipe "Direct link to swipe")

Triggered during swipe movement.

```
const instance = new Scrollbar({

  onSwipe: (coords) => console.log(coords),

});
```

or:

```
const destruct = instance.on('swipe', (coords) => console.log(coords));



// Cancel the callback

destruct();
```

### `swipeEnd`[​](#swipeend "Direct link to swipeend")

Triggered when swipe ends.

```
const instance = new Scrollbar({

  onSwipeEnd: (coords) => console.log(coords),

});
```

or:

```
const destruct = instance.on('swipeEnd', (coords) => console.log(coords));



// Cancel the callback

destruct();
```
