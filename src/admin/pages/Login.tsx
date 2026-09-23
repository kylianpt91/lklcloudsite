import { useState, useEffect } from 'react'
import type { FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Eye, EyeOff, LogIn, Lock, AtSign } from 'lucide-react'
import { signIn } from '@/admin/lib/auth'
import { Noise } from '@/admin/components/reactbits'
import '../admin.css'

export default function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')

  useEffect(() => { document.title = 'LKLCloud Management — Connexion' }, [])
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await signIn(email, password)
      navigate('/apps/management', { replace: true })
    } catch {
      setError('Email ou mot de passe incorrect')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="admin-root min-h-screen flex items-center justify-center bg-[#0A0A0A] px-4" data-admin-theme="dark">
      {/* Background effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <Noise opacity={0.03} />
        {/* Animated gradient orbs */}
        <motion.div
          animate={{ x: [0, 30, -20, 0], y: [0, -20, 30, 0], scale: [1, 1.1, 0.95, 1] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-1/4 left-1/3 w-[500px] h-[500px] bg-[#FF6A30]/[0.06] rounded-full blur-[150px]"
        />
        <motion.div
          animate={{ x: [0, -25, 15, 0], y: [0, 25, -15, 0], scale: [1, 0.9, 1.1, 1] }}
          transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-[#3b82f6]/[0.03] rounded-full blur-[130px]"
        />
        <motion.div
          animate={{ x: [0, 15, -10, 0], y: [0, -10, 20, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-1/2 right-1/3 w-[300px] h-[300px] bg-[#06b6d4]/[0.02] rounded-full blur-[100px]"
        />
      </div>

      {/* Decorative orbital ring */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] pointer-events-none opacity-[0.04]" aria-hidden="true">
        <svg viewBox="0 0 700 700" className="w-full h-full">
          <circle cx="350" cy="350" r="300" fill="none" stroke="#FF6A30" strokeWidth="0.5" strokeDasharray="20 40" strokeLinecap="round"
            className="animate-[spin_50s_linear_infinite]" style={{ transformOrigin: 'center' }} />
          <circle cx="350" cy="350" r="340" fill="none" stroke="#FF8F5E" strokeWidth="0.3" strokeDasharray="10 60" strokeLinecap="round"
            className="animate-[spin_70s_linear_infinite_reverse]" style={{ transformOrigin: 'center' }} />
        </svg>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-[420px]"
      >
        {/* Logo — large + glow */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="flex justify-center mb-10"
        >
          <div className="relative">
            {/* Glow behind logo */}
            <div className="absolute inset-0 w-24 h-24 -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 bg-[#FF6A30]/20 rounded-full blur-[40px]" />
            <img src="/images/logos/logo_w_cloud.png" alt="LKL Cloud" className="h-20 w-auto relative" />
          </div>
        </motion.div>

        {/* Login card — Liquid Glass */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="rounded-3xl p-8 sm:p-10"
          style={{
            background: 'rgba(255, 255, 255, 0.04)',
            backdropFilter: 'blur(40px)',
            WebkitBackdropFilter: 'blur(40px)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            boxShadow: '0 32px 80px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.06)',
          }}
        >
          {/* Lock icon + title */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.06] border border-white/[0.08] mb-4"
            >
              <Lock size={12} className="text-[#FF6A30]" />
              <span className="text-[11px] font-semibold text-white/50 uppercase tracking-wider">Accès restreint</span>
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
              className="text-2xl font-bold text-white tracking-tight"
            >
              Administration
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.45 }}
              className="text-sm text-white/35 mt-2"
            >
              Authentifiez-vous pour accéder au panneau d'administration
            </motion.p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <motion.div initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
              <label htmlFor="email" className="block text-xs font-semibold text-white/50 mb-2 uppercase tracking-wider">
                Adresse email
              </label>
              <div className="relative">
                <AtSign size={16} strokeWidth={2.5} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 pointer-events-none" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  className="w-full pl-11 pr-4 py-3.5 rounded-2xl text-sm text-white transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#FF6A30]/40"
                  style={{
                    background: 'rgba(255, 255, 255, 0.04)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                  }}
                  onFocus={e => { e.target.style.borderColor = 'rgba(255, 106, 48, 0.4)'; e.target.style.background = 'rgba(255, 255, 255, 0.06)' }}
                  onBlur={e => { e.target.style.borderColor = 'rgba(255, 255, 255, 0.08)'; e.target.style.background = 'rgba(255, 255, 255, 0.04)' }}
                />
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.45 }}>
              <label htmlFor="password" className="block text-xs font-semibold text-white/50 mb-2 uppercase tracking-wider">
                Mot de passe
              </label>
              <div className="relative">
                <Lock size={16} strokeWidth={2.5} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 pointer-events-none" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  className="w-full pl-11 pr-12 py-3.5 rounded-2xl text-sm text-white transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#FF6A30]/40"
                  style={{
                    background: 'rgba(255, 255, 255, 0.04)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                  }}
                  onFocus={e => { e.target.style.borderColor = 'rgba(255, 106, 48, 0.4)'; e.target.style.background = 'rgba(255, 255, 255, 0.06)' }}
                  onBlur={e => { e.target.style.borderColor = 'rgba(255, 255, 255, 0.08)'; e.target.style.background = 'rgba(255, 255, 255, 0.04)' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-white/25 hover:text-white/50 transition-colors rounded-lg"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </motion.div>

            {error && (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm text-[#ef4444] bg-[#ef4444]/10 border border-[#ef4444]/20 rounded-2xl px-4 py-3"
              >
                {error}
              </motion.p>
            )}

            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-2xl text-sm font-bold text-white bg-gradient-to-r from-[#FF6A30] to-[#E85A20] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg shadow-[#FF6A30]/25 hover:shadow-[#FF6A30]/40 hover:from-[#FF8F5E] hover:to-[#FF6A30]"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Connexion...
                  </>
                ) : (
                  <>
                    <LogIn size={16} />
                    Se connecter
                  </>
                )}
              </motion.button>
            </motion.div>
          </form>
        </motion.div>

        {/* Copyright */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="text-center text-[11px] text-white/15 mt-8 leading-relaxed"
        >
          Copyright &copy; 2026 LKLCloud. Tous droits r&eacute;serv&eacute;s.
          <br />
          Acc&egrave;s restreint.
        </motion.p>
      </motion.div>
    </div>
  )
}
