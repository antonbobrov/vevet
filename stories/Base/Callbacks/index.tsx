import React, { FC, useEffect } from 'react';

import { Callbacks } from '@/index';

interface ICallbacks {
  init: undefined;
  update: {
    value: number;
  };
}

export const Component: FC = () => {
  useEffect(() => {
    const callbacks = new Callbacks<ICallbacks>();

    callbacks.on('init', () => console.log('callback on init #1'));

    const initCallback2 = callbacks.on('init', () =>
      console.log('callback on init #2'),
    );

    const initCallback3 = callbacks.on(
      'init',
      () => console.log('callback on init #3'),
      { protected: true },
    );

    callbacks.on('update', () => console.log('callback on update'));

    console.log('--- All callbacks by the target "init" will be executed:');
    callbacks.emit('init', undefined);

    console.log('--- #2 will be removed:');
    initCallback2();
    callbacks.emit('init', undefined);

    console.log('--- #3 cannot be removed because it is protected:');
    initCallback3();
    callbacks.emit('init', undefined);

    console.log('--- Execute all callbacks by the target "update":');
    callbacks.emit('update', { value: 5 });

    console.log('--- Destroy all callbacks:');
    callbacks.destroy();

    console.log('--- Get callbacks list after destroy:');
    console.log(callbacks.list);

    return () => callbacks.destroy();
  }, []);

  return <p>Open the console to see the output</p>;
};
