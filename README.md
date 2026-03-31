# Pindows 98

> Tristan DIARD - Nicolas Michaux — Maël SOURISSEAU — Kevin GUARATO — Martin JAUDINOT

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
