import { createRouter, createWebHistory } from 'vue-router';

import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  { path: '/', component: () => import('../views/Home.vue') },
  { path: '/register', component: () => import('../views/Register.vue') },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;