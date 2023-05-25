import { useSignal } from '../../../src'
import * as React from 'react'

interface Props {
    onSnapshot?: (snapshot: number) => void,
    onRerender?: () => void
}

export function SimpleUseSignalWrapper({ onSnapshot, onRerender }: Props) {
    const count = useSignal(0)
    const [show, setShow] = React.useState(true)

    onRerender?.()

    return (
        <>
            <button onClick={() => setShow(s => !s)}>
                {show ? 'hide' : 'show'}
            </button>
            <button onClick={() => count.value = count.snapshot + 1}>increment</button>
            {
                onSnapshot && <button onClick={() => onSnapshot(count.snapshot)}>snapshot</button>
            }
            {show && <p>count: {count.value}</p>}
        </>
    )
}