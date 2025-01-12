import { useState } from '@/lib/dom/render';
import withMemo from '@/lib/hoc/withMemo';

interface BlogPageProps {
  title: string;
  count: number;
}

const BlogPage = ({ title, count }: BlogPageProps) => {
  console.log(1);
  const [number, setNumber] = useState({ title, count });

  const handleButtonClick = () => {
    setNumber((prev) => ({ ...prev, count: prev.count + 1 }));
  };

  return (
    <div>
      <h2>BlogPage</h2>
      <span>{number.title}</span>
      <button onClick={handleButtonClick}>상태 업데이트</button>
    </div>
  );
};

export default withMemo(BlogPage);
