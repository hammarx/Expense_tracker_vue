<script setup>
import { ref } from 'vue'
import { Smile } from 'lucide-vue-next'

const props = defineProps({
  modelValue: {
    type: String,
    default: '💰',
  },
  label: {
    type: String,
    default: 'Pick Icon',
  },
})

const emit = defineEmits(['update:modelValue'])

const isOpen = ref(false)

const emojiGroups = [
  {
    name: 'Income & Career',
    emojis: ['💰', '💼', '🚀', '📈', '💻', '🎨', '🏦', '💎', '🪙', '🏆', '🎁', '🤝'],
  },
  {
    name: 'Housing & Bills',
    emojis: ['🏠', '⚡', '💧', '🌐', '📱', '🛋️', '🔑', '🛠️', '🧹', '🛡️'],
  },
  {
    name: 'Food & Lifestyle',
    emojis: ['🛒', '🍣', '🍕', '☕', '🥗', '🍔', '🍷', '🍰', '🍜', '🥐'],
  },
  {
    name: 'Travel, Tech & Health',
    emojis: ['✈️', '🚕', '⛽', '🚆', '☁️', '🎧', '🎮', '🏋️', '💊', '📚', '🎬', '🛍️'],
  },
]

function selectEmoji(emoji) {
  emit('update:modelValue', emoji)
  isOpen.value = false
}
</script>

<template>
  <div class="relative">
    <label class="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
      {{ label }}
    </label>
    <button
      type="button"
      @click="isOpen = !isOpen"
      class="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-violet-500/60 transition text-left w-full"
    >
      <span class="w-10 h-10 rounded-lg bg-violet-500/15 border border-violet-500/30 flex items-center justify-center text-2xl">
        {{ modelValue }}
      </span>
      <div class="flex-1">
        <p class="text-sm font-medium text-slate-200">Selected Category Emoji</p>
        <p class="text-xs text-slate-400">Click to choose another icon</p>
      </div>
      <Smile class="w-4 h-4 text-violet-400" />
    </button>

    <div
      v-if="isOpen"
      class="absolute z-50 mt-2 w-full max-h-64 overflow-y-auto rounded-2xl bg-slate-900 border border-slate-700/80 shadow-2xl p-4 space-y-3"
    >
      <div v-for="group in emojiGroups" :key="group.name">
        <p class="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
          {{ group.name }}
        </p>
        <div class="grid grid-cols-6 gap-1.5">
          <button
            v-for="emoji in group.emojis"
            :key="emoji"
            type="button"
            @click="selectEmoji(emoji)"
            class="h-9 rounded-lg flex items-center justify-center text-lg hover:bg-violet-500/20 transition"
            :class="modelValue === emoji ? 'bg-violet-500/30 ring-1 ring-violet-400' : 'bg-slate-800/60'"
          >
            {{ emoji }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
