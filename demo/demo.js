/* eslint react/no-multi-comp: 0 react/prop-types: 0 */

import { render, createElement, renderToString } from '../src/index';

const React = { createElement };

const Time = (props) => {
  return (
    <div>
      <span ref={(n) => console.log(n)}>Time {props.separator} {Date.now()}</span>
      <button type="button" onClick={() => props.myself.replaceWith(<Time separator={props.separator} />)}>update</button>
      <button type="button" onClick={() => props.redraw()}>redraw</button>
    </div>
  );
};

const Dummy = (props) => {
  return (
    <div>
      <span>Yo {props.separator} bitch</span>
      <button type="button" onClick={() => props.myself.replaceWith(<Time separator=":" />)}>time</button>
    </div>
  );
};

const Wrapper = (props) => <div style={{ border: '1px solid black' }}>{props.children}</div>;

const App = () => {
  return (
    <Wrapper>
      <div>
        <div id="hello3" className={{ button: false, buttonDanger: true }} style={{ backgroundColor: 'red', color: 'yellow' }}>Hello World!</div>
      </div>
      <div className={['button', 'button-danger']} id="hello">Hello World!</div>
      <div className="yo" id="hello2">Hello World!</div>
      <br />
      <Dummy separator="/" />
    </Wrapper>
  );
};

export function init(node) {
  render(App, node);
  console.log(renderToString(App));
}
