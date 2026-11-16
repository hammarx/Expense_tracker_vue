<script setup>
import { useFinanceStore } from '@/stores/finance'
import { CheckCircle2, AlertCircle, Info } from 'lucide-vue-next'

const store = useFinanceStore()
</script>

<template>
  <router-view />

  <!-- Global Toast Notifications -->
  <div class="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
    <div
      v-for="t in store.toasts"
      :key="t.id"
      class="pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-2xl border shadow-2xl backdrop-blur-xl text-xs font-semibold transition-all"
      :class="
        t.type === 'error'
          ? 'bg-rose-950/90 border-rose-500/40 text-rose-200'
          : t.type === 'info'
            ? 'bg-slate-900/95 border-slate-700 text-slate-200'
            : 'bg-emerald-950/90 border-emerald-500/40 text-emerald-200'
      "
    >
      <AlertCircle v-if="t.type === 'error'" class="w-4 h-4 text-rose-400 shrink-0" />
      <Info v-else-if="t.type === 'info'" class="w-4 h-4 text-violet-400 shrink-0" />
      <CheckCircle2 v-else class="w-4 h-4 text-emerald-400 shrink-0" />
      <span>{{ t.message }}</span>
    </div>
  </div>
</template>
