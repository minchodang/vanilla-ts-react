// utils/deepEqual.ts

/**
 * 두 값의 깊은 비교를 수행합니다.
 * @param a 첫 번째 값
 * @param b 두 번째 값
 * @param visited Map을 사용하여 순환 참조를 추적합니다.
 * @returns 두 값이 깊게 동일하면 true, 아니면 false
 */
export function deepEqual<T extends Record<string, unknown>>(
  a: T,
  b: T,
  visited = new Map<T, T>()
): boolean {
  // 동일한 참조
  if (a === b) return true;

  // 타입이 다르면 다름
  if (typeof a !== typeof b) return false;

  // Null 체크
  if (a === null || b === null) return a === b;

  // Date 객체 비교
  if (a instanceof Date && b instanceof Date) {
    return a.getTime() === b.getTime();
  }

  // RegExp 객체 비교
  if (a instanceof RegExp && b instanceof RegExp) {
    return a.toString() === b.toString();
  }

  // 배열 비교
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
      if (!deepEqual(a[i] as Record<string, unknown>, b[i] as Record<string, unknown>, visited))
        return false;
    }
    return true;
  }

  // 객체 비교
  if (typeof a === 'object' && typeof b === 'object') {
    // 순환 참조 체크
    if (visited.has(a)) {
      return visited.get(a) === b;
    }
    visited.set(a, b);

    const keysA = Object.keys(a);
    const keysB = Object.keys(b);

    // 키의 개수가 다르면 다름
    if (keysA.length !== keysB.length) return false;

    // 모든 키에 대해 값이 동일한지 확인
    for (const key of keysA) {
      if (!keysB.includes(key)) return false;
      if (!deepEqual(a[key] as Record<string, unknown>, b[key] as Record<string, unknown>, visited))
        return false;
    }

    return true;
  }

  // 기본 타입 (number, string, boolean 등)
  return false;
}
