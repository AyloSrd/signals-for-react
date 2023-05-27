import { fireEvent, render } from '@testing-library/react'
import { SimpleUseSignalWrapper } from './utils/components/useSignalWrapper';
import * as React from 'react'

describe('Hooks, useSignal, testing alone', () => {
  it('the .value getter should return the signal value when accessed', () => {
    const { getByText } = render(<SimpleUseSignalWrapper />)
    expect(getByText('count: 0')).toBeTruthy()
  })

  it('it should update the value and cause a rerender when value getter is accessed and setter is used', () => {
    const { getByText } = render(<SimpleUseSignalWrapper />)
    expect(getByText('count: 0')).toBeTruthy()
    
    fireEvent.click(getByText(/increment/))
    expect(getByText('count: 1')).toBeTruthy()

    fireEvent.click(getByText(/increment/))
    expect(getByText('count: 2')).toBeTruthy()
  })

  it('useSignal should not trigger the rerender when value getter is not accessed and setter is used, but still update internal value', () => {
    let snapshot = 0
    let renders = 0

    function handleRerender() {
      renders++
    }

    function handleSnapshot(snap: number) {
      snapshot = snap
    }

    const { getByText } = render(<SimpleUseSignalWrapper onRerender={handleRerender} onSnapshot={handleSnapshot} />)
    expect(getByText('count: 0')).toBeTruthy()
    
    fireEvent.click(getByText(/increment/))
    expect(getByText('count: 1')).toBeTruthy()
    expect(renders).toBe(2)

    fireEvent.click(getByText(/hide/)) // this will cause one more render
    expect(renders).toBe(3)

    fireEvent.click(getByText(/increment/))
    expect(renders).toBe(3)
    
    fireEvent.click(getByText(/increment/))
    expect(renders).toBe(3)

    fireEvent.click(getByText(/snapshot/))
    expect(renders).toBe(3)
    expect(snapshot).toBe(3)

    fireEvent.click(getByText(/show/))
    expect(getByText('count: 3')).toBeTruthy()
  })
})
