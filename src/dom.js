import { dasherize, isFunction, invariant, startsWith } from './utils';
import { attachEvents } from './event';
import { renderFunction } from './function';
import { serializeStyle } from './style';
import { serializeClass } from './class';

/**
 * Serialize an element tree into a DOM node tree. Attach event handlers,
 * direct attributes and traverse children of each node.
 *
 * @param document, the current document to create DOM node
 * @param element, the element to render
 * @param ctx, the tree context
 */
export function serializeElementToDOM(document, element, ctx) {
  // if it's an HTML element
  if (element.__type === 'simple-node') {
    // create the DOM node with it's namespace
    const node = element.namespace ?
      document.createElementNS(element.namespace, element.name) :
      document.createElement(element.name);
    // for each property, add it to the node attributes
    for (const key in element.props) { // LOOP
      const value = element.props[key];
      if (key !== 'ref' && key !== 'attributes' && !startsWith(key, 'on') && !isFunction(value)) {
        if (key === 'value' && element.name === 'input') {
          node.value = value;
        } else if (key === 'indeterminate' && element.name === 'input') {
          node.indeterminate = value;
        } else if (key === 'className' || key === 'class') { // handle the class property
          node.setAttribute('class', serializeClass(value));
        } else if (key === 'style') { // handle the style property
          node.setAttribute('style', serializeStyle(value));
        } else {
          node.setAttribute(dasherize(key), value);
        }
      } else if (key === 'attributes') {
        // put direct attributes on the DOM node
        for (const attr in value) {
          node[attr] = value[attr];
        }
      }
    }
    // attach event on the current element
    attachEvents(element.props, node);
    // handle children of the element
    for (const childIdx in element.children) { // LOOP
      let child = element.children[childIdx];
      if (child && isFunction(child)) {
        child = child();
      }
      if (child || child === 0) {
        let childNode;
        if (child.__type) {
          // recursive call if a children is an element
          childNode = serializeElementToDOM(document, child, ctx);
        } else {
          // if it's a leaf, create a text node
          childNode = document.createTextNode(String(child));
        }
        if (childNode) {
          // append child to the paren node
          node.appendChild(childNode);
        }
      }
    }
    // if there is a ref property and it's a function, call it with the actual DOM node
    if (element.props.ref) {
      invariant(isFunction(element.props.ref), `The ref propety of <${element.name} ... /> must be a function`);
      element.props.ref(node);
    }
    return node;
  } else if (element.__type === 'function-node') {
    // if it's a functional element, call the function
    const funcElement = renderFunction(element, ctx, document);
    if (!funcElement) return null;
    // render it as actual DOM node
    const funcNode = serializeElementToDOM(document, funcElement, ctx);
    if (!funcNode) return null;
    // set the attribute to be able to locate the first DOM node of the subtree to allow replacement and redraw
    funcNode.setAttribute('data-fid', element.nodeId);
    return funcNode;
  }
}
