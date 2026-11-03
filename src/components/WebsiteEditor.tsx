import React, { useState } from 'react'
import type { WebsiteDetails } from '../types'
import { Icon } from './Icon'

interface WebsiteEditorProps {
  website: WebsiteDetails
  onChange: (updated: WebsiteDetails) => void
  onOpenPopUp: () => void
  onUploadImage: (file: File | undefined, field: 'logo' | 'founderPhoto') => void
}

const presetPalettes = [
  { name: 'Indigo Dream', color: '#6366f1' },
  { name: 'Warm Bakery Amber', color: '#d97706' },
  { name: 'Emerald Forest', color: '#059669' },
  { name: 'Sunset Rose', color: '#e11d48' },
  { name: 'Cyber Violet', color: '#8b5cf6' },
  { name: 'Midnight Slate', color: '#334155' },
]

const presetThemes: { name: string; icon: string; data: Partial<WebsiteDetails> }[] = [
  {
    name: 'Artisan Bakery',
    icon: '🥐',
    data: {
      businessName: 'The Artisan Boulangerie',
      owner: 'Élodie Laurent',
      tagline: 'Old-world French sourdough & handcrafted morning pastries',
      heroHeadline: 'Slow-Fermented Sourdough & Artisanal Pastries',
      ctaText: 'Explore Morning Menu',
      blurb: 'Award-winning neighborhood sourdough bakery and café serving handcrafted croissants and pour-overs made with organic heritage grains.',
      about: 'Trained in Paris, Élodie crafts sourdough bread with organic heritage grains and 48-hour slow fermentation.',
      color: '#d97706',
      font: 'Elegant & classic',
      features: [
        { icon: 'sparkles', title: '48h Slow Ferment', desc: 'Naturally leavened doughs for rich texture, crisp blistered crust, and superior digestibility.' },
        { icon: 'check', title: 'Organic Heritage Grains', desc: 'Locally milled stone-ground flours with zero artificial preservatives or bleach.' },
        { icon: 'app', title: 'Dawn-Baked Daily', desc: 'Every loaf and croissant pulled fresh from our stone deck ovens every morning at 6:00 AM.' },
      ],
    },
  },
  {
    name: 'Modern AI SaaS',
    icon: '⚡',
    data: {
      businessName: 'NexusFlow AI',
      owner: 'Marcus Vance',
      tagline: 'Next-generation intelligent automation for high-scale teams',
      heroHeadline: 'Automate Complex Workflows with Autonomous Intelligence',
      ctaText: 'Start Free Trial',
      blurb: 'Turn scattered operational tasks into self-driving pipelines. Trusted by over 10,000 forward-thinking engineering teams worldwide.',
      about: 'Founded by senior distributed systems researchers to empower organizations with reliable autonomous agent workflows.',
      color: '#6366f1',
      font: 'Modern & clean',
      features: [
        { icon: 'sparkles', title: 'Zero-Code Integrations', desc: 'Connect 100+ data sources and API endpoints in under two minutes with visual builders.' },
        { icon: 'check', title: 'Enterprise Encryption', desc: 'SOC2 Type II certified infrastructure with end-to-end cryptographic access control.' },
        { icon: 'app', title: 'Sub-Millisecond Edge', desc: 'Globally distributed compute fabric ensuring instant execution in 300+ regions.' },
      ],
    },
  },
  {
    name: 'Design Agency',
    icon: '🎨',
    data: {
      businessName: 'Vanguard Creative',
      owner: 'Sienna Brooks',
      tagline: 'Brand identity & digital design that captures attention',
      heroHeadline: 'We Craft Brands That Shape Culture & Inspire Action',
      ctaText: 'View Portfolio',
      blurb: 'A boutique design collective crafting boundary-pushing visual identities, interactive websites, and digital experiences.',
      about: 'Sienna has directed creative branding campaigns for world-renowned design brands and disruptive tech pioneers.',
      color: '#8b5cf6',
      font: 'Bold & playful',
      features: [
        { icon: 'sparkles', title: 'Bespoke Art Direction', desc: 'Tailor-made visual languages that set your product apart from every competitor.' },
        { icon: 'check', title: 'Fluid Interactions', desc: 'Modern micro-animations and motion design that make digital interfaces feel alive.' },
        { icon: 'app', title: 'Design System Delivery', desc: 'Comprehensive Figma design libraries and production-ready React code components.' },
      ],
    },
  },
]

