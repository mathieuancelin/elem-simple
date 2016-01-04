/* eslint react/no-multi-comp: 0, react/prop-types: 0, react/jsx-boolean-value: 0 */

import * as React from '../src/index';
import { expect } from 'chai';
import { describe, it } from 'mocha';

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

class ComponentWithState extends React.Component {
  constructor(props) {
    super(props);
    const copy = { ...this.props };
    const key = copy.key;
    const name = this.displayName || this.constructor.name;
    this.getInitialState = this.getInitialState || (() => ({}));
    if (redrawing && !key) {
      if (!stateCache.arrayed[name]) {
        stateCache.arrayed[name] = [];
      }
      this.state = stateCache.arrayed[name].pop() || this.getInitialState();
    } else if (redrawing && key) {
      this.state = stateCache.keyed[`${name}-${key}`] || this.getInitialState();
    } else {
      this.state = copy.$$state || this.getInitialState();
    }
    delete copy.$$state;
    ephemeralSubscribe(() => {
      if (key) {
        stateCache.keyed[`${name}-${key}`] = this.state;
      } else {
        if (!stateCache.arrayed[name]) {
          stateCache.arrayed[name] = [];
        }
        stateCache.arrayed[name].push(this.state);
      }
    });
    this.props = copy;
    this.replaceState = (ns) => {
      this.state = ns;
      redrawing = true;
      dispatch();
      props.myself.redraw({ ...copy, $$state: ns });
      redrawing = false;
      stateCache.keyed = {};
      stateCache.arrayed = {};
    };
    this.setState = (ns) => this.replaceState({ ...this.state, ...ns });
  }
}

class Clicker extends ComponentWithState {
  constructor(props) {
    super(props);
  }
  getInitialState() {
    return {
      counter: 1,
    };
  }
  render() {
    return (
      <h1 id="h1" onClick={() => this.setState({ counter: this.state.counter + 1 })}>
        You have clicked {this.state.counter} times
      </h1>
    );
  }
}

describe('elem-simple : state test', () => {
  it('should be able to provide simple positional states', () => {
    const app = React.render(<Clicker/>, document.getElementById('app'));
    let h1 = document.getElementById('h1');
    expect(h1.innerHTML).to.be.equal('You have clicked 1 times');
    h1.click();
    h1 = document.getElementById('h1');
    expect(h1.innerHTML).to.be.equal('You have clicked 2 times');
    h1.click();
    h1 = document.getElementById('h1');
    expect(h1.innerHTML).to.be.equal('You have clicked 3 times');
    app.cleanup();
  });
});
