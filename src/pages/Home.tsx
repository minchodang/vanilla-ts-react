import { useState } from '@/lib/dom/render';
import BlogPage from './Blog';

const HomePage = () => {
  const [a, b] = useState(0);
  return (
    <div>
      <button onclick={() => b((prev) => (prev += 1))}>{a}</button>
      <h2>HomePage</h2>
      {/* <a href="/blog">go blog</a> */}
      <BlogPage title={''} count={0} />
    </div>
  );
};

export default HomePage;
