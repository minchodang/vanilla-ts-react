import { getCurrentInstance } from '../utils/component';
import { shallowEqual } from '../utils/shallowEquals';

// EffectHook 타입 정의
type EffectHook = {
  callback: () => void | (() => void);
  dependencies: any[];
  cleanup?: () => void;
};

// 효과 큐: 렌더링 후 실행할 효과를 저장
const effectQueue: (() => void)[] = [];

// useEffect 훅 구현
export const useEffect = (callback: () => void | (() => void), dependencies: any[] = []): void => {
  const instance = getCurrentInstance();

  const hookIndex = instance.hookIndex++;
  const prevEffect: EffectHook | undefined = instance.hooks[hookIndex] as EffectHook | undefined;

  let hasChanged = true;
  if (prevEffect) {
    if (dependencies.length > 0) {
      hasChanged = dependencies.some((dep, i) => !shallowEqual(dep, prevEffect.dependencies[i]));
    } else {
      hasChanged = false;
    }
  }

  if (hasChanged) {
    // 이전 클린업 함수 실행
    if (prevEffect?.cleanup) {
      prevEffect.cleanup();
    }

    // 새로운 효과를 큐에 추가
    effectQueue.push(() => {
      const cleanup = callback();
      instance.hooks[hookIndex] = { callback, dependencies, cleanup };
    });

    // 새로운 EffectHook 등록 (클린업 함수는 아직 없음)
    instance.hooks[hookIndex] = { callback, dependencies };
  } else {
    // 의존성이 변경되지 않았으므로 이전 효과 유지
    instance.hooks[hookIndex] = prevEffect;
  }
};

// 효과 큐 실행 함수
export const runEffects = () => {
  while (effectQueue.length > 0) {
    const effect = effectQueue.shift();
    if (effect) effect();
  }
};
