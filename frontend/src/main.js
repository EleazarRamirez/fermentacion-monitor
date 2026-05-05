import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import Dashboard from './views/Dashboard.vue'
import Fermentaciones from './views/Fermentaciones.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/',               component: Fermentaciones },
    { path: '/lote/:id',       component: Dashboard }
  ]
})

createApp(App).use(router).mount('#app')