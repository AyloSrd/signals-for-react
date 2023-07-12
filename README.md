# 📡 Signals for React (SFR)

Signals for React (SFR) is a library that aims to provide signal primitives for React applications without relying on React internals. SFR signals combine the functionalities of both refs and state. 

They store a value that can be accessed and modified by accessing the `value` property of the signal. Additionally, signal can trigger a re-render if the component is subscribed to updates through the `sub` method of the signal.

Each signal can be bound to the component (and children) through the useSatellite hook; finally, signals come with several utilities, such useSignalEffect or useDerived (respectively the signal version of useEffect and useMemo).

## Installation

You can install Signals for React (SFR) using npm:
```sh
# Using npm
npm install signals-for-react
```
or using Yarn:
```sh
# Using Yarn
yarn add signals-for-react
```

## useSignal

`useSignal` is the main hook of SFR; it combines the `useState` and `useRef` to provide a reactive piece of state. Similar to `useRef`, it returns an object that stores the value, rather than a getter and a setter.

```tsx
const Doubler: React.FC = () => {
  const count = useSignal(0)
 ...
}
```

To access the value of the signal, you can use the `.value` property. This is similar to using `.current` with React's refs and does not trigger any UI updates. It is recommended to use the `.value` property in callbacks and event handlers, as it always reflects the most up-to-date value and avoids unnecessary re-renders.

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

To update the value of a signal, you can simply reassign the value using the `.value` property. This will update the value of the signal and trigger UI updates if the `.sub()` method is called on the same signal somewhere in the component or down the tree. It will also trigger updates for any other signals that depend on it, including satellite and derived readonly signals.
```tsx
<button onClick={() => count.value *= 2}>Double</button>
```
Subscribing to a signal will cause the component using `useSignal` to re-render, even if the update or subscription is done down the tree. However, you can bind the signal to the children using `useSatellite` to prevent unnecessary re-renders, as we will see in the next chapters.

## useSatellite
A common consequence of lifting the state up in React is that updating the state down the component tree will trigger a re-render of the higher-level parent component that holds the state, even if some of the intermediate components do not directly use or rely on that state. This is because any updates to the shared state will propagate upwards in the component tree and trigger re-renders in all the components that are part of that branch, regardless of whether they actually use the state or not.

# DTS React User Guide

Congrats! You just saved yourself hours of work by bootstrapping this project with DTS. Let’s get you oriented with what’s here and how to use it.

> This DTS setup is meant for developing React component libraries (not apps!) that can be published to NPM. If you’re looking to build a React-based app, you should use `create-react-app`, `razzle`, `nextjs`, `gatsby`, or `react-static`.

> If you’re new to TypeScript and React, checkout [this handy cheatsheet](https://github.com/sw-yx/react-typescript-cheatsheet/)

## Commands

DTS scaffolds your new library inside `/src`, and also sets up a [Vite-based](https://vitejs.dev) playground for it inside `/example`.

The recommended workflow is to run DTS in one terminal:

```bash
npm start # or yarn start
```

This builds to `/dist` and runs the project in watch mode so any edits you save inside `src` causes a rebuild to `/dist`.

Then run the example inside another:

```bash
cd example
npm i # or yarn to install dependencies
npm start # or yarn start
```

The default example imports and live reloads whatever is in `/dist`, so if you are seeing an out of date component, make sure DTS is running in watch mode like we recommend above.

To do a one-off build, use `npm run build` or `yarn build`.

To run tests, use `npm test` or `yarn test`.

## Configuration

Code quality is set up for you with `prettier`, `husky`, and `lint-staged`. Adjust the respective fields in `package.json` accordingly.

### Jest

Jest tests are set up to run with `npm test` or `yarn test`.

### Bundle analysis

Calculates the real cost of your library using [size-limit](https://github.com/ai/size-limit) with `npm run size` and visulize it with `npm run analyze`.

#### Setup Files

This is the folder structure we set up for you:

```txt
/example
  index.html
  index.tsx       # test your component here in a demo app
  package.json
  tsconfig.json
/src
  index.tsx       # EDIT THIS
/test
  index.test.tsx  # EDIT THIS
.gitignore
package.json
README.md         # EDIT THIS
tsconfig.json
```

#### React Testing Library

We do not set up `react-testing-library` for you yet, we welcome contributions and documentation on this.

### Rollup

DTS uses [Rollup](https://rollupjs.org) as a bundler and generates multiple rollup configs for various module formats and build settings. See [Optimizations](#optimizations) for details.

### TypeScript

`tsconfig.json` is set up to interpret `dom` and `esnext` types, as well as `react` for `jsx`. Adjust according to your needs.

## Continuous Integration

### GitHub Actions

Two actions are added by default:

- `main` which installs deps w/ cache, lints, tests, and builds on all pushes against a Node and OS matrix
- `size` which comments cost comparison of your library on every pull request using [`size-limit`](https://github.com/ai/size-limit)

## Optimizations

Please see the main `dts` [optimizations docs](https://github.com/weiran-zsd/dts-cli#optimizations). In particular, know that you can take advantage of development-only optimizations:

```js
// ./types/index.d.ts
declare var __DEV__: boolean;

// inside your code...
if (__DEV__) {
  console.log('foo');
}
```

You can also choose to install and use [invariant](https://github.com/weiran-zsd/dts-cli#invariant) and [warning](https://github.com/weiran-zsd/dts-cli#warning) functions.

## Module Formats

CJS, ESModules, and UMD module formats are supported.

The appropriate paths are configured in `package.json` and `dist/index.js` accordingly. Please report if any issues are found.

## Deploying the Example Playground

The Playground is just a simple [Vite](https://vitejs.dev) app, you can deploy it anywhere you would normally deploy that. Here are some guidelines for **manually** deploying with the Netlify CLI (`npm i -g netlify-cli`):

```bash
cd example # if not already in the example folder
npm run build # builds to dist
netlify deploy # deploy the dist folder
```

Alternatively, if you already have a git repo connected, you can set up continuous deployment with Netlify:

```bash
netlify init
# build command: yarn build && cd example && yarn && yarn build
# directory to deploy: example/dist
# pick yes for netlify.toml
```

## Named Exports

Per Palmer Group guidelines, [always use named exports.](https://github.com/palmerhq/typescript#exports) Code split inside your React app instead of your React library.

## Including Styles

There are many ways to ship styles, including with CSS-in-JS. DTS has no opinion on this, configure how you like.

For vanilla CSS, you can include it at the root directory and add it to the `files` section in your `package.json`, so that it can be imported separately by your users and run through their bundler's loader.

## Publishing to NPM

We recommend using [np](https://github.com/sindresorhus/np).

## Usage with Lerna

When creating a new package with DTS within a project set up with Lerna, you might encounter a `Cannot resolve dependency` error when trying to run the `example` project. To fix that you will need to make changes to the `package.json` file _inside the `example` directory_.

The problem is that due to the nature of how dependencies are installed in Lerna projects, the aliases in the example project's `package.json` might not point to the right place, as those dependencies might have been installed in the root of your Lerna project.

Change the `alias` to point to where those packages are actually installed. This depends on the directory structure of your Lerna project, so the actual path might be different from the diff below.

```diff
   "alias": {
-    "react": "../node_modules/react",
-    "react-dom": "../node_modules/react-dom"
+    "react": "../../../node_modules/react",
+    "react-dom": "../../../node_modules/react-dom"
   },
```

An alternative to fixing this problem would be to remove aliases altogether and define the dependencies referenced as aliases as dev dependencies instead. [However, that might cause other problems.](https://github.com/formium/tsdx/issues/64)
