import {
  createSignalInternal,
  onValueUpdateFromSubscriberSymbol,
  handleSubscribeSymbol,
  unsubscribeFromSelfSymbol
} from './Signal';
import { useRerender } from './useRerender';
import * as React from 'react';

export function useSignal<T>(initialValue: T) {
  const rerender = useRerender();

  const signal = React.useRef(createSignalInternal(initialValue, rerender)).current;
  signal[unsubscribeFromSelfSymbol](); // we have to clear the value requests at each rerender, in case a value requests exists from previous rerenders

  return signal;
}

