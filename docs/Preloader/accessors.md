# Accessors

<!-- -->

note

All **[Module accessors](https://vevetjs.com/docs/base/Module/.md#accessors)** are available in this class.

### `isLoaded`[​](#isloaded "Direct link to isloaded")

Type: `boolean`

Whether the load signal has fired and [`loaded`](https://vevetjs.com/docs/Preloader/callbacks.md#loaded) was emitted.

* `false` until page load
* becomes `true` before [`hide()`](https://vevetjs.com/docs/Preloader/methods.md#hide) can run

```
const preloader = new Preloader({

  container: document.getElementById('container'),

  hide: false,

});



preloader.isLoaded; // false



preloader.on('loaded', () => {

  preloader.isLoaded; // true

  preloader.hide(500);

});
```

### `isHidden`[​](#ishidden "Direct link to ishidden")

Type: `boolean`

Returns whether the preloader is currently hidden.<br /><!-- -->This becomes `true` only after:

* the page is fully loaded, and
* the hiding animation (automatic or manual) is completed.

```
const preloader = new Preloader({

  container: document.getElementById('container'),

});



preloader.isHidden; // detect final hidden state
```

### `isHiding`[​](#ishiding "Direct link to ishiding")

Type: `boolean`

Whether [`hide()`](https://vevetjs.com/docs/Preloader/methods.md#hide) has started but [`hidden`](https://vevetjs.com/docs/Preloader/callbacks.md#hidden) has not fired yet.

```
preloader.on('hide', () => {

  console.log(preloader.isHiding); // true

  console.log(preloader.isHidden); // false — fade in progress

});



preloader.on('hidden', () => {

  console.log(preloader.isHidden); // true

});
```
