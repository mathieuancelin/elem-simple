/* eslint react/no-multi-comp: 0, react/prop-types: 0, react/jsx-boolean-value: 0 */

import * as React from '../src/index';
import { expect } from 'chai';
import { describe, it } from 'mocha';
import { StoreProvider, enhanceWithStore, Store } from '../tools';

class Clicker extends React.Component {
  constructor(props) {
    super(props);
    this.setState = props.store.setState;
    this.state = props.store.state;
  }
  increment() {
    this.setState({ counter: this.state.counter + 1 });
  }
  render() {
    return (
      <h1 id="h1" onClick={this.increment.bind(this)}>
        You have clicked {this.state.counter} times
      </h1>
    );
  }
}

const Eclicker = enhanceWithStore()(Clicker);

describe('elem-simple : store', () => {
  it('should be able to provide global state', () => {
    const store = new Store({ counter: 1 });
    const app = React.render(<StoreProvider store={store}><Eclicker /></StoreProvider>, document.getElementById('app'));
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
