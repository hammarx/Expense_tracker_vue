<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useFinanceStore } from '@/stores/finance'
import DashboardLayout from '@/components/DashboardLayout.vue'
import TransactionRow from '@/components/TransactionRow.vue'
import FinanceChart from '@/components/FinanceChart.vue'
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  ArrowRight,
  Target,
  Plus,
  Edit3,
  Check,
} from 'lucide-vue-next'

const store = useFinanceStore()
const router = useRouter()

const editingBudget = ref(false)
const budgetInput = ref(store.currentUser?.monthlyBudget || 4200)

function saveBudget() {
  store.updateBudget(budgetInput.value)
  editingBudget.value = false
}

const budgetUsedPercent = computed(() => {
  const budget = Number(store.currentUser?.monthlyBudget || 4200)
  if (budget <= 0) return 0
  return Math.min(100, Math.round((store.totalExpense / budget) * 100))
})

// Last 30 days expenses grouped by category for the Bar chart
const last30ExpenseChart = computed(() => {
  const map = new Map()
  for (const exp of store.last30DaysExpenses) {
    const key = exp.category
    map.set(key, (map.get(key) || 0) + Number(exp.amount))
  }
  const labels = Array.from(map.keys())
  const values = Array.from(map.values())
  return {
    labels: labels.length ? labels : ['No Expenses Yet'],
    values: values.length ? values : [0],
  }
})

// Last 60 days income grouped by source for the Doughnut chart
const last60IncomeChart = computed(() => {
  const map = new Map()
  for (const inc of store.last60DaysIncomes) {
    const key = inc.source
    map.set(key, (map.get(key) || 0) + Number(inc.amount))
  }
  const labels = Array.from(map.keys())
  const values = Array.from(map.values())
  return {
    labels: labels.length ? labels : ['No Income Yet'],
    values: values.length ? values : [0],
  }
})
</script>

