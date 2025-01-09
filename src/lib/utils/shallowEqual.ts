export const shallowEqual = <T>(objA: T, objB: T): boolean => {
  // 원시값 비교
  if (Object.is(objA, objB)) {
    return true; // 값이 같거나 동일한 참조
  }

  // 둘 중 하나가 객체가 아니면 false
  if (typeof objA !== 'object' || objA === null || typeof objB !== 'object' || objB === null) {
    return false; // 원시값이 다르거나 하나가 null/undefined면 false
  }

  // 객체 비교
  const keysA = Object.keys(objA);
  const keysB = Object.keys(objB);

  if (keysA.length !== keysB.length) {
    return false; // 키 개수가 다르면 false
  }

  for (let key of keysA) {
    if (!Object.prototype.hasOwnProperty.call(objB, key)) {
      return false; // objB에 없는 키가 있으면 false
    }
    if (!Object.is((objA as any)[key], (objB as any)[key])) {
      return false; // 키 값이 다르면 false
    }
  }

  return true; // 모든 조건을 만족하면 true
};
