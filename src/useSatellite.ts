import {
  Signal,
  unsubscribeFromSelfSymbol,
} from './Signal';
import { useRerender } from './useRerender';
import { createSatellite, callFnIf } from './utils/utils';
import * as React from 'react';

/**
 * Hooks that bounds a Signal to the component where it is used;
 * It returns another signal synchronized to the observed one;
 *
 * @param {Signal<T>} propsSignal - The signal to be bound to the component.
 * @return {Signal<T>} - The signal that manages the state.
 */

export function useSatellite<T>(propsSignal: Signal<T>) {
  const rerender = useRerender();
  const isFirstHookCall = React.useRef(true)

  const [signal, unsubscribe] = React.useRef(
    callFnIf(() => {
      const satellite = createSatellite(
        propsSignal,
        rerender,
      )

      if (isFirstHookCall.current) isFirstHookCall.current = false
      
      return satellite

    },
    () => isFirstHookCall.current
    ),
  ).current!

  React.useEffect(() => {
    return () => {
      unsubscribe();
    };
  }, []);

  signal[unsubscribeFromSelfSymbol]();

  return signal;
}
