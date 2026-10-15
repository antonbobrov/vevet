# Methods

<!-- -->

note

All **[Module methods](https://vevetjs.com/docs/base/Module/.md#methods)** are available in this class.

### `lerpFactor`[​](#lerpfactor "Direct link to lerpfactor")

Frame-rate–independent interpolation factor for the last [`duration`](https://vevetjs.com/docs/Raf/accessors.md#duration).

Non-finite `ease` falls back to `1`.

**See [demo](https://vevetjs.com/docs/Raf/demos.md#damping)**

```
const ease = raf.lerpFactor(0.1);

lerp(from, to, ease);
```

### `damp`[​](#damp "Direct link to damp")

Shorthand for `lerp(from, to, raf.lerpFactor(ease))` on the instance.

**See [demo](https://vevetjs.com/docs/Raf/demos.md#damping)**

```
value = raf.damp(value, target, 0.1);
```

### `pause`[​](#pause "Direct link to pause")

Pauses the animation loop.

```
raf.pause();
```

### `play`[​](#play "Direct link to play")

Starts the animation loop.

```
raf.play();
```

### `destroy`[​](#destroy "Direct link to destroy")

Destroys the instance and cleans up resources.

```
raf.destroy();
```
