# Callbacks

<!-- -->

note

All **[Preloader callbacks](https://vevetjs.com/docs/Preloader/callbacks.md)** (`loaded`, `requestHide`, `hide`, `hidden`, …) are available.<br />[`loaded`](https://vevetjs.com/docs/Preloader/callbacks.md#loaded) fires when smoothed [`progress`](https://vevetjs.com/docs/ProgressPreloader/accessors.md#progress) reaches `1`, after all resources are resolved and optional [`endDuration`](https://vevetjs.com/docs/ProgressPreloader/props.md#props.endDuration) finish.

### `progress`[​](#progress "Direct link to progress")

Fired each animation frame while progress is updating — during Raf smoothing and during the [`endDuration`](https://vevetjs.com/docs/ProgressPreloader/props.md#props.endDuration) finish timeline ([`timelineUpdate`](#timelineupdate)).

```
const preloader = new ProgressPreloader({

  container: document.getElementById('container'),

  onProgress: (_data, { progress }) => console.log(progress),

});
```

or:

```
const destruct = preloader.on('progress', () =>

  console.log(preloader.progress),

);



// Cancel the callback

destruct();
```

### `timelineStart`[​](#timelinestart "Direct link to timelinestart")

Fired when the [`endDuration`](https://vevetjs.com/docs/ProgressPreloader/props.md#props.endDuration) finish timeline starts.<br /><!-- -->Runs when all resources are loaded (`loadProgress >= 1`) but smoothed [`progress`](https://vevetjs.com/docs/ProgressPreloader/accessors.md#progress) is still below `1`. Skipped when progress is already `1`.

```
const preloader = new ProgressPreloader({

  container: document.getElementById('container'),

  onTimelineStart: () => console.log('timelineStart'),

});
```

or:

```
const destruct = preloader.on('timelineStart', () =>

  console.log('timelineStart'),

);



// Cancel the callback

destruct();
```

### `timelineUpdate`[​](#timelineupdate "Direct link to timelineupdate")

Fired on every frame of the finish timeline.

Provides timeline progress (`progress` — linear, `eased` — with easing). Smoothed [`progress`](https://vevetjs.com/docs/ProgressPreloader/accessors.md#progress) is updated on the same tick — [`progress`](#progress) also fires.

```
const preloader = new ProgressPreloader({

  container: document.getElementById('container'),

  onTimelineUpdate: ({ progress, eased }) => {

    console.log(progress, eased, preloader.progress);

  },

});
```

or:

```
const destruct = preloader.on('timelineUpdate', ({ progress, eased }) => {

  console.log(progress, eased);

});



// Cancel the callback

destruct();
```

### `timelineEnd`[​](#timelineend "Direct link to timelineend")

Fired when the finish timeline completes and smoothed [`progress`](https://vevetjs.com/docs/ProgressPreloader/accessors.md#progress) reaches `1`.<br />[`loaded`](https://vevetjs.com/docs/Preloader/callbacks.md#loaded) may fire on the same frame.

```
const preloader = new ProgressPreloader({

  container: document.getElementById('container'),

  onTimelineEnd: () => console.log('timelineEnd'),

});
```

or:

```
const destruct = preloader.on('timelineEnd', () => console.log('timelineEnd'));



// Cancel the callback

destruct();
```

### `resource`[​](#resource "Direct link to resource")

Fired whenever a resource updates its loaded weight —<br /><!-- -->both DOM-based (`data-loaded` changes) and virtual resources.

```
const preloader = new ProgressPreloader({

  container: document.getElementById('container'),

  onResource: ({ id, weight, loaded }) => {

    console.log(id, `loaded ${loaded} / ${weight}`);

  },

});
```

or:

```
const destruct = preloader.on('resource', ({ id, weight, loaded }) => {

  console.log(id, `loaded ${loaded} / ${weight}`);

});



// Cancel the callback

destruct();
```
