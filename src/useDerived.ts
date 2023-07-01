import { Signal, subscribeSymbol } from './Signal';
import { useSignal } from './useSignal';
import { createDerivedSignalProxy, extractSignalValues } from './utils/utils';
import * as React from 'react';

/**
 * Custom React hook that triggers a callback function when the values of the provided Signal dependencies change.
 * Analogous to React's useEffect hook, but for Signals.
 *
 */
export function useSignalEffect<D, T extends Signal<any>[] | []>(
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
