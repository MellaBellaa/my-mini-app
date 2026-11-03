import React, { useEffect, useRef, useState } from 'react'
import { Icon } from './Icon'

interface GameStudioProps {
  prompt: string
  standalone?: boolean
  onBack?: () => void
}

export interface LeaderboardEntry {
  id: string
  name: string
  icon: string
  score: number
  game: 'space' | 'reflex' | 'memory'
  date: string
  timestamp: number
}

export interface PlayerProfile {
  name: string
  icon: string
}

const playerAvatars = [
  { id: 'rocket', icon: '🚀', label: 'Rocket Ace' },
  { id: 'zap', icon: '⚡', label: 'Volt Falcon' },
  { id: 'alien', icon: '👾', label: 'Cyber Alien' },
  { id: 'fox', icon: '🦊', label: 'Swift Fox' },
  { id: 'bot', icon: '🤖', label: 'Mecha Droid' },
  { id: 'crown', icon: '👑', label: 'Pixel King' },
  { id: 'cat', icon: '🐱', label: 'Space Cat' },
  { id: 'unicorn', icon: '🦄', label: 'Mystic Comet' },
  { id: 'fire', icon: '🔥', label: 'Flame Raider' },
]

const defaultLeaderboard: LeaderboardEntry[] = [
  { id: 'lb-1', name: 'NovaStrike', icon: '🚀', score: 980, game: 'space', date: 'Today', timestamp: Date.now() - 3600000 },
  { id: 'lb-2', name: 'CyberViper', icon: '⚡', score: 840, game: 'space', date: 'Yesterday', timestamp: Date.now() - 86400000 },
  { id: 'lb-3', name: 'PixelQueen', icon: '👑', score: 720, game: 'space', date: '2 days ago', timestamp: Date.now() - 172800000 },
  { id: 'lb-4', name: 'StarGazer', icon: '🦄', score: 650, game: 'space', date: '3 days ago', timestamp: Date.now() - 259200000 },
  { id: 'lb-5', name: 'CosmicFox', icon: '🦊', score: 490, game: 'space', date: '4 days ago', timestamp: Date.now() - 345600000 },
  { id: 'lb-6', name: 'ReflexMaster', icon: '⚡', score: 32, game: 'reflex', date: 'Today', timestamp: Date.now() - 1800000 },
  { id: 'lb-7', name: 'MemoryWiz', icon: '👾', score: 14, game: 'memory', date: 'Yesterday', timestamp: Date.now() - 90000000 },
]

// Pure Browser Web Audio API Synthesizer (Zero Dependencies)
class RetroAudioEngine {
  private ctx: AudioContext | null = null
  public soundOn: boolean = true

  private init() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext
      if (AudioCtx) this.ctx = new AudioCtx()
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume()
    }
  }

  playPickup() {
    if (!this.soundOn) return
    this.init()
    if (!this.ctx) return
    const now = this.ctx.currentTime
    const osc = this.ctx.createOscillator()
    const gain = this.ctx.createGain()
    osc.type = 'triangle'
    osc.frequency.setValueAtTime(587.33, now) // D5
    osc.frequency.setValueAtTime(880, now + 0.06) // A5
    osc.frequency.setValueAtTime(1174.66, now + 0.12) // D6
    gain.gain.setValueAtTime(0.18, now)
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25)
    osc.connect(gain)
    gain.connect(this.ctx.destination)
    osc.start(now)
    osc.stop(now + 0.25)
  }

  playCrash() {
    if (!this.soundOn) return
    this.init()
    if (!this.ctx) return
    const now = this.ctx.currentTime
    const osc = this.ctx.createOscillator()
    const gain = this.ctx.createGain()
    osc.type = 'sawtooth'
    osc.frequency.setValueAtTime(190, now)
    osc.frequency.exponentialRampToValueAtTime(45, now + 0.25)
    gain.gain.setValueAtTime(0.25, now)
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25)
    osc.connect(gain)
    gain.connect(this.ctx.destination)
    osc.start(now)
    osc.stop(now + 0.25)
  }

  playGameOver() {
    if (!this.soundOn) return
    this.init()
    if (!this.ctx) return
    const now = this.ctx.currentTime
    const osc = this.ctx.createOscillator()
    const gain = this.ctx.createGain()
    osc.type = 'sawtooth'
    osc.frequency.setValueAtTime(392, now) // G4
    osc.frequency.setValueAtTime(311.13, now + 0.14) // Eb4
    osc.frequency.setValueAtTime(261.63, now + 0.28) // C4
    osc.frequency.setValueAtTime(196, now + 0.42) // G3
    gain.gain.setValueAtTime(0.22, now)
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.65)
    osc.connect(gain)
    gain.connect(this.ctx.destination)
    osc.start(now)
    osc.stop(now + 0.65)
  }

  playStart() {
    if (!this.soundOn) return
    this.init()
    if (!this.ctx) return
    const now = this.ctx.currentTime
    const osc = this.ctx.createOscillator()
    const gain = this.ctx.createGain()
    osc.type = 'sine'
    osc.frequency.setValueAtTime(261.63, now) // C4
    osc.frequency.exponentialRampToValueAtTime(783.99, now + 0.2) // G5
    gain.gain.setValueAtTime(0.18, now)
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25)
    osc.connect(gain)
    gain.connect(this.ctx.destination)
    osc.start(now)
    osc.stop(now + 0.25)
  }

  playClick() {
    if (!this.soundOn) return
    this.init()
    if (!this.ctx) return
    const now = this.ctx.currentTime
    const osc = this.ctx.createOscillator()
    const gain = this.ctx.createGain()
    osc.type = 'sine'
    osc.frequency.setValueAtTime(850, now)
    gain.gain.setValueAtTime(0.12, now)
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.06)
    osc.connect(gain)
    gain.connect(this.ctx.destination)
    osc.start(now)
    osc.stop(now + 0.06)
  }
}

