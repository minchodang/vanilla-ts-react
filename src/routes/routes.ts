import BlogPage from '@/pages/Blog';
import HomePage from '@/pages/Home';
import { NotFoundPage } from '@/pages/NotFoundPage';
import PostPage from '@/pages/Post';

export const routes = [
  {
    path: '/',
    element: HomePage,
    errorElement: NotFoundPage,
    children: [
      {
        path: 'blog',
        element: BlogPage,
      },
      {
        path: 'post',
        children: [
          {
            path: ':id',
            element: PostPage,
          },
        ],
      },
    ],
  },
];
