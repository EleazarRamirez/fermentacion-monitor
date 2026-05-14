// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import { useAuth } from '@/composables/useAuth'


// Lazy imports
const HomeView        = () => import('@/views/HomeView.vue')
const LoginView       = () => import('@/views/LoginView.vue')
const NotFoundView    = () => import('@/views/NotFoundView.vue')
const RegisterView    = () => import('@/views/RegisterView.vue')
const Forgotpassword  = () => import('@/views/Forgotpassword.vue')
const Updatepassword  = () => import('@/views/Resetpassword.vue')
const Fermentacion    = () => import('@/views/Fermentacion.vue')

// 👇 NUEVO
const LoteDetalle     = () => import('@/views/Dashboard.vue')

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
    meta: { title: 'Inicio',requiresAuth: false, },
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
    meta: { title: 'Fermentaciones', requiresAuth:true },
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
    meta: { title: 'Restablecer contraseña', 
       requiresAuth: false,
      guestOnly: true,
     },
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
  // Restaura el scroll al tope al cambiar de página
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition
    return { top: 0, behavior: 'smooth' }
  },
})

// ─────────────────────────────────────────
//  NAVIGATION GUARD — el corazón del sistema
// ─────────────────────────────────────────
router.beforeEach((to, from) => {
  const { isAuthenticated } = useAuth()

  // 1. Actualiza el <title> del documento
  document.title = `${to.meta.title ?? 'App'} | VueAuth`

  // 2. Ruta protegida + usuario NO autenticado → redirige a /login
  if (to.meta.requiresAuth && !isAuthenticated.value) {
    return {
      name: 'login',
      query: { redirect: to.fullPath }, // guarda la ruta destino
    }
  }

  // 3. Ruta guestOnly + usuario YA autenticado → redirige a /dashboard
  if (to.meta.guestOnly && isAuthenticated.value) {
    return { name: 'dashboard' }
  }

  // 4. Todo bien, permite la navegación
  return true
})

export default router