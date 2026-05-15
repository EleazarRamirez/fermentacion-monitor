<template>
  <div id="app">
    <!-- NAVBAR -->
    <nav class="navbar">
      <RouterLink to="/" class="brand-link">
        🍺 <span>Monitor de Fermentación</span>
      </RouterLink>

      <div class="nav-links">
        <label @click="Lotes" class="nav-link">Lotes</label>

        <!-- NO autenticado -->
        <template v-if="!isAuthenticated">
          <RouterLink to="/login" class="nav-link nav-link--cta">
            Iniciar sesión
          </RouterLink>
        </template>

        <!-- Autenticado -->
        <template v-else>
          <RouterLink to="/dashboard" class="nav-link">Dashboard</RouterLink>
          <span class="nav-user">{{ user?.name }}</span>
          <button class="nav-link logout" @click="handleLogout">
            Cerrar sesión
          </button>
        </template>
      </div>
    </nav>

    <!-- CONTENIDO -->
    <main class="main">
      <RouterView v-slot="{ Component }">
        <Transition name="fade" mode="out-in">
          <component :is="Component" />
        </Transition>
      </RouterView>
    </main>
  </div>
</template>

<script setup>
import { RouterLink, RouterView, useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'

const router = useRouter()
const { isAuthenticated, user, logout } = useAuth()

async function handleLogout() {
  await logout()
  router.push('/login')
}

async function Lotes() {

  router.push('/fermentacion')
}






</script>

<style>
body {
  font-family: system-ui, sans-serif;
  /* background: #0d0d0f; */
  background: #4e6d6e;
  color: #000000;
}
</style>

<style scoped>
.navbar {
  display: flex;
  justify-content: space-between;
  padding: 1rem 2rem;
  background: #1a1208;
  color: #f0a830;
}

.brand-link {
  text-decoration: none;
  font-weight: bold;
  color: #f0a830;
}

.nav-links {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.nav-link {
  text-decoration: none;
  color: #f0e6d0;
  font-size: 0.9rem;
}

.nav-link:hover {
  color: #f0a830;
}

.nav-link--cta {
  background: #f0a830;
  color: #1a1208;
  padding: 0.3rem 0.8rem;
  border-radius: 5px;
}

.nav-user {
  color: #f0a830;
}

.logout {
  background: none;
  border: none;
  color: #ff6b6b;
  cursor: pointer;
}

.main {
  padding: 0;
}

/* transición */
.fade-enter-active,
.fade-leave-active {
  transition: 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>