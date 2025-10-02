import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import KanbanBoard from './views/KanbanBoard.vue'
import './style.css'

// Create router
const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/proyecto/:proyectoId/kanban',
      name: 'KanbanBoard',
      component: KanbanBoard,
      props: route => ({ proyectoId: Number(route.params.proyectoId) })
    },
    {
      path: '/',
      redirect: '/proyecto/1/kanban'
    }
  ]
})

// Create and mount app
const app = createApp(App)
app.use(router)
app.mount('#app')
