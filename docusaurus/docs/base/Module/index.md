---
description: Module — base class for Vevet.js components. Props, callbacks, updateProps, onDestroy, destroy.
keywords:
  - vevet module
  - base module
  - abstract class
  - updateProps
  - callbacks
---

# Module

**Module** is the abstract base class for all Vevet.js components. It provides:

- **Unified props** — static and mutable properties with a single `props` object.
- **Callbacks** — built-in `destroy` and `props` events, plus custom events via **[Callbacks](/docs/base/Callbacks/)**.
- **Lifecycle** — `updateProps()`, `onDestroy()`, and `destroy()` with automatic cleanup.

All components (Timeline, Swipe, Scrollbar, Marquee, etc.) extend **Module**. You can extend it to build your own modules.

## Constructor

```ts
new Module<CallbacksMap, StaticProps, MutableProps>(
  props?: StaticProps & MutableProps,
  onCallbacks?: TModuleOnCallbacksProps<CallbacksMap, Module>,
);
```

- **props** — initial static and mutable properties. Subclasses define defaults via `_getStatic()` and `_getMutable()`.
- **onCallbacks** — optional object of callbacks keyed by `onEventName` (e.g. `onDestroy`, `onProps`). These are registered on the internal Callbacks instance.

## Callbacks

Every Module has at least these callbacks (see **[Callbacks](/docs/base/Callbacks/)** for `on()`, settings, etc.):

| Event     | Payload     | When                                                      |
| --------- | ----------- | --------------------------------------------------------- |
| `destroy` | `undefined` | Before the module is destroyed and callbacks are cleared. |
| `props`   | `undefined` | After mutable props are updated via `updateProps()`.      |

Example:

```ts
const module = new Module(
  { weight: 70 },
  {
    onDestroy: () => console.log('destroyed'),
    onProps: () => console.log('props updated', module.props),
  },
);

module.updateProps({ weight: 72 }); // logs "props updated" and new props
module.destroy(); // logs "destroyed"
```

Or using `.on()`:

```ts
const remove = module.on('props', () => console.log(module.props));
// later
remove();
```

## Accessors

| Accessor      | Type                            | Description                                                      |
| ------------- | ------------------------------- | ---------------------------------------------------------------- |
| `props`       | `StaticProps & MutableProps`    | Current properties. Do not mutate directly; use `updateProps()`. |
| `prefix`      | `string`                        | Class name prefix from core (e.g. for CSS class names).          |
| `name`        | `string`                        | Constructor name (e.g. `"Timeline"`).                            |
| `isDestroyed` | `boolean`                       | Whether the module has been destroyed.                           |
| `callbacks`   | `Callbacks<CallbacksMap, this>` | The internal **[Callbacks](/docs/base/Callbacks/)** instance.    |

## Methods

### `updateProps(props)`

Updates mutable properties and emits the `props` callback.

```ts
module.updateProps({ weight: 75 });
```

Does nothing if the module is already destroyed.

### `onDestroy(action)`

Registers a function to run when the module is destroyed (e.g. remove a class from an element). If the module is already destroyed, the action runs immediately.

```ts
module.onDestroy(() => element.classList.remove('active'));
```

### `on(target, listener, settings?)`

Adds a callback for an event. Returns a function that removes the callback. See **[Callbacks](/docs/base/Callbacks/)** for `settings` (e.g. `once`, `timeout`, `protected`).

```ts
const remove = module.on('props', () => {});
remove(); // unregister
```

### `destroy()`

Destroys the module: emits `destroy`, clears callbacks, runs all `onDestroy` actions, and marks the instance as destroyed. Further calls to `updateProps` or `on` are no-ops.

```ts
module.destroy();
```

## Example

Minimal custom module with typed props and callbacks:

```ts
import {
  Module,
  IModuleCallbacksMap,
  IModuleStaticProps,
  IModuleMutableProps,
} from 'vevet';

interface IMyCallbacks extends IModuleCallbacksMap {
  custom: { value: number };
}

type TStatic = IModuleStaticProps & { title: string };
type TMutable = IModuleMutableProps & { count: number };

class MyModule extends Module<IMyCallbacks, TStatic, TMutable> {
  _getStatic() {
    return { ...super._getStatic(), title: '' };
  }
  _getMutable() {
    return { ...super._getMutable(), count: 0 };
  }

  constructor(props?: TStatic & TMutable, onCallbacks?: any) {
    super(props, onCallbacks);
  }
}

const m = new MyModule(
  { title: 'Hi', count: 1 },
  {
    onDestroy: () => console.log('destroyed'),
    onProps: () => console.log(m.props),
  },
);

m.updateProps({ count: 2 });
m.destroy();
```

## Typedoc

For full API details and types, see **[Module](https://vevetjs.com/v5/classes/Module.html)** in Typedoc.
