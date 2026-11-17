<script setup>
import { Trash2, TrendingUp, TrendingDown } from 'lucide-vue-next'

defineProps({
  item: {
    type: Object,
    required: true,
  },
  showDelete: {
    type: Boolean,
    default: true,
  },
})

const emit = defineEmits(['delete'])

function formatDate(dateStr) {
  if (!dateStr) return ''
  const date = new Date(dateStr + 'T00:00:00')
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}
</script>

<template>
  <div
    class="group flex items-center justify-between gap-4 p-3.5 rounded-2xl bg-slate-900/60 hover:bg-slate-900 border border-slate-800/80 hover:border-slate-700/80 transition-all"
  >
    <div class="flex items-center gap-3.5 min-w-0">
      <div
        class="w-11 h-11 rounded-xl flex items-center justify-center text-xl shrink-0 border"
        :class="
          item.type === 'income'
            ? 'bg-emerald-500/10 border-emerald-500/25'
            : 'bg-rose-500/10 border-rose-500/25'
        "
      >
        {{ item.icon || (item.type === 'income' ? '💰' : '🛍️') }}
      </div>
      <div class="min-w-0">
        <p class="text-sm font-semibold text-slate-100 truncate">
          {{ item.source || item.category || item.title }}
        </p>
        <div class="flex items-center gap-2 text-xs text-slate-400">
          <span>{{ formatDate(item.date) }}</span>
          <span v-if="item.notes" class="text-slate-600">•</span>
          <span v-if="item.notes" class="truncate max-w-[200px] text-slate-400">{{ item.notes }}</span>
        </div>
      </div>
    </div>

    <div class="flex items-center gap-2.5 shrink-0">
      <div
        class="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold"
        :class="
          item.type === 'income'
            ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/25'
            : 'bg-rose-500/15 text-rose-300 border border-rose-500/25'
        "
      >
        <span>{{ item.type === 'income' ? '+' : '-' }} ${{ Number(item.amount).toLocaleString() }}</span>
        <TrendingUp v-if="item.type === 'income'" class="w-3.5 h-3.5" />
        <TrendingDown v-else class="w-3.5 h-3.5" />
      </div>

      <button
        v-if="showDelete"
        type="button"
        @click="emit('delete', item)"
        title="Delete record"
        class="opacity-0 group-hover:opacity-100 focus:opacity-100 p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition"
      >
        <Trash2 class="w-4 h-4" />
      </button>
    </div>
  </div>
</template>
