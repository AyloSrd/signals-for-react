import {
  Signal,
  onValueUpdateFromSubscriberSymbol,
  handleSubscribeSymbol,
  createSignal,
} from './Signal';
import { useRerender } from './useRerender';
import * as React from 'react';

export function useSatellite<T>(propsSignal: Signal<T>) {
  const rerender = useRerender();
  const signal = React.useRef(
    createSignal(
      propsSignal.snapshot,
      rerender,
      propsSignal[onValueUpdateFromSubscriberSymbol]
    )
  ).current;

  React.useEffect(() => {
    const unsubscribe = propsSignal.subscribe(signal[handleSubscribeSymbol]);
    return () => {
      unsubscribe();
    };
  }, []);

  signal.unsubscribeFromSelf();

  return signal;
}
