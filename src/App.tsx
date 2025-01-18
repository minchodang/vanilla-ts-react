import { useRef } from './lib/hooks/useRef';
import { useState } from './lib/hooks/useState';
import { memo } from './lib/utils/memo';
export const Counter = memo(({ count }: { count: number }) => {
  console.log('자식', count);
  const [string, setString] = useState('오');
  const abc = useRef(9);

  return (
    <div>
      <div>{string}</div>
      <button
        type="button"
        onclick={() => {
          setString('2');
        }}
      >
        sss
      </button>
    </div>
  );
});

export const App = () => {
  console.log('부모');
  const [count, setCount] = useState(0);
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
      <Counter count={count} />
    </div>
  );
};
