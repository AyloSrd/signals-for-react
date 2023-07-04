import { render, renderHook, fireEvent } from '@testing-library/react';
import { createSignal, useDerived, useSatellite, useSignal } from '../src';
import {
    WrapUseDerivedDotValue,
    WrapUseDerivedDotSub
} from './utils/components/useDerivedWrapper'
import * as React from 'react';

describe('useDerived, basic use cases', () => {
  describe('when you pass a signal to useDerived, and the signal updates', () => {
    test('it should call the callback function', () => {
      const signal = createSignal(0, () => {});

      const { result } = renderHook(() =>
        useDerived(() => signal.value * 2, [signal])
      );

      signal.value++;

      expect(result.current.value).toBe(2);
    });
  });
  describe('when you pass several signals to useDerived, and one signal updates', () => {
    test('it should call the callback function', () => {
      const digitSignal = createSignal(0, () => {});
      const stringSignal = createSignal('a', () => {});

      const { result } = renderHook(() =>
        useDerived(
          () => `${digitSignal.value} - ${stringSignal.value}`,
          [digitSignal, stringSignal]
        )
      );

      const derived = result.current;

      digitSignal.value = 10;
      expect(derived.value).toBe('10 - a');

      stringSignal.value = 'ab';
      expect(derived.value).toBe('10 - ab');
    });
  });
  describe('when useDerived is first called', () => {
    test('it initially calls the callback function', () => {
        const signal = createSignal(1, () => {});

        const { result } = renderHook(() =>
          useDerived(() => signal.value * 2, [signal])
        );
  
        expect(result.current.value).toBe(2);
    });
    test('it initially calls the callback function once, even if watching multiple signals', () => {
        const digitSignal = createSignal(0, () => {});
        const stringSignal = createSignal('a', () => {});
  
        const { result } = renderHook(() =>
          useDerived(
            () => `${digitSignal.value} - ${stringSignal.value}`,
            [digitSignal, stringSignal]
          )
        );
  
        const derived = result.current;
        expect(derived.value).toBe('0 - a');
    });
  });
  
  describe('when useDerived is watching a setellite signal', () => {
    test('it updates whenever the satellite value changes', () => {
      const signal = createSignal(1, () => {});

      const { result } = renderHook(() => {
        const satellite = useSatellite(signal);
        const double = useDerived(() => (
          satellite.value * 2
      ), [satellite]);
      return double
      });

      signal.value = 2;
      expect(result.current.value).toBe(4);
    });
  });
 
  describe('when the derived signal is used', () => {
    test('it returns the updated value when accessed with derived.value, without triggering re-renders', () => {
        const { getByText } = render(<WrapUseDerivedDotValue />)
        fireEvent.click(getByText('count1++'))

        expect(getByText('0 - 0')).toBeTruthy()

        fireEvent.click(getByText('count2++'))

        expect(getByText('0 - 0')).toBeTruthy()
    })


    test('it returns the updated value when accessed with derived.sub(), causing re-render', () => {
        const { getByText } = render(<WrapUseDerivedDotSub />)
        fireEvent.click(getByText('count1++'))

        expect(getByText('1 - 0')).toBeTruthy()

        fireEvent.click(getByText('count2++'))

        expect(getByText('1 - 1')).toBeTruthy()
    })

    test('it throws error when derived.value is used to set a new value', () => {
        const { result } = renderHook(() => {
            const signal = useSignal(0)
            const derived = useDerived(() => signal.value * 2, [signal])

            return derived
        })

        expect(() => result.current.value++).toThrow('Cannot set value of derived signal.')
    })
  })
})
