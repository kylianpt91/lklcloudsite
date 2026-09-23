import { useState, useMemo, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Plus, Search, Pencil, Trash2, Globe, Sparkles,
  FileText, ShoppingBag, Scale, BookOpen, CheckCircle2, AlertTriangle, XCircle,
} from 'lucide-react'
import { useAdmin } from '../lib/context'
import { PageContainer } from '../components/PageContainer'
import { AdminButton } from '../components/AdminButton'
import { AdminDialog } from '../components/AdminDialog'
import { ConfirmDialog } from '../components/ConfirmDialog'
import { AdminBadge } from '../components/AdminBadge'
import { AdminEmptyState } from '../components/AdminEmptyState'
import { SEOForm } from '../components/seo/SEOForm'
import { runAudit, computeScore } from '../components/seo/SEOAudit'
import type { SEOConfig } from '../lib/types'

const pageTypeIcons: Record<string, typeof Globe> = {
  home: Globe,
  product: ShoppingBag,
  legal: Scale,
  'case-study': BookOpen,
  other: FileText,
}

const pageTypeLabels: Record<string, string> = {
  home: 'Accueil',
  product: 'Produit',
  legal: 'Légal',
  'case-study': 'Étude de cas',
  other: 'Autre',
}

function ScoreBadge({ score }: { score: number }) {
  const variant = score >= 80 ? 'success' as const : score >= 50 ? 'warning' as const : 'danger' as const
  return <AdminBadge variant={variant}>{String(score)}</AdminBadge>
}

const defaultForm: Partial<SEOConfig> = {
  pageSlug: '',
  pageType: 'other',
  title: '',
  description: '',
  keywords: [],
  ogImage: '',
  ogTitle: '',
  ogDescription: '',
  canonicalUrl: '',
  noIndex: false,
  noFollow: false,
  jsonLd: '',
}

