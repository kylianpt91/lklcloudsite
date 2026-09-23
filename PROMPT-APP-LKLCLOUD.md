# Prompt — Application web LKLCloud (Espace Client)

> À copier-coller dans une nouvelle session Claude Code, dans un dossier vide.
> Objectif : construire l'application web « Espace Client » de LKLCloud, dans la
> même direction artistique que le site vitrine (refonte 2026).

---

## Contexte

Tu vas construire **l'espace client de LKLCloud**, un hébergeur cloud français.
C'est une application web (SPA) où les clients gèrent leurs services cloud.
LKLCloud propose uniquement du **cloud** : VPS KVM Linux, hébergement web,
hébergement de bots Discord (Node.js / Python), et bientôt les noms de domaine.
**Aucun hébergement de serveur de jeu.**

Le site vitrine existe déjà (React + Vite + Tailwind v4 + Supabase). Cette
application est **séparée** mais doit partager la même identité visuelle.

## Stack imposée

- **React 19** + **TypeScript strict** + **Vite 7**
- **Tailwind CSS v4** — thème dans un bloc `@theme` du CSS, PAS de `tailwind.config`
- **React Router DOM 7**
- **Supabase** (`@supabase/supabase-js`) — Auth (email/mot de passe), Postgres,
  Storage. Client dans `src/lib/supabase.ts`, avec mode dégradé si `.env` absent
  (flag `isSupabaseConfigured`, placeholders, warning console — ne jamais laisser
  `getAuth`/init planter la page).
- **Framer Motion** pour les transitions (sobres)
- **Lucide React** pour les icônes
- **Recharts** pour les graphiques
- ESLint 9. `npm install` peut nécessiter `--legacy-peer-deps`.

## Direction artistique (identique au site vitrine)

Tokens `@theme` :
```
--color-primary: #FF6A30;
--color-primary-light: #FF8F5E;
--color-primary-dark: #E85A20;
--color-paper: #FBF7F3;       /* fond de page, chaud */
--color-paper-deep: #F3EBE3;  /* surface secondaire */
--color-ink: #17110D;         /* noir chaud — sidebar, header, pied */
--color-ink-soft: #2A2320;
--color-line: #E7DED4;        /* filets fins */
--color-neutral-dark: #171717;
--color-neutral-medium: #A3A3A3;
--font-sans: "Satoshi", "Inter", system-ui, sans-serif;
--font-serif: "Instrument Serif", Georgia, serif;
```
Polices auto-hébergées depuis `https://lklcloud.fr/fonts/` (Satoshi *.otf,
InstrumentSerif *.ttf), déclarées en `@font-face` avec `font-display: swap`.

Principes :
- **Éditorial, net, confiant.** Pas de glassmorphism, pas de dégradés partout,
  **aucune animation d'ambiance en boucle** (pas de breathing/glow/shimmer).
  Le mouvement se fait à l'entrée (scroll/route) et à l'interaction uniquement.
- Utilitaires : `.display` (font-weight 900, letter-spacing -0.03em, line-height
  0.98), `.eyebrow` (0.6875rem, 600, letter-spacing 0.22em, uppercase — NE PAS
  l'appeler `.overline`, ça entre en conflit avec Tailwind).
- L'orange est un **accent** : boutons primaires, chiffres clés, états actifs.
  Le titre signature utilise l'Instrument Serif italique orange.
- **Cartes** : `bg-paper border border-line rounded-2xl`, hover
  `hover:border-neutral-dark/20`. Boutons `rounded-xl`. Primaire :
  `bg-neutral-dark text-white hover:bg-primary`. Fantôme : bordure `neutral-dark/15`.
- Un seul « halo » orange décoratif possible par écran : radial contenu +
  `blur`, jamais un fond plein écran. Un grain SVG très léger (`opacity: 0.04`,
  `mix-blend-mode: multiply`) en option.
- **Thème clair uniquement.** Responsive strict, aucun débordement horizontal ;
  contenus larges (tableaux, graphes) dans un conteneur `overflow-x-auto`.
- Sidebar / topbar sur `--color-ink` (texte blanc/opacités), contenu sur
  `--color-paper`, surfaces alternées `--color-paper-deep`.

## Fonctionnalités (MVP)

### Auth
- Écran de connexion (email + mot de passe), inscription, mot de passe oublié
  (Supabase `resetPasswordForEmail`). Route `/auth/*`.
- `AuthGuard` : redirige vers `/auth/login` si pas de session. Écran de
  chargement centré (petit spinner discret) pendant la résolution de session.
- Écran de chargement d'appli au 1er rendu : wordmark **« LKL· »** (le point en
  orange) sur fond `--color-paper`, fine barre de progression orange en bas,
  puis wipe vers le haut. Pas de logo image (ça pixellise). Respecte
  `prefers-reduced-motion`.

