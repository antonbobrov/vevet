# Accessors

<!-- -->

note

All **[Module accessors](https://vevetjs.com/docs/base/Module/.md#accessors)** are available in this class.

### `duration`[​](#duration "Direct link to duration")

Type: `number`

Duration of the last frame in ms.

```
const raf = new Raf();



raf.duration; // returns duration of the last frame in ms
```

### `fps`[​](#fps "Direct link to fps")

Type: `number`

Real-time FPS. **See [demo](https://vevetjs.com/docs/Raf/demos.md#info)**

```
const raf = new Raf();



raf.fps; // returns real-time fps
```

### `fpsFactor`[​](#fpsfactor "Direct link to fpsfactor")

Type: `number`

Scaling coefficient based on a 60 FPS target.

Useful for making physics and easing consistent regardless of monitor refresh rate.

**See [demo](https://vevetjs.com/docs/Raf/demos.md#info)**

```
const raf = new Raf();



raf.fpsFactor; // returns scaling coefficient
```

### `index`[​](#index "Direct link to index")

Type: `number`

Current frame index. **See [demo](https://vevetjs.com/docs/Raf/demos.md#info)**

```
const raf = new Raf();



raf.index; // returns frame index
```

### `isPlaying`[​](#isplaying "Direct link to isplaying")

Type: `boolean`

Playback state of the RAF loop.

```
const raf = new Raf();



raf.isPlaying; // true or false
```

### `timestamp`[​](#timestamp "Direct link to timestamp")

Type: `number`

Timestamp of the current frame. **See [demo](https://vevetjs.com/docs/Raf/demos.md#info)**

```
const raf = new Raf();



raf.timestamp; // returns timestamp
```
