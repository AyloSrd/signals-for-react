import * as React from 'react';
import { Signal as SignalClass, unsubscribeFromSelfSymbol } from './Signal';
import { useRerender } from './useRerender';
import { Signal, SignalValue } from './types';
import { callFnIf, createSatellite } from './utils/utils';

type ExtractSignals<P extends {}> = {
  [K in keyof P]: P[K] extends Signal<infer T> ? Signal<T> : never;
};

export function useOrbit<P extends {}>(props: P) {
  const rerender = useRerender();
  const isFirstHookCall = React.useRef(true);

  const { satellites, unsubscribeFns } = React.useRef(
    callFnIf(
      () => {
        const satellites = {} as ExtractSignals<P>;
        const unsubscribeFns: (() => void)[] = [];
        for (const propKey in props) {
          const prop = props[propKey];
          if (prop instanceof SignalClass) {
            const [satellite, unsubscribe] = createSatellite(prop, rerender);

            satellites[propKey] =
              satellite as ExtractSignals<P>[typeof propKey];
            unsubscribeFns.push(unsubscribe);
          }
        }

        return {
          satellites,
          unsubscribeFns,
        };
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
