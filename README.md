# 📡 Signals for React (SFR)

Signals for React (SFR) is a library aiming to provide signal primitives for React applications.

The scope of signals is to limit unnecessary re-rendering as much as possible while keeping updated values accessible throughout your React app. This is achieved without relying on React internals.

Each signal can be bound to the component (and children) by creating satellites of said signal; finally, signals come with several utilities, such useSignalEffect or useDerived (respectively the signal version of useEffect and useMemo).

## Installation

We can install Signals for React (SFR) using npm:
```sh
# Using npm
npm install signals-for-react
```
or using Yarn:
```sh
# Using Yarn
yarn add signals-for-react
```

## Signals, the basics
A signal is a React primitive that stores a value, and can be subscribed.
It consists in an object with a `.value` property and `sub()` method.

The main concept to retain when it comes to SFR signals, is that they have to be bound to a component.

The `.value` property is a getter and setter at the same time. It allows to retireve an up to date value, and to re-assign it. Accessing the getter doesn't subscribe the component to the signal, so won't trigger any re-render.

In order to subscribe to it, we need to call the .`sub()` method. This will result in the component bound to said signal to re-render.


### useSignal

`useSignal` is the main hook of SFR; it combines the `useState` and `useRef` to provide a reactive piece of state. Similar to `useRef`, it returns an object that stores the value, rather than a getter and a setter.

```tsx
const Doubler: React.FC = () => {
  const count = useSignal(0)
 ...
}
```

To access the value of the signal, we can use the `.value` property. This is similar to using `.current` with React's refs and does not trigger any UI updates. It is recommended to use the `.value` property in callbacks and event handlers, as it always reflects the most up-to-date value and avoids unnecessary re-renders.

```tsx
function handleSubmit() {
  onSubmit({
    name: name.value,
    age: age.value
  })
}
```

In order to make the signal reactive, the component needs to call the `.sub()` method. This method subscribes the component to any updates to the signal and also returns the current value of the signal.

```tsx
<p>{`The count is ${count.sub()}`}</p>
```

