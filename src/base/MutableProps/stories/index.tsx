import React, { FC, useEffect, useState } from 'react';
import { MutableProps } from '..';

interface IStaticProps {
  neverChange: 'never change';
}

interface IChangeableProps {
  viewport: string;
  device: string;
  name: string;
}

export const Component: FC = () => {
  const [features, setFeatures] = useState<any>({});

  useEffect(() => {
    const props = new MutableProps<IStaticProps, IChangeableProps>(
      {
        neverChange: 'never change',
        viewport: 'none',
        device: 'none',
        name: 'first name',
      },
      () => {
        // eslint-disable-next-line no-console
        console.log('changed on viewport resize', { ...props.props });

        setFeatures({ ...props.props });
      },
    );

    props.changeProps({ name: 'second name' });

    props.addResponsiveProps({
      breakpoint: 'device_mobile',
      settings: { device: 'mobile' },
    });

    props.addResponsiveProps({
      breakpoint: 'device_tablet',
      settings: { device: 'tablet' },
    });

    props.addResponsiveProps({
      breakpoint: 'device_phone',
      settings: { device: 'phone' },
    });

    props.addResponsiveProps({
      breakpoint: 'viewport_desktop',
      settings: { viewport: 'desktop' },
    });

    props.addResponsiveProps({
      breakpoint: 'viewport_tablet',
      settings: { viewport: 'tablet' },
    });

    props.addResponsiveProps({
      breakpoint: 'viewport_phone',
      settings: { viewport: 'phone' },
    });

    return () => props.destroy();
  }, []);

  return (
    <div>
      {Object.entries(features).map(([key, value]) => (
        <div key={key}>
          {key}: {String(value)}
        </div>
      ))}
    </div>
  );
};
