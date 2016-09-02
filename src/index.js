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
export function renderToString(tree) {
  // check if param is a function or an element
  invariant(isArray(tree) || tree.__type, 'You have to provide a function or an element to `renderToString`');
  return toArray(tree).map(e => serializeElementToString(e)).join('');
}

/**
 * Render an element tree or a function that returns an element tree into a root node
 */
export function render(tree, node, append = false) {
  // check the type of stuff to render and the place where you want to render it
  invariant(window.document, 'It seems it\'s not a browser environment here :(, you can\'t call `render`');
  invariant(isArray(tree) || tree.__type, 'You have to provide a function or an element to `render`');
  invariant(node instanceof window.HTMLElement, 'You have to provide an actual HTMLElement as root node');
  // if (!isFunction(func)) return render(() => func, node);
  const nodeId = sid('root-');
  // the current DOM document
  const doc = window.document;
  // create the tree context
  const ctx = { context: {}, path: [] };
  // create the function to be able to redraw the tree
  ctx.redraw = () => {
    let cleared = false;
    // if not in append mode, clear the root node
    toArray(tree).forEach(item => {
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

/**
 * A factory function to provide ES6 classes support
 */
export function Component(props) {
  invariant(this.render, 'Component instances must have a render method.');
  this.getDefaultProps = (this.getDefaultProps || (() => ({}))).bind(this);
  this.props = props.$$ipn ? { ...props, ...this.getDefaultProps() } : props;
  delete this.props.$$ipn;
}

/**
 * JSX factory function to create DOM VNode. Designed to be used with a JSX transpiler.
 * @param name : the name of the tag, or a function that return DOM VNode. Not optional
 * @param props : properties of the node, a plain old JS object. Not optional, if no value, put null
 * @param children : the children of the node, a vararg
 */
export function createElement(name, props, ...children) {
  // check if name is a function or a string
  invariant(isFunction(name) || isString(name), 'You have to provide a function or a string as first argument');
  // check if it's a Component sub-class
  if (name.prototype && name.prototype instanceof Component) {
    return createElement((p) => new name(p).render(p), props ? props : { $$ipn: true }, ...children); // eslint-disable-line
  }
  const nodeId = sid('node-');
  // create the element instance according to name type
  if (isFunction(name)) {
    return {
      __type: 'function-node', nodeId, render: name, props: props || {}, // eslint-disable-line
      children: [].concat.apply([], children), // eslint-disable-line
    };
  }
  return {
    __type: 'simple-node',
    nodeId, name: escape(name.toLowerCase()), props: props || {}, // eslint-disable-line
    children: [].concat.apply([], children), namespace: namespace(name), // eslint-disable-line
  };
}

/**
 * hyperscript compat. function
 */
export const h = createElement;
