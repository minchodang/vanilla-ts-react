import { history } from '@/lib/router/router';

const PostPage = () => {
  const params = history.getPageParams();
  return (
    <div>
      <h2>PostPage {params}</h2>
      <a href="/">go home</a>
      &nbsp;&nbsp;
      <a href="/blog">go blog</a>
    </div>
  );
};

export default PostPage;
