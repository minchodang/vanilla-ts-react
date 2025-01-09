import { VNode } from '@/lib/jsx/jsx-runtime';
import { shallowEqual } from './shallowEqual';

export const deepEqualVDOM = (objA: VNode, objB: VNode): boolean => {
  // 둘 다 null 또는 undefined인 경우 동일
  if (objA == null && objB == null) return true;

  // 하나만 null/undefined인 경우 다름
  if (objA == null || objB == null) return false;

  // 문자열 또는 숫자인 경우 비교
  if (typeof objA === 'string' || typeof objA === 'number') {
    return objA === objB;
  }

  if (typeof objB === 'string' || typeof objB === 'number') {
    return false;
  }

  // objA와 objB가 모두 VDOM 객체인 경우
  if (objA.type !== objB.type) return false;

  if (!shallowEqual(objA.props, objB.props)) return false;

  const childrenA = objA.children || [];
  const childrenB = objB.children || [];
  if (childrenA.length !== childrenB.length) return false;

  for (let i = 0; i < childrenA.length; i++) {
    if (!deepEqualVDOM(childrenA[i], childrenB[i])) return false;
  }

  return true;
};
