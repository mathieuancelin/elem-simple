/* eslint no-unused-vars:0, no-undef:0, no-unused-expressions:0, react/no-multi-comp: 0, react/prop-types: 0, react/jsx-boolean-value: 0 */

import * as React from '../src/index';
import chai, { expect } from 'chai';

describe('elem-simple : universal', () => {
  it('should provide a way render HTML on the server', () => {
    const app = React.renderToString(<h1 className="title" style={{ color: 'red' }}>Hello World!</h1>);
    expect(app).to.be.equal('<h1 class="title" style="color:red;">Hello World!</h1>');
  });
});
