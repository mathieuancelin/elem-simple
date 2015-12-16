import { isFunction, startsWith, invariant } from './utils';

/**
 * Search every properties that start with `on` and attach the corresponding event
 * handler on the corresponding DOM node
 */
export function attachEvents(attrs, node) {
  for (const key in attrs) { // LOOP
    if (startsWith(key, 'on')) {
      const value = attrs[key];
      if (value) {
        invariant(isFunction(value), `${key} should be a function`);
        const eventName = key.replace('on', '').toLowerCase();
        node.addEventListener(eventName, value);
      }
    }
  }
}
