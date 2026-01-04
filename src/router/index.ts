import { createRouter, createWebHistory } from 'vue-router';

import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  { path: '/', component: () => import('../views/Home.vue') },
  { path: '/register', component: () => import('../views/Register.vue') },
  { path: '/login', component: () => import('../views/Login.vue') },
  { path: '/recuperar', component: () => import('../views/Login.vue') }, // Ruta temporal para recuperar contraseña
  { path: '/privacidad', component: () => import('../views/Home.vue') }, // Ruta temporal para política de privacidad
  { path: '/terminos', component: () => import('../views/Home.vue') }, // Ruta temporal para términos y condiciones
  { path: '/perfil', component: () => import('../views/LaboratorioIN.vue'), meta: { requiresAuth: true } }, // Ruta temporal para perfil
  { path: '/configuracion', component: () => import('../views/LaboratorioIN.vue'), meta: { requiresAuth: true } }, // Ruta temporal para configuración
  {
    path: '/dashboard',
    component: () => import('../views/LaboratorioIN.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/laboratorio',
    component: () => import('../views/Laboratorio.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/proyecto/:id',
    name: 'ProjectDetail',
    component: () => import('../views/KanbanBoard.vue'),
    meta: { requiresAuth: true },
    props: true,
  },
  {
    path: '/search-results',
    name: 'SearchResults',
    component: () => import('../views/SearchResults.vue'),
    meta: { requiresAuth: true },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, _unused, next) => {
  const token = localStorage.getItem('access_token');
  if (to.meta.requiresAuth && !token) {
    next('/login');
  } else {
    next();
  }
});

export default router;