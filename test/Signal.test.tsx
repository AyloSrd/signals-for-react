import {
  createSignal,
  onValueUpdateFromSubscriberSymbol,
  handleSubscribeSymbol,
  subscribeSymbol,
  unsubscribeFromSelfSymbol,
} from '../src/Signal';

describe('Signal, local', () => {
  test('returns the value when accessed through signal.get() and signal.current', () => {
    const signal = createSignal(0, () => {});
    expect(signal.get()).toBe(0);
    expect(signal.current).toBe(0);
  });

  test('updates the value when the setter is called', () => {
    const signal = createSignal(0, () => {});
    signal.set(prevValue => prevValue + 1);
    expect(signal.get()).toBe(1);
    expect(signal.current).toBe(1);
  });

  test('setter can take a non-function value', () => {
    const signal = createSignal(0, () => {});
    signal.set(1);
    expect(signal.get()).toBe(1);
    expect(signal.current).toBe(1);
  });

  test('setter passes previous value if its argument is a function', () => {
    const signal = createSignal(5, () => {});
    signal.set(prevValue => prevValue * 2);
    expect(signal.get()).toBe(10);
    expect(signal.current).toBe(10);
  });

  test('calls the onGetValue callback when value was accessed before', () => {
    let hasCalledCb = false;

    function handleGetValue() {
      hasCalledCb = true;
    }
    const signal = createSignal(0, handleGetValue);
    // here we access the value getter
    expect(signal.get()).toBe(0);
    // here we set a new value
    signal.set(prevValue => prevValue + 1);

    expect(signal.current).toBe(1);
    expect(hasCalledCb).toBe(true);
  });

  test('does not trigger the onGetValue callback when Signal.clearValueRequests is called in between get and set', () => {
    let hasCalledCb = false;

    function handleGetValue() {
      hasCalledCb = true;
    }
    const signal = createSignal(0, handleGetValue);

    expect(signal.get()).toBe(0);

    signal[unsubscribeFromSelfSymbol]();
    signal.set(prevValue => prevValue + 1);

    expect(signal.current).toBe(1);
    expect(hasCalledCb).toBe(false);
  });

  test('does not trigger the onGetValue callback when set to the same value', () => {
    let hasCalledCb = false;

    function handleGetValue() {
      hasCalledCb = true;
    }
    const signal = createSignal(0, handleGetValue);

    expect(signal.get()).toBe(0);
 
    signal.set(0);

    expect(signal.current).toBe(0);
    expect(hasCalledCb).toBe(false);
  });
});

describe('Signal, remote subscriptions', () => {
  test('update the value in subscriber', () => {
    const signal = createSignal(0, () => {});
    const subscriber = createSignal(signal.current, () => {});

    signal[subscribeSymbol](subscriber[handleSubscribeSymbol]);

    expect(subscriber.current).toBe(0);

    // update the parent signal
    signal.set(prevValue => prevValue + 1);

    expect(subscriber.current).toBe(1);
  });

  test('subscriber notifies parent of value change, and parent updates', () => {
    const signal = createSignal(0, () => {});
    const subscriber = createSignal(
      signal.current,
      () => {},
      signal[onValueUpdateFromSubscriberSymbol]
    );

    signal[subscribeSymbol](subscriber[handleSubscribeSymbol]);

    // update the subscriber
    subscriber.set(prevValue => prevValue + 1);

    expect(signal.current).toBe(1);
  });
});
