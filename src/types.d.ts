import { Signal as SignalClass } from './Signal';

export type Signal<T> = SignalClass<T>;
export type MessageFunction<T> = (nextValue: T, messageId: number) => void;
