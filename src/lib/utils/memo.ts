import { getCurrentInstance } from '../utils/component';
import { shallowEqual } from './dom';

type MemoizedComponent<P> = (props: P) => string; // 렌더링 결과를 문자열로 반환한다고 가정
type ArePropsEqual<P> = (prevProps: P, nextProps: P) => boolean;

export const memo = <P extends Record<string, unknown>>(
  component: MemoizedComponent<P>,
  arePropsEqual: ArePropsEqual<P> = shallowEqual
): MemoizedComponent<P> => {
  let lastProps: P | null = null;
  let lastResult: string | null = null;

  return (props: P) => {
    const instance = getCurrentInstance();

    // 내부 상태 변경 시 강제 재렌더링
    if (instance.forceUpdate) {
      return component(props);
    }

    // Props 비교 및 캐시된 결과 반환
    if (lastProps !== null && arePropsEqual(lastProps, props)) {
      return lastResult as string;
    }

    // Props가 변경되었거나 새 렌더링이 필요할 경우
    lastProps = props;
    lastResult = component(props);
    return lastResult;
  };
};
