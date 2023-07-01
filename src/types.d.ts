import { Signal as SignalClass } from './Signal';

export type Signal<T> = SignalClass<T>;
export type SignalValue<T> = T extends Signal<infer U> ? U : never;
export type MessageFunction<T> = (nextValue: T, messageId: number) => void;
export type SignalValues<T> = { [K in keyof T]: SignalValue<T[K]> } & {
  length: T['length'];
}[];
export type DerivedSignal<T> = Proxy<Signal<T>>
