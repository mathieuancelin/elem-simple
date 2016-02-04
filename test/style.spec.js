/* eslint react/no-multi-comp: 0, react/prop-types: 0, react/jsx-boolean-value: 0 */

import * as React from '../src/index';
import { expect } from 'chai';
import { describe, it } from 'mocha';

describe('elem-simple : style', () => {
  it('should handle style object', () => {
    const App = () => (
      <h1 style={{ color: 'red', backgroundColor: 'black', border: '1px solid blue' }}>Hello World!</h1>
    );
    const app = React.render(<App />, document.getElementById('app'));
    const h1 = document.getElementsByTagName('h1')[0];
    expect(h1.style.color).to.be.equal('red');
    expect(h1.style.backgroundColor).to.be.equal('black');
    expect(h1.style.border).to.be.equal('1px solid blue');
    expect(h1.getAttribute('style')).to.be.equal('color:red;background-color:black;border:1px solid blue;');
    app.cleanup();
  });
  it('should handle style string', () => {
    const App = () => (
      <h1 style="color:red;background-color:black;border:1px solid blue;">Hello World!</h1>
    );
    const app = React.render(<App />, document.getElementById('app'));
    const h1 = document.getElementsByTagName('h1')[0];
    expect(h1.style.color).to.be.equal('red');
    expect(h1.style.backgroundColor).to.be.equal('black');
    expect(h1.style.border).to.be.equal('1px solid blue');
    expect(h1.getAttribute('style')).to.be.equal('color:red;background-color:black;border:1px solid blue;');
    app.cleanup();
  });
  it('should handle style function', () => {
    const App = () => (
      <h1 style={{ color: () => 'red' }}>Hello World!</h1>
    );
    const app = React.render(<App />, document.getElementById('app'));
    const h1 = document.getElementsByTagName('h1')[0];
    expect(h1.style.color).to.be.equal('red');
    expect(h1.getAttribute('style')).to.be.equal('color:red;');
    app.cleanup();
  });
  it('should handle undefined style', () => {
    const App = () => (
      <h1 style={undefined}>Hello World!</h1>
    );
    const app = React.render(<App />, document.getElementById('app'));
    const h1 = document.getElementsByTagName('h1')[0];
    expect(h1.getAttribute('style')).to.be.equal('');
    app.cleanup();
  });
});
