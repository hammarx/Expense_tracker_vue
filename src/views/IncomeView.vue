<script setup>
import { ref, computed } from 'vue'
import { useFinanceStore } from '@/stores/finance'
import DashboardLayout from '@/components/DashboardLayout.vue'
import FinanceChart from '@/components/FinanceChart.vue'
import TransactionRow from '@/components/TransactionRow.vue'
import EmojiPickerPopup from '@/components/EmojiPickerPopup.vue'
import { Plus, Download, X, Search } from 'lucide-vue-next'

const store = useFinanceStore()

const showAddModal = ref(false)
const deleteTarget = ref(null)
const searchQuery = ref('')

const form = ref({
  icon: '💼',
  source: '',
  amount: '',
  date: new Date().toISOString().split('T')[0],
  notes: '',
})

const filteredIncomes = computed(() => {
  const q = searchQuery.value.trim().toLowerCase()
  if (!q) return store.incomes
  return store.incomes.filter(
    (i) =>
      i.source.toLowerCase().includes(q) ||
      (i.notes && i.notes.toLowerCase().includes(q))
  )
})

const incomeOverviewChart = computed(() => {
  const sorted = [...store.incomes].sort((a, b) => new Date(a.date) - new Date(b.date))
  return {
    labels: sorted.map((i) => {
      const d = new Date(i.date + 'T00:00:00')
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) + ` (${i.source.split(' ')[0]})`
    }),
    values: sorted.map((i) => Number(i.amount)),
  }
})

async function handleAddIncome() {
  if (!form.value.source.trim() || !form.value.amount || Number(form.value.amount) <= 0) {
    store.showToast('Please enter a valid income source and positive amount.', 'error')
    return
  }
  await store.addIncome(form.value)
  form.value = {
    icon: '💼',
    source: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    notes: '',
  }
  showAddModal.value = false
}

async function confirmDelete() {
  if (!deleteTarget.value) return
  await store.deleteIncome(deleteTarget.value.id)
  deleteTarget.value = null
}
</script>

<template>
  <DashboardLayout>
    <div class="space-y-6">
      <!-- Income Overview Chart Card -->
      <div class="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-slate-800/90 space-y-6">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 class="text-xl sm:text-2xl font-extrabold text-white">Income Overview</h1>
            <p class="text-xs sm:text-sm text-slate-400 mt-0.5">
              Track your earnings over time and analyze your income trends.
            </p>
          </div>

          <button
            type="button"
            @click="showAddModal = true"
            class="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold shadow-lg shadow-violet-600/25 transition"
          >
            <Plus class="w-4 h-4" />
            <span>Add Income</span>
          </button>
        </div>

        <div class="h-72">
          <FinanceChart
            type="bar"
            :labels="incomeOverviewChart.labels"
            :values="incomeOverviewChart.values"
            :colors="['#10b981', '#8b5cf6', '#34d399', '#6366f1', '#14b8a6']"
            datasetLabel="Income ($)"
          />
        </div>
      </div>

      <!-- Income Sources List -->
      <div class="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-slate-800/90 space-y-5">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 class="text-lg font-bold text-white">All Income Sources</h2>
            <p class="text-xs text-slate-400">Hover any transaction to delete or click Export to download Excel</p>
          </div>

          <div class="flex items-center gap-3">
            <div class="relative flex-1 sm:w-60">
              <Search class="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Search income source..."
                class="w-full pl-9 pr-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-violet-500"
              />
            </div>

            <button
              type="button"
              @click="store.exportToExcel('income')"
              class="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition shrink-0"
            >
              <Download class="w-3.5 h-3.5 text-emerald-400" />
              <span>Download Excel</span>
            </button>
          </div>
        </div>

        <div v-if="filteredIncomes.length" class="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          <TransactionRow
            v-for="item in filteredIncomes"
            :key="item.id"
            :item="item"
            @delete="deleteTarget = item"
          />
        </div>
        <div v-else class="text-center py-12 text-slate-400 text-sm">
          No income records match your search.
        </div>
      </div>
    </div>

    <!-- Add Income Modal -->
    <div
      v-if="showAddModal"
      class="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4"
    >
      <div class="w-full max-w-md rounded-3xl bg-slate-900 border border-slate-800 p-6 shadow-2xl space-y-5">
        <div class="flex items-center justify-between border-b border-slate-800 pb-4">
          <h3 class="text-base font-bold text-white">Add New Income</h3>
          <button
            type="button"
            @click="showAddModal = false"
            class="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X class="w-4 h-4" />
          </button>
        </div>

        <form @submit.prevent="handleAddIncome" class="space-y-4">
          <EmojiPickerPopup v-model="form.icon" label="Income Category Icon" />

          <div>
            <label class="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
              Income Source
            </label>
            <input
              v-model="form.source"
              type="text"
              required
              placeholder="Freelance, Salary, Dividend..."
              class="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-violet-500"
            />
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                Amount (USD)
              </label>
              <input
                v-model="form.amount"
                type="number"
                min="1"
                step="any"
                required
                placeholder="1500"
                class="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-violet-500"
              />
            </div>

            <div>
              <label class="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                Date
              </label>
              <input
                v-model="form.date"
                type="date"
                required
                class="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-violet-500"
              />
            </div>
          </div>

          <div>
            <label class="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
              Notes (Optional)
            </label>
            <input
              v-model="form.notes"
              type="text"
              placeholder="Client milestone or payout details..."
              class="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-violet-500"
            />
          </div>

          <div class="flex justify-end gap-2.5 pt-2">
            <button
              type="button"
              @click="showAddModal = false"
              class="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-600/25"
            >
              Add Income
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Delete Alert Modal -->
    <div
      v-if="deleteTarget"
      class="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4"
    >
      <div class="w-full max-w-sm rounded-3xl bg-slate-900 border border-slate-800 p-6 shadow-2xl space-y-4">
        <h3 class="text-base font-bold text-white">Delete Income</h3>
        <p class="text-xs text-slate-300">
          Are you sure you want to delete <strong class="text-white">{{ deleteTarget.source }}</strong> (${{ Number(deleteTarget.amount).toLocaleString() }})?
        </p>
        <div class="flex justify-end gap-2.5 pt-2">
          <button
            type="button"
            @click="deleteTarget = null"
            class="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
          >
            Cancel
          </button>
          <button
            type="button"
            @click="confirmDelete"
            class="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  </DashboardLayout>
</template>
