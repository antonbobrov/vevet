---
description: Responsive — apply different props by viewport and device. Breakpoints, rules, Module integration. Vevet.js base.
keywords:
  - vevet.responsive
  - vevetjs responsive
  - vevet responsive
  - base responsive
  - breakpoints
  - viewport
  - tablet phone mobile
---

# Responsive

**Responsive** applies different property values based on viewport and device flags from `vevet`.

Pass a **source** — a **[Module](/docs/base/Module/)** instance or a plain object — and a list of **rules**. When the active breakpoint set changes, matching rule props are merged and applied.

## Source types

| Source        | Behavior |
| ------------- | -------- |
| **Module**    | Reads mutable props, writes merged values back via `updateProps()`. Manual `updateProps()` calls update the responsive baseline. Destroying the module also destroys **Responsive**. |
| Plain object  | Uses the object as initial state. The source object is **not** mutated — read `responsive.props` or use `onChange`. |

## Constructor

```ts
new Responsive<T>(
  source: T,
  rules: TResponsiveRule<T>[],
  onChange?: (props: TResponsiveProps<T>) => void,
);
```

| Argument    | Description |
| ----------- | ----------- |
| `source`    | **Module** instance or plain object. |
| `rules`     | Array of `{ at, props }` rules (see below). |
| `onChange`  | Optional. Called with merged `props` when the active breakpoint **set** changes. |

## Rules

Each rule has the shape `{ at: query, props: partialProps }`.

- **Multiple rules can match at once.** All active rules are merged in array order; later rules override earlier ones.
- Updates run only when the set of matching `at` values changes (not on every resize tick with the same result).

### Query types (`at`)

| Query | When it matches |
| ----- | --------------- |
| `'phone'` | `vevet.phone === true` |
| `'tablet'` | `vevet.tablet === true` |
| `'mobile'` | `vevet.mobile === true` (phone or tablet) |
| `'non_mobile'` | `vevet.mobile === false` |
| `'portrait'` | Viewport height &gt; width |
| `'landscape'` | Viewport width &gt; height |
| `'@media (...)'` | Custom media query via `window.matchMedia()`. Pass the full string, e.g. `'@media (min-width: 768px)'`. |

Only the queries listed above are evaluated. Arbitrary strings like `'lg'` or `'md'` do not match unless written as `@media` queries.

## Accessors

| Accessor | Type | Description |
| -------- | ---- | ----------- |
| `props` | `TResponsiveProps<T>` | Current merged props (baseline + active rules). Read-only. |

## Methods

### `destroy()`

Removes the viewport listener and cleans up. Safe to call multiple times.

When the source is a **Module**, **Responsive** also subscribes to the module `destroy` event and destroys itself automatically — a separate `responsive.destroy()` in teardown is optional.

```ts
responsive.destroy();
```

## Example — Module {#example-with-module}

```ts
import { Marquee, Responsive } from 'vevet';

const marquee = new Marquee({
  container: document.querySelector('.marquee'),
  gap: 20,
});

const responsive = new Responsive(marquee, [
  { at: '@media (min-width: 768px)', props: { gap: 50 } },
  { at: '@media (min-width: 1200px)', props: { gap: 80 } },
]);

// Viewport crosses 768px / 1200px → marquee.updateProps({ gap: … })

marquee.destroy(); // responsive is destroyed automatically
```

## Example — plain object

```ts
const responsive = new Responsive(
  { count: 1, device: 'any' },
  [
    { at: 'mobile', props: { device: 'mobile' } },
    { at: 'non_mobile', props: { device: 'desktop' } },
    { at: '@media (min-width: 1024px)', props: { count: 3 } },
  ],
  (props) => console.log(props),
);

responsive.destroy();
```

## Typedoc

For types and full API, see **[Responsive](https://vevetjs.com/v5/classes/Responsive.html)** in Typedoc.
