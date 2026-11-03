import React, { FormEvent, useEffect, useRef, useState } from 'react'
import { Icon } from './components/Icon'
import { ToastContainer } from './components/Toast'
import { AppPreview } from './components/AppPreview'
import { WebsitePreview } from './components/WebsitePreview'
import { GameStudio } from './components/GameStudio'
import { CodeDoctor } from './components/CodeDoctor'
import { IdeaArchitect } from './components/IdeaArchitect'
import { TemplatesGallery, templates } from './components/TemplatesGallery'
import { ProjectManager } from './components/ProjectManager'
import { WebsiteEditor } from './components/WebsiteEditor'
import { AssembledSiteModal } from './components/AssembledSiteModal'
import {
  downloadFile,
  generateAppHtml,
  generateWebsiteHtml,
  generateGameHtml,
} from './utils/codeGenerators'
import type {
  GeneratedResult,
  IconName,
  Mode,
  Project,
  Template,
  ToastMessage,
  WebsiteDetails,
} from './types'

// Default Starter Projects to populate library
const defaultProjects: Project[] = [
  {
    id: 'proj-1',
    title: 'Daily Habit & Streak Tracker',
    type: 'App',
    mode: 'app',
    prompt: 'Build a habit and daily routine tracker with streaks and progress statistics',
    updated: 'Just now',
    updatedAt: Date.now(),
    color: 'bg-violet-100 text-violet-700',
    icon: 'app',
    starred: true,
  },
  {
    id: 'proj-2',
    title: 'The Artisan Boulangerie',
    type: 'Website',
    mode: 'site',
    prompt: 'Create a website for an artisan sourdough bakery and specialty coffee shop',
    updated: '2 hours ago',
    updatedAt: Date.now() - 7200000,
    color: 'bg-amber-100 text-amber-700',
    icon: 'site',
    starred: true,
    websiteConfig: {
      businessName: 'The Artisan Boulangerie',
      owner: 'Élodie Laurent',
      tagline: 'Old-world French sourdough & handcrafted morning pastries',
      about: 'Trained in Paris, Élodie crafts sourdough bread with organic heritage grains and 48-hour slow fermentation.',
      blurb: 'Award-winning neighborhood sourdough bakery and café serving handcrafted croissants and pour-overs.',
      color: '#d97706',
      secondaryColor: '#fef3c7',
      font: 'Elegant & classic',
      logo: '',
      founderPhoto: '',
      features: [],
      pricing: [],
      testimonials: [],
    },
  },
  {
    id: 'proj-3',
    title: 'Nebula Space Dodger',
    type: 'Game',
    mode: 'game',
    prompt: 'Make an arcade game where a spaceship dodges asteroids in deep space',
    updated: 'Yesterday',
    updatedAt: Date.now() - 86400000,
    color: 'bg-rose-100 text-rose-700',
    icon: 'game',
  },
  {
    id: 'proj-4',
    title: 'React State Race Condition Fix',
    type: 'Bug Fix',
    mode: 'bug',
    prompt: 'Fix async effect race condition when switching tabs rapidly',
    updated: '3 days ago',
    updatedAt: Date.now() - 259200000,
    color: 'bg-rose-100 text-rose-600',
    icon: 'bug',
  },
  {
    id: 'proj-5',
    title: 'AI Language Tutor Roadmap',
    type: 'Roadmap',
    mode: 'bulb',
    prompt: 'Improve an idea for an AI language tutor with spaced repetition',
    updated: '1 week ago',
    updatedAt: Date.now() - 604800000,
    color: 'bg-blue-100 text-blue-700',
    icon: 'bulb',
  },
]

const starterChips = [
  'Habit Streak Tracker with daily checklist',
  'Artisan French Bakery & Specialty Café',
  'Deep Space Asteroid Runner 2D Game',
  'Web Development Flashcard Quiz Deck',
  'Freelancer Daily Expense Splitter',
  'Troubleshoot React State Mutation Error',
]

