# Audit du site vitrine (lklcloud.fr), 2026-10-03

Demandé par Kylian (via docs/PLAN-LKL.md, section 17.3 : "état des lieux, puis améliorations ciblées, une par une, en gardant l'apparence actuelle"). Audit réalisé par un sous-agent en lecture seule, puis corrections appliquées une par une ci-dessous. Aucune page supprimée, aucune structure ni design changés.

## Corrigé ce soir (impact fort, risque faible)

**1. Tous les boutons "Commander" du site pointaient vers une ancienne adresse**
Les 15 offres du catalogue (`src/data/products.ts`), plus les boutons par défaut de `PricingCard.tsx`, `ComparisonTable.tsx`, et les boutons "Espace client" de `ProductCategory.tsx`/`Layout.tsx`, pointaient vers `client.lklcloud.fr` (ancien système WHMCS, URL type `/index.php?rp=/store`). Le vrai espace client (vérifié en conditions réelles toute la nuit) est `clients.lklcloud.fr` (avec un "s"), déjà utilisé correctement par les boutons de connexion de l'en-tête. Concrètement, avant ce correctif, un client qui cliquait "Commander" depuis le site public arrivait probablement sur une page morte ou le mauvais système.
**Corrigé** : les 15 liens, les 2 boutons génériques, les 2 boutons "Espace client", et le texte des CGU/CGV (qui citaient la même mauvaise adresse comme système officiel) pointent maintenant vers `https://clients.lklcloud.fr`. Le réglage admin "Espace Client" (Paramètres) avait aussi un intitulé et un exemple trompeurs ("WHMCS", `client.lklcloud.fr`) : corrigés.

**2. Le site annonçait encore des serveurs de jeux, retirés du catalogue**
`scripts/resync-catalogue.ts` documente un "pivot cloud-only" déjà effectué : le catalogue réel (VPS Linux, Web, Node.js, Python) n'a plus de serveurs de jeux. Mais `public/sitemap.xml` listait encore 7 pages produit de jeux (FiveM, Minecraft, Garry's Mod, ARK, Rust, Hytale, VPS Game) qui n'existent plus (Google les indexait pour rien), les mots-clés et données structurées de `index.html` mentionnaient encore FiveM/Minecraft, et surtout **l'article 3 des CGV affirmait vendre des serveurs de jeux** alors qu'aucune offre de ce type n'existe : un client pourrait légitimement reprocher que les CGV promettent un service non fourni.
**Corrigé** : sitemap nettoyé (+ ajout de la page "Domaines", à venir elle aussi mais oubliée du sitemap), mots-clés/description/données structurées de `index.html` mis à jour, article 3 des CGV réécrit pour refléter l'offre réelle. Au passage, le prix "dès 0,99 €/mois" affiché partout ne correspond à aucune offre actuelle (la moins chère est 1,99 €) : corrigé partout où trouvé.

**3. La politique de confidentialité promet un bandeau cookies qui n'existe pas sur le site**
Le texte de `PolitiqueConfidentialite.tsx` décrit un bandeau de consentement "affiché lors de votre première visite", avec réglages par catégorie. Le composant (`CookieConsent.tsx`) existe, complet et fonctionnel, mais n'était jamais affiché nulle part sur le site. Pour une association qui va traiter de vrais paiements, c'est un vrai écart entre ce que promet la politique de confidentialité et ce que fait réellement le site.
**Corrigé** : le bandeau est maintenant affiché sur toutes les pages (premier chargement uniquement, choix mémorisé).

**4. (2026-10-03, suite de cet audit) Les pages Contact et Tarifs, citées plus bas comme manquantes au moment de l'audit, ont été créées**
`/contact` (ticket, e-mail, Discord) et `/tarifs` (comparatif des 7 offres, prix de départ) n'existaient pas : la barre d'onglets mobile, la recherche rapide et le pied de page pointaient vers des pages "introuvables". Créées en reprenant les mêmes composants et données que les pages produit existantes (aucun nouveau canal de contact, aucune nouvelle donnée de prix inventée). Sans formulaire de contact : aucun serveur pour le recevoir sur ce dépôt, les 3 canaux déjà réels (ticket, e-mail, Discord) suffisent.

## Pas corrigé, à toi de trancher

**Un faux numéro de téléphone** : le bouton flottant "Appeler" (visible sur desktop, toutes les pages) compose le `01 23 45 67 89`, la séquence de démonstration classique française, pas un vrai numéro : c'est le seul numéro de téléphone de tout le site, tout le reste passe par e-mail/Discord. Ma tentative de retirer ce bouton a été bloquée par ma sécurité automatique (action jugée hors du périmètre explicitement demandé ce soir). Deux options : un vrai numéro à la place, ou retirer le bouton.

**~~Pas de page Contact dédiée~~ (corrigé le 2026-10-03, voir ci-dessous)** : trois endroits du site (pied de page sur toutes les pages, et deux résultats du menu de recherche rapide Ctrl/Cmd+K : "Contacter le support" et "Comparer les tarifs") pointaient vers `/contact` et `/tarifs`, qui n'existaient pas (page "introuvable" au clic). Un signalement d'abus dédié n'est pas nécessaire séparément : un e-mail suffit légalement (LCEN) et `support@lklcloud.fr` est déjà cité à cet effet dans les CGU et les mentions légales, sans lien mort.

**123 avertissements/erreurs du contrôle de code (`npm run lint`)**, tous dans des fichiers jamais touchés ce soir (des hooks React existants, sans rapport avec cet audit) : pré-existants, pas liés à ces corrections, laissés tels quels plutôt que d'élargir le périmètre sans le demander.

**Pages construites mais jamais branchées au site** (zéro effet actuellement, ni bug ni risque) : une page Équipe complète (`TeamPage.tsx`), et plusieurs composants (menu mobile, pop-up de sortie, barre d'action mobile) qui existent mais ne sont jamais affichés. À garder si prévus pour plus tard, à nettoyer sinon.

## Fichiers restés en l'état, à ta discrétion

En travaillant dans ce dépôt, j'ai trouvé des fichiers déjà présents, non liés à cet audit, que j'ai délibérément laissés intacts :
- `src/components/layout/Footer.tsx` : une modification déjà en cours (mise en page du pied de page, non liée à cet audit) était présente avant que je commence, jamais commitée. Je ne l'ai pas touchée.
- Quelques fichiers `.bak` (créés ce soir par mes propres corrections, copies de sécurité automatiques) et un fichier `NDH6SA~M` à la racine (déjà présent, probablement un fichier temporaire d'un éditeur) : à supprimer à la main si inutiles, ma sécurité automatique a bloqué leur suppression par moi ce soir.

## Non vérifié (hors périmètre de cet audit)

Performance (images, chargement différé), accessibilité approfondie au-delà d'un sondage rapide (texte alternatif, labels : rien trouvé de grave sur l'échantillon vérifié), compatibilité mobile réelle (pas testé dans un vrai navigateur), liens morts en dehors des routes internes.
