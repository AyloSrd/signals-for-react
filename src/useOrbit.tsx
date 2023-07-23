import * as React from 'react';
import { Signal as SignalClass, unsubscribeFromSelfSymbol } from './Signal';
import { useRerender } from './useRerender';
import { Signal, SignalValue } from './types';
import { callFnIf, createSatellite } from './utils/utils';

export function useOrbit<P extends {}>(props: P) {
  const rerender = useRerender();
  const isFirstHookCall = React.useRef(true);

  const {
    satellites,
    unsubscribeFns
  } = React.useRef(
    callFnIf(
      () => {
        const satellites: Partial<P> & Record<string, Signal<any>> = {};
        const unsubscribeFns: (() => void)[] = [];
        for (const propKey in props) {
          const prop = props[propKey];
          if (prop instanceof SignalClass) {
            const [satellite, unsubscribe] = createSatellite(prop, rerender);

            satellites[propKey] = satellite as (Partial<P> &
              Record<string, Signal<any>>)[Extract<keyof P, string>] &
              Signal<SignalValue<typeof prop>>;
            unsubscribeFns.push(unsubscribe);
          }
        }

        return ({
            satellites,
            unsubscribeFns
        })
      },
      () => isFirstHookCall.current
    )
  ).current!;

  for (const satellite in satellites) {
    satellites[satellite][unsubscribeFromSelfSymbol]();
  }

  React.useEffect(() => {
    return () => {
      for (const unsubscribe of unsubscribeFns) unsubscribe();
    };
  }, []);

  return satellites;
}
