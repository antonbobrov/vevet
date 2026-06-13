# Methods

<!-- -->

note

All **[Module methods](https://vevetjs.com/docs/base/Module/.md#methods)** are available in this class.

### `lerpFactor`[​](#lerpfactor "Direct link to lerpfactor")

Calculates a linear interpolation factor to make animations run the same regardless of FPS.

**See [demo](https://vevetjs.com/docs/Raf/demos.md#damping)**

```
// lerpFactor() calculates an FPS-independent interpolation coefficient.

// Use it to make animations feel consistent across 60Hz, 120Hz, and 144Hz displays.

const ease = raf.lerpFactor(0.1);



lerp(from, to, ease);
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
