# Callbacks

<!-- -->

note

All **[Preloader's callbacks](https://vevetjs.com/docs/Preloader/callbacks.md)** are available in this class.

### `progress`[​](#progress "Direct link to progress")

Fired when the preloader's progress updates.

```
const preloader = new ProgressPreloader({

  container: document.getElementById('container'),

  onProgress: () => console.log(preloader.progress),

});
```

or:

```
const destruct = preloader.on('progress', () =>

  console.log(preloader.progress),

);



// Cancel the callback

destruct();
```

### `resource`[​](#resource "Direct link to resource")

Fired whenever a resource updates its loaded weight —<br /><!-- -->both DOM-based (`data-loaded` changes) and virtual resources.

```
const preloader = new ProgressPreloader({

  container: document.getElementById('container'),

  onResource: ({ id, weight, loaded }) => {

    console.log(id, `loaded ${loaded} / ${weight}`);

  },

});
```

or:

```
const destruct = preloader.on('resource', ({ id, weight, loaded }) => {

  console.log(id, `loaded ${loaded} / ${weight}`);

});



// Cancel the callback

destruct();
```
