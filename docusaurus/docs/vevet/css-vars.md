---
sidebar_position: 4
---

# CSS Variables

The core library defines the following CSS variables on the root element:

- `--vw`
- `--vh`
- `--svh`
- `--scrollbar-width`

## Layout Shift Issue

These variables are dynamically set when the JavaScript code loads and the library initializes. However, this process may cause noticeable layout shifts.

To prevent this, it is recommended to calculate these values manually on the first render. Vevet provides a built-in solution for this.

### Next.js Example

```tsx
import { presetCssVars } from 'vevet';

<Script
  strategy="beforeInteractive"
  dangerouslySetInnerHTML={{ __html: presetCssVars }}
/>;
```
