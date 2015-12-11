/* eslint no-unused-vars:0, no-undef:0, no-unused-expressions:0 */

import * as React from '../src/index';
import chai, { expect } from 'chai';

describe('App', () => {
  it('should works !!!', () => {
    const App = (props) => {
      return (
        <div id="hello">Hello World!</div>
      );
    };
    const app = React.render(App, document.getElementById('app'));
    const div = document.getElementById('hello');
    expect(div.innerHTML).to.be.equal('Hello World!');
    app.cleanup();
  });
});
