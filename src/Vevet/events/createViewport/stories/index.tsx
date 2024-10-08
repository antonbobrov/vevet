import React, { FC, useCallback, useEffect, useState } from 'react';
import { getApp } from '@/utils/internal/getApp';
import { pickObjectProps } from '@/utils/internal/pickObjectProps';

export const Component: FC = () => {
  const [features, setFeatures] = useState<Record<string, boolean | number>>();

  const updateFeatures = useCallback(() => {
    const { viewport } = getApp();

    const object = pickObjectProps(viewport, [
      'isDesktop',
      'isTablet',
      'isPhone',
      'width',
      'height',
      'radius',
      'isLandscape',
      'isPortrait',
      'dpr',
      'lowerDpr',
      'vh',
      'vw',
      'vr',
    ]);

    setFeatures(object);
  }, []);

  useEffect(() => {
    updateFeatures();

    const callback = getApp().viewport.callbacks.add('any', () =>
      updateFeatures(),
    );

    return () => callback.remove();
  }, [updateFeatures]);

  return (
    <div>
      {features &&
        Object.keys(features).map((key) => {
          const value = features[key];
          const stringValue = String(value);

          return <div key={key}>{`${key}: ${stringValue}`}</div>;
        })}
    </div>
  );
};
