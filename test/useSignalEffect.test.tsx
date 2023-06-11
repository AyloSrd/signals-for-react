import { fireEvent, render, renderHook } from '@testing-library/react';
import { useSatellite, useSignal, useSignalEffect } from '../src';
import { createSignal } from '../src/Signal';
import * as React from 'react';

describe('useSignalEffect, basic use cases', () => {
    describe('when you pass a signal to useSignalEffect, and the signal updates', () => {
        test('it should call the callback function', () => {
            const signal = createSignal(0, () => {});
            let count = 0
            renderHook(() => {
                useSignalEffect(() => {
                    count = signal.current
                }, [signal])
            })

            signal.set(10)

            expect(count).toBe(10)
        })
    })
    describe('when you pass several signals to useSignalEffect, and one signal updates', () => {
        test('it should call the callback function', () => {
            const digitSignal = createSignal(0, () => {});
            const stringSignal = createSignal('a', () => {});
            let digit
            let string 

            renderHook(() => {
                useSignalEffect(() => {
                    digit = digitSignal.current
                    string = stringSignal.current

                }, [digitSignal, stringSignal])
            })

            digitSignal.set(10)
            expect(digit).toBe(10)
            expect(string).toBe('a')

            stringSignal.set('ab')
            expect(digit).toBe(10)
            expect(string).toBe('ab')
        })
    })
})
