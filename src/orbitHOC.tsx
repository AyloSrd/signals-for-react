import * as React from 'react';
import {
  Signal as SignalClass,
  unsubscribeFromSelfSymbol,
} from './Signal';
import { useRerender } from './useRerender';
import { Signal, SignalValue } from './types';
import { createSatellite } from './utils/utils';
import { useOrbit } from './useOrbit';

export function orbit<P extends {}>(Component: React.ComponentType<P>) {
  return (props: P) => {
    const rerender = useRerender();
    const satellites = useOrbit(props)

    return (
      <Component
        {...props}
        {...satellites}
      />
    );
  };
}

export const meomizedSatellite = <P extends {}>(Component: React.ComponentType<P>, propsAreEqual?: ((prevProps: object, nextProps: object) => boolean) | undefined) => {
    const Satellite = orbit<P>(Component)
    return React.memo<P>(Satellite, propsAreEqual)
}
