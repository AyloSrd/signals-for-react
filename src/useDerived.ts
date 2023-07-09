import { Signal, subscribeSymbol } from './Signal';
import { useSignal } from './useSignal';
import { createDerivedSignalProxy, extractSignalValues } from './utils/utils';
import * as React from 'react';

/**
 * Hook that takes a callback function returning a specific value and an array of signal dependencies and returns a derived readonly signal.
 * Analogous to React's useMemo hook, but for Signals.
 * 
 * @param {() => D} cb - The callback function that returns the derived value.
 * @param {T} deps - The array of dependencies that trigger the recalculation of the derived value.
 * @return {DerivedSignal} The derived signal that contains the calculated value based on the callback function and dependencies.
 */

export function useDerived<D, T extends Signal<any>[] | []>(
  cb: () => D,
  deps: T
) {
  const signal = useSignal(cb());
  const derivedSignal = React.useRef(createDerivedSignalProxy(signal)).current;
  const unsubscribes = React.useRef<(() => void)[]>([]);

  React.useEffect(() => {
    function handleSubscribe() {
      signal.value = cb();
    }
    for (const signal of deps) {
      unsubscribes.current.push(signal[subscribeSymbol](handleSubscribe));
    }

    return () => unsubscribes.current.forEach((unsubscribe) => unsubscribe());
  }, []);

  return derivedSignal;
}
