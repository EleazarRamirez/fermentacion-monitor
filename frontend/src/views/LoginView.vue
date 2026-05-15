<!-- src/views/LoginView.vue -->
<template>
  <div class="login-wrapper">
    <div class="bg-overlay" aria-hidden="true"></div>

    <!-- ── Panel izquierdo ── -->
    <div class="left-panel">
      <div class="brand">
        <img
          src="@/assets/logo_label.jpg"
          alt="Logo lúpulo"
          class="hop-icon-img"
        />

        <h1 class="brand-title">MONITOR DE<br>FERMENTACIÓN</h1>
        <span class="brand-subtitle">CERVECERA</span>

        <p class="brand-desc">
          Monitorea en tiempo real cada etapa<br>
          de tu fermentación y asegura<br>
          cervezas excepcionales.
        </p>

        <ul class="feature-list">
          <li class="feature-item">
            <span class="feature-icon feature-icon--temp">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z"/>
              </svg>
            </span>
            <div>
              <strong>Temperatura</strong>
              <span>Control precisa del mosto</span>
            </div>
          </li>
          <li class="feature-item">
            <span class="feature-icon feature-icon--co2">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="3"/>
                <circle cx="6" cy="8" r="2"/><circle cx="18" cy="8" r="2"/>
                <circle cx="6" cy="16" r="2"/><circle cx="18" cy="16" r="2"/>
              </svg>
            </span>
            <div>
              <strong>Actividad CO₂</strong>
              <span>Monitorea la fermentación</span>
            </div>
          </li>
          <li class="feature-item">
            <span class="feature-icon feature-icon--ph">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 2L8 8H4l4 4-2 6 6-3 6 3-2-6 4-4h-4z"/>
              </svg>
            </span>
            <div>
              <strong>pH del Mosto</strong>
              <span>Equilibrio y calidad asegurada</span>
            </div>
          </li>
        </ul>

        <div class="status-card">
          <div class="status-header">
            <span class="status-dot"></span>
            <span class="status-label">SISTEMA EN LÍNEA</span>
            <svg class="waveform" viewBox="0 0 120 36" fill="none">
              <polyline
                points="0,18 10,9 20,25 30,6 40,22 50,12 60,20 70,5 80,24 90,11 100,18 110,14 120,18"
                stroke="#22c55e" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <p>Conectado a 3 sensores</p>
          <p>Última lectura: hace 12 seg</p>
        </div>
      </div>
    </div>

    <!-- ── Panel derecho ── -->
    <div class="right-panel">
      <div class="login-card">

        <<div class="fermenter-wrap">
          <img
            src="@/assets/logo_login.jpg"
            alt="Logo Monitor de Fermentación"
            class="brand-logo-img"
          />
        </div>

        <h2 class="login-title">INICIAR SESIÓN</h2>
        <p class="login-subtitle">Accede a tu sistema de monitoreo</p>

        <Transition name="alert">
          <div v-if="errorMsg" class="alert-error" role="alert">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="15" height="15">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="12"/>
              <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            {{ errorMsg }}
          </div>
        </Transition>

        <form class="login-form" @submit.prevent="handleLogin" novalidate>

          <!-- Email -->
          <div class="field" :class="{ 'field--error': errors.email }">
            <div class="field-input-wrap">
              <svg class="field-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="2" y="4" width="20" height="16" rx="2"/>
                <polyline points="2,4 12,13 22,4"/>
              </svg>
              <input
                id="email"
                v-model.trim="form.email"
                type="email"
                class="field-input"
                placeholder="Correo electrónico"
                autocomplete="email"
                @blur="validateEmail"
              />
            </div>
            <span v-if="errors.email" class="field-error-msg">{{ errors.email }}</span>
          </div>

          <!-- Contraseña -->
          <div class="field" :class="{ 'field--error': errors.password }">
            <div class="field-input-wrap">
              <svg class="field-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
              <input
                id="password"
                v-model="form.password"
                :type="showPassword ? 'text' : 'password'"
                class="field-input"
                placeholder="Contraseña"
                autocomplete="current-password"
                @blur="validatePassword"
              />
              <button
                type="button"
                class="field-toggle"
                @click="showPassword = !showPassword"
                :aria-label="showPassword ? 'Ocultar contraseña' : 'Ver contraseña'"
              >
                <svg v-if="!showPassword" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                  <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                  <line x1="1" y1="1" x2="23" y2="23"/>
                </svg>
                <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                  <circle cx="12" cy="12" r="3"/>
                </svg>
              </button>
            </div>
            <span v-if="errors.password" class="field-error-msg">{{ errors.password }}</span>
          </div>

          <!-- Recordar sesión + Olvidé contraseña -->
          <div class="row-options">
            <label class="remember-label">
              <input type="checkbox" v-model="rememberSession" class="remember-check" />
              <span class="custom-check"></span>
              Recordar sesión
            </label>
            <a class="link-forgot" @click="gotoforgotpassword">¿Olvidaste tu contraseña?</a>
          </div>

          <!-- Botón submit -->
          <button type="submit" class="btn-submit" :disabled="isLoading">
            <span v-if="!isLoading" class="btn-inner">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="17" height="17">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
              Iniciar sesión
            </span>
            <span v-else class="spinner"></span>
          </button>

          <div class="divider"><span>O continúa con</span></div>

          <div class="social-row">
            <button type="button" class="social-btn" title="Google">
              <svg viewBox="0 0 24 24" width="20" height="20">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
            </button>
            <button type="button" class="social-btn" title="GitHub">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="white">
                <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
              </svg>
            </button>
            <button type="button" class="social-btn" title="Microsoft">
              <svg viewBox="0 0 24 24" width="20" height="20">
                <rect x="1"  y="1"  width="10" height="10" fill="#F25022"/>
                <rect x="13" y="1"  width="10" height="10" fill="#7FBA00"/>
                <rect x="1"  y="13" width="10" height="10" fill="#00A4EF"/>
                <rect x="13" y="13" width="10" height="10" fill="#FFB900"/>
              </svg>
            </button>
          </div>

          <p class="signup-row">
            ¿No tienes cuenta?
            <a class="link-register" @click="gotosingup">Solicita acceso</a>
          </p>

        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'

