import { createRouter, createWebHistory } from 'vue-router'
import { useFinanceStore } from '@/stores/finance'
import DashboardView from '@/views/DashboardView.vue'
import IncomeView from '@/views/IncomeView.vue'
import ExpenseView from '@/views/ExpenseView.vue'
import LoginView from '@/views/LoginView.vue'
import SignUpView from '@/views/SignUpView.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', redirect: '/dashboard' },
    { path: '/dashboard', name: 'dashboard', component: DashboardView, meta: { requiresAuth: true } },
    { path: '/income', name: 'income', component: IncomeView, meta: { requiresAuth: true } },
    { path: '/expense', name: 'expense', component: ExpenseView, meta: { requiresAuth: true } },
    { path: '/login', name: 'login', component: LoginView },
    { path: '/signup', name: 'signup', component: SignUpView },
  ],
})

router.beforeEach(async (to) => {
  const store = useFinanceStore()
  if (!store.isReady) {
    await store.initApp()
  }
  if (to.meta.requiresAuth && !store.currentUser) {
    return '/login'
  }
  if ((to.path === '/login' || to.path === '/signup') && store.currentUser) {
    return '/dashboard'
  }
})

export default router
