import React, { FC, useCallback, useEffect, useState } from 'react';
import { vevet } from '@/src/vevet';
import { pickObjectProps } from '@/utils/common';

const { viewport } = vevet;

export const Component: FC = () => {
  const [features, setFeatures] = useState<Record<string, boolean | number>>();

  const updateFeatures = useCallback(() => {
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
      'lowerDesktopDpr',
      'vh',
      'vw',
      'vr',
    ]);

    setFeatures(object);
  }, []);

  useEffect(() => {
    updateFeatures();

    const callback = viewport.add('any', () => updateFeatures());

    return () => callback.remove();
  }, [updateFeatures]);

  return (
    <div>
      {features &&
        Object.keys(features).map((key) => {
          const value = features[key];
          const stringValue = String(value);

          return (
            <div key={key}>
              {key}: {stringValue}
            </div>
          );
        })}
    </div>
  );
};
