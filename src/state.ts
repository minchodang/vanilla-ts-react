let currentInstanceStack: any[] = [];

export const setCurrentInstance = (instance: any) => {
  currentInstanceStack.push(instance);
};

export const clearCurrentInstance = () => {
  currentInstanceStack.pop();
};

export const getCurrentInstance = (): any => {
  return currentInstanceStack[currentInstanceStack.length - 1];
};

export const useState = <T>(initialValue: T): [T, (newValue: T | ((prev: T) => T)) => void] => {
  const instance = getCurrentInstance();

  if (!instance) {
    throw new Error('useState must be used inside a component.');
  }

  const stateIndex = instance.hookIndex++;
  if (instance.hooks[stateIndex] === undefined) {
    instance.hooks[stateIndex] = initialValue;
  }

  const setState = (newValue: T | ((prev: T) => T)) => {
    const currentState: T = instance.hooks[stateIndex];
    const resolvedState =
      typeof newValue === 'function' ? (newValue as (prev: T) => T)(currentState) : newValue;

    if (resolvedState !== currentState) {
      instance.hooks[stateIndex] = resolvedState;
      instance.rerender();
    }
  };

  return [instance.hooks[stateIndex], setState];
};
