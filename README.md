# LKLCLOUD.FR V2

Site vitrine de **LKLCloud**, un hébergeur cloud français nouvelle génération. Le site met en avant les services d'hébergement web, VPS, serveurs de jeux et d'autres solutions cloud, tout en présentant l'équipe et son approche.

**Site :** [lklcloud.fr](https://lklcloud.fr)
**Espace client :** [client.lklcloud.fr](https://client.lklcloud.fr)

## Stack technique

- **React 19** + **TypeScript** (strict)
- **Vite 7** (build + dev server)
- **Tailwind CSS 4** (theming via `@theme` dans `src/index.css`)
- **Framer Motion 12** (animations + transitions de pages)
- **React Router DOM 7** (routing SPA)
- **Supabase** (Auth, Postgres temps réel, Storage) — voir `.env.example` et `supabase/migrations/`
- **Lenis** (smooth scroll)
- **OGL** (fond WebGL gradient)
- **GSAP** (animations avancées)

## Installation

```bash
# Cloner le projet
git clone https://github.com/LKL-Cloud/website.git
cd website

# Installer les dépendances
npm install --legacy-peer-deps

# (optionnel) configurer Supabase pour l'admin + le contenu éditable
cp .env.example .env   # puis remplir VITE_SUPABASE_URL et VITE_SUPABASE_ANON_KEY

# Lancer le serveur de développement
npm run dev
```

Le site est accessible sur `http://localhost:5173`.

> Sans `.env`, le site public fonctionne avec les données de secours (`src/data/*`).
> L'admin (`/apps/management`) et la synchro temps réel nécessitent Supabase :
> créer un projet, exécuter `supabase/migrations/0001_init.sql` puis `0002_rls.sql`
> dans le SQL Editor, désactiver « Confirm email » (Authentication → Providers → Email).

## Scripts disponibles

| Commande | Description |
|---|---|
| `npm run dev` | Serveur de développement Vite (HMR) |
| `npm run build` | Build de production (`tsc` + `vite build`) |
| `npm run preview` | Prévisualiser le build de production |
| `npm run lint` | Lancer ESLint |

## Structure du projet

```
src/
  components/
    layout/       # Layout, HeaderBubble, Footer, Logo
    sections/     # Sections de la page d'accueil (Hero, Benefits, About, etc.)
    ui/           # Composants réutilisables (90+)
    product/      # Composants spécifiques aux produits
    onboarding/   # Assistant chatbot Nyx
  pages/          # Pages (Home, ProductCategory, NotFound, legal, etc.)
  data/           # Données statiques (produits, navigation, équipe, etc.)
  contexts/       # Contexts React (Preferences, Notifications)
  hooks/          # Hooks personnalisés
  types/          # Types TypeScript
  lib/            # Supabase client + bridge + utilitaires
  admin/
    components/   # Composants admin (AdminButton, AdminDialog, AdminDropdown, etc.)
    layouts/      # AdminLayout (sidebar, header, breadcrumbs)
    pages/        # 13 pages admin (Dashboard, Gammes, Offres, FAQ, etc.)
    lib/          # Context, db (Supabase), Auth, types, thème
    hooks/        # Hooks admin (useAdminShortcuts)
public/
  images/logos/   # Logos technologies (self-hosted)
  sitemap.xml     # Plan du site
  robots.txt      # Règles de crawl
  .htaccess       # Redirections, headers de sécurité, cache
```

## Panneau d'administration

Le site intègre un panneau d'administration complet accessible à `/apps/management/`.

### Fonctionnalités

- **Dashboard** — KPIs, graphiques (revenus, répartition, tendances), activité récente
- **Gammes** — CRUD des catégories de produits avec FAQ associées
- **Offres** — Gestion des plans tarifaires (prix mensuel, trimestriel, annuel)
- **FAQ Gammes** — Gestion des FAQ par catégorie de produits
- **Navigation** — Configuration du menu principal et des liens
- **Annonces** — Bandeau d'annonce (header announcement bar)
- **Équipe** — Gestion des membres de l'équipe avec avatars
- **Hero** — Configuration de la section Hero de la page d'accueil
- **Maintenance** — Mode maintenance avec message et date de retour
- **Administration** — Gestion des utilisateurs et rôles avec permissions granulaires
- **Profil** — Profil utilisateur, avatar, changement de mot de passe
- **Historique** — Journal d'audit de toutes les actions admin
- **Paramètres** — Configuration générale du site, réseaux sociaux, WHMCS

### Stack admin

- **Supabase Auth** — Authentification email/mot de passe ; création d'utilisateurs via client éphémère
- **Supabase Postgres** — Base de données temps réel (`postgres_changes` → re-fetch de la table)
- **Supabase Storage** — Upload d'avatars (bucket `avatars`) avec validation (image, max 2 Mo)
- **Thème dark/light** — CSS variables avec toggle automatique
- **Composants custom** — AdminButton, AdminDropdown, AdminDataTable, AdminDialog, SpotlightCard
- **Command palette** — Raccourci `Ctrl+K` pour navigation rapide

## Licence

Projet Privé. Copyright (c) 2026 LKLCloud. Tous droits réservés.
