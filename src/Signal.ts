import { MessageFunction } from './types';

export const onValueUpdateFromSubscriberSymbol = Symbol(
  'onValueUpdateFromSubscriber'
);
export const handleSubscribeSymbol = Symbol('handleSubscribe');
export const subscribeSymbol = Symbol('subscribe');
export const unsubscribeFromSelfSymbol = Symbol('unsubscribeFromSelf');

let id = 0;

export class Signal<T> {
  static getUID = () => id++;

  constructor(
    initialValue: T,
    selfSubscription: () => void,
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

    this[subscribeSymbol] = cb => {
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
  #selfSubscription: () => void;
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
  }

  #setValue = (nextValue: T, messageId: number, isFromParent?: boolean) => {
    if(nextValue === this.#value) return;
  
    this.#value = nextValue;

    if (!isFromParent) this.#notifyParent?.(nextValue, messageId);
    if (this.#subscribers.size > 0) this.#publish();
    if (this.#isSubscribedToSelf) {
      this[unsubscribeFromSelfSymbol]();
      this.#selfSubscription();
    }
  };

  public [onValueUpdateFromSubscriberSymbol]: MessageFunction<T>;
  public [handleSubscribeSymbol]: MessageFunction<T>;
  public [subscribeSymbol]: (cb: MessageFunction<T>) => (() => void);
  public [unsubscribeFromSelfSymbol]: () => void;

  public get peep() {
    return this.#value;
  }

  public get value() {
    this.#isSubscribedToSelf = true;
    return this.#value;
  }

  public set = (nextValue: T | ((prevValue: T) => T)) => {
    const _nextValue =
      nextValue instanceof Function ? nextValue(this.#value) : nextValue;
    const nextMessageId = Signal.getUID();
    this.#currentMessageId = nextMessageId;
    this.#setValue(_nextValue, nextMessageId);
  }
}

export const createSignal = <T>(
  initialValue: T,
  selfSubscription: () => void,
  notifyParent?: MessageFunction<T>
): Signal<T> => new Signal(initialValue, selfSubscription, notifyParent);
