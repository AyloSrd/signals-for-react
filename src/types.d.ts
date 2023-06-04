import { Signal as SignalClass } from './Signal';

export type Signal<T> = SignalClass<T>;
export type SignalValue<T> = T extends  Signal<infer U> ? never : U;
export type MessageFunction<T> = (nextValue: T, messageId: number) => void;
