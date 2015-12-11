import { renderToDOM } from './renderers';

export function renderFunction(el, ctx, document) {
  const selector = '[data-funccallid="' + el.nodeId + '"]';
  const getNode = () => document.querySelector(selector);
  const myself = {
    id: el.nodeId,
    selector: selector,
    getNode: getNode,
    redraw(element) {
      const oldNode = getNode();
      const parentNode = oldNode.parentNode;
      const newNode = renderToDOM(document, element, ctx);
      parentNode.replaceChild(newNode, oldNode);
    },
  };
  return el.render({ ...el.props, children: el.children, redraw: ctx.redraw, myself });
}
