/* eslint no-unused-vars:0, no-undef:0, no-unused-expressions:0, react/no-multi-comp: 0, react/prop-types: 0, react/jsx-boolean-value: 0 */

import * as React from '../src/index';
import chai, { expect } from 'chai';

describe('elem-simple : functions', () => {
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
  it('should provide a context to its components', () => {
    const FirstComponent = (props) => {
      props.treeContext.secondvalue = 'value2';
      return <div className="firstcomponent">{props.treeContext.value}</div>;
    };
    const SecondComponent = (props) => <div className="secondcomponent">{props.treeContext.value} {props.treeContext.secondvalue}</div>;
    const App = (props) => {
      props.treeContext.value = 'value1';
      return (
        <div>
          <FirstComponent />
          <SecondComponent />
        </div>
      );
    };
    const app = React.render(App, document.getElementById('app'));
    const div1 = document.querySelector('.firstcomponent');
    const div2 = document.querySelector('.secondcomponent');
    expect(div1.innerHTML).to.be.equal('value1');
    expect(div2.innerHTML).to.be.equal('value1 value2');
    app.cleanup();
  });
  it('should provide a way to redraw the whole element tree', () => {
    let firstValue = 1;
    let secondValue = 1;
    const FirstComponent = (props) => <div className="firstcomponent">{firstValue}</div>;
    const SecondComponent = (props) => <div className="secondcomponent" onClick={(e) => {
      firstValue = 200;
      secondValue = 400;
      props.redraw();
    }}>{secondValue}</div>;
    const App = (props) => {
      return (
        <div>
          <FirstComponent />
          <SecondComponent />
          <button type="button" onClick={(e) => {
            firstValue += 1;
            secondValue += 2;
            props.redraw();
          }}>click me</button>
        </div>
      );
    };
    const app = React.render(App, document.getElementById('app'));
    let div1 = document.querySelector('.firstcomponent');
    let div2 = document.querySelector('.secondcomponent');
    const button = document.getElementsByTagName('button')[0];
    expect(div1.innerHTML).to.be.equal('1');
    expect(div2.innerHTML).to.be.equal('1');
    button.click();
    div1 = document.querySelector('.firstcomponent');
    div2 = document.querySelector('.secondcomponent');
    expect(div1.innerHTML).to.be.equal('2');
    expect(div2.innerHTML).to.be.equal('3');
    div2.click();
    div1 = document.querySelector('.firstcomponent');
    div2 = document.querySelector('.secondcomponent');
    expect(div1.innerHTML).to.be.equal('200');
    expect(div2.innerHTML).to.be.equal('400');
    app.cleanup();
  });
});
