import { serializeElementToDOM } from './dom';
import { invariant, isArray } from './utils';

/**
 * Call a functional element with the corresponding context and return the element tree.
 *
 * @param el the VDOM element
 * @param ctx the current context of the tree
 * @param doc the DOM document on which the function will be rendered
 */
export function renderFunction(el, ctx, doc) {
  // compose the query selector to find the root node returned by the functional element
  const selector = `[data-fid="${el.nodeId}"]`;
  // the function to retrive the actual node from the DOM
  const getNode = () => doc.querySelector(selector);
  // try to find the last actual DOM node as parent (prevent issues with nested function tags)
  const oldNativeNode = ctx.path[ctx.path.length - 1];
  const replaceWith = (element, $id) => {
    const oldNode = getNode();
    // parent node is either last actual DOM node or current DOM node parent
    const parentNode = oldNativeNode || oldNode.parentNode;
    // render the new sub tree as actual DOM node
    const newNode = serializeElementToDOM(doc, element, ctx);
    if ($id) newNode.setAttribute('data-fid', $id);
    // replace the old tree by the new tree
    parentNode.replaceChild(newNode, oldNode || parentNode.firstChild); // firstChild because a function tag only returns one child
  };
  // the `myself`
  const myself = {
    id: el.nodeId, selector, getNode, replaceWith,
    redraw(props) {
      const newProps = { ...el.props, ...props };
      // render the current function again, with new props this time and replace the old tree with it
      replaceWith(renderFunction({ ...el, props: newProps }, ctx, doc), el.nodeId);
    },
  };
  // class the function that returns the element tree
  const tree = el.render({ ...el.props, children: el.children, redraw: ctx.redraw, myself, treeContext: ctx.context });
  invariant(!isArray(tree), 'A functional component cannot return an array ');
  return tree;
}
