/* eslint-disable no-underscore-dangle */
/* eslint-disable consistent-return */
/* eslint-disable no-param-reassign */

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
