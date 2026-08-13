---
description: Callbacks class — event listeners with one-or-multi-time execution, protection and delays. Vevet.js base.
keywords:
  - vevet.callbacks
  - vevetjs callbacks
  - vevet callbacks
  - base callbacks
  - event listeners
  - Module
---

# Callbacks

**Callbacks** is a typed event registry with support for one-time listeners, protected listeners, and delayed execution.

It is used internally by **[Module](/docs/base/Module/)** and all components. You can also instantiate it directly when building custom logic.

## Event map

Define events by extending `ICallbacksMap`. Each key is an event name; the value is the payload type passed to listeners on `emit`. Use `undefined` for events without a payload.

```ts
interface IMyCallbacks extends ICallbacksMap {
  init: undefined;
  update: { value: number };
}
```

## In components

Every **Module** owns a `callbacks` instance. Component constructor props such as `onMove` or `onDestroy` are registered on that instance (`onMove` → `move`).

You can subscribe in two ways:

- **Declarative** — pass `onEvent` functions in constructor props.
- **Imperative** — call `instance.on('event', listener)` after creation.

Both approaches use the same underlying **Callbacks** instance. See **[Module](/docs/base/Module/)** for the component-level API.

## Constructor

```ts
new Callbacks<Types, Ctx>(props?)
```

| Option | Type   | Description                                                        |
| ------ | ------ | ------------------------------------------------------------------ |
| `ctx`  | `Ctx`  | Optional context forwarded as the second argument to every listener |

Inside components, `ctx` is the module instance (`this`).

## Listener signature

Every listener receives two arguments:

```ts
(data, ctx) => void
```

- `data` — event payload from the map (`undefined` is passed explicitly when the event has no payload).
- `ctx` — value from constructor `ctx` (the module instance in components).

## Methods

| Method              | Returns              | Description                                      |
| ------------------- | -------------------- | ------------------------------------------------ |
| `on(target, fn, settings?)` | `() => void` | Registers a listener. Returned function removes it. |
| `add(target, fn, settings?)` | `{ id, remove }` | Same as `on`, but also exposes the callback `id` for `remove()`. |
| `emit(target, arg)` | `void`               | Invokes all listeners for the event.             |
| `remove(id)`        | `boolean`            | Removes a listener by id. Protected listeners are skipped. |
| `destroy()`         | `void`               | Clears all listeners. Further calls to `on` / `add` are no-ops. |
| `list`              | `ICallback[]`        | Snapshot of registered listeners (for debugging).  |

Prefer `on()` when you only need a destructor. Use `add()` when you need the callback `id`.

## Settings

Pass as the third argument to `on()` or `add()`:

| Option      | Type      | Default     | Description |
| ----------- | --------- | ----------- | ----------- |
| `once`      | `boolean` | `false`     | Remove the listener after the first execution. |
| `protected` | `boolean` | `false`     | Prevent manual removal via `remove()` or the `on()` destructor. Cleared on `destroy()`. |
| `timeout`   | `number`  | `undefined` | Delay before the listener runs, in milliseconds. |
| `name`      | `string`  | `undefined` | Optional label for debugging (`list`). |

## Example

```ts
import { Callbacks, ICallbacksMap } from 'vevet';

interface IMyCallbacks extends ICallbacksMap {
  init: undefined;
  update: { value: number };
}

const callbacks = new Callbacks<IMyCallbacks>();

const remove = callbacks.on('update', ({ value }) => {
  console.log(value);
});

callbacks.emit('update', { value: 1 });

remove();
callbacks.destroy();
```

## Typedoc

For full API details and types, see **[Callbacks](https://vevetjs.com/v5/classes/Callbacks.html)** in Typedoc.
