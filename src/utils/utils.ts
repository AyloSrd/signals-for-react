import { Signal, SignalValues } from '../types';

export function extractSignalValues<T extends Signal<any>[] | []>(signals: T): SignalValues<T> {
    return signals.map(signal => signal.value) as SignalValues<T>;
}

export function createDerivedSignalProxy<T>(signal: Signal<T>): Signal<T> {
    return new Proxy(signal, {
      get(target: Signal<T>, prop: keyof Signal<T>) {
        if (prop === 'value' || prop === 'sub') {
          return target[prop];
        }
        throw new Error(`Cannot access method '${String(prop)}'.`);
      },
      set() {
        throw new Error('Cannot set value of derived signal.');
      },
    });
  }
