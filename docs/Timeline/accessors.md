# Accessors

<!-- -->

note

All **[Module accessors](https://vevetjs.com/docs/base/Module/.md#accessors)** are available in this class.

### `duration`[​](#duration "Direct link to duration")

Type: `number`

Get the timeline duration, ensuring it is at least 0 ms.

```
const tm = new Timeline();



tm.duration; // returns timeline duration
```

### `eased`[​](#eased "Direct link to eased")

Type: `number`

Get the eased progress of the timeline, derived from the easing function.

```
const tm = new Timeline();



tm.eased; // timeline progress with easing applied (0 to 1)
```

### `isPaused`[​](#ispaused "Direct link to ispaused")

Type: `boolean`

Whether the timeline is paused.

```
const tm = new Timeline();



tm.isPaused; // true or false
```

### `isPlaying`[​](#isplaying "Direct link to isplaying")

Type: `boolean`

Whether the timeline is currently playing.

```
const tm = new Timeline();



tm.isPlaying; // true or false
```

### `isReversed`[​](#isreversed "Direct link to isreversed")

Type: `boolean`

Whether the timeline is reversed (progress decreases over time).

```
const tm = new Timeline();



tm.isReversed; // true or false
```

### `progress`[​](#progress "Direct link to progress")

Type: `number`

Get or set the linear progress of the timeline in the range **0 to 1.**

Setting this value:

* immediately updates the internal state,
* triggers the update callback,
* recalculates the eased value.

```
const tm = new Timeline();



tm.progress; // timeline progress (0 to 1)



tm.progress = 0.5;
```
