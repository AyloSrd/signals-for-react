import { Signal, onValueUpdateFromSubscriberSymbol, handleSubscribeSymbol } from './Signal'
import { useRerender } from './useRerender'
import * as React from 'react'

export function usePropSignal<T>(propsSignal: Signal<T>){
    const rerender = useRerender()
    const signal = React.useRef(new  Signal<T>(
        propsSignal.snapshot,
        rerender,
        propsSignal[onValueUpdateFromSubscriberSymbol]
    )).current

    signal.unsubscribeFromSelf()

    const unsubscribe = React.useRef(propsSignal.subscribe(
        signal[handleSubscribeSymbol]
    )).current

    React.useEffect(() => unsubscribe())

    return signal
}