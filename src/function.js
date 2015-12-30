import { serializeElementToDOM } from './dom';

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
  // the `myself`
  const myself = {
    id: el.nodeId,
    selector, getNode,
    redraw(props) {
      // render the current function again, with new props this time
      const elements = renderFunction({ ...el, props: props || el.props }, ctx, doc);
      const oldNode = getNode();
      // render the new sub tree as actual DOM node
      const newNode = serializeElementToDOM(doc, elements, ctx);
      // replace the old tree by the new tree
      oldNode.parentNode.replaceChild(newNode, oldNode);
    },
    replaceWith(element) {
      const oldNode = getNode();
      // render the new sub tree as actual DOM node
      const newNode = serializeElementToDOM(doc, element, ctx);
      // replace the old tree by the new tree
      oldNode.parentNode.replaceChild(newNode, oldNode);
    },
  };
  // class the function that returns the element tree
  return el.render({ ...el.props, children: el.children, redraw: ctx.redraw, myself, treeContext: ctx.context });
}
