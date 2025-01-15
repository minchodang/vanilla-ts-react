import { useRef } from './lib/hooks/useRef';
import { useState } from './lib/hooks/useState';
export const Counter = () => {
  console.log('자식');
  const [count, setCount] = useState('오');
  const abc = useRef(9);

  return (
    <div>
      <div>{count}</div>
      <button
        onclick={() => {
          setCount('2');
        }}
      >
        sss
      </button>
    </div>
  );
};

export const App = () => {
  console.log('부모');
  const [count, setCount] = useState(0);
  return (
    <div>
      <button onClick={() => setCount((prev) => (prev += 1))}>{count}</button>
      <span>{count}</span>
      <h1>Vanilla React</h1>
      <Counter />
    </div>
  );
};
