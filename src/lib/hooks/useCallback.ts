import { getCurrentInstance } from '../utils/component';
import { shallowEqual } from '../utils/shallowEquals';

type UseCallbackType<T> = {
  callback: T;
  dependencies: readonly any[];
};

/**
 * useCallback 훅 구현
 * @param callback 메모이제이션할 콜백 함수
 * @param dependencies 의존성 배열
 * @returns 메모이제이션된 콜백 함수
 */
export const useCallback = <T extends (...args: any[]) => any>(
  callback: T,
  dependencies: readonly any[] = []
) => {
  const instance = getCurrentInstance();
  const hookIndex = instance.hookIndex++;
  const prevCallbackHook = instance.hooks[hookIndex] as UseCallbackType<T> | undefined;

  const hasChanged =
    !prevCallbackHook ||
    dependencies.length !== prevCallbackHook.dependencies.length ||
    !dependencies.every((dep, i) => shallowEqual(dep, prevCallbackHook.dependencies[i]));

  if (hasChanged) {
    instance.hooks[hookIndex] = { callback, dependencies };
    return callback;
  }
  return prevCallbackHook.callback;
};