export default function SEOPage() {
  const { seoConfigs, gammes, addSEOConfig, updateSEOConfig, deleteSEOConfig, addToast } = useAdmin()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<Partial<SEOConfig>>(defaultForm)
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [filterType, setFilterType] = useState<string>('all')

  // Filter configs
  const filtered = useMemo(() => {
    let list = seoConfigs
    if (filterType !== 'all') list = list.filter(c => c.pageType === filterType)
    if (search) {
      const q = search.toLowerCase()
      list = list.filter(c =>
        c.pageSlug.toLowerCase().includes(q) ||
        c.title.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q)
      )
    }
    return list
  }, [seoConfigs, filterType, search])

  // Compute scores for each config
  const scores = useMemo(() => {
    const map = new Map<string, number>()
    for (const cfg of seoConfigs) {
      const checks = runAudit(cfg, seoConfigs)
      map.set(cfg.id, computeScore(checks))
    }
    return map
  }, [seoConfigs])

  const avgScore = useMemo(() => {
    if (seoConfigs.length === 0) return 0
    const total = seoConfigs.reduce((sum, c) => sum + (scores.get(c.id) ?? 0), 0)
    return Math.round(total / seoConfigs.length)
  }, [seoConfigs, scores])

  const openNew = useCallback(() => {
    setEditingId(null)
    setForm(defaultForm)
    setDialogOpen(true)
  }, [])

  const openEdit = useCallback((cfg: SEOConfig) => {
    setEditingId(cfg.id)
    setForm({
      pageSlug: cfg.pageSlug,
      pageType: cfg.pageType,
      title: cfg.title,
      description: cfg.description,
      keywords: [...cfg.keywords],
      ogImage: cfg.ogImage ?? '',
      ogTitle: cfg.ogTitle ?? '',
      ogDescription: cfg.ogDescription ?? '',
      canonicalUrl: cfg.canonicalUrl ?? '',
      noIndex: cfg.noIndex ?? false,
      noFollow: cfg.noFollow ?? false,
      jsonLd: cfg.jsonLd ?? '',
    })
    setDialogOpen(true)
  }, [])

  const handleSave = useCallback(async () => {
    if (!form.pageSlug || !form.title) {
      addToast('error', 'Le slug et le titre sont requis')
      return
    }

    // Check duplicate slug on create
    if (!editingId && seoConfigs.some(c => c.pageSlug === form.pageSlug)) {
      addToast('error', `Une config SEO existe déjà pour "${form.pageSlug}"`)
      return
    }

    // Compute audit score for storage
    const checks = runAudit(form, seoConfigs)
    const score = computeScore(checks)

    if (editingId) {
      await updateSEOConfig(editingId, {
        ...form,
        lastAuditScore: score,
        lastAuditAt: new Date().toISOString(),
      })
    } else {
      await addSEOConfig({
        pageSlug: form.pageSlug!,
        pageType: form.pageType ?? 'other',
        title: form.title!,
        description: form.description ?? '',
        keywords: form.keywords ?? [],
        ogImage: form.ogImage || undefined,
        ogTitle: form.ogTitle || undefined,
        ogDescription: form.ogDescription || undefined,
        canonicalUrl: form.canonicalUrl || undefined,
        noIndex: form.noIndex,
        noFollow: form.noFollow,
        jsonLd: form.jsonLd || undefined,
        lastAuditScore: score,
        lastAuditAt: new Date().toISOString(),
      })
    }
    setDialogOpen(false)
  }, [form, editingId, seoConfigs, addSEOConfig, updateSEOConfig, addToast])

  const handleDelete = useCallback(async () => {
    if (!confirmDelete) return
    await deleteSEOConfig(confirmDelete)
    setConfirmDelete(null)
  }, [confirmDelete, deleteSEOConfig])

  // Auto-generate SEO configs for known pages
  const handleAutoGenerate = useCallback(async () => {
    const existingSlugs = new Set(seoConfigs.map(c => c.pageSlug))

    const pagesToGenerate: Omit<SEOConfig, 'id' | 'createdAt' | 'updatedAt'>[] = []

    // Home page
    if (!existingSlugs.has('home')) {
      pagesToGenerate.push({
        pageSlug: 'home',
        pageType: 'home',
        title: 'LKLCloud — Hébergeur français haute performance',
        description: "Des solutions d'hébergement web, VPS et serveurs de jeu adaptées à vos besoins. Performance, fiabilité et support expert.",
        keywords: ['hébergement', 'cloud', 'VPS', 'serveur', 'français', 'haute performance'],
        ogImage: 'https://lklcloud.fr/images/og.png',
        canonicalUrl: 'https://lklcloud.fr',
      })
    }

    // Product pages from gammes
    for (const gamme of gammes) {
      const slug = `produits/${gamme.slug}`
      if (!existingSlugs.has(slug)) {
        pagesToGenerate.push({
          pageSlug: slug,
          pageType: 'product',
          title: `${gamme.nom} — LKLCloud`,
          description: gamme.heroDescription || gamme.description,
          keywords: [gamme.nom.toLowerCase(), 'hébergement', gamme.slug, 'LKLCloud'],
          canonicalUrl: `https://lklcloud.fr/produits/${gamme.slug}`,
        })
      }
    }

    // Legal pages
    const legalPages = [
      { slug: 'mentions-legales', title: 'Mentions légales', desc: 'Mentions légales de LKLCloud — informations sur la société et les conditions d\'utilisation.' },
      { slug: 'cgv', title: 'Conditions Générales de Vente', desc: 'CGV de LKLCloud — conditions de vente applicables à nos services d\'hébergement.' },
      { slug: 'cgu', title: 'Conditions Générales d\'Utilisation', desc: 'CGU de LKLCloud — conditions d\'utilisation de nos services et de notre site web.' },
      { slug: 'politique-confidentialite', title: 'Politique de Confidentialité', desc: 'Politique de confidentialité de LKLCloud — traitement et protection de vos données personnelles.' },
    ]
    for (const p of legalPages) {
      if (!existingSlugs.has(p.slug)) {
        pagesToGenerate.push({
          pageSlug: p.slug,
          pageType: 'legal',
          title: `${p.title} — LKLCloud`,
          description: p.desc,
          keywords: [p.slug.replace(/-/g, ' '), 'LKLCloud', 'légal'],
          canonicalUrl: `https://lklcloud.fr/${p.slug}`,
          noIndex: false,
        })
      }
    }

    if (pagesToGenerate.length === 0) {
      addToast('info', 'Toutes les pages connues ont déjà une config SEO')
      return
    }

    for (const page of pagesToGenerate) {
      await addSEOConfig(page)
    }
    addToast('success', `${pagesToGenerate.length} config(s) SEO générée(s)`)
  }, [seoConfigs, gammes, addSEOConfig, addToast])

  return (
    <PageContainer
      title="SEO"
      description="Gestion des meta tags et du référencement par page"
      actions={
        <div className="flex items-center gap-2">
          <AdminButton variant="ghost" size="sm" onClick={handleAutoGenerate}>
            <Sparkles size={16} />
            Auto-générer
          </AdminButton>
          <AdminButton size="sm" onClick={openNew}>
            <Plus size={16} />
            Nouvelle page
          </AdminButton>
        </div>
      }
    >
      {/* Stats bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <div className="rounded-xl border border-[var(--admin-border)] bg-[var(--admin-surface)] p-4">
          <p className="text-xs text-[var(--admin-text-muted)] font-medium">Pages configurées</p>
          <p className="text-2xl font-bold text-[var(--admin-text-primary)] mt-1">{seoConfigs.length}</p>
        </div>
        <div className="rounded-xl border border-[var(--admin-border)] bg-[var(--admin-surface)] p-4">
          <p className="text-xs text-[var(--admin-text-muted)] font-medium">Score moyen</p>
          <p className={`text-2xl font-bold mt-1 ${
            avgScore >= 80 ? 'text-emerald-500' : avgScore >= 50 ? 'text-amber-500' : 'text-red-500'
          }`}>{avgScore}/100</p>
        </div>
        <div className="rounded-xl border border-[var(--admin-border)] bg-[var(--admin-surface)] p-4">
          <p className="text-xs text-[var(--admin-text-muted)] font-medium">Pages excellentes</p>
          <p className="text-2xl font-bold text-emerald-500 mt-1">
            {seoConfigs.filter(c => (scores.get(c.id) ?? 0) >= 80).length}
          </p>
        </div>
        <div className="rounded-xl border border-[var(--admin-border)] bg-[var(--admin-surface)] p-4">
          <p className="text-xs text-[var(--admin-text-muted)] font-medium">À améliorer</p>
          <p className="text-2xl font-bold text-amber-500 mt-1">
            {seoConfigs.filter(c => (scores.get(c.id) ?? 0) < 80).length}
          </p>
        </div>
      </div>

      {/* Filter bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-4">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--admin-text-muted)]" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Rechercher par slug, titre..."
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-[var(--admin-border)] bg-[var(--admin-input-bg)] text-sm text-[var(--admin-text-primary)] placeholder-[var(--admin-text-muted)] outline-none focus:border-[var(--admin-primary)]/50 transition-colors"
          />
        </div>
        <div className="flex items-center gap-1.5 flex-wrap">
          {['all', 'home', 'product', 'legal', 'case-study', 'other'].map(type => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                filterType === type
                  ? 'bg-[var(--admin-primary)] text-white'
                  : 'bg-[var(--admin-surface)] text-[var(--admin-text-muted)] hover:text-[var(--admin-text-secondary)] border border-[var(--admin-border)]'
              }`}
            >
              {type === 'all' ? 'Tout' : pageTypeLabels[type]}
            </button>
          ))}
        </div>
      </div>

      {/* Configs list */}
      {filtered.length === 0 ? (
        <AdminEmptyState
          icon={<Globe size={40} />}
          title="Aucune configuration SEO"
          description="Ajoutez des configs SEO pour vos pages ou utilisez l'auto-génération."
        />
      ) : (
        <div className="space-y-2">
          <AnimatePresence>
            {filtered.map(cfg => {
              const score = scores.get(cfg.id) ?? 0
              const Icon = pageTypeIcons[cfg.pageType] ?? FileText
              return (
                <motion.div
                  key={cfg.id}
                  layout
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="flex items-center gap-4 p-4 rounded-xl border border-[var(--admin-border)] bg-[var(--admin-surface)] hover:border-[var(--admin-border-strong)] transition-all group"
                >
                  {/* Icon */}
                  <div className="w-10 h-10 rounded-xl bg-[var(--admin-primary-surface)] flex items-center justify-center shrink-0">
                    <Icon size={18} className="text-[var(--admin-primary)]" />
                  </div>

                  {/* Info */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-bold text-[var(--admin-text-primary)] truncate">{cfg.title || cfg.pageSlug}</p>
                      <AdminBadge variant="neutral">{pageTypeLabels[cfg.pageType]}</AdminBadge>
                      {cfg.noIndex && <AdminBadge variant="danger">noindex</AdminBadge>}
                    </div>
                    <p className="text-xs text-[var(--admin-text-muted)] truncate mt-0.5">/{cfg.pageSlug}</p>
                  </div>

                  {/* Score */}
                  <div className="hidden sm:flex items-center gap-2 shrink-0">
                    {score >= 80 ? <CheckCircle2 size={14} className="text-emerald-500" /> :
                     score >= 50 ? <AlertTriangle size={14} className="text-amber-500" /> :
                     <XCircle size={14} className="text-red-500" />}
                    <ScoreBadge score={score} />
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => openEdit(cfg)}
                      className="p-2 rounded-lg text-[var(--admin-text-muted)] hover:text-[var(--admin-primary)] hover:bg-[var(--admin-surface-hover)] transition-all"
                      title="Modifier"
                    >
                      <Pencil size={15} />
                    </button>
                    <button
                      onClick={() => setConfirmDelete(cfg.id)}
                      className="p-2 rounded-lg text-[var(--admin-text-muted)] hover:text-[var(--admin-danger)] hover:bg-[var(--admin-danger-surface)] transition-all"
                      title="Supprimer"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>
      )}

      {/* Edit/Create Dialog */}
      <AdminDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        title={editingId ? `Modifier SEO — ${form.pageSlug}` : 'Nouvelle configuration SEO'}
        size="full"
        footer={
          <div className="flex items-center gap-2 justify-end">
            <AdminButton variant="ghost" onClick={() => setDialogOpen(false)}>Annuler</AdminButton>
            <AdminButton onClick={handleSave}>
              {editingId ? 'Enregistrer' : 'Créer'}
            </AdminButton>
          </div>
        }
      >
        <SEOForm
          form={form}
          onChange={updates => setForm(prev => ({ ...prev, ...updates }))}
          allConfigs={seoConfigs}
          isNew={!editingId}
        />
      </AdminDialog>

      {/* Confirm delete */}
      <ConfirmDialog
        open={!!confirmDelete}
        onCancel={() => setConfirmDelete(null)}
        onConfirm={handleDelete}
        title="Supprimer la configuration SEO"
        message={`La configuration SEO pour "${seoConfigs.find(c => c.id === confirmDelete)?.pageSlug}" sera supprimée définitivement.`}
        confirmColor="var(--admin-danger)"
      />
    </PageContainer>
  )
}
