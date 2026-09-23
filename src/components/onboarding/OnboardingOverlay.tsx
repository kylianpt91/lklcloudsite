import { useState, useEffect, useCallback, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Globe,
  Code,
  Bot,
  Server,
  X,
  Check,
  ArrowRight,
  Send,
} from 'lucide-react'
import { useBridgeProducts } from '@/hooks/useBridge'
import type { ProductCategory, PricingPlan } from '@/types'

// ────────────────────────────────────────────────────────────────────────────
// Types
// ────────────────────────────────────────────────────────────────────────────

type ProjectType = 'website' | 'webapp' | 'discord-bot' | 'api'
type TechnicalLevel = 'beginner' | 'intermediate' | 'expert'
type BudgetRange = 'budget-xs' | 'budget-sm' | 'budget-md' | 'budget-lg'

interface Answers {
  projectType: ProjectType | null
  detail: string | null
  technicalLevel: TechnicalLevel | null
  budget: BudgetRange | null
}

interface Recommendation {
  category: ProductCategory
  plan: PricingPlan
  slug: string
}

interface ChatMsg {
  id: string
  sender: 'nyx' | 'user'
  type: 'text' | 'options' | 'recommendation'
  text?: string
  options?: { id: string; label: string; icon?: React.ComponentType<{ className?: string }> }[]
  recommendation?: Recommendation & { reasons: string[] }
  optionKey?: string
}

// ────────────────────────────────────────────────────────────────────────────
// Constants
// ────────────────────────────────────────────────────────────────────────────

const STORAGE_KEY = 'lkl_onboarding_completed_v2' // Changed key to force re-display

const projectOptions = [
  { id: 'website' as ProjectType, label: 'Site web / Blog', icon: Globe },
  { id: 'webapp' as ProjectType, label: 'Application web', icon: Code },
  { id: 'discord-bot' as ProjectType, label: 'Bot Discord', icon: Bot },
  { id: 'api' as ProjectType, label: 'API / Backend', icon: Server },
]

const detailOptions: Record<ProjectType, { id: string; label: string }[]> = {
  website: [
    { id: 'less-1k', label: '< 1 000' },
    { id: '1k-10k', label: '1 000 - 10 000' },
    { id: '10k-100k', label: '10 000 - 100 000' },
    { id: 'more-100k', label: '> 100 000' },
  ],
  webapp: [
    { id: 'nodejs', label: 'Node.js' },
    { id: 'python', label: 'Python' },
    { id: 'php', label: 'PHP / Laravel' },
    { id: 'other-tech', label: 'Autre' },
  ],
  'discord-bot': [
    { id: 'bot-nodejs', label: 'Node.js (discord.js)' },
    { id: 'bot-python', label: 'Python (discord.py)' },
  ],
  api: [
    { id: 'light', label: 'Légère' },
    { id: 'medium', label: 'Moyenne' },
    { id: 'intensive', label: 'Intensive' },
    { id: 'very-intensive', label: 'Très intensive' },
  ],
}

const detailQuestions: Record<ProjectType, string> = {
  website: 'Combien de visiteurs par mois attendez-vous ?',
  webapp: 'Quelle technologie utilisez-vous ?',
  'discord-bot': 'Dans quel langage est écrit votre bot ?',
  api: 'Quelle charge attendue ?',
}

const technicalOptions: { id: TechnicalLevel; label: string }[] = [
  { id: 'beginner', label: "Débutant — J'ai besoin d'assistance" },
  { id: 'intermediate', label: 'Intermédiaire — Je gère les bases' },
  { id: 'expert', label: 'Expert — Accès root / SSH' },
]

const budgetOptions: { id: BudgetRange; label: string }[] = [
  { id: 'budget-xs', label: 'Moins de 5€/mois' },
  { id: 'budget-sm', label: '5€ - 15€/mois' },
  { id: 'budget-md', label: '15€ - 30€/mois' },
  { id: 'budget-lg', label: 'Plus de 30€/mois' },
]

