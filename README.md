# Vevet.js is a flexible, client-side JavaScript library for creative web development.

The primary goal of Vevet is to simplify the creation of interactive components from scratch — be it text animations, carousels, or other interactive elements.

### [Documentation ↗](https://vevetjs.com/)
### [Changelog ↗](https://github.com/antonbobrov/vevet/blob/master/CHANGELOG.md)

## NPM Usage

```bash
npm install vevet
```

JavaScript:

```ts
import { vevet } from 'vevet';

console.log(vevet.version); // => 5.0.0
```

SCSS:

```scss
@import '~vevet/lib/styles/index';
```

## CDN Usage

```html
<script src="
https://cdn.jsdelivr.net/npm/vevet@5/lib/cdn/vevet.iife.min.js
"></script>

<script>
  console.log(Vevet.app.version); // => 5.0.0
</script>
```

## Components

- **[Canvas](https://vevetjs.com/docs/Canvas/)** simplifies working with an HTML5 Canvas element and its 2D rendering context.

- **[CanvasMedia](https://vevetjs.com/docs/CanvasMedia/)** enables pre-rendering of media assets (such as images and videos) onto a canvas.

- **[Cursor](https://vevetjs.com/docs/Cursor/)** is customizable custom cursor component with smooth animations and hover interactions.

- **[InView](https://vevetjs.com/docs/InView/)** is a visibility detection utility that leverages the IntersectionObserver API to monitor when elements enter or leave the viewport.

- **[Marquee](https://vevetjs.com/docs/Marquee/)** is custom marquee component that smoothly scrolls its child elements.

- **[Pointers](https://vevetjs.com/docs/Pointers/)** manages pointer events, including tracking multiple pointers, and emitting callbacks for pointer interactions.

- **[Preloader](https://vevetjs.com/docs/Preloader/)** manages the visibility and lifecycle of a loading screen.

- **[ProgressPreloader](https://vevetjs.com/docs/ProgressPreloader/)** calculates and displays the loading progress of resources (images, videos, custom elements).

- **[Raf](https://vevetjs.com/docs/Raf/)** manages an animation frame loop with configurable FPS and playback controls.

- **[ScrollProgress](https://vevetjs.com/docs/ScrollProgress/)** tracks the scroll progress of a specified section element.

- **[Scrollbar](https://vevetjs.com/docs/Scrollbar/)** is a custom scrollbar component.

- **[Snap](https://vevetjs.com/docs/Snap/)** is a custom carousel handler.

- **[SplitText](https://vevetjs.com/docs/SplitText/)** splits text within a container into individual lines, words, and letters.

- **[Swipe](https://vevetjs.com/docs/Swipe/)** manages swipe interactions: tracks movement and detects direction, emits events on start, move, and end, supports inertia-based movement.

- **[Timeline](https://vevetjs.com/docs/Timeline/)** is a simple timeline class for managing animations with easing and precise progress control.