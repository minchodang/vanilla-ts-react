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
  dependencies: any[];
  effectHook: number;
  effectList: Array<() => void>;
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
    dependencies: [],
    effectHook: 0,
    effectList: [],
  };
  const renderInfo: IRenderInfo = {
    $root: null,
    component: null,
    currentVDOM: null,
  };

  const resetOptions = () => {
    options.states = [];
    options.stateHook = 0;
    options.dependencies = [];
    options.effectList = [];
    options.effectHook = 0;
  };

  const _render = frameRunner(() => {
    const { $root, currentVDOM, component } = renderInfo;
    if (!$root || !component) return;

    const newVDOM = component();
    updateElement($root, newVDOM, currentVDOM);
    options.stateHook = 0;
    options.effectHook = 0;
    renderInfo.currentVDOM = newVDOM;
    options.effectList.forEach((effect) => effect());
    options.effectList = [];
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

  const useEffect = (callback: () => void, dependencies?: any[]) => {
    const index = options.effectHook;
    options.effectList[index] = () => {
      const hasNoDeps = !dependencies;
      const prevDeps = options.dependencies[index];

      const hasChangedDeps = prevDeps
        ? dependencies?.some((deps, i) => !shallowEqual(deps, prevDeps[i]))
        : true;

      if (hasNoDeps || hasChangedDeps) {
        callback();
        options.dependencies[index] = dependencies;
      }
    };
  };
  options.effectHook += 1;

  return { useState, render, useEffect };
};

export const { useState, render, useEffect } = domRenderer();
