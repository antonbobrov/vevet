# Vevet - a JavaScript Library for Creative Development

**Vevet** is a flexible JavaScript library designed for creative web development. It offers pre-built solutions like smooth scrolling, text splitting, custom cursors, and other interactive components, allowing developers to enhance the visual and functional aspects of their websites.

Vevet is highly customizable, seamlessly integrates into existing projects, and provides basic and advanced functionalities for developers aiming to boost site interactivity.

![Top Language](https://img.shields.io/github/languages/top/antonbobrov/vevet) ![Gzipped Size](https://img.shields.io/bundlephobia/minzip/vevet)

### Links
- [Demo](https://antonbobrov.github.io/vevet-demo/)
- [Documentation](https://antonbobrov.github.io/vevet/)

## Library Contents

### Core Features [Demo](https://antonbobrov.github.io/vevet-demo/application/) / [Docs](https://antonbobrov.github.io/vevet/interfaces/IVevet.html):
- **Device Detection**
  - `vevet.isPhone`, `vevet.isTablet`, `vevet.isDesktop`, `vevet.isMobile`
- **Browser Information**
  - `vevet.osName`, `vevet.browserName`, `vevet.isWebpSupported` (Check WebP support)
- **Page Load Detection**
  - `vevet.isPageLoaded`, `vevet.onPageLoad`
- **Viewport Information**
    - `vevet.width`, `vevet.height`, `vevet.sHeight`, `vevet.vw`, `vevet.vh`, `vevet.svh`, `vevet.breakpoint`, `vevet.isPortrait`, `vevet.isLandscape`, `vevet.dpr`, `vevet.lowerDpr `
- **Viewport Events**
    - `vevet.onViewport`, `vevet.viewportCallbacks`

### Animation:
- **AnimationFrame** [Demo](https://antonbobrov.github.io/vevet-demo/animation-frame/) / [Docs](https://antonbobrov.github.io/vevet/classes/AnimationFrame.html): Simplifies the use of `requestAnimationFrame`, offering custom FPS control.
- **Timeline** [Demo](https://antonbobrov.github.io/vevet-demo/timeline/) / [Docs](https://antonbobrov.github.io/vevet/classes/Timeline.html): Helps create simple, timeline-based animations.

### Graphics:
- **Ctx2D** [Demo](https://antonbobrov.github.io/vevet-demo/ctx2d/) / [Docs](https://antonbobrov.github.io/vevet/classes/Ctx2D.html): Manages canvas creation and 2D context with automatic resizing.
- **Ctx2DPrerender** [Demo](https://antonbobrov.github.io/vevet-demo/ctx2d-prerender/) / [Docs](https://antonbobrov.github.io/vevet/classes/Ctx2DPrerender.html): Optimizes texture handling by pre-rendering images for better performance.

### Events:
- **DraggerDirection** [Demo](https://antonbobrov.github.io/vevet-demo/dragger-direction/) / [Docs](https://antonbobrov.github.io/vevet/classes/DraggerDirection.html): Detects the direction of swipes.
- **DraggerMove** [Demo](https://antonbobrov.github.io/vevet-demo/dragger-move/) / [Docs](https://antonbobrov.github.io/vevet/classes/DraggerMove.html): Ideal for building custom carousels with easy drag handling.
- **ScrollView** [Demo](https://antonbobrov.github.io/vevet-demo/scroll-view/) / [Docs](https://antonbobrov.github.io/vevet/classes/ScrollView.html): Manages elements' visibility in and out of the viewport.
- **SectionScrollProgress** [Demo](https://antonbobrov.github.io/vevet-demo/section-scroll-progress/) / [Docs](https://antonbobrov.github.io/vevet/classes/SectionScrollProgress.html): Tracks scroll progress within a specific section.
- **SlideProgress** [Demo](https://antonbobrov.github.io/vevet-demo/slide-progress/) / [Docs](https://antonbobrov.github.io/vevet/classes/SlideProgress.html): Helps you create a draggable carousel.

### Components:
- **CustomCursor** [Demo](https://antonbobrov.github.io/vevet-demo/custom-cursor/) / [Docs](https://antonbobrov.github.io/vevet/classes/CustomCursor.html): Create a custom, smooth cursor for your website.
- **Marquee** [Demo](https://antonbobrov.github.io/vevet-demo/marquee/) / [Docs](https://antonbobrov.github.io/vevet/classes/Marquee.html): Efficiently creates continuously running text.
- **Preloader** [Demo](https://antonbobrov.github.io/vevet-demo/preloader/) / [Docs](https://antonbobrov.github.io/vevet/classes/Preloader.html): Hides content until the page is fully loaded.
- **ProgressPreloader** [Demo](https://antonbobrov.github.io/vevet-demo/progress-preloader/) / [Docs](https://antonbobrov.github.io/vevet/classes/ProgressPreloader.html): A more powerful version, displaying real-time loading progress.
- **ScrollBar** [Demo](https://antonbobrov.github.io/vevet-demo/scrollbar/) / [Docs](https://antonbobrov.github.io/vevet/classes/ScrollBar.html): Customizes scrollbars by hiding default system bars.
- **CustomScroll** [Demo](https://antonbobrov.github.io/vevet-demo/custom-scroll/) / [Docs](https://antonbobrov.github.io/vevet/classes/CustomScroll.html): Provides simple and smooth scrolling functionality.
  - **CustomScrollDragPlugin**: Adds drag-based navigation to smooth scrolling.
  - **CustomScrollKeyboardPlugin**: Enables keyboard-based scrolling.
- **SplitText** [Demo](https://antonbobrov.github.io/vevet-demo/split-text/) / [Docs](https://antonbobrov.github.io/vevet/classes/SplitText.html): Splits text into letters, words, or lines, offering high performance for animations, similar to SplitText or SplitType, but free and optimized.

## Installation via NPM
To install Vevet, use the following command:

```bash
npm install vevet
```

## Importing Styles

To use Vevet's styles, import them as follows:

### Base Styles
```scss
@import '~vevet/lib/styles/base';
```

### Full Styles
```scss
@import '~vevet/lib/styles/index';
```

### Specific Component Styles
For example, to import styles for the custom cursor:
```scss
@import '~vevet/lib/styles/components/CustomCursor';
```

## Example: Initializing a Component

Below is an example of how to initialize the `CustomCursor` component:

```typescript
import { CustomCursor } from 'vevet';

const instance = new CustomCursor({
  container: document.getElementById('container')!,
});
```

## Setting Up Custom Vevet Properties

You can define custom properties for Vevet before its initialization. To ensure the settings are applied correctly, include the following code in the `<head>` section of your HTML file:

```typescript
window.VEVET_PROPS = {
  tablet: 1199, // Maximum width for tablet screens (in pixels)
  phone: 899, // Maximum width for phone screens (in pixels)
  resizeDebounce: 16, // Debounce time for resize events (in milliseconds)
  easing: [0.25, 0.1, 0.25, 1], // Default easing for animations (CSS cubic-bezier format)
  checkWebpSupport: true, // Enable WebP support detection
};
```

## Development Environment
- **Node.js**: v20.17.0

## License

This project is licensed under the terms of the
[MIT license](https://github.com/antonbobrov/vevet/blob/master/LICENSE).
