# Methods

<!-- -->

note

All **[Module methods](https://vevetjs.com/docs/base/Module/.md#methods)** are available in this class.

### `next`[​](#next "Direct link to next")

Navigate to the next slide.

```
const snap = new Snap({ container });



snap.next({ duration: 500 });



snap.next({ duration: 500, skip: 2 }); // skip two slides
```

### `prev`[​](#prev "Direct link to prev")

Navigate to the previous slide.

```
const snap = new Snap({ container });



snap.prev({ duration: 500 });



snap.prev({ duration: 500, skip: 2 }); // skip two slides
```

### `toCoord`[​](#tocoord "Direct link to tocoord")

Snap to a specific track coordinate.

```
const snap = new Snap({ container });



snap.toCoord(1365);



// with duration

snap.toCoord(1365, { duration: 250 });



// custom easing

snap.toCoord(1365, {

  duration: 250,

  easing: EaseInOutCubic,

});



// with callbacks

snap.toCoord(1365, {

  duration: 250,

  easing: EaseInOutCubic,

  onStart: () => console.log('start'),

  onUpdate: ({ progress, eased }) => console.log(progress, eased),

  onEnd: () => console.log('end'),

});
```

### `toSlide`[​](#toslide "Direct link to toslide")

Navigate to a slide by index (starting from `0`).

```
const snap = new Snap({ container });



instance.toSlide(2);



// with duration

snap.toSlide(2, { duration: 250 });



// custom easing

snap.toSlide(2, {

  duration: 250,

  easing: EaseInOutCubic,

});



// with callbacks

snap.toSlide(2, {

  duration: 250,

  easing: EaseInOutCubic,

  onStart: () => console.log('start'),

  onUpdate: ({ progress, eased }) => console.log(progress, eased),

  onEnd: () => console.log('end'),

});



// define animation direction (loop mode only)

snap.toSlide(2, {

  direction: 'prev',

});
```

### `render`[​](#render "Direct link to render")

Force coordinate recalculation and re-render slides.

```
const snap = new Snap({ container });



snap.render();
```

### `resize`[​](#resize "Direct link to resize")

Request a resize update.<br /><!-- -->If `false` is passed, the resize is handled with a debounce timeout.

```
const snap = new Snap({ container });



snap.resize(); // instant resize

snap.resize(false); // with debounce
```

### `stick`[​](#stick "Direct link to stick")

Snap to the nearest slide magnet.

```
const snap = new Snap({ container });



snap.stick();
```

### `getNearestMagnet`[​](#getnearestmagnet "Direct link to getnearestmagnet")

Return the nearest magnet relative to a target coordinate.

```
const snap = new Snap({ container });



const magnet = snap.getNearestMagnet(1234);



magnet.diff; // difference with current coordinate

magnet.magnet; // magnet coordinate

magnet.slide; // magnet slide instance
```

### `cancelTransition`[​](#canceltransition "Direct link to canceltransition")

Cancel the current transition to a target slide or coordinate.

```
const snap = new Snap({ container });



snap.cancelTransition();
```

### `clampTarget`[​](#clamptarget "Direct link to clamptarget")

Clamp the target value between the minimum and maximum track values.

```
const snap = new Snap({ container });



snap.clampTarget();
```

### `loopCoord`[​](#loopcoord "Direct link to loopcoord")

Wrap a coordinate between the minimum and maximum track values and return a normalized looped value.<br />**See [loop utilities](https://vevetjs.com/docs/utils/.md#loop).**

```
const snap = new Snap({ container });



// when min=0 & max=1100

snap.loopCoord(0); // => 0

snap.loopCoord(1100); // => 0

snap.loopCoord(1101); // => 1

snap.loopCoord(-1101); // => 1099

snap.loopCoord(5000); // => 600
```

### `set`[​](#set "Direct link to set")

Instantly set the current and target track values without starting an animation.<br /><!-- -->After manually updating the values, you must call `.render()`.

```
const snap = new Snap({ container });



snap.set(1350);



snap.render();
```

### `setTarget`[​](#settarget "Direct link to settarget")

Set only the **target** track value without instantly updating the current value.

```
const snap = new Snap({ container });



// move towards coordinate 1350

snap.setTarget(1350);
```
