<template>
  <div class="contenedor">
    <div class="encabezado">
      <h1>Lotes de fermentación</h1>
      <button class="btn-primary" @click="mostrarFormulario = true">
        + Nuevo lote
      </button>
    </div>

    <!-- Formulario -->
    <div v-if="mostrarFormulario" class="card form-card">
      <h2>Nuevo lote</h2>

      <input v-model="form.nombre" placeholder="Nombre del lote *" />
      <input v-model="form.estilo" placeholder="Estilo (ej. Ale, Lager)" />
      <textarea v-model="form.descripcion" placeholder="Descripción" />

      <div class="form-acciones">
        <button class="btn-primary" @click="crearLote">Crear</button>
        <button class="btn-secondary" @click="mostrarFormulario = false">
          Cancelar
        </button>
      </div>
    </div>

    <!-- Estados -->
    <div v-if="cargando" class="mensaje-centro">
      Cargando lotes...
    </div>

    <div v-else-if="!lotes.length" class="mensaje-centro">
      No hay lotes registrados aún.
    </div>

    <!-- Lista -->
    <div v-else class="grilla-lotes">
      <div
        v-for="lote in lotes"
        :key="lote.id"
        class="card lote-card"
        @click="irDetalle(lote.id)"
      >
        <div class="lote-header">
          <span class="lote-nombre">{{ lote.nombre }}</span>

          <span :class="['badge', lote.activa ? 'badge-activo' : 'badge-inactivo']">
            {{ lote.activa ? 'Activo' : 'Finalizado' }}
          </span>
        </div>

        <p class="lote-estilo">
          {{ lote.estilo || 'Sin estilo definido' }}
        </p>

        <p class="lote-fecha">
          Iniciado: {{ formatearFecha(lote.created_at) }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const lotes = ref([])
const cargando = ref(true)
const mostrarFormulario = ref(false)

const form = ref({
  nombre: '',
  estilo: '',
  descripcion: ''
})

async function cargarLotes() {
  cargando.value = true
  try {
    const res = await fetch('/api/fermentaciones')
    lotes.value = await res.json()
  } catch (error) {
    console.error('Error cargando lotes:', error)
  } finally {
    cargando.value = false
  }
}

async function crearLote() {
  if (!form.value.nombre) {
    alert('El nombre es requerido')
    return
  }

  try {
    await fetch('/api/fermentaciones', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form.value)
    })

    form.value = { nombre: '', estilo: '', descripcion: '' }
    mostrarFormulario.value = false

    await cargarLotes()
  } catch (error) {
    console.error('Error creando lote:', error)
  }
}

function formatearFecha(fecha) {
  return new Date(fecha).toLocaleDateString('es-MX', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  })
}

function irDetalle(id) {
  router.push(`/lote/${id}`)
}

onMounted(cargarLotes)
</script>

<style scoped>
.contenedor {
  max-width: 1100px;
  margin: auto;
  padding: 1rem;
}

.encabezado {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.25rem;
}

.card {
  background: #fff;
  border-radius: 10px;
  padding: 1.25rem;
  box-shadow: 0 1px 4px rgba(0,0,0,.08);
}

.form-card {
  margin-bottom: 1rem;
  display: flex;
  flex-direction: column;
  gap: .5rem;
  max-width: 400px;
}

.form-card input,
.form-card textarea {
  border: 1px solid #ddd;
  border-radius: 6px;
  padding: .5rem;
}

.form-acciones {
  display: flex;
  gap: .5rem;
}

.grilla-lotes {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1rem;
  color: black;
}

.lote-card {
  cursor: pointer;
}

.lote-header {
  display: flex;
  justify-content: space-between;
  color:black
}

.lote-nombre {
  font-weight: bold;
}

.badge {
  font-size: .7rem;
  padding: 2px 8px;
  border-radius: 20px;
}

.badge-activo {
  background: #eafaf1;
  color: #22804a;
}

.badge-inactivo {
  background: #eee;
  color: #888;
}

.btn-primary {
  background: #d4870a;
  color: white;
  border: none;
  padding: .5rem 1rem;
  border-radius: 6px;
}

.btn-secondary {
  background: #eee;
  border: none;
  padding: .5rem 1rem;
  border-radius: 6px;
}

.mensaje-centro {
  text-align: center;
  padding: 2rem;
  color: #888;
}
</style>