<template>
  <DashboardLayout>
    <div class="space-y-8">
      <!-- Top Welcome Banner -->
      <div
        class="relative overflow-hidden rounded-3xl bg-gradient-to-r from-violet-950/80 via-slate-900 to-indigo-950/80 border border-violet-500/25 p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
      >
        <div class="space-y-1.5">
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/15 border border-violet-500/30 text-violet-300 text-xs font-semibold">
            <span>✨ Financial Overview</span>
          </div>
          <h1 class="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Welcome back, {{ store.currentUser?.fullName?.split(' ')[0] || 'Alex' }} 👋
          </h1>
          <p class="text-sm text-slate-300 max-w-xl">
            Track your cash flow, analyze 30-day spending patterns, and export clean Excel reports in one click.
          </p>
        </div>

        <div class="flex flex-wrap items-center gap-3">
          <button
            type="button"
            @click="router.push('/income')"
            class="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-600/20 transition"
          >
            <Plus class="w-4 h-4" />
            <span>Add Income</span>
          </button>
          <button
            type="button"
            @click="router.push('/expense')"
            class="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-lg shadow-rose-600/20 transition"
          >
            <Plus class="w-4 h-4" />
            <span>Add Expense</span>
          </button>
        </div>
      </div>

      <!-- 3 Summary KPI InfoCards (matching original Expense_tracker InfoCard.jsx) -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
        <!-- Total Balance -->
        <div
          class="p-6 rounded-3xl bg-slate-900/90 border border-slate-800/90 shadow-xl flex items-center gap-5"
        >
          <div
            class="w-14 h-14 rounded-2xl bg-violet-600 flex items-center justify-center text-white shadow-lg shadow-violet-600/30 shrink-0"
          >
            <Wallet class="w-6 h-6" />
          </div>
          <div>
            <p class="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Total Balance
            </p>
            <h2 class="text-2xl sm:text-3xl font-extrabold text-white mt-0.5">
              ${{ store.totalBalance.toLocaleString() }}
            </h2>
            <p class="text-xs text-violet-300 mt-1">
              Savings rate: {{ store.savingsRate }}% of income
            </p>
          </div>
        </div>

        <!-- Total Income -->
        <div
          class="p-6 rounded-3xl bg-slate-900/90 border border-slate-800/90 shadow-xl flex items-center gap-5"
        >
          <div
            class="w-14 h-14 rounded-2xl bg-emerald-600 flex items-center justify-center text-white shadow-lg shadow-emerald-600/30 shrink-0"
          >
            <TrendingUp class="w-6 h-6" />
          </div>
          <div>
            <p class="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Total Income
            </p>
            <h2 class="text-2xl sm:text-3xl font-extrabold text-emerald-400 mt-0.5">
              ${{ store.totalIncome.toLocaleString() }}
            </h2>
            <p class="text-xs text-slate-400 mt-1">
              {{ store.incomes.length }} recorded income streams
            </p>
          </div>
        </div>

        <!-- Total Expenses -->
        <div
          class="p-6 rounded-3xl bg-slate-900/90 border border-slate-800/90 shadow-xl flex items-center gap-5"
        >
          <div
            class="w-14 h-14 rounded-2xl bg-rose-600 flex items-center justify-center text-white shadow-lg shadow-rose-600/30 shrink-0"
          >
            <TrendingDown class="w-6 h-6" />
          </div>
          <div>
            <p class="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Total Expenses
            </p>
            <h2 class="text-2xl sm:text-3xl font-extrabold text-rose-400 mt-0.5">
              ${{ store.totalExpense.toLocaleString() }}
            </h2>
            <p class="text-xs text-slate-400 mt-1">
              {{ store.expenses.length }} recorded expense items
            </p>
          </div>
        </div>
      </div>

      <!-- Monthly Budget Goal Bar -->
      <div class="p-6 rounded-3xl bg-slate-900/80 border border-slate-800/90 space-y-3">
        <div class="flex flex-wrap items-center justify-between gap-2">
          <div class="flex items-center gap-2.5">
            <Target class="w-5 h-5 text-violet-400" />
            <h3 class="text-sm font-bold text-slate-100">Monthly Spending Budget Goal</h3>
          </div>

          <div class="flex items-center gap-2">
            <template v-if="editingBudget">
              <input
                v-model="budgetInput"
                type="number"
                min="100"
                class="w-28 px-3 py-1 rounded-lg bg-slate-950 border border-violet-500 text-xs text-white"
              />
              <button
                type="button"
                @click="saveBudget"
                class="p-1.5 rounded-lg bg-emerald-600 text-white"
              >
                <Check class="w-3.5 h-3.5" />
              </button>
            </template>
            <template v-else>
              <span class="text-xs text-slate-300">
                <strong class="text-white">${{ store.totalExpense.toLocaleString() }}</strong> spent of
                <strong class="text-violet-300">${{ Number(store.currentUser?.monthlyBudget || 4200).toLocaleString() }}</strong>
              </span>
              <button
                type="button"
                @click="editingBudget = true"
                class="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
                title="Edit monthly budget"
              >
                <Edit3 class="w-3.5 h-3.5" />
              </button>
            </template>
          </div>
        </div>

        <div class="w-full h-3 rounded-full bg-slate-950 overflow-hidden p-0.5 border border-slate-800">
          <div
            class="h-full rounded-full transition-all duration-500"
            :class="
              budgetUsedPercent > 90
                ? 'bg-gradient-to-r from-rose-500 to-orange-500'
                : 'bg-gradient-to-r from-violet-600 via-indigo-500 to-emerald-400'
            "
            :style="{ width: `${budgetUsedPercent}%` }"
          ></div>
        </div>
      </div>

      <!-- Row 1: Recent Transactions & Finance Overview Doughnut Chart -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Recent Transactions -->
        <div class="p-6 rounded-3xl bg-slate-900/90 border border-slate-800/90 flex flex-col justify-between space-y-5">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-base font-bold text-white">Recent Transactions</h3>
              <p class="text-xs text-slate-400">Latest income & expense activity</p>
            </div>
            <button
              type="button"
              @click="router.push('/expense')"
              class="flex items-center gap-1.5 text-xs font-semibold text-violet-400 hover:text-violet-300"
            >
              <span>See All</span>
              <ArrowRight class="w-3.5 h-3.5" />
            </button>
          </div>

          <div class="space-y-2.5">
            <TransactionRow
              v-for="tx in store.recentTransactions"
              :key="tx.id"
              :item="tx"
              :showDelete="false"
            />
          </div>
        </div>

        <!-- Finance Overview (Doughnut Chart) -->
        <div class="p-6 rounded-3xl bg-slate-900/90 border border-slate-800/90 flex flex-col justify-between space-y-5">
          <div>
            <h3 class="text-base font-bold text-white">Financial Overview</h3>
            <p class="text-xs text-slate-400">Balance vs Income vs Expenses breakdown</p>
          </div>

          <div class="h-72 flex items-center justify-center">
            <FinanceChart
              type="doughnut"
              :labels="['Total Balance', 'Total Expenses', 'Total Income']"
              :values="[Math.max(0, store.totalBalance), store.totalExpense, store.totalIncome]"
              :colors="['#8b5cf6', '#f43f5e', '#10b981']"
            />
          </div>
        </div>
      </div>

      <!-- Row 2: Last 30 Days Expenses Bar Chart & Expense List -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Expense Transactions -->
        <div class="p-6 rounded-3xl bg-slate-900/90 border border-slate-800/90 space-y-5">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-base font-bold text-white">Recent Expenses</h3>
              <p class="text-xs text-slate-400">Your latest spending categories</p>
            </div>
            <button
              type="button"
              @click="router.push('/expense')"
              class="flex items-center gap-1.5 text-xs font-semibold text-violet-400 hover:text-violet-300"
            >
              <span>Manage</span>
              <ArrowRight class="w-3.5 h-3.5" />
            </button>
          </div>

          <div class="space-y-2.5">
            <TransactionRow
              v-for="exp in store.expenses.slice(0, 5)"
              :key="exp.id"
              :item="exp"
              :showDelete="false"
            />
          </div>
        </div>

        <!-- Last 30 Days Expenses Chart -->
        <div class="p-6 rounded-3xl bg-slate-900/90 border border-slate-800/90 space-y-5">
          <div>
            <h3 class="text-base font-bold text-white">Last 30 Days Expenses</h3>
            <p class="text-xs text-slate-400">Category breakdown over the past month</p>
          </div>

          <div class="h-72">
            <FinanceChart
              type="bar"
              :labels="last30ExpenseChart.labels"
              :values="last30ExpenseChart.values"
              :colors="['#8b5cf6', '#a855f7', '#ec4899', '#f43f5e', '#6366f1']"
              datasetLabel="Spent ($)"
            />
          </div>
        </div>
      </div>

      <!-- Row 3: Last 60 Days Income Doughnut & Income List -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Last 60 Days Income Chart -->
        <div class="p-6 rounded-3xl bg-slate-900/90 border border-slate-800/90 space-y-5">
          <div>
            <h3 class="text-base font-bold text-white">Last 60 Days Income Streams</h3>
            <p class="text-xs text-slate-400">Distribution of revenue sources</p>
          </div>

          <div class="h-72">
            <FinanceChart
              type="doughnut"
              :labels="last60IncomeChart.labels"
              :values="last60IncomeChart.values"
              :colors="['#10b981', '#8b5cf6', '#3b82f6', '#f59e0b', '#ec4899']"
            />
          </div>
        </div>

        <!-- Recent Income -->
        <div class="p-6 rounded-3xl bg-slate-900/90 border border-slate-800/90 space-y-5">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-base font-bold text-white">Recent Income</h3>
              <p class="text-xs text-slate-400">Latest salary, freelance & investment payouts</p>
            </div>
            <button
              type="button"
              @click="router.push('/income')"
              class="flex items-center gap-1.5 text-xs font-semibold text-violet-400 hover:text-violet-300"
            >
              <span>Manage</span>
              <ArrowRight class="w-3.5 h-3.5" />
            </button>
          </div>

          <div class="space-y-2.5">
            <TransactionRow
              v-for="inc in store.incomes.slice(0, 5)"
              :key="inc.id"
              :item="inc"
              :showDelete="false"
            />
          </div>
        </div>
      </div>
    </div>
  </DashboardLayout>
</template>