const audio = new RetroAudioEngine()

export const GameStudio: React.FC<GameStudioProps> = ({ prompt, standalone = false, onBack }) => {
  const p = prompt.toLowerCase()
  const defaultMode = p.includes('memory') || p.includes('card')
    ? 'memory'
    : p.includes('reflex') || p.includes('click') || p.includes('tap')
    ? 'reflex'
    : 'space'

  const [activeGame, setActiveGame] = useState<'space' | 'reflex' | 'memory'>(defaultMode)

  // Player Profile State
  const [player, setPlayer] = useState<PlayerProfile>(() => {
    try {
      const stored = localStorage.getItem('buildly_game_player')
      if (stored) return JSON.parse(stored)
    } catch {
      // fallback
    }
    return { name: 'Alex J.', icon: '🚀' }
  })
  const [editingPlayer, setEditingPlayer] = useState(false)

  // Sound State
  const [soundEnabled, setSoundEnabled] = useState(true)
  useEffect(() => {
    audio.soundOn = soundEnabled
  }, [soundEnabled])

  // Leaderboard State
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>(() => {
    try {
      const stored = localStorage.getItem('buildly_game_leaderboard')
      if (stored) return JSON.parse(stored)
    } catch {
      // fallback
    }
    return defaultLeaderboard
  })
  const [showLeaderboard, setShowLeaderboard] = useState(false)
  const [leaderboardFilter, setLeaderboardFilter] = useState<'all' | 'space' | 'reflex' | 'memory'>('all')

  // Save Player and Leaderboard
  useEffect(() => {
    try {
      localStorage.setItem('buildly_game_player', JSON.stringify(player))
    } catch {}
  }, [player])

  useEffect(() => {
    try {
      localStorage.setItem('buildly_game_leaderboard', JSON.stringify(leaderboard))
    } catch {}
  }, [leaderboard])

  // Record Score Card State
  const [showScoreCard, setShowScoreCard] = useState(false)
  const [lastGameStats, setLastGameStats] = useState<{
    score: number
    game: 'space' | 'reflex' | 'memory'
    title: string
    pickups: number
    durationSec: number
    isHighScore: boolean
  } | null>(null)

  // 1. SPACE RUNNER STATE
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [spacePlaying, setSpacePlaying] = useState(false)
  const [spaceScore, setSpaceScore] = useState(0)
  const [spaceLives, setSpaceLives] = useState(3)
  const [spaceStarsGathered, setSpaceStarsGathered] = useState(0)
  const [spaceStartTime, setSpaceStartTime] = useState(0)
  const [spaceHighScore, setSpaceHighScore] = useState(() => {
    try {
      return parseInt(localStorage.getItem('buildly_game_highscore') || '0', 10)
    } catch {
      return 0
    }
  })

  // Submit Score to Leaderboard
  const submitToLeaderboard = (score: number, game: 'space' | 'reflex' | 'memory') => {
    const entry: LeaderboardEntry = {
      id: `lb-${Date.now()}`,
      name: player.name || 'Anonymous',
      icon: player.icon || '🚀',
      score,
      game,
      date: 'Just now',
      timestamp: Date.now(),
    }
    setLeaderboard((prev) => [entry, ...prev].sort((a, b) => b.score - a.score))
  }

  // Keyboard shortcut to Replay ('R' or Space)
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (showScoreCard && (e.key.toLowerCase() === 'r' || e.key === ' ')) {
        e.preventDefault()
        handleReplay()
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [showScoreCard, activeGame])

  // Space Runner Game Loop
  useEffect(() => {
    if (activeGame !== 'space' || !spacePlaying) return

    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationFrameId: number
    const keys: Record<string, boolean> = {}

    const handleKeyDown = (e: KeyboardEvent) => {
      keys[e.key] = true
    }
    const handleKeyUp = (e: KeyboardEvent) => {
      keys[e.key] = false
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)

    // Player spaceship object
    const ship = {
      x: canvas.width / 2,
      y: canvas.height - 60,
      width: 32,
      height: 38,
      speed: 6.0,
    }

    // Stars background
    const bgStars: { x: number; y: number; speed: number; size: number }[] = []
    for (let i = 0; i < 50; i++) {
      bgStars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        speed: 1.2 + Math.random() * 3.5,
        size: 1 + Math.random() * 2.2,
      })
    }

    interface Obstacle {
      x: number
      y: number
      radius: number
      speed: number
      color: string
    }
    interface StarPickup {
      x: number
      y: number
      radius: number
      speed: number
    }

    let obstacles: Obstacle[] = []
    let pickups: StarPickup[] = []
    let currentScore = 0
    let currentLives = 3
    let gathered = 0
    let spawnCounter = 0

    const loop = () => {
      spawnCounter++

      // Move player
      if ((keys['ArrowLeft'] || keys['a'] || keys['A']) && ship.x > ship.width / 2) {
        ship.x -= ship.speed
      }
      if ((keys['ArrowRight'] || keys['d'] || keys['D']) && ship.x < canvas.width - ship.width / 2) {
        ship.x += ship.speed
      }
      if ((keys['ArrowUp'] || keys['w'] || keys['W']) && ship.y > 50) {
        ship.y -= ship.speed
      }
      if ((keys['ArrowDown'] || keys['s'] || keys['S']) && ship.y < canvas.height - ship.height) {
        ship.y += ship.speed
      }

      // Spawn obstacles
      if (spawnCounter % 38 === 0) {
        obstacles.push({
          x: 24 + Math.random() * (canvas.width - 48),
          y: -24,
          radius: 12 + Math.random() * 16,
          speed: 2.8 + Math.random() * 3.8,
          color: Math.random() > 0.5 ? '#f43f5e' : '#fb923c',
        })
      }

      // Spawn pickups
      if (spawnCounter % 80 === 0) {
        pickups.push({
          x: 24 + Math.random() * (canvas.width - 48),
          y: -20,
          radius: 11,
          speed: 2.2 + Math.random() * 2.2,
        })
      }

      // Clear Canvas
      ctx.fillStyle = '#0a0815'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Draw background stars
      ctx.fillStyle = '#ffffff'
      bgStars.forEach((s) => {
        s.y += s.speed
        if (s.y > canvas.height) s.y = 0
        ctx.fillRect(s.x, s.y, s.size, s.size)
      })

      // Update & Draw Obstacles
      for (let i = obstacles.length - 1; i >= 0; i--) {
        const obs = obstacles[i]
        obs.y += obs.speed

        ctx.beginPath()
        ctx.arc(obs.x, obs.y, obs.radius, 0, Math.PI * 2)
        ctx.fillStyle = obs.color
        ctx.shadowBlur = 14
        ctx.shadowColor = obs.color
        ctx.fill()
        ctx.shadowBlur = 0

        // Collision Check with ship
        const dx = obs.x - ship.x
        const dy = obs.y - ship.y
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist < obs.radius + ship.width / 2) {
          obstacles.splice(i, 1)
          currentLives--
          setSpaceLives(currentLives)
          audio.playCrash()

          if (currentLives <= 0) {
            audio.playGameOver()
            setSpacePlaying(false)

            const isNewHi = currentScore > spaceHighScore
            if (isNewHi) {
              setSpaceHighScore(currentScore)
              try {
                localStorage.setItem('buildly_game_highscore', currentScore.toString())
              } catch {}
            }

            const durationSec = Math.round((Date.now() - spaceStartTime) / 1000)
            setLastGameStats({
              score: currentScore,
              game: 'space',
              title: 'Nebula Space Dodger',
              pickups: gathered,
              durationSec,
              isHighScore: isNewHi,
            })
            submitToLeaderboard(currentScore, 'space')
            setShowScoreCard(true)
            return
          }
        } else if (obs.y > canvas.height + 30) {
          obstacles.splice(i, 1)
          currentScore += 10
          setSpaceScore(currentScore)
        }
      }

      // Update & Draw Pickups
      for (let i = pickups.length - 1; i >= 0; i--) {
        const item = pickups[i]
        item.y += item.speed

        ctx.beginPath()
        ctx.arc(item.x, item.y, item.radius, 0, Math.PI * 2)
        ctx.fillStyle = '#facc15'
        ctx.shadowBlur = 18
        ctx.shadowColor = '#facc15'
        ctx.fill()
        ctx.shadowBlur = 0

        const dx = item.x - ship.x
        const dy = item.y - ship.y
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist < item.radius + ship.width / 2) {
          pickups.splice(i, 1)
          currentScore += 50
          gathered++
          setSpaceScore(currentScore)
          setSpaceStarsGathered(gathered)
          audio.playPickup()
        } else if (item.y > canvas.height + 30) {
          pickups.splice(i, 1)
        }
      }

      // Draw Player Spaceship & Avatar Icon
      ctx.save()
      ctx.translate(ship.x, ship.y)

      // Thruster flame
      ctx.beginPath()
      ctx.moveTo(-6, 16)
      ctx.lineTo(6, 16)
      ctx.lineTo(0, 24 + Math.random() * 9)
      ctx.fillStyle = '#38bdf8'
      ctx.shadowBlur = 16
      ctx.shadowColor = '#38bdf8'
      ctx.fill()
      ctx.shadowBlur = 0

      // Ship fuselage
      ctx.beginPath()
      ctx.moveTo(0, -18)
      ctx.lineTo(16, 14)
      ctx.lineTo(0, 8)
      ctx.lineTo(-16, 14)
      ctx.closePath()
      ctx.fillStyle = '#8b5cf6'
      ctx.fill()
      ctx.strokeStyle = '#c4b5fd'
      ctx.lineWidth = 1.5
      ctx.stroke()

      // Cockpit / Avatar Emoji
      ctx.font = '14px sans-serif'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(player.icon, 0, -1)

      ctx.restore()

      animationFrameId = requestAnimationFrame(loop)
    }

    animationFrameId = requestAnimationFrame(loop)

    return () => {
      cancelAnimationFrame(animationFrameId)
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [activeGame, spacePlaying, spaceStartTime, player, spaceHighScore])

  const startSpaceGame = () => {
    audio.playStart()
    setSpaceScore(0)
    setSpaceLives(3)
    setSpaceStarsGathered(0)
    setSpaceStartTime(Date.now())
    setShowScoreCard(false)
    setSpacePlaying(true)
  }

  // 2. REFLEX BLITZ STATE
  const [reflexScore, setReflexScore] = useState(0)
  const [reflexTime, setReflexTime] = useState(20)
  const [reflexPlaying, setReflexPlaying] = useState(false)
  const [reflexTarget, setReflexTarget] = useState({ x: 50, y: 50, size: 64 })

  useEffect(() => {
    if (!reflexPlaying) return
    const timer = setInterval(() => {
      setReflexTime((t) => {
        if (t <= 1) {
          audio.playGameOver()
          setReflexPlaying(false)
          setLastGameStats({
            score: reflexScore,
            game: 'reflex',
            title: 'Reflex Speed Blitz',
            pickups: reflexScore,
            durationSec: 20,
            isHighScore: reflexScore > 25,
          })
          submitToLeaderboard(reflexScore, 'reflex')
          setShowScoreCard(true)
          return 0
        }
        return t - 1
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [reflexPlaying, reflexScore])

  const hitReflexTarget = () => {
    audio.playPickup()
    setReflexScore((s) => s + 1)
    setReflexTarget({
      x: 14 + Math.random() * 72,
      y: 14 + Math.random() * 72,
      size: Math.max(42, 68 - Math.min(26, reflexScore * 1.5)),
    })
  }

  const startReflex = () => {
    audio.playStart()
    setReflexScore(0)
    setReflexTime(20)
    setShowScoreCard(false)
    setReflexPlaying(true)
    hitReflexTarget()
  }

  // 3. EMOJI MEMORY MATCH STATE
  const emojis = ['🚀', '⚡', '💎', '🎮', '🪐', '🦄', '🔥', '👑']
  const [memoryCards, setMemoryCards] = useState<
    { id: number; emoji: string; flipped: boolean; matched: boolean }[]
  >([])
  const [selectedCards, setSelectedCards] = useState<number[]>([])
  const [memoryMoves, setMemoryMoves] = useState(0)

  const initMemoryGame = () => {
    const deck = [...emojis, ...emojis]
      .sort(() => Math.random() - 0.5)
      .map((emoji, idx) => ({
        id: idx,
        emoji,
        flipped: false,
        matched: false,
      }))
    setMemoryCards(deck)
    setSelectedCards([])
    setMemoryMoves(0)
    setShowScoreCard(false)
  }

  useEffect(() => {
    if (activeGame === 'memory') {
      initMemoryGame()
    }
  }, [activeGame])

  const handleCardClick = (id: number) => {
    audio.playClick()
    if (selectedCards.length === 2) return
    const clicked = memoryCards.find((c) => c.id === id)
    if (!clicked || clicked.flipped || clicked.matched) return

    const updated = memoryCards.map((c) => (c.id === id ? { ...c, flipped: true } : c))
    setMemoryCards(updated)
    const newSelected = [...selectedCards, id]
    setSelectedCards(newSelected)

    if (newSelected.length === 2) {
      setMemoryMoves((m) => m + 1)
      const first = updated.find((c) => c.id === newSelected[0])
      const second = updated.find((c) => c.id === newSelected[1])

      if (first && second && first.emoji === second.emoji) {
        audio.playPickup()
        setTimeout(() => {
          setMemoryCards((prev) =>
            prev.map((c) =>
              c.id === first.id || c.id === second.id ? { ...c, matched: true } : c
            )
          )
          setSelectedCards([])
        }, 400)
      } else {
        setTimeout(() => {
          setMemoryCards((prev) =>
            prev.map((c) =>
              c.id === newSelected[0] || c.id === newSelected[1] ? { ...c, flipped: false } : c
            )
          )
          setSelectedCards([])
        }, 750)
      }
    }
  }

  // Check memory victory
  useEffect(() => {
    if (memoryCards.length > 0 && memoryCards.every((c) => c.matched)) {
      audio.playPickup()
      const finalScore = Math.max(10, 100 - memoryMoves * 4)
      setLastGameStats({
        score: finalScore,
        game: 'memory',
        title: 'Emoji Memory Match',
        pickups: 8,
        durationSec: memoryMoves,
        isHighScore: memoryMoves <= 12,
      })
      submitToLeaderboard(finalScore, 'memory')
      setShowScoreCard(true)
    }
  }, [memoryCards])

  // Instant Replay Action
  const handleReplay = () => {
    setShowScoreCard(false)
    if (activeGame === 'space') {
      startSpaceGame()
    } else if (activeGame === 'reflex') {
      startReflex()
    } else {
      initMemoryGame()
    }
  }

  // Filtered leaderboard list
  const filteredLeaderboard = leaderboard.filter((entry) => {
    if (leaderboardFilter === 'all') return true
    return entry.game === leaderboardFilter
  })

  return (
    <div className={`min-h-full w-full bg-[#0d0b18] text-white ${standalone ? 'min-h-screen py-8 px-4 sm:px-6' : 'p-4 sm:p-7'}`}>
      {/* Top Header if Standalone */}
      {standalone && (
        <header className="max-w-4xl mx-auto mb-6 flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-br from-amber-500 to-rose-600 text-white shadow-lg">
              <Icon name="game" className="h-5 w-5" />
            </span>
            <div>
              <h1 className="font-display text-xl font-bold tracking-tight">Buildly Arcade Studio</h1>
              <p className="text-xs text-neutral-400">Playable Engine with Custom Player, Audio & Leaderboard</p>
            </div>
          </div>
          {onBack && (
            <button
              onClick={onBack}
              className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-bold text-white hover:bg-white/20 transition"
            >
              ← Back to Studio
            </button>
          )}
        </header>
      )}

      <div className="max-w-4xl mx-auto space-y-5">
        {/* Top Control Bar: Game Switcher, Player Profile, Sound Toggle, Leaderboard Trigger */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-white/5 p-2 sm:p-2.5 rounded-3xl border border-white/10 backdrop-blur-md">
          {/* Game Selection Pills */}
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => {
                audio.playClick()
                setActiveGame('space')
                setShowScoreCard(false)
              }}
              className={`rounded-2xl px-3.5 py-2 text-xs font-bold transition flex items-center gap-1.5 ${
                activeGame === 'space'
                  ? 'bg-violet-600 text-white shadow-lg shadow-violet-600/30'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <span>🚀 Nebula Runner</span>
            </button>
            <button
              type="button"
              onClick={() => {
                audio.playClick()
                setActiveGame('reflex')
                setShowScoreCard(false)
              }}
              className={`rounded-2xl px-3.5 py-2 text-xs font-bold transition flex items-center gap-1.5 ${
                activeGame === 'reflex'
                  ? 'bg-violet-600 text-white shadow-lg shadow-violet-600/30'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <span>⚡ Reflex Blitz</span>
            </button>
            <button
              type="button"
              onClick={() => {
                audio.playClick()
                setActiveGame('memory')
                setShowScoreCard(false)
              }}
              className={`rounded-2xl px-3.5 py-2 text-xs font-bold transition flex items-center gap-1.5 ${
                activeGame === 'memory'
                  ? 'bg-violet-600 text-white shadow-lg shadow-violet-600/30'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <span>🎴 Emoji Match</span>
            </button>
          </div>

          {/* Player Customization, Sound & Leaderboard Actions */}
          <div className="flex items-center gap-2">
            {/* Player Profile Badge */}
            <button
              type="button"
              onClick={() => setEditingPlayer(true)}
              className="flex items-center gap-2 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/15 px-3 py-1.5 text-xs font-bold text-white transition shadow-sm"
              title="Click to customize Player Name and Avatar"
            >
              <span className="text-base">{player.icon}</span>
              <span className="truncate max-w-[100px]">{player.name}</span>
              <span className="text-[10px] text-violet-300">✎</span>
            </button>

            {/* Sound Mute/Unmute Toggle */}
            <button
              type="button"
              onClick={() => {
                setSoundEnabled((v) => !v)
                audio.playClick()
              }}
              className={`grid h-8 w-8 place-items-center rounded-xl border transition ${
                soundEnabled
                  ? 'border-violet-500/50 bg-violet-600/20 text-violet-300'
                  : 'border-white/10 bg-white/5 text-neutral-500'
              }`}
              title={soundEnabled ? 'Sound Effects Enabled (Click to mute)' : 'Sound Effects Muted (Click to enable)'}
            >
              <span className="text-xs">{soundEnabled ? '🔊' : '🔇'}</span>
            </button>

            {/* Leaderboard Button */}
            <button
              type="button"
              onClick={() => {
                audio.playClick()
                setShowLeaderboard((v) => !v)
              }}
              className={`flex items-center gap-1.5 rounded-2xl px-3 py-1.5 text-xs font-bold transition border ${
                showLeaderboard
                  ? 'bg-amber-500 text-neutral-950 border-amber-400 font-extrabold shadow-md'
                  : 'bg-white/10 hover:bg-white/15 text-neutral-200 border-white/15'
              }`}
            >
              <span>🏆 Leaderboard</span>
            </button>
          </div>
        </div>

        {/* Player Customization Drawer */}
        {editingPlayer && (
          <div className="rounded-3xl border border-violet-500/40 bg-gradient-to-br from-violet-950/70 to-neutral-900/90 p-5 backdrop-blur-md shadow-2xl animate-fade-in space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <span className="text-xl">{player.icon}</span>
                <span className="font-display font-bold text-sm text-white">Customize Player Profile</span>
              </div>
              <button
                type="button"
                onClick={() => setEditingPlayer(false)}
                className="text-neutral-400 hover:text-white text-sm"
              >
                ✕ Close
              </button>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-neutral-300 mb-1.5">Player Name</label>
                <input
                  type="text"
                  value={player.name}
                  onChange={(e) => setPlayer({ ...player, name: e.target.value })}
                  maxLength={16}
                  placeholder="Enter your gamer tag..."
                  className="w-full rounded-2xl border border-white/20 bg-neutral-950/80 px-4 py-2.5 text-xs text-white font-bold outline-none focus:border-violet-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-300 mb-1.5">Choose Avatar Icon</label>
                <div className="flex flex-wrap gap-1.5">
                  {playerAvatars.map((av) => (
                    <button
                      type="button"
                      key={av.id}
                      onClick={() => {
                        audio.playClick()
                        setPlayer({ ...player, icon: av.icon })
                      }}
                      className={`h-9 w-9 rounded-xl text-lg flex items-center justify-center transition ${
                        player.icon === av.icon
                          ? 'bg-violet-600 border-2 border-white scale-110 shadow-lg'
                          : 'bg-white/10 hover:bg-white/20 border border-white/10'
                      }`}
                      title={av.label}
                    >
                      {av.icon}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => {
                  audio.playClick()
                  setEditingPlayer(false)
                }}
                className="rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold px-4 py-2 text-xs shadow"
              >
                Save Profile ✓
              </button>
            </div>
          </div>
        )}

        {/* Leaderboard Panel */}
        {showLeaderboard && (
          <div className="rounded-3xl border border-amber-500/30 bg-neutral-950/90 p-5 backdrop-blur-md shadow-2xl animate-fade-in space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <span className="text-xl">🏆</span>
                <div>
                  <h3 className="font-display font-bold text-sm text-white">Global Leaderboard</h3>
                  <p className="text-[11px] text-neutral-400">Rankings across all Buildly arcade games</p>
                </div>
              </div>

              {/* Filter tabs */}
              <div className="flex items-center gap-1 bg-white/10 p-1 rounded-xl text-[10px] font-bold">
                {(['all', 'space', 'reflex', 'memory'] as const).map((filter) => (
                  <button
                    key={filter}
                    type="button"
                    onClick={() => {
                      audio.playClick()
                      setLeaderboardFilter(filter)
                    }}
                    className={`px-2.5 py-1 rounded-lg uppercase transition ${
                      leaderboardFilter === filter ? 'bg-amber-500 text-neutral-950 font-black' : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>

            {/* Scores List */}
            <div className="space-y-1.5 max-h-64 overflow-y-auto pr-1">
              {filteredLeaderboard.map((item, idx) => {
                const rankBadge = idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : `#${idx + 1}`
                const isMe = item.name === player.name
                return (
                  <div
                    key={item.id}
                    className={`flex items-center justify-between p-2.5 rounded-2xl border transition ${
                      isMe
                        ? 'bg-violet-900/40 border-violet-500/70 shadow'
                        : 'bg-white/5 border-white/10 hover:bg-white/10'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-6 text-center font-bold text-xs">{rankBadge}</span>
                      <span className="text-lg">{item.icon}</span>
                      <div>
                        <p className="text-xs font-bold text-white flex items-center gap-1.5">
                          <span>{item.name}</span>
                          {isMe && (
                            <span className="rounded bg-violet-500/40 px-1.5 py-0.2 text-[9px] font-extrabold text-violet-200 uppercase">
                              You
                            </span>
                          )}
                        </p>
                        <p className="text-[10px] text-neutral-400">
                          {item.game === 'space' ? '🚀 Space Dodger' : item.game === 'reflex' ? '⚡ Reflex Blitz' : '🎴 Memory Match'} • {item.date}
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="font-mono-code font-black text-sm text-amber-400">{item.score}</span>
                      <span className="text-[10px] text-neutral-400 ml-1">pts</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* GAME 1: SPACE DODGER */}
        {activeGame === 'space' && (
          <div className="space-y-4">
            {/* Live Stats HUD */}
            <div className="flex flex-wrap items-center justify-between gap-3 px-2">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 rounded-xl bg-white/5 px-3 py-1.5 border border-white/10">
                  <span className="text-sm">{player.icon}</span>
                  <span className="text-xs font-bold text-neutral-200">{player.name}</span>
                </div>
                <div className="text-sm font-bold">
                  Score: <span className="text-violet-400 font-mono-code text-lg">{spaceScore}</span>
                </div>
                <div className="text-xs text-neutral-400 hidden sm:inline">
                  Stars: <span className="text-amber-400 font-mono-code font-bold">★ {spaceStarsGathered}</span>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex gap-1 text-sm">
                  {[...Array(3)].map((_, i) => (
                    <span key={i} className={i < spaceLives ? 'text-rose-500 scale-110' : 'text-neutral-700'}>
                      ❤️
                    </span>
                  ))}
                </div>
                <span className="text-xs text-neutral-400 hidden sm:inline">
                  Best: <span className="text-amber-400 font-mono-code">{spaceHighScore}</span>
                </span>
              </div>
            </div>

            {/* Canvas Container */}
            <div className="relative aspect-[16/10] max-h-[500px] w-full rounded-3xl overflow-hidden border border-white/15 bg-black shadow-2xl">
              <canvas
                ref={canvasRef}
                width={700}
                height={440}
                className="w-full h-full object-contain"
              />

              {/* Start Screen Overlay */}
              {!spacePlaying && !showScoreCard && (
                <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center">
                  <span className="text-4xl mb-2">{player.icon}</span>
                  <h3 className="text-3xl font-black font-display tracking-tight text-white mb-2">
                    Nebula Space Dodger
                  </h3>
                  <p className="text-xs text-neutral-300 max-w-sm mb-6 leading-relaxed">
                    Pilot <strong className="text-violet-400">{player.name}</strong> through incoming meteors. Gather gold stars to boost your score.
                  </p>
                  <button
                    type="button"
                    onClick={startSpaceGame}
                    className="rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold px-8 py-3.5 shadow-xl shadow-violet-600/40 hover:scale-105 transition flex items-center gap-2"
                  >
                    <span>Launch Mission 🚀</span>
                  </button>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between text-xs text-neutral-500 px-1">
              <span>Controls: Arrow Keys or [W][A][S][D] to steer</span>
              <span>Replay shortcut: Press [R]</span>
            </div>
          </div>
        )}

        {/* GAME 2: REFLEX BLITZ */}
        {activeGame === 'reflex' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between px-2">
              <div className="flex items-center gap-3">
                <span className="text-base">{player.icon}</span>
                <span className="text-xs font-bold text-neutral-300">{player.name}</span>
                <span className="text-sm font-bold ml-2">
                  Hits: <span className="text-amber-400 font-mono-code text-lg">{reflexScore}</span>
                </span>
              </div>
              <span className="text-sm font-bold">
                Time: <span className="text-rose-400 font-mono-code text-lg">{reflexTime}s</span>
              </span>
            </div>

            <div className="relative aspect-[16/10] max-h-[500px] w-full rounded-3xl overflow-hidden border border-white/15 bg-gradient-to-br from-[#1c1432] to-[#0c0919] shadow-2xl">
              {!reflexPlaying && !showScoreCard ? (
                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center">
                  <span className="text-4xl mb-2">{player.icon}</span>
                  <h3 className="text-3xl font-black font-display tracking-tight text-white mb-2">
                    Reflex Speed Blitz
                  </h3>
                  <p className="text-xs text-neutral-300 max-w-sm mb-6 leading-relaxed">
                    Test your reaction speed! Click the glowing neon targets before the 20-second timer expires.
                  </p>
                  <button
                    type="button"
                    onClick={startReflex}
                    className="rounded-2xl bg-gradient-to-r from-amber-500 to-rose-600 hover:from-amber-400 hover:to-rose-500 text-white font-bold px-8 py-3.5 shadow-xl shadow-rose-600/30 hover:scale-105 transition"
                  >
                    <span>Start Countdown ⚡</span>
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={hitReflexTarget}
                  style={{
                    left: `${reflexTarget.x}%`,
                    top: `${reflexTarget.y}%`,
                    width: `${reflexTarget.size}px`,
                    height: `${reflexTarget.size}px`,
                  }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-tr from-amber-400 via-rose-500 to-violet-500 shadow-[0_0_35px_rgba(244,63,94,0.7)] flex items-center justify-center text-white font-black text-xl hover:scale-110 active:scale-95 transition-transform cursor-pointer"
                >
                  ★
                </button>
              )}
            </div>
          </div>
        )}

        {/* GAME 3: EMOJI MEMORY MATCH */}
        {activeGame === 'memory' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between px-2">
              <div className="flex items-center gap-3">
                <span className="text-base">{player.icon}</span>
                <span className="text-xs font-bold text-neutral-300">{player.name}</span>
                <span className="text-sm font-bold ml-2">
                  Moves: <span className="text-violet-400 font-mono-code text-lg">{memoryMoves}</span>
                </span>
              </div>
              <button
                type="button"
                onClick={initMemoryGame}
                className="text-xs text-neutral-400 hover:text-white transition underline"
              >
                Reset Grid
              </button>
            </div>

            <div className="relative p-6 rounded-3xl border border-white/15 bg-white/5 backdrop-blur-md">
              <div className="grid grid-cols-4 gap-3 max-w-md mx-auto">
                {memoryCards.map((card) => (
                  <button
                    type="button"
                    key={card.id}
                    onClick={() => handleCardClick(card.id)}
                    disabled={card.matched}
                    className={`aspect-square rounded-2xl text-2xl sm:text-3xl flex items-center justify-center font-bold border transition-all duration-300 select-none ${
                      card.flipped || card.matched
                        ? 'bg-violet-900/70 border-violet-500 shadow-md scale-95'
                        : 'bg-white/10 border-white/20 hover:bg-white/15 hover:border-violet-400'
                    }`}
                  >
                    {card.flipped || card.matched ? card.emoji : '❓'}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* OFFICIAL SCORE CARD MODAL */}
        {showScoreCard && lastGameStats && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md animate-fade-in">
            <div className="w-full max-w-md rounded-3xl border border-white/20 bg-gradient-to-br from-[#1c162e] to-[#0f0c1a] p-6 sm:p-8 text-white shadow-2xl relative overflow-hidden space-y-6">
              {/* Header Badge */}
              <div className="text-center space-y-2">
                <div className="inline-flex items-center gap-2 rounded-full bg-violet-500/20 px-3.5 py-1 text-xs font-bold text-violet-300 border border-violet-500/30">
                  <span>{player.icon}</span>
                  <span>{player.name} • Score Card</span>
                </div>

                <h3 className="font-display text-2xl sm:text-3xl font-black text-white">
                  {lastGameStats.title}
                </h3>

                {lastGameStats.isHighScore && (
                  <span className="inline-block rounded-full bg-amber-400/20 text-amber-300 px-3 py-0.5 text-xs font-extrabold border border-amber-400/40 animate-pulse">
                    🏆 NEW PERSONAL BEST!
                  </span>
                )}
              </div>

              {/* Big Score Display */}
              <div className="rounded-2xl border border-white/10 bg-white/5 p-5 text-center space-y-1">
                <p className="text-xs font-bold uppercase tracking-wider text-neutral-400">Final Score</p>
                <p className="font-mono-code text-5xl font-black text-amber-400 tracking-tight">
                  {lastGameStats.score}
                </p>
                <p className="text-[11px] text-neutral-400 font-semibold">
                  Rank Tier: {lastGameStats.score > 600 ? '🌟 Grandmaster' : lastGameStats.score > 300 ? '🚀 Veteran Pilot' : '⚡ Swift Challenger'}
                </p>
              </div>

              {/* Performance Metrics Grid */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="rounded-xl bg-white/5 p-3 border border-white/10">
                  <span className="text-neutral-400 block text-[10px] uppercase font-bold">Pickups / Hits</span>
                  <span className="font-bold text-white text-base mt-0.5 block">
                    ★ {lastGameStats.pickups}
                  </span>
                </div>
                <div className="rounded-xl bg-white/5 p-3 border border-white/10">
                  <span className="text-neutral-400 block text-[10px] uppercase font-bold">Time / Moves</span>
                  <span className="font-bold text-white text-base mt-0.5 block">
                    ⏱️ {lastGameStats.durationSec}s
                  </span>
                </div>
              </div>

              {/* Action Buttons: Instant Replay & Leaderboard */}
              <div className="space-y-2 pt-2">
                <button
                  type="button"
                  onClick={handleReplay}
                  className="w-full rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold py-3.5 text-sm shadow-xl shadow-violet-600/40 flex items-center justify-center gap-2 transition hover:scale-102"
                >
                  <span>Play Again (Replay) ↻</span>
                  <kbd className="hidden sm:inline-block rounded bg-white/20 px-1.5 py-0.5 text-[10px] font-mono-code">
                    [R]
                  </kbd>
                </button>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setShowScoreCard(false)
                      setShowLeaderboard(true)
                    }}
                    className="rounded-xl border border-white/15 bg-white/10 hover:bg-white/20 py-2.5 text-xs font-bold text-neutral-200 transition"
                  >
                    View Leaderboard 🏆
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowScoreCard(false)}
                    className="rounded-xl border border-white/15 bg-white/10 hover:bg-white/20 py-2.5 text-xs font-bold text-neutral-200 transition"
                  >
                    Back to Game
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
