import React, { useState } from 'react'
import { Icon } from './Icon'

interface AppPreviewProps {
  prompt: string
  standalone?: boolean
  onBack?: () => void
}

export const AppPreview: React.FC<AppPreviewProps> = ({ prompt, standalone = false, onBack }) => {
  const p = prompt.toLowerCase()

  // Detect archetype
  const isHabit = p.includes('habit') || p.includes('routine') || p.includes('streak')
  const isFlashcard = p.includes('flashcard') || p.includes('quiz') || p.includes('study') || p.includes('learn')
  const isExpense = p.includes('expense') || p.includes('budget') || p.includes('money') || p.includes('split') || p.includes('finance')
  const isWorkout = p.includes('workout') || p.includes('fitness') || p.includes('gym') || p.includes('exercise')

  // Clean prompt title
  const cleanTitle = prompt
    .replace(/^(build me|create|make|help me|a|an)\s+(a|an)?\s*(simple\s+)?app\s+(that|for|to)?\s*/i, '')
    .trim()
  const displayTitle = cleanTitle
    ? cleanTitle.charAt(0).toUpperCase() + cleanTitle.slice(1, 45)
    : 'My Custom App'

  // Habit Tracker State
  const [habits, setHabits] = useState([
    { id: 1, name: 'Drink 2L Water', category: 'Health', streak: 12, doneToday: true },
    { id: 2, name: 'Read 20 pages', category: 'Mind', streak: 5, doneToday: false },
    { id: 3, name: 'Morning stretch / Yoga', category: 'Fitness', streak: 8, doneToday: true },
    { id: 4, name: 'Deep work focus block', category: 'Productivity', streak: 19, doneToday: false },
  ])
  const [newHabitName, setNewHabitName] = useState('')
  const [newHabitCat, setNewHabitCat] = useState('Health')

  // Flashcards State
  const [cards, setCards] = useState([
    { id: 1, front: 'What is memoization in React?', back: 'An optimization technique that caches component output or calculation values between renders using useMemo or React.memo.', known: false },
    { id: 2, front: 'What is the Virtual DOM?', back: 'A lightweight JavaScript representation of the real DOM tree used to calculate minimal updates via reconciliation.', known: true },
    { id: 3, front: 'What is Tailwind CSS?', back: 'A utility-first CSS framework packed with classes that can be composed to build any design directly in markup.', known: false },
    { id: 4, front: 'What is an idempotent API request?', back: 'An operation that produces the exact same result no matter how many times it is repeated (like GET, PUT, or DELETE).', known: false },
  ])
  const [activeCardIndex, setActiveCardIndex] = useState(0)
  const [cardFlipped, setCardFlipped] = useState(false)

  // Expense Tracker State
  const [expenses, setExpenses] = useState([
    { id: 1, desc: 'Coffee & Breakfast', amount: 8.5, cat: 'Food', date: 'Today' },
    { id: 2, desc: 'Cloud Server Hosting', amount: 24.0, cat: 'Work', date: 'Yesterday' },
    { id: 3, desc: 'Gym Membership', amount: 45.0, cat: 'Health', date: '3 days ago' },
    { id: 4, desc: 'Design Books & Assets', amount: 32.5, cat: 'Education', date: 'May 12' },
  ])
  const [budgetLimit] = useState(250)
  const [newExpDesc, setNewExpDesc] = useState('')
  const [newExpAmount, setNewExpAmount] = useState('')
  const [newExpCat, setNewExpCat] = useState('Food')

  // Workout Tracker State
  const [workoutItems, setWorkoutItems] = useState([
    { id: 1, exercise: 'Pushups', sets: '3 sets × 15 reps', done: true },
    { id: 2, exercise: 'Bodyweight Squats', sets: '4 sets × 20 reps', done: true },
    { id: 3, exercise: 'Plank Hold', sets: '3 sets × 60 secs', done: false },
    { id: 4, exercise: 'Dumbbell Rows', sets: '3 sets × 12 reps', done: false },
  ])
  const [timerSeconds, setTimerSeconds] = useState(0)
  const [timerRunning, setTimerRunning] = useState(false)

  // Universal App State
  const [genericItems, setGenericItems] = useState([
    { id: 1, text: 'Review project requirements & scope', priority: 'High', done: true, tag: 'Setup' },
    { id: 2, text: 'Design responsive layout & brand theme', priority: 'Medium', done: true, tag: 'Design' },
    { id: 3, text: 'Connect interactive state & action handlers', priority: 'High', done: false, tag: 'Core' },
    { id: 4, text: 'Test on mobile, tablet, and desktop', priority: 'Low', done: false, tag: 'QA' },
  ])
  const [newGenericText, setNewGenericText] = useState('')
  const [newGenericPriority, setNewGenericPriority] = useState('Medium')
  const [filterMode, setFilterMode] = useState<'all' | 'active' | 'completed'>('all')
  const [searchQuery, setSearchQuery] = useState('')

  // Toggle habit
  const toggleHabit = (id: number) => {
    setHabits((prev) =>
      prev.map((h) =>
        h.id === id
          ? { ...h, doneToday: !h.doneToday, streak: !h.doneToday ? h.streak + 1 : Math.max(0, h.streak - 1) }
          : h
      )
    )
  }

  const addHabit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newHabitName.trim()) return
    setHabits((prev) => [
      ...prev,
      { id: Date.now(), name: newHabitName.trim(), category: newHabitCat, streak: 1, doneToday: true },
    ])
    setNewHabitName('')
  }

  // Add Expense
  const addExpense = (e: React.FormEvent) => {
    e.preventDefault()
    const num = parseFloat(newExpAmount)
    if (!newExpDesc.trim() || isNaN(num) || num <= 0) return
    setExpenses((prev) => [
      { id: Date.now(), desc: newExpDesc.trim(), amount: num, cat: newExpCat, date: 'Just now' },
      ...prev,
    ])
    setNewExpDesc('')
    setNewExpAmount('')
  }

  // Universal Item Add
  const addGenericItem = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newGenericText.trim()) return
    setGenericItems((prev) => [
      ...prev,
      { id: Date.now(), text: newGenericText.trim(), priority: newGenericPriority, done: false, tag: 'Task' },
    ])
    setNewGenericText('')
  }

  const filteredGeneric = genericItems.filter((item) => {
    if (filterMode === 'active') return !item.done
    if (filterMode === 'completed') return item.done
    return true
  }).filter((item) => item.text.toLowerCase().includes(searchQuery.toLowerCase()))

  const totalSpent = expenses.reduce((acc, curr) => acc + curr.amount, 0)

  return (
    <div className={`min-h-full w-full bg-[#f6f5fa] text-[#222129] ${standalone ? 'min-h-screen py-8 px-4 sm:px-6' : 'p-5 sm:p-7'}`}>
      {standalone && (
        <header className="max-w-4xl mx-auto mb-6 flex items-center justify-between pb-4 border-b border-neutral-200">
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-700 text-white shadow-md">
              <Icon name="app" className="h-5 w-5" />
            </span>
            <div>
              <h1 className="font-display text-xl font-bold tracking-tight">{displayTitle}</h1>
              <p className="text-xs text-neutral-500">Live Preview • Created with Buildly</p>
            </div>
          </div>
          {onBack && (
            <button
              onClick={onBack}
              className="rounded-full border border-neutral-300 bg-white px-4 py-2 text-xs font-bold text-neutral-700 hover:bg-neutral-50 shadow-sm transition"
            >
              ← Back to Studio
            </button>
          )}
        </header>
      )}

      <div className="max-w-4xl mx-auto space-y-6">
        {/* App Hero Banner */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#6f48eb] via-[#5932d8] to-[#391e9f] p-6 sm:p-8 text-white shadow-xl shadow-indigo-900/15">
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold backdrop-blur-md">
              <Icon name="sparkles" className="h-3.5 w-3.5 text-amber-300" />
              <span>Interactive Application</span>
            </div>
            <h2 className="font-display mt-3 text-2xl sm:text-3xl font-extrabold tracking-tight">
              {displayTitle}
            </h2>
            <p className="mt-2 text-sm text-indigo-100 max-w-xl leading-relaxed">
              {prompt || 'Smart responsive application with real-time state, filtering, and local interaction.'}
            </p>
          </div>

          <div className="pointer-events-none absolute -right-10 -bottom-10 h-48 w-48 rounded-full bg-white/10 blur-2xl" />
        </div>

        {/* 1. Habit Tracker Archetype */}
        {isHabit && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="rounded-2xl bg-white p-4 border border-neutral-200/80 shadow-sm">
                <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Completed Today</p>
                <p className="text-2xl font-bold font-display mt-1 text-violet-700">
                  {habits.filter((h) => h.doneToday).length} / {habits.length}
                </p>
              </div>
              <div className="rounded-2xl bg-white p-4 border border-neutral-200/80 shadow-sm">
                <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Best Streak</p>
                <p className="text-2xl font-bold font-display mt-1 text-amber-600 flex items-center gap-1">
                  🔥 {Math.max(...habits.map((h) => h.streak))} days
                </p>
              </div>
              <div className="rounded-2xl bg-white p-4 border border-neutral-200/80 shadow-sm">
                <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Active Habits</p>
                <p className="text-2xl font-bold font-display mt-1 text-emerald-600">{habits.length}</p>
              </div>
              <div className="rounded-2xl bg-white p-4 border border-neutral-200/80 shadow-sm">
                <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Consistency</p>
                <p className="text-2xl font-bold font-display mt-1 text-indigo-600">88%</p>
              </div>
            </div>

            <div className="rounded-3xl bg-white p-6 border border-neutral-200/80 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-display font-bold text-lg">Daily Habits Checklist</h3>
                <span className="text-xs font-semibold text-neutral-400">Click circle to complete</span>
              </div>

              <div className="space-y-2.5">
                {habits.map((h) => (
                  <div
                    key={h.id}
                    onClick={() => toggleHabit(h.id)}
                    className={`flex items-center justify-between p-4 rounded-2xl border transition-all cursor-pointer ${
                      h.doneToday
                        ? 'bg-violet-50/60 border-violet-200 shadow-sm'
                        : 'bg-neutral-50/80 border-neutral-200/80 hover:bg-white hover:border-neutral-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`grid h-7 w-7 place-items-center rounded-full text-xs font-bold transition-all ${
                          h.doneToday
                            ? 'bg-violet-600 text-white shadow-md shadow-violet-500/30'
                            : 'border-2 border-neutral-300 text-transparent'
                        }`}
                      >
                        ✓
                      </span>
                      <div>
                        <p className={`text-sm font-bold ${h.doneToday ? 'line-through text-neutral-400' : 'text-neutral-800'}`}>
                          {h.name}
                        </p>
                        <span className="text-xs text-neutral-400 font-medium">{h.category}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-bold text-amber-700 border border-amber-200/60">
                        🔥 {h.streak}d streak
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <form onSubmit={addHabit} className="mt-5 flex gap-2">
                <input
                  type="text"
                  value={newHabitName}
                  onChange={(e) => setNewHabitName(e.target.value)}
                  placeholder="Add a new habit (e.g. 15m Reading)..."
                  className="flex-1 rounded-2xl border border-neutral-200 px-4 py-3 text-sm focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-200"
                />
                <select
                  value={newHabitCat}
                  onChange={(e) => setNewHabitCat(e.target.value)}
                  className="rounded-2xl border border-neutral-200 px-3 py-3 text-xs font-semibold text-neutral-600 bg-neutral-50"
                >
                  <option>Health</option>
                  <option>Mind</option>
                  <option>Fitness</option>
                  <option>Productivity</option>
                </select>
                <button
                  type="submit"
                  className="rounded-2xl bg-violet-600 px-5 py-3 text-sm font-bold text-white hover:bg-violet-700 shadow-md transition"
                >
                  Add Habit
                </button>
              </form>
            </div>
          </div>
        )}

        {/* 2. Flashcards / Study Archetype */}
        {isFlashcard && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">
                Card {activeCardIndex + 1} of {cards.length}
              </span>
              <div className="flex gap-2">
                <span className="rounded-full bg-emerald-100 text-emerald-800 px-3 py-1 text-xs font-bold">
                  Mastered: {cards.filter((c) => c.known).length}
                </span>
                <span className="rounded-full bg-amber-100 text-amber-800 px-3 py-1 text-xs font-bold">
                  Learning: {cards.filter((c) => !c.known).length}
                </span>
              </div>
            </div>

            {/* Flashcard Box with Flip */}
            <div
              onClick={() => setCardFlipped((f) => !f)}
              className="group relative h-72 w-full cursor-pointer perspective-1000 select-none"
            >
              <div
                className={`h-full w-full rounded-3xl p-8 flex flex-col justify-between border-2 transition-all duration-300 shadow-xl ${
                  cardFlipped
                    ? 'bg-gradient-to-br from-indigo-900 to-violet-950 text-white border-violet-700'
                    : 'bg-white text-neutral-900 border-neutral-200 hover:border-violet-400'
                }`}
              >
                <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider">
                  <span className={cardFlipped ? 'text-violet-300' : 'text-neutral-400'}>
                    {cardFlipped ? 'Answer & Explanation' : 'Question Prompt'}
                  </span>
                  <span className={`rounded-full px-2.5 py-0.5 ${cardFlipped ? 'bg-white/20 text-white' : 'bg-neutral-100 text-neutral-600'}`}>
                    Click to flip 🔄
                  </span>
                </div>

                <div className="text-center px-4">
                  <p className={`font-display font-bold leading-relaxed ${cardFlipped ? 'text-lg sm:text-xl text-neutral-100' : 'text-xl sm:text-2xl text-neutral-800'}`}>
                    {cardFlipped ? cards[activeCardIndex].back : cards[activeCardIndex].front}
                  </p>
                </div>

                <div className="text-center text-xs opacity-70">
                  {cardFlipped ? 'Click again to view question' : 'Click card to reveal answer'}
                </div>
              </div>
            </div>

            {/* Navigation buttons */}
            <div className="flex items-center justify-between gap-4">
              <button
                type="button"
                onClick={() => {
                  setCardFlipped(false)
                  setActiveCardIndex((i) => (i > 0 ? i - 1 : cards.length - 1))
                }}
                className="rounded-2xl border border-neutral-300 bg-white px-5 py-3 text-sm font-bold hover:bg-neutral-50 shadow-sm"
              >
                ← Previous Card
              </button>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setCards((c) =>
                      c.map((item, idx) => (idx === activeCardIndex ? { ...item, known: false } : item))
                    )
                    setCardFlipped(false)
                    setActiveCardIndex((i) => (i + 1) % cards.length)
                  }}
                  className="rounded-2xl bg-amber-500 hover:bg-amber-600 text-white px-4 py-3 text-xs font-bold shadow"
                >
                  Review Again
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setCards((c) =>
                      c.map((item, idx) => (idx === activeCardIndex ? { ...item, known: true } : item))
                    )
                    setCardFlipped(false)
                    setActiveCardIndex((i) => (i + 1) % cards.length)
                  }}
                  className="rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-3 text-xs font-bold shadow"
                >
                  I Know This! ✓
                </button>
              </div>

              <button
                type="button"
                onClick={() => {
                  setCardFlipped(false)
                  setActiveCardIndex((i) => (i + 1) % cards.length)
                }}
                className="rounded-2xl border border-neutral-300 bg-white px-5 py-3 text-sm font-bold hover:bg-neutral-50 shadow-sm"
              >
                Next Card →
              </button>
            </div>
          </div>
        )}

        {/* 3. Expense / Budget Archetype */}
        {isExpense && (
          <div className="space-y-6">
            <div className="rounded-3xl bg-white p-6 border border-neutral-200/80 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">Total Spent</p>
                  <p className="text-3xl font-display font-black text-neutral-900 mt-1">${totalSpent.toFixed(2)}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">Monthly Budget</p>
                  <p className="text-lg font-bold text-neutral-600">${budgetLimit}.00</p>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mt-4">
                <div className="h-3 w-full rounded-full bg-neutral-100 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      totalSpent > budgetLimit ? 'bg-rose-500' : 'bg-gradient-to-r from-violet-500 to-emerald-500'
                    }`}
                    style={{ width: `${Math.min(100, (totalSpent / budgetLimit) * 100)}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs text-neutral-500 mt-2 font-medium">
                  <span>${(budgetLimit - totalSpent).toFixed(2)} remaining</span>
                  <span>{Math.round((totalSpent / budgetLimit) * 100)}% used</span>
                </div>
              </div>
            </div>

            {/* Add expense form */}
            <form onSubmit={addExpense} className="rounded-3xl bg-white p-6 border border-neutral-200/80 shadow-sm space-y-4">
              <h3 className="font-display font-bold text-base">Record New Transaction</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <input
                  type="text"
                  placeholder="Description (e.g. Groceries)"
                  value={newExpDesc}
                  onChange={(e) => setNewExpDesc(e.target.value)}
                  className="rounded-2xl border border-neutral-200 px-4 py-3 text-sm focus:border-violet-500 focus:outline-none"
                />
                <input
                  type="number"
                  step="0.01"
                  placeholder="Amount ($)"
                  value={newExpAmount}
                  onChange={(e) => setNewExpAmount(e.target.value)}
                  className="rounded-2xl border border-neutral-200 px-4 py-3 text-sm focus:border-violet-500 focus:outline-none"
                />
                <select
                  value={newExpCat}
                  onChange={(e) => setNewExpCat(e.target.value)}
                  className="rounded-2xl border border-neutral-200 px-4 py-3 text-sm bg-neutral-50 text-neutral-700"
                >
                  <option>Food</option>
                  <option>Work</option>
                  <option>Health</option>
                  <option>Education</option>
                  <option>Entertainment</option>
                </select>
              </div>
              <button
                type="submit"
                className="w-full rounded-2xl bg-neutral-900 hover:bg-neutral-800 text-white py-3 text-sm font-bold shadow transition"
              >
                + Add Transaction
              </button>
            </form>

            {/* List */}
            <div className="rounded-3xl bg-white p-6 border border-neutral-200/80 shadow-sm">
              <h3 className="font-display font-bold text-base mb-4">Recent Expenses</h3>
              <div className="space-y-2">
                {expenses.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-3.5 rounded-2xl border border-neutral-100 hover:bg-neutral-50 transition">
                    <div className="flex items-center gap-3">
                      <span className="grid h-9 w-9 place-items-center rounded-xl bg-violet-100 text-violet-700 text-xs font-bold">
                        ${Math.round(item.amount)}
                      </span>
                      <div>
                        <p className="text-sm font-bold text-neutral-800">{item.desc}</p>
                        <p className="text-xs text-neutral-400">{item.cat} • {item.date}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-sm text-neutral-900">-${item.amount.toFixed(2)}</span>
                      <button
                        type="button"
                        onClick={() => setExpenses((prev) => prev.filter((x) => x.id !== item.id))}
                        className="text-neutral-400 hover:text-rose-500 text-xs px-2"
                      >
                        ×
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 4. Workout / Fitness Archetype */}
        {isWorkout && (
          <div className="space-y-6">
            <div className="rounded-3xl bg-neutral-900 text-white p-6 shadow-xl flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-xs font-semibold text-neutral-400 uppercase tracking-widest">Active Workout Session</p>
                <h3 className="text-2xl font-display font-bold mt-1">Full Body Conditioning</h3>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-mono-code text-2xl font-bold bg-neutral-800 px-4 py-2 rounded-2xl border border-neutral-700">
                  {Math.floor(timerSeconds / 60)}:{(timerSeconds % 60).toString().padStart(2, '0')}
                </span>
                <button
                  type="button"
                  onClick={() => setTimerRunning((r) => !r)}
                  className={`rounded-2xl px-5 py-2.5 text-xs font-bold transition ${
                    timerRunning ? 'bg-amber-500 text-white' : 'bg-violet-600 text-white hover:bg-violet-500'
                  }`}
                >
                  {timerRunning ? 'Pause' : 'Start Timer'}
                </button>
              </div>
            </div>

            <div className="rounded-3xl bg-white p-6 border border-neutral-200/80 shadow-sm">
              <h3 className="font-display font-bold text-lg mb-4">Routine Exercises</h3>
              <div className="space-y-3">
                {workoutItems.map((ex) => (
                  <div
                    key={ex.id}
                    onClick={() =>
                      setWorkoutItems((prev) =>
                        prev.map((item) => (item.id === ex.id ? { ...item, done: !item.done } : item))
                      )
                    }
                    className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition ${
                      ex.done ? 'bg-emerald-50/70 border-emerald-200' : 'bg-neutral-50 border-neutral-200 hover:bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`grid h-7 w-7 place-items-center rounded-full text-xs font-bold transition ${
                          ex.done ? 'bg-emerald-600 text-white' : 'border-2 border-neutral-300 text-transparent'
                        }`}
                      >
                        ✓
                      </span>
                      <div>
                        <p className={`text-sm font-bold ${ex.done ? 'line-through text-neutral-400' : 'text-neutral-800'}`}>
                          {ex.exercise}
                        </p>
                        <p className="text-xs text-neutral-500">{ex.sets}</p>
                      </div>
                    </div>
                    <span className="text-xs font-semibold text-neutral-400">
                      {ex.done ? 'Completed' : 'Pending'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 5. Universal Productivity App (Default Archetype) */}
        {!isHabit && !isFlashcard && !isExpense && !isWorkout && (
          <div className="space-y-6">
            {/* Stats Overview */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="rounded-2xl bg-white p-4 border border-neutral-200/80 shadow-sm">
                <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">Total Items</p>
                <p className="text-2xl font-bold font-display mt-1 text-neutral-900">{genericItems.length}</p>
              </div>
              <div className="rounded-2xl bg-white p-4 border border-neutral-200/80 shadow-sm">
                <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">Completed</p>
                <p className="text-2xl font-bold font-display mt-1 text-emerald-600">
                  {genericItems.filter((i) => i.done).length}
                </p>
              </div>
              <div className="rounded-2xl bg-white p-4 border border-neutral-200/80 shadow-sm">
                <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">Pending</p>
                <p className="text-2xl font-bold font-display mt-1 text-amber-600">
                  {genericItems.filter((i) => !i.done).length}
                </p>
              </div>
              <div className="rounded-2xl bg-white p-4 border border-neutral-200/80 shadow-sm">
                <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">Progress</p>
                <p className="text-2xl font-bold font-display mt-1 text-violet-600">
                  {genericItems.length ? Math.round((genericItems.filter((i) => i.done).length / genericItems.length) * 100) : 0}%
                </p>
              </div>
            </div>

            {/* Management Section */}
            <div className="rounded-3xl bg-white p-6 border border-neutral-200/80 shadow-sm space-y-5">
              {/* Controls Header */}
              <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between pb-3 border-b border-neutral-100">
                <div className="flex items-center gap-1 bg-neutral-100 p-1 rounded-2xl w-fit">
                  <button
                    type="button"
                    onClick={() => setFilterMode('all')}
                    className={`rounded-xl px-3 py-1.5 text-xs font-bold transition ${
                      filterMode === 'all' ? 'bg-white shadow text-violet-700' : 'text-neutral-500 hover:text-neutral-800'
                    }`}
                  >
                    All ({genericItems.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setFilterMode('active')}
                    className={`rounded-xl px-3 py-1.5 text-xs font-bold transition ${
                      filterMode === 'active' ? 'bg-white shadow text-violet-700' : 'text-neutral-500 hover:text-neutral-800'
                    }`}
                  >
                    Active
                  </button>
                  <button
                    type="button"
                    onClick={() => setFilterMode('completed')}
                    className={`rounded-xl px-3 py-1.5 text-xs font-bold transition ${
                      filterMode === 'completed' ? 'bg-white shadow text-violet-700' : 'text-neutral-500 hover:text-neutral-800'
                    }`}
                  >
                    Completed
                  </button>
                </div>

                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search items..."
                    className="w-full sm:w-56 rounded-2xl border border-neutral-200 pl-8 pr-3 py-1.5 text-xs focus:border-violet-500 focus:outline-none"
                  />
                  <span className="absolute left-2.5 top-2 text-neutral-400">
                    <Icon name="search" className="h-3.5 w-3.5" />
                  </span>
                </div>
              </div>

              {/* Items List */}
              <div className="space-y-2">
                {filteredGeneric.map((item) => (
                  <div
                    key={item.id}
                    className={`flex items-center justify-between p-3.5 rounded-2xl border transition-all ${
                      item.done
                        ? 'bg-neutral-50/70 border-neutral-200/60 opacity-75'
                        : 'bg-white border-neutral-200/90 hover:border-violet-300 shadow-sm'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() =>
                          setGenericItems((prev) =>
                            prev.map((i) => (i.id === item.id ? { ...i, done: !i.done } : i))
                          )
                        }
                        className={`grid h-6 w-6 place-items-center rounded-lg border text-xs font-bold transition ${
                          item.done
                            ? 'bg-violet-600 border-violet-600 text-white'
                            : 'border-neutral-300 hover:border-violet-500'
                        }`}
                      >
                        {item.done && '✓'}
                      </button>
                      <span className={`text-sm font-semibold ${item.done ? 'line-through text-neutral-400' : 'text-neutral-800'}`}>
                        {item.text}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                          item.priority === 'High'
                            ? 'bg-rose-100 text-rose-700'
                            : item.priority === 'Medium'
                            ? 'bg-amber-100 text-amber-700'
                            : 'bg-neutral-100 text-neutral-600'
                        }`}
                      >
                        {item.priority}
                      </span>
                      <button
                        type="button"
                        onClick={() => setGenericItems((prev) => prev.filter((i) => i.id !== item.id))}
                        className="text-neutral-400 hover:text-rose-500 p-1"
                        aria-label="Delete item"
                      >
                        ×
                      </button>
                    </div>
                  </div>
                ))}

                {filteredGeneric.length === 0 && (
                  <div className="py-8 text-center text-sm text-neutral-400">
                    No matching items found. Add something below!
                  </div>
                )}
              </div>

              {/* Add Input */}
              <form onSubmit={addGenericItem} className="flex gap-2 pt-2">
                <input
                  type="text"
                  value={newGenericText}
                  onChange={(e) => setNewGenericText(e.target.value)}
                  placeholder="Add a new task or item to this workspace..."
                  className="flex-1 rounded-2xl border border-neutral-200 px-4 py-3 text-sm focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-200"
                />
                <select
                  value={newGenericPriority}
                  onChange={(e) => setNewGenericPriority(e.target.value)}
                  className="rounded-2xl border border-neutral-200 px-3 py-3 text-xs font-semibold text-neutral-600 bg-neutral-50"
                >
                  <option>High</option>
                  <option>Medium</option>
                  <option>Low</option>
                </select>
                <button
                  type="submit"
                  disabled={!newGenericText.trim()}
                  className="rounded-2xl bg-violet-600 px-5 py-3 text-sm font-bold text-white hover:bg-violet-700 disabled:opacity-40 shadow transition"
                >
                  Add Item
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
