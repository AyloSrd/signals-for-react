import * as React from 'react';
import {
  Signal as SignalClass,
  onValueUpdateFromSubscriberSymbol,
  handleSubscribeSymbol,
  createSignalInternal,
  subscribeSymbol,
  unsubscribeFromSelfSymbol,
} from './Signal';
import { useRerender } from './useRerender';
import { Signal, SignalValue } from './types';

export function satellite<P extends {}>(Component: React.ComponentType<P>) {
  return (props: P) => {
    const rerender = useRerender();
    const satellites = React.useRef<
      (Partial<P> & Record<string, Signal<any>>) | null
    >(null);
    const unsubscribeFns = React.useRef<(() => void)[]>([]);

    if (satellites.current === null) {
      for (const propKey in props) {
        const prop = props[propKey];
        if (prop instanceof SignalClass) {
          const [satellite, unsubscribe] = createSatellite(prop, rerender);

          if (satellites.current === null) satellites.current = {};
          satellites.current[propKey] = satellite as (Partial<P> &
            Record<string, Signal<any>>)[Extract<keyof P, string>] &
            Signal<SignalValue<typeof prop>>;
          unsubscribeFns.current.push(unsubscribe);
        }
      }

      for (const satellite in satellites.current) {
        satellites.current[satellite][unsubscribeFromSelfSymbol]();
      }
    }

    React.useEffect(() => {
      return () => {
        for (const unsubscribe of unsubscribeFns.current) unsubscribe();
      };
    }, []);

    return (
      <Component
        {...props}
        {...(satellites.current != null ? satellites.current : {})}
      />
    );
  };
}

function createSatellite<T>(signal: Signal<T>, rerender: () => void) {
  const satellite = createSignalInternal(
    signal.value,
    rerender,
    signal[onValueUpdateFromSubscriberSymbol]
  );
  const unsubscribe = signal[subscribeSymbol](satellite[handleSubscribeSymbol]);

  return [satellite, unsubscribe] as const;
}
