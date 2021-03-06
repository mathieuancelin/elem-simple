/* eslint no-unused-expressions: 0, react/no-multi-comp: 0, react/prop-types: 0, react/jsx-boolean-value: 0 */

import { expect } from 'chai';
import { describe, it } from 'mocha';
import * as React from '../src/index';

describe('elem-simple : attributes', () => {
  it('should handle direct attributes with the `attributes` props', () => {
    const app = React.render(<h1 attributes={{ yo: 'Man' }}>Hello</h1>, document.getElementById('app'));
    const h1 = document.getElementsByTagName('h1')[0];
    expect(h1.yo).to.be.equal('Man');
    app.cleanup();
  });
  it('should handle innerHTML with the `attributes` props', () => {
    const app = React.render(<div attributes={{ innerHTML: '<h1>Test innerHTML</h1>' }} />, document.getElementById('app'));
    const h1 = document.getElementsByTagName('h1')[0];
    expect(h1.innerHTML).to.be.equal('Test innerHTML');
    app.cleanup();
  });
  it('should handle indeterminate on input with the `attributes` props', () => {
    const app = React.render(<input type="checkbox" attributes={{ indeterminate: true }} />, document.getElementById('app'));
    const input = document.getElementsByTagName('input')[0];
    expect(input.indeterminate).to.be.true;
    app.cleanup();
  });
  it('should handle indeterminate on input directly on the element', () => {
    const app = React.render(<input type="checkbox" indeterminate={true} />, document.getElementById('app'));
    app.redraw();
    const input = app.getNode(); // document.getElementsByTagName('input')[0];
    expect(input.indeterminate).to.be.true;
    app.cleanup();
  });
});
