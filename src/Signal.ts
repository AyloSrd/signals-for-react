import { MessageFunction } from './types';

export const onValueUpdateFromSubscriberSymbol = Symbol(
  'onValueUpdateFromSubscriber'
);
export const handleSubscribeSymbol = Symbol('handleSubscribe');
export const subscribeSymbol = Symbol('subscribe');
export const unsubscribeFromSelfSymbol = Symbol('unsubscribeFromSelf');

let id = 0;

/**
 * Signals are used to manage reactive state and facilitate communication between components.
 *
 * @template T - The type of the Signal value.
 */
export class Signal<T> {
  static getUID = () => id++;

  /**
   * Constructs a new instance of the Signal class.
   *
   * @param {T} initialValue - The initial value of the Signal.
   * @param {() => void} selfSubscription - A function to be called when the Signal is subscribed to itself.
   * @param {MessageFunction<T>?} notifyParent - A callback function to notify the parent Signal of value updates.
   */
  constructor(
    initialValue: T,
    selfSubscription?: () => void,
    notifyParent?: MessageFunction<T>
  ) {
    this.#value = initialValue;
    this.#selfSubscription = selfSubscription;

    if (notifyParent) this.#notifyParent = notifyParent;

    this[onValueUpdateFromSubscriberSymbol] = (nextValue, messageId) => {
      if (messageId === this.#currentMessageId) return;
      this.#currentMessageId = messageId;
      this.#setValue(nextValue, messageId);
    };

    this[handleSubscribeSymbol] = (nextValue, messageId) => {
      if (messageId === this.#currentMessageId) return;

      this.#currentMessageId = messageId;
      this.#setValue(nextValue, messageId, true);
    };

    this[subscribeSymbol] = (cb) => {
      this.#subscribers.add(cb);
      return () => {
        this.#unsubscribe(cb);
      };
    };

    this[unsubscribeFromSelfSymbol] = () => {
      this.#isSubscribedToSelf = false;
    };
  }

  #value: T;
  #isSubscribedToSelf: boolean = false;
  #selfSubscription?: () => void;
  #notifyParent?: MessageFunction<T>;
  #subscribers: Set<MessageFunction<T>> = new Set([]);
  #currentMessageId: number = -1;

  #publish = () => {
    this.#subscribers.forEach((subscriberCb) => {
      subscriberCb(this.#value, this.#currentMessageId);
    });
  };

  #unsubscribe = (cb: MessageFunction<T>) => {
    this.#subscribers.delete(cb);
  };

  #setValue = (nextValue: T, messageId: number, isFromParent?: boolean) => {
    if (nextValue === this.#value) return;

    this.#value = nextValue;

    if (!isFromParent) this.#notifyParent?.(nextValue, messageId);
    if (this.#subscribers.size > 0) this.#publish();
    if (this.#isSubscribedToSelf) {
      this[unsubscribeFromSelfSymbol]();
      this.#selfSubscription?.();
    }
  };

  public [onValueUpdateFromSubscriberSymbol]: MessageFunction<T>;
  public [handleSubscribeSymbol]: MessageFunction<T>;
  public [subscribeSymbol]: (cb: MessageFunction<T>) => () => void;
  public [unsubscribeFromSelfSymbol]: () => void;

  /**
   * Gets the current value of the Signal, without subscribing the Signal to itself (no reactivity).
   *
   * @type {T}
   */
  public get value() {
    return this.#value;
  }

  /**
   * Sets the value of the Signal.
   * @param {T} nextValue - The new value or function to calculate the new value.
   */
  public set value(nextValue: T) {
    const nextMessageId = Signal.getUID();
    this.#currentMessageId = nextMessageId;
    this.#setValue(nextValue, nextMessageId);
  }

  /**
   * Gets the current value of the Signal and subscribes the Signal to itself.
   * This value is reactive, therefore is used when any change in the Signal's value should trigger a re-render.
   *
   * @type {T}
   */
  public sub() {
    this.#isSubscribedToSelf = true;
    return this.#value;
  }
}

export const createSignalInternal = <T>(
  initialValue: T,
  selfSubscription: () => void,
  notifyParent?: MessageFunction<T>
): Signal<T> => new Signal(initialValue, selfSubscription, notifyParent);

/**
 * Creates a signal with the given initial value.
 *
 * @param {T} initialValue - The initial value of the signal.
 * @return {Signal<T>} The newly created signal.
 */
export function createSignal<T>(initialValue: T): Signal<T> {
  return new Signal(initialValue);
}