import React, { FC, useCallback, useEffect, useState } from 'react';
import { vevet } from '@/src/vevet';
import { pickObjectProps } from '@/utils/common';

export const Component: FC = () => {
  const [features, setFeatures] =
    useState<Record<string, boolean | number | string>>();

  const updateFeatures = useCallback(() => {
    const object = pickObjectProps(vevet, [
      'version',
      'prefix',
      'isDesktop',
      'isTablet',
      'isPhone',
      'isMobile',
      'browserName',
      'osName',
      'isWebpSupported',
    ]);

    setFeatures(object);
  }, []);

  useEffect(() => {
    updateFeatures();

    const promise = vevet.onPageLoad();
    promise.then(() => updateFeatures()).catch(() => {});

    return () => promise.cancel();
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
