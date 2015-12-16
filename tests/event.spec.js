/* eslint no-unused-vars:0, no-undef:0, no-unused-expressions:0, react/no-multi-comp: 0, react/prop-types: 0, react/jsx-boolean-value: 0 */

import * as React from '../src/index';
import chai, { expect } from 'chai';

describe('elem-simple : events', () => {
  it('should provide a way set event handlers on DOM nodes', () => {
    let inputNode;
    const app = React.render(<div>
      <button type="button" onClick={(e) => inputNode.value = 'clicked'}>Click me</button>
      <input value="textvalue" ref={(n) => inputNode = n} />
    </div>, document.getElementById('app'));
    const input = document.getElementsByTagName('input')[0];
    const button = document.getElementsByTagName('button')[0];
    expect(input.value).to.be.equal('textvalue');
    button.click();
    expect(input.value).to.be.equal('clicked');
    app.cleanup();
  });
});
