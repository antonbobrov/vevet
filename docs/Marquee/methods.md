# Methods

<!-- -->

note

All **[Module methods](https://vevetjs.com/docs/base/Module/.md#methods)** are available in this class.

### `render`[​](#render "Direct link to render")

Renders the marquee, adjusting element positions.

```
const marquee = new Marquee({ container });



marquee.render(2); // with step 2

marquee.render(-1); // with step -1
```

### `resize`[​](#resize "Direct link to resize")

Resizes the marquee, recalculating element positions and cloning if necessary.

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
