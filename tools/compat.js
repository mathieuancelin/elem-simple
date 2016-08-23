import * as React from '../src/index';
import { isFunction } from '../src/utils';

export * from '../src/index';

// aliases to stay compatible with other version of Elem
export const jsx = React.createElement;

/**
 * a simple function that return `what` if the predicate `p` is true
 */
export function predicate(p, what) {
  if (isFunction(p)) { // if it's a function, call it
    return !!p() ? what : undefined; // eslint-disable-line
  } else {
    return !!p ? what : undefined; // eslint-disable-line
  }
}
