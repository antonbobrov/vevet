import { FC, useEffect } from 'react';
import { Callbacks } from '..';

interface ITypes {
  render: { fps: number };
  empty: undefined;
}

export const Component: FC = () => {
  useEffect(() => {
    const callbacks = new Callbacks<ITypes>();

    const renderSimple = callbacks.add('render', () => {}, {
      name: 'render simple',
    });

    const emptySimple = callbacks.add('empty', () => {}, {
      name: 'empty simple',
    });

    callbacks.add('empty', () => {}, {
      isOnce: true,
      name: 'empty once',
    });

    const emptyProtected = callbacks.add('empty', () => {}, {
      isProtected: true,
      name: 'empty protected',
    });

    callbacks.add('empty', () => {}, {
      isProtected: true,
      isOnce: true,
      name: 'empty protected and once',
    });

    callbacks.tbt('empty', undefined);
    callbacks.tbt('render', { fps: 10 });

    // eslint-disable-next-line no-console
    console.log(callbacks.callbacks.map(({ name }) => name));

    renderSimple.remove();
    emptySimple.remove();
    emptyProtected.remove();
    // eslint-disable-next-line no-console
    console.log(callbacks.callbacks.map(({ name }) => name));

    return () => callbacks.destroy();
  }, []);

  return null;
};
