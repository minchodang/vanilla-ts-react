import { useCallback } from './lib/hooks/useCallback';
import { useEffect } from './lib/hooks/useEffect';
import { useMemo } from './lib/hooks/useMemo';
import { useRef } from './lib/hooks/useRef';
import { useState } from './lib/hooks/useState';
import { memo } from './lib/utils/memo';
export const Counter = memo(
  ({ count, handleClick }: { count: number; handleClick: VoidFunction }) => {
    const [string, setString] = useState('오');
    const abc = useRef(9);
    console.log('자식 재 렌더링?');

    const memoizedValue = useMemo(() => {
      console.log('2');
      return abc.current + count;
    }, [count]);

    return (
      <div>
        <div>{memoizedValue}</div>
        <button type="button" onclick={() => {}}>
          {string}
        </button>
      </div>
    );
  }
);

export const App = () => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    console.log(`useEffect: App mounted or count changed to ${count}`);

    // Cleanup 함수 반환
    return () => {
      console.log(`useEffect Cleanup: App unmounted or count changed from ${count}`);
    };
  }, [count]);
  const handleClick = useCallback(() => {
    console.log('useCallback: 버튼 클릭됨');
    setCount(2);
  }, []);

  return (
    <div>
      <button
        type="button"
        onClick={() =>
          setCount((prev) => {
            return prev + 1;
          })
        }
      >
        {count}
      </button>
      <span>{count}</span>
      <h1>Vanilla React</h1>
      <div>test {count}</div>
      <Counter count={0} handleClick={handleClick} />
    </div>
  );
};
