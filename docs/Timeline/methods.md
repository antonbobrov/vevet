# Methods

<!-- -->

note

All **[Module methods](https://vevetjs.com/docs/base/Module/.md#methods)** are available in this class.

### `pause`[​](#pause "Direct link to pause")

Pause the timeline, halting progress without resetting it.

```
const tm = new Timeline();



tm.pause();
```

### `play`[​](#play "Direct link to play")

Play the timeline, advancing progress **from the current value toward `1`.**

Notes:

* If the timeline is reversed, calling `play()` switches it to forward mode.
* Does nothing if the timeline is already playing or destroyed.

```
const tm = new Timeline();



tm.play();
```

### `reset`[​](#reset "Direct link to reset")

Reset the timeline to the beginning (`progress = 0`).

```
const tm = new Timeline();



tm.reset();
```

### `reverse`[​](#reverse "Direct link to reverse")

Reverse the timeline, moving progress **from the current value toward `0`.**

Notes:

* If the timeline is playing forward, calling `reverse()` switches direction.
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
