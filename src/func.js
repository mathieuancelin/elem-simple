import { renderToDOM } from './domrenderer';

export function renderFunction(el, ctx, document) {
  const selector = '[data-funccallid="' + el.nodeId + '"]';
  const getNode = () => document.querySelector(selector);
  const myself = {
    id: el.nodeId,
    selector, getNode,
    redraw(props) {
      return renderFunction({ ...el, props: props || el.props }, ctx, document);
    },
    replaceWith(element) {
      const oldNode = getNode();
      const parentNode = oldNode.parentNode;
      const newNode = renderToDOM(document, element, ctx);
      parentNode.replaceChild(newNode, oldNode);
    },
  };
  return el.render({ ...el.props, children: el.children, redraw: ctx.redraw, myself, context: ctx.context });
}
