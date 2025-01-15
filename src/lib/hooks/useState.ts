import { getCurrentInstance } from '../utils/component';

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
