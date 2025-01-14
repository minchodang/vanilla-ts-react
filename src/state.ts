import { ComponentInstance } from './component';

// 컴포넌트 상태 관리
let currentInstanceStack: ComponentInstance<any>[] = [];

export const setCurrentInstance = <P>(instance: ComponentInstance<P>): void => {
  currentInstanceStack.push(instance as ComponentInstance<any>);
};

export const clearCurrentInstance = (): void => {
  currentInstanceStack.pop();
};

export const getCurrentInstance = <P>(): ComponentInstance<P> => {
  const instance = currentInstanceStack[currentInstanceStack.length - 1];
  if (!instance) {
    throw new Error('No component instance found.');
  }
  return instance as ComponentInstance<P>;
};

// 상태 훅
export const useState = <T>(initialValue: T): [T, (newValue: T | ((prev: T) => T)) => void] => {
  const instance = getCurrentInstance();

  const stateIndex = instance.hookIndex++;
  if (instance.hooks[stateIndex] === undefined) {
    instance.hooks[stateIndex] = initialValue;
  }

  const setState = (newValue: T | ((prev: T) => T)) => {
    const currentState = instance.hooks[stateIndex] as T;
    const resolvedState =
      typeof newValue === 'function' ? (newValue as (prev: T) => T)(currentState) : newValue;

    if (resolvedState !== currentState) {
      instance.hooks[stateIndex] = resolvedState;
      instance.rerender();
    }
  };

  return [instance.hooks[stateIndex] as T, setState];
};
