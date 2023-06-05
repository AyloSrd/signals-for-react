import { Signal, SignalValues } from '../types';

export function extractSignalValues<T extends Signal<any>[] | []>(signals: T): SignalValues<T> {
    return signals.map(signal => signal.peep) as SignalValues<T>;
}
