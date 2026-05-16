<template>
  <div class="grafica-wrapper">
    <Line :data="chartData" :options="chartOptions" />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { Line } from 'vue-chartjs'
import {
  Chart as ChartJS, CategoryScale, LinearScale,
  PointElement, LineElement, Tooltip, Legend, Filler, annotations
} from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend, Filler)

const props = defineProps({
  datos:  { type: Array,  required: true },
  campo:  { type: String, required: true },
  color:  { type: String, default: '#d4870a' },
  min:    { type: Number, default: null },
  max:    { type: Number, default: null }
})

const chartData = computed(() => ({
  labels: props.datos.map(d =>
    new Date(d.created_at).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })
  ),
  datasets: [
    {
      label: props.campo,
      data: props.datos.map(d => d[props.campo]),
      borderColor: props.color,
      backgroundColor: props.color + '18',
      tension: 0.3,
      fill: true,
      pointRadius: props.datos.length > 60 ? 0 : 3,
      borderWidth: 2
    }
  ]
}))

const chartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: {
      callbacks: {
        label: (ctx) => ` ${ctx.parsed.y}`
      }
    }
  },
  scales: {
    y: {
      min: props.min != null ? props.min - 2 : undefined,
      max: props.max != null ? props.max + 2 : undefined,
      grid: { color: 'rgba(0,0,0,.05)' },
      ticks: { font: { size: 11 } }
    },
    x: {
      grid: { display: false },
      ticks: {
        font: { size: 10 },
        maxTicksLimit: 10
      }
    }
  }
}))
</script>

<style scoped>
.grafica-wrapper { height: 200px; }
</style>