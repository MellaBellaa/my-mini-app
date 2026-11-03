import React, { useState } from 'react'
import { Icon } from './Icon'

interface IdeaArchitectProps {
  prompt: string
}

export const IdeaArchitect: React.FC<IdeaArchitectProps> = ({ prompt }) => {
  const [completedSteps, setCompletedSteps] = useState<number[]>([1])

  const topic = prompt.replace(/^(help me|improve|my idea for|an idea for)\s+/i, '').trim() || 'Your Concept'

  const roadmap = [
    {
      phase: 'Phase 1 • Minimum Viable Product (Week 1–2)',
      tasks: [
        'Establish core value proposition and 1 hero task flow',
        'Build lightweight mobile-first responsive UI',
        'Save user progress and entries to persistent local storage',
        'Implement instant feedback loops and micro-interactions',
      ],
    },
    {
      phase: 'Phase 2 • User Retention & Growth (Week 3–4)',
      tasks: [
        'Add guided interactive onboarding with sample templates',
        'Implement streaks, progress badges, and milestone celebrations',
        'Enable social sharing cards and public preview URLs',
        'Add weekly email or push notification reminders',
      ],
    },
    {
      phase: 'Phase 3 • Monetization & Scaling (Month 2)',
      tasks: [
        'Launch Pro tier with cloud sync and multi-device access',
        'Integrate custom branding and export tools (PDF, CSV, HTML)',
        'Add team collaboration workspaces and shared project boards',
      ],
    },
  ]

  const toggleTask = (id: number) => {
    setCompletedSteps((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    )
  }

  return (
    <div className="rounded-3xl bg-white p-6 sm:p-8 border border-neutral-200/90 shadow-sm space-y-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-neutral-100">
        <div className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-2xl bg-blue-100 text-blue-600">
            <Icon name="bulb" className="h-5 w-5" />
          </span>
          <div>
            <h3 className="font-display font-bold text-lg text-neutral-900">
              Product Architecture & Feature Roadmap
            </h3>
            <p className="text-xs text-neutral-500">
              Strategic blueprint for “<span className="text-blue-600 font-semibold">{topic}</span>”
            </p>
          </div>
        </div>

        <span className="rounded-full bg-blue-50 border border-blue-200 px-3 py-1 text-xs font-bold text-blue-700">
          Executive Blueprint
        </span>
      </div>

      {/* Grid: Value Prop & User Personas */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="rounded-2xl bg-neutral-50 p-5 border border-neutral-200/80 space-y-3">
          <h4 className="font-display font-bold text-sm text-neutral-900 flex items-center gap-2">
            <span>🎯</span> Core Value Proposition (USP)
          </h4>
          <p className="text-xs text-neutral-600 leading-relaxed">
            Eliminate friction in daily workflows by converting complex multi-step tasks for <strong>{topic}</strong> into a single, intuitive dashboard with instant progress tracking.
          </p>
          <div className="pt-2 flex flex-wrap gap-1.5 text-[11px] font-semibold text-neutral-600">
            <span className="rounded-md bg-white border border-neutral-200 px-2 py-0.5">High Clarity</span>
            <span className="rounded-md bg-white border border-neutral-200 px-2 py-0.5">Zero Clutter</span>
            <span className="rounded-md bg-white border border-neutral-200 px-2 py-0.5">Instant Gratification</span>
          </div>
        </div>

        <div className="rounded-2xl bg-neutral-50 p-5 border border-neutral-200/80 space-y-3">
          <h4 className="font-display font-bold text-sm text-neutral-900 flex items-center gap-2">
            <span>👥</span> Primary Target Persona
          </h4>
          <p className="text-xs text-neutral-600 leading-relaxed">
            Busy creators, makers, and self-starters who need an effortless system without a steep learning curve or excessive configuration steps.
          </p>
          <div className="pt-2 flex flex-wrap gap-1.5 text-[11px] font-semibold text-neutral-600">
            <span className="rounded-md bg-white border border-neutral-200 px-2 py-0.5">Speed-Driven</span>
            <span className="rounded-md bg-white border border-neutral-200 px-2 py-0.5">Mobile First</span>
            <span className="rounded-md bg-white border border-neutral-200 px-2 py-0.5">Values Aesthetics</span>
          </div>
        </div>
      </div>

      {/* Interactive 3-Phase Roadmap */}
      <div>
        <h4 className="font-display font-bold text-base text-neutral-900 mb-4 flex items-center gap-2">
          <span>🗺️</span> Phased Development Roadmap
        </h4>

        <div className="space-y-4">
          {roadmap.map((phase, pIdx) => (
            <div key={pIdx} className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm space-y-3">
              <p className="text-xs font-bold text-blue-700 uppercase tracking-wider">{phase.phase}</p>
              <div className="space-y-2">
                {phase.tasks.map((task, tIdx) => {
                  const taskId = pIdx * 10 + tIdx
                  const isDone = completedSteps.includes(taskId)
                  return (
                    <div
                      key={tIdx}
                      onClick={() => toggleTask(taskId)}
                      className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition ${
                        isDone
                          ? 'bg-blue-50/50 border-blue-200 text-neutral-500'
                          : 'bg-neutral-50/70 border-neutral-200/60 hover:bg-white text-neutral-800'
                      }`}
                    >
                      <span
                        className={`grid h-5 w-5 place-items-center rounded-md text-xs font-bold transition ${
                          isDone ? 'bg-blue-600 text-white' : 'border border-neutral-300 text-transparent'
                        }`}
                      >
                        ✓
                      </span>
                      <span className={`text-xs font-medium ${isDone ? 'line-through opacity-70' : ''}`}>
                        {task}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recommended Tech Stack & Architecture */}
      <div className="rounded-2xl bg-gradient-to-br from-neutral-900 to-neutral-950 text-white p-6 shadow-xl">
        <h4 className="font-display font-bold text-base mb-4 flex items-center gap-2">
          <span>⚙️</span> Recommended Architecture Stack
        </h4>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div className="bg-white/5 p-3 rounded-xl border border-white/10">
            <span className="text-neutral-400 block text-[10px] uppercase font-bold">Frontend</span>
            <span className="font-bold text-white text-sm mt-1 block">React 19 + Vite</span>
            <span className="text-neutral-400 text-[11px]">Tailwind CSS v4</span>
          </div>
          <div className="bg-white/5 p-3 rounded-xl border border-white/10">
            <span className="text-neutral-400 block text-[10px] uppercase font-bold">Storage</span>
            <span className="font-bold text-white text-sm mt-1 block">LocalStorage + Supabase</span>
            <span className="text-neutral-400 text-[11px]">Instant client-side cache</span>
          </div>
          <div className="bg-white/5 p-3 rounded-xl border border-white/10">
            <span className="text-neutral-400 block text-[10px] uppercase font-bold">Hosting</span>
            <span className="font-bold text-white text-sm mt-1 block">Edge CDN</span>
            <span className="text-neutral-400 text-[11px]">Instant global loading</span>
          </div>
          <div className="bg-white/5 p-3 rounded-xl border border-white/10">
            <span className="text-neutral-400 block text-[10px] uppercase font-bold">Revenue</span>
            <span className="font-bold text-white text-sm mt-1 block">Freemium Model</span>
            <span className="text-neutral-400 text-[11px]">$9/mo Pro Upgrade</span>
          </div>
        </div>
      </div>
    </div>
  )
}
