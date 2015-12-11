import { dasherize, isFunction, startsWith, isString, isArray } from './utils';
import { attachEvents } from './eventhandlers';
import { renderFunction } from './func';
import { serializeStyle } from './style';

function classToArray(attrs) {
  if (!attrs) return [];
  if (isString(attrs)) return [attrs];
  if (isArray(attrs)) return attrs;
  const attrsArray = [];
  for (const key in attrs) {
    const value = attrs[key];
    if (value === true) {
      attrsArray.push(dasherize(key));
    }
  }
  return attrsArray;
}

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
        } else if (key === 'className' || key === 'class' ) {
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

export function renderToDOM(document, element, ctx) {
  if (element.__type === 'simple-node') {
    const node = element.namespace ?
      document.createElementNS(element.namespace, element.name) :
      document.createElement(element.name);
    for (const key in element.props) {
      const value = element.props[key];
      if (!startsWith(key, 'on') && key !== 'ref' && !isFunction(value)) {
        if (key === 'innerHTML') {
          node.innerHTML = value;
        } else if (key === 'value' && element.name === 'input') {
          node.value = value;
        } else if (key === 'indeterminate' && element.name === 'input') {
          node.indeterminate = value;
        } else if (key === 'className' || key === 'class' ) {
          node.setAttribute('class', classToArray(value).join(' '));
        } else if (key === 'style') {
          node.setAttribute('style', serializeStyle(value));
        } else if (key === 'ref') {
          // nop
        } else {
          node.setAttribute(dasherize(key), value);
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
