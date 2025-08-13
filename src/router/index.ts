import { createRouter, createWebHistory } from 'vue-router';

import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  // { path: '/', component: ... }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;