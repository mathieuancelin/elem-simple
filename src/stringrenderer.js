import { dasherize, isFunction, startsWith, classToArray } from './utils';
import { serializeStyle } from './style';

export function elementToString(element) {
  if (element.__type === 'simple-node') {
    const node = [`<${element.name}`];
    for (const key in element.props) {
      const value = element.props[key];
      if (!startsWith(key, 'on') && key !== 'ref' && !isFunction(value)) {
        if (key === 'innerHTML') {
          node.innerHTML = value;
        } else if (key === 'value' && element.name === 'input') {
          node.push(`value="${value}"`);
        } else if (key === 'indeterminate' && element.name === 'input') {
          node.push(`indeterminate="${value}"`);
        } else if (key === 'className' || key === 'class') {
          node.push(`class="${classToArray(value).join(' ')}"`);
        } else if (key === 'style') {
          node.push(`style="${serializeStyle(value)}" `);
        } else {
          node.push(`${dasherize(key)}="${value}"`);
        }
      }
    }
    node.push('>');
    for (const childIdx in element.children) {
      let child = element.children[childIdx];
      if (child && isFunction(child)) {
        child = child();
      }
      if (child) {
        let childNode;
        if (child.__type) {
          childNode = elementToString(child);
        } else {
          childNode = String(child);
        }
        node.push(childNode);
      }
    }
    node.push(`</${element.name}>`);
    return node.join(' ');
  } else {
    const funcElement = element.render({ ...element.props, children: element.children, redraw: () => ({}) });
    return elementToString(funcElement);
  }
}
