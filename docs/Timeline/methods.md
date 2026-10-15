# Methods

<!-- -->

note

All **[Module methods](https://vevetjs.com/docs/base/Module/.md#methods)** are available in this class.

### `pause`[​](#pause "Direct link to pause")

Pause the timeline, halting progress without resetting it.

Emits the [`pause`](https://vevetjs.com/docs/Timeline/callbacks.md#pause) callback when a rAF loop is active.

```
const tm = new Timeline();



tm.pause();
```

### `play`[​](#play "Direct link to play")

Plays forward toward `progress = 1`.

Notes:

* If the timeline is reversed, calling `play()` switches it to forward mode.
* Emits [`resume`](https://vevetjs.com/docs/Timeline/callbacks.md#resume) when resuming from a pause, then [`play`](https://vevetjs.com/docs/Timeline/callbacks.md#play).
* No-op when progress is already `1` or the instance is destroyed.

```
const tm = new Timeline();



tm.play();
```

### `reset`[​](#reset "Direct link to reset")

Reset the timeline to the beginning (`progress = 0`).

Emits [`reset`](https://vevetjs.com/docs/Timeline/callbacks.md#reset) before progress is set to `0` (`start` follows from the progress change).

```
const tm = new Timeline();



tm.reset();
```

### `reverse`[​](#reverse "Direct link to reverse")

Reverse the timeline, moving progress **from the current value toward `0`.**

Notes:

* If the timeline is playing forward, calling `reverse()` switches direction.
* Emits [`resume`](https://vevetjs.com/docs/Timeline/callbacks.md#resume) when resuming from a pause, then [`reverse`](https://vevetjs.com/docs/Timeline/callbacks.md#reverse).
* Does nothing if progress is already `0` or the instance is destroyed.

```
const tm = new Timeline();



tm.reverse();
```

### `destroy`[​](#destroy "Direct link to destroy")

Destroys the instance and cleans up resources.

```
const tm = new Timeline();



tm.destroy();
```
