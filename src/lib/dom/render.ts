import { Component, VDOM } from '@/lib/jsx/jsx-runtime';
import { updateElement } from './diff';
import { shallowEqual } from '../utils/shallowEqual';

interface IRenderInfo {
  $root: HTMLElement | null;
  component: null | Component;
  currentVDOM: VDOM | null;
}

interface IOptions {
  states: any[];
  stateHook: number;
}

const frameRunner = (callback: () => void) => {
  let requestId: ReturnType<typeof requestAnimationFrame>;
  return () => {
    requestId && cancelAnimationFrame(requestId);
    requestId = requestAnimationFrame(callback);
  };
};

const domRenderer = () => {
  const options: IOptions = {
    states: [],
    stateHook: 0,
  };
  const renderInfo: IRenderInfo = {
    $root: null,
    component: null,
    currentVDOM: null,
  };

  const resetOptions = () => {
    options.states = [];
    options.stateHook = 0;
  };

  const _render = frameRunner(() => {
    const { $root, currentVDOM, component } = renderInfo;
    if (!$root || !component) return;

    const newVDOM = component();
    updateElement($root, newVDOM, currentVDOM);
    options.stateHook = 0;
    renderInfo.currentVDOM = newVDOM;
  });

  const render = (root: HTMLElement, component: Component) => {
    resetOptions();
    renderInfo.$root = root;
    renderInfo.component = component;
    _render();
  };

  const useState = <T>(initialState?: T) => {
    const { stateHook: index, states } = options;
    const state = (states[index] ?? initialState) as T;
    const setState = (newState: T | ((prev: T) => T)) => {
      let resolvedState: T;

      if (typeof newState === 'function') {
        resolvedState = (newState as (prev: T) => T)(state);
      } else {
        resolvedState = newState;
      }

      if (shallowEqual(state, resolvedState)) return;
      states[index] = resolvedState;
      _render();
    };
    options.stateHook += 1;
    return [state, setState] as const;
  };

  return { useState, render };
};

export const { useState, render } = domRenderer();
