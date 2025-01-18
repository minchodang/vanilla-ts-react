import { DependencyList } from '@/lib/jsx/jsx-runtime';
import { useRef } from './useRef';

export function useMemo<T>(
  factory: () => T,
  deps: DependencyList,
  equals: (a: DependencyList, b: DependencyList) => boolean = (a, b) =>
    a.length === b.length && a.every((v, i) => v === b[i])
): T {
  // 이전 의존성 저장
  const previousDepsRef = useRef<DependencyList | null>(null);
  // 메모이제이션된 값 저장
  const memoizedValueRef = useRef<T | null>(null);

  // 의존성 변경 감지
  const dependenciesChanged = !previousDepsRef.current || !equals(previousDepsRef.current, deps);

  if (dependenciesChanged) {
    // 의존성이 변경되었을 경우 재계산
    memoizedValueRef.current = factory();
    previousDepsRef.current = deps;
  }

  return memoizedValueRef.current as T;
}
