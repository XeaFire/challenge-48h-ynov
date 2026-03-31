import type { StoryTrigger } from '../types';

// ---------------------------------------------------------------------------
// Story 3 — Le virus Faurnite
//
// When user visits faurnite.battlepass.com:
//   1. Windows locked — can't close IE
//   2. Merlin appears, excited about the "deal"
//   3. More IE windows spam open with faurnite
//   4. Screen shakes, everything goes creepy
//   5. Subliminal flash: "CLIPPY, TU ES LE PROCHAIN"
//   6. Everything closes, Genius restores order
// ---------------------------------------------------------------------------

export const story3Triggers: StoryTrigger[] = [
  {
    id: 'story3_faurnite_virus',
    conditions: [
      { type: 'flag', flag: 'story2_complete', value: true },
      { type: 'flag', flag: 'visited_faurnite.battlepass.com', value: true },
    ],
    actions: [
      // Lock all windows — user can't escape
      { type: 'lockClose', locked: true },

      // Merlin appears, excited
      { type: 'agentShow', character: 'merlin' },
      { type: 'agentPlay', character: 'merlin', animation: 'Congratulate' },
      { type: 'agentSpeak', character: 'merlin', text: "Wooow ! Regarde-moi cette offre ! C'est INCROYABLE !" },
      { type: 'agentSpeak', character: 'merlin', text: "Le streamer Grostagras a parlé de Faurnite ! C'est LE jeu du moment paraît-il !" },
      { type: 'agentSpeak', character: 'merlin', text: "50 000 FortBux GRATUITS ?! Tu serais fou de ne pas en profiter !" },

      // Set spam flag so new IE windows auto-load faurnite
      { type: 'setFlag', flag: 'story3_faurnite_spam', value: true },

      // Windows start flooding
      { type: 'delay', ms: 800 },
      { type: 'openWindow', windowType: 'ie' },
      { type: 'delay', ms: 600 },
      { type: 'openWindow', windowType: 'ie' },
      { type: 'delay', ms: 500 },
      { type: 'openWindow', windowType: 'ie' },

      { type: 'agentSpeak', character: 'merlin', text: "Oh ! Regarde, y'a plein d'offres partout ! C'est Noël !" },

      { type: 'delay', ms: 400 },
      { type: 'openWindow', windowType: 'ie' },
      { type: 'openWindow', windowType: 'ie' },
      { type: 'delay', ms: 300 },
      { type: 'openWindow', windowType: 'ie' },
      { type: 'openWindow', windowType: 'ie' },
      { type: 'openWindow', windowType: 'ie' },

      // Screen starts shaking
      { type: 'screenShake', enabled: true },
      { type: 'agentPlay', character: 'merlin', animation: 'Surprised' },
      { type: 'agentSpeak', character: 'merlin', text: "Euh... Attends... Quelque chose ne va pas..." },

      { type: 'delay', ms: 300 },
      { type: 'openWindow', windowType: 'ie' },
      { type: 'openWindow', windowType: 'ie' },
      { type: 'openWindow', windowType: 'ie' },
      { type: 'delay', ms: 200 },
      { type: 'openWindow', windowType: 'ie' },
      { type: 'openWindow', windowType: 'ie' },
      { type: 'openWindow', windowType: 'ie' },
      { type: 'openWindow', windowType: 'ie' },

      { type: 'agentSpeak', character: 'merlin', text: "NON NON NON ! C'est un VIRUS !" },

      { type: 'delay', ms: 500 },
      { type: 'openWindow', windowType: 'ie' },
      { type: 'openWindow', windowType: 'ie' },
      { type: 'openWindow', windowType: 'ie' },
      { type: 'openWindow', windowType: 'ie' },
      { type: 'openWindow', windowType: 'ie' },

      // Merlin vanishes
      { type: 'agentHide', character: 'merlin', instant: true },
      { type: 'delay', ms: 600 },

      // Subliminal flash
      { type: 'showSubliminal', text: 'CLIPPY, TU ES LE PROCHAIN', ms: 1500 },

      // Everything stops
      { type: 'screenShake', enabled: false },
      { type: 'closeAllWindows' },
      { type: 'setFlag', flag: 'story3_faurnite_spam', value: false },
      { type: 'delay', ms: 1500 },

      // Genius to the rescue
      { type: 'agentShow', character: 'genius' },
      { type: 'agentPlay', character: 'genius', animation: 'Greet' },
      { type: 'agentSpeak', character: 'genius', text: "Du calme, du calme ! Je m'occupe de tout !" },
      { type: 'agentSpeak', character: 'genius', text: "Je suis Genius, l'agent de sécurité officiel de Pindows 98." },
      { type: 'agentSpeak', character: 'genius', text: "Ce site était un virus déguisé en promotion. J'ai tout nettoyé !" },
      { type: 'agentSpeak', character: 'genius', text: "Votre système est de nouveau sécurisé. Mais faites attention où vous cliquez à l'avenir !" },
      { type: 'agentSpeak', character: 'genius', text: "Et ce message subliminal... 'Clippy, tu es le prochain'... Très inquiétant. Je vais enquêter." },
      { type: 'agentPlay', character: 'genius', animation: 'GoodBye' },
      { type: 'agentSpeak', character: 'genius', text: "Restez vigilants ! Genius veille sur vous." },
      { type: 'agentHide', character: 'genius' },

      // Unlock windows and complete
      { type: 'lockClose', locked: false },
      { type: 'setFlag', flag: 'story3_complete', value: true },
    ],
    once: true,
  },
];
