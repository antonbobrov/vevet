---
sidebar_position: 4
---

# CSS Variables

**Vevet.js** defines the following CSS variables for the root element:

- `--vw` - Current viewport width divided by 100 (`1vw`).
- `--vh` - Current viewport height divided by 100 (`1vh`).
- `--svh` - Current small viewport height divided by 100 (`1svh`). Used to prevent layout shifts in browsers like In-App Safari.
- `--scrollbar-width` - Page scrollbar width.

## Layout Shift Issue

These variables are dynamically set when the JavaScript code loads and the library initializes. However, this process may cause noticeable layout shifts.

To prevent this, it is recommended to calculate these values manually on the first render. Vevet provides a built-in solution for this.

### HTML Script

```tsx
import { presetCssVars } from 'vevet';

<script>
  var presetVevetCss = function update() {
    if (window.vevet5) {
      return;
    }

    var doc = document.documentElement;

    var styles = document.getElementById('vevet_css_preset');
    if (!styles) {
      styles = document.createElement('style');
      styles.id = 'vevet_css_preset';
      document.body.appendChild(styles);
    }

    var w = window.innerWidth;
    var h = window.innerHeight;
    var sh = doc.clientHeight;
    var scrollbarWidth = window.innerWidth - doc.clientWidth;

    styles.innerHTML = 'html { --vw: ' + w / 100 + 'px; --vh: ' + h / 100 + 'px; --svh: ' + sh / 100 + 'px; --scrollbar-width: ' + scrollbarWidth + 'px; }';
  };

  window.addEventListener('resize', presetVevetCss);

  var presetVevetCssObserver = new ResizeObserver(presetVevetCss);
  presetVevetCssObserver.observe(document.documentElement);
  presetVevetCssObserver.observe(document.body);

  presetVevetCss();
</script>
```

### Next.js

```tsx
import { presetCssVars } from 'vevet';

<script dangerouslySetInnerHTML={{ __html: presetCssVars }} />;
```
