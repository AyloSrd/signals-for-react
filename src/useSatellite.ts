import {
  Signal,
  onValueUpdateFromSubscriberSymbol,
  handleSubscribeSymbol,
  createSignalInternal,
  subscribeSymbol,
  unsubscribeFromSelfSymbol,
} from './Signal';
import { useRerender } from './useRerender';
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
  const signal = React.useRef(
    createSignalInternal(
      propsSignal.value,
      rerender,
      propsSignal[onValueUpdateFromSubscriberSymbol]
    )
  ).current;

  React.useEffect(() => {
    const unsubscribe = propsSignal[subscribeSymbol](signal[handleSubscribeSymbol]);
    return () => {
      unsubscribe();
    };
  }, []);

  signal[unsubscribeFromSelfSymbol]();

  return signal;
}
