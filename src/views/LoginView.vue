<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useFinanceStore } from '@/stores/finance'
import { Wallet, Sparkles, Lock, Mail, ArrowRight } from 'lucide-vue-next'

const store = useFinanceStore()
const router = useRouter()

const email = ref('demo@finpulse.dev')
const password = ref('demo1234')
const errorMsg = ref('')

async function handleLogin() {
  errorMsg.value = ''
  try {
    await store.login(email.value, password.value)
    router.push('/dashboard')
  } catch (err) {
    errorMsg.value = err.message
  }
}

async function handleInstantDemo() {
  await store.loginAsDemo()
  router.push('/dashboard')
}
</script>

<template>
  <div class="min-h-screen bg-slate-950 text-slate-100 grid grid-cols-1 lg:grid-cols-2">
    <!-- Left Auth Form -->
    <div class="flex flex-col justify-between p-8 sm:p-12 lg:p-16">
      <div class="flex items-center gap-3">
        <div
          class="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-600/30"
        >
          <Wallet class="w-5 h-5 text-white" />
        </div>
        <span class="font-extrabold text-xl tracking-tight text-white">FinPulse</span>
      </div>

      <div class="max-w-md w-full mx-auto space-y-6 my-auto py-8">
        <div>
          <h1 class="text-2xl sm:text-3xl font-extrabold text-white">Welcome Back</h1>
          <p class="text-sm text-slate-400 mt-1">
            Sign in to manage your income, expenses, and analytics.
          </p>
        </div>

        <!-- Instant Portfolio Demo Button -->
        <button
          type="button"
          @click="handleInstantDemo"
          class="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-violet-600/20 to-indigo-600/20 hover:from-violet-600/30 hover:to-indigo-600/30 border border-violet-500/40 text-violet-200 text-xs font-bold flex items-center justify-center gap-2 transition"
        >
          <Sparkles class="w-4 h-4 text-violet-400" />
          <span>One-Click Portfolio Demo Sign In (Pre-loaded Data)</span>
        </button>

        <form @submit.prevent="handleLogin" class="space-y-4">
          <div>
            <label class="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
              Email Address
            </label>
            <div class="relative">
              <Mail class="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                v-model="email"
                type="email"
                required
                placeholder="demo@finpulse.dev"
                class="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white focus:outline-none focus:border-violet-500"
              />
            </div>
          </div>

          <div>
            <label class="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
              Password
            </label>
            <div class="relative">
              <Lock class="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                v-model="password"
                type="password"
                required
                placeholder="••••••••"
                class="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white focus:outline-none focus:border-violet-500"
              />
            </div>
          </div>

          <p v-if="errorMsg" class="text-xs text-rose-400 bg-rose-500/10 border border-rose-500/20 p-3 rounded-xl">
            {{ errorMsg }}
          </p>

          <button
            type="submit"
            class="w-full py-3 px-5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-sm font-bold shadow-lg shadow-violet-600/25 flex items-center justify-center gap-2 transition"
          >
            <span>Sign In</span>
            <ArrowRight class="w-4 h-4" />
          </button>
        </form>

        <p class="text-xs text-slate-400 text-center">
          Don't have an account?
          <router-link to="/signup" class="text-violet-400 font-bold hover:underline ml-1">
            Create Account
          </router-link>
        </p>
      </div>

      <p class="text-xs text-slate-500">
        Powered by Vue 3, Pinia & Browser IndexedDB — 100% Free & Offline-Ready
      </p>
    </div>

    <!-- Right Visual Showcase (matching original AuthLayout.jsx) -->
    <div
      class="hidden lg:flex flex-col justify-center p-16 bg-gradient-to-br from-violet-950 via-slate-900 to-slate-950 border-l border-slate-800/80 relative overflow-hidden"
    >
      <div class="max-w-lg mx-auto space-y-6 relative z-10">
        <div class="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl space-y-3">
          <p class="text-xs font-bold uppercase tracking-wider text-violet-400">
            Track Your Income & Expenses
          </p>
          <h2 class="text-3xl font-extrabold text-white">$430,000</h2>
          <p class="text-xs text-slate-400">
            Real-time category breakdowns, 30-day expense bars, 60-day income doughnuts, and instant `.xlsx` spreadsheet exports.
          </p>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div class="p-5 rounded-3xl bg-slate-900/80 border border-slate-800">
            <p class="text-xs text-slate-400">Monthly Savings Rate</p>
            <p class="text-2xl font-extrabold text-emerald-400 mt-1">+57%</p>
          </div>
          <div class="p-5 rounded-3xl bg-slate-900/80 border border-slate-800">
            <p class="text-xs text-slate-400">Database Storage</p>
            <p class="text-2xl font-extrabold text-violet-400 mt-1">IndexedDB</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
