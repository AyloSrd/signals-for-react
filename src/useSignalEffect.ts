import {
  Signal,
  onValueUpdateFromSubscriberSymbol,
  handleSubscribeSymbol,
  createSignal,
  subscribeSymbol,
  unsubscribeFromSelfSymbol,
} from './Signal';
import * as React from 'react';

export function useSignalEffect<T>(
  cb: (...args: T[]) => void | (() => void),
  deps: Signal<T>[]
) {
  const subscriptions = React.useRef<number>(0);
  const currentMessageId = React.useRef<number>(Signal.getUID())
  const prevValues = React.useRef<T[]>();

  React.useEffect(() => {
    function handleSubscribe(nextValue: any) {

    };
    for (const [idx, signal] of deps.entries()) {
      signal[subscribeSymbol](handleSubscribe);
    }
  }, []);
}