// ────────────────────────────────────────────────────────────────────────────
// Recommendation engine
// ────────────────────────────────────────────────────────────────────────────

function computeRecommendation(answers: Answers, products: ProductCategory[]): (Recommendation & { reasons: string[] }) | null {
  const { projectType, detail, technicalLevel, budget } = answers

  let slug = 'plesk'
  let planIndex = 1
  const reasons: string[] = []

  if (projectType === 'website') {
    slug = 'plesk'
    if (budget === 'budget-xs') planIndex = 0
    else if (budget === 'budget-sm') planIndex = 1
    else if (budget === 'budget-md') planIndex = 2
    else planIndex = 3
    reasons.push("Optimisé pour l'hébergement de sites web")
  } else if (projectType === 'webapp') {
    if (detail === 'nodejs') {
      slug = 'nodejs'
      reasons.push('Environnement Node.js préconfiguré')
    } else if (detail === 'python') {
      slug = 'python'
      reasons.push("Environnement Python prêt à l'emploi")
    } else if (detail === 'php') {
      slug = 'plesk'
      if (budget === 'budget-xs') planIndex = 0
      else if (budget === 'budget-sm') planIndex = 1
      else if (budget === 'budget-md') planIndex = 2
      else planIndex = 3
      reasons.push('Stack PHP / Laravel optimisée')
    } else {
      slug = 'vps-linux'
      reasons.push('Liberté totale avec VPS Linux')
    }
    if (detail === 'nodejs' || detail === 'python') {
      if (budget === 'budget-xs') planIndex = 0
      else if (budget === 'budget-sm') planIndex = 1
      else planIndex = 2
    }
  } else if (projectType === 'discord-bot') {
    if (detail === 'bot-python') { slug = 'python'; reasons.push('Hébergement discord.py 24/7') }
    else { slug = 'nodejs'; reasons.push('Hébergement discord.js 24/7') }
    if (budget === 'budget-xs') planIndex = 0
    else if (budget === 'budget-sm') planIndex = 1
    else planIndex = 2
  } else if (projectType === 'api') {
    slug = 'vps-linux'
    if (budget === 'budget-xs') planIndex = 0
    else if (budget === 'budget-sm') planIndex = 1
    else if (budget === 'budget-md') planIndex = 2
    else planIndex = 3
    reasons.push('VPS Linux avec accès root complet')
  }

  if (technicalLevel === 'expert' && planIndex < 2) {
    planIndex = Math.min(planIndex + 1, 3)
    reasons.push('Accès root et contrôle total inclus')
  } else if (technicalLevel === 'beginner') {
    reasons.push('Support et assistance inclus')
  } else if (technicalLevel === 'intermediate') {
    reasons.push('Panel de gestion intuitif inclus')
  }

  if (budget === 'budget-xs') reasons.push('Dans votre budget (< 5€/mois)')
  else if (budget === 'budget-sm') reasons.push('Dans votre budget (5-15€/mois)')
  else if (budget === 'budget-md') reasons.push('Dans votre budget (15-30€/mois)')
  else if (budget === 'budget-lg') reasons.push('Ressources premium pour vos besoins')

  const category = products.find(p => p.slug === slug)
  if (!category) return null

  const clampedIndex = Math.min(planIndex, category.plans.length - 1)
  const plan = category.plans[clampedIndex]

  return { category, plan, slug, reasons }
}

// ────────────────────────────────────────────────────────────────────────────
// Chat UI components
// ────────────────────────────────────────────────────────────────────────────

