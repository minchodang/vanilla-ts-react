import { useState } from '@/lib/dom/render';

const HomePage = () => {
  const [count, setCount] = useState(0);

  console.log(count, '카운트가 왜 찍히나!');

  const abc = () => {
    setCount(1);
  };

  return (
    <div>
      <h2>HomePage</h2>
      <div
        onclick={(e) => {
          setCount(1);
        }}
      >
        {count}
      </div>
      {/* <BlogPage /> */}
      &nbsp;&nbsp;
      <a href="/blog">go blog</a>
    </div>
  );
};

export default HomePage;
