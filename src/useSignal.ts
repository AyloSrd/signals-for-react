import { createSignalInternal, unsubscribeFromSelfSymbol } from './Signal';
import { useRerender } from './useRerender';
import { callFnIf } from './utils/utils';
import * as React from 'react';

/**
 * Creates a signal of the provided value.
 *
 * @param {T} initialValue - The initial value of the signal.
 * @returns {Signal} The created signal.
 */
export function useSignal<T>(initialValue: T) {
  const isFirstHookCall = React.useRef(true);

  const rerender = useRerender();

  const signal = React.useRef(
    callFnIf(
      () => {
        const _signal = createSignalInternal(initialValue, rerender);

        if (isFirstHookCall.current) isFirstHookCall.current = false;

        return _signal;
      },
      () => isFirstHookCall.current
    )
  ).current!;
  signal[unsubscribeFromSelfSymbol](); // we have to clear the value requests at each rerender, in case a value requests exists from previous rerenders

  return signal;
}
