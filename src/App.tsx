import { useState } from './state';
export const Counter = () => {
  console.log('자식');
  const [count, setCount] = useState('오');
  console.log(`Counter count: ${count} (${typeof count})`); // 상태 타입 확인

  return (
    <div>
      <div>{count}</div>
      <button onclick={() => setCount('안녕')}>sss</button>
    </div>
  );
};

export const App = () => {
  console.log('부모');
  const [count, setCount] = useState(0);
  console.log(`Counter count: ${count} (${typeof count})`); // 상태 타입 확인
  return (
    <div>
      <button onClick={() => setCount((prev) => (prev += 1))}>{count}</button>
      <span>{count}</span>
      <h1>Vanilla React</h1>
      <Counter />
    </div>
  );
};
