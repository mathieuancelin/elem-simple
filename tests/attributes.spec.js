/* eslint no-unused-vars:0, no-undef:0, no-unused-expressions:0, react/no-multi-comp: 0, react/prop-types: 0, react/jsx-boolean-value: 0 */

import * as React from '../src/index';
import chai, { expect } from 'chai';

describe('elem-simple : attributes', () => {
  it('should handle direct attributes with the `attributes` props', () => {
    const app = React.render(<h1 attributes={{ yo: 'Man' }}>Hello</h1>, document.getElementById('app'));
    const h1 = document.getElementsByTagName('h1')[0];
    expect(h1.yo).to.be.equal('Man');
    app.cleanup();
  });
  it('should handle innerHTML with the `attributes` props', () => {
    const app = React.render(<div attributes={{ innerHTML: '<h1>Test innerHTML</h1>' }}></div>, document.getElementById('app'));
    const h1 = document.getElementsByTagName('h1')[0];
    expect(h1.innerHTML).to.be.equal('Test innerHTML');
    app.cleanup();
  });
});
