/* eslint no-unused-vars:0, no-undef:0, no-unused-expressions:0, react/no-multi-comp: 0, react/prop-types: 0, react/jsx-boolean-value: 0 */

import * as React from '../src/index';
import chai, { expect } from 'chai';
import { describe, it } from 'mocha';

describe('elem-simple : refs', () => {
  it('should provide a way to get actual DOM node references', () => {
    const app = React.render(<input value="textvalue" ref={(n) => n.value = 'set value'} />, document.getElementById('app'));
    const input = document.getElementsByTagName('input')[0];
    expect(input.value).to.be.equal('set value');
    app.cleanup();
  });
});
