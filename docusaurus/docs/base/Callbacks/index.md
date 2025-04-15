# Callbacks

**Callbacks** class manages event listeners with support for one-time execution, protection, and delays.

It's used internally in the **[Module](/docs/base/Module/)** and all components, but you can also instantiate it independently:

```ts
// Define the interface for callback events
interface ICallbacks {
  init: undefined;
  update: {
    value: number;
  };
}

// Create a Callbacks instance
const callbacks = new Callbacks<ICallbacks>();

// Register a basic callback for "init"
const removeSimpleCallback = callbacks.on('init', () => {
  console.log('callback on init');
});

// Register a protected callback (cannot be removed manually)
const protectedCallback = callbacks.on('init', () => {
  console.log('protected callback');
}, { protected: true });

// Register a one-time callback
const removeOnceCallback = callbacks.on('init', () => {
  console.log('one-time callback');
}, { once: true });

// Register a delayed callback (executes after 1000ms)
const removeDelayedCallback = callbacks.on('init', () => {
  console.log('delayed callback');
}, { timeout: 1000 });

// Emit the "init" callbacks
callbacks.emit('init', undefined);

// Register a callback with an argument and emit it
const onUpdate = callbacks.on('update', ({ value }) => {
  console.log('update', value);
});
callbacks.emit('update', { value: 0 });

// Remove a specific callback
removeSimpleCallback();

// Attempting to remove a protected callback (no effect)
protectedCallback();

// List all registered callbacks
console.log(callbacks.list);

// Remove all callbacks
callbacks.destroy();
```

### Learn more in the <a href="/vevet/v5/classes/Callbacks.html" target="_blank" rel="noopener">Typedoc</a>