To update the value of a signal, we can simply reassign the value using the `.value` property. This will update the value of the signal and trigger UI updates if the `.sub()` method is called on the same signal somewhere in the component or down the tree. It will also trigger updates for any other signals that depend on it, including satellites and derived readonly signals (we'll see what they are in the paragraphs below).
```tsx
<button onClick={() => count.value *= 2}>Double</button>
```
Subscribing to a signal will cause the component using `useSignal` to re-render, even if the update or subscription is done down the tree. However, we can bind the signal subscription to the children using satellites, to prevent unnecessary re-renders, as we will see in the next chapters.

[try in react playground](https://reactplayground.vercel.app/#N4IglgdgJgpgHgOgFYGcQC5wFsAOB7AJwBcACAQRxxIDMC8sSByBAegp2RTkYB0IxchUgCUYAQwDGpWvSYFxU3v0HESwEhPliiMYXjykAvjToNGWqQFoo9FhIA2YGBCJK+EvBBSkPLsZBgCEgBeEhsJAFcsZyIEAHMYIgBRexholwAhAE8ASSgACnN9VwBKd09vEjoDEI0tHT0DfN8ifwhAsohq2PloQPy+EhJRSVjNcR0UtJiBiCGhkakEAGUiAjApAFk8WAAaQfmICPt7fbn5xbH6mCn0onz2TqHOkpBdkHZOOAxsfFVL3ZqEgRFAwVbaGAkYwyMwWVx8AR-UjeLKpKAmWSMFFoyweQTtFwoJSIoRAkFgsBxCBiexQjFmFCU6n2FCWaiESxwtwQXyVdi1fIlEIAPjUB15PjwERctXJyyZNPyAAZOgd5EQIgQ5rN5iQADwZCJEIieEieADCjgkAGtgsBBSKNFKXAgAG40iKQgDUoQAjIZhQddXqUDgxHM6KlgjxsHEYyQxOsxJZ7GIAEYwezRkBwyxpPBIMAx4WAbLJAPB-epYofDouAHmlsRQETTgsMQf1LENxs8gfOnTbEHKXlIXZNc1C2JgUAQaaNY4ABgd2S5LIyAF4wdAkABM8iwAG4+IvB+04EiwjBqGJjqR2CBDEA)

## Satellites
When it comes to updating the UI, each signal is bound to the component that created it using `useSignal`. If a child component, to whom the signal is passed down as a prop, calls `.sub()`, it triggers a re-render cascade from the parent to the child (and the whole component tree).

However, this approach undermines SFR's goal of minimizing re-renders. It essentially leads to the same number of re-renders that would occur if we were using `useState` to lift the state up, without any significant added value.

Enter **satellites**. A **satellite** is a signal that has a two-way subscription to another signal: when the parent signal updates, the satellite updates as well, and when the satellites updates, so does the parent signal. Moreover, a satellite can be bound to a different component than its parent. This allows children components to subscribe to signals passed as props without triggering the re-renders of an unsubscribed parent and the related component tree.

However, conceptully, we don't have to see the relation between a signal and the satellites as a hierarchical pyramidal structure, but rather like a chainmail. Each satellite, including the original signal, is synchronously influenced by the changes in any other satellite in the chain. Therefore, we must consider this entire chain as an only signal when updating its value. The distinction between satellite layers is meaningful primarily for UI updates and component re-renders.

Finally, as we will see shortly, multiple satellites together form an **orbit**.
### useSatellite
The easiest way to create a satelite is by using the `useSatellite` hook. This hook simply takes a signal (original or satellite, or, as we'll see later, a standalone one) as only parameter, and returns a satellite signal. 
```tsx
const Display: React.FC<{ countSignal: Signal<number>}> = ({ countSatellite }) =>  {
  const count = useSatellite(countSignal)

  return <p>{`The count is ${count.sub()}`}</p>
}

function Counter() {
  const count = useSignal(0)

  return (<main>
    <Display countSignal={count} />
    <Increase onIncrease={() => count.value += 1} /> // calling this will cause only <Display> to re-render
    <Decrease onDecrease={() => count.value -= 1} /> // same here
  </main>)
}
```
[try in react playground](https://reactplayground.vercel.app/#N4IglgdgJgpgHgOgFYGcQC5wFsAOB7AJwBcACAQRxxIDMC8sSByBAegp2RTkYB0IxchUgCUYAQwDGpWvSYFxU3v0HESwEhPliiMYXjykAvjToNGWqQFoo9FhIA2YGBCJK+EvBBSkPLsZBgCEgBeEhsJAFcsZyIEAHMYIgBRexholwAhAE8ASSgACnN9VwBKd09vEjoDEI0tHT0DfN8ifwhAsohq2PloQPy+EhJRSVjNcR0UtJiBiCGhkakEAGUiAjApAFk8WAAaQfmICPt7fbn5xbH6mCn0onz2TqHOkpBdkHZOOAxsfFVL3ZqEgRFAwVbaGAkYwyMwWVx8AR-UjqEFgsBxCBiexQkyyRgodGY+woSzUQiWOFKRFCIEZCJEIieHEwpisOkMzxUlTIkgAETAKBw9jEWWZplZLH5guFWTcEHKXlI7Fq+RKIQAfGoDr5Kh4Ii5aqjloSsfkAAxPDQVPCpBD2PBxQryCnOWDrCBxciURidA7yIgRAhzfIAHnVByGIalQpFVv1RGCwD1LmMLHD50j7MZc08AGFHBIANaJ1UauMuBAANyxEUhAGpQgBGQzp+bzHIQcZiUERkghlhZzyt+Yhwc5iD5jbF4Cl4Ka5Oxav2WskSxNlu9oa8mBdnsZvsD+nZ4eZo9MvMF6ez+fW232x0Lqs1mAlDf7oYANWfvf7Y+H-fVTpDD4Ph4CRMIYGoMRjiVSg3hAMcvh+al-gUaRxXMNC5TAmlqH1KQwCZMd8nUCQAAswHsKBekBC8p0MNVgG1W8YDtB0nRgF0+ndT0xx9P1EkDOYQwAIzPcdJyLRM6KLFskwoqjekMfsxI5CB00MeDoxlJDMBQkQ0NxWEsIRbkgSNCETjAHQxTxAkMSxEkyQIF1RmwuBwLwzsiEIuZtJFfIcDoHAUEY5jFXLUhQgsnQrJ0QLgpQBAF0tHUbVY+8OK4t1IE9fzZUtf0hL7MiACZ1STPB4wQFAIhE1VlJYMqNJAQwgA)

We can pass either an original signal or a satellite to `useSatellite`. 
When using `useSatellite` on the same signal in multiple layers of the component tree, we can pass either the original signal or the satellite down as prop. As mentioned before, the updates travel synchronously through the chain.
```tsx
const Parent: React.FC<{ countSignal: Signal<number>}> = ({ countSatellite }) =>  {
  const count = useSatellite(countSignal)

  // more code here
  return(<>
    <Child countSignal={count}> // this works
    <Child countSignal={countSignal}> // this is the same
  </>)
}
```
#### Caveat 1 : nullable signals
When we need to work with nullable values, we should make sure that the the prop passing the signal is not `null` or `undefined`; in fact, `useSatellite` bounds the signal the first time the hook is called; it doesn't keep track of it remaining or not in the props; threfore, when we need to deal with nullable values, the `signal.value` should be nullabble, not the signal itself.
```tsx
  // this is not good
  interface Props {
    signal?: Signal<string>
  }

  // this is what we want to use
  interface Props {
    signal: <null | string>
  }
```

#### Caveat 2 : React.memo and useSatellite
When we pass a signal to a component that is memoized with `React.memo`, and we want that component to re-render when its parent component re-renders, we need to bind the signal with the `useSatellite` hook.

The signal itself is a stable reference, which doesn't change between re-renders. Even if the memoized component calls `signal.sub()` to subscribe to updates from the signal, it won't trigger a re-render. However, if we pass directly the value of the signal, by calling `signal.sub()` in the prop, we'll be passing a different value each time the signal updatesn and this will cause the memoized component to re-render.
This exemple explains it better:
```tsx
const count = useSignal(0)

<MemoizedComponent count={count}> // it won't re-render when signal updates, unless it uses useSatellite
<MemoizedComponenet count={count.sub()}> // it will re-render even if memoized
```
### useOrbit
An `orbit` is an object which includes one or more signals, bound to the current component; `useOrbit` is a hook that takes an object (usually the component's props) and returns it,  with the signals replaced by their corresponding satellite signals bound to the current component. 

This hook is useful when we have multiple signals being passed down to a component and we want to bind them all to the component without cluttering it with multiple instances of the `useSatellite` and without having to deal with naming conventions.

```tsx 
interface ChildProps {
  count: Signal<number>,
  name: Signal<string>,
  notASignal: string,
}
function Child(props: ChildProps) {
  const {
    count, 
    name,
    notASignal
  } = useOrbit(props)

  return <>
    <p>{count.sub()}</p>
    <p>{name.sub()}</p>
    <p>{notASignal}</p>
  <>
} 
```
[try in react playground](https://reactplayground.vercel.app/#N4IglgdgJgpgHgOgFYGcQC5wFsAOB7AJwBcACAQRxxIDMC8sSByBAegp2RTkYB0IxchUgCUYAQwDGpWvSYFxU3v0HESwEhPliiMYXjykAvjToNGWqQFoo9FhIA2YGBCJK+EvBBSkPLsZBgCEgBeEhsJAFcsZyIEAHMYIgBRexholwAhAE8ASSgACnN9VwBKd09vEjoDEI0tHT0DfN8ifwhAsohq2PloQPy+EhJRSVjNcR0UtJiBiCGhkakEAGUiAjApAFk8WAAaQfmICPt7fbn5xbH6mCn0onz2TqHOkpBdkHZOOAxsfFVL3ZqEgRFAwVbaGAkYwyMwWVx8AR-UjqEFgsBxCBiexQkyyRgodGY+woSzUQiWOFKRFCIEZCJEIieHEwpisOkMzxUlTIkgAETAKBw9jEWWZplZLH5guFWTcEHKXlI7Fq+RKIQAfGoDr5KmIErVUctCVj8gAGJ4aCqkTHRA2go0Yk2MRgWnV4VIIex4OKFeQU5ywdYQOLkSguvgHeRECIEOb5AA86oOQ3jUqFIpIepgwWAWeMNuzwALxiIYCIqWCPBAOS8gVIUG0YirLCT5xTACMgi3kyR41AwAA3Vvzebx4XtmD2Ycj+YAOTE0XQPZH8cgOHpJCIWRw2arOjgRCrJE8AGEABZiYOFyHBTUFhADrERG8kGAIVoEBKxR-2Z-GbttqOLDjpO04rp2JAATOvYQVBM5jmIE5Tsu8xkAkS6ASua4bluO6ViARxYBOBBHqeF5XjmN6almD5Pi+b4fl+tG-jA-5gUBIHIZhMFdux8YsP2Q4HPx6qdIYEbtHASJhDA1BiMcSqUG8IDsoyEBfD81L-Ao0jiuYOlyvA0nUBEEBSGATKqZ4+TqBIZ5gPYUC9ICp6OBIADWhhqsA2oVO6b5ej6+n+n0QYhlZEDhucUYxnM8btvSanHhAJ5ue5OauRsnnqsAdkOU5ziGPxCUchAraGMpaYyhpmBaSIOm4rCBkItyQKogA8gQ7ZlmKeIEo6xKkuSlISUZNImWZpZMlVIr5DgdA4Cg3m+YqQJZoCBaAqW5aQsYoQdV1ZZzQtS0rSg-met6vowCFgaQCGM2yhaMWxiQCaCXxZ4AEw5dtqRFSw318Z2cEpmeADM6rzouaj3igETtqqAMQ59kNoTA6BqDR8OIyUyOQ8JAmDqJfAVYYQA)
#### Caveat 1 : nullable signals
Like with `useSatellite`, when we need to work with nullable values, we should make sure that the the prop passing the signal is not `null` or `undefined`; in fact, `useOrbit` bounds the signal the first time the hook is called; it doesn't keep track of it remaining or not in the props; threfore, when we need to deal with nullable values, the `signal.value` should be nullable, not the signal itself. However, the other non-signal values are not tracked, therefore can be nullable;
```tsx
  // this is not good
  interface Props {
    count?: Signal<number>
    name?: Signal<string>
    nonSignalProp?: string
  }

  // this is what we want to use
  interface Props {
    count: Signal<null | number>
    name: Signal<null | string>
    nonSignalProp?: string // this can be nullable, as it is not a signal
  }
```
### orbit HOC
An alternative to the `useOrbit` hook, is the `orbit` HOC, which, just like the hook, binds any signal in the props tho the current component.

```tsx 
interface ChildProps {
  count: Signal<number>,
  name: Signal<string>,
  notASignal: string,
}
const Child: React.FC<ChildProps> = orbit(({
  count, 
  name,
  notASignal
}) => (<>
    <p>{count.value}</p>
    <p>{name.value}</p>
    <p>{notASignal}</p>

</>))
```
[try in react playground](https://reactplayground.vercel.app/#N4IglgdgJgpgHgOgFYGcQC5wFsAOB7AJwBcACAQRxxIDMC8sSByBAegp2RTkYB0IxchUgCUYAQwDGpWvSYFxU3v0HESwEhPliiMYXjykAvjToNGWqQFoo9FhIA2YGBCJK+EvBBSkPLsZBgCEgBeEhsJAFcsZyIEAHMYIgBRexholwAhAE8ASSgACnN9VwBKd09vEjoDEI0tHT0DfN8ifwhAsohq2PloQPy+EhJRSVjNcR0UtJiBiCGhkakEAGUiAjApAFk8WAAaQfmICPt7fbn5xbH6mCn0onz2TqHOkpBdkHZOOAxsfFVL3ZqEgRFAwVbaGAkYwyMwWVx8AR-UjqEFgsBxCBiexQkyyRgodGY+woSzUQiWOFKRFCIEZCJEIieHEwpisOkMzxUlTIkgAETAKBw9jEWWZplZLH5guFWTcEHKXlI7Fq+RKIQAfGoDr5KmIErVUctCVj8gAGJ4aCqkTHRA2go0Yk2MRgWnV4VIIex4OKFeQU5ywdYQOLkSguvgHeRECIEOb5AA86oOQ3jUqFIpIepgwWAWeMNuzwALxiIYCIqWCPBAOS8gVIUG0YirLCT5xTACMgi3kyR41AwAA3Vvzebx4XtmD2Ycj+YAOTE0XQPZH8cgOHpJCIWRw2arOjgRCrJE8AGEABZiYOFyHBTUFhADrERG8kGAIVoEBKxR-2Z-GbttqOLDjpO04rp2JAATOvYQVBM5jmIE5Tsu8xkAkS6ASua4bluO6ViARxYBOBBHqeF5XjmN6almD5Pi+b4fl+tG-jA-5gUBIHIZhMFdux8YsP2Q4HPx6qdIYEbtHASJhDA1BiMcSqUG8IDsoyEBfD81L-Ao0jiuYOlyvA0nUBEEBSGATKqZ4+TqBIZ5gPYUC9ICp6OBIADWhhqsA2oVO6b5ej6+n+n0QYhlZEDhucUYxnM8btvSanHhAJ5ue5OauRsnnqsAdkOU5ziGPxCUchAraGMpaYyhpmBaSIOm4rCBkItyQKEO2ZZiniBKOsSpLkpSElGTSOqkFVGahO1Zb5DZmYJICBaAqW5aQl5GpavK5xuh6gW+jAIWBpAIbjbKFoxbGJAJoJfFngATDly2pEVLB3XxnZwSmZ4AMzqvOi5qPeKARO2qrPd9N0-WhMDoGoNFAyDJRgz9wkCYOol8F5ICGEAA)

This HOC uses internally `useOrbit`, so it follows all the rules and caveats.
## Monitoring Signals' Effects
SFR provides two hooks that serve similar purposes to React's `useEffect` and `useMemo`.

These hooks allow us to manage side effects and memoize derived values within the Signals framework, similar to how we would use React's `useEffect` and `useMemo`hooks in a React application.

### useSignalEffect
Just like React's `useEffect`, `useSignalEffect` takes a callback function and a dependencies' array consituted of only signals to observe; the callback will be executed whenever any of the signals updates; differently from the React hook, it passes the previous values to the callback (like `componentDidUpdate`); also, it doesn't take any clean up function;
```tsx
function Form() {
  const age = useSignal<number>(0)
  const name = useSignal<string>('')

  useSignalEffect((prevAge, prevName) => {
    if (prevAge !== age.value) API.doSomethig(age)
    if (prevName !== name.value) API.doSomethigElse(name)

    API.doAlso(agen number)
  }, [age, name])

  return (
    <form>
      {/* ...our code her */}
    </form>
  )
}
```
When we need to access the current value of a signal inside a hook, it is generally recommended to call `signal.value` by default. This approach helps prevent any unnecessary re-renders of your component.

In fact, if we call `signal.sub()` inside the hook, it will subscribe to the signal, which means that your component will be re-rendered whenever the value of the signal changes.
### useDerived
`useDerived` is the signal's equivalent of `useMemo`.
It takes a callback function and an array of signals dependencies as parameters; whenever any of the signals updates, it'll run the function and store its return value in a readonly signal;

The readonly signals works exaclty as a normal signal or satellite, except we cannot assign any value to it; using `signal.value` as a setter will, in fact, throw an error;

```tsx
function ValidatedForm() {
  const age = useSignal<number>(0)
  const name = useSignal<string>('')

  const errors = useDerived(() => validatorFn(age, name), [age, name])

  errors.value = [] // this will throw error

  return (
    <form>
      {/* ...our code here */}
    </form>
  )
}
```
## Signals for App-level state management
While signals can be used as a replacement of `useState` to handle state at component level, they can also serve as a powerful tool for state management across your React application. With the introduction of the `createSignal` function, we can create standalone signals that can be managed independently of components, allowing for a more flexible approach to state management and shared across the component tree avoiding prop-drilling.

### createSignal
The `createSignal` lets us generate standalone signals that are not inherently bound to any specific component. This means we can use them for managing application-wide state or any scenario where we require dynamic values that do not strictly belong to a single component. By employing these independent signals, we not only gain a powerful tool for managing state within your application, but we also sidestep the need for prop drilling, ensuring that your state remains easily accessible without passing it down through multiple layers of components. 
We can also update the signal outside the component tree, and this will be propagated to any component bound to the signal.
The syntax for creating and updating a standalone signal is as follows:
```tsx
import { createSignal } from 'signals-for-react';

const isAuthenticated = createSignal(false);

async function login () {
  await authenticationFn()
  isAuthenticated.value = true
}

const LoginButton: FC = () => <button onClick={login}>Login</button>
```
### Binding independent signals to components
To integrate these independent signals into your components, we have several ways; the easiest is to use the `useSatellite` hook. This approach allows us to connect a satellite signal to a specific component, ensuring that updates to the signal are localized to the components that need them.

```tsx
function Header(): FC {
  const isAuthenticated = useSatellite(isAuthenticated);

  return <header>{isAuthenticated.sub() ? 'Welcome, User!' : 'Please Log In'}</header>;
}
```
Or we could derive a readonly signal, by using `useDerived`:
```tsx
const UserDetails = (): FC => {
  const userRole = useDerived(() => {
    if (isAuthenticatedSignal.value) return 'member';
    return 'guest';
  }, [isAuthenticatedSignal]);

  return <p>User role: {userRole.sub()}</p>;
}
```
Furthermore, we could group multiple independent signals in unique app state object, and bind it to a component with `useOrbit`:
```tsx
const name = createSignal('');
const email = createSignal('');
const age = createSignal(0);

// Group signals into an app-state object
const user = {
  name,
  email,
  age,
};

const UserProfile: FC = () => {
    const { name, email, age } = useOrbit(user);

    function handleNameChange(e:  ChangeEvent<HTMLInputElement>) {
      name.value = e.target.value
    }
    // display those info below ...
}
```
Finally, to respond to changes in these independent signals, we can utilize the `useSignalEffect`:
```tsx
const App: FC = () => {
  useSignalEffect(() => {
    // This effect runs whenever isAuthenticatedSignal changes
    if (isAuthenticatedSignal.value) {
      // Perform actions for authenticated users
    } else {
      // Handle logout or unauthorized actions
    }
  }, [isAuthenticatedSignal]);

  // ...
}
```
### Caveat: orbit HOC
While we can use `useOrbit`, as we can control the object pased as parameter, calling an independent signal in a component wrapped in `orbit` won't bind the former to the latter, as we cannot pass it in the props.

## Conclusion: Unleash the Power of Signals for Seamless React State Management

Congratulations! We've embarked on an exciting journey with Signals for React (SFR). Beyond just state management, SFR empowers us to optimize, modularize, and create lightning-fast interfaces.

Happy coding! 🚀🔊
