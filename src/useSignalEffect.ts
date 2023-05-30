import { Signal, subscribeSymbol } from './Signal';
import { type SignalValue } from './types';
import * as React from 'react';

/**
 * Custom React hook that triggers a callback function when the values of the provided Signal dependencies change.
 * Analogous to React's useEffect hook, but for Signals.
 * 
 * @template T - The type of the Signal values.
 * @param {(...args: SignalValue<T>[]) => void | (() => void)} cb - The callback function to be executed when the Signal values change. It receives the current values of the Signals as arguments. The callback can optionally return a cleanup function.
 * @param {Signal<SignalValue<T>>[]} deps - An array of Signal dependencies whose values are monitored for changes.
 * @returns {void}
 */
export function useSignalEffect<T>(
  cb: (...args: SignalValue<T>[]) => void | (() => void),
  deps: Signal<SignalValue<T>>[]
) {
  const prevValues = React.useRef<SignalValue<T>[]>(
    deps.map((signal) => signal.peep)
  );
  const unsubscribes = React.useRef<(() => void)[]>([]);

  React.useEffect(() => {
    function handleSubscribe() {
      cb(...prevValues.current);
      prevValues.current = deps.map((signal) => signal.peep);
    }

    for (const signal of deps) {
      unsubscribes.current.push(signal[subscribeSymbol](handleSubscribe));
    }

    return () => unsubscribes.current.forEach((unsubscribe) => unsubscribe());
  }, []);
}
