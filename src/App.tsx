import { lazy, Suspense } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import Layout from '@/components/layout/Layout'
import { ErrorBoundary } from '@/components/ui/ErrorBoundary'
import Skeleton from '@/components/ui/Skeleton'
import { AdminProvider } from '@/admin/lib/context'
import { AdminThemeProvider } from '@/admin/lib/theme'
import AuthGuard from '@/admin/components/AuthGuard'

const Home = lazy(() => import('@/pages/Home'))
const ProductCategory = lazy(() => import('@/pages/products/ProductCategory'))

const MentionsLegales = lazy(() => import('@/pages/legal/MentionsLegales'))
const CGV = lazy(() => import('@/pages/legal/CGV'))
const CGU = lazy(() => import('@/pages/legal/CGU'))
const PolitiqueConfidentialite = lazy(() => import('@/pages/legal/PolitiqueConfidentialite'))
const ComingSoon = lazy(() => import('@/pages/ComingSoon'))
const NotFound = lazy(() => import('@/pages/NotFound'))

const AdminLogin = lazy(() => import('@/admin/pages/Login'))
const AdminLayout = lazy(() => import('@/admin/layouts/AdminLayout'))
const AdminDashboard = lazy(() => import('@/admin/pages/Dashboard'))
const AdminGammes = lazy(() => import('@/admin/pages/Gammes'))
const AdminNavigation = lazy(() => import('@/admin/pages/Navigation'))
const AdminOffres = lazy(() => import('@/admin/pages/Offres'))
const AdminFAQ = lazy(() => import('@/admin/pages/FAQGammes'))
const AdminParametres = lazy(() => import('@/admin/pages/Parametres'))
const AdminAnnonces = lazy(() => import('@/admin/pages/Annonces'))
const AdminEquipe = lazy(() => import('@/admin/pages/Equipe'))
const AdminHeroConfig = lazy(() => import('@/admin/pages/HeroConfig'))
const AdminMaintenance = lazy(() => import('@/admin/pages/Maintenance'))
const AdminHistorique = lazy(() => import('@/admin/pages/Historique'))
const AdminAdministration = lazy(() => import('@/admin/pages/Administration'))
const AdminProfil = lazy(() => import('@/admin/pages/Profil'))
const AdminPlanning = lazy(() => import('@/admin/pages/Planning'))
const AdminSEO = lazy(() => import('@/admin/pages/SEO'))
const AdminUserProfile = lazy(() => import('@/admin/pages/UserProfile'))

function Loading() {
  return (
    <div className="min-h-screen pt-32 px-4 max-w-4xl mx-auto">
      <Skeleton width="60%" height="2rem" rounded="lg" className="mb-4" />
      <Skeleton width="100%" height="1rem" rounded="md" className="mb-2" />
      <Skeleton width="90%" height="1rem" rounded="md" className="mb-2" />
      <Skeleton width="75%" height="1rem" rounded="md" className="mb-8" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Skeleton width="100%" height="12rem" rounded="2xl" />
        <Skeleton width="100%" height="12rem" rounded="2xl" />
        <Skeleton width="100%" height="12rem" rounded="2xl" />
      </div>
    </div>
  )
}

export default function App() {
  const location = useLocation()

  return (
    <ErrorBoundary>
      <AnimatePresence mode="wait">
        <Suspense fallback={<Loading />} key={location.pathname}>
          <Routes location={location}>
            {/* Admin routes */}
            <Route path="apps/management/auth" element={<AdminLogin />} />
            <Route path="apps/management" element={<AuthGuard><AdminThemeProvider><AdminProvider><AdminLayout /></AdminProvider></AdminThemeProvider></AuthGuard>}>
              <Route index element={<AdminDashboard />} />
              <Route path="gammes" element={<AdminGammes />} />
              <Route path="navigation" element={<AdminNavigation />} />
              <Route path="offres" element={<AdminOffres />} />
              <Route path="faq" element={<AdminFAQ />} />
              <Route path="parametres" element={<AdminParametres />} />
              <Route path="annonces" element={<AdminAnnonces />} />
              <Route path="equipe" element={<AdminEquipe />} />
              <Route path="hero" element={<AdminHeroConfig />} />
              <Route path="maintenance" element={<AdminMaintenance />} />
              <Route path="historique" element={<AdminHistorique />} />
              <Route path="administration" element={<AdminAdministration />} />
              <Route path="profil" element={<AdminProfil />} />
              <Route path="planning" element={<AdminPlanning />} />
              <Route path="seo" element={<AdminSEO />} />
              <Route path="utilisateur/:id" element={<AdminUserProfile />} />
            </Route>

            {/* Public routes */}
            <Route element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="produits/:category" element={<ProductCategory />} />
              <Route path="mentions-legales" element={<MentionsLegales />} />
              <Route path="cgv" element={<CGV />} />
              <Route path="cgu" element={<CGU />} />
              <Route path="politique-confidentialite" element={<PolitiqueConfidentialite />} />
              <Route path="coming-soon" element={<ComingSoon />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </Suspense>
      </AnimatePresence>
    </ErrorBoundary>
  )
}
