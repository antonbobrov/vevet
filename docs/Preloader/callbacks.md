# Callbacks

<!-- -->

note

All **[Module callbacks](https://vevetjs.com/docs/base/Module/.md#callbacks)** are available in this class.

### `loaded`[​](#loaded "Direct link to loaded")

Triggered once, when the page is fully loaded.

```
const preloader = new Preloader({

  container: document.getElementById('container'),

  onLoaded: () => console.log('loaded'),

});
```

or:

```
const destruct = preloader.on('loaded', () => console.log('loaded'));



// Cancel the callback

destruct();
```

### `hide`[​](#hide "Direct link to hide")

Triggered when the preloader starts hiding — either automatically (if `hide` props is a number) or via manual `.hide()`.

```
const preloader = new Preloader({

  container: document.getElementById('container'),

  onHide: () => console.log('hide'),

});
```

or:

```
const destruct = preloader.on('hide', () => console.log('hide'));



// Cancel the callback

destruct();
```

### `hidden`[​](#hidden "Direct link to hidden")

Triggered only after the hiding animation fully completes.<br /><!-- -->If hiding is disabled (`hide: false`) — this callback runs **only after a manual `.hide()`**.

```
const preloader = new Preloader({

  container: document.getElementById('container'),

  onHidden: () => console.log('hidden'),

});
```

or:

```
const destruct = preloader.on('hidden', () => console.log('hidden'));



// Cancel the callback

destruct();
```
