/* eslint no-unused-vars:0, no-undef:0, no-unused-expressions:0, react/no-multi-comp: 0, react/prop-types: 0, react/jsx-boolean-value: 0 */

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
  it('should play nice with predicates', () => {
    const Item = (props) => <li className="item">{props.value}</li>;
    const App = (props) => {
      return (
        <ul>
          {React.predicate(true, <Item value="Item 1" />)}
          {React.predicate(false, <Item value="Item 2" />)}
          {React.predicate(() => true, <Item value="Item 3" />)}
          {React.predicate(() => true, () => <Item value="Item 4" />)}
        </ul>
      );
    };
    const app = React.render(App, document.getElementById('app'));
    const ul = document.querySelector('ul');
    const children = ul.childNodes;
    expect(children.length).to.be.equal(3);
    expect(children[0].innerHTML).to.be.equal('Item 1');
    expect(children[0].tagName).to.be.equal('LI');
    expect(children[0].className).to.be.equal('item');
    expect(children[1].innerHTML).to.be.equal('Item 3');
    expect(children[1].tagName).to.be.equal('LI');
    expect(children[1].className).to.be.equal('item');
    expect(children[2].innerHTML).to.be.equal('Item 4');
    expect(children[2].tagName).to.be.equal('LI');
    expect(children[2].className).to.be.equal('item');
    app.cleanup();
  });
  it('should handle null or undefined nodes', () => {
    const App = (props) => {
      return (
        <ul>
          <li className="item">Item 1</li>
          {null}
          <li className="item">Item 2</li>
          {undefined}
          <li className="item">Item 3</li>
        </ul>
      );
    };
    const app = React.render(App, document.getElementById('app'));
    const ul = document.querySelector('ul');
    const children = ul.childNodes;
    expect(children.length).to.be.equal(3);
    expect(children[0].innerHTML).to.be.equal('Item 1');
    expect(children[0].tagName).to.be.equal('LI');
    expect(children[0].className).to.be.equal('item');
    expect(children[1].innerHTML).to.be.equal('Item 2');
    expect(children[1].tagName).to.be.equal('LI');
    expect(children[1].className).to.be.equal('item');
    expect(children[2].innerHTML).to.be.equal('Item 3');
    expect(children[2].tagName).to.be.equal('LI');
    expect(children[2].className).to.be.equal('item');
    app.cleanup();
  });
});

// DONE : function tag
// DONE : tree redraw
// DONE : tag redraw
// DONE : tag replace
// DONE : props.children
// DONE : props.myself
// DONE : props.context
// DONE : svg
// DONE : style
// DONE : class + classes + bool classes
// DONE : Universal
// DONE : node refs
// DONE : event handlers
// DONE : direct attributes
// DONE : direct tree in render
