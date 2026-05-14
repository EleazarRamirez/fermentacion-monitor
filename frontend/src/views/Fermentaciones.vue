<template>
  <div>
    <div class="encabezado">
      <h1>Lotes de fermentación</h1>
      <button class="btn-primary" @click="mostrarFormulario = true">+ Nuevo lote</button>
    </div>

    <!-- Formulario nuevo lote -->
    <div v-if="mostrarFormulario" class="card form-card">
      <h2>Nuevo lote</h2>
      <input class=" border-black text-gray-500" v-model="form.nombre"      placeholder="Nombre del lote *" />
      <input class=" border-black text-gray-500"  v-model="form.estilo"      placeholder="Estilo (ej. Ale, Lager)" />
      <textarea v-model="form.descripcion" placeholder="Descripción (opcional)" rows="2" />
      <div class="form-acciones">
        <button class="btn-primary" @click="crearLote">Crear</button>
        <button class="btn-secondary" @click="mostrarFormulario = false">Cancelar</button>
      </div>
    </div>

    <!-- Lista de lotes -->
    <div v-if="cargando" class="mensaje-centro">Cargando lotes...</div>
    <div v-else-if="!lotes.length" class="mensaje-centro">No hay lotes registrados aún.</div>
    <div v-else class="grilla-lotes">
      <div
        v-for="lote in lotes"
        :key="lote.id"
        class="card lote-card"
        @click="$router.push(`/lote/${lote.id}`)"
      >
        <div class="lote-header">
          <span class="lote-nombre">{{ lote.nombre }}</span>
          <span :class="['badge', lote.activa ? 'badge-activo' : 'badge-inactivo']">
            {{ lote.activa ? 'Activo' : 'Finalizado' }}
          </span>
        </div>
        <p class="lote-estilo">{{ lote.estilo || 'Sin estilo definido' }}</p>
        <p class="lote-fecha">Iniciado: {{ formatearFecha(lote.created_at) }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const lotes           = ref([])
const cargando        = ref(true)
const mostrarFormulario = ref(false)
const form            = ref({ nombre: '', estilo: '', descripcion: '' })

async function cargarLotes() {
  cargando.value = true
  try {
    const res  = await fetch('/api/fermentaciones')
    lotes.value = await res.json()
  } finally {
    cargando.value = false
  }
}

async function crearLote() {
  if (!form.value.nombre) return alert('El nombre es requerido')
  await fetch('/api/fermentaciones', {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify(form.value)
  })
  form.value = { nombre: '', estilo: '', descripcion: '' }
  mostrarFormulario.value = false
  await cargarLotes()
}

function formatearFecha(iso) {
  return new Date(iso).toLocaleDateString('es-MX', {
    day: '2-digit', month: 'short', year: 'numeric'
  })
}

onMounted(cargarLotes)
</script>

<style scoped>
.encabezado { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.25rem; }
h1 { font-size: 1.4rem; font-weight: 600; }

.card { background: #5372fa; border-radius: 10px; padding: 1.25rem; box-shadow: 0 1px 4px rgba(0,0,0,.08); }

.form-card { margin-bottom: 1.25rem; display: flex; flex-direction: column; gap: .75rem; max-width: 480px;  }
.form-card input, .form-card textarea {
  border: 1px solid  #ddd; border-radius: 6px; border-color: black; padding: .55rem .75rem; font-size: .95rem; font-family: inherit;
}
.form-acciones { display: flex; gap: .75rem; }

.grilla-lotes { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1rem; }

.lote-card { cursor: pointer; transition: box-shadow .15s; }
.lote-card:hover { box-shadow: 0 4px 12px rgba(0,0,0,.12); }
.lote-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: .5rem; }
.lote-nombre { font-weight: 600; font-size: 1.05rem; }
.lote-estilo { color: #666; font-size: .9rem; margin-bottom: .3rem; }
.lote-fecha  { color: #999; font-size: .82rem; }

.badge { font-size: .75rem; padding: 2px 8px; border-radius: 20px; font-weight: 500; }
.badge-activo   { background: #eafaf1; color: #22804a; }
.badge-inactivo { background: #f0f0f0; color: #888; }

.btn-primary   { background: #d4870a; color: #fff; border: none; border-radius: 6px; padding: .5rem 1rem; cursor: pointer; font-size: .9rem; }
.btn-primary:hover { background: #b87209; }
.btn-secondary { background: #f0f0f0; color: #333; border: none; border-radius: 6px; padding: .5rem 1rem; cursor: pointer; font-size: .9rem; }

.mensaje-centro { text-align: center; color: #999; padding: 2rem; }

</style>