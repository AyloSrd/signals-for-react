import {
    useSatellite
} from '../../src';
import { numbers, addNumber, removeNumber } from '../signals/numbers'
import React from 'react';

export function WrapGlobalSignal() {
return (
        <>
            <h2>1</h2>
            <WrapGlobalSignalChild />
            <br />
            <h2>2</h2>
            <WrapGlobalSignalChild />
            <br />
            <h2>3</h2>
            <WrapGlobalSignalChild />
        </>
    )
}

function WrapGlobalSignalChild() {
    const nums = useSatellite(numbers);

    return (
        <>
            <button onClick={() => addNumber(Math.round(Math.random()*10))}>add number</button>
            <button onClick={() => removeNumber(Math.round(Math.random()*10))}>remove number</button>
            <br />
            {nums.sub().map(
                (n, i) => <p key={`${n} - ${i}`}>{n}</p>
            )}
        </>
    )
}