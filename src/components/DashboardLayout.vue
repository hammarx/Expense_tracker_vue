<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useFinanceStore } from '@/stores/finance'
import {
  LayoutDashboard,
  TrendingUp,
  TrendingDown,
  Database,
  LogOut,
  Download,
  RotateCcw,
  Menu,
  X,
  Wallet,
  Sparkles,
} from 'lucide-vue-next'

const store = useFinanceStore()
const router = useRouter()
const route = useRoute()
const mobileMenuOpen = ref(false)
const showDbModal = ref(false)
const fileInput = ref(null)

const navItems = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { name: 'Income', path: '/income', icon: TrendingUp },
  { name: 'Expenses', path: '/expense', icon: TrendingDown },
]

function handleLogout() {
  store.logout()
  router.push('/login')
}

function triggerJsonImport() {
  fileInput.value?.click()
}

async function onFileSelected(event) {
  const file = event.target.files?.[0]
  if (!file) return
  try {
    const text = await file.text()
    await store.importBackupJSON(text)
    showDbModal.value = false
  } catch (err) {
    store.showToast(err.message || 'Failed to import JSON file', 'error')
  } finally {
    event.target.value = ''
  }
}

function getInitials(name = '') {
  return name
    .split(' ')
    .map((p) => p[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}
</script>

<template>
  <div class="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
    <!-- Top Navbar -->
    <header
      class="sticky top-0 z-30 h-16 bg-slate-950/85 backdrop-blur-xl border-b border-slate-800/80 px-4 lg:px-8 flex items-center justify-between"
    >
      <div class="flex items-center gap-3">
        <button
          type="button"
          @click="mobileMenuOpen = !mobileMenuOpen"
          class="lg:hidden p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300"
        >
          <X v-if="mobileMenuOpen" class="w-5 h-5" />
          <Menu v-else class="w-5 h-5" />
        </button>

        <router-link to="/dashboard" class="flex items-center gap-3">
          <div
            class="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-600/25"
          >
            <Wallet class="w-5 h-5 text-white" />
          </div>
          <div>
            <div class="flex items-center gap-2">
              <span class="font-extrabold text-lg tracking-tight text-white">FinPulse</span>
              <span
                class="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-violet-500/15 text-violet-300 border border-violet-500/30"
              >
                Vue 3
              </span>
            </div>
            <p class="text-[11px] text-slate-400 hidden sm:block">
              Smart Personal Expense & Income Tracker
            </p>
          </div>
        </router-link>
      </div>

      <div class="flex items-center gap-2.5">
        <button
          type="button"
          @click="showDbModal = true"
          class="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 transition"
        >
          <Database class="w-3.5 h-3.5 text-violet-400" />
          <span class="hidden sm:inline">Database & Backup</span>
        </button>

        <button
          type="button"
          @click="store.exportToExcel('all')"
          class="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-violet-600 hover:bg-violet-500 text-white shadow-lg shadow-violet-600/20 transition"
        >
          <Download class="w-3.5 h-3.5" />
          <span class="hidden sm:inline">Export Excel</span>
        </button>
      </div>
    </header>

    <div class="flex flex-1">
      <!-- Sidebar Navigation -->
      <aside
        class="fixed lg:static inset-y-0 left-0 z-20 w-64 bg-slate-950 border-r border-slate-800/80 pt-20 lg:pt-6 pb-6 px-4 flex flex-col justify-between transition-transform duration-200"
        :class="mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'"
      >
        <div class="space-y-6">
          <!-- User Profile Card -->
          <div
            class="p-4 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-900/50 border border-slate-800/90 flex flex-col items-center text-center"
          >
            <div class="relative mb-3">
              <img
                v-if="store.currentUser?.profileImageUrl"
                :src="store.currentUser.profileImageUrl"
                alt="Profile"
                class="w-16 h-16 rounded-2xl object-cover border-2 border-violet-500/50"
              />
              <div
                v-else
                class="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-600 flex items-center justify-center text-xl font-extrabold text-white shadow-lg shadow-violet-600/20"
              >
                {{ getInitials(store.currentUser?.fullName || 'Alex Morgan') }}
              </div>
              <span
                class="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-slate-900"
                title="Local IndexedDB Connected"
              ></span>
            </div>
            <h3 class="font-bold text-slate-100 text-sm">
              {{ store.currentUser?.fullName }}
            </h3>
            <p class="text-xs text-slate-400 truncate max-w-full">
              {{ store.currentUser?.email }}
            </p>
            <div
              class="mt-3 w-full pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs"
            >
              <span class="text-slate-400">Savings Rate</span>
              <span class="font-bold text-emerald-400">{{ store.savingsRate }}%</span>
            </div>
          </div>

          <!-- Nav Links -->
          <nav class="space-y-1.5">
            <router-link
              v-for="item in navItems"
              :key="item.path"
              :to="item.path"
              @click="mobileMenuOpen = false"
              class="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all"
              :class="
                route.path === item.path
                  ? 'bg-violet-600 text-white shadow-lg shadow-violet-600/25'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900'
              "
            >
              <component :is="item.icon" class="w-4 h-4" />
              <span>{{ item.name }}</span>
            </router-link>
          </nav>
        </div>

        <div class="space-y-3 pt-6 border-t border-slate-800/80">
          <button
            type="button"
            @click="store.resetDemo()"
            class="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-violet-300 hover:bg-violet-500/10 transition"
          >
            <RotateCcw class="w-4 h-4" />
            <span>Reset Demo Data</span>
          </button>

          <button
            type="button"
            @click="handleLogout()"
            class="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-semibold text-rose-400 hover:bg-rose-500/10 transition"
          >
            <LogOut class="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      <!-- Main Content Area -->
      <main class="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
        <slot />
      </main>
    </div>

    <!-- Database & Backup Modal -->
    <div
      v-if="showDbModal"
      class="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4"
    >
      <div
        class="w-full max-w-md rounded-3xl bg-slate-900 border border-slate-800 p-6 shadow-2xl space-y-5"
      >
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2.5">
            <div
              class="w-10 h-10 rounded-xl bg-violet-500/15 border border-violet-500/30 flex items-center justify-center text-violet-400"
            >
              <Database class="w-5 h-5" />
            </div>
            <div>
              <h3 class="font-bold text-slate-100">Browser IndexedDB Engine</h3>
              <p class="text-xs text-slate-400">100% Free, persistent, offline-ready storage</p>
            </div>
          </div>
          <button
            type="button"
            @click="showDbModal = false"
            class="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X class="w-4 h-4" />
          </button>
        </div>

        <p class="text-xs text-slate-300 leading-relaxed bg-slate-950/70 p-3.5 rounded-2xl border border-slate-800">
          Your transactions are stored directly in your browser's <strong class="text-violet-300">IndexedDB</strong> database. It requires zero credit cards or paid servers, never sleeps on Netlify, and persists across page reloads.
        </p>

        <div class="space-y-2.5">
          <button
            type="button"
            @click="store.exportBackupJSON()"
            class="w-full py-2.5 px-4 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold transition flex items-center justify-center gap-2"
          >
            <Download class="w-4 h-4" />
            <span>Download Full Database Backup (.JSON)</span>
          </button>

          <button
            type="button"
            @click="triggerJsonImport"
            class="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition flex items-center justify-center gap-2"
          >
            <Sparkles class="w-4 h-4 text-violet-400" />
            <span>Restore / Import Database Backup (.JSON)</span>
          </button>
          <input
            ref="fileInput"
            type="file"
            accept=".json"
            class="hidden"
            @change="onFileSelected"
          />

          <button
            type="button"
            @click="store.resetDemo(); showDbModal = false"
            class="w-full py-2.5 px-4 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/20 text-xs font-semibold transition flex items-center justify-center gap-2"
          >
            <RotateCcw class="w-4 h-4" />
            <span>Reset Database to Fresh Portfolio Seed Data</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
