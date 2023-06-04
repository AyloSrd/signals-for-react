import { Signal, subscribeSymbol } from './Signal';
import { SignalValue } from './types';
import * as React from 'react';

/**
 * Custom React hook that triggers a callback function when the values of the provided Signal dependencies change.
 * Analogous to React's useEffect hook, but for Signals.
 *
 */
export function useSignalEffect<T extends [...(Signal<any>[] | [])]>(
  cb: (
    ...args: { [K in keyof T]: T[K] extends Signal<infer R> ? R : never } & {
      length: T['length'];
    }[]
  ) => void | (() => void),
  deps: T
) {
  const prevValues = React.useRef(
    deps.map(extractSignalType)
  );
  const unsubscribes = React.useRef<(() => void)[]>([]);

  React.useEffect(() => {
    function handleSubscribe() {
      // @ts-ignore: have to figure that one out yet
      cb(...prevValues.current);
      prevValues.current = deps.map(extractSignalType);
    }

    for (const signal of deps) {
      unsubscribes.current.push(signal[subscribeSymbol](handleSubscribe));
    }

    return () => unsubscribes.current.forEach((unsubscribe) => unsubscribe());
  }, []);
}

declare function all<T extends any[] | []>( // note | [] here
  values: T
): Promise<{ [K in keyof T]: T[K] extends Signal<infer R> ? R : T[K] }>;

declare function useSignalEffect2<T extends Signal<any>[] | []>(
  cb: (
    ...args: { [K in keyof T]: T[K] extends Signal<infer R> ? R : never }[]
  ) => void | (() => void),
  deps: T
): void;

class Maybe<T> {}

type MaybeTuple = [Maybe<string>, Maybe<number>, Maybe<boolean>];

type MaybeType<T> = T extends Maybe<infer MaybeType> ? MaybeType : never;
type MaybeTypes<Tuple extends [...any[]]> = {
  [Index in keyof Tuple]: MaybeType<Tuple[Index]>;
} & { length: Tuple['length'] };

let extractedTypes: MaybeTypes<MaybeTuple> = ['hello', 3, true];

function extractSignalType<T extends Signal<any>>(
  signal: T
): SignalValue<T> {
  return signal.peep;
}
