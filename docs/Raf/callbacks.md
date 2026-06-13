# Callbacks

<!-- -->

note

All **[Module callbacks](https://vevetjs.com/docs/base/Module/.md#callbacks)** are available in this class.

### `play`[​](#play "Direct link to play")

Triggered when the animation starts.

```
const raf = new Raf({

  onPlay: () => console.log('play'),

});
```

or:

```
const destruct = raf.on('play', () => console.log('play'));



// Cancel the callback

destruct();
```

### `pause`[​](#pause "Direct link to pause")

Triggered when the animation is paused.

```
const raf = new Raf({

  onPause: () => console.log('pause'),

});
```

or:

```
const destruct = raf.on('pause', () => console.log('pause'));



// Cancel the callback

destruct();
```

### `toggle`[​](#toggle "Direct link to toggle")

Triggered when the play/pause state toggles.

```
const raf = new Raf({

  onToggle: () => console.log('toggle'),

});
```

or:

```
const destruct = raf.on('toggle', () => console.log('toggle'));



// Cancel the callback

destruct();
```

### `frame`[​](#frame "Direct link to frame")

Triggered on every animation frame.

```
const raf = new Raf({

  onFrame: ({ fps, fpsFactor, duration }) => {

    console.log('current FPS', fps);

    console.log('scaling coefficient based on a 60 FPS target', fpsFactor);

    console.log('duration of the last frame in ms', duration);

  },

});
```

or:

```
const destruct = raf.on('frame', ({ fps, fpsFactor, duration }) => {

  console.log('current FPS', fps);

  console.log('scaling coefficient based on a 60 FPS target', fpsFactor);

  console.log('duration of the last frame in ms', duration);

});



// Cancel the callback

destruct();
```
