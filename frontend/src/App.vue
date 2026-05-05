<template>
  <div class="app">
    <nav class="navbar">
      <span class="navbar-brand">🍺 Monitor de Fermentación</span>
      <router-link to="/">Lotes</router-link>
    </nav>
    <main class="contenido">
      <router-view />
    </main>
  </div>
</template>

<style>
* { box-sizing: border-box; margin: 0; padding: 0; }

body {
  font-family: system-ui, sans-serif;
  background: #f5f5f5;
  color: #1a1a1a;
}

.app { min-height: 100vh; display: flex; flex-direction: column; }

.navbar {
  background: #1a1208;
  color: #f0a830;
  padding: 0.75rem 1.5rem;
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.navbar-brand { font-weight: 600; font-size: 1.1rem; }

.navbar a {
  color: #f0e6d0;
  text-decoration: none;
  font-size: 0.9rem;
}

.navbar a:hover { color: #f0a830; }

.contenido { flex: 1; padding: 1.5rem; max-width: 1200px; margin: 0 auto; width: 100%; }
</style>