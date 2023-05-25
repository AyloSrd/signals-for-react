import { Signal } from '../src/index'
import { onValueUpdateFromSubscriberSymbol,  handleSubscribeSymbol } from '../src/Signal'

describe('Signal, local', () => {
  it('returns the value when accessed through signal.value and signal.snapshot', () => {
    const signal = new Signal(0,() => {})
    expect(signal.value).toBe(0)
    expect(signal.snapshot).toBe(0)
  })

  it('updates the value when the setter is called', () => {
    const signal = new Signal(0,() => {})
    signal.value = 1
    expect(signal.value).toBe(1)
    expect(signal.snapshot).toBe(1)
  })

  it('calls the onGetValue callback when value was accessed before', () => {
    let hasCalledCb = false

    function handleGetValue() {
      hasCalledCb = true
    }
    const signal = new Signal(0, handleGetValue)
    // here we access the value getter
    expect(signal.value).toBe(0)
    // here we set a new value
    signal.value = 1

    expect(signal.snapshot).toBe(1)
    expect(hasCalledCb).toBe(true)
  })

  it('does not trigger the onGetValue callback when Signal.clearValueRequests is called in between get and set', () => {
    let hasCalledCb = false

    function handleGetValue() {
      hasCalledCb = true
    }
    const signal = new Signal(0, handleGetValue)

    expect(signal.value).toBe(0)

    signal.clearValueRequests()
    signal.value = 1

    expect(signal.snapshot).toBe(1)
    expect(hasCalledCb).toBe(false)
  })
})

describe('Signal, remote subscriptions', () => {
  it('update the value in subscriber', () => {
    const signal = new Signal(0, () => {})
    const subscriber = new Signal(signal.snapshot, () => {})

    signal.subscribe(subscriber[handleSubscribeSymbol])

    expect(subscriber.snapshot).toBe(0)

    // update the parent signal
    signal.value = 1

    expect(subscriber.snapshot).toBe(1)
  })

  it('subscriber notifies parent of value change, and parent updates', () => {
    const signal = new Signal(0, () => {})
    const subscriber = new Signal(signal.snapshot, () => {}, signal[onValueUpdateFromSubscriberSymbol])

    signal.subscribe(subscriber[handleSubscribeSymbol])

    // update the subscriber
    subscriber.value = 1

    expect(signal.snapshot).toBe(1)
  })
})
