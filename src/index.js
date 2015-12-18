import { sid, isArray, isFunction, isString, escape, isUndefined, invariant } from './utils';
import { namespace } from './svg';
import { serializeElementToDOM } from './dom';
import { serializeElementToString } from './universal';

const arrToElement = (arr) => isArray(arr) ? createElement('div', null, arr) : arr; // eslint-disable-line

/**
 * Clear children of a DOM node
 */
function clearNode(node) {
  // while the node has children
  while (!isUndefined(node) && node !== null && node.firstChild) {
    // remove the first one
    node.removeChild(node.firstChild);
  }
}

/**
 * Render an element tree or a function that returns an element tree into an HTML string
 */
export function renderToString(func) {
  // check if param is a function or an element
  invariant(isFunction(func) || isArray(func) || func.__type, 'You have to provide a function or an element to `renderToString`');
  if (isFunction(func)) {
    return serializeElementToString(arrToElement(func({ children: [], myself: {}, redraw: {}, treeContext: {} })));
  }
  return serializeElementToString(func);
}

/**
 * Render an element tree or a function that returns an element tree into a root node
 */
export function render(func, node, append = false) {
  // check the type of stuff to render and the place where you want to render it
  invariant(isFunction(func) || isArray(func) || func.__type, 'You have to provide a function or an element to `render`');
  invariant(node instanceof HTMLElement, 'You have to provide an actual HTMLElement as root node');
  const nodeId = sid('root-');
  if (!isFunction(func)) {
    return render(() => func, node);
  }
  // create the tree context
  const ctx = { context: {} };
  // create the function to be able to redraw the tree
  ctx.redraw = () => {
    // call the function
    const tree = arrToElement(func({ children: [], myself: {}, redraw: ctx.redraw, treeContext: ctx.context }));
    // render the sub tree as actual DOM node
    const domNode = serializeElementToDOM(window.document, tree, ctx);
    // if not in append mode, clear the root node
    if (!append) {
      clearNode(node);
    }
    domNode.setAttribute('data-root', nodeId);
    // append the tree to the root node
    node.appendChild(domNode);
  };
  // launch the drawing
  ctx.redraw();
  return {
    // return the first DOM node of the component
    getNode: () => document.querySelector(`[data-root="${nodeId}"]`),
    // trigger a redraw
    redraw: ctx.redraw,
    // cleanup everything
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
  // check if name is a function or a string
  invariant(isFunction(name) || isString(name), 'You have to provide a function or a string as name');
  const nodeId = sid('node-');
  // create the element instance according to name type
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
