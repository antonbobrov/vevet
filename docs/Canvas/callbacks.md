# Callbacks

<!-- -->

note

All **[Module callbacks](https://vevetjs.com/docs/base/Module/.md#callbacks)** are available in this class.

### `resize`[​](#resize "Direct link to resize")

Fires when the canvas is resized.

```
const canvas = new Canvas({

  onResize: () => console.log('resize'),

});
```

or:

```
const destruct = canvas.on('resize', () => console.log('resize'));



// Cancel the callback

destruct();
```
