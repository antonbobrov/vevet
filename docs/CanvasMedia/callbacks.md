# Callbacks

<!-- -->

note

All **[Canvas callbacks](https://vevetjs.com/docs/Canvas/callbacks.md)** are available in this class.

### `render`[​](#render "Direct link to render")

Fires when the canvas is rendered.

```
const canvas = new CanvasMedia({

  container: document.getElementById('container'),

  media: document.querySelector('img'),

  onRender: () => console.log('render'),

});
```

or:

```
const destruct = canvas.on('render', () => console.log('render'));



// Cancel the callback

destruct();
```
