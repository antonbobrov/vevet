# Methods

<!-- -->

note

All **[Canvas methods](https://vevetjs.com/docs/Canvas/methods.md)** are available in this class.

### `render`[​](#render "Direct link to render")

Pre-renders the media resource onto the canvas.<br /><!-- -->For video elements, this renders the **current frame**.<br /><!-- -->This method is called automatically **after initialization and resize**.

```
const canvas = new CanvasMedia({

  container: document.getElementById('container'),

  media: document.querySelector('img'),

  append: true,

});



canvas.render();
```

### `destroy`[​](#destroy "Direct link to destroy")

Destroys the instance and cleans up resources.

```
canvas.destroy();
```
