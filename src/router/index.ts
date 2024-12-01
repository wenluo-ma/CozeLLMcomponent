import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';
const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/view/home.vue')
  }, {
    path: '/chat:id',
    name: 'Chat',
    component: () => import('@/view/chat.vue'),
    props: true
  }
];
const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
