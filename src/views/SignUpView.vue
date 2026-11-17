<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useFinanceStore } from '@/stores/finance'
import { Wallet, Upload, User, Mail, Lock, ArrowRight } from 'lucide-vue-next'

const store = useFinanceStore()
const router = useRouter()

const fullName = ref('')
const email = ref('')
const password = ref('')
const monthlyBudget = ref(4200)
const profileImageUrl = ref('')
const errorMsg = ref('')

function onAvatarChange(event) {
  const file = event.target.files?.[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = () => {
    profileImageUrl.value = String(reader.result || '')
  }
  reader.readAsDataURL(file)
}

async function handleSignUp() {
  errorMsg.value = ''
  if (!fullName.value.trim() || !email.value.trim() || password.value.length < 4) {
    errorMsg.value = 'Please fill in your full name, valid email, and a password (4+ chars).'
    return
  }
  try {
    await store.register({
      fullName: fullName.value,
      email: email.value,
      password: password.value,
      profileImageUrl: profileImageUrl.value,
      monthlyBudget: monthlyBudget.value,
    })
    router.push('/dashboard')
  } catch (err) {
    errorMsg.value = err.message
  }
}
</script>

<template>
  <div class="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-6">
    <div class="w-full max-w-lg rounded-3xl bg-slate-900/90 border border-slate-800 p-8 shadow-2xl space-y-6">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div
            class="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center"
          >
            <Wallet class="w-5 h-5 text-white" />
          </div>
          <span class="font-extrabold text-lg text-white">FinPulse</span>
        </div>
        <router-link to="/login" class="text-xs font-semibold text-violet-400 hover:underline">
          Back to Sign In
        </router-link>
      </div>

      <div>
        <h1 class="text-2xl font-extrabold text-white">Create an Account</h1>
        <p class="text-xs text-slate-400 mt-1">
          Join today by entering your details below. Everything stays privately in your browser database.
        </p>
      </div>

      <form @submit.prevent="handleSignUp" class="space-y-4">
        <!-- Profile Photo Selector (matching ProfilePhotoSelector.jsx) -->
        <div class="flex items-center gap-4">
          <div
            class="w-16 h-16 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center overflow-hidden shrink-0"
          >
            <img
              v-if="profileImageUrl"
              :src="profileImageUrl"
              alt="Avatar preview"
              class="w-full h-full object-cover"
            />
            <User v-else class="w-7 h-7 text-slate-500" />
          </div>
          <div>
            <label
              class="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 cursor-pointer transition"
            >
              <Upload class="w-3.5 h-3.5 text-violet-400" />
              <span>Upload Profile Photo (Optional)</span>
              <input type="file" accept="image/*" class="hidden" @change="onAvatarChange" />
            </label>
            <p class="text-[11px] text-slate-500 mt-1">Saved locally as Base64 in IndexedDB</p>
          </div>
        </div>

        <div>
          <label class="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
            Full Name
          </label>
          <div class="relative">
            <User class="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              v-model="fullName"
              type="text"
              required
              placeholder="John Doe"
              class="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-violet-500"
            />
          </div>
        </div>

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
              placeholder="john@example.com"
              class="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-violet-500"
            />
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                placeholder="Min 4 characters"
                class="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-violet-500"
              />
            </div>
          </div>

          <div>
            <label class="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
              Monthly Budget Goal ($)
            </label>
            <input
              v-model="monthlyBudget"
              type="number"
              min="100"
              class="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-violet-500"
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
          <span>Create Free Account</span>
          <ArrowRight class="w-4 h-4" />
        </button>
      </form>
    </div>
  </div>
</template>
