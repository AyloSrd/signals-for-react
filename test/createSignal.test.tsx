import { CreateSignalWrapper } from "./utils/components/createSignalWrapper";
import { render, fireEvent } from '@testing-library/react';
import * as React from 'react';

describe('createSignal, basic use cases', () => {
    describe('when several components observe, with useSatellite, a signal created with createSignal', () => {
        test('they are all in sync with said component', () => {
            const { getByText } = render(
                <CreateSignalWrapper />
            )

            expect(getByText('child-1 0')).toBeTruthy();
            expect(getByText('child-2 0')).toBeTruthy();
        })
    
    })
    describe('when several components observe a signal created with createSignal, and one component updates the signal', () => {
        test('all components observing said signal should update', () => {
            const { getByText } = render(
                <CreateSignalWrapper />
            )

            fireEvent.click(getByText('child-1 count++'));
            expect(getByText('child-1 1')).toBeTruthy();
            expect(getByText('child-2 1')).toBeTruthy();
            
            fireEvent.click(getByText('child-2 count++'));
            expect(getByText('child-1 2')).toBeTruthy();
            expect(getByText('child-2 2')).toBeTruthy();
        })
    
    })
})
