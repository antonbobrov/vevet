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

### `requestHide`[​](#requesthide "Direct link to requesthide")

Triggered when the page is loaded and a hide is requested.<br /><!-- -->Fires immediately after [`loaded`](#loaded), before [`hide`](#hide) starts. When [`hide`](https://vevetjs.com/docs/Preloader/props.md#props.hide) is a number, auto-hide follows in the same tick.

Use this callback for custom hide timing with `hide: false` — e.g. call [`hide()`](https://vevetjs.com/docs/Preloader/methods.md#hide) once your own readiness checks pass.

```
const preloader = new Preloader({

  container: document.getElementById('container'),

  hide: false,

  onRequestHide: () => preloader.hide(500),

});
```

or:

```
const destruct = preloader.on('requestHide', () => console.log('requestHide'));



// Cancel the callback

destruct();
```

### `hide`[​](#hide "Direct link to hide")

Triggered when the preloader starts hiding — either automatically (if `hide` props is a number) or via manual `.hide()`.<br /><!-- -->Preceded by [`requestHide`](#requesthide).

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
