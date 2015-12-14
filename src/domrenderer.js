import { dasherize, isFunction, startsWith } from './utils';
import { attachEvents } from './eventhandlers';
import { renderFunction } from './func';
import { serializeStyle } from './style';
import { serializeClass } from './class';

export function renderToDOM(document, element, ctx) {
  if (element.__type === 'simple-node') {
    const node = element.namespace ?
      document.createElementNS(element.namespace, element.name) :
      document.createElement(element.name);
    for (const key in element.props) {
      const value = element.props[key];
      if (key !== 'ref' && key !== 'attributes' && !startsWith(key, 'on') && !isFunction(value)) {
        if (key === 'value' && element.name === 'input') {
          node.value = value;
        } else if (key === 'indeterminate' && element.name === 'input') {
          node.indeterminate = value;
        } else if (key === 'className' || key === 'class') {
          node.setAttribute('class', serializeClass(value).join(' '));
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
    for (const childIdx in element.children) {
      let child = element.children[childIdx];
      if (child && isFunction(child)) {
        child = child();
      }
      if (child) {
        let childNode;
        if (child.__type) {
          childNode = renderToDOM(document, child, ctx);
        } else {
          childNode = document.createTextNode(String(child));
        }
        node.appendChild(childNode);
      }
    }
    if (element.props.ref && isFunction(element.props.ref)) {
      element.props.ref(node);
    }
    return node;
  } else {
    const funcElement = renderFunction(element, ctx, document);
    const funcNode = renderToDOM(document, funcElement, ctx);
    funcNode.setAttribute('data-funccallid', element.nodeId);
    return funcNode;
  }
}
