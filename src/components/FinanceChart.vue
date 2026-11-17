<script setup>
import { computed } from 'vue'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  ArcElement,
  PointElement,
  LineElement,
  Filler,
} from 'chart.js'
import { Bar, Doughnut, Line } from 'vue-chartjs'

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  ArcElement,
  PointElement,
  LineElement,
  Filler
)

const props = defineProps({
  type: {
    type: String,
    default: 'bar', // 'bar' | 'doughnut' | 'line'
  },
  labels: {
    type: Array,
    required: true,
  },
  values: {
    type: Array,
    required: true,
  },
  colors: {
    type: Array,
    default: () => ['#8b5cf6', '#10b981', '#f43f5e', '#3b82f6', '#f59e0b', '#ec4899'],
  },
  datasetLabel: {
    type: String,
    default: 'Amount ($)',
  },
})

const chartData = computed(() => {
  if (props.type === 'doughnut') {
    return {
      labels: props.labels,
      datasets: [
        {
          data: props.values,
          backgroundColor: props.colors,
          borderColor: '#0f172a',
          borderWidth: 3,
          hoverOffset: 8,
        },
      ],
    }
  }

  if (props.type === 'line') {
    return {
      labels: props.labels,
      datasets: [
        {
          label: props.datasetLabel,
          data: props.values,
          borderColor: props.colors[0] || '#8b5cf6',
          backgroundColor: 'rgba(139, 92, 246, 0.16)',
          pointBackgroundColor: props.colors[0] || '#8b5cf6',
          pointBorderColor: '#0f172a',
          pointBorderWidth: 2,
          pointRadius: 4,
          pointHoverRadius: 6,
          tension: 0.38,
          fill: true,
        },
      ],
    }
  }

  return {
    labels: props.labels,
    datasets: [
      {
        label: props.datasetLabel,
        data: props.values,
        backgroundColor: props.colors,
        borderRadius: 10,
        maxBarThickness: 42,
      },
    ],
  }
})

const chartOptions = computed(() => {
  const isDoughnut = props.type === 'doughnut'
  return {
    responsive: true,
    maintainAspectRatio: false,
    cutout: isDoughnut ? '72%' : undefined,
    plugins: {
      legend: {
        display: isDoughnut,
        position: 'bottom',
        labels: {
          color: '#cbd5e1',
          padding: 16,
          usePointStyle: true,
          pointStyle: 'circle',
          font: {
            family: 'Plus Jakarta Sans, Inter, sans-serif',
            size: 12,
          },
        },
      },
      tooltip: {
        backgroundColor: '#0f172a',
        titleColor: '#f8fafc',
        bodyColor: '#e2e8f0',
        borderColor: '#334155',
        borderWidth: 1,
        padding: 12,
        cornerRadius: 10,
        callbacks: {
          label: (ctx) => {
            const val = Number(ctx.raw || 0).toLocaleString('en-US', {
              style: 'currency',
              currency: 'USD',
              maximumFractionDigits: 0,
            })
            return ` ${ctx.label}: ${val}`
          },
        },
      },
    },
    scales: isDoughnut
      ? {}
      : {
          x: {
            grid: {
              display: false,
            },
            ticks: {
              color: '#94a3b8',
              font: { size: 11 },
            },
          },
          y: {
            grid: {
              color: 'rgba(51, 65, 85, 0.35)',
            },
            ticks: {
              color: '#94a3b8',
              font: { size: 11 },
              callback: (val) => '$' + Number(val).toLocaleString(),
            },
          },
        },
  }
})
</script>

<template>
  <div class="w-full h-full min-h-[250px] relative">
    <Doughnut v-if="type === 'doughnut'" :data="chartData" :options="chartOptions" />
    <Line v-else-if="type === 'line'" :data="chartData" :options="chartOptions" />
    <Bar v-else :data="chartData" :options="chartOptions" />
  </div>
</template>
