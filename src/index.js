import { sid, isFunction, escape, isUndefined } from './utils';
import { namespace } from './svg';
import { renderToDOM } from './domrenderer';
import { serializeElement } from './stringrenderer';

function clearNode(node) {
  while (!isUndefined(node) && node !== null && node.firstChild) {
    node.removeChild(node.firstChild);
  }
}

export function renderToString(func) {
  if (isFunction(func)) {
    return serializeElement(func({ children: [], myself: {}, redraw: {}, context: {} }));
  }
  return serializeElement(func);
}

export function render(func, node, append = false) {
  const nodeId = sid('root-');
  if (!isFunction(func)) {
    return render(() => func, node);
  }
  const ctx = { context: {} };
  ctx.redraw = () => {
    const tree = func({ children: [], myself: {}, redraw: ctx.redraw, context: ctx.context });
    const domNode = renderToDOM(window.document, tree, ctx);
    if (!append) {
      clearNode(node);
    }
    domNode.setAttribute('data-rootid', nodeId);
    node.appendChild(domNode);
  };
  ctx.redraw();
  return {
    getNode: () => document.querySelector(`[data-rootid="${nodeId}"]`),
    redraw: ctx.redraw,
    cleanup: () => clearNode(node),
  };
}

/**
 * JSX factory function to create DOM VNode. Designed to be used with a JX
 * transpiler.
 * @param name : the name of the tag, or a function that return DOM VNode. Not optional
 * @param props : properties of the node, a plain old JS object. Not optional, if no value, put null
 * @param children : the children of the node, a vararg
 */
export function createElement(name, props, ...children) {
  const nodeId = sid('node-');
  if (isFunction(name)) {
    return {
      __type: 'function-node', nodeId, render: name, props: props || {},
      children: [].concat.apply([], children),
    };
  }
  return {
    __type: 'simple-node',
    nodeId, name: escape(name.toLowerCase()), props: props || {},
    children: [].concat.apply([], children), namespace: namespace(name),
  };
}

// a simple method alias to stay compatible with other version of Elem
export const jsx = createElement;

/**
 * a simple function that return `what` if the predicate `p` is true
 */
export function predicate(p, what) {
  if (isFunction(p)) { // if it's a function, call it
    return !!p() ? what : undefined;
  } else {
    return !!p ? what : undefined;
  }
}
