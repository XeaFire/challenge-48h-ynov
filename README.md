# Pindows 98

> Tristan DIARD - Nicolas MICHAUX — Maël SOURISSEAU — Kevin GUARATO — Martin JAUDINOT


## Lien: https://chal48.lsblk2exa.beauty

**Jeu narratif d'enquête style Kinito Pet dans un faux Windows 98.** Les personnages sont les assistants clippy de Microsoft. Quelqu'un a tué Links. Trouvez le meurtrier.

## Fonctionnalités

- Desktop Windows 98 complet et fonctionnel (fenêtres, drag, taskbar, start menu)
- 9 personnages animés (Merlin, Links, Bonzi, Clippy, Genie, Genius, Peedy, Rocky, Rover) via [clippyjs](https://github.com/pithings/clippy)
- Histoire en 6 chapitres avec système de triggers/flags
- Applications jouables : Paint, Calculatrice, Solitaire, Démineur, Explorateur de fichiers, Bloc-notes, Boîte mail, Internet Explorer, Terminal
- Effets spéciaux : écran de sang, BSOD, screen shake, messages subliminaux, texte glitch
- Bulles de dialogue React avec typewriter et skip au clic
- Formulaires interactifs dans l'histoire
- Musique de fond, SFX

## Prérequis

- Node.js >= 18
- Bun

## Installation

```bash
git clone https://github.com/XeaFire/challenge-48h-ynov.git
cd challenge-48h-ynov
```

### Frontend

```bash
cd front
bun install
bun run dev
```

### Backend

```bash
cd backend
bun install
bun run dev
```

> [!IMPORTANT]
Le backend n'est au final pas utilisé par manque de temps, il était prévu de pouvoir sauvegarder sa progression avec un code et avec le localStorage, et pouvoir reprendre sa partie.

## Docker

```bash
docker compose up -d
```

Le frontend est accessible sur le port `8082`, le backend sur `3001`.

## Structure

```
.
├── front/src/
│   ├── App.tsx              # Composant racine
│   ├── types.ts             # Types globaux
│   ├── icons.tsx            # Icônes SVG Win98
│   ├── index.css            # Styles Win98
│   ├── game/                # Moteur narratif (triggers, flags, stories 1-6)
│   ├── hooks/               # useWindowManager, useAgentManager, useGameEngine, useMailStore
│   └── components/          # Desktop, Taskbar, Window, SpeechBubble, apps (Paint, Calculator, etc.)
├── backend/src/
│   └── index.ts             # Serveur ElysiaJS
├── docker-compose.yml
└── .github/workflows/       # CI/CD
```

## Technologies

- **Frontend** : [React 19](https://react.dev/) / [TypeScript](https://www.typescriptlang.org/) / [Vite](https://vite.dev/)
- **Backend** : [Bun](https://bun.sh/) / [ElysiaJS](https://elysiajs.com/)
- **Agents** : [clippyjs](https://github.com/pithings/clippy)
- **Deploy** : [Docker](https://www.docker.com/) / [Watchtower](https://github.com/containrrr/watchtower) / [Caddy](https://caddyserver.com/)
- **CI/CD** : [GitHub Actions](https://github.com/features/actions)

---

> [!CAUTION]
> ## Spoilers — Guide pour finir le jeu
>
> <details>
> <summary>Cliquez pour révéler la solution (SPOILERS)</summary>
>
> 1. Remplir le formulaire d'intro → Paint se débloque
> 2. Ouvrir Paint → Links meurt → ouvrir les mails pour lire le mail glitché et trouver l'url
> 3. Ouvrir Internet Explorer → faurnite.battlepass.com → Genius nettoie
> 4. Cache-cache dans l'Explorateur → trouver les 6 persos → `cadavre_rocky` apparaît → interroger Peedy → Peedy nous apprend que Bonzi est suspect et qu'il fait des jeux de mots.
> 5. Terminal : `permissions bonzi` → Genie arrive → ouvrir la Calculatrice → drag les chiffres **4 7 5 1** (mot de passe disponible sur le poste de travail) sur la page de Bonzi, ou on apprend que son rêve est d'être comédien.
> 6. Choisir **Peedy** comme meurtrier
>
> **Comment savoir que c'est Peedy ?**
> - Peedy est le seul à savoir que Bonzi aime les jeux de mots et veut être comédien (infos qu'il donne pendant l'interrogatoire alors que personne ne le sait)
> - `nslookup faurnite.battlepass.com` dans le Terminal → révèle que Genie est l'auteur du site ne connaissant pas l'informatique, Peedy qui gérait le site devinez-moi de Génie a remplacé le site par un virus.
</details>
