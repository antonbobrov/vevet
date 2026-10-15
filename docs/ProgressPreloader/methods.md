# Methods

<!-- -->

note

All **[Preloader's methods](https://vevetjs.com/docs/Preloader/methods.md)** are available in this class.

### `addResource`[​](#addresource "Direct link to addresource")

Adds a custom or virtual resource to be **tracked** by the preloader.<br /><!-- -->A resource with the same `id` cannot be added twice.

```
// preload a custom resource with its weight `100`

// the element itself may have the attributes: `data-weight` and `data-loaded`

preloader.addResource(document.getElementById('preload-me'), 100);



// add a virtual resource

preloader.addResource('my-resource', 20);
```

### `resolveResource`[​](#resolveresource "Direct link to resolveresource")

Updates the loaded amount of a virtual resource.<br /><!-- -->The loaded value cannot exceed the resource's total weight.

```
preloader.resolveResource('my-resource', 20);
```

### `destroy`[​](#destroy "Direct link to destroy")

Destroys the instance and cleans up resources.

```
preloader.destroy();
```
