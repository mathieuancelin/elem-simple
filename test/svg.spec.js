/* eslint react/no-multi-comp: 0, react/prop-types: 0, react/jsx-boolean-value: 0 */

import { expect } from 'chai';
import { describe, it } from 'mocha';
import * as React from '../src/index';

describe('elem-simple : svg', () => {
  it('should be able to render SVG nodes', () => {
    const shapes = (
      <svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="300" height="200">
        <rect width="100" height="80" x="0" y="70" fill="green" />
        <line x1="5" y1="5" x2="250" y2="95" stroke="red" />
        <circle cx="90" cy="80" r="50" fill="blue" />
      </svg>
    );
    const app = React.render(shapes, document.getElementById('app'));
    const rect = document.getElementsByTagName('rect')[0];
    const line = document.getElementsByTagName('line')[0];
    const circle = document.getElementsByTagName('circle')[0];

    expect(rect.getAttribute('fill')).to.be.equal('green');
    expect(rect.getAttribute('width')).to.be.equal('100');
    expect(rect.getAttribute('height')).to.be.equal('80');
    expect(rect.getAttribute('x')).to.be.equal('0');
    expect(rect.getAttribute('y')).to.be.equal('70');

    expect(line.getAttribute('x1')).to.be.equal('5');
    expect(line.getAttribute('x2')).to.be.equal('250');
    expect(line.getAttribute('y1')).to.be.equal('5');
    expect(line.getAttribute('y2')).to.be.equal('95');
    expect(line.getAttribute('stroke')).to.be.equal('red');

    expect(circle.getAttribute('cx')).to.be.equal('90');
    expect(circle.getAttribute('cy')).to.be.equal('80');
    expect(circle.getAttribute('r')).to.be.equal('50');
    expect(circle.getAttribute('fill')).to.be.equal('blue');

    app.cleanup();
  });
});
