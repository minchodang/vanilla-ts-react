import { getCurrentInstance } from '../utils/component';
import { shallowEqual } from './dom';

type MemoizedComponent<P> = (props: P) => string; // 렌더링 결과를 문자열로 반환한다고 가정
type ArePropsEqual<P> = (prevProps: P, nextProps: P) => boolean;

export const memo = <P extends Record<string, unknown>>(
  component: MemoizedComponent<P>,
  arePropsEqual: ArePropsEqual<P> = shallowEqual
): MemoizedComponent<P> => {
  const memoizedComponent: MemoizedComponent<P> = (props: P) => {
    const instance = getCurrentInstance();

    // 내부 상태 변경 시 강제 재렌더링
    if (instance.forceUpdate) {
      instance.forceUpdate = false; // 렌더링 후 초기화
      instance.lastProps = props;
      instance.lastResult = component(props);
      return instance.lastResult;
    }

    // Props 비교 및 캐시된 결과 반환
    if (instance.lastProps && arePropsEqual(instance.lastProps as P, props)) {
      return instance.lastResult as string;
    }

    // Props가 변경되었거나 새 렌더링이 필요할 경우
    instance.lastProps = props;
    instance.lastResult = component(props);
    return instance.lastResult;
  };

  // 메모이제이션 플래그 추가
  (memoizedComponent as any).isMemoized = true;
  return memoizedComponent;
};