export default function App() {
  // Navigation & View
  const [activeTab, setActiveTab] = useState<'studio' | 'templates' | 'projects'>('studio')
  const [deviceViewport, setDeviceViewport] = useState<'desktop' | 'tablet' | 'mobile'>('desktop')
  const [studioView, setStudioView] = useState<'preview' | 'code'>('preview')

  // Studio Inputs
  const [mode, setMode] = useState<Mode>('app')
  const [prompt, setPrompt] = useState('')
  const [generating, setGenerating] = useState(false)
  const [result, setResult] = useState<GeneratedResult | null>(null)

  // Website Config & Pop-up State
  const [showAssembledPopUp, setShowAssembledPopUp] = useState(false)
  const [website, setWebsite] = useState<WebsiteDetails>({
    businessName: 'The Artisan Boulangerie',
    owner: 'Élodie Laurent',
    tagline: 'Old-world French sourdough & handcrafted morning pastries',
    heroHeadline: 'Slow-Fermented Sourdough & Artisanal Pastries',
    ctaText: 'Explore Morning Menu',
    contactEmail: 'bonjour@artisanboulangerie.com',
    about: 'Trained in Paris, Élodie crafts sourdough bread with organic heritage grains and 48-hour slow fermentation.',
    blurb: 'Award-winning neighborhood sourdough bakery and café serving handcrafted croissants and pour-overs made with organic heritage grains.',
    color: '#d97706',
    secondaryColor: '#fef3c7',
    font: 'Elegant & classic',
    logo: '',
    founderPhoto: '',
    features: [
      { icon: 'sparkles', title: '48h Slow Ferment', desc: 'Naturally leavened doughs for rich texture, crisp blistered crust, and superior digestibility.' },
      { icon: 'check', title: 'Organic Heritage Grains', desc: 'Locally milled stone-ground flours with zero artificial preservatives or bleach.' },
      { icon: 'app', title: 'Dawn-Baked Daily', desc: 'Every loaf and croissant pulled fresh from our stone deck ovens every morning at 6:00 AM.' },
    ],
    pricing: [],
    testimonials: [],
  })

  // Projects Storage
  const [projects, setProjects] = useState<Project[]>(() => {
    try {
      const stored = localStorage.getItem('buildly_projects_v2')
      if (stored) return JSON.parse(stored)
    } catch {
      // fallback
    }
    return defaultProjects
  })

  // Modals & Panels
  const [panel, setPanel] = useState<'help' | 'profile' | 'command' | null>(null)
  const [toasts, setToasts] = useState<ToastMessage[]>([])
  const ideaInputRef = useRef<HTMLTextAreaElement>(null)

  // Save projects to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('buildly_projects_v2', JSON.stringify(projects))
    } catch {
      // ignore
    }
  }, [projects])

  // Toast Helper
  const addToast = (title: string, description?: string) => {
    const id = Date.now().toString()
    setToasts((prev) => [...prev, { id, title, description }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 3500)
  }

  // Keyboard shortcut for command palette (Ctrl+K or Cmd+K)
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setPanel((p) => (p === 'command' ? null : 'command'))
      } else if (e.key === 'Escape') {
        setPanel(null)
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [])

  // Handle Hash Routing for standalone full page previews
  const hash = window.location.hash
  if (hash.startsWith('#/site/')) {
    let saved = website
    try {
      const stored = localStorage.getItem('buildly-published-website')
      if (stored) saved = JSON.parse(stored)
    } catch {
      // ignore
    }
    return (
      <WebsitePreview
        website={saved}
        standalone={true}
        onBack={() => {
          window.location.hash = ''
        }}
      />
    )
  }

  if (hash.startsWith('#/app/')) {
    const savedPrompt = localStorage.getItem('buildly-generated-app') || prompt || 'Personal interactive app'
    return (
      <AppPreview
        prompt={savedPrompt}
        standalone={true}
        onBack={() => {
          window.location.hash = ''
        }}
      />
    )
  }

  if (hash.startsWith('#/game/')) {
    const savedGamePrompt = localStorage.getItem('buildly-generated-game') || prompt || 'Nebula Space Dodger'
    return (
      <GameStudio
        prompt={savedGamePrompt}
        standalone={true}
        onBack={() => {
          window.location.hash = ''
        }}
      />
    )
  }

  // Generate Action
  const handleGenerate = (e?: FormEvent) => {
    if (e) e.preventDefault()
    if (!prompt.trim()) return

    const lower = prompt.toLowerCase()
    let inferredMode: Mode = mode
    if (lower.includes('website') || lower.includes('portfolio') || lower.includes('landing page')) {
      inferredMode = 'site'
    } else if (lower.includes('game') || lower.includes('arcade') || lower.includes('dodge')) {
      inferredMode = 'game'
    } else if (lower.includes('fix') || lower.includes('bug') || lower.includes('error') || lower.includes('problem')) {
      inferredMode = 'bug'
    } else if (lower.includes('improve') || lower.includes('roadmap') || lower.includes('feature idea')) {
      inferredMode = 'bulb'
    }

    setMode(inferredMode)
    setGenerating(true)
    setResult(null)

    setTimeout(() => {
      const cleanPrompt = prompt.trim()
      const title = cleanPrompt.replace(/^(build me|create|make|help me|a|an)\s+/i, '').replace(/[.:]\s*$/, '') || 'Custom Creation'

      const newResult: GeneratedResult = {
        mode: inferredMode,
        label: `${inferredMode.toUpperCase()} Prototype Generated`,
        title: title.charAt(0).toUpperCase() + title.slice(1),
        summary: `Tailored bespoke ${inferredMode} interface mapped directly to your requirements with real-time interactivity.`,
        items: [
          'Full interactive state & micro-animations',
          'Responsive design tested across desktop & mobile',
          'Exportable 1-click standalone code',
        ],
        action: `Launch ${inferredMode}`,
        timestamp: Date.now(),
      }

      setResult(newResult)
      setGenerating(false)

      // Cache for routing
      if (inferredMode === 'site') {
        localStorage.setItem('buildly-published-website', JSON.stringify(website))
      } else if (inferredMode === 'app') {
        localStorage.setItem('buildly-generated-app', cleanPrompt)
      } else if (inferredMode === 'game') {
        localStorage.setItem('buildly-generated-game', cleanPrompt)
      }

      // Add toast
      addToast('Prototype Generated!', `Your ${inferredMode} is live and ready in the canvas below.`)

      // Smooth scroll to studio result
      setTimeout(() => {
        document.getElementById('studio-canvas')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 80)
    }, 600)
  }

  // Save current creation to projects
  const handleSaveToProjects = () => {
    if (!result) return
    const newProj: Project = {
      id: `proj-${Date.now()}`,
      title: result.title,
      type:
        result.mode === 'app'
          ? 'App'
          : result.mode === 'site'
          ? 'Website'
          : result.mode === 'game'
          ? 'Game'
          : result.mode === 'bug'
          ? 'Bug Fix'
          : 'Roadmap',
      mode: result.mode,
      prompt: prompt || result.title,
      updated: 'Just now',
      updatedAt: Date.now(),
      color:
        result.mode === 'app'
          ? 'bg-violet-100 text-violet-700'
          : result.mode === 'site'
          ? 'bg-amber-100 text-amber-700'
          : result.mode === 'game'
          ? 'bg-rose-100 text-rose-700'
          : result.mode === 'bug'
          ? 'bg-rose-100 text-rose-600'
          : 'bg-blue-100 text-blue-700',
      icon: result.mode,
      websiteConfig: result.mode === 'site' ? website : undefined,
    }

    setProjects((prev) => [newProj, ...prev])
    addToast('Saved to My Projects!', `“${newProj.title}” is now saved to your library.`)
  }

  // Load template into studio
  const handleSelectTemplate = (tpl: Template) => {
    setMode(tpl.mode)
    setPrompt(tpl.prompt)
    setActiveTab('studio')
    window.scrollTo({ top: 0, behavior: 'smooth' })
    setTimeout(() => {
      handleGenerate()
    }, 150)
  }

  // Quick preview of template
  const handleQuickPreview = (tpl: Template) => {
    setMode(tpl.mode)
    setPrompt(tpl.prompt)
    setActiveTab('studio')
    handleGenerate()
  }

  // Open project from library
  const handleOpenProject = (proj: Project) => {
    setMode(proj.mode)
    setPrompt(proj.prompt)
    if (proj.websiteConfig) setWebsite(proj.websiteConfig)
    setActiveTab('studio')
    window.scrollTo({ top: 0, behavior: 'smooth' })
    handleGenerate()
  }

  // Delete project
  const handleDeleteProject = (id: string) => {
    setProjects((prev) => prev.filter((p) => p.id !== id))
    addToast('Project deleted', 'The project was removed from your library.')
  }

  // Star project
  const handleToggleStar = (id: string) => {
    setProjects((prev) =>
      prev.map((p) => (p.id === id ? { ...p, starred: !p.starred } : p))
    )
  }

  // Download project as standalone HTML
  const handleDownloadProject = (proj: Project) => {
    let content = ''
    if (proj.mode === 'site') {
      content = generateWebsiteHtml(proj.websiteConfig || website)
    } else if (proj.mode === 'game') {
      content = generateGameHtml(proj.gameType || 'space', proj.title)
    } else {
      content = generateAppHtml(proj.prompt, proj.title)
    }
    const filename = `${proj.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'buildly-project'}.html`
    downloadFile(filename, content)
    addToast('Download started', `Saving ${filename} to your device.`)
  }

  // Upload image handler
  const handleUpload = (file: File | undefined, field: 'logo' | 'founderPhoto') => {
    if (!file || !file.type.startsWith('image/')) return
    const reader = new FileReader()
    reader.onload = () => setWebsite((w) => ({ ...w, [field]: String(reader.result) }))
    reader.readAsDataURL(file)
    addToast('Image uploaded', `${field === 'logo' ? 'Logo' : 'Founder photo'} updated successfully.`)
  }

  // Code content for the Source Code Inspector
  const currentCode =
    mode === 'site'
      ? generateWebsiteHtml(website)
      : mode === 'game'
      ? generateGameHtml('space', prompt || 'Nebula Space Dodger')
      : generateAppHtml(prompt, result?.title || 'Interactive Application')

  return (
    <div className="min-h-screen bg-[#faf9f8] text-[#1e1c24] flex flex-col antialiased">
      {/* Toast Manager */}
      <ToastContainer toasts={toasts} onDismiss={(id) => setToasts((t) => t.filter((x) => x.id !== id))} />

      {/* Primary Top Header */}
      <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-neutral-200/80 bg-white/80 px-4 sm:px-8 backdrop-blur-xl">
        <div className="flex items-center gap-6">
          <button
            type="button"
            onClick={() => {
              setActiveTab('studio')
              window.scrollTo({ top: 0, behavior: 'smooth' })
            }}
            className="flex items-center gap-2.5 text-left group"
          >
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-violet-600 via-indigo-600 to-purple-700 text-white shadow-md shadow-violet-600/30 group-hover:scale-105 transition">
              <Icon name="sparkles" className="h-5 w-5" />
            </span>
            <div className="flex items-center gap-2">
              <span className="font-display text-xl font-black tracking-tight text-neutral-900">
                Buildly
              </span>
              <span className="rounded-full bg-violet-100 px-2 py-0.5 text-[10px] font-extrabold text-violet-700 uppercase tracking-wider">
                Studio
              </span>
            </div>
          </button>

          {/* Navigation Tabs */}
          <nav className="hidden md:flex items-center gap-1 bg-neutral-100/90 p-1 rounded-2xl border border-neutral-200/60">
            <button
              type="button"
              onClick={() => setActiveTab('studio')}
              className={`flex items-center gap-2 rounded-xl px-4 py-1.5 text-xs font-bold transition ${
                activeTab === 'studio'
                  ? 'bg-white shadow text-violet-700'
                  : 'text-neutral-500 hover:text-neutral-900'
              }`}
            >
              <Icon name="sparkles" className="h-3.5 w-3.5" />
              <span>Studio Canvas</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('templates')}
              className={`flex items-center gap-2 rounded-xl px-4 py-1.5 text-xs font-bold transition ${
                activeTab === 'templates'
                  ? 'bg-white shadow text-violet-700'
                  : 'text-neutral-500 hover:text-neutral-900'
              }`}
            >
              <Icon name="app" className="h-3.5 w-3.5" />
              <span>Templates</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('projects')}
              className={`flex items-center gap-2 rounded-xl px-4 py-1.5 text-xs font-bold transition ${
                activeTab === 'projects'
                  ? 'bg-white shadow text-violet-700'
                  : 'text-neutral-500 hover:text-neutral-900'
              }`}
            >
              <Icon name="folder" className="h-3.5 w-3.5" />
              <span>My Projects ({projects.length})</span>
            </button>
          </nav>
        </div>

        {/* Right Action Icons */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={() => setPanel('command')}
            className="hidden sm:flex items-center gap-2 rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-1.5 text-xs font-semibold text-neutral-500 hover:bg-white hover:text-neutral-900 shadow-sm transition"
            title="Quick Action Command Palette (Ctrl+K)"
          >
            <Icon name="search" className="h-3.5 w-3.5" />
            <span>Search & Actions</span>
            <kbd className="rounded border border-neutral-300 bg-white px-1.5 text-[10px] text-neutral-400 font-mono-code">
              ⌘K
            </kbd>
          </button>

          <button
            type="button"
            onClick={() => setPanel('help')}
            className="grid h-9 w-9 place-items-center rounded-xl border border-neutral-200 bg-white text-neutral-600 hover:bg-neutral-50 shadow-sm transition"
            aria-label="Help and Prompting Guide"
          >
            <Icon name="help" className="h-4 w-4" />
          </button>

          <button
            type="button"
            onClick={() => setPanel('profile')}
            className="flex items-center gap-2 rounded-xl border border-neutral-200 bg-white p-1 pl-2 text-xs font-bold text-neutral-800 hover:bg-neutral-50 shadow-sm transition"
          >
            <span className="hidden sm:inline">Alex J.</span>
            <span className="grid h-7 w-7 place-items-center rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600 text-[11px] font-black text-white">
              AJ
            </span>
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-8 py-8 sm:py-10">
        {/* TAB 1: STUDIO CANVAS */}
        {activeTab === 'studio' && (
          <div className="space-y-10">
            {/* Studio Hero Input Box */}
            <section className="relative mx-auto max-w-3xl text-center space-y-6">
              {/* Glowing background circles */}
              <div className="pointer-events-none absolute left-1/4 -top-10 h-64 w-64 rounded-full bg-violet-200/40 blur-3xl" />
              <div className="pointer-events-none absolute right-1/4 -top-8 h-64 w-64 rounded-full bg-pink-200/30 blur-3xl" />

              <div className="relative">
                <span className="inline-flex items-center gap-2 rounded-full border border-violet-200 bg-white/90 px-3.5 py-1 text-xs font-bold text-violet-700 shadow-sm backdrop-blur-md">
                  <Icon name="sparkles" className="h-3.5 w-3.5 text-violet-600" />
                  <span>The No-Code AI Creation Engine</span>
                </span>

                <h1 className="font-display mt-4 text-4xl sm:text-5xl font-black tracking-tight text-neutral-900 leading-[1.08]">
                  What will you{' '}
                  <span className="bg-gradient-to-r from-violet-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                    bring to life?
                  </span>
                </h1>

                <p className="mt-3 text-sm sm:text-base text-neutral-600 max-w-xl mx-auto leading-relaxed">
                  Describe any app, website, arcade game, bug fix, or feature roadmap in plain English. Buildly instantly constructs working code.
                </p>
              </div>

              {/* Input Card */}
              <div className="relative mx-auto rounded-3xl border border-neutral-200/90 bg-white/95 p-3 sm:p-4 shadow-xl shadow-purple-900/5 backdrop-blur-md transition-all focus-within:border-violet-400 focus-within:ring-4 focus-within:ring-violet-100">
                {/* Mode Selector Tabs */}
                <div className="flex flex-wrap items-center gap-1.5 pb-3 border-b border-neutral-100 mb-3">
                  {[
                    { id: 'app' as const, label: 'App Builder', icon: 'app' as const, color: 'text-violet-600' },
                    { id: 'site' as const, label: 'Website', icon: 'site' as const, color: 'text-emerald-600' },
                    { id: 'game' as const, label: 'Game Studio', icon: 'game' as const, color: 'text-amber-600' },
                    { id: 'bug' as const, label: 'Code Doctor', icon: 'bug' as const, color: 'text-rose-600' },
                    { id: 'bulb' as const, label: 'Idea Roadmap', icon: 'bulb' as const, color: 'text-blue-600' },
                  ].map((m) => (
                    <button
                      type="button"
                      key={m.id}
                      onClick={() => setMode(m.id)}
                      className={`flex items-center gap-2 rounded-xl px-3.5 py-1.5 text-xs font-bold transition ${
                        mode === m.id
                          ? 'bg-neutral-900 text-white shadow-sm'
                          : 'bg-neutral-50 text-neutral-600 hover:bg-neutral-100'
                      }`}
                    >
                      <Icon name={m.icon} className="h-3.5 w-3.5" />
                      <span>{m.label}</span>
                    </button>
                  ))}
                </div>

                {/* Prompt Textarea */}
                <form onSubmit={handleGenerate}>
                  <textarea
                    ref={ideaInputRef}
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder={
                      mode === 'site'
                        ? 'Example: Make a website for an artisan sourdough bakery and coffee shop...'
                        : mode === 'game'
                        ? 'Example: Make an arcade game where a spaceship dodges asteroids...'
                        : mode === 'bug'
                        ? 'Example: Fix race condition when rapidly switching tabs...'
                        : mode === 'bulb'
                        ? 'Example: Improve an idea for a daily language flashcard tutor...'
                        : 'Example: Build a habit and streak tracker with categories and progress charts...'
                    }
                    rows={3}
                    className="w-full resize-none rounded-2xl bg-transparent px-3 py-2 text-sm sm:text-base outline-none placeholder:text-neutral-400"
                  />

                  {/* Website Config Drawer if in 'site' mode */}
                  {mode === 'site' && (
                    <div className="my-3 rounded-2xl border border-neutral-200 bg-neutral-50/80 p-4 text-left space-y-4">
                      <div className="flex items-center justify-between pb-2 border-b border-neutral-200/80">
                        <div className="flex items-center gap-2">
                          <span className="grid h-6 w-6 place-items-center rounded-lg bg-emerald-100 text-emerald-700">
                            <Icon name="site" className="h-3.5 w-3.5" />
                          </span>
                          <span className="text-xs font-bold text-neutral-800">Customize Website Details</span>
                        </div>
                        <span className="text-[11px] text-neutral-400">Live preview reflects these fields</span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                        <div>
                          <label className="block font-bold text-neutral-600 mb-1">Business Name</label>
                          <input
                            type="text"
                            value={website.businessName}
                            onChange={(e) => setWebsite({ ...website, businessName: e.target.value })}
                            className="w-full rounded-xl border border-neutral-300 bg-white px-3 py-2 text-xs font-medium focus:border-violet-500 focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block font-bold text-neutral-600 mb-1">Founder / Owner Name</label>
                          <input
                            type="text"
                            value={website.owner}
                            onChange={(e) => setWebsite({ ...website, owner: e.target.value })}
                            className="w-full rounded-xl border border-neutral-300 bg-white px-3 py-2 text-xs font-medium focus:border-violet-500 focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block font-bold text-neutral-600 mb-1">Brand Color</label>
                          <div className="flex items-center gap-2 border border-neutral-300 bg-white rounded-xl px-2 py-1">
                            <input
                              type="color"
                              value={website.color}
                              onChange={(e) => setWebsite({ ...website, color: e.target.value })}
                              className="h-6 w-7 cursor-pointer border-0 bg-transparent p-0"
                            />
                            <input
                              type="text"
                              value={website.color}
                              onChange={(e) => setWebsite({ ...website, color: e.target.value })}
                              className="w-full text-xs font-mono-code font-bold uppercase outline-none"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block font-bold text-neutral-600 mb-1">Typography Style</label>
                          <select
                            value={website.font}
                            onChange={(e) => setWebsite({ ...website, font: e.target.value })}
                            className="w-full rounded-xl border border-neutral-300 bg-white px-3 py-2 text-xs font-medium focus:border-violet-500 focus:outline-none"
                          >
                            <option>Modern & clean</option>
                            <option>Bold & playful</option>
                            <option>Elegant & classic</option>
                            <option>Friendly & rounded</option>
                            <option>Minimal & editorial</option>
                          </select>
                        </div>

                        <div className="sm:col-span-2">
                          <label className="block font-bold text-neutral-600 mb-1">Headline Tagline</label>
                          <input
                            type="text"
                            value={website.tagline}
                            onChange={(e) => setWebsite({ ...website, tagline: e.target.value })}
                            className="w-full rounded-xl border border-neutral-300 bg-white px-3 py-2 text-xs font-medium focus:border-violet-500 focus:outline-none"
                          />
                        </div>

                        <div className="sm:col-span-2">
                          <label className="block font-bold text-neutral-600 mb-1">Business Description</label>
                          <textarea
                            rows={2}
                            value={website.blurb}
                            onChange={(e) => setWebsite({ ...website, blurb: e.target.value })}
                            className="w-full rounded-xl border border-neutral-300 bg-white px-3 py-2 text-xs font-medium focus:border-violet-500 focus:outline-none resize-none"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Action Bar */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-neutral-100">
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => {
                          const rand = starterChips[Math.floor(Math.random() * starterChips.length)]
                          setPrompt(rand)
                        }}
                        className="rounded-xl border border-neutral-200 bg-neutral-50 hover:bg-neutral-100 px-3 py-1.5 text-xs font-semibold text-neutral-600 transition flex items-center gap-1.5"
                        title="Surprise me with a random prompt"
                      >
                        <span>🎲 Surprise Me</span>
                      </button>
                    </div>

                    <button
                      type="submit"
                      disabled={!prompt.trim() || generating}
                      className="rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold px-6 py-2.5 text-xs shadow-md shadow-violet-600/30 flex items-center gap-2 hover:-translate-y-0.5 transition disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      {generating ? (
                        <>
                          <span className="h-3 w-3 animate-spin rounded-full border-2 border-white border-t-transparent" />
                          <span>Constructing…</span>
                        </>
                      ) : (
                        <>
                          <span>Build Creation</span>
                          <Icon name="arrow" className="h-3.5 w-3.5" />
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>

              {/* Starter Chips */}
              <div className="flex flex-wrap items-center justify-center gap-1.5 text-xs">
                <span className="text-neutral-400 font-semibold mr-1">Quick Starters:</span>
                {starterChips.slice(0, 4).map((chip, idx) => (
                  <button
                    type="button"
                    key={idx}
                    onClick={() => {
                      setPrompt(chip)
                      setTimeout(() => ideaInputRef.current?.focus(), 50)
                    }}
                    className="rounded-full border border-neutral-200 bg-white/80 hover:bg-white px-3 py-1 text-[11px] font-medium text-neutral-600 hover:border-violet-300 hover:text-violet-700 transition shadow-2xs"
                  >
                    {chip}
                  </button>
                ))}
              </div>
            </section>

            {/* STUDIO WORKSPACE CANVAS */}
            <section id="studio-canvas" className="space-y-4">
              {/* If Website mode, show dedicated interactive Website Editor */}
              {mode === 'site' && (
                <div className="mb-2">
                  <WebsiteEditor
                    website={website}
                    onChange={(updated) => setWebsite(updated)}
                    onOpenPopUp={() => setShowAssembledPopUp(true)}
                    onUploadImage={handleUpload}
                  />
                </div>
              )}

              {/* Canvas Controls Header */}
              <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-3xl border border-neutral-200/90 shadow-sm">
                <div className="flex items-center gap-3">
                  <span className="grid h-10 w-10 place-items-center rounded-2xl bg-violet-100 text-violet-700 font-bold">
                    <Icon name={mode} className="h-5 w-5" />
                  </span>
                  <div>
                    <h2 className="font-display font-bold text-base sm:text-lg text-neutral-900">
                      {result?.title || (mode === 'site' ? `${website.businessName} Website` : 'Interactive Canvas')}
                    </h2>
                    <p className="text-xs text-neutral-500">
                      Mode: <span className="font-bold uppercase text-violet-700">{mode}</span> • Live Interactive Session
                    </p>
                  </div>
                </div>

                {/* Viewport & View Mode Toggles */}
                <div className="flex flex-wrap items-center gap-3">
                  {/* Website Assembled Pop-up button */}
                  {mode === 'site' && (
                    <button
                      type="button"
                      onClick={() => setShowAssembledPopUp(true)}
                      className="rounded-2xl bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold px-4 py-2 text-xs shadow-md shadow-violet-600/30 flex items-center gap-1.5 transition hover:-translate-y-0.5"
                    >
                      <Icon name="sparkles" className="h-3.5 w-3.5 text-amber-300" />
                      <span>View Assembled Site (Pop-up) 🚀</span>
                    </button>
                  )}

                  {/* Preview vs Code Tab */}
                  <div className="flex items-center gap-1 bg-neutral-100 p-1 rounded-2xl">
                    <button
                      type="button"
                      onClick={() => setStudioView('preview')}
                      className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition ${
                        studioView === 'preview'
                          ? 'bg-white shadow text-violet-700'
                          : 'text-neutral-500 hover:text-neutral-900'
                      }`}
                    >
                      <Icon name="sparkles" className="h-3.5 w-3.5" />
                      <span>Live Preview</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setStudioView('code')}
                      className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition ${
                        studioView === 'code'
                          ? 'bg-white shadow text-violet-700'
                          : 'text-neutral-500 hover:text-neutral-900'
                      }`}
                    >
                      <Icon name="code" className="h-3.5 w-3.5" />
                      <span>Code Inspector</span>
                    </button>
                  </div>

                  {/* Device Size Toggles (Desktop, Tablet, Mobile) */}
                  {studioView === 'preview' && (
                    <div className="hidden sm:flex items-center gap-1 bg-neutral-100 p-1 rounded-2xl">
                      <button
                        type="button"
                        onClick={() => setDeviceViewport('desktop')}
                        className={`p-1.5 rounded-xl transition ${
                          deviceViewport === 'desktop' ? 'bg-white shadow text-violet-700' : 'text-neutral-400 hover:text-neutral-800'
                        }`}
                        title="Desktop View (100%)"
                      >
                        <Icon name="desktop" className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeviceViewport('tablet')}
                        className={`p-1.5 rounded-xl transition ${
                          deviceViewport === 'tablet' ? 'bg-white shadow text-violet-700' : 'text-neutral-400 hover:text-neutral-800'
                        }`}
                        title="Tablet View (768px)"
                      >
                        <Icon name="tablet" className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeviceViewport('mobile')}
                        className={`p-1.5 rounded-xl transition ${
                          deviceViewport === 'mobile' ? 'bg-white shadow text-violet-700' : 'text-neutral-400 hover:text-neutral-800'
                        }`}
                        title="Mobile View (375px)"
                      >
                        <Icon name="mobile" className="h-4 w-4" />
                      </button>
                    </div>
                  )}

                  {/* Save to Projects Button */}
                  {result && (
                    <button
                      type="button"
                      onClick={handleSaveToProjects}
                      className="rounded-2xl border border-neutral-300 bg-white hover:bg-neutral-50 px-3.5 py-2 text-xs font-bold text-neutral-700 shadow-sm transition flex items-center gap-1.5"
                    >
                      <Icon name="folder" className="h-3.5 w-3.5" />
                      <span>Save to Library</span>
                    </button>
                  )}

                  {/* Download HTML Button */}
                  <button
                    type="button"
                    onClick={() => {
                      const filename = `${(result?.title || website.businessName || 'buildly-creation')
                        .toLowerCase()
                        .replace(/[^a-z0-9]+/g, '-')}.html`
                      downloadFile(filename, currentCode)
                      addToast('Download complete', `Saved ${filename} directly to your device.`)
                    }}
                    className="rounded-2xl bg-neutral-900 hover:bg-neutral-800 text-white px-4 py-2 text-xs font-bold shadow transition flex items-center gap-1.5"
                  >
                    <Icon name="download" className="h-3.5 w-3.5" />
                    <span>Download .HTML</span>
                  </button>
                </div>
              </div>

              {/* Viewport Frame */}
              <div className="flex justify-center">
                <div
                  className={`w-full transition-all duration-300 overflow-hidden rounded-3xl border border-neutral-200/90 shadow-2xl bg-white ${
                    deviceViewport === 'mobile'
                      ? 'max-w-sm ring-8 ring-neutral-900/10'
                      : deviceViewport === 'tablet'
                      ? 'max-w-2xl ring-8 ring-neutral-900/10'
                      : 'max-w-full'
                  }`}
                >
                  {/* Code View Inspector */}
                  {studioView === 'code' ? (
                    <div className="bg-[#13111f] text-neutral-100 p-6 font-mono-code text-xs leading-relaxed overflow-x-auto min-h-[500px]">
                      <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4 text-xs text-neutral-400">
                        <span>Standalone Ready-to-Run Single File HTML</span>
                        <button
                          type="button"
                          onClick={() => {
                            navigator.clipboard.writeText(currentCode)
                            addToast('Code copied!', 'Complete standalone HTML is in your clipboard.')
                          }}
                          className="rounded-lg bg-white/10 hover:bg-white/20 px-3 py-1 text-white font-bold transition flex items-center gap-1"
                        >
                          <Icon name="copy" className="h-3 w-3" />
                          <span>Copy Code</span>
                        </button>
                      </div>
                      <pre className="whitespace-pre-wrap">{currentCode}</pre>
                    </div>
                  ) : (
                    /* Live Component View depending on Mode */
                    <div className="min-h-[550px] flex flex-col">
                      {mode === 'site' && (
                        <div className="flex flex-col">
                          <div className="bg-gradient-to-r from-violet-50 to-indigo-50 border-b border-violet-100 px-6 py-3 flex items-center justify-between text-xs">
                            <div className="flex items-center gap-2 text-violet-800 font-semibold">
                              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                              <span>Live Assembled Preview • Edit sections above or launch pop-up</span>
                            </div>
                            <button
                              type="button"
                              onClick={() => setShowAssembledPopUp(true)}
                              className="rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-bold px-3 py-1 shadow-sm transition flex items-center gap-1"
                            >
                              <span>Open Pop-up ↗</span>
                            </button>
                          </div>
                          <WebsitePreview website={website} />
                        </div>
                      )}
                      {mode === 'game' && <GameStudio prompt={prompt || 'Nebula Space Dodger'} />}
                      {mode === 'bug' && (
                        <div className="p-6">
                          <CodeDoctor
                            prompt={prompt}
                            onApplyFix={(fix) => addToast('Fix Applied', 'Code repaired successfully.')}
                          />
                        </div>
                      )}
                      {mode === 'bulb' && (
                        <div className="p-6">
                          <IdeaArchitect prompt={prompt || 'Personalized AI Learning Hub'} />
                        </div>
                      )}
                      {mode === 'app' && (
                        <AppPreview prompt={prompt || 'Personal productivity and habit tracking workspace'} />
                      )}
                    </div>
                  )}
                </div>
              </div>
            </section>
          </div>
        )}

        {/* TAB 2: TEMPLATES & INSPIRATION */}
        {activeTab === 'templates' && (
          <TemplatesGallery
            onSelectTemplate={handleSelectTemplate}
            onQuickPreview={handleQuickPreview}
          />
        )}

        {/* TAB 3: MY PROJECTS */}
        {activeTab === 'projects' && (
          <ProjectManager
            projects={projects}
            onOpenProject={handleOpenProject}
            onDeleteProject={handleDeleteProject}
            onToggleStar={handleToggleStar}
            onDownloadProject={handleDownloadProject}
            onNewProject={() => {
              setActiveTab('studio')
              setPrompt('')
              setResult(null)
              window.scrollTo({ top: 0, behavior: 'smooth' })
              setTimeout(() => ideaInputRef.current?.focus(), 100)
            }}
          />
        )}
      </main>

      {/* Floating Bottom Nav for Mobile Screens */}
      <nav className="fixed inset-x-0 bottom-0 z-30 flex h-16 items-center justify-around border-t border-neutral-200 bg-white/95 px-4 backdrop-blur-md md:hidden">
        <button
          type="button"
          onClick={() => setActiveTab('studio')}
          className={`flex flex-col items-center gap-1 text-[11px] font-bold ${
            activeTab === 'studio' ? 'text-violet-600' : 'text-neutral-500'
          }`}
        >
          <Icon name="sparkles" className="h-5 w-5" />
          <span>Studio</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveTab('studio')
            setPrompt('')
            setResult(null)
            window.scrollTo({ top: 0, behavior: 'smooth' })
            setTimeout(() => ideaInputRef.current?.focus(), 100)
          }}
          className="-mt-6 grid h-12 w-12 place-items-center rounded-full bg-violet-600 text-white shadow-lg shadow-violet-600/40"
          aria-label="New creation"
        >
          <Icon name="plus" className="h-6 w-6" />
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('templates')}
          className={`flex flex-col items-center gap-1 text-[11px] font-medium ${
            activeTab === 'templates' ? 'text-violet-600 font-bold' : 'text-neutral-500'
          }`}
        >
          <Icon name="app" className="h-5 w-5" />
          <span>Templates</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('projects')}
          className={`flex flex-col items-center gap-1 text-[11px] font-medium ${
            activeTab === 'projects' ? 'text-violet-600 font-bold' : 'text-neutral-500'
          }`}
        >
          <Icon name="folder" className="h-5 w-5" />
          <span>Projects</span>
        </button>
      </nav>

      {/* Modals & Dialogs */}
      {panel && (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-neutral-950/40 p-4 backdrop-blur-sm animate-fade-in"
          onMouseDown={() => setPanel(null)}
        >
          <div
            onMouseDown={(e) => e.stopPropagation()}
            className="w-full max-w-md rounded-3xl border border-white/80 bg-white p-6 sm:p-8 shadow-2xl"
          >
            <div className="flex items-center justify-between pb-4 border-b border-neutral-100 mb-4">
              <span className="font-display font-bold text-lg text-neutral-900">
                {panel === 'help' && 'Buildly Prompting & Creator Guide'}
                {panel === 'profile' && 'Creator Profile & Workspace'}
                {panel === 'command' && 'Command Action Palette'}
              </span>
              <button
                type="button"
                onClick={() => setPanel(null)}
                className="grid h-8 w-8 place-items-center rounded-full bg-neutral-100 text-neutral-500 hover:bg-neutral-200 transition"
              >
                ×
              </button>
            </div>

            {/* Help Content */}
            {panel === 'help' && (
              <div className="space-y-4 text-xs text-neutral-600 leading-relaxed">
                <p>
                  Buildly lets you turn natural language ideas into fully functioning, responsive web apps, websites, games, and tools.
                </p>
                <div className="rounded-2xl bg-neutral-50 p-4 border border-neutral-200 space-y-2">
                  <p className="font-bold text-neutral-900">✨ Best Practices for Prompts:</p>
                  <ul className="list-disc pl-4 space-y-1 text-neutral-600">
                    <li><strong>Apps:</strong> Mention what data you want to track (e.g., habits, flashcards, workouts, expenses).</li>
                    <li><strong>Websites:</strong> State the business niche, tone, and what services or story to highlight.</li>
                    <li><strong>Games:</strong> Specify mechanics like dodging, clicking reflexes, or matching pairs.</li>
                    <li><strong>Keyboard Shortcuts:</strong> Use <kbd className="px-1 border rounded bg-white font-mono-code">Ctrl+K</kbd> to open quick search.</li>
                  </ul>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setPanel(null)
                    setActiveTab('templates')
                  }}
                  className="w-full rounded-2xl bg-violet-600 hover:bg-violet-700 text-white font-bold py-3 text-xs shadow-md transition"
                >
                  Explore Starter Templates →
                </button>
              </div>
            )}

            {/* Profile Content */}
            {panel === 'profile' && (
              <div className="space-y-4 text-xs text-neutral-600">
                <div className="flex items-center gap-3">
                  <span className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 text-white font-bold text-lg">
                    AJ
                  </span>
                  <div>
                    <h3 className="font-bold text-sm text-neutral-900">Alex Johnson</h3>
                    <p className="text-neutral-400">alex@example.com • Pro Creator Tier</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="rounded-2xl bg-neutral-50 p-3 border border-neutral-200 text-center">
                    <p className="text-[11px] text-neutral-400 font-bold uppercase">Saved Projects</p>
                    <p className="text-xl font-bold font-display text-violet-700 mt-1">{projects.length}</p>
                  </div>
                  <div className="rounded-2xl bg-neutral-50 p-3 border border-neutral-200 text-center">
                    <p className="text-[11px] text-neutral-400 font-bold uppercase">Storage Status</p>
                    <p className="text-xl font-bold font-display text-emerald-600 mt-1">Local & Offline</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setPanel(null)
                    setActiveTab('projects')
                  }}
                  className="w-full rounded-2xl bg-neutral-900 hover:bg-neutral-800 text-white font-bold py-3 text-xs shadow transition mt-2"
                >
                  Manage My Projects ({projects.length})
                </button>
              </div>
            )}

            {/* Command Palette */}
            {panel === 'command' && (
              <div className="space-y-3">
                <p className="text-xs text-neutral-400">Jump directly to any template or mode:</p>
                <div className="space-y-1.5 max-h-64 overflow-y-auto">
                  {templates.map((tpl) => (
                    <button
                      type="button"
                      key={tpl.id}
                      onClick={() => {
                        setPanel(null)
                        handleSelectTemplate(tpl)
                      }}
                      className="w-full text-left p-2.5 rounded-xl hover:bg-violet-50 hover:text-violet-900 text-xs font-semibold flex items-center justify-between transition"
                    >
                      <div className="flex items-center gap-2">
                        <Icon name={tpl.mode} className="h-4 w-4 text-violet-600" />
                        <span>{tpl.title}</span>
                      </div>
                      <span className="text-[10px] text-neutral-400">{tpl.category}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-neutral-200/80 bg-white py-6 px-4 sm:px-8 text-xs text-neutral-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-neutral-800">Buildly Studio</span>
            <span>• Turn Ideas into Working Apps, Websites & Games</span>
          </div>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setActiveTab('templates')}
              className="hover:text-neutral-900 font-medium"
            >
              Templates
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('projects')}
              className="hover:text-neutral-900 font-medium"
            >
              Projects ({projects.length})
            </button>
            <button
              type="button"
              onClick={() => setPanel('help')}
              className="hover:text-neutral-900 font-medium"
            >
              Guide
            </button>
          </div>
        </div>
      </footer>

      {/* Assembled Site Pop-up Modal */}
      <AssembledSiteModal
        website={website}
        isOpen={showAssembledPopUp}
        onClose={() => setShowAssembledPopUp(false)}
        onToast={(msg) => addToast('Assembled Site', msg)}
      />
    </div>
  )
}
