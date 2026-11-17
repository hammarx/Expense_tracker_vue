// Zero-cost, zero-credit-card persistent IndexedDB + LocalStorage engine
// Works 100% offline and live on Netlify / GitHub Pages / Vercel with zero server sleep or cost.

const DB_NAME = 'FinPulseExpenseTrackerDB'
const DB_VERSION = 1

function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION)
    request.onupgradeneeded = (event) => {
      const db = event.target.result
      if (!db.objectStoreNames.contains('users')) {
        const userStore = db.createObjectStore('users', { keyPath: 'id' })
        userStore.createIndex('email', 'email', { unique: true })
      }
      if (!db.objectStoreNames.contains('incomes')) {
        const incomeStore = db.createObjectStore('incomes', { keyPath: 'id' })
        incomeStore.createIndex('userId', 'userId', { unique: false })
      }
      if (!db.objectStoreNames.contains('expenses')) {
        const expenseStore = db.createObjectStore('expenses', { keyPath: 'id' })
        expenseStore.createIndex('userId', 'userId', { unique: false })
      }
    }
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}

export async function dbGetAll(storeName) {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, 'readonly')
    const store = tx.objectStore(storeName)
    const req = store.getAll()
    req.onsuccess = () => resolve(req.result || [])
    req.onerror = () => reject(req.error)
  })
}

export async function dbPut(storeName, item) {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, 'readwrite')
    const store = tx.objectStore(storeName)
    const req = store.put(item)
    req.onsuccess = () => resolve(item)
    req.onerror = () => reject(req.error)
  })
}

export async function dbDelete(storeName, id) {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, 'readwrite')
    const store = tx.objectStore(storeName)
    const req = store.delete(id)
    req.onsuccess = () => resolve(true)
    req.onerror = () => reject(req.error)
  })
}

export async function dbClearStore(storeName) {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, 'readwrite')
    const store = tx.objectStore(storeName)
    const req = store.clear()
    req.onsuccess = () => resolve(true)
    req.onerror = () => reject(req.error)
  })
}

function daysAgo(days) {
  const d = new Date()
  d.setDate(d.getDate() - days)
  return d.toISOString().split('T')[0]
}

export const DEMO_USER = {
  id: 'user-demo-portfolio',
  fullName: 'Alex Morgan',
  email: 'demo@finpulse.dev',
  passwordHash: 'demo1234',
  role: 'Product Designer & Developer',
  currency: 'USD',
  monthlyBudget: 4200,
  profileImageUrl: '',
  createdAt: daysAgo(90),
}

export function getSeedIncomes(userId = DEMO_USER.id) {
  return [
    {
      id: 'inc-1',
      userId,
      icon: '💼',
      source: 'Senior Frontend Salary',
      amount: 5400,
      date: daysAgo(2),
      type: 'income',
      notes: 'Monthly net salary deposit',
      createdAt: daysAgo(2),
    },
    {
      id: 'inc-2',
      userId,
      icon: '🚀',
      source: 'Freelance UI/UX Design',
      amount: 1350,
      date: daysAgo(9),
      type: 'income',
      notes: 'SaaS Dashboard redesign milestone',
      createdAt: daysAgo(9),
    },
    {
      id: 'inc-3',
      userId,
      icon: '📈',
      source: 'ETF & Dividend Payout',
      amount: 420,
      date: daysAgo(16),
      type: 'income',
      notes: 'Quarterly S&P 500 & Tech ETF distribution',
      createdAt: daysAgo(16),
    },
    {
      id: 'inc-4',
      userId,
      icon: '💻',
      source: 'Open Source Sponsorship',
      amount: 280,
      date: daysAgo(23),
      type: 'income',
      notes: 'GitHub Sponsors & BuyMeACoffee',
      createdAt: daysAgo(23),
    },
    {
      id: 'inc-5',
      userId,
      icon: '💼',
      source: 'Senior Frontend Salary',
      amount: 5400,
      date: daysAgo(32),
      type: 'income',
      notes: 'Previous month salary deposit',
      createdAt: daysAgo(32),
    },
    {
      id: 'inc-6',
      userId,
      icon: '🎨',
      source: 'Figma UI Kit Sales',
      amount: 640,
      date: daysAgo(44),
      type: 'income',
      notes: 'Digital product marketplace payout',
      createdAt: daysAgo(44),
    },
  ]
}

