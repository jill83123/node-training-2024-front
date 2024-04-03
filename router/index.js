import { createRouter, createWebHashHistory } from 'vue-router';

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: () => import('../views/UserView.vue'),
      children: [
        {
          path: '',
          component: () => import('../views/PostsView.vue'),
        },
        {
          path: 'create-post',
          component: () => import('../views/CreatePost.vue'),
        },
      ],
    },
  ],
});

export default router;