function NyxBubble({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      className="flex gap-3 items-end max-w-[85%] sm:max-w-[70%]"
      initial={{ opacity: 0, y: 12, x: -8 }}
      animate={{ opacity: 1, y: 0, x: 0 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="shrink-0 w-9 h-9 rounded-xl bg-neutral-dark flex items-center justify-center">
        <span className="text-white font-bold text-[11px] tracking-tight">Nyx</span>
      </div>
      <div className="bg-paper border border-line rounded-2xl rounded-bl-md px-5 py-3">
        {children}
      </div>
    </motion.div>
  )
}

function UserBubble({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      className="flex justify-end"
      initial={{ opacity: 0, y: 12, x: 8 }}
      animate={{ opacity: 1, y: 0, x: 0 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="max-w-[80%] sm:max-w-[65%] bg-neutral-dark text-white rounded-2xl rounded-br-md px-4 py-3">
        {children}
      </div>
    </motion.div>
  )
}

function TypingDots() {
  return (
    <motion.div
      className="flex gap-3 items-end"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -4 }}
      transition={{ duration: 0.2 }}
    >
      <div className="shrink-0 w-9 h-9 rounded-xl bg-neutral-dark flex items-center justify-center">
        <span className="text-white font-bold text-[11px] tracking-tight">Nyx</span>
      </div>
      <div className="bg-paper border border-line rounded-2xl rounded-bl-md px-5 py-3">
        <div className="flex items-center gap-1">
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              className="w-2 h-2 rounded-full bg-neutral-500"
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 0.5, delay: i * 0.15, repeat: Infinity, repeatDelay: 0.4 }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  )
}

// ────────────────────────────────────────────────────────────────────────────
// Main component — full-page chat UI
// ────────────────────────────────────────────────────────────────────────────

export default function OnboardingOverlay() {
  const products = useBridgeProducts()
  const [visible, setVisible] = useState(false)
  const [closing, setClosing] = useState(false)
  const [typing, setTyping] = useState(false)
  const [messages, setMessages] = useState<ChatMsg[]>([])
  const [phase, setPhase] = useState<'welcome' | 'project' | 'detail' | 'technical' | 'budget' | 'done'>('welcome')
  const [answers, setAnswers] = useState<Answers>({
    projectType: null,
    detail: null,
    technicalLevel: null,
    budget: null,
  })
  const [optionsVisible, setOptionsVisible] = useState(false)

  const scrollRef = useRef<HTMLDivElement>(null)
  const overlayRef = useRef<HTMLDivElement>(null)

  // ── Helpers (defined first to avoid initialization errors) ──
  const addNyxMsg = useCallback((text: string): Promise<void> => {
    setTyping(true)
    return new Promise((resolve) => {
      setTimeout(() => {
        setTyping(false)
        setMessages((prev) => [...prev, { id: `nyx-${Date.now()}-${Math.random()}`, sender: 'nyx', type: 'text', text }])
        resolve()
      }, 600 + Math.random() * 400)
    })
  }, [])

  const addUserMsg = useCallback((text: string) => {
    setMessages((prev) => [...prev, { id: `user-${Date.now()}`, sender: 'user', type: 'text', text }])
  }, [])

  const showOpts = useCallback((options: ChatMsg['options'], key: string) => {
    setOptionsVisible(true)
    setMessages((prev) => [...prev, { id: `opts-${Date.now()}`, sender: 'nyx', type: 'options', options, optionKey: key }])
  }, [])

  // ── Dismiss ──
  const handleDismiss = useCallback(() => {
    setClosing(true)
    localStorage.setItem(STORAGE_KEY, 'true')
    setTimeout(() => { setVisible(false); setClosing(false) }, 350)
  }, [])

  // ── Conversation flow ──
  const startConversation = useCallback(async () => {
    await addNyxMsg('Bonjour ! Je suis Nyx, votre assistant LKL Cloud.')
    await addNyxMsg("Je vais vous aider à trouver l'offre parfaite en quelques questions rapides. C'est parti ?")
    showOpts([
      { id: 'yes', label: 'Oui, aidez-moi !' },
      { id: 'no', label: 'Plus tard' },
    ], 'welcome')
  }, [addNyxMsg, showOpts])

  // ── Scroll chat to bottom ──
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
    }
  }, [messages, typing, optionsVisible])

  // ── Mount: wait for cookie consent THEN loader dismiss, then delay 1.75s ──
  useEffect(() => {
    const hasCompleted = localStorage.getItem(STORAGE_KEY)
    if (hasCompleted) return

    const SHOW_DELAY = 1750

    const showAfterDelay = () => {
      // Wait for loader dismissed, then show
      let eventTimer: ReturnType<typeof setTimeout> | null = null
      let fallbackTimer: ReturnType<typeof setTimeout> | null = null

      const loaderHandler = () => {
        if (fallbackTimer) clearTimeout(fallbackTimer)
        eventTimer = setTimeout(() => setVisible(true), SHOW_DELAY)
      }

      window.addEventListener('lkl-loader-dismissed', loaderHandler)

      // Fallback: show after 4s max regardless of loader
      fallbackTimer = setTimeout(() => {
        if (eventTimer) clearTimeout(eventTimer)
        setVisible(true)
      }, 4000)

      return () => {
        window.removeEventListener('lkl-loader-dismissed', loaderHandler)
        if (eventTimer) clearTimeout(eventTimer)
        if (fallbackTimer) clearTimeout(fallbackTimer)
      }
    }

    // Check if cookies already consented
    const cookieConsent = localStorage.getItem('lkl_cookie_consent')
    if (cookieConsent) {
      // Cookies already resolved — proceed with normal loader-based flow
      const cleanup = showAfterDelay()
      return cleanup
    }

    // Cookies NOT yet resolved — wait for cookie consent first
    let cleanupInner: (() => void) | undefined
    const cookieHandler = () => {
      // After cookie consent, wait a moment then show onboarding
      setTimeout(() => {
        setVisible(true)
      }, SHOW_DELAY)
    }

    window.addEventListener('lkl-cookies-resolved', cookieHandler)
    return () => {
      window.removeEventListener('lkl-cookies-resolved', cookieHandler)
      if (cleanupInner) cleanupInner()
    }
  }, [])

  // ── Start conversation when visible ──
  useEffect(() => {

    if (!visible) return
    if (messages.length > 0) return

    // Small delay to ensure modal is mounted
    const timer = setTimeout(() => {

      startConversation()
    }, 100)

    return () => clearTimeout(timer)
  }, [visible, messages.length, startConversation])

  // ── Lock body scroll — fixed overlay, no page scrolling ──
  useEffect(() => {
    if (visible && !closing) {
      const scrollY = window.scrollY
      document.body.style.overflow = 'hidden'
      document.body.style.position = 'fixed'
      document.body.style.top = `-${scrollY}px`
      document.body.style.width = '100%'
    } else if (closing || !visible) {
      const scrollY = document.body.style.top
      document.body.style.overflow = ''
      document.body.style.position = ''
      document.body.style.top = ''
      document.body.style.width = ''
      window.scrollTo(0, parseInt(scrollY || '0') * -1)
    }
    return () => {
      const scrollY = document.body.style.top
      document.body.style.overflow = ''
      document.body.style.position = ''
      document.body.style.top = ''
      document.body.style.width = ''
      if (scrollY) window.scrollTo(0, parseInt(scrollY) * -1)
    }
  }, [visible, closing])

  // ── Escape key ──
  useEffect(() => {
    if (!visible || closing) return
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') handleDismiss() }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [visible, closing])

  const handleOptionSelect = useCallback(async (optionKey: string, optionId: string, optionLabel: string) => {
    setOptionsVisible(false)
    // Remove option message
    setMessages((prev) => prev.filter((m) => m.type !== 'options'))
    addUserMsg(optionLabel)

    if (optionKey === 'welcome') {
      if (optionId === 'no') { handleDismiss(); return }
      setPhase('project')
      await addNyxMsg('Quel type de projet souhaitez-vous héberger ?')
      showOpts(projectOptions.map((o) => ({ id: o.id, label: o.label, icon: o.icon })), 'project')
    } else if (optionKey === 'project') {
      const type = optionId as ProjectType
      setAnswers((prev) => ({ ...prev, projectType: type, detail: null }))
      setPhase('detail')
      await addNyxMsg(detailQuestions[type])
      showOpts(detailOptions[type].map((o) => ({ id: o.id, label: o.label })), 'detail')
    } else if (optionKey === 'detail') {
      setAnswers((prev) => ({ ...prev, detail: optionId }))
      setPhase('technical')
      await addNyxMsg('Quel est votre niveau technique ?')
      showOpts(technicalOptions.map((o) => ({ id: o.id, label: o.label })), 'technical')
    } else if (optionKey === 'technical') {
      setAnswers((prev) => ({ ...prev, technicalLevel: optionId as TechnicalLevel }))
      setPhase('budget')
      await addNyxMsg('Dernière question : quel est votre budget mensuel ?')
      showOpts(budgetOptions.map((o) => ({ id: o.id, label: o.label })), 'budget')
    } else if (optionKey === 'budget') {
      const budget = optionId as BudgetRange
      const updated = { ...answers, budget }
      setAnswers(updated)
      setPhase('done')
      await addNyxMsg("Parfait, j'analyse vos besoins...")

      const rec = computeRecommendation(updated, products)
      if (rec) {
        setTyping(true)
        setTimeout(() => {
          setTyping(false)
          setMessages((prev) => [...prev, { id: `rec-${Date.now()}`, sender: 'nyx', type: 'recommendation', recommendation: rec }])
        }, 1200)
      }
    }
  }, [answers, products, addNyxMsg, addUserMsg, showOpts, handleDismiss])


  if (!visible) {

    return null
  }



  return (
    <AnimatePresence>
      {!closing && (
        <>
          {/* Backdrop blur overlay */}
          <motion.div
            className="fixed inset-0 z-[99998] bg-black/30 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={handleDismiss}
            style={{ pointerEvents: 'auto' }}
          />

          {/* Modal container */}
          <motion.div
            ref={overlayRef}
            key="onboarding-chat"
            className="fixed inset-0 z-[99999] flex items-center justify-center p-4 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            role="dialog"
            aria-modal="true"
            aria-label="Assistant Nyx — LKL Cloud"
            style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}
          >
            {/* Liquid Glass Modal */}
            <motion.div
              className="relative w-full max-w-2xl max-h-[85vh] flex flex-col bg-paper border border-line rounded-3xl shadow-2xl shadow-black/20 overflow-hidden pointer-events-auto"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
              style={{ backgroundColor: 'rgba(255, 255, 255, 0.9)' }}
            >
              {/* Header bar */}
              <div className="relative z-10 flex items-center justify-between px-6 py-4 border-b border-line bg-paper">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-neutral-dark flex items-center justify-center">
                    <span className="text-white font-bold text-sm tracking-tight">Nyx</span>
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-neutral-dark">Nyx</h2>
                    <div className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                      <span className="text-xs text-neutral-medium">Assistant LKL Cloud</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={handleDismiss}
                  className="w-9 h-9 rounded-lg flex items-center justify-center text-neutral-dark/50 hover:text-neutral-dark hover:bg-neutral-dark/[0.05] transition-colors duration-200"
                  aria-label="Fermer l'assistant"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Chat messages */}
              <div ref={scrollRef} className="relative z-10 flex-1 overflow-y-auto px-6 py-6 bg-paper-deep">
                <div className="space-y-4">
              {messages.map((msg) => {
                if (msg.type === 'text' && msg.sender === 'nyx') {
                  return (
                    <NyxBubble key={msg.id}>
                      <p className="text-sm text-neutral-dark leading-relaxed">{msg.text}</p>
                    </NyxBubble>
                  )
                }
                if (msg.type === 'text' && msg.sender === 'user') {
                  return (
                    <UserBubble key={msg.id}>
                      <p className="text-sm leading-relaxed">{msg.text}</p>
                    </UserBubble>
                  )
                }
                if (msg.type === 'options' && optionsVisible) {
                  return (
                    <motion.div
                      key={msg.id}
                      className="flex flex-wrap gap-2 pl-12 max-w-[85%] sm:max-w-[70%]"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.1 }}
                    >
                      {msg.options?.map((opt, i) => {
                        const Icon = opt.icon
                        return (
                          <motion.button
                            key={opt.id}
                            onClick={() => handleOptionSelect(msg.optionKey!, opt.id, opt.label)}
                            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-line bg-paper text-sm font-medium text-neutral-dark hover:border-neutral-dark/40 active:scale-[0.97] transition-colors duration-200 cursor-pointer"
                            initial={{ opacity: 0, y: 6 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.06, duration: 0.3 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            {Icon && <Icon className="w-4 h-4" />}
                            {opt.label}
                          </motion.button>
                        )
                      })}
                    </motion.div>
                  )
                }
                if (msg.type === 'recommendation' && msg.recommendation) {
                  const { category, plan, slug, reasons } = msg.recommendation
                  return (
                    <div key={msg.id} className="space-y-3">
                      <NyxBubble>
                        <p className="text-sm text-neutral-dark leading-relaxed">
                          D'après vos besoins, je vous recommande l'offre{' '}
                          <span className="font-bold text-primary">{plan.name}</span> !
                        </p>
                      </NyxBubble>
                      <motion.div
                        className="ml-12 max-w-[85%] sm:max-w-[70%] rounded-2xl border border-line bg-paper p-5"
                        initial={{ opacity: 0, scale: 0.96 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3, duration: 0.4 }}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="text-[10px] font-medium text-neutral-medium uppercase tracking-wider">{category.name}</p>
                            <h3 className="text-lg font-bold text-neutral-dark">{plan.name}</h3>
                          </div>
                          <div className="text-right shrink-0">
                            <span className="text-2xl font-extrabold text-primary">{plan.price.toLocaleString('fr-FR')}&euro;</span>
                            <span className="text-xs text-neutral-medium">/{plan.period}</span>
                          </div>
                        </div>
                        <div className="mt-3 flex flex-wrap gap-1.5">
                          <span className="text-xs px-2.5 py-1 rounded-lg bg-neutral-dark/[0.05] text-neutral-dark font-medium">{plan.specs.ram} RAM</span>
                          <span className="text-xs px-2.5 py-1 rounded-lg bg-neutral-dark/[0.05] text-neutral-dark font-medium">{plan.specs.cpu}</span>
                          <span className="text-xs px-2.5 py-1 rounded-lg bg-neutral-dark/[0.05] text-neutral-dark font-medium">{plan.specs.storage}</span>
                        </div>
                        <ul className="mt-3 space-y-1.5">
                          {reasons.slice(0, 3).map((r) => (
                            <li key={r} className="flex items-center gap-2 text-xs text-neutral-dark/80">
                              <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                              {r}
                            </li>
                          ))}
                        </ul>
                        <div className="mt-4 flex flex-col sm:flex-row gap-2">
                          <Link
                            to={`/produits/${slug}`}
                            onClick={handleDismiss}
                            className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-neutral-dark text-white text-sm font-semibold hover:bg-primary active:scale-[0.97] transition-colors duration-300"
                          >
                            Voir cette offre
                            <ArrowRight className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={handleDismiss}
                            className="px-5 py-2.5 rounded-xl border border-neutral-200/60 text-sm font-medium text-neutral-medium hover:text-neutral-dark transition-all duration-200"
                          >
                            Fermer
                          </button>
                        </div>
                      </motion.div>
                    </div>
                  )
                }
                return null
              })}

                  <AnimatePresence>
                    {typing && <TypingDots key="typing" />}
                  </AnimatePresence>
                </div>
              </div>

              {/* Bottom bar */}
              <div className="relative z-10 border-t border-line bg-paper px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="flex-1 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-neutral-dark/[0.04] text-sm text-neutral-dark/50">
                    <Send className="w-4 h-4 shrink-0 text-neutral-400" />
                    {optionsVisible
                      ? 'Choisissez une option ci-dessus...'
                      : typing
                        ? "Nyx est en train d'écrire..."
                        : phase === 'done'
                          ? 'Conversation terminée'
                          : 'Patientez...'}
                  </div>
                  {phase !== 'done' && (
                    <button onClick={handleDismiss} className="text-xs text-neutral-medium hover:text-neutral-dark transition-colors underline underline-offset-2 font-medium">
                      Passer
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
