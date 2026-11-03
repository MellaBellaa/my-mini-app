import React, { useState } from 'react'
import type { WebsiteDetails } from '../types'
import { Icon } from './Icon'
import { WebsitePreview } from './WebsitePreview'
import { downloadFile, generateWebsiteHtml } from '../utils/codeGenerators'

interface AssembledSiteModalProps {
  website: WebsiteDetails
  isOpen: boolean
  onClose: () => void
  onToast?: (msg: string) => void
}

export const AssembledSiteModal: React.FC<AssembledSiteModalProps> = ({
  website,
  isOpen,
  onClose,
  onToast,
}) => {
  const [viewport, setViewport] = useState<'desktop' | 'tablet' | 'mobile'>('desktop')

  if (!isOpen) return null

  const domainSlug = (website.businessName || 'my-website')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')

  const siteUrl = `https://${domainSlug || 'evergreen'}.buildly.site`

  const handleDownload = () => {
    const html = generateWebsiteHtml(website)
    const filename = `${domainSlug || 'website'}.html`
    downloadFile(filename, html)
    if (onToast) onToast(`Saved ${filename} to your device.`)
  }

  const handleCopyLink = () => {
    navigator.clipboard.writeText(siteUrl)
    if (onToast) onToast('Website preview link copied to clipboard.')
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-950/75 p-2 sm:p-5 backdrop-blur-md animate-fade-in"
      role="dialog"
      aria-modal="true"
    >
      <div className="flex h-full max-h-[94vh] w-full max-w-6xl flex-col rounded-3xl border border-white/20 bg-neutral-900 shadow-2xl overflow-hidden">
        {/* Mock Browser Header Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 bg-neutral-950 px-4 sm:px-6 py-3.5 text-white">
          {/* Window dots */}
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-rose-500/90" />
            <span className="h-3 w-3 rounded-full bg-amber-500/90" />
            <span className="h-3 w-3 rounded-full bg-emerald-500/90" />
            <span className="ml-3 hidden sm:inline text-xs font-bold text-neutral-400">
              Assembled Site Preview
            </span>
          </div>

          {/* Address Bar */}
          <div className="flex flex-1 max-w-md items-center justify-between rounded-xl bg-white/10 px-3.5 py-1.5 text-xs text-neutral-200 border border-white/10">
            <div className="flex items-center gap-2 truncate">
              <span className="text-emerald-400 text-[10px]">🔒</span>
              <span className="truncate font-mono-code text-[11px] font-medium">{siteUrl}</span>
            </div>
            <button
              type="button"
              onClick={handleCopyLink}
              title="Copy URL"
              className="text-neutral-400 hover:text-white transition p-1"
            >
              <Icon name="copy" className="h-3 w-3" />
            </button>
          </div>

          {/* Viewport & Action Controls */}
          <div className="flex items-center gap-2">
            {/* Viewport pills */}
            <div className="flex items-center gap-1 rounded-xl bg-white/10 p-1 border border-white/10">
              <button
                type="button"
                onClick={() => setViewport('desktop')}
                className={`p-1.5 rounded-lg transition ${
                  viewport === 'desktop' ? 'bg-violet-600 text-white' : 'text-neutral-400 hover:text-white'
                }`}
                title="Desktop View (100%)"
              >
                <Icon name="desktop" className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setViewport('tablet')}
                className={`p-1.5 rounded-lg transition ${
                  viewport === 'tablet' ? 'bg-violet-600 text-white' : 'text-neutral-400 hover:text-white'
                }`}
                title="Tablet View (768px)"
              >
                <Icon name="tablet" className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setViewport('mobile')}
                className={`p-1.5 rounded-lg transition ${
                  viewport === 'mobile' ? 'bg-violet-600 text-white' : 'text-neutral-400 hover:text-white'
                }`}
                title="Mobile View (375px)"
              >
                <Icon name="mobile" className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* Download Button */}
            <button
              type="button"
              onClick={handleDownload}
              className="hidden sm:flex items-center gap-1.5 rounded-xl bg-white/15 hover:bg-white/25 px-3 py-1.5 text-xs font-bold text-white transition border border-white/10"
              title="Download Assembled HTML"
            >
              <Icon name="download" className="h-3.5 w-3.5" />
              <span>Download HTML</span>
            </button>

            {/* Close */}
            <button
              type="button"
              onClick={onClose}
              className="grid h-8 w-8 place-items-center rounded-xl bg-white/10 hover:bg-rose-600 text-white transition"
              aria-label="Close pop-up"
            >
              ×
            </button>
          </div>
        </div>

        {/* Browser Viewport Area */}
        <div className="flex-1 overflow-y-auto bg-neutral-900/60 p-2 sm:p-6 flex justify-center">
          <div
            className={`w-full bg-white shadow-2xl transition-all duration-300 rounded-2xl overflow-hidden ${
              viewport === 'mobile'
                ? 'max-w-sm border-8 border-neutral-800'
                : viewport === 'tablet'
                ? 'max-w-2xl border-8 border-neutral-800'
                : 'max-w-full'
            }`}
          >
            <WebsitePreview website={website} standalone={false} />
          </div>
        </div>

        {/* Footer info bar inside modal */}
        <div className="flex items-center justify-between border-t border-white/10 bg-neutral-950 px-6 py-2.5 text-xs text-neutral-400">
          <span>✨ Assembled with Buildly Website Engine</span>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={handleDownload}
              className="text-violet-400 hover:underline font-bold"
            >
              Export Standalone HTML
            </button>
            <button
              type="button"
              onClick={onClose}
              className="text-neutral-300 hover:text-white font-semibold"
            >
              Return to Editor
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
