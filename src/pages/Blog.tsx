import { useState } from '@/lib/dom/render';

interface BlogPageProps {
  title: string;
  count: number;
}

const BlogPage = () => {
  console.log(1);
  const [number, setNumber] = useState<BlogPageProps>({
    title: 'BlogPage',
    count: 0,
  });

  const handleButtonClick = () => {
    setNumber((prev) => ({ ...prev, count: prev.count + 1 }));
  };

  return (
    <div>
      <h2>BlogPage</h2>
      <span>{number.title}</span>
      <button onclick={handleButtonClick}>상태 업데이트</button>
    </div>
  );
};

export default BlogPage;
