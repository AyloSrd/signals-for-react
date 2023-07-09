import {
  createSignalInternal,
  unsubscribeFromSelfSymbol
} from './Signal';
import { useRerender } from './useRerender';
import * as React from 'react';

/**
 * Creates a signal of the provided value.
 *
 * @param {T} initialValue - The initial value of the signal.
 * @returns {Signal} The created signal.
 */
export function useSignal<T>(initialValue: T) {
  const rerender = useRerender();

  const signal = React.useRef(createSignalInternal(initialValue, rerender)).current;
  signal[unsubscribeFromSelfSymbol](); // we have to clear the value requests at each rerender, in case a value requests exists from previous rerenders

  return signal;
}

