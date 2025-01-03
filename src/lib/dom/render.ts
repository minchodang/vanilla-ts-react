import { Component, VDOM } from '@/lib/jsx/jsx-runtime';
import { updateElement } from './diff';

interface IRenderInfo {
  $root: HTMLElement | null;
  component: Component | null;
  currentVDOM: VDOM | null;
}
const domRender = () => {
  const renderInfo: IRenderInfo = {
    $root: null,
    component: null,
    currentVDOM: null,
  };
  const _render = () => {
    const { $root, component, currentVDOM } = renderInfo;
    if (!$root || !component) return;
    const newVDOM = component();
    updateElement($root, newVDOM, currentVDOM);
    renderInfo.currentVDOM = newVDOM;
  };
  const render = (root: HTMLElement, component: Component) => {
    renderInfo.$root = root;
    renderInfo.component = component;
    _render();
  };

  return { render };
};

export const { render } = domRender();
