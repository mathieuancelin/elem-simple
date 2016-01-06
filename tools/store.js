/* eslint react/no-multi-comp: 0, react/prop-types: 0  */

import * as React from '../src/index';
import { invariant, isObject } from '../src/utils';

const emptyObject = () => ({});

export function Store(initialState = emptyObject) {
  const listeners = [];
  let currentState = initialState;

  function dispatch() {
    listeners.forEach(listener => listener());
  }

  function subscribe(listener) {
    listeners.push(listener);
    return () => {
      const index = listeners.indexOf(listener);
      listeners.splice(index, 1);
    };
  }

  function getState() {
    return { ...currentState };
  }

  function setState(diff) {
    currentState = { ...currentState, ...diff };
    dispatch();
  }

  function replaceState(ns) {
    currentState = ns;
    dispatch();
  }

  return {
    subscribe,
    dispatch,
    getState,
    setState,
    replaceState,
    get state() {
      return currentState;
    },
  };
}

export class StoreProvider extends React.Component {
  constructor(props) {
    invariant(props.store && isObject(props.store), 'You must provide a valid store as StoreProvider props');
    super(props);
    props.treeContext.__providedStore = props.store;
  }
}

export function enhanceWithStore(mapper) {
  return (Component) => {
    return (props) => {
      const store = props.treeContext.__providedStore;
      const ctx = {};
      ctx.subscription = store.subscribe(() => {
        ctx.subscription();
        props.myself.redraw();
      });
      if (mapper) {
        return (
          <Component { ...props } store={store} { ...mapper(store) } />
        );
      } else {
        return (
          <Component { ...props } store={store} />
        );
      }
    };
  };
}