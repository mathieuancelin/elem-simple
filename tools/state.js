/* eslint no-console: 0 */

import * as Elem from '../src/index';

const listeners = [];
const stateCache = {
  keyed: {},
  arrayed: {},
};
let redrawing = false;

function dispatch() {
  listeners.forEach(l => l());
}

function ephemeralSubscribe(listener) {
  const ctx = {};
  function cleanup() {
    const index = listeners.indexOf(ctx.ephemeralListener);
    listeners.splice(index, 1);
  }
  ctx.ephemeralListener = () => {
    listener();
    cleanup();
  };
  listeners.push(ctx.ephemeralListener);
  return cleanup;
}

export default class ComponentWithState extends Elem.Component {
  constructor(props) {
    super(props);
    const copy = { ...this.props };
    const key = copy.key;
    const name = this.displayName || this.constructor.name;
    console.log(`[${name} : ${key}] constructor`);
    this.getInitialState = this.getInitialState || (() => ({}));
    if (redrawing && !key) {
      if (!stateCache.arrayed[name]) {
        stateCache.arrayed[name] = [];
      }
      console.log(`[${name} : ${key}] fetching state from the arraystore`);
      this.state = stateCache.arrayed[name].pop() || this.getInitialState();
    } else if (redrawing && key) {
      console.log(`[${name} : ${key}] fetching state from the keystore at ${name}-${key}`);
      this.state = stateCache.keyed[`${name}-${key}`] || this.getInitialState();
    } else {
      console.log(`[${name} : ${key}] fetching state props`);
      this.state = copy.$$state || this.getInitialState();
    }
    delete copy.$$state;
    console.log(`[${name} : ${key}] subscribe`);
    ephemeralSubscribe(() => {
      if (key) {
        console.log(`[${name} : ${key}] I'm saving myself in the keystore at ${name}-${key}`);
        stateCache.keyed[`${name}-${key}`] = this.state;
      } else {
        if (!stateCache.arrayed[name]) {
          stateCache.arrayed[name] = [];
        }
        console.log(`[${name} : ${key}] I'm saving myself in the arraystore`);
        stateCache.arrayed[name].push(this.state);
      }
    });
    this.props = copy;
    this.replaceState = (ns) => {
      console.log(`[${name} : ${key}] replacing state now`);
      this.state = ns;
      redrawing = true;
      console.log(`[${name} : ${key}] broadcast save state`);
      dispatch();
      console.log(`[${name} : ${key}] redraw the tree`);
      props.myself.redraw({ ...copy, $$state: ns });
      redrawing = false;
      stateCache.keyed = {};
      stateCache.arrayed = {};
      console.log(`[${name} : ${key}] finish replacing state`);
    };
    this.setState = (ns) => this.replaceState({ ...this.state, ...ns });
  }
}
