import { useEffect, useRef, useState } from 'react';

const INITIAL_DEPS: any[] = [];

export function useOnProps(
  nextProps: any,
  refProps: any,
  effect: ((props: any) => () => void) | ((props: any) => void),
  deps: any[] = INITIAL_DEPS,
) {
  const prevPropsRef = useRef({ ...nextProps });
  const nextPropsRef = useRef({ ...nextProps });
  const effectRef = useRef(effect);

  const [iteration, setIteration] = useState(0);

  useEffect(() => {
    effectRef.current = effect;
  }, [effect]);

  useEffect(() => {
    const refKeys = Object.keys(refProps);

    let shouldChange = false;

    refKeys.forEach((refKey) => {
      const prevProp = prevPropsRef.current[refKey];
      const nextProp = nextProps[refKey];

      if (nextProp !== prevProp) {
        shouldChange = true;
      }
    });

    prevPropsRef.current = { ...nextProps };
    nextPropsRef.current = { ...nextProps };

    if (shouldChange) {
      setIteration((val) => val + 1);
    }
  }, [nextProps, refProps]);

  useEffect(() => {
    if (deps.length > 0) {
      setIteration((val) => val + 1);
    }
  }, [deps]);

  useEffect(() => {
    if (typeof iteration === 'number') {
      return effectRef.current({ ...nextPropsRef.current });
    }
  }, [iteration]);
}
