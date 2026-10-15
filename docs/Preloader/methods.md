# Methods

<!-- -->

note

All **[Module methods](https://vevetjs.com/docs/base/Module/.md#methods)** are available in this class.

### `hide`[​](#hide "Direct link to hide")

Hides the preloader with a custom animation duration.<br /><!-- -->The method works only after the page is loaded — if called earlier or when already hidden, it returns `undefined`.

See **[demo](https://vevetjs.com/docs/Preloader/demos.md#custom-hiding-logic)**

```
const preloader = new Preloader({

  container: document.getElementById('container'),

});



preloader.hide(500); // hide preloader within 500ms



// hide preloader within 500ms and emit a callback

preloader.hide(500, () => {

  console.log('hide');

});



// notice that the callback may be destroyed before it is called

const cancel = preloader.hide(500, () => {

  console.log('hide');

});

cancel?.();



const result = preloader.hide(500, () => {

  console.log('hide');

});

// => undefined if the page isn't loaded yet or the preloader is already hidden
```

### `onHidden`[​](#onhidden "Direct link to onhidden")

Registers a callback for when the preloader is fully hidden.

```
const preloader = new Preloader({

  container: document.getElementById('container'),

});



const cancelCallback = preloader.onHidden(() => console.log('hidden'));

cancelCallback();
```

### `onHide`[​](#onhide "Direct link to onhide")

Registers a callback for when the preloader starts hiding.

```
const preloader = new Preloader({

  container: document.getElementById('container'),

});



const cancelCallback = preloader.onHide(() => console.log('hide'));

cancelCallback?.();
```

### `destroy`[​](#destroy "Direct link to destroy")

Destroys the instance and cleans up resources.

```
const preloader = new Preloader({

  container: document.getElementById('container'),

});



preloader.destroy();
```
