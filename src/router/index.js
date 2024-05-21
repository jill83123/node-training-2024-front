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
          component: () => import('../views/PostWall.vue'),
        },
        {
          path: 'post',
          component: () => import('../views/PostForm.vue'),
          children: [
            {
              path: 'create',
              component: () => import('../views/PostForm.vue'),
            },
            {
              path: 'edit/:postId',
              component: () => import('../views/PostForm.vue'),
            },
          ],
        },
        {
          path: 'user',
          children: [
            {
              path: 'edit',
              component: () => import('../views/EditUserData.vue'),
            },
          ],
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
