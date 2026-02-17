---
description: Responsive — apply different props by viewport and device. Breakpoints, rules, Module integration. Vevet.js base.
keywords:
  - vevet responsive
  - base responsive
  - breakpoints
  - viewport
  - tablet phone mobile
---

# Responsive

**Responsive** applies different property values based on viewport and device. You pass a **source** (a **[Module](/docs/base/Module/)** instance or a plain object) and a list of **rules**. When the active breakpoint changes, the matching rule’s `props` are merged into the source and (for Module) applied via `updateProps()`.

Use it to change component options by screen size (e.g. Marquee `gap`, Snap `slidesPerView`) or to drive any key-value state from breakpoints.

## Constructor

```ts
new Responsive<T>(
  source: T,
  rules: TResponsiveRule<T>[],
  onChange?: (props: TResponsiveProps<T>) => void,
);
```

- **source** — a **[Module](/docs/base/Module/)** instance or a plain object. For Module, only its **mutable** props are read and updated; for a plain object, the object is used as-is.
- **rules** — array of `{ at: query, props: partialProps }`. The first matching rule (and any following matches) are merged in order; later rules override earlier ones.
- **onChange** — optional callback called with the current merged `props` whenever the active breakpoint set changes.

## Query types (`at`)

Rules are matched when the given condition is true. Supported `at` values:

| Query            | When it matches                                                                                                         |
| ---------------- | ----------------------------------------------------------------------------------------------------------------------- |
| `'phone'`        | `vevet.phone === true`                                                                                                  |
| `'tablet'`       | `vevet.tablet === true`                                                                                                 |
| `'mobile'`       | `vevet.mobile === true` (phone or tablet)                                                                               |
| `'non_mobile'`   | `vevet.mobile === false`                                                                                                |
| `'portrait'`     | Viewport height &gt; width                                                                                              |
| `'landscape'`    | Viewport width &gt; height                                                                                              |
| `'@media (...)'` | Custom media query. Pass the full string, e.g. `'@media (min-width: 768px)'`. `window.matchMedia()` is used to test it. |

Only one rule per condition is typically needed; multiple rules can match at once and their `props` are merged in array order.

## Accessors

| Accessor | Type                  | Description                                                            |
| -------- | --------------------- | ---------------------------------------------------------------------- |
| `props`  | `TResponsiveProps<T>` | Current merged props (initial source props + active rules). Read-only. |

## Methods

### `destroy()`

Removes the viewport listener and cleans up. When the source is a **Module**, Responsive subscribes to its `destroy` and is typically destroyed together with the module (e.g. in the same `useEffect` cleanup). Does nothing if already destroyed.

```ts
responsive.destroy();
```

## Example — plain object

Use a plain object as source to drive your own state from breakpoints:

```ts
const responsive = new Responsive(
  {
    width: 'any',
    count: 1,
    device: 'any',
  },
  [
    { at: 'tablet', props: { device: 'tablet' } },
    { at: 'phone', props: { device: 'phone' } },
    { at: 'mobile', props: { device: 'mobile' } },
    { at: 'non_mobile', props: { device: 'desktop' } },
    { at: 'landscape', props: { width: 'landscape' } },
    { at: 'portrait', props: { width: 'portrait' } },
    { at: '@media (min-width: 1024px)', props: { count: 3 } },
  ],
  (props) => {
    console.log('Active props:', props);
  },
);

// Read current props
console.log(responsive.props);

// Cleanup when done
responsive.destroy();
```

## Example — with Module (e.g. Marquee) {#example-with-module}

Pass a Module instance so Responsive updates its mutable props when breakpoints change:

```ts
import { Marquee, Responsive } from 'vevet';

const marquee = new Marquee({
  container: document.querySelector('.marquee'),
  gap: 20,
});

const responsive = new Responsive(marquee, [
  {
    at: '@media (min-width: 768px)',
    props: { gap: 50 },
  },
  {
    at: '@media (min-width: 1200px)',
    props: { gap: 80 },
  },
]);

// When viewport crosses 768px or 1200px, marquee.updateProps() is called
// with the merged props (e.g. { gap: 50 } or { gap: 80 }).

// Cleanup: destroy Responsive and the module
marquee.on('destroy', () => responsive.destroy());
// or in your teardown:
marquee.destroy();
responsive.destroy();
```

Initial props come from the Module’s current mutable props. Responsive overrides them when a rule matches and keeps them in sync on viewport resize.

## Typedoc

For types and full API, see **[Responsive](https://vevetjs.com/v5/classes/Responsive.html)** in Typedoc.
