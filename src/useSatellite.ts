import {
  Signal,
  onValueUpdateFromSubscriberSymbol,
  handleSubscribeSymbol,
  createSignal,
  subscribeSymbol,
  unsubscribeFromSelfSymbol,
} from './Signal';
import { useRerender } from './useRerender';
import * as React from 'react';

export function useSatellite<T>(propsSignal: Signal<T>) {
  const rerender = useRerender();
  const signal = React.useRef(
    createSignal(
      propsSignal.peep,
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
