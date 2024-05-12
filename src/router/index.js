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
    {
      path: '/sign',
      component: () => import('../views/SignView.vue'),
      children: [
        {
          path: 'up',
          component: () => import('../views/SignUp.vue'),
        },
        {
          path: 'in',
          component: () => import('../views/SignIn.vue'),
        },
      ],
    },
  ],
});

export default router;
