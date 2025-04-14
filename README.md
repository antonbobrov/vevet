# Vevet is a flexible, client-side JavaScript library for creative web development.

The primary goal of Vevet is to simplify the creation of interactive components from scratch — be it text animations, carousels, or other interactive elements.

### [Documentation ↗](https://antonbobrov.github.io/vevet/)

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

- **[Canvas](https://antonbobrov.github.io/vevet/docs/components/Canvas/)** simplifies working with an HTML5 Canvas element and its 2D rendering context.

- **[CanvasMedia](https://antonbobrov.github.io/vevet/docs/components/CanvasMedia/)** enables pre-rendering of media assets (such as images and videos) onto a canvas.

- **[Cursor](https://antonbobrov.github.io/vevet/docs/components/Cursor/)** is customizable custom cursor component with smooth animations and hover interactions.

- **[InView](https://antonbobrov.github.io/vevet/docs/components/InView/)** is a visibility detection utility that leverages the IntersectionObserver API to monitor when elements enter or leave the viewport.

- **[Marquee](https://antonbobrov.github.io/vevet/docs/components/Marquee/)** is custom marquee component that smoothly scrolls its child elements.

- **[Pointers](https://antonbobrov.github.io/vevet/docs/components/Pointers/)** manages pointer events, including tracking multiple pointers, and emitting callbacks for pointer interactions.

- **[Preloader](https://antonbobrov.github.io/vevet/docs/components/Preloader/)** manages the visibility and lifecycle of a loading screen.

- **[ProgressPreloader](https://antonbobrov.github.io/vevet/docs/components/ProgressPreloader/)** calculates and displays the loading progress of resources (images, videos, custom elements).

- **[Raf](https://antonbobrov.github.io/vevet/docs/components/Raf/)** manages an animation frame loop with configurable FPS and playback controls.

- **[ScrollProgress](https://antonbobrov.github.io/vevet/docs/components/ScrollProgress/)** tracks the scroll progress of a specified section element.

- **[Scrollbar](https://antonbobrov.github.io/vevet/docs/components/Scrollbar/)** is a custom scrollbar component.

- **[SplitText](https://antonbobrov.github.io/vevet/docs/components/SplitText/)** splits text within a container into individual lines, words, and letters.

- **[Swipe](https://antonbobrov.github.io/vevet/docs/components/Swipe/)** manages swipe interactions: tracks movement and detects direction, emits events on start, move, and end, supports inertia-based movement.

- **[Timeline](https://antonbobrov.github.io/vevet/docs/components/Timeline/)** is a simple timeline class for managing animations with easing and precise progress control.