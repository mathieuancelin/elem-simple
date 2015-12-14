/* eslint no-unused-vars:0, no-undef:0, no-unused-expressions:0, react/no-multi-comp: 0, react/prop-types: 0 */

import * as React from '../src/index';
import chai, { expect } from 'chai';

describe('elem-simple', () => {
  it('should just work !!!', () => {
    const App = (props) => {
      return (
        <div id="hello" dataTruc="machin" className={['btn', 'btn-primary']} style={{ color: 'red', backgroundColor: 'white' }}>Hello World!</div>
      );
    };
    const app = React.render(App, document.getElementById('app'));
    const div = document.getElementById('hello');
    expect(div.innerHTML).to.be.equal('Hello World!');
    expect(div.getAttribute('data-truc')).to.be.equal('machin');
    expect(div.style.color).to.be.equal('red');
    expect(div.style.backgroundColor).to.be.equal('white');
    expect(div.style['background-color']).to.be.equal('white');
    expect(div.getAttribute('class')).to.be.equal('btn btn-primary');
    app.cleanup();
  });
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
  it('should provide a way to get actual DOM node references', () => {
    const app = React.render(<input value="textvalue" ref={(n) => n.value = 'set value'} />, document.getElementById('app'));
    const input = document.getElementsByTagName('input')[0];
    expect(input.value).to.be.equal('set value');
    app.cleanup();
  });
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
  it('should provide a way render HTML on the server', () => {
    const app = React.renderToString(<h1 className="title" style={{ color: 'red' }}>Hello World!</h1>);
    expect(app).to.be.equal('<h1 class="title" style="color:red;">Hello World!</h1>');
  });
  it('should provide components through pure functions', () => {
    const Item = (props) => <li>Item : {props.name}</li>;
    const App = (props) => {
      return (
        <div>
          <Item name="John" />
          <Item name="Paul" />
          <Item name="Jones" />
        </div>
      );
    };
    const app = React.render(App, document.getElementById('app'));
    const items = document.getElementsByTagName('li');
    expect(items.length).to.be.equal(3);
    expect(items[0].innerHTML).to.be.equal('Item : John');
    expect(items[1].innerHTML).to.be.equal('Item : Paul');
    expect(items[2].innerHTML).to.be.equal('Item : Jones');
    app.cleanup();
  });
});

// DONE : function tag
// TODO : tree redraw
// TODO : tag redraw
// TODO : tag replace
// TODO : props.children
// TODO : props.myself
// TODO : props.context
// TODO : svg
// TODO : style
// TODO : class
// DONE : Universal
// DONE : node refs
// DONE : event handlers
// DONE : direct attributes
// DONE : direct tree in render
