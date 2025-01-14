import { useState } from './state';
export const Counter = () => {
  const [count, setCount] = useState('오');

  return (
    <div>
      <div>{count}</div>
      <button onclick={() => setCount('안녕')}>sss</button>
    </div>
  );
};

export const App = () => {
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
