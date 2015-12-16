import { serializeElementToDOM } from './dom';

/**
 * Call a functional element with the corresponding context and return the element tree.
 */
export function renderFunction(el, ctx, document) {
  const selector = '[data-fid="' + el.nodeId + '"]';
  const getNode = () => document.querySelector(selector);
  const myself = {
    id: el.nodeId,
    selector, getNode,
    redraw(props) {
      const elements = renderFunction({ ...el, props: props || el.props }, ctx, document);
      const oldNode = getNode();
      const newNode = serializeElementToDOM(document, elements, ctx);
      oldNode.parentNode.replaceChild(newNode, oldNode);
    },
    replaceWith(element) {
      const oldNode = getNode();
      const newNode = serializeElementToDOM(document, element, ctx);
      oldNode.parentNode.replaceChild(newNode, oldNode);
    },
  };
  return el.render({ ...el.props, children: el.children, redraw: ctx.redraw, myself, context: ctx.context });
}
