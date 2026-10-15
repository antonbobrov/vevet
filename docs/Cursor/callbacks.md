# Callbacks

<!-- -->

note

All **[Module callbacks](https://vevetjs.com/docs/base/Module/.md#callbacks)** are available in this class.

### `render`[​](#render "Direct link to render")

Triggered on each render frame when the cursor is active.

Useful for:

* syncing external animations,
* debugging cursor state,
* custom visual effects.

```
const cursor = new Cursor({

  onRender: () => console.log('render'),

});
```

or:

```
const destruct = cursor.on('render', () => console.log('Cursor rendered'));



// Cancel the callback

destruct();
```

### `hoverEnter`[​](#hoverenter "Direct link to hoverenter")

Triggered when an attached element is hovered.

```
const cursor = new Cursor({

  onHoverEnter: (data) => console.log(data),

});
```

or:

```
const destruct = cursor.on('hoverEnter', (data) => console.log(data));



// Cancel the callback

destruct();
```

### `hoverLeave`[​](#hoverleave "Direct link to hoverleave")

Triggered when an attached element is no longer hovered.

```
const cursor = new Cursor({

  onHoverLeave: (data) => console.log(data),

});
```

or:

```
const destruct = cursor.on('hoverLeave', (data) => console.log(data));



// Cancel the callback

destruct();
```

### `typeShow`[​](#typeshow "Direct link to typeshow")

Triggered when a cursor type is visible.

```
const cursor = new Cursor({

  onTypeShow: (data) => console.log(data),

});
```

or:

```
const destruct = cursor.on('typeShow', (data) => console.log(data));



// Cancel the callback

destruct();
```

### `typeHide`[​](#typehide "Direct link to typehide")

Triggered when a cursor type becomes invisible.

```
const cursor = new Cursor({

  onTypeHide: (data) => console.log(data),

});
```

or:

```
const destruct = cursor.on('typeHide', (data) => console.log(data));



// Cancel the callback

destruct();
```

### `noType`[​](#notype "Direct link to notype")

Triggered when no cursor type is applied.

```
const cursor = new Cursor({

  onNoType: (data) => console.log(data),

});
```

or:

```
const destruct = cursor.on('noType', () => console.log('no type applied'));



// Cancel the callback

destruct();
```
