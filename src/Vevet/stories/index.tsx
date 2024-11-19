import React, { FC, useCallback, useEffect, useState } from 'react';
import { getApp } from '@/utils/internal/getApp';
import { pickObjectProps } from '@/utils/internal/pickObjectProps';

export const Component: FC = () => {
  const [features, setFeatures] =
    useState<Record<string, boolean | number | string>>();

  const updateFeatures = useCallback(() => {
    const object = pickObjectProps(getApp(), [
      'version',
      'prefix',
      'isDesktop',
      'isTablet',
      'isPhone',
      'isMobile',
      'browserName',
      'osName',
      'isWebpSupported',
      'isPageLoaded',
      'breakpoint',
      'width',
      'height',
      'sHeight',
      'isLandscape',
      'isPortrait',
      'dpr',
      'lowerDpr',
      'vh',
      'svh',
      'vw',
    ]);

    setFeatures(object);
  }, []);

  useEffect(() => {
    updateFeatures();

    const viewportCallback = getApp().onViewport('any', () => updateFeatures());

    return () => viewportCallback();
  }, [updateFeatures]);

  return (
    <div>
      <button type="button" onClick={updateFeatures}>
        Update features
      </button>

      {features &&
        Object.keys(features).map((key) => {
          const value = features[key];
          const stringValue = String(value);

          return <div key={key}>{`${key}: ${stringValue}`}</div>;
        })}
    </div>
  );
};
