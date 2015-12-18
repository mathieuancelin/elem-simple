/* eslint no-unused-vars:0, no-undef:0, no-unused-expressions:0, react/no-multi-comp: 0, react/prop-types: 0, react/jsx-boolean-value: 0, react/jsx-closing-bracket-location: 0 */

import * as React from '../src/index';
import chai, { expect } from 'chai';

describe('elem-simple : myself', () => {
  it('should provide a way to redraw a particular tag', () => {
    let firstValue = 1;
    let secondValue = 1;
    const FirstComponent = (props) => <div className="firstcomponent">{props.value}</div>;
    const SecondComponent = (props) => {
      return (
        <div className="secondcomponent" onClick={(e) => {
          secondValue = 600;
          firstValue = 1000;
          props.myself.redraw({ value: secondValue });
        }}>{props.value}</div>
    );
    };
    const App = (props) => {
      return (
        <div>
          <FirstComponent value={firstValue} />
          <SecondComponent value={secondValue} />
        </div>
      );
    };
    const app = React.render(App, document.getElementById('app'));
    const div1 = document.querySelector('.firstcomponent');
    let div2 = document.querySelector('.secondcomponent');
    expect(div1.innerHTML).to.be.equal('1');
    expect(div2.innerHTML).to.be.equal('1');
    div2.click();
    div2 = document.querySelector('.secondcomponent');
    expect(div1.innerHTML).to.be.equal('1');
    expect(div2.innerHTML).to.be.equal('600');
    app.cleanup();
  });
  it('should provide a way to replace a particular tag', () => {
    let firstValue = 1;
    let secondValue = 1;
    const FirstComponent = (props) => <div className="firstcomponent">{props.value}</div>;
    const SecondComponent = (props) => {
      return (
        <div className="secondcomponent" onClick={(e) => {
          secondValue = 600;
          firstValue = 1000;
          props.myself.replaceWith(<SecondComponent value={secondValue} />);
        }}>{props.value}</div>
      );
    };
    const App = (props) => {
      return (
        <div>
          <FirstComponent value={firstValue} />
          <SecondComponent value={secondValue} />
        </div>
      );
    };
    const app = React.render(App, document.getElementById('app'));
    const div1 = document.querySelector('.firstcomponent');
    let div2 = document.querySelector('.secondcomponent');
    expect(div1.innerHTML).to.be.equal('1');
    expect(div2.innerHTML).to.be.equal('1');
    div2.click();
    div2 = document.querySelector('.secondcomponent');
    expect(div1.innerHTML).to.be.equal('1');
    expect(div2.innerHTML).to.be.equal('600');
    app.cleanup();
  });
});
