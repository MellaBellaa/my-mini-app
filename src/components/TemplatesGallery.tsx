import React from 'react'
import type { Mode, Template } from '../types'
import { Icon } from './Icon'

interface TemplatesGalleryProps {
  onSelectTemplate: (template: Template) => void
  onQuickPreview: (template: Template) => void
}

export const templates: Template[] = [
  {
    id: 'habit-tracker',
    title: 'Habit & Daily Streak Tracker',
    category: 'App',
    mode: 'app',
    description: 'Track daily routines, build unbroken streaks, and visualize completion metrics.',
    color: 'bg-violet-100 text-violet-700',
    badge: 'Popular',
    prompt: 'Build a habit and daily routine tracker with streaks and progress statistics',
    popular: true,
    features: ['Streak counters', 'Category tags', 'Completion percentages'],
  },
  {
    id: 'artisan-bakery',
    title: 'The Artisan Bakery & Café',
    category: 'Website',
    mode: 'site',
    description: 'Warm, elegant brand showcase featuring menu items, founder story, and table reservations.',
    color: 'bg-amber-100 text-amber-700',
    badge: 'Showcase',
    prompt: 'Create a website for an artisan sourdough bakery and specialty coffee shop',
    popular: true,
    features: ['Story section', 'Offerings showcase', 'Interactive inquiry form'],
  },
  {
    id: 'space-dodger',
    title: 'Nebula Space Dodger',
    category: 'Game',
    mode: 'game',
    description: 'Real-time 2D canvas arcade game. Dodge meteors, gather powerup stars, and beat high scores.',
    color: 'bg-rose-100 text-rose-700',
    badge: 'Arcade',
    prompt: 'Make an arcade game where a spaceship dodges asteroids in space',
    popular: true,
    features: ['Keyboard + touch controls', 'High score persistence', 'Dynamic obstacles'],
  },
  {
    id: 'flashcard-deck',
    title: 'Flashcard Study Vault',
    category: 'App',
    mode: 'app',
    description: 'Interactive flashcards with 3D flip animation, known vs review tallies, and deck progress.',
    color: 'bg-emerald-100 text-emerald-700',
    badge: 'Education',
    prompt: 'Build a flashcard study app to memorize computer science and web development concepts',
    features: ['Card flip interaction', 'Mastered tallies', 'Deck navigation'],
  },
  {
    id: 'saas-landing',
    title: 'Modern AI SaaS Landing Page',
    category: 'Website',
    mode: 'site',
    description: 'High-converting dark SaaS page with feature matrix, testimonial proof, and CTA banners.',
    color: 'bg-indigo-100 text-indigo-700',
    badge: 'Startup',
    prompt: 'Create a website for an AI software startup that automates customer workflows',
    features: ['Hero banner', 'Feature grid', 'Interactive contact'],
  },
  {
    id: 'reflex-blitz',
    title: 'Neon Reflex Speed Blitz',
    category: 'Game',
    mode: 'game',
    description: 'Fast-paced circular reflex clicker testing reaction speeds under a 20-second countdown.',
    color: 'bg-pink-100 text-pink-700',
    badge: 'Fast Reaction',
    prompt: 'Make a fun game where you click fast-moving glowing targets before the timer runs out',
    features: ['Countdown timer', 'Combo streaks', 'Dynamic target resizing'],
  },
  {
    id: 'budget-calculator',
    title: 'Daily Expense & Split Calculator',
    category: 'App',
    mode: 'app',
    description: 'Quick expense logger with budget progress bar, category filters, and transaction history.',
    color: 'bg-teal-100 text-teal-700',
    badge: 'Finance',
    prompt: 'Build an expense and budget splitter app to track daily spending',
    features: ['Budget progress bar', 'Category breakdown', 'Transaction deletion'],
  },
  {
    id: 'fitness-timer',
    title: 'Workout & Fitness Session Timer',
    category: 'App',
    mode: 'app',
    description: 'Exercise routine checklist paired with a live digital stopwatch for workout pacing.',
    color: 'bg-orange-100 text-orange-700',
    badge: 'Health',
    prompt: 'Build a workout and fitness tracker with a session timer and exercise checklist',
    features: ['Interactive stopwatch', 'Set/rep tracking', 'Completion checkmarks'],
  },
]

export const TemplatesGallery: React.FC<TemplatesGalleryProps> = ({
  onSelectTemplate,
  onQuickPreview,
}) => {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-neutral-400">Ready-Made Blueprints</p>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 font-display mt-1">
            Starter Templates & Inspiration
          </h2>
          <p className="text-sm text-neutral-500 mt-1">
            Jumpstart your creation with fully functional, pre-tested application and website archetypes.
          </p>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {templates.map((tpl) => (
          <div
            key={tpl.id}
            className="group rounded-3xl border border-neutral-200/90 bg-white p-5 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className={`grid h-10 w-10 place-items-center rounded-2xl ${tpl.color} font-bold`}>
                  <Icon name={tpl.mode} className="h-5 w-5" />
                </span>
                <span className="rounded-full bg-neutral-100 px-2.5 py-0.5 text-[10px] font-bold text-neutral-600">
                  {tpl.badge}
                </span>
              </div>

              <h3 className="font-display font-bold text-base text-neutral-900 group-hover:text-violet-700 transition">
                {tpl.title}
              </h3>
              <p className="text-xs text-neutral-500 leading-relaxed mt-2 line-clamp-3">
                {tpl.description}
              </p>

              <div className="mt-4 flex flex-wrap gap-1.5">
                {tpl.features.map((f, i) => (
                  <span
                    key={i}
                    className="text-[10px] font-semibold text-neutral-600 bg-neutral-50 border border-neutral-200/70 rounded-md px-2 py-0.5"
                  >
                    {f}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-neutral-100 flex items-center gap-2">
              <button
                type="button"
                onClick={() => onQuickPreview(tpl)}
                className="flex-1 rounded-xl border border-neutral-200 bg-neutral-50 hover:bg-neutral-100 py-2 text-xs font-bold text-neutral-700 transition"
              >
                Preview
              </button>
              <button
                type="button"
                onClick={() => onSelectTemplate(tpl)}
                className="flex-1 rounded-xl bg-violet-600 hover:bg-violet-700 py-2 text-xs font-bold text-white shadow-sm transition"
              >
                Use Template
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
