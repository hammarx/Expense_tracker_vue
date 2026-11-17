import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import * as XLSX from 'xlsx'
import {
  dbGetAll,
  dbPut,
  dbDelete,
  ensureSeeded,
  resetToDemoData,
  DEMO_USER,
} from '@/services/db'

export const useFinanceStore = defineStore('finance', () => {
  const currentUser = ref(null)
  const incomes = ref([])
  const expenses = ref([])
  const isReady = ref(false)
  const toasts = ref([])

  function showToast(message, type = 'success') {
    const id = Date.now() + Math.random()
    toasts.value.push({ id, message, type })
    setTimeout(() => {
      toasts.value = toasts.value.filter((t) => t.id !== id)
    }, 3500)
  }

  async function initApp() {
    await ensureSeeded()
    const users = await dbGetAll('users')
    const savedUserId = localStorage.getItem('finpulse_active_user_id')
    if (savedUserId) {
      currentUser.value = users.find((u) => u.id === savedUserId) || null
    }
    if (!currentUser.value && users.length > 0) {
      const explicitlyLoggedOut = localStorage.getItem('finpulse_logged_out') === 'true'
      if (!explicitlyLoggedOut) {
        currentUser.value = users[0]
        localStorage.setItem('finpulse_active_user_id', currentUser.value.id)
      }
    }
    await loadUserTransactions()
    isReady.value = true
  }

  async function loadUserTransactions() {
    if (!currentUser.value) {
      incomes.value = []
      expenses.value = []
      return
    }
    const allIncomes = await dbGetAll('incomes')
    const allExpenses = await dbGetAll('expenses')
    incomes.value = allIncomes
      .filter((i) => i.userId === currentUser.value.id)
      .sort((a, b) => new Date(b.date) - new Date(a.date))
    expenses.value = allExpenses
      .filter((e) => e.userId === currentUser.value.id)
      .sort((a, b) => new Date(b.date) - new Date(a.date))
  }

  async function login(email, password) {
    const users = await dbGetAll('users')
    const found = users.find(
      (u) => u.email.toLowerCase() === email.trim().toLowerCase() && u.passwordHash === password
    )
    if (!found) {
      throw new Error('Invalid email or password. Try the Demo Account button!')
    }
    currentUser.value = found
    localStorage.setItem('finpulse_active_user_id', found.id)
    localStorage.removeItem('finpulse_logged_out')
    await loadUserTransactions()
    showToast(`Welcome back, ${found.fullName}!`, 'success')
  }

  async function loginAsDemo() {
    await ensureSeeded()
    const users = await dbGetAll('users')
    const demo = users.find((u) => u.id === DEMO_USER.id) || users[0]
    currentUser.value = demo
    localStorage.setItem('finpulse_active_user_id', demo.id)
    localStorage.removeItem('finpulse_logged_out')
    await loadUserTransactions()
    showToast('Signed in with Portfolio Demo Account', 'success')
  }

  async function register({ fullName, email, password, profileImageUrl, monthlyBudget = 4000 }) {
    const users = await dbGetAll('users')
    const exists = users.some((u) => u.email.toLowerCase() === email.trim().toLowerCase())
    if (exists) {
      throw new Error('An account with this email already exists.')
    }
    const newUser = {
      id: 'user-' + Date.now(),
      fullName: fullName.trim(),
      email: email.trim().toLowerCase(),
      passwordHash: password,
      role: 'Personal Account',
      currency: 'USD',
      monthlyBudget: Number(monthlyBudget) || 4000,
      profileImageUrl: profileImageUrl || '',
      createdAt: new Date().toISOString().split('T')[0],
    }
    await dbPut('users', newUser)
    currentUser.value = newUser
    localStorage.setItem('finpulse_active_user_id', newUser.id)
    localStorage.removeItem('finpulse_logged_out')
    await loadUserTransactions()
    showToast(`Account created! Welcome, ${newUser.fullName}`, 'success')
  }

  function logout() {
    currentUser.value = null
    incomes.value = []
    expenses.value = []
    localStorage.removeItem('finpulse_active_user_id')
    localStorage.setItem('finpulse_logged_out', 'true')
    showToast('Signed out successfully', 'info')
  }

  async function addIncome({ icon, source, amount, date, notes }) {
    if (!currentUser.value) return
    const item = {
      id: 'inc-' + Date.now(),
      userId: currentUser.value.id,
      icon: icon || '💰',
      source: source.trim(),
      amount: Number(amount),
      date,
      type: 'income',
      notes: (notes || '').trim(),
      createdAt: new Date().toISOString(),
    }
    await dbPut('incomes', item)
    await loadUserTransactions()
    showToast(`Added income: ${item.source} (+$${item.amount.toLocaleString()})`, 'success')
  }

  async function deleteIncome(id) {
    await dbDelete('incomes', id)
    await loadUserTransactions()
    showToast('Income record removed', 'info')
  }

  async function addExpense({ icon, category, amount, date, notes }) {
    if (!currentUser.value) return
    const item = {
      id: 'exp-' + Date.now(),
      userId: currentUser.value.id,
      icon: icon || '🛍️',
      category: category.trim(),
      amount: Number(amount),
      date,
      type: 'expense',
      notes: (notes || '').trim(),
      createdAt: new Date().toISOString(),
    }
    await dbPut('expenses', item)
    await loadUserTransactions()
    showToast(`Added expense: ${item.category} (-$${item.amount.toLocaleString()})`, 'success')
  }

  async function deleteExpense(id) {
    await dbDelete('expenses', id)
    await loadUserTransactions()
    showToast('Expense record removed', 'info')
  }

  async function updateBudget(newBudget) {
    if (!currentUser.value) return
    const updated = { ...currentUser.value, monthlyBudget: Number(newBudget) || 0 }
    await dbPut('users', updated)
    currentUser.value = updated
    showToast('Monthly budget target updated!', 'success')
  }

  async function resetDemo() {
    await resetToDemoData()
    await loginAsDemo()
    showToast('Database reset to fresh portfolio demo data!', 'success')
  }

  function exportToExcel(type = 'all') {
    const wb = XLSX.utils.book_new()
    if (type === 'income' || type === 'all') {
      const incomeRows = incomes.value.map((i) => ({
        Icon: i.icon,
        Source: i.source,
        Amount_USD: i.amount,
        Date: i.date,
        Notes: i.notes || '',
      }))
      const wsIncome = XLSX.utils.json_to_sheet(incomeRows)
      XLSX.utils.book_append_sheet(wb, wsIncome, 'Income')
    }
    if (type === 'expense' || type === 'all') {
      const expenseRows = expenses.value.map((e) => ({
        Icon: e.icon,
        Category: e.category,
        Amount_USD: e.amount,
        Date: e.date,
        Notes: e.notes || '',
      }))
      const wsExpense = XLSX.utils.json_to_sheet(expenseRows)
      XLSX.utils.book_append_sheet(wb, wsExpense, 'Expenses')
    }
    const fileName =
      type === 'income'
        ? 'FinPulse_Income_Report.xlsx'
        : type === 'expense'
          ? 'FinPulse_Expense_Report.xlsx'
          : 'FinPulse_Complete_Financial_Report.xlsx'
    XLSX.writeFile(wb, fileName)
    showToast(`Downloaded ${fileName}`, 'success')
  }

  async function exportBackupJSON() {
    const payload = {
      exportedAt: new Date().toISOString(),
      user: currentUser.value,
      incomes: incomes.value,
      expenses: expenses.value,
    }
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `finpulse-backup-${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
    showToast('Exported JSON database snapshot', 'success')
  }

  async function importBackupJSON(jsonString) {
    const parsed = JSON.parse(jsonString)
    if (!parsed || !Array.isArray(parsed.incomes) || !Array.isArray(parsed.expenses)) {
      throw new Error('Invalid backup JSON file format.')
    }
    const uid = currentUser.value?.id || DEMO_USER.id
    for (const inc of parsed.incomes) {
      await dbPut('incomes', { ...inc, userId: uid })
    }
    for (const exp of parsed.expenses) {
      await dbPut('expenses', { ...exp, userId: uid })
    }
    await loadUserTransactions()
    showToast('Imported database records successfully!', 'success')
  }

  const totalIncome = computed(() =>
    incomes.value.reduce((sum, item) => sum + Number(item.amount || 0), 0)
  )

  const totalExpense = computed(() =>
    expenses.value.reduce((sum, item) => sum + Number(item.amount || 0), 0)
  )

  const totalBalance = computed(() => totalIncome.value - totalExpense.value)

  const savingsRate = computed(() => {
    if (totalIncome.value <= 0) return 0
    return Math.max(0, Math.round(((totalIncome.value - totalExpense.value) / totalIncome.value) * 100))
  })

  const recentTransactions = computed(() => {
    const combined = [
      ...incomes.value.map((i) => ({ ...i, title: i.source, type: 'income' })),
      ...expenses.value.map((e) => ({ ...e, title: e.category, type: 'expense' })),
    ]
    return combined.sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 6)
  })

  const last30DaysExpenses = computed(() => {
    const cutoff = new Date()
    cutoff.setDate(cutoff.getDate() - 30)
    return expenses.value.filter((e) => new Date(e.date) >= cutoff)
  })

  const last60DaysIncomes = computed(() => {
    const cutoff = new Date()
    cutoff.setDate(cutoff.getDate() - 60)
    return incomes.value.filter((i) => new Date(i.date) >= cutoff)
  })

  return {
    currentUser,
    incomes,
    expenses,
    isReady,
    toasts,
    totalIncome,
    totalExpense,
    totalBalance,
    savingsRate,
    recentTransactions,
    last30DaysExpenses,
    last60DaysIncomes,
    showToast,
    initApp,
    login,
    loginAsDemo,
    register,
    logout,
    addIncome,
    deleteIncome,
    addExpense,
    deleteExpense,
    updateBudget,
    resetDemo,
    exportToExcel,
    exportBackupJSON,
    importBackupJSON,
  }
})
