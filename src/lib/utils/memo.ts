type MemoizedFunction<T extends any[]> = (...args: T) => any;

const memo = <T extends any[]>(fn: MemoizedFunction<T>) => {
  let cache: Map<string, any> = new Map();

  return (...args: T) => {
    const key = JSON.stringify(args); // 인자를 문자열로 변환하여 캐시 키로 사용
    if (cache.has(key)) {
      return cache.get(key); // 캐시에서 결과 반환
    }

    const result = fn(...args); // 함수 실행
    cache.set(key, result); // 결과를 캐시에 저장
    return result;
  };
};

export default memo;
