/* eslint react/no-multi-comp: 0, react/prop-types: 0  */

import * as React from '../src/index';
import { invariant } from '../src/utils';

function isObject(χ) {
  return !!χ && (typeof χ === 'object' || typeof χ === 'function');
}

function isFunction(χ) {
  return isObject(χ) && Object.prototype.toString.call(χ) === '[object Function]';
}

function isTruthy(expression) {
  return !!expression;
}

export class Conditional extends React.Component {
  constructor(props) {
    invariant(props.children && props.children.length === 1, 'Only one child is allowed inside Conditional');
    super(props);
  }
  getDefaultProps() {
    return {
      condition: true,
      children: null,
    };
  }
  render() {
    let condition = this.props.condition;
    if (isFunction(condition)) {
      condition = condition();
    }
    if (isTruthy(condition)) {
      return this.props.children[0];
    }
    return null;
  }
}

export function withConditionalRendering(Component) {
  return class extends React.Component {
    getDefaultProps() {
      return {
        condition: true,
      };
    }
    render() {
      let condition = this.props.condition;
      if (isFunction(condition)) {
        condition = condition();
      }
      if (isTruthy(condition)) {
        return (
          <Component {...this.props} />
        );
      }
      return null;
    }
  };
}
