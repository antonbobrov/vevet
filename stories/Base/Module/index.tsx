import React, { FC, useEffect, useState } from 'react';

import {
  IModuleCallbacksMap,
  IModuleMutableProps,
  IModuleStaticProps,
  Module,
} from '@/index';

// todo: update

interface ICallbacks extends IModuleCallbacksMap {}

type TStaticProps = IModuleStaticProps & {
  staticName: 'My name';
};

type TMutableProps = IModuleMutableProps & {
  weight: number;
  height: number;
};

export const Component: FC = () => {
  const [features, setFeatures] = useState<any>({});

  useEffect(() => {
    const module = new Module<ICallbacks, TStaticProps, TMutableProps>({
      staticName: 'My name',
      weight: 70,
      height: 175,
    });

    setFeatures(module.props);

    module.on('props', () => setFeatures({ ...module.props }));

    module.updateProps({});

    return () => {
      module.destroy();
    };
  }, []);

  return (
    <div>
      {Object.entries(features).map(([key, value]) => (
        <div key={key}>{`${key}: ${value}`}</div>
      ))}
    </div>
  );
};
