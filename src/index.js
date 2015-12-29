import { sid, isArray, isFunction, isString, escape, isUndefined, invariant, toArray } from './utils';
import { namespace } from './svg';
import { serializeElementToDOM } from './dom';
import { serializeElementToString } from './universal';

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
  if (!isFunction(func)) return serializeElementToString(func);
  return toArray(func({ children: [], myself: {}, redraw: {}, treeContext: {} }))
    .map(e => serializeElementToString(e)).join('');
}

/**
 * Render an element tree or a function that returns an element tree into a root node
 */
export function render(func, node, append = false) {
  // check the type of stuff to render and the place where you want to render it
  invariant(window.document, 'It seems it\'s not a browser environment here :(, you can\'t call `render`');
  invariant(isFunction(func) || isArray(func) || func.__type, 'You have to provide a function or an element to `render`');
  invariant(node instanceof HTMLElement, 'You have to provide an actual HTMLElement as root node');
  if (!isFunction(func)) return render(() => func, node);
  const nodeId = sid('root-');
  // the current DOM document
  const doc = window.document;
  // create the tree context
  const ctx = { context: {} };
  // create the function to be able to redraw the tree
  ctx.redraw = () => {
    let cleared = false;
    // call the function
    const tree = toArray(func({ children: [], myself: {}, redraw: ctx.redraw, treeContext: ctx.context }));
    // if not in append mode, clear the root node
    tree.forEach(item => {
      // render the sub tree as actual DOM node
      const domNode = serializeElementToDOM(doc, item, ctx);
      domNode.setAttribute('data-root', nodeId);
      if (!cleared && !append) {
        clearNode(node);
        cleared = true;
      }
      // append the tree to the root node
      node.appendChild(domNode);
    });
  };
  // launch the drawing
  ctx.redraw();
  return {
    // return the first DOM node of the component
    getNode: () => doc.querySelector(`[data-root="${nodeId}"]`),
    // trigger a redraw
    redraw: ctx.redraw,
    // cleanup everything
    cleanup: () => clearNode(node),
  };
}

export function Component(props) {
  invariant(this.render, 'Component instances must have a render method.');
  this.props = props;
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
  if (name.prototype && name.prototype instanceof Component) {
    return createElement((p) => new name(p).render(), props, ...children); // eslint-disable-line
  }
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

// aliases to stay compatible with other version of Elem
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
