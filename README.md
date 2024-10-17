# Vevet - A JavaScript Library for Creative Developers

**Vevet** is a flexible JavaScript library designed for creative web development. It offers pre-built solutions like smooth scrolling, text splitting, custom cursors, and other interactive components, allowing developers to enhance the visual and functional aspects of their websites.

Vevet is highly customizable, seamlessly integrates into existing projects, and provides basic and advanced functionalities for developers aiming to boost site interactivity.

![Top Language](https://img.shields.io/github/languages/top/antonbobrov/vevet) ![Gzipped Size](https://img.shields.io/bundlephobia/minzip/vevet)

### Links
- [Demo](https://antonbobrov.github.io/vevet-demo/)
- [Documentation](https://antonbobrov.github.io/vevet/)

---

## Development Environment
- **Node.js**: v20.17.0

## Installation via NPM
To install Vevet, use the following command:

```bash
npm install vevet
```

---

## Library Contents

### Core Features [Demo](https://antonbobrov.github.io/vevet-demo/application/) / [Docs](https://antonbobrov.github.io/vevet/interfaces/IVevet.html):
- **Device Detection**
  - `vevet.isPhone`, `vevet.isTablet`, `vevet.isDesktop`, `vevet.isMobile`
- **Browser Information**
  - `vevet.osName`, `vevet.browserName`, `vevet.isWebpSupported` (Check WebP support)
- **Page Load Detection**
  - `vevet.pageLoad` (Detects when the page has loaded)
  - `vevet.isPageLoaded`, `vevet.onPageLoad`
- **Viewport Management**
  - `vevet.viewport` (Handles resize events efficiently)

### Animation and Graphics:
- **AnimationFrame** [Demo](https://antonbobrov.github.io/vevet-demo/animation-frame/) / [Docs](https://antonbobrov.github.io/vevet/classes/AnimationFrame.html): Simplifies the use of `requestAnimationFrame`, offering custom FPS control.
- **Ctx2D**: Manages canvas creation and 2D context with automatic resizing.
- **Ctx2DPrerender**: Optimizes texture handling by pre-rendering images for better performance.

### Interactive Components:
- **CustomCursor**: Create a custom, smooth cursor for your website.
- **DraggerDirection** [Demo](https://antonbobrov.github.io/vevet-demo/dragger-direction/) / [Docs](https://antonbobrov.github.io/vevet/classes/DraggerDirection.html): Detects the direction of swipes.
- **DraggerMove** [Demo](https://antonbobrov.github.io/vevet-demo/dragger-move/) / [Docs](https://antonbobrov.github.io/vevet/classes/DraggerMove.html): Ideal for building custom carousels with easy drag handling.
- **Marquee** [Demo](https://antonbobrov.github.io/vevet-demo/marquee/) / [Docs](https://antonbobrov.github.io/vevet/classes/Marquee.html): Efficiently creates continuously running text.
- **Preloader** [Demo](https://antonbobrov.github.io/vevet-demo/preloader/) / [Docs](https://antonbobrov.github.io/vevet/classes/Preloader.html): Hides content until the page is fully loaded.
- **ProgressPreloader** [Demo](https://antonbobrov.github.io/vevet-demo/progress-preloader/) / [Docs](https://antonbobrov.github.io/vevet/classes/ProgressPreloader.html): A more powerful version, displaying real-time loading progress.
- **ScrollBar** [Demo](https://antonbobrov.github.io/vevet-demo/scrollbar/) / [Docs](https://antonbobrov.github.io/vevet/classes/ScrollBar.html): Customizes scrollbars by hiding default system bars.
- **ScrollView** [Demo](https://antonbobrov.github.io/vevet-demo/scroll-view/) / [Docs](https://antonbobrov.github.io/vevet/classes/ScrollView.html): Manages elements' visibility in and out of the viewport.
- **SectionScrollProgress**: Tracks scroll progress within a specific section.
- **SlideProgress** [Demo](https://antonbobrov.github.io/vevet-demo/slide-progress/) / [Docs](https://antonbobrov.github.io/vevet/classes/SlideProgress.html): Helps you create a draggable carousel.
- **CustomScroll**: Provides simple and smooth scrolling functionality.
  - **CustomScrollDragPlugin**: Adds drag-based navigation to smooth scrolling.
  - **CustomScrollKeyboardPlugin**: Enables keyboard-based scrolling.
- **SplitText** [Demo](https://antonbobrov.github.io/vevet-demo/split-text/) / [Docs](https://antonbobrov.github.io/vevet/classes/SplitText.html): Splits text into letters, words, or lines, offering high performance for animations, similar to SplitText or SplitType, but free and optimized.
- **Timeline** [Demo](https://antonbobrov.github.io/vevet-demo/timeline/) / [Docs](https://antonbobrov.github.io/vevet/classes/Timeline.html): Helps create simple, timeline-based animations.

---

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

---

## Example: Initializing a Component

Below is an example of how to initialize the `CustomCursor` component:

```typescript
import { CustomCursor } from 'vevet';

const instance = new CustomCursor({
  container: document.getElementById('container')!,
});
```

## License

This project is licensed under the terms of the
[MIT license](https://github.com/antonbobrov/vevet/blob/master/LICENSE).
