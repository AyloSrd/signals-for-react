import { Signal, subscribeSymbol } from './Signal';
import { SignalValues } from './types';
import { useRerender } from './useRerender';
import { extractSignalValues } from './utils/utils';
import * as React from 'react';

/**
 * Custom React hook that triggers a callback function when the values of the provided Signal dependencies change.
 * Analogous to React's useEffect hook, but for Signals.
 *
 */
export function useSignalEffect<T extends Signal<any>[] | [], D>(
  cb: () => D,
  deps: T
) {
const signal = React.useRef()
  const unsubscribes = React.useRef<(() => void)[]>([]);

  React.useEffect(() => {
    signal.current 
    for (const signal of deps) {
      unsubscribes.current.push(signal[subscribeSymbol](cb));
    }      
  
    return () => unsubscribes.current.forEach((unsubscribe) => unsubscribe());
  }, []);
}

