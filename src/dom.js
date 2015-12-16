import { dasherize, isFunction, startsWith } from './utils';
import { attachEvents } from './event';
import { renderFunction } from './function';
import { serializeStyle } from './style';
import { serializeClass } from './class';

/**
 * Serialize an element tree into a DOM node tree. Attach event handlers,
 * direct attributes and traverse children of each node.
 */
export function serializeElementToDOM(document, element, ctx) {
  if (element.__type === 'simple-node') {
    const node = element.namespace ?
      document.createElementNS(element.namespace, element.name) :
      document.createElement(element.name);
    for (const key in element.props) { // LOOP
      const value = element.props[key];
      if (key !== 'ref' && key !== 'attributes' && !startsWith(key, 'on') && !isFunction(value)) {
        if (key === 'value' && element.name === 'input') {
          node.value = value;
        } else if (key === 'indeterminate' && element.name === 'input') {
          node.indeterminate = value;
        } else if (key === 'className' || key === 'class') {
          node.setAttribute('class', serializeClass(value));
        } else if (key === 'style') {
          node.setAttribute('style', serializeStyle(value));
        } else {
          node.setAttribute(dasherize(key), value);
        }
      } else if (key === 'attributes') {
        for (const attr in value) {
          node[attr] = value[attr];
        }
      }
    }
    attachEvents(element.props, node);
    for (const childIdx in element.children) { // LOOP
      let child = element.children[childIdx];
      if (child && isFunction(child)) {
        child = child();
      }
      if (child) {
        let childNode;
        if (child.__type) {
          childNode = serializeElementToDOM(document, child, ctx);
        } else {
          childNode = document.createTextNode(String(child));
        }
        if (childNode) {
          node.appendChild(childNode);
        }
      }
    }
    if (element.props.ref && isFunction(element.props.ref)) {
      element.props.ref(node);
    }
    return node;
  } else if (element.__type === 'function-node') {
    const funcElement = renderFunction(element, ctx, document);
    if (!funcElement) return null;
    const funcNode = serializeElementToDOM(document, funcElement, ctx);
    if (!funcNode) return null;
    funcNode.setAttribute('data-fid', element.nodeId);
    return funcNode;
  }
}
