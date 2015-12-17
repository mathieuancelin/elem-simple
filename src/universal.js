import { dasherize, isFunction, startsWith } from './utils';
import { serializeStyle } from './style';
import { serializeClass } from './class';

/**
 * Serialize an element tree into an HTML string
 *
 * @param element the element tree
 */
export function serializeElementToString(element) {
  // if it's a simple element, eg an HTML element
  if (element.__type === 'simple-node') {
    const node = [];
    const children = [];
    // for each property, add it to the property array
    for (const key in element.props) { // LOOP
      const value = element.props[key];
      if (key !== 'ref' && key !== 'attributes' && !startsWith(key, 'on') && !isFunction(value)) {
        if (key === 'value' && element.name === 'input') {
          node.push(`value="${value}"`);
        } else if (key === 'indeterminate' && element.name === 'input') {
          node.push(`indeterminate="${value}"`);
        } else if (key === 'className' || key === 'class') { // handle the case for the class property
          node.push(`class="${serializeClass(value)}"`);
        } else if (key === 'style') {
          node.push(`style="${serializeStyle(value)}"`); // handle the case for the style property
        } else {
          node.push(`${dasherize(key)}="${value}"`);
        }
      } else if (key === 'attributes' && value.innerHTML) { // if innerHTML is specified, att it directly
        children.push(value.innerHTML);
      }
    }
    // handle children of the element
    for (const childIdx in element.children) { // LOOP
      let child = element.children[childIdx];
      if (child && isFunction(child)) {
        child = child();
      }
      if (child) {
        let childNode;
        if (child.__type) {
          // if it's an element, recursive call to serialize it
          childNode = serializeElementToString(child);
        } else {
          childNode = String(child);
        }
        children.push(childNode);
      }
    }
    // compose the HTML
    return `<${element.name}${node.length > 0 ? ' ' : ''}${node.join(' ')}>${children.join('')}</${element.name}>`;
  } else {
    // else if it's a functional element, eg a function, call the function
    const funcElement = element.render({ ...element.props, children: element.children, treeContext: {}, redraw: () => ({}) });
    // and serialize the sub tree to string
    return serializeElementToString(funcElement);
  }
}
