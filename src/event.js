import { isFunction, startsWith, invariant } from './utils';

/**
 * Search every properties that start with `on` and attach the corresponding event
 * handler on the corresponding DOM node
 *
 * @param properties the props of the VDOM element
 * @param domNode the actual DOM node represented by the current VDOM element
 */
export function attachEvents(properties, domNode) {
  for (const key in properties) { // LOOP
    // if the property starts with 'on' it should be an event handler
    if (startsWith(key, 'on')) {
      const value = properties[key];
      if (value) {
        // check if it's a function
        invariant(isFunction(value), `${key} should be a function`);
        // extract the event name
        const eventName = key.replace('on', '').toLowerCase();
        // attach the event handler to the actual DOM node
        domNode.addEventListener(eventName, value);
      }
    }
  }
}
