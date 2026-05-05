<template>
  <div v-if="lote">
    <div class="encabezado">
      <div>
        <h1>{{ lote.nombre }}</h1>
        <p class="subtitulo">{{ lote.estilo }} · Iniciado {{ formatearFecha(lote.created_at) }}</p>
      </div>
      <span :class="['badge', lote.activa ? 'badge-activo' : 'badge-inactivo']">
        {{ lote.activa ? 'Activo' : 'Finalizado' }}
      </span>
    </div>

    <!-- Tarjetas de estado actual -->
    <div class="grilla-tarjetas">
      <div class="tarjeta">
        <p class="tarjeta-label">Temperatura mosto</p>
        <p class="tarjeta-valor" :class="alertaTemp ? 'valor-alerta' : ''">
          {{ ultima.temperatura_mosto != null ? `${ultima.temperatura_mosto} °C` : '—' }}
        </p>
        <p class="tarjeta-rango">Rango: {{ config.temp_min }}–{{ config.temp_max }} °C</p>
      </div>
      <div class="tarjeta">
        <p class="tarjeta-label">Actividad (burbujas/min)</p>
        <p class="tarjeta-valor" :class="alertaBurbujas ? 'valor-alerta' : ''">
          {{ ultima.burbujas_por_minuto != null ? ultima.burbujas_por_minuto : '—' }}
        </p>
        <p class="tarjeta-rango">{{ estadoFermentacion }}</p>
      </div>
      <div class="tarjeta">
        <p class="tarjeta-label">pH del mosto</p>
        <p class="tarjeta-valor" :class="alertaPh ? 'valor-alerta' : ''">
          {{ ultima.ph != null ? ultima.ph : '—' }}
        </p>
        <p class="tarjeta-rango">Rango: {{ config.ph_min }}–{{ config.ph_max }}</p>
      </div>
      <div class="tarjeta">
        <p class="tarjeta-label">Última lectura</p>
        <p class="tarjeta-valor tarjeta-fecha">
          {{ ultima.created_at ? formatearHora(ultima.created_at) : '—' }}
        </p>
        <p class="tarjeta-rango">{{ lecturas.length }} lecturas registradas</p>
      </div>
    </div>

    <!-- Gráfica de temperatura -->
    <div class="card grafica-card">
      <h2>Temperatura del mosto (°C)</h2>
      <GraficaLinea
        v-if="lecturas.length"
        :datos="lecturas"
        campo="temperatura_mosto"
        color="#e24b4a"
        :min="config.temp_min"
        :max="config.temp_max"
      />
      <p v-else class="sin-datos">Sin datos todavía</p>
    </div>

    <!-- Gráfica de burbujas -->
    <div class="card grafica-card">
      <h2>Actividad de fermentación (burbujas/min)</h2>
      <GraficaLinea
        v-if="lecturas.length"
        :datos="lecturas"
        campo="burbujas_por_minuto"
        color="#1d9e75"
      />
      <p v-else class="sin-datos">Sin datos todavía</p>
    </div>

    <!-- Gráfica de pH -->
    <div class="card grafica-card">
      <h2>pH del mosto</h2>
      <GraficaLinea
        v-if="lecturas.length"
        :datos="lecturas"
        campo="ph"
        color="#7f77dd"
        :min="config.ph_min"
        :max="config.ph_max"
      />
      <p v-else class="sin-datos">Sin datos todavía</p>
    </div>

    <!-- Alertas recientes -->
    <div class="card">
      <h2>Alertas recientes</h2>
      <div v-if="!alertasLog.length" class="sin-datos">Sin alertas registradas</div>
      <div v-for="a in alertasLog" :key="a.id" class="alerta-item">
        <span class="alerta-tipo">{{ a.tipo }}</span>
        <span class="alerta-mensaje">{{ a.mensaje }}</span>
        <span class="alerta-fecha">{{ formatearHora(a.created_at) }}</span>
      </div>
    </div>
  </div>
  <div v-else class="cargando">Cargando lote...</div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { io } from 'socket.io-client'
import GraficaLinea from '../components/GraficaLinea.vue'

const route      = useRoute()
const loteId     = route.params.id

const lote       = ref(null)
const lecturas   = ref([])
const alertasLog = ref([])
const config     = ref({ temp_min: 16, temp_max: 24, ph_min: 3.8, ph_max: 5.5 })
const ultima     = computed(() => lecturas.value.at(-1) || {})

