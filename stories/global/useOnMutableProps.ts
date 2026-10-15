import { useEffect, useRef } from 'react';

const filterProps = (nextProps: any, refProps: any) => {
  const props: Record<string, unknown> = {};

  Object.keys(refProps).forEach((key) => {
    props[key] = nextProps[key];
  });

  return props;
};

export function useOnMutableProps(
  instance: any,
  nextProps: any,
  refProps: any,
) {
  const prevPropsRef = useRef<Record<string, unknown>>(
    filterProps(nextProps, refProps),
  );

  useEffect(() => {
    if (!instance) {
      return;
    }

    const refKeys = Object.keys(refProps);

    let shouldChange = false;

    refKeys.forEach((refKey) => {
      const prevProp = prevPropsRef.current[refKey];
      const nextProp = nextProps[refKey];

      if (nextProp !== prevProp) {
        shouldChange = true;
      }
    });

    prevPropsRef.current = { ...filterProps(nextProps, refProps) };

    if (shouldChange) {
      instance.updateProps(prevPropsRef.current);
    }
  }, [instance, nextProps, refProps]);
}
