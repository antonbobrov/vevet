# Methods

<!-- -->

note

All **[Module methods](https://vevetjs.com/docs/base/Module/.md#methods)** are available in this class.

### `render`[​](#render "Direct link to render")

Moves the marquee by `step` and reapplies transforms to all items.

```
const marquee = new Marquee({ container });



marquee.render(2); // with step 2

marquee.render(-1); // with step -1
```

### `resize`[​](#resize "Direct link to resize")

Recomputes item sizes, clone count, and total loop size, then refreshes transforms.

```
const marquee = new Marquee({ container });



marquee.resize();
```

### `updateProps`[​](#updateprops "Direct link to updateprops")

Dynamically updates instance properties.

```
const marquee = new Marquee({ container });



marquee.updateProps({

  enabled: false,

});
```

### `destroy`[​](#destroy "Direct link to destroy")

Destroys the instance and cleans up resources.

```
const marquee = new Marquee({ container });



marquee.destroy();
```
