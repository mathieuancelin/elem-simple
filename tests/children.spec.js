/* eslint no-unused-vars:0, no-undef:0, no-unused-expressions:0, react/no-multi-comp: 0, react/prop-types: 0, react/jsx-boolean-value: 0 */

import * as React from '../src/index';
import chai, { expect } from 'chai';

describe('elem-simple : children', () => {
  it('should handle components with children', () => {
    const Item = (props) => <li className="item">{props.value}</li>;
    const Wrapper = (props) => <ul className="wrapper">{props.children}</ul>;
    const App = (props) => {
      return (
        <Wrapper>
          <Item value="Item 1" />
          <Item value="Item 2" />
          <Item value="Item 3" />
        </Wrapper>
      );
    };
    const app = React.render(App, document.getElementById('app'));
    const ul = document.querySelector('ul');
    const children = ul.childNodes;
    expect(ul.className).to.be.equal('wrapper');
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
  it('should handle components with null, undefined, false, and array children', () => {
    const Item = (props) => <li className="item">{props.value}</li>;
    const Wrapper = (props) => <ul className="wrapper">{props.children}</ul>;
    const returnZero = () => 0;
    const returnArray = () => [];
    const returnBoolean = () => false;
    const returnNull = () => null;
    const returnUndefined = () => undefined;
    const App = (props) => {
      return (
        <Wrapper>
          <Item value="Item 1" />
          {returnArray()}
          <Item value="Item 2" />
          {returnBoolean()}
          <Item value="Item 3" />
          {returnNull()}
          <Item value="Item 4" />
          {returnUndefined()}
          <Item value="Item 5" />
          {returnZero()}
          <Item value="Item 6" />
        </Wrapper>
      );
    };
    const app = React.render(App, document.getElementById('app'));
    const ul = document.querySelector('ul');
    const children = ul.childNodes;
    expect(ul.className).to.be.equal('wrapper');
    expect(children.length).to.be.equal(7);
    expect(children[0].innerHTML).to.be.equal('Item 1');
    expect(children[0].tagName).to.be.equal('LI');
    expect(children[0].className).to.be.equal('item');
    expect(children[1].innerHTML).to.be.equal('Item 2');
    expect(children[1].tagName).to.be.equal('LI');
    expect(children[1].className).to.be.equal('item');
    expect(children[2].innerHTML).to.be.equal('Item 3');
    expect(children[2].tagName).to.be.equal('LI');
    expect(children[2].className).to.be.equal('item');
    expect(children[3].innerHTML).to.be.equal('Item 4');
    expect(children[3].tagName).to.be.equal('LI');
    expect(children[3].className).to.be.equal('item');
    expect(children[4].innerHTML).to.be.equal('Item 5');
    expect(children[4].tagName).to.be.equal('LI');
    expect(children[4].className).to.be.equal('item');
    expect(children[6].innerHTML).to.be.equal('Item 6');
    expect(children[6].tagName).to.be.equal('LI');
    expect(children[6].className).to.be.equal('item');
    app.cleanup();
  });
  it('should handle components with null, undefined, false, and array children as tags', () => {
    const Item = (props) => <li className="item">{props.value}</li>;
    const Wrapper = (props) => <ul className="wrapper">{props.children}</ul>;
    const ReturnZero = () => 0;
    const ReturnArray = () => [];
    const ReturnBoolean = () => false;
    const ReturnNull = () => null;
    const ReturnUndefined = () => undefined;
    const App = (props) => {
      return (
        <Wrapper>
          <Item value="Item 1" />
          <ReturnArray />
          <Item value="Item 2" />
          <ReturnBoolean />
          <Item value="Item 3" />
          <ReturnNull />
          <Item value="Item 4" />
          <ReturnUndefined />
          <Item value="Item 5" />
          <ReturnZero />
          <Item value="Item 6" />
        </Wrapper>
      );
    };
    const app = React.render(App, document.getElementById('app'));
    const ul = document.querySelector('ul');
    const children = ul.childNodes;
    expect(ul.className).to.be.equal('wrapper');
    expect(children.length).to.be.equal(6);
    expect(children[0].innerHTML).to.be.equal('Item 1');
    expect(children[0].tagName).to.be.equal('LI');
    expect(children[0].className).to.be.equal('item');
    expect(children[1].innerHTML).to.be.equal('Item 2');
    expect(children[1].tagName).to.be.equal('LI');
    expect(children[1].className).to.be.equal('item');
    expect(children[2].innerHTML).to.be.equal('Item 3');
    expect(children[2].tagName).to.be.equal('LI');
    expect(children[2].className).to.be.equal('item');
    expect(children[3].innerHTML).to.be.equal('Item 4');
    expect(children[3].tagName).to.be.equal('LI');
    expect(children[3].className).to.be.equal('item');
    expect(children[4].innerHTML).to.be.equal('Item 5');
    expect(children[4].tagName).to.be.equal('LI');
    expect(children[4].className).to.be.equal('item');
    expect(children[5].innerHTML).to.be.equal('Item 6');
    expect(children[5].tagName).to.be.equal('LI');
    expect(children[5].className).to.be.equal('item');
    app.cleanup();
  });
  it('should handle a zero child', () => {
    const App = (props) => {
      return (
        <ul>
          <li>{0}</li>
        </ul>
      );
    };
    const app = React.render(App, document.getElementById('app'));
    const li = document.querySelector('li');
    expect(li.innerHTML).to.be.equal('0');
    app.cleanup();
  });
  it('should handle a zero child JSX', () => {
    const App = (props) => {
      return (
        <ul>
          <li>0</li>
        </ul>
      );
    };
    const app = React.render(App, document.getElementById('app'));
    const li = document.querySelector('li');
    expect(li.innerHTML).to.be.equal('0');
    app.cleanup();
  });
  it('should be able to render an array', () => {
    const App = [
      <li>Item 1</li>,
      <li>Item 2</li>,
      <li>Item 3</li>,
    ];
    const app = React.render(App, document.getElementById('app'));
    const li = [].slice.call(document.querySelectorAll('li'));
    expect(li.length).to.be.equal(3);
    app.cleanup();
  });
});
