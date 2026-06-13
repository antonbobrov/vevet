# Callbacks

<!-- -->

note

All **[Module callbacks](https://vevetjs.com/docs/base/Module/.md#callbacks)** are available in this class.

### `activeSlide`[​](#activeslide "Direct link to activeslide")

Triggered when the active slide changes.<br /><!-- -->The callback receives the active slide instance. See **[SnapSlide](https://vevetjs.com/docs/Snap/slide.md)**.

```
const snap = new Snap({

  container,

  onActiveSlide: (slide) => console.log(slide.index),

});
```

or:

```
const destruct = snap.on('activeSlide', (slide) => console.log(slide.index));



// Cancel the callback

destruct();
```

### `rafPause`[​](#rafpause "Direct link to rafpause")

Triggered when the requestAnimationFrame loop is paused.

```
const snap = new Snap({

  container,

  onRafPause: () => console.log('pause'),

});
```

or:

```
const destruct = snap.on('rafPause', () => console.log('pause'));



// Cancel the callback

destruct();
```

### `rafPlay`[​](#rafplay "Direct link to rafplay")

Triggered when the requestAnimationFrame loop resumes.

```
const snap = new Snap({

  container,

  onRafPlay: () => console.log('play'),

});
```

or:

```
const destruct = snap.on('rafPlay', () => console.log('play'));



// Cancel the callback

destruct();
```

### `reflow`[​](#reflow "Direct link to reflow")

Triggered when the carousel recalculates slides, sizes, or magnets.

```
const snap = new Snap({

  container,

  onReflow: () => console.log('reflow'),

});
```

or:

```
const destruct = snap.on('reflow', () => console.log('reflow'));



// Cancel the callback

destruct();
```

### `resize`[​](#resize "Direct link to resize")

Triggered when the carousel is resized.

```
const snap = new Snap({

  container,

  onResize: () => console.log('resize'),

});
```

or:

```
const destruct = snap.on('resize', () => console.log('resize'));



// Cancel the callback

destruct();
```

### `swipe`[​](#swipe "Direct link to swipe")

Triggered during swipe movement.

```
const snap = new Snap({

  container,

  onSwipe: (coord) => console.log(coord),

});
```

or:

```
const destruct = snap.on('swipe', (coord) => console.log(coord));



// Cancel the callback

destruct();
```

### `swipeStart`[​](#swipestart "Direct link to swipestart")

Triggered when a swipe starts.

```
const snap = new Snap({

  container,

  onSwipeStart: (coord) => console.log(coord),

});
```

or:

```
const destruct = snap.on('swipeStart', (coord) => console.log(coord));



// Cancel the callback

destruct();
```

### `swipeEnd`[​](#swipeend "Direct link to swipeend")

Triggered when a swipe ends.

```
const snap = new Snap({

  container,

  onSwipeEnd: (coord) => console.log(coord),

});
```

or:

```
const destruct = snap.on('swipeEnd', (coord) => console.log(coord));



// Cancel the callback

destruct();
```

### `timelineStart`[​](#timelinestart "Direct link to timelinestart")

Triggered on timeline animation start.

```
const snap = new Snap({

  container,

  onTimelineStart: () => console.log('start'),

});
```

or:

```
const destruct = snap.on('timelineStart', () => console.log('start'));



// Cancel the callback

destruct();
```

### `timelineUpdate`[​](#timelineupdate "Direct link to timelineupdate")

Triggered on timeline animation progress update.

```
const snap = new Snap({

  container,

  onTimelineUpdate: ({ progress, eased }) => console.log(progress, eased),

});
```

or:

```
const destruct = snap.on('timelineUpdate', ({ progress, eased }) => {

  console.log(progress, eased);

});



// Cancel the callback

destruct();
```

### `timelineEnd`[​](#timelineend "Direct link to timelineend")

Triggered when a timeline animation ends.

```
const snap = new Snap({

  container,

  onTimelineEnd: () => console.log('end'),

});
```

or:

```
const destruct = snap.on('timelineEnd', () => console.log('end'));



// Cancel the callback

destruct();
```

### `update`[​](#update "Direct link to update")

Triggered on every carousel coordinate update.

```
const snap = new Snap({

  container,

  onUpdate: () => console.log('update'),

});
```

or:

```
const destruct = snap.on('update', () => console.log('update'));



// Cancel the callback

destruct();
```

### `idle`[​](#idle "Direct link to idle")

Triggered when the carousel becomes idle — not swiping, interpolating, or transitioning.

```
const snap = new Snap({

  container,

  onIdle: () => console.log('idle'),

});
```

or:

```
const destruct = snap.on('idle', () => console.log('idle'));



// Cancel the callback

destruct();
```

### `wheel`[​](#wheel "Direct link to wheel")

Triggered on mouse wheel input.

```
const snap = new Snap({

  container,

  onWheel: (evt) => console.log(evt),

});
```

or:

```
const destruct = snap.on('wheel', (evt) => console.log(evt));



// Cancel the callback

destruct();
```

### `wheelStart`[​](#wheelstart "Direct link to wheelstart")

Triggered when wheel input starts.

```
const snap = new Snap({

  container,

  onWheelStart: () => console.log('start'),

});
```

or:

```
const destruct = snap.on('wheelStart', () => console.log('start'));



// Cancel the callback

destruct();
```

### `wheelEnd`[​](#wheelend "Direct link to wheelend")

Triggered when wheel input ends.

```
const snap = new Snap({

  container,

  onWheelEnd: () => console.log('end'),

});
```

or:

```
const destruct = snap.on('wheelEnd', () => console.log('end'));



// Cancel the callback

destruct();
```

### `swipeInertiaStart`[​](#swipeinertiastart "Direct link to swipeinertiastart")

Triggered when swipe inertia starts.

```
const snap = new Snap({

  container,

  onSwipeInertiaStart: () => console.log('start'),

});
```

or:

```
const destruct = snap.on('swipeInertiaStart', () => console.log('start'));



// Cancel the callback

destruct();
```

### `swipeInertiaEnd`[​](#swipeinertiaend "Direct link to swipeinertiaend")

Triggered when swipe inertia ends.

```
const snap = new Snap({

  container,

  onSwipeInertiaEnd: () => console.log('end'),

});
```

or:

```
const destruct = snap.on('swipeInertiaEnd', () => console.log('end'));



// Cancel the callback

destruct();
```

### `swipeInertiaCancel`[​](#swipeinertiacancel "Direct link to swipeinertiacancel")

Triggered when swipe inertia is canceled.

```
const snap = new Snap({

  container,

  onSwipeInertiaCancel: () => console.log('cancel'),

});
```

or:

```
const destruct = snap.on('swipeInertiaCancel', () => console.log('cancel'));



// Cancel the callback

destruct();
```

### `swipeInertiaFail`[​](#swipeinertiafail "Direct link to swipeinertiafail")

Triggered when swipe inertia fails to start.

```
const snap = new Snap({

  container,

  onSwipeInertiaFail: () => console.log('fail'),

});
```

or:

```
const destruct = snap.on('swipeInertiaFail', () => console.log('fail'));



// Cancel the callback

destruct();
```
