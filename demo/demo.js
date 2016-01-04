/* eslint react/no-multi-comp: 0 react/prop-types: 0, no-console: 0 */

import { render, createElement, renderToString, Component } from '../src/index';

const React = { createElement, Component };

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

const Time = (props) => {
  return (
    <div>
      <span ref={(n) => console.log(n)}>Time {props.separator} {Date.now()}</span>
      <button type="button" onClick={() => props.myself.replaceWith(<Time separator={props.separator} />)}>update</button>
      <button type="button" onClick={() => props.myself.redraw()}>redraw</button>
      <button type="button" onClick={() => props.redraw()}>redraw</button>
    </div>
  );
};

const Dummy = (props) => {
  return (
    <div>
      <span>Yo {props.separator} bitch</span>
      <button type="button" onClick={() => props.myself.replaceWith(<Time separator=":" />)}>time</button>
    </div>
  );
};

const Wrapper = (props) => <div style={{ border: '1px solid black' }}>{props.children}</div>;

class Clicker extends ComponentWithState {
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

class Item extends ComponentWithState {
  getInitialState() {
    console.log('create item instance');
    return {
      value: 1,
    };
  }
  update(e) {
    e.preventDefault();
    this.setState({ value: this.state.value + 1 });
  }
  render() {
    console.log('render item');
    return <li>{this.props.item.id} => state {this.state.value} {Date.now()}<button type="button" onClick={this.update.bind(this)}>update</button></li>;
  }
}

class TestApp extends ComponentWithState {
  getInitialState() {
    console.log('create app instance');
    return {
      arr: [1, 2, 3],
    };
  }
  update(e) {
    e.preventDefault();
    this.setState({ arr: this.state.arr.map(i => i * 2) }); // [1, 2, 3] });
  }
  minus(e) {
    e.preventDefault();
    const arr = [...this.state.arr];
    arr.pop();
    this.setState({ arr });
  }
  plus(e) {
    e.preventDefault();
    const arr = [...this.state.arr];
    arr.push(Math.max(...arr) + 1);
    this.setState({ arr });
  }
  render() {
    console.log('render app');
    return (
      <div>
        <button type="button" onClick={this.update.bind(this)}>update</button>
        <button type="button" onClick={this.minus.bind(this)}>minus</button>
        <button type="button" onClick={this.plus.bind(this)}>plus</button>
        <ul>
          {this.state.arr.map(i => <Item key={`key-${i}`} item={{ id: i }} />)}
        </ul>
      </div>
    );
  }
}

const App = () => {
  return (
    <Wrapper>
      <div>
        <div id="hello3" className={{ button: false, buttonDanger: true }} style={{ backgroundColor: 'red', color: 'yellow' }}>Hello World!</div>
      </div>
      <div className={['button', 'button-danger']} id="hello">Hello World!</div>
      <div className="yo" id="hello2">Hello World!</div>
      <br />
      <Dummy separator="/" />
      <Clicker />
      <TestApp />
    </Wrapper>
  );
};

export function init(node) {
  render(App, node);
  console.log(renderToString(App));
}
