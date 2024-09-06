/* eslint-disable no-console */
import React, { FC, useEffect } from 'react';
import { Callbacks } from '..';

interface ICallbacks {
  onAdd: undefined;
  onDelete: undefined;
}

export const Component: FC = () => {
  useEffect(() => {
    const callbacks = new Callbacks<ICallbacks>();

    callbacks.add('onAdd', () => console.log('callback on add #1'));

    const addCallback2 = callbacks.add('onAdd', () =>
      console.log('callback on add #2'),
    );

    const addCallback3 = callbacks.add(
      'onAdd',
      () => console.log('callback on add #3'),
      { isProtected: true },
    );

    callbacks.add('onDelete', () => console.log('callback on delete'));

    console.log('--- All callbacks by the target "onAdd" will be executed:');
    callbacks.tbt('onAdd', undefined);

    console.log('--- addCallback2 will be removed:');
    addCallback2.remove();
    callbacks.tbt('onAdd', undefined);
    console.log('---');

    console.log('--- addCallback3 cannot be removed because it is protected:');
    addCallback3.remove();
    callbacks.tbt('onAdd', undefined);
    console.log('---');

    console.log('--- Execute all callbacks by the target "onDelete":');
    callbacks.tbt('onDelete', undefined);

    return () => callbacks.destroy();
  }, []);

  return <p>Open the console to see the output</p>;
};
