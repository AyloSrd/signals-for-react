import * as React from 'react';

import { useRerender } from './useRerender';
import { useOrbit } from './useOrbit';

/**
 * HOC to bind the signals in the props directly to the wrapped component.
 *
 * @param {React.ComponentType<P>} Component - The component to be wrapped.
 * @template P - The type of props that the component expects.
 * @returns {(props: P) => JSX.Element} - The wrapped component.
 */
export function orbit<P extends {}>(Component: React.ComponentType<P>) {
  return (props: P) => {
    const boundProps = useOrbit(props)

    return (
      <Component
        {...boundProps}
      />
    );
  };
}

export const meomizedSatellite = <P extends {}>(Component: React.ComponentType<P>, propsAreEqual?: ((prevProps: object, nextProps: object) => boolean) | undefined) => {
    const Satellite = orbit<P>(Component)
    return React.memo<P>(Satellite, propsAreEqual)
}
