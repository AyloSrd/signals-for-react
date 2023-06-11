import { Signal, subscribeSymbol } from './Signal';
import { SignalValues } from './types';
import { extractSignalValues } from './utils/utils';
import * as React from 'react';

/**
 * Custom React hook that triggers a callback function when the values of the provided Signal dependencies change.
 * Analogous to React's useEffect hook, but for Signals.
 *
 */
export function useSignalEffect<T extends Signal<any>[] | []>(
  cb: (
    ...args: SignalValues<T>
  ) => void | (() => void),
  deps: T
) {
  const prevValues = React.useRef(extractSignalValues(deps));
  const unsubscribes = React.useRef<(() => void)[]>([]);

  React.useEffect(() => {
    function handleSubscribe() {
      // @ts-ignore: have to figure that one out yet
      cb(...prevValues.current);
      prevValues.current = extractSignalValues(deps);
    }

    for (const signal of deps) {
      unsubscribes.current.push(signal[subscribeSymbol](handleSubscribe));
    }      
    
    // @ts-ignore: have to figure that one out yet
    cb(...prevValues.current)
  
    return () => unsubscribes.current.forEach((unsubscribe) => unsubscribe());
  }, []);
}
