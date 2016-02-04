/* eslint no-console: 0, react/no-multi-comp: 0, react/prop-types: 0, react/jsx-boolean-value: 0, react/jsx-closing-bracket-location: 0 */

import * as React from '../src/index';
import { bootstrapEnv } from './bootstrap';
import { describe, it } from 'mocha';

bootstrapEnv('<div id="app"></div>');

describe('elem-simple : perfs', function description() {
  this.timeout(15000);
  it('running perfs test', (done) => {
    const Hello = ({ who }) => <h1>Hello ${who}</h1>;
    const App = () => (
      <div id="hello"
        dataTruc="machin"
        className={['btn', 'btn-primary']}
        style={{ color: 'red', backgroundColor: 'white' }}>
        <Hello who="World!" />
      </div>
    );
    let app;
    const render = () => app = React.render(<App />, document.getElementById('app'));
    const loop = (times, what) => {
      for (let j = 0; j < times; j++) {
        what();
      }
    };
    const warmupCount = 10;
    const runCount = 20;
    const looping = 400;
    setTimeout(() => {
      for (let i = 0; i < warmupCount; i++) {
        loop(looping, render);
      }
      const start = Date.now();
      for (let i = 0; i < runCount; i++) {
        loop(looping, render);
      }
      const time = Date.now() - start;
      console.log(`took ${time} ms to run ${runCount * looping} times, or ${time / (runCount * looping)} ms per render`);
      app.cleanup();
      done();
    }, 0);
  });
});
