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

  signal.unsubscribeFromSelf();

  const unsubscribe = React.useRef(
    propsSignal.subscribe(signal[handleSubscribeSymbol])
  ).current;

  React.useEffect(() => unsubscribe(), []);

  return signal;
}
