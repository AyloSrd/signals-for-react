import * as React from 'react';
import { Signal, unsubscribeFromSelfSymbol } from './Signal';
import { useRerender } from './useRerender';
import { type ExtractSignalsFromObject } from './types';
import { callFnIf, createSatellite } from './utils/utils';

/**
 * Hook that generates a collection of satellites by identifying signals from the provided props object.
 *
 * @template P - The type of the props object
 * @param {P} props - The props object containing the signals
 * @return {ExtractSignalsFromObject<P>} - The collection of satellites generated from the signals
 */

export function useOrbit<P extends {}>(props: P) {
  const rerender = useRerender();
  const isFirstHookCall = React.useRef(true);

  const { satellites, unsubscribeFns } = React.useRef(
    callFnIf(
      () => {
        const satellites = {} as ExtractSignalsFromObject<P>;
        const unsubscribeFns: (() => void)[] = [];
        for (const propKey in props) {
          const prop = props[propKey];
          if (prop instanceof Signal) {
            const [satellite, unsubscribe] = createSatellite(prop, rerender);

            satellites[propKey] =
              satellite as ExtractSignalsFromObject<P>[typeof propKey];
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
