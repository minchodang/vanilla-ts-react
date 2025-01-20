/**
 * 두 객체의 얕은 비교를 수행합니다.
 * @param obj1 첫 번째 객체
 * @param obj2 두 번째 객체
 * @returns 두 객체가 얕게 동일하면 true, 아니면 false
 */
export const shallowEqual = <T extends Record<string, unknown>>(
  obj1: T | null | undefined,
  obj2: T | null | undefined
): boolean => {
  if (obj1 === obj2) return true;

  if (typeof obj1 !== 'object' || obj1 === null || typeof obj2 !== 'object' || obj2 === null) {
    return false;
  }

  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  // 키의 개수가 다르면 다름
  if (keys1.length !== keys2.length) return false;

  // 모든 키에 대해 값이 동일한지 확인
  for (const key of keys1) {
    if (obj1[key] !== obj2[key]) return false;
  }

  return true;
};
