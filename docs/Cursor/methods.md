# Methods

<!-- -->

note

All **[Module methods](https://vevetjs.com/docs/base/Module/.md#methods)** are available in this class.

### `attachCursor`[​](#attachcursor "Direct link to attachcursor")

Registers a **cursor type** and appends its element into the cursor's **[inner](https://vevetjs.com/docs/Cursor/accessors.md#inner)** container.

Each cursor type is identified by a unique `type` string and can later be activated when hovering elements.

See **[ICursorType](https://vevetjs.com/docs/Cursor/interfaces.md#icursortype)**.

```
const cursor = new Cursor();



cursor.attachCursor({

  element: document.getElementById('cursor-type'),

  type: 'some_type', // unique cursor type identifier

});
```

### `attachHover`[​](#attachhover "Direct link to attachhover")

Registers a **hoverable element** and binds cursor interactions to it.

While hovering the element, the cursor can:

* change size,
* snap to the element center,
* apply sticky behavior (with configurable amplitude and friction),
* switch cursor type.

Returns a **cleanup function** that removes all listeners and bindings.

For the full configuration options, see **[ICursorHoverElementProps](https://vevetjs.com/docs/Cursor/interfaces.md#icursorhoverelementprops)**.

```
const cursor = new Cursor();



const remove = cursor.attachHover({

  element: document.getElementById('hover-element'), // hoverable element

  // optional: separate event emitter, different from visual element

  emitter: document.getElementById('hover-area'),

  type: 'some_type',

  snap: true,

  width: 'auto',

  height: 'auto',

  padding: 10,

  sticky: true,

  // smoothness of sticky follow (defaults to cursor lerp)

  stickyLerp: 0.15,

  // make sticky element smoothly return to origin

  stickyFriction: 0.2,

  // sticky movement range; supports number, 'auto', or { x, y } with CSS units

  stickyAmplitude: { x: '2rem', y: 'auto' },

});



// Remove interaction

remove();
```

### `render`[​](#render "Direct link to render")

Usually not required, as rendering is handled automatically, but can be useful after manual state changes.

```
const cursor = new Cursor();



cursor.render();
```

### `updateProps`[​](#updateprops "Direct link to updateprops")

Dynamically updates cursor instance properties at runtime.

```
const cursor = new Cursor();



cursor.updateProps({

  width: 100,

  height: 100,

});
```

### `destroy`[​](#destroy "Direct link to destroy")

Destroys the cursor instance and cleans up resources.

```
const cursor = new Cursor();



cursor.destroy();
```
