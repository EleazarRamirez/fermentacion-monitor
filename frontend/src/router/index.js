// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import { useAuth } from '@/composables/useAuth'

// Lazy imports
const HomeView        = () => import('@/views/HomeView.vue')
const LoginView       = () => import('@/views/LoginView.vue')
const DashboardView   = () => import('@/views/DashboardView.vue')
const NotFoundView    = () => import('@/views/NotFoundView.vue')
const RegisterView    = () => import('@/views/RegisterView.vue')
const Forgotpassword  = () => import('@/views/Forgotpassword.vue')
const Updatepassword  = () => import('@/views/Resetpassword.vue')
const Fermentacion    = () => import('@/views/Fermentacion.vue')
const Fermentaciones  = () => import('@/views/Fermentaciones.vue')

// 👇 NUEVO
const LoteDetalle     = () => import('@/views/Dashboard.vue')

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
    meta: { title: 'Inicio', requiresAuth: false },
  },

  // {
  //   path: '/fermentaciones',
  //   name: 'fermentaciones',
  //   component: Fermentaciones,
  //   meta: { title: 'Fermentaciones', requiresAuth: false },
  // },

  // 🔥 RUTA DINÁMICA (AQUÍ ESTÁ LA CLAVE)
  {
    path: '/lote/:id',
    name: 'lote-detalle',
    component: LoteDetalle,
    meta: { title: 'Dashboard de lote', requiresAuth:true },
  },

  {
    path: '/fermentacion',
    name: 'fermentacion',
    component: Fermentacion,
    meta: { title: 'cosa', requiresAuth:true },
  },

  {
    path: '/login',
    name: 'login',
    component: LoginView,
    meta: {
      title: 'Iniciar sesión',
      requiresAuth: false,
      guestOnly: true,
    },
  },

  {
    path: '/register',
    name: 'register',
    component: RegisterView,
    meta: {
      title: 'Registro',
      requiresAuth: false,
      guestOnly: true,
    },
  },

  {
    path: '/reset-password',
    name: 'reset-password',
    component: Updatepassword,
    meta: { title: 'Restablecer contraseña', requiresAuth: false },
  },

  {
    path: '/forgot-password',
    name: 'forgot-password', // ⚠️ corregido (tenías duplicado)
    component: Forgotpassword,
    meta: { title: 'Recuperar contraseña' },
  },

  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: NotFoundView,
    meta: { title: 'Página no encontrada' },
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition
    return { top: 0, behavior: 'smooth' }
  },
})

router.beforeEach((to) => {
  const { isAuthenticated } = useAuth()

  document.title = `${to.meta.title ?? 'App'} | VueAuth`

  if (to.meta.requiresAuth && !isAuthenticated.value) {
    return {
      name: 'login',
      query: { redirect: to.fullPath },
    }
  }

  if (to.meta.guestOnly && isAuthenticated.value) {
    return { name: 'home' } // 🔥 corregido (antes mandabas a dashboard que no existe)
  }

  return true
})

export default router