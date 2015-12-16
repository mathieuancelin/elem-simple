/* eslint no-unused-vars:0, no-undef:0, no-unused-expressions:0, react/no-multi-comp: 0, react/prop-types: 0, react/jsx-boolean-value: 0 */

import * as React from '../src/index';
import chai, { expect } from 'chai';

describe('elem-simple : style', () => {
  it('should handle style object', () => {
    const App = (props) => {
      return (
        <h1 style={{ color: 'red', backgroundColor: 'black', border: '1px solid blue' }}>Hello World!</h1>
      );
    };
    const app = React.render(App, document.getElementById('app'));
    const h1 = document.getElementsByTagName('h1')[0];
    expect(h1.style.color).to.be.equal('red');
    expect(h1.style.backgroundColor).to.be.equal('black');
    expect(h1.style.border).to.be.equal('1px solid blue');
    expect(h1.getAttribute('style')).to.be.equal('color:red;background-color:black;border:1px solid blue;');
    app.cleanup();
  });
  it('should handle style string', () => {
    const App = (props) => {
      return (
        <h1 style="color:red;background-color:black;border:1px solid blue;">Hello World!</h1>
      );
    };
    const app = React.render(App, document.getElementById('app'));
    const h1 = document.getElementsByTagName('h1')[0];
    expect(h1.style.color).to.be.equal('red');
    expect(h1.style.backgroundColor).to.be.equal('black');
    expect(h1.style.border).to.be.equal('1px solid blue');
    expect(h1.getAttribute('style')).to.be.equal('color:red;background-color:black;border:1px solid blue;');
    app.cleanup();
  });
});
