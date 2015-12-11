import { sid, isFunction, escape, isUndefined } from './utils';
import { namespace } from './svg';
import { renderToDOM, elementToString } from './renderers';

function clearNode(node) {
  while (!isUndefined(node) && !Object.is(node, null) && node.firstChild) {
    node.removeChild(node.firstChild);
  }
}

export function renderToString(func) {
  if (isFunction(func)) {
    return elementToString(func({ children: [], myself: {}, redraw: {} }));
  }
  return elementToString(func);
}

export function render(func, node, append = false) {
  if (!isFunction(func)) {
    return render(() => func, node);
  }
  const ctx = {};
  ctx.redraw = () => {
    const tree = func({ children: [], myself: {}, redraw: ctx.redraw });
    const domNode = renderToDOM(window.document, tree, ctx);
    if (!append) {
      clearNode(node);
    }
    node.appendChild(domNode);
  };
  ctx.redraw();
  return {
    redraw: ctx.redraw,
    cleanup: () => {
      clearNode(node);
    },
  };
}

export function createElement(name, props = {}, ...children) {
  const nodeId = sid('node-');
  if (isFunction(name)) {
    return {
      __type: 'function-node',
      nodeId,
      render: name,
      props: props || {},
      children: [].concat.apply([], children),
    };
  }
  return {
    __type: 'simple-node',
    nodeId,
    name: escape(name.toLowerCase()),
    props: props || {},
    children: [].concat.apply([], children),
    namespace: namespace(name),
  };
}
