import { getCurrentInstance } from '@/lib/utils/component';

export const useRef = <T>(initialValue: T): { current: T } => {
  const instance = getCurrentInstance();

  const stateIndex = instance.hookIndex++;
  if (instance.hooks[stateIndex] === undefined) {
    instance.hooks[stateIndex] = { current: initialValue };
  }

  return instance.hooks[stateIndex] as { current: T };
};