const alertaTemp     = computed(() =>
  ultima.value.temperatura_mosto > config.value.temp_max ||
  ultima.value.temperatura_mosto < config.value.temp_min
)
const alertaBurbujas = computed(() => ultima.value.burbujas_por_minuto === 0)
const alertaPh       = computed(() =>
  ultima.value.ph < config.value.ph_min || ultima.value.ph > config.value.ph_max
)
const estadoFermentacion = computed(() => {
  const b = ultima.value.burbujas_por_minuto
  if (b == null) return '—'
  if (b === 0)   return '⚠ Fermentación estancada'
  if (b < 3)     return 'Actividad baja'
  if (b < 15)    return 'Actividad normal'
  return 'Actividad alta'
})

let socket

async function cargarDatos() {
  const [resLote, resLecturas, resConfig, resAlertas] = await Promise.all([
    fetch(`/api/fermentaciones/${loteId}`),
    fetch(`/api/lecturas/${loteId}?limite=100`),
    fetch(`/api/alertas/config/${loteId}`),
    fetch(`/api/alertas/log/${loteId}`)
  ])
  lote.value       = await resLote.json()
  lecturas.value   = await resLecturas.json()
  alertasLog.value = await resAlertas.json()
  if (resConfig.ok) config.value = await resConfig.json()
}

function formatearFecha(iso) {
  return new Date(iso).toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' })
}
function formatearHora(iso) {
  return new Date(iso).toLocaleString('es-MX', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
}

onMounted(async () => {
  await cargarDatos()

  // Conectar WebSocket para recibir lecturas en tiempo real
  socket = io()
  socket.on('nueva_lectura', (lectura) => {
    if (String(lectura.fermentacion_id) === String(loteId)) {
      lecturas.value.push(lectura)
      // Mantener solo las últimas 200 lecturas en memoria
      if (lecturas.value.length > 200) lecturas.value.shift()
    }
  })
  socket.on('nueva_alerta', (alerta) => {
    if (String(alerta.fermentacion_id) === String(loteId)) {
      alertasLog.value.unshift(alerta)
    }
  })
})

onUnmounted(() => {
  socket?.disconnect()
})
</script>

<style scoped>
.encabezado { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1.25rem; }
h1 { font-size: 1.4rem; font-weight: 600; }
.subtitulo { color: #666; font-size: .9rem; margin-top: .25rem; }

.grilla-tarjetas { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 1rem; margin-bottom: 1rem; }
.tarjeta { background: #fff; border-radius: 10px; padding: 1rem 1.25rem; box-shadow: 0 1px 4px rgba(0,0,0,.08); }
.tarjeta-label { font-size: .8rem; color: #888; text-transform: uppercase; letter-spacing: .04em; margin-bottom: .3rem; }
.tarjeta-valor { font-size: 2rem; font-weight: 600; color: #1a1a1a; }
.tarjeta-fecha { font-size: 1.1rem !important; }
.tarjeta-rango { font-size: .8rem; color: #aaa; margin-top: .25rem; }
.valor-alerta  { color: #e24b4a !important; }

.card { background: #fff; border-radius: 10px; padding: 1.25rem; box-shadow: 0 1px 4px rgba(0,0,0,.08); margin-bottom: 1rem; }
.card h2 { font-size: 1rem; font-weight: 600; margin-bottom: 1rem; }

.grafica-card { min-height: 220px; }
.sin-datos { color: #bbb; text-align: center; padding: 1.5rem 0; }

.alerta-item { display: flex; gap: .75rem; align-items: center; padding: .55rem 0; border-top: 1px solid #f0f0f0; font-size: .9rem; }
.alerta-tipo    { background: #fcebeb; color: #a32d2d; border-radius: 20px; padding: 2px 8px; font-size: .78rem; font-weight: 500; white-space: nowrap; }
.alerta-mensaje { flex: 1; color: #444; }
.alerta-fecha   { color: #bbb; font-size: .8rem; white-space: nowrap; }

.badge { font-size: .8rem; padding: 3px 10px; border-radius: 20px; font-weight: 500; }
.badge-activo   { background: #eafaf1; color: #22804a; }
.badge-inactivo { background: #f0f0f0; color: #888; }
.cargando { text-align: center; color: #999; padding: 3rem; }
</style>