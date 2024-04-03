import { createRouter, createWebHashHistory } from 'vue-router';

const router = createRouter({
  history: createWebHashHistory(),
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
