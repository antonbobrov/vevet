# Callbacks

<!-- -->

note

All **[Module callbacks](https://vevetjs.com/docs/base/Module/.md#callbacks)** are available in this class.

### `render`[​](#render "Direct link to render")

Called during marquee rendering.

```
const marquee = new Marquee({

  container,

  onRender: () => console.log('render'),

});
```

or:

```
const destruct = marquee.on('render', () => console.log('render'));



// Cancel the callback

destruct();
```

### `resize`[​](#resize "Direct link to resize")

Called when the marquee is resized.

```
const marquee = new Marquee({

  container,

  onResize: () => console.log('resize'),

});
```

or:

```
const destruct = marquee.on('resize', () => console.log('resize'));



// Cancel the callback

destruct();
```
