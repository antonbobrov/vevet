import React, { FC, useEffect, useState } from 'react';
import { Module, NModule } from '..';

interface IStaticProps extends NModule.IStaticProps {
  staticName: 'My name';
}

interface IChangeableProps extends NModule.IChangeableProps {
  weight: number;
  height: number;
}

interface ICallbacks extends NModule.ICallbacksTypes {}

export const Component: FC = () => {
  const [features, setFeatures] = useState<any>({});

  useEffect(() => {
    const module = new Module<IStaticProps, IChangeableProps, ICallbacks>(
      {
        staticName: 'My name',
        weight: 70,
        height: 175,
      },
      false,
    );

    module.addResponsiveProps({
      breakpoint: 'viewport_phone',
      settings: {
        weight: 80,
      },
    });

    module.init();
    setFeatures(module.props);

    module.addCallback('propsChange', () => {
      // eslint-disable-next-line no-console
      console.log('change props');

      setFeatures({ ...module.props });
    });

    module.addCallback('propsMutate', () => {
      // eslint-disable-next-line no-console
      console.log('mutate props');

      setFeatures({ ...module.props });
    });

    const timeout = setTimeout(() => {
      module.changeProps({ weight: 90 });
    }, 2500);

    return () => {
      module.destroy();
      clearTimeout(timeout);
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
