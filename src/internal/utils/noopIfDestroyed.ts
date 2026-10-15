/* eslint-disable no-underscore-dangle */

export function noopIfDestroyed(
  target: any,
  propertyKey: string,
  descriptor: PropertyDescriptor,
) {
  const originalMethod = descriptor.value;

  descriptor.value = function check(...args: any[]) {
    if ((this as any)._isDestroyed) {
      return;
    }

    return originalMethod.apply(this, args);
  };
}
