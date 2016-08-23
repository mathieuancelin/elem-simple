/* eslint react/no-multi-comp: 0, react/prop-types: 0, react/jsx-boolean-value: 0, react/jsx-closing-bracket-location: 0 */

import { describe, it } from 'mocha';
import { expect } from 'chai';
import * as React from '../src/index';

describe('elem-simple : myself', () => {
  it('should provide a way to redraw a particular tag', () => {
    let firstValue = 1;
    let secondValue = 1;
    const FirstComponent = (props) => <div className="firstcomponent">{props.value}</div>;
    const SecondComponent = (props) => (
      <div className="secondcomponent" onClick={() => {
        secondValue = 600;
        firstValue = 1000;
        props.myself.redraw({ value: secondValue });
      }}>{props.value}</div>
    );
    const App = () => (
      <div>
        <FirstComponent value={firstValue} />
        <SecondComponent value={secondValue} />
      </div>
    );
    const app = React.render(<App />, document.getElementById('app'));
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
  it('should provide a way to redraw a particular tag with same props', () => {
    let firstValue = 1;
    let secondValue = 1;
    const FirstComponent = (props) => <div className="firstcomponent">{props.value}</div>;
    const SecondComponent = (props) => (
      <div className="secondcomponent" onClick={() => {
        secondValue = 600;
        firstValue = 1000;
        props.myself.redraw();
      }}>{props.value}</div>
    );
    const App = () => (
      <div>
        <FirstComponent value={firstValue} />
        <SecondComponent value={secondValue} />
      </div>
    );
    const app = React.render(<App />, document.getElementById('app'));
    const div1 = document.querySelector('.firstcomponent');
    let div2 = document.querySelector('.secondcomponent');
    expect(div1.innerHTML).to.be.equal('1');
    expect(div2.innerHTML).to.be.equal('1');
    div2.click();
    div2 = document.querySelector('.secondcomponent');
    expect(div1.innerHTML).to.be.equal('1');
    expect(div2.innerHTML).to.be.equal('1');
    app.cleanup();
  });
  it('should provide a way to replace a particular tag', () => {
    let firstValue = 1;
    let secondValue = 1;
    const FirstComponent = (props) => <div className="firstcomponent">{props.value}</div>;
    const SecondComponent = (props) => (
      <div className="secondcomponent" onClick={() => {
        secondValue = 600;
        firstValue = 1000;
        props.myself.replaceWith(<SecondComponent value={secondValue} />);
      }}>{props.value}</div>
    );
    const App = () => (
      <div>
        <FirstComponent value={firstValue} />
        <SecondComponent value={secondValue} />
      </div>
    );
    const app = React.render(<App />, document.getElementById('app'));
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
  it('should provide a way to redraw a particular tag surrounded by other tags', () => {
    const FirstComponent = (props) => (
      <div className="rfc">
        <div className="firstcomponent">{props.value}</div>
        <button type="button" onClick={() => props.myself.redraw({ value: 2 })}>Click</button>
      </div>
    );
    const Wrapper = (props) => props.children[0];
    const App = () => (
      <div>
        <Wrapper>
          <Wrapper>
            <Wrapper>
              <Wrapper>
                <Wrapper>
                  <FirstComponent value={1} />
                </Wrapper>
              </Wrapper>
            </Wrapper>
          </Wrapper>
        </Wrapper>
      </div>
    );
    const app = React.render(<App />, document.getElementById('app'));
    let div1 = document.querySelector('.firstcomponent');
    const button = document.querySelector('button');
    expect(div1.innerHTML).to.be.equal('1');
    button.click();
    div1 = document.querySelector('.firstcomponent');
    expect(div1.innerHTML).to.be.equal('2');
    app.cleanup();
  });
  it('should provide a way to redraw a particular tag surrounded by other tags 2', () => {
    const FirstComponent = (props) => (
      <div className="rfc">
        <div className="firstcomponent">{props.value}</div>
        <button type="button" onClick={() => props.myself.redraw({ value: 2 })}>Click</button>
      </div>
    );
    const Other = () => <span>other</span>;
    const Wrapper = (props) => props.children[0];
    const App = () => (
      <div>
        <Wrapper>
          <Wrapper>
            <Wrapper>
              <Wrapper>
                <Wrapper>
                  <div>
                    <Other />
                    <FirstComponent value={1} />
                  </div>
                </Wrapper>
              </Wrapper>
            </Wrapper>
          </Wrapper>
        </Wrapper>
      </div>
    );
    const app = React.render(<App />, document.getElementById('app'));
    let div1 = document.querySelector('.firstcomponent');
    const button = document.querySelector('button');
    expect(div1.innerHTML).to.be.equal('1');
    button.click();
    div1 = document.querySelector('.firstcomponent');
    expect(div1.innerHTML).to.be.equal('2');
    app.cleanup();
  });
  it('should avoid eating parts when redrawing nested components', () => {
    const Wrapper = (props) => props.children[0];
    const WrapperUl = (props) => <ul>{props.children[0]}</ul>;
    const FirstComponent = (props) => (
      <Wrapper>
        <div>
          <div className="firstcomponent">{props.value}</div>
          <button type="button" onClick={() => props.myself.redraw({ value: 2 })}>Click</button>
        </div>
      </Wrapper>
    );
    const App = () => (
      <div>
        <Wrapper>
          <WrapperUl>
            <FirstComponent value={1} />
          </WrapperUl>
        </Wrapper>
      </div>
    );
    const app = React.render(<App />, document.getElementById('app'));
    let div1 = document.querySelector('.firstcomponent');
    let ul = document.querySelector('ul');
    const button = document.querySelector('button');
    expect(div1.innerHTML).to.be.equal('1');
    expect(ul).to.not.be.undefined; // eslint-disable-line
    expect(ul).to.not.be.null; // eslint-disable-line
    button.click();
    div1 = document.querySelector('.firstcomponent');
    expect(div1.innerHTML).to.be.equal('2');
    ul = document.querySelector('ul');
    expect(ul).to.not.be.undefined; // eslint-disable-line
    expect(ul).to.not.be.null; // eslint-disable-line
    app.cleanup();
  });
});
