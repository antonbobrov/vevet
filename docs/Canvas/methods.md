# Methods

<!-- -->

note

All **[Module methods](https://vevetjs.com/docs/base/Module/.md#methods)** are available in this class.

### `render`[​](#render "Direct link to render")

Renders content on the canvas **only if `canRender === true`**.<br /><!-- -->If the canvas has zero size, the render callback will be skipped.

```
const instance = new Canvas();



instance.render(({ canvas, ctx, dpr, width, height }) => {

  // Draw your scene here

});
```

### `resize`[​](#resize "Direct link to resize")

Triggers a canvas resize based on container or viewport dimensions.

```
const instance = new Canvas();



instance.resize();
```

### `updateProps`[​](#updateprops "Direct link to updateprops")

Updates instance properties.

```
const instance = new Canvas();



instance.updateProps({

  width: 100,

  height: 100,

});
```

### `destroy`[​](#destroy "Direct link to destroy")

Destroys the instance and cleans up resources.

```
const instance = new Canvas();



instance.destroy();
```
