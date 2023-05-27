import { Signal as SignalClass } from './Signal'

export type Signal<T> = typeof SignalClass
export type MessageFunction<T>  = (nextValue: T, messageId: number) => void