export type Mode = 'app' | 'site' | 'game' | 'bug' | 'bulb'

export type IconName =
  | 'home'
  | 'folder'
  | 'sparkles'
  | 'plus'
  | 'arrow'
  | 'app'
  | 'site'
  | 'game'
  | 'bug'
  | 'bulb'
  | 'clock'
  | 'code'
  | 'copy'
  | 'download'
  | 'share'
  | 'trash'
  | 'search'
  | 'check'
  | 'refresh'
  | 'play'
  | 'pause'
  | 'external'
  | 'devices'
  | 'desktop'
  | 'tablet'
  | 'mobile'
  | 'settings'
  | 'palette'
  | 'star'
  | 'fire'
  | 'help'
  | 'filter'

export type ProjectType = 'App' | 'Website' | 'Game' | 'Bug Fix' | 'Roadmap'

export interface Project {
  id: string
  title: string
  type: ProjectType
  mode: Mode
  prompt: string
  updated: string
  updatedAt: number
  color: string
  icon: Mode
  websiteConfig?: WebsiteDetails
  gameType?: 'space' | 'reflex' | 'memory' | 'math'
  appData?: any
  starred?: boolean
}

export interface WebsiteDetails {
  businessName: string
  owner: string
  tagline: string
  heroHeadline?: string
  ctaText?: string
  contactEmail?: string
  about: string
  blurb: string
  color: string
  secondaryColor: string
  font: string
  logo: string
  founderPhoto: string
  features: { icon: string; title: string; desc: string }[]
  pricing: { tier: string; price: string; period: string; features: string[]; popular?: boolean }[]
  testimonials: { quote: string; author: string; role: string; avatar: string }[]
}

export interface GeneratedResult {
  mode: Mode
  label: string
  title: string
  summary: string
  items: string[]
  action: string
  timestamp: number
}

export interface ToastMessage {
  id: string
  title: string
  description?: string
  type?: 'success' | 'info' | 'warning'
}

export interface Template {
  id: string
  title: string
  category: ProjectType
  mode: Mode
  description: string
  color: string
  badge: string
  prompt: string
  popular?: boolean
  features: string[]
}

export interface UserProfile {
  id: string
  name: string
  email: string
  avatar: string
  initials: string
  isGuest: boolean
  plan?: 'Free' | 'Pro'
  savedProjectsCount?: number
}