### Layout applicatif
- Sidebar fixe (desktop) / drawer (mobile) sur fond `--color-ink` :
  navigation (Vue d'ensemble, Mes services, Facturation, Support, Domaines,
  Paramètres), profil en bas (avatar + nom + rôle).
- Topbar : fil d'ariane + recherche (Ctrl/Cmd+K) + notifications + menu compte.

### Pages
1. **Vue d'ensemble** — bandeau de bienvenue, cartes de stats (services actifs,
   prochaine facture, tickets ouverts, uptime moyen), liste des services avec
   statut (badge : en ligne / en pause / suspendu), activité récente,
   graphique d'utilisation (Recharts, palette sobre : encre + orange, pas de
   dégradés criards).
3. **Mes services** — liste/table filtrable par type (VPS, Web, Bot Discord).
   Détail d'un service : specs (RAM/CPU/stockage/réseau), état, actions
   (redémarrer / arrêter / démarrer — avec confirmation), accès (SSH/SFTP/panel),
   graphes CPU-RAM-réseau, console de logs (lecture seule, style terminal sur
   `--color-ink`), gestion des sauvegardes, renouvellement.
4. **Facturation** — factures (payées / en attente), moyen de paiement,
   historique, téléchargement PDF (via Storage), prochaine échéance.
5. **Support** — liste des tickets, ouverture de ticket (sujet, service concerné,
   priorité, message), fil de discussion avec pièces jointes (Storage),
   raccourci Discord.
6. **Domaines** — état « Prochainement » soigné (même style que la page
   `/coming-soon` du vitrine : eyebrow, titre display, halo, CTA notif).
7. **Paramètres** — profil (nom, avatar → Storage bucket `avatars`), e-mail,
   changement de mot de passe (via client Supabase éphémère pour ne pas casser
   la session : `persistSession: false`), préférences de notification, sessions.

### Modèle de données (Supabase — collections suggérées)
- `services` : { id, userId, type: 'vps'|'web'|'bot-node'|'bot-python', name,
  plan, status, specs (jsonb), region, createdAt, renewsAt }
- `invoices` : { id, userId, number, amount, currency, status, dueAt, pdfPath }
- `tickets` : { id, userId, subject, serviceId?, priority, status, createdAt }
- `ticket_messages` : { id, ticketId, author, body, attachments (jsonb), createdAt }
- `usage_samples` : { id, serviceId, at, cpu, ram, netIn, netOut }
- `profiles` : sous-arbre `data/users/<id>` privé par utilisateur
- RLS : chaque utilisateur ne voit QUE ses lignes (`userId = auth.uid()`).
  Fournir les migrations SQL (`supabase/migrations/0001_init.sql`,
  `0002_rls.sql`) + les `grant`/`alter default privileges` pour `anon` et
  `authenticated` (sinon « permission denied for table … »).
- Fournir un jeu de **données de démo** (seed) pour pouvoir tout voir sans back
  réel : script `scripts/seed.ts` (Node `--experimental-strip-types`), et des
  fallbacks front pour le mode hors-ligne.

## Contraintes techniques

- `verbatimModuleSyntax: true` → `import type` obligatoire pour les types.
- `noUnusedLocals` / `noUnusedParameters` activés.
- Path alias `@` → `./src` (dans `vite.config.ts` ET `tsconfig`).
- `npm run build` = `tsc -b && vite build` et **doit passer sans erreur**.
- Variables d'env : `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`. Fournir
  `.env.example` + un README d'installation (créer le projet Supabase, activer
  Email + désactiver « Confirm email », lancer les migrations, seed).
- Aucune dépendance à un CDN externe pour le JS/CSS applicatif.
- Accessibilité : focus visibles (`:focus-visible` outline orange), contrastes
  suffisants, `aria-*` sur les contrôles, `prefers-reduced-motion` respecté.

## Livrable attendu

Un dépôt qui `npm install --legacy-peer-deps && npm run dev` démarre, montre
l'écran de connexion puis (après seed) un espace client complet et cohérent
avec la DA ci-dessus, `npm run build` vert, et un README clair. Commence par
poser le design system (CSS `@theme` + primitives Button/Card/Badge/Input +
layout + loader + auth), puis enchaîne page par page.