export const WebsiteEditor: React.FC<WebsiteEditorProps> = ({
  website,
  onChange,
  onOpenPopUp,
  onUploadImage,
}) => {
  const [activeEditorTab, setActiveEditorTab] = useState<'brand' | 'hero' | 'features' | 'founder'>('brand')

  // Theme application
  const applyPreset = (theme: typeof presetThemes[0]) => {
    onChange({
      ...website,
      ...theme.data,
      features: theme.data.features || website.features,
    })
  }

  // Feature editing
  const updateFeature = (index: number, field: string, value: string) => {
    const list = [...(website.features || [])]
    if (list[index]) {
      list[index] = { ...list[index], [field]: value }
      onChange({ ...website, features: list })
    }
  }

  const addFeature = () => {
    const list = [
      ...(website.features || []),
      { icon: 'sparkles', title: 'New Key Value Proposition', desc: 'Describe how this benefit elevates your audience experience.' },
    ]
    onChange({ ...website, features: list })
  }

  const removeFeature = (index: number) => {
    const list = (website.features || []).filter((_, idx) => idx !== index)
    onChange({ ...website, features: list })
  }

  return (
    <div className="rounded-3xl border border-neutral-200/90 bg-white p-5 sm:p-7 shadow-sm space-y-6">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-neutral-100">
        <div className="flex items-center gap-3">
          <span
            className="grid h-11 w-11 place-items-center rounded-2xl text-white font-bold shadow-md transition-colors"
            style={{ backgroundColor: website.color || '#6366f1' }}
          >
            <Icon name="site" className="h-6 w-6" />
          </span>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-display font-bold text-lg text-neutral-900">
                {website.businessName || 'Website Studio'}
              </h3>
              <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-extrabold text-emerald-800 uppercase tracking-wider">
                Live Editor
              </span>
            </div>
            <p className="text-xs text-neutral-500">Edit sections below, then preview your assembled site</p>
          </div>
        </div>

        {/* The Key Assembled Site Pop-Up Button */}
        <button
          type="button"
          onClick={onOpenPopUp}
          className="rounded-2xl bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold px-5 py-3 text-xs shadow-lg shadow-violet-600/30 flex items-center justify-center gap-2 hover:-translate-y-0.5 transition active:translate-y-0"
        >
          <Icon name="sparkles" className="h-4 w-4 text-amber-300" />
          <span>View Assembled Site (Pop-up) →</span>
        </button>
      </div>

      {/* Preset Theme Quick Switcher */}
      <div className="rounded-2xl bg-neutral-50/80 p-3.5 border border-neutral-200/80">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider">
            Quick Starter Themes
          </span>
          <span className="text-[11px] text-neutral-400">1-click complete preset</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {presetThemes.map((theme, i) => (
            <button
              type="button"
              key={i}
              onClick={() => applyPreset(theme)}
              className="flex items-center gap-2.5 rounded-xl border border-neutral-200 bg-white p-2.5 text-left text-xs font-semibold text-neutral-700 hover:border-violet-400 hover:shadow-sm transition"
            >
              <span className="text-lg">{theme.icon}</span>
              <div>
                <p className="font-bold text-neutral-900 leading-tight">{theme.name}</p>
                <p className="text-[10px] text-neutral-400 leading-tight mt-0.5">
                  {theme.data.businessName}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Editor Section Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-1.5 border-b border-neutral-100 pb-2">
        {[
          { id: 'brand' as const, label: 'Identity & Colors', icon: 'palette' as const },
          { id: 'hero' as const, label: 'Hero Banner', icon: 'sparkles' as const },
          { id: 'features' as const, label: 'Features & Offerings', icon: 'app' as const },
          { id: 'founder' as const, label: 'Founder & Story', icon: 'home' as const },
        ].map((tab) => (
          <button
            type="button"
            key={tab.id}
            onClick={() => setActiveEditorTab(tab.id)}
            className={`flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold transition ${
              activeEditorTab === tab.id
                ? 'bg-neutral-900 text-white shadow-sm'
                : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200/80'
            }`}
          >
            <Icon name={tab.icon} className="h-3.5 w-3.5" />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* TAB 1: Identity & Colors */}
      {activeEditorTab === 'brand' && (
        <div className="grid sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block font-bold text-neutral-700 mb-1">Business / Brand Name</label>
            <input
              type="text"
              value={website.businessName}
              onChange={(e) => onChange({ ...website, businessName: e.target.value })}
              className="w-full rounded-xl border border-neutral-300 px-3.5 py-2.5 text-sm font-semibold focus:border-violet-500 focus:outline-none"
              placeholder="e.g. Evergreen Studio"
            />
          </div>

          <div>
            <label className="block font-bold text-neutral-700 mb-1">Typography Style</label>
            <select
              value={website.font}
              onChange={(e) => onChange({ ...website, font: e.target.value })}
              className="w-full rounded-xl border border-neutral-300 px-3.5 py-2.5 text-sm font-semibold focus:border-violet-500 focus:outline-none bg-white"
            >
              <option>Modern & clean</option>
              <option>Bold & playful</option>
              <option>Elegant & classic</option>
              <option>Friendly & rounded</option>
              <option>Minimal & editorial</option>
            </select>
          </div>

          <div className="sm:col-span-2">
            <label className="block font-bold text-neutral-700 mb-1">Brand Theme Color</label>
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2 border border-neutral-300 rounded-xl px-3 py-1.5 bg-white">
                <input
                  type="color"
                  value={website.color}
                  onChange={(e) => onChange({ ...website, color: e.target.value })}
                  className="h-7 w-8 cursor-pointer border-0 bg-transparent p-0"
                />
                <input
                  type="text"
                  value={website.color}
                  onChange={(e) => onChange({ ...website, color: e.target.value })}
                  className="w-24 text-xs font-mono-code font-bold uppercase outline-none"
                />
              </div>

              {/* Quick Color Swatches */}
              <div className="flex flex-wrap items-center gap-1.5">
                {presetPalettes.map((p, idx) => (
                  <button
                    type="button"
                    key={idx}
                    onClick={() => onChange({ ...website, color: p.color })}
                    className="h-8 w-8 rounded-xl border-2 transition hover:scale-110 shadow-sm"
                    style={{
                      backgroundColor: p.color,
                      borderColor: website.color === p.color ? '#1f1d2b' : 'transparent',
                    }}
                    title={p.name}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="sm:col-span-2">
            <label className="block font-bold text-neutral-700 mb-1">Short Brand Tagline</label>
            <input
              type="text"
              value={website.tagline}
              onChange={(e) => onChange({ ...website, tagline: e.target.value })}
              className="w-full rounded-xl border border-neutral-300 px-3.5 py-2.5 text-sm font-medium focus:border-violet-500 focus:outline-none"
              placeholder="e.g. Crafted with precision & passion"
            />
          </div>
        </div>
      )}

      {/* TAB 2: Hero Banner */}
      {activeEditorTab === 'hero' && (
        <div className="grid sm:grid-cols-2 gap-4 text-xs">
          <div className="sm:col-span-2">
            <label className="block font-bold text-neutral-700 mb-1">Main Hero Headline</label>
            <input
              type="text"
              value={website.heroHeadline || ''}
              onChange={(e) => onChange({ ...website, heroHeadline: e.target.value })}
              className="w-full rounded-xl border border-neutral-300 px-3.5 py-2.5 text-sm font-semibold focus:border-violet-500 focus:outline-none"
              placeholder={`e.g. Experience ${website.businessName || 'Evergreen Studio'}`}
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block font-bold text-neutral-700 mb-1">Subheadline Description</label>
            <textarea
              rows={3}
              value={website.blurb}
              onChange={(e) => onChange({ ...website, blurb: e.target.value })}
              className="w-full rounded-xl border border-neutral-300 px-3.5 py-2.5 text-sm font-medium focus:border-violet-500 focus:outline-none resize-none leading-relaxed"
              placeholder="Describe your value proposition..."
            />
          </div>

          <div>
            <label className="block font-bold text-neutral-700 mb-1">Call to Action (CTA) Button</label>
            <input
              type="text"
              value={website.ctaText || 'Start Exploring'}
              onChange={(e) => onChange({ ...website, ctaText: e.target.value })}
              className="w-full rounded-xl border border-neutral-300 px-3.5 py-2.5 text-sm font-semibold focus:border-violet-500 focus:outline-none"
              placeholder="e.g. Start Exploring"
            />
          </div>

          <div>
            <label className="block font-bold text-neutral-700 mb-1">Contact Email Address</label>
            <input
              type="email"
              value={website.contactEmail || 'hello@example.com'}
              onChange={(e) => onChange({ ...website, contactEmail: e.target.value })}
              className="w-full rounded-xl border border-neutral-300 px-3.5 py-2.5 text-sm font-medium focus:border-violet-500 focus:outline-none"
              placeholder="contact@yourbusiness.com"
            />
          </div>
        </div>
      )}

      {/* TAB 3: Features & Offerings */}
      {activeEditorTab === 'features' && (
        <div className="space-y-4 text-xs">
          <div className="flex items-center justify-between">
            <p className="font-bold text-neutral-700">Value Propositions ({website.features?.length || 0})</p>
            <button
              type="button"
              onClick={addFeature}
              className="rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white font-bold px-3 py-1.5 text-xs transition"
            >
              + Add Feature
            </button>
          </div>

          <div className="space-y-3">
            {(website.features || []).map((feat, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-neutral-200 bg-neutral-50/70 p-4 space-y-3"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-bold text-neutral-700">Feature #{idx + 1}</span>
                  <button
                    type="button"
                    onClick={() => removeFeature(idx)}
                    className="text-neutral-400 hover:text-rose-600 transition text-xs font-bold"
                  >
                    Remove ×
                  </button>
                </div>

                <div className="grid sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-neutral-500 mb-1">Title</label>
                    <input
                      type="text"
                      value={feat.title}
                      onChange={(e) => updateFeature(idx, 'title', e.target.value)}
                      className="w-full rounded-xl border border-neutral-300 bg-white px-3 py-2 text-xs font-bold focus:border-violet-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-neutral-500 mb-1">Icon Style</label>
                    <select
                      value={feat.icon}
                      onChange={(e) => updateFeature(idx, 'icon', e.target.value)}
                      className="w-full rounded-xl border border-neutral-300 bg-white px-3 py-2 text-xs font-semibold focus:border-violet-500 focus:outline-none"
                    >
                      <option value="sparkles">✨ Sparkles</option>
                      <option value="check">✓ Checkmark</option>
                      <option value="app">⚡ App / Shield</option>
                      <option value="star">★ Star</option>
                      <option value="fire">🔥 Fire</option>
                    </select>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block font-semibold text-neutral-500 mb-1">Description</label>
                    <textarea
                      rows={2}
                      value={feat.desc}
                      onChange={(e) => updateFeature(idx, 'desc', e.target.value)}
                      className="w-full rounded-xl border border-neutral-300 bg-white px-3 py-2 text-xs font-medium focus:border-violet-500 focus:outline-none resize-none"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: Founder & Story */}
      {activeEditorTab === 'founder' && (
        <div className="grid sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block font-bold text-neutral-700 mb-1">Founder / Owner Name</label>
            <input
              type="text"
              value={website.owner}
              onChange={(e) => onChange({ ...website, owner: e.target.value })}
              className="w-full rounded-xl border border-neutral-300 px-3.5 py-2.5 text-sm font-semibold focus:border-violet-500 focus:outline-none"
              placeholder="e.g. Alex Johnson"
            />
          </div>

          <div>
            <label className="block font-bold text-neutral-700 mb-1">Founder Photo</label>
            <div className="flex items-center gap-3">
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-neutral-100 border border-neutral-200 overflow-hidden text-neutral-600 font-bold">
                {website.founderPhoto ? (
                  <img src={website.founderPhoto} alt="Founder" className="h-full w-full object-cover" />
                ) : (
                  (website.owner || 'A').charAt(0)
                )}
              </span>
              <label className="cursor-pointer rounded-xl bg-neutral-100 hover:bg-neutral-200 px-3 py-2 text-xs font-bold text-neutral-700 transition">
                Upload Photo
                <input
                  type="file"
                  accept="image/*"
                  className="sr-only"
                  onChange={(e) => onUploadImage(e.target.files?.[0], 'founderPhoto')}
                />
              </label>
            </div>
          </div>

          <div className="sm:col-span-2">
            <label className="block font-bold text-neutral-700 mb-1">Founder Bio & Background</label>
            <textarea
              rows={4}
              value={website.about}
              onChange={(e) => onChange({ ...website, about: e.target.value })}
              className="w-full rounded-xl border border-neutral-300 px-3.5 py-2.5 text-sm font-medium focus:border-violet-500 focus:outline-none resize-none leading-relaxed"
              placeholder="Tell visitors about the founder and why they started this venture..."
            />
          </div>
        </div>
      )}

      {/* Footer launch button */}
      <div className="pt-3 border-t border-neutral-100 flex items-center justify-between">
        <span className="text-xs text-neutral-400">Edits are live-saved and reflected instantly</span>
        <button
          type="button"
          onClick={onOpenPopUp}
          className="rounded-2xl bg-neutral-900 hover:bg-neutral-800 text-white font-bold px-6 py-2.5 text-xs shadow-md transition flex items-center gap-2"
        >
          <span>Open Assembled Site Pop-up</span>
          <Icon name="arrow" className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  )
}
