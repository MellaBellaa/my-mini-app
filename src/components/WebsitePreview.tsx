import React, { useState } from 'react'
import type { WebsiteDetails } from '../types'
import { Icon } from './Icon'

interface WebsitePreviewProps {
  website: WebsiteDetails
  standalone?: boolean
  onBack?: () => void
}

export const WebsitePreview: React.FC<WebsitePreviewProps> = ({ website, standalone = false, onBack }) => {
  const [formSent, setFormSent] = useState(false)
  const [formData, setFormData] = useState({ name: '', email: '', message: '' })

  const brandColor = website.color || '#6366f1'
  const fontFamily = website.font.includes('Elegant')
    ? 'Georgia, serif'
    : website.font.includes('Editorial')
    ? '"Times New Roman", serif'
    : website.font.includes('Rounded')
    ? '"Trebuchet MS", sans-serif'
    : website.font.includes('Bold')
    ? '"Plus Jakarta Sans", sans-serif'
    : '"Manrope", sans-serif'

  const handleContact = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name || !formData.email) return
    setFormSent(true)
    setTimeout(() => {
      setFormData({ name: '', email: '', message: '' })
      setFormSent(false)
    }, 4000)
  }

  return (
    <div className="min-h-full w-full bg-white text-neutral-900 selection:bg-violet-100" style={{ fontFamily }}>
      {/* Top Bar for Back button if in standalone mode */}
      {standalone && (
        <div className="bg-neutral-950 text-white px-6 py-3 flex items-center justify-between text-xs sticky top-0 z-50">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Live Website Preview • Published with Buildly</span>
          </div>
          {onBack && (
            <button
              onClick={onBack}
              className="rounded-full bg-white/10 hover:bg-white/20 px-3 py-1 font-semibold transition"
            >
              ← Return to Buildly Studio
            </button>
          )}
        </div>
      )}

      {/* Website Header */}
      <header className="border-b border-neutral-100 bg-white/90 backdrop-blur-md sticky top-0 z-40 transition-all">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            {website.logo ? (
              <img src={website.logo} alt="Logo" className="h-10 w-10 rounded-xl object-contain shadow-sm" />
            ) : (
              <span
                className="grid h-10 w-10 place-items-center rounded-xl text-white font-bold shadow-md"
                style={{ backgroundColor: brandColor }}
              >
                {website.businessName.charAt(0) || 'B'}
              </span>
            )}
            <span className="font-extrabold text-lg tracking-tight font-display">
              {website.businessName || 'Evergreen Studio'}
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-neutral-600">
            <a href="#features" className="hover:text-neutral-900 transition">Features</a>
            <a href="#about" className="hover:text-neutral-900 transition">About</a>
            <a href="#pricing" className="hover:text-neutral-900 transition">Pricing</a>
            <a href="#contact" className="hover:text-neutral-900 transition">Contact</a>
          </nav>

          <a
            href="#contact"
            className="rounded-full px-5 py-2.5 text-xs font-bold text-white shadow-md hover:opacity-95 transition"
            style={{ backgroundColor: brandColor }}
          >
            Get Started
          </a>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-24 px-6">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div
              className="inline-flex items-center gap-2 rounded-full px-3.5 py-1 text-xs font-bold uppercase tracking-wider mb-5"
              style={{ backgroundColor: `${brandColor}18`, color: brandColor }}
            >
              <Icon name="sparkles" className="h-3.5 w-3.5" />
              <span>{website.tagline || 'Crafted with precision & passion'}</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-[1.08] text-neutral-950 font-display">
              {website.heroHeadline || (website.businessName ? `Experience ${website.businessName}` : 'Something truly meaningful, made for you.')}
            </h1>

            <p className="mt-6 text-lg text-neutral-600 leading-relaxed max-w-xl">
              {website.blurb ||
                'We design thoughtful solutions that empower your daily workflow and bring ambitious ideas to reality.'}
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <a
                href="#contact"
                className="rounded-full px-8 py-3.5 text-sm font-bold text-white shadow-lg hover:shadow-xl transition"
                style={{ backgroundColor: brandColor }}
              >
                {website.ctaText || 'Start Exploring'}
              </a>
              <a
                href="#about"
                className="rounded-full border border-neutral-300 bg-white px-6 py-3.5 text-sm font-bold text-neutral-700 hover:bg-neutral-50 transition"
              >
                Meet the Founder
              </a>
            </div>

            <div className="mt-10 flex items-center gap-4 text-xs font-semibold text-neutral-500">
              <span className="flex items-center gap-1">⭐ 5.0 Rating</span>
              <span>•</span>
              <span>⚡ Instant Access</span>
              <span>•</span>
              <span>🔒 100% Satisfaction</span>
            </div>
          </div>

          {/* Visual Showcase Card */}
          <div className="relative">
            <div
              className="aspect-[4/3] rounded-[36px] p-8 shadow-2xl relative overflow-hidden flex flex-col justify-between"
              style={{
                background: `linear-gradient(135deg, ${brandColor}, #181423)`,
              }}
            >
              <div className="flex justify-between items-center text-white/80">
                <span className="text-xs font-bold tracking-widest uppercase">Verified Showcase</span>
                <span className="h-3 w-3 rounded-full bg-emerald-400" />
              </div>

              <div className="text-white space-y-2">
                <h3 className="text-3xl font-extrabold font-display">{website.businessName}</h3>
                <p className="text-white/80 text-sm leading-relaxed max-w-md">
                  {website.blurb || 'Designed to elevate your brand presence and drive real conversion results.'}
                </p>
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-white/10 text-white/90 text-xs">
                <span>By {website.owner || 'Alex Johnson'}</span>
                <span>•</span>
                <span>Established 2026</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-20 px-6 bg-neutral-50/70 border-y border-neutral-100">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <p className="text-xs font-bold uppercase tracking-widest" style={{ color: brandColor }}>
              Why Choose Us
            </p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-neutral-900 font-display mt-2">
              Built with purpose, delivered with quality
            </h2>
            <p className="mt-3 text-neutral-600 text-sm">
              Everything you need to grow your venture seamlessly.
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-6">
            {(website.features && website.features.length > 0
              ? website.features
              : [
                  {
                    icon: 'sparkles' as const,
                    title: 'High-Impact Craftsmanship',
                    desc: 'Carefully tuned details that resonate with modern users and establish credibility.',
                  },
                  {
                    icon: 'app' as const,
                    title: 'Tailored Experience',
                    desc: 'Custom solutions mapped specifically to your audience preferences and business goals.',
                  },
                  {
                    icon: 'check' as const,
                    title: 'Reliable Support',
                    desc: 'Direct communication and ongoing updates to ensure complete peace of mind.',
                  },
                ]
            ).map((feature, i) => (
              <div
                key={i}
                className="bg-white rounded-3xl p-8 border border-neutral-200/80 shadow-sm hover:shadow-md transition"
              >
                <span
                  className="grid h-12 w-12 place-items-center rounded-2xl mb-6 text-white"
                  style={{ backgroundColor: brandColor }}
                >
                  <Icon name={(feature.icon as any) || 'sparkles'} className="h-6 w-6" />
                </span>
                <h3 className="text-lg font-bold text-neutral-900 font-display">{feature.title}</h3>
                <p className="mt-2 text-sm text-neutral-600 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Founder & Story Section */}
      <section id="about" className="py-20 px-6">
        <div className="max-w-4xl mx-auto bg-neutral-900 text-white rounded-3xl p-8 sm:p-14 shadow-2xl relative overflow-hidden">
          <div className="relative z-10 flex flex-col sm:flex-row items-center gap-8 text-center sm:text-left">
            {website.founderPhoto ? (
              <img
                src={website.founderPhoto}
                alt={website.owner}
                className="h-32 w-32 rounded-3xl object-cover border-4 border-white/20 shadow-xl shrink-0"
              />
            ) : (
              <div
                className="h-32 w-32 rounded-3xl flex items-center justify-center text-4xl font-black text-white shrink-0 shadow-xl"
                style={{ backgroundColor: brandColor }}
              >
                {(website.owner || 'A').charAt(0)}
              </div>
            )}

            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-violet-400">Meet the Founder</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold font-display mt-1">{website.owner || 'Alex Johnson'}</h2>
              <p className="mt-4 text-neutral-300 text-sm sm:text-base leading-relaxed">
                {website.about ||
                  'Passionate creator dedicated to helping customers achieve their highest potential with world-class products and relentless attention to detail.'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Contact Form */}
      <section id="contact" className="py-20 px-6 bg-neutral-50/50">
        <div className="max-w-2xl mx-auto bg-white rounded-3xl p-8 sm:p-10 border border-neutral-200 shadow-xl">
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 font-display">
              Ready to Connect?
            </h2>
            <p className="text-sm text-neutral-500 mt-2">
              Send us a message and we will respond within 24 hours.
            </p>
          </div>

          {formSent ? (
            <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-6 text-center text-emerald-800">
              <span className="text-2xl block mb-2">🎉</span>
              <p className="font-bold text-base">Message Sent Successfully!</p>
              <p className="text-xs text-emerald-700 mt-1">Thank you for reaching out to {website.businessName}.</p>
            </div>
          ) : (
            <form onSubmit={handleContact} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">Your Full Name</label>
                <input
                  required
                  type="text"
                  placeholder="Taylor Swift"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full rounded-2xl border border-neutral-300 px-4 py-3 text-sm focus:border-violet-600 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">Email Address</label>
                <input
                  required
                  type="email"
                  placeholder="taylor@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full rounded-2xl border border-neutral-300 px-4 py-3 text-sm focus:border-violet-600 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">How can we help you?</label>
                <textarea
                  rows={3}
                  placeholder="Tell us about what you need..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full rounded-2xl border border-neutral-300 px-4 py-3 text-sm focus:border-violet-600 focus:outline-none resize-none"
                />
              </div>
              <button
                type="submit"
                className="w-full rounded-2xl py-3.5 text-sm font-bold text-white shadow-lg transition hover:opacity-95"
                style={{ backgroundColor: brandColor }}
              >
                Send Inquiry →
              </button>
            </form>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-neutral-200 py-10 px-6 text-xs text-neutral-500">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} {website.businessName || 'Buildly'}. All rights reserved.</p>
          <div className="flex gap-6 font-semibold">
            <a href="#" className="hover:text-neutral-900">Privacy Policy</a>
            <a href="#" className="hover:text-neutral-900">Terms of Service</a>
            <a href="#about" className="hover:text-neutral-900">Founder</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
