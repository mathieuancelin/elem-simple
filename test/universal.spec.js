/* eslint react/no-multi-comp: 0, react/prop-types: 0, react/jsx-boolean-value: 0 */

import * as React from '../src/index';
import { expect } from 'chai';
import { describe, it } from 'mocha';

describe('elem-simple : universal', () => {
  it('should provide a way render HTML on the server for simple tree', () => {
    const app = React.renderToString(<h1 className="title" style={{ color: 'red' }}>Hello World!</h1>);
    expect(app).to.be.equal('<h1 class="title" style="color:red;">Hello World!</h1>');
  });
  it('should provide a way render HTML on the server for a function', () => {
    const App = () => <h1 className="title" style={{ color: 'red' }}>Hello World!</h1>;
    const app = React.renderToString(App);
    expect(app).to.be.equal('<h1 class="title" style="color:red;">Hello World!</h1>');
  });
  it('should provide universal rendering that support innerHTML', () => {
    const App = () => <h1 className="title"><div attributes={{ innerHTML: 'Hello World!' }}></div></h1>;
    const app = React.renderToString(App);
    expect(app).to.be.equal('<h1 class="title"><div>Hello World!</div></h1>');
  });
  it('should provide universal rendering that support functions', () => {
    const App = () => <h1 className="title"><div>{() => 'Hello World!'}</div></h1>;
    const app = React.renderToString(App);
    expect(app).to.be.equal('<h1 class="title"><div>Hello World!</div></h1>');
  });
  it('should provide universal rendering that support 0', () => {
    const App = () => <h1 className="title"><div>{0}</div></h1>;
    const app = React.renderToString(App);
    expect(app).to.be.equal('<h1 class="title"><div>0</div></h1>');
  });
  it('should provide universal rendering that support custom params', () => {
    const App = () => <h1 className="title" dataColor="red">Hello World!</h1>;
    const app = React.renderToString(App);
    expect(app).to.be.equal('<h1 class="title" data-color="red">Hello World!</h1>');
  });
  it('should provide universal rendering that allow some input stuff', () => {
    const App = () => <h1 className="title" dataColor="red"><input type="checkbox" indeterminate={true} /><input type="text" value="Mathieu" /></h1>;
    const app = React.renderToString(App);
    expect(app).to.be.equal(
      '<h1 class="title" data-color="red"><input type="checkbox" indeterminate="true"></input><input type="text" value="Mathieu"></input></h1>');
  });
  it('should provide universal rendering that allow sub components', () => {
    const Component = (props) => {
      props.redraw(); // for coverage only, should do nothing here !
      return <div>Hello World!</div>;
    };
    const App = () => <h1 className="title"><Component /></h1>;
    const app = React.renderToString(App);
    expect(app).to.be.equal('<h1 class="title"><div>Hello World!</div></h1>');
  });
});
