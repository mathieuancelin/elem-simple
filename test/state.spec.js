/* eslint react/no-multi-comp: 0, react/prop-types: 0, react/jsx-boolean-value: 0 */

import * as React from '../src/index';
import { expect } from 'chai';
import { describe, it } from 'mocha';
import { sid, invariant } from '../src/utils';

const cache = {};

function withState(getInitialState, name = sid('scomp')) {
  return (Component) => {
    return (props) => {
      invariant(props.key, 'You have to provide a key props for state component.');
      const componentKey = `state-${name}-${props.key}`;
      if (!cache[componentKey]) {
        cache[componentKey] = getInitialState();
      }
      const state = cache[componentKey];
      const setState = (newState) => {
        cache[componentKey] = { ...state, ...newState };
        props.redraw();
      };
      const replaceState = (newState) => {
        cache[componentKey] = newState;
        props.redraw();
      };
      const component = <Component {...props} state={state} setState={setState} replaceState={replaceState} />;
      setTimeout(() => {
        document.querySelector(`[data-fid="${component.nodeId}"]`).addEventListener('DOMNodeRemoved', () => {
          console.log('Deleting stuff');
          delete cache[componentKey];
        });
      });
      return component;
    };
  };
}

const SimpleClicker = ({ state, setState }) => {
  return <h1 onClick={() => setState({ counter: state.counter + 1 })}>You have clicked {state.counter} times</h1>;
};

const Clicker = withState(() => ({ counter: 1 }))(SimpleClicker);

describe('elem-simple : state test', () => {
  it('should be able to provide simple positional states', () => {
    const app = React.render(<div><Clicker key="c1" /></div>, document.getElementById('app'));
    let h1 = document.querySelector('h1');
    expect(h1.innerHTML).to.be.equal('You have clicked 1 times');
    h1.click();
    h1 = document.querySelector('h1');
    expect(h1.innerHTML).to.be.equal('You have clicked 2 times');
    h1.click();
    h1 = document.querySelector('h1');
    expect(h1.innerHTML).to.be.equal('You have clicked 3 times');
    app.cleanup();
  });
});
