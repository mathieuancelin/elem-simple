import { dasherize, isFunction, startsWith } from './utils';
import { serializeStyle } from './style';
import { serializeClass } from './class';

export function serializeElement(element) {
  if (element.__type === 'simple-node') {
    const node = [];
    const children = [];
    for (const key in element.props) { // LOOP
      const value = element.props[key];
      if (key !== 'ref' && key !== 'attributes' && !startsWith(key, 'on') && !isFunction(value)) {
        if (key === 'value' && element.name === 'input') {
          node.push(`value="${value}"`);
        } else if (key === 'indeterminate' && element.name === 'input') {
          node.push(`indeterminate="${value}"`);
        } else if (key === 'className' || key === 'class') {
          node.push(`class="${serializeClass(value)}"`);
        } else if (key === 'style') {
          node.push(`style="${serializeStyle(value)}"`);
        } else {
          node.push(`${dasherize(key)}="${value}"`);
        }
      } else if (key === 'attributes' && value.innerHTML) {
        children.push(value.innerHTML);
      }
    }
    for (const childIdx in element.children) { // LOOP
      let child = element.children[childIdx];
      if (child && isFunction(child)) {
        child = child();
      }
      if (child) {
        let childNode;
        if (child.__type) {
          childNode = serializeElement(child);
        } else {
          childNode = String(child);
        }
        children.push(childNode);
      }
    }
    return `<${element.name}${node.length > 0 ? ' ' : ''}${node.join(' ')}>${children.join('')}</${element.name}>`;
  } else {
    const funcElement = element.render({ ...element.props, children: element.children, redraw: () => ({}) });
    return serializeElement(funcElement);
  }
}