export function getSeedExpenses(userId = DEMO_USER.id) {
  return [
    {
      id: 'exp-1',
      userId,
      icon: '🏠',
      category: 'Apartment Rent & Utilities',
      amount: 1650,
      date: daysAgo(1),
      type: 'expense',
      notes: 'Monthly city loft rent + fiber internet',
      createdAt: daysAgo(1),
    },
    {
      id: 'exp-2',
      userId,
      icon: '🛒',
      category: 'Whole Foods & Groceries',
      amount: 340,
      date: daysAgo(3),
      type: 'expense',
      notes: 'Weekly organic groceries & household items',
      createdAt: daysAgo(3),
    },
    {
      id: 'exp-3',
      userId,
      icon: '☁️',
      category: 'Cloud & AI Subscriptions',
      amount: 95,
      date: daysAgo(5),
      type: 'expense',
      notes: 'Vercel Pro, GitHub Copilot, Figma & Domains',
      createdAt: daysAgo(5),
    },
    {
      id: 'exp-4',
      userId,
      icon: '🍣',
      category: 'Dining Out & Specialty Coffee',
      amount: 145,
      date: daysAgo(7),
      type: 'expense',
      notes: 'Weekend dinner with friends & espresso beans',
      createdAt: daysAgo(7),
    },
    {
      id: 'exp-5',
      userId,
      icon: '🏋️',
      category: 'Fitness & Wellness Club',
      amount: 120,
      date: daysAgo(11),
      type: 'expense',
      notes: 'Monthly gym membership & swimming pass',
      createdAt: daysAgo(11),
    },
    {
      id: 'exp-6',
      userId,
      icon: '✈️',
      category: 'Weekend Berlin Flight & Hotel',
      amount: 490,
      date: daysAgo(15),
      type: 'expense',
      notes: 'Tech conference trip & boutique hotel',
      createdAt: daysAgo(15),
    },
    {
      id: 'exp-7',
      userId,
      icon: '🎧',
      category: 'Workspace Gear Upgrade',
      amount: 260,
      date: daysAgo(19),
      type: 'expense',
      notes: 'Mechanical keyboard & desk mat',
      createdAt: daysAgo(19),
    },
    {
      id: 'exp-8',
      userId,
      icon: '🚕',
      category: 'Transit & Mobility Pass',
      amount: 85,
      date: daysAgo(24),
      type: 'expense',
      notes: 'Monthly metro pass & Uber rides',
      createdAt: daysAgo(24),
    },
    {
      id: 'exp-9',
      userId,
      icon: '🏠',
      category: 'Apartment Rent & Utilities',
      amount: 1650,
      date: daysAgo(31),
      type: 'expense',
      notes: 'Previous month rent',
      createdAt: daysAgo(31),
    },
  ]
}

export async function ensureSeeded() {
  const users = await dbGetAll('users')
  if (users.length === 0) {
    await dbPut('users', DEMO_USER)
    const incomes = getSeedIncomes(DEMO_USER.id)
    for (const inc of incomes) {
      await dbPut('incomes', inc)
    }
    const expenses = getSeedExpenses(DEMO_USER.id)
    for (const exp of expenses) {
      await dbPut('expenses', exp)
    }
  }
}

export async function resetToDemoData() {
  await dbClearStore('users')
  await dbClearStore('incomes')
  await dbClearStore('expenses')
  await ensureSeeded()
}
