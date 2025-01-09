import { Component, VDOM } from '@/lib/jsx/jsx-runtime';
import { updateElement } from './diff';
import { shallowEqual } from '../utils/shallowEqual';
import { deepEqualVDOM } from '../utils/deepEqual';

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
    // 만약 아직 states[index]에 아무 값도 없다면, 초기값을 세팅
    if (states[index] === undefined) {
      states[index] = initialState;
    }

    const state = states[index] as T;
    const setState = (newState: T | ((prev: T) => T)) => {
      const resolvedState =
        typeof newState === 'function' ? (newState as (prev: T) => T)(state) : newState;

      console.log(
        'State comparison:',
        shallowEqual(state, resolvedState),
        'Current state:',
        state,
        'New state:',
        resolvedState
      );

      // 이전 상태와 동일하면 렌더링 스킵
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
