import { getCurrentInstance } from '../utils/component';

// useState 개선
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

      // 내부 상태 변경 시 강제 재렌더링 트리거
      instance.forceUpdate = true;
      instance.rerender();
    }
  };

  return [instance.hooks[stateIndex] as T, setState];
};