const router = useRouter()
const { login } = useAuth()

// ── Navegación ──
const gotosingup = () => router.push('/register')
const gotoforgotpassword = () => router.push('/forgot-password')

// ── Estado ──
const form = reactive({ email: '', password: '' })
const errors = reactive({ email: '', password: '' })
const showPassword = ref(false)
const rememberSession = ref(false)
const isLoading = ref(false)
const errorMsg = ref('')

// ── Validaciones ──
function validateEmail() {
  if (!form.email) {
    errors.email = 'El correo es obligatorio.'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = 'Ingresa un correo válido.'
  } else {
    errors.email = ''
  }
}

function validatePassword() {
  if (!form.password) {
    errors.password = 'La contraseña es obligatoria.'
  } else if (form.password.length < 6) {
    errors.password = 'Mínimo 6 caracteres.'
  } else {
    errors.password = ''
  }
}

function isFormValid() {
  validateEmail()
  validatePassword()
  return !errors.email && !errors.password
}

// ── Login (usa tu composable useAuth tal cual) ──
async function handleLogin() {
  if (!isFormValid()) return

  isLoading.value = true
  errorMsg.value = ''

  try {
    await login(form.email, form.password)
    router.push('/fermentacion')
  } catch (error) {
    errorMsg.value = error.message === 'Invalid login credentials'
      ? 'Correo o contraseña incorrectos.'
      : (error.message || 'Ocurrió un error. Intenta de nuevo.')
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Rajdhani:wght@400;500;600;700&display=swap');

* { box-sizing: border-box; margin: 0; padding: 0; }
/* main.css */

/* ── WRAPPER ── */
.login-wrapper {
  display: flex;
  flex-direction: row;
  align-items: stretch;
  width: 100vw;
  height: 100vh;        /* ← cambia min-height por height */
  font-family: 'Rajdhani', sans-serif;
  position: fixed;
  top: 0;
  left: 0;
  background: #090806;
}

.bg-overlay {
  position: absolute;
  inset: 0;
  background-image: url('@/assets/fondoNEW1.jpg');
  background-size: cover;
  background-position: center center;
  background-repeat: no-repeat;
  z-index: 0;
}

.bg-overlay::after {
  content: '';
  position: absolute;
  inset: 0;
  background:
    linear-gradient(to right,
      rgba(6,4,2,0.1)  0%,
      rgba(6,4,2,0.3)  45%,
      rgba(6,4,2,0.45) 62%,
      rgba(6,4,2,0.55) 80%,
      rgba(6,4,2,0.6)  100%
    );
}

.hop-icon-img {
  width: 52px;
  height: 52px;
  object-fit: contain;
  display: block;
  margin-bottom: 14px;
  border-radius: 6px;
}



/* ── PANEL IZQUIERDO ── */
.left-panel {
  width: 50%;
  
  flex: none;        /* ← quita el flex: 1 */
  display: flex;
  align-items: center;
  justify-content: end;
  padding: 60px 50px;
  position: relative;
  z-index: 1;
}
.brand { max-width: 100%; }

.hop-icon {
  width: 50px; height: 58px;
  margin-bottom: 14px;
  display: block;
}

.brand-title {
  font-family: 'Bebas Neue', sans-serif;
  font-size: clamp(2.2rem, 3.8vw, 3.4rem);
  line-height: 1.05;
  color: #f0e8d8;
  letter-spacing: 0.05em;
  margin-bottom: 6px;
}

.brand-subtitle {
  font-family: 'Bebas Neue', sans-serif;
  font-size: 1.45rem;
  color: #C9922A;
  letter-spacing: 0.14em;
  display: block;
  margin-bottom: 12px;
}

.brand-desc {
  color: #f7f6f4;
  font-size: 0.98rem;
  line-height: 1.65;
  margin-bottom: 24px;
}

.feature-list { list-style: none; display: flex; flex-direction: column; gap: 18px; margin-bottom: 38px; }

.feature-item { display: flex; align-items: center; gap: 15px; }

.feature-item div strong { display: block; color: #eedcb4; font-weight: 800; font-size: 0.98rem; }
.feature-item div span   { color: #fcfbfa; font-size: 0.84rem; }

.feature-icon {
  width: 38px; height: 38px;
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}
.feature-icon svg { width: 17px; height: 17px; }
.feature-icon--temp { background: rgba(34,197,94,0.14);  color: #22c55e; }
.feature-icon--co2  { background: rgba(59,130,246,0.14); color: #60a5fa; }
.feature-icon--ph   { background: rgba(139,92,246,0.14); color: #a78bfa; }

.status-card {
  background: rgba(8,18,12,0.9);
  border: 1px solid rgba(244, 248, 245, 0.18);
  border-radius: 12px;
  padding: 14px 18px;
  max-width: 395px;
  backdrop-filter: blur(12px);
}

.status-header { display: flex; align-items: center; gap: 7px; margin-bottom: 9px; }

.status-dot {
  width: 8px; height: 8px;
  background: #22c55e;
  border-radius: 50%;
  box-shadow: 0 0 7px #22c55e;
  animation: pulse-dot 2s infinite;
  flex-shrink: 0;
}
@keyframes pulse-dot { 0%,100%{opacity:1} 50%{opacity:.4} }

.status-label { color: #22c55e; font-size: 0.68rem; font-weight: 700; letter-spacing: 0.1em; flex: 1; }

.waveform { width: 76px; height: 26px; }

.status-card p { color: #edefed; font-size: 0.82rem; line-height: 1.65; }

/* ── PANEL DERECHO ── */
.right-panel {
  width: 50%;
  flex: none;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 40px;
  position: relative;
  z-index: 1;
  background: transparent;   /* ← sin fondo */
  backdrop-filter: none;
  -webkit-backdrop-filter: none;
}
.login-card {
  background: rgba(12, 18, 28, 0.45);   /* ← baja de 0.72 a 0.45 */
  border: 1px solid rgba(80, 140, 220, 0.45);
  border-radius: 20px;
  padding: 36px 34px 32px;
  width: 100%;
  max-width: 415px;
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  box-shadow:
    0 0 0 1px rgba(60, 120, 200, 0.15),
    0 0 30px rgba(40, 100, 180, 0.2),
    0 24px 60px rgba(0,0,0,0.4),         /* ← también baja esta sombra */
    inset 0 1px 0 rgba(100, 160, 255, 0.1);
  text-align: center;
  animation: cardIn 0.45s ease both;
}

@keyframes cardIn {
  from { opacity: 0; transform: translateY(18px) scale(0.98); }
  to   { opacity: 1; transform: translateY(0)    scale(1); }
}

.fermenter-wrap {
  width: 130px;
  height: 130px;
  margin: 0 auto 14px;
}

.brand-logo-img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  border-radius: 50%;
}

.login-title {
  font-family: 'Bebas Neue', sans-serif;
  font-size: 1.95rem;
  color: #f0e8d8;
  letter-spacing: 0.12em;
  margin-bottom: 5px;
}

.login-subtitle { color: #f3f1f0d5; font-size: 0.88rem; margin-bottom: 22px; }

/* Alerta */
.alert-error {
  background: rgba(239,68,68,0.09);
  border: 1px solid rgba(239, 234, 234, 0.814);
  color: #f87171;
  border-radius: 8px;
  padding: 9px 13px;
  font-size: 0.84rem;
  display: flex;
  align-items: center;
  gap: 7px;
  margin-bottom: 14px;
  text-align: left;
}
.alert-enter-active, .alert-leave-active { transition: all 0.3s ease; }
.alert-enter-from, .alert-leave-to { opacity: 0; transform: translateY(-6px); }

/* Form */
.login-form { display: flex; flex-direction: column; gap: 10px; }

.field { display: flex; flex-direction: column; gap: 4px; }

.field-input-wrap {
  position: relative;
  display: flex;
  align-items: center;
  background: rgba(255,255,255,0.035);
  border: 1px solid rgba(238, 236, 232, 0.768);
  border-radius: 9px;
  transition: border-color 0.2s, background 0.2s;
}
.field-input-wrap:focus-within {
  border-color: rgba(245, 242, 237, 0.922);
  background: rgba(201,146,42,0.035);
}
.field--error .field-input-wrap { border-color: rgba(239,68,68,0.45); }

.field-icon { width: 15px; height: 15px; color: #fcf9f4; margin: 0 13px; flex-shrink: 0; }

.field-input {
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  color: #e8d8b8;
  font-family: 'Rajdhani', sans-serif;
  font-size: 0.94rem;
  padding: 13px 0;
}
.field-input::placeholder { color: #f0eeedc6; }

.field-toggle {
  background: none; border: none; cursor: pointer;
  color: #e0dfddcd; padding: 0 13px;
  display: flex; align-items: center;
  transition: color 0.2s;
}
.field-toggle:hover { color: #C9922A; }

.field-error-msg { font-size: 0.78rem; color: #f87171; text-align: left; padding-left: 2px; }

/* Recordar / olvidé */
.row-options { display: flex; align-items: center; justify-content: space-between; margin: 4px 0 6px; }

.remember-label {
  display: flex; align-items: center; gap: 7px;
  color: #eeece8c9; font-size: 0.86rem;
  cursor: pointer; user-select: none;
}

.remember-check { display: none; }

.custom-check {
  width: 15px; height: 15px;
  border: 1.5px solid rgba(249, 248, 246, 0.712);
  border-radius: 3px;
  display: flex; align-items: center; justify-content: center;
  transition: all 0.2s; flex-shrink: 0;
}
.remember-check:checked + .custom-check { background: #C9922A; border-color: #C9922A; }
.remember-check:checked + .custom-check::after {
  content: '';
  width: 7px; height: 4px;
  border-left: 2px solid #000;
  border-bottom: 2px solid #000;
  transform: rotate(-45deg) translateY(-1px);
  display: block;
}

.link-forgot { color: #C9922A; font-size: 0.86rem; cursor: pointer; text-decoration: none; transition: color 0.2s; }
.link-forgot:hover { color: #e8b448; }

/* Botón */
.btn-submit {
  padding: 14px;
  background: linear-gradient(135deg, #C9922A 0%, #a87020 55%, #C9922A 100%);
  background-size: 200% 100%;
  border: none; border-radius: 10px;
  color: #fefcfac2;
  font-family: 'Bebas Neue', sans-serif;
  font-size: 1.08rem; letter-spacing: 0.1em;
  cursor: pointer; width: 100%;
  display: flex; align-items: center; justify-content: center;
  transition: background-position 0.35s, opacity 0.2s, transform 0.1s;
  box-shadow: 0 4px 22px rgba(201,146,42,0.28);
}
.btn-submit:hover:not(:disabled) { background-position: 100% 0; box-shadow: 0 6px 30px rgba(201,146,42,0.42); transform: translateY(-1px); }
.btn-submit:active:not(:disabled) { transform: translateY(0); }
.btn-submit:disabled { opacity: 0.55; cursor: not-allowed; }

.btn-inner { display: flex; align-items: center; gap: 9px; }

.spinner {
  width: 18px; height: 18px;
  border: 2px solid rgba(0,0,0,0.25);
  border-top-color: #000;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

/* Divider */
.divider { display: flex; align-items: center; gap: 10px; color: #f5f1ed; font-size: 0.8rem; margin: 4px 0; }
.divider::before, .divider::after { content: ''; flex: 1; height: 1px; background: rgba(201,146,42,0.13); }

/* Social */
.social-row { display: flex; gap: 10px; justify-content: center; }

.social-btn {
  flex: 1; padding: 11px;
  background: rgba(255,255,255,0.035);
  border: 1px solid rgba(201,146,42,0.16);
  border-radius: 9px;
  cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  transition: background 0.2s, border-color 0.2s;
}
.social-btn:hover { background: rgba(255,255,255,0.07); border-color: rgba(201,146,42,0.32); }

/* Registro */
.signup-row { color: #f3efe8; font-size: 0.88rem; }
.link-register { color: #C9922A; cursor: pointer; font-weight: 600; text-decoration: none; transition: color 0.2s; }
.link-register:hover { color: #e8b448; }

/* ── RESPONSIVE ── */
@media (max-width: 860px) {
  .login-wrapper { flex-direction: column; }
  .left-panel { padding: 36px 28px 16px; }
  .right-panel { padding: 16px 24px 48px; }
  .brand-desc, .feature-list, .status-card { display: none; }
}
</style>