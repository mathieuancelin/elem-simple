/* eslint no-unused-vars:0, no-undef:0, no-unused-expressions:0 */

import { bootstrapEnv } from './bootstrap';

bootstrapEnv('<div id="app"></div>');

const tests = [
  require('./attributes.spec.js'),
  require('./basic.spec.js'),
  require('./children.spec.js'),
  require('./class.spec.js'),
  require('./components.spec.js'),
  require('./event.spec.js'),
  require('./function.spec.js'),
  require('./myself.spec.js'),
  require('./ref.spec.js'),
  require('./style.spec.js'),
  require('./svg.spec.js'),
  require('./universal.spec.js'),
];
