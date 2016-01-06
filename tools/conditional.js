/* eslint react/no-multi-comp: 0, react/prop-types: 0  */

import * as React from '../src/index';

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
      return this.props.children;
    } else {
      return null;
    }
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
      } else {
        return null;
      }
    }
  };
}
