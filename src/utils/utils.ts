import { createSignalInternal, handleSubscribeSymbol, onValueUpdateFromSubscriberSymbol, subscribeSymbol } from '../Signal';
import { Signal, SignalValues } from '../types';

export function extractSignalValues<T extends Signal<any>[] | []>(signals: T): SignalValues<T> {
    return signals.map(signal => signal.value) as SignalValues<T>;
}

export function createDerivedSignalProxy<T>(signal: Signal<T>): Signal<T> {
    return new Proxy(signal, {
      get(target: Signal<T>, prop: keyof Signal<T>) {
        if (prop === 'value') {
          return target[prop];
        }
        if (prop === 'sub') {
          return function (){
            return target[prop]();
          }
        }
        throw new Error(`Cannot access method '${String(prop)}'.`);
      },
      set() {
        throw new Error('Cannot set value of derived signal.');
      },
    });
  }

export function createSatellite<T>(signal: Signal<T>, selfSubscription: () => void) {
  const satellite = createSignalInternal(
    signal.value,
    selfSubscription,
    signal[onValueUpdateFromSubscriberSymbol]
  );
  const unsubscribe = signal[subscribeSymbol](satellite[handleSubscribeSymbol]);

  return [satellite, unsubscribe] as const;
}

export function callFnIf<T>(fn: () => T, condition: () => boolean) {
  if(!condition()) return
  return fn()
}