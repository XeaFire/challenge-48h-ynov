import type { StoryTrigger } from '../types';

export const story3Triggers: StoryTrigger[] = [
  {
    id: 'story3_faurnite_virus',
    conditions: [
      { type: 'flag', flag: 'story2_complete', value: true },
      { type: 'flag', flag: 'visited_faurnite.battlepass.com', value: true },
    ],
    actions: [
      { type: 'lockClose', locked: true },

      { type: 'agentShow', character: 'merlin' },
      { type: 'agentPlay', character: 'merlin', animation: 'GetAttention' },
      { type: 'agentSpeak', character: 'merlin', text: "Oh ! Faurnite ! Le streamer GrosTagras en parlait justement ! C'est un jeu INCROYABLE !" },
      { type: 'agentSpeak', character: 'merlin', text: "Il paraît que si tu télécharges maintenant, tu as 50.000 FortBux GRATUITS ! C'est une offre de fous !" },
      { type: 'delay', ms: 1500 },

      { type: 'setFlag', flag: 'story3_faurnite_spam', value: true },
      { type: 'openWindow', windowType: 'ie' },
      { type: 'delay', ms: 600 },
      { type: 'openWindow', windowType: 'ie' },
      { type: 'delay', ms: 400 },
      { type: 'openWindow', windowType: 'ie' },
      { type: 'delay', ms: 300 },
      { type: 'openWindow', windowType: 'ie' },
      { type: 'delay', ms: 200 },
      { type: 'openWindow', windowType: 'ie' },
      { type: 'delay', ms: 150 },
      { type: 'openWindow', windowType: 'ie' },
      { type: 'delay', ms: 100 },
      { type: 'openWindow', windowType: 'ie' },
      { type: 'delay', ms: 100 },
      { type: 'openWindow', windowType: 'ie' },
      { type: 'delay', ms: 100 },
      { type: 'openWindow', windowType: 'ie' },
      { type: 'delay', ms: 100 },
      { type: 'openWindow', windowType: 'ie' },

      { type: 'screenShake', enabled: true },
      { type: 'agentPlay', character: 'merlin', animation: 'Surprised' },
      { type: 'agentStopCurrent', character: 'merlin' },
      { type: 'agentSpeak', character: 'merlin', text: "Euh... c'est normal tout ça ?! Il y a des fenêtres partout !" },
      { type: 'delay', ms: 2000 },

      { type: 'agentHide', character: 'merlin', instant: true },
      { type: 'delay', ms: 500 },

      { type: 'showSubliminal', text: 'CLIPPY, TU ES LE PROCHAIN', ms: 1500 },
      { type: 'delay', ms: 500 },

      { type: 'screenShake', enabled: false },
      { type: 'closeAllWindows' },
      { type: 'lockClose', locked: false },
      { type: 'setFlag', flag: 'story3_faurnite_spam', value: false },

      { type: 'setFlag', flag: 'story3_virus_done', value: true },
    ],
    once: true,
  },

  {
    id: 'story3_genius_cleanup',
    conditions: [
      { type: 'flag', flag: 'story3_virus_done', value: true },
    ],
    actions: [
      { type: 'delay', ms: 1500 },

      { type: 'agentShow', character: 'genius' },
      { type: 'agentPlay', character: 'genius', animation: 'Greet' },
      { type: 'agentSpeak', character: 'genius', text: "Pas de panique ! Je suis Einstein, l'agent de sécurité de Pindows !" },
      { type: 'agentSpeak', character: 'genius', text: "J'ai détecté l'intrusion et j'ai supprimé le virus. Tout est sous contrôle maintenant." },
      { type: 'agentSpeak', character: 'genius', text: "Faites attention la prochaine fois ! Ne cliquez pas sur n'importe quoi..." },
      { type: 'delay', ms: 1000 },

      { type: 'agentSpeak', character: 'genius', text: "Tenez, je vous ouvre notre antivirus AVOST. Lisez bien les conseils de sécurité !" },
      { type: 'setFlag', flag: 'story3_avost_page', value: true },
      { type: 'openWindow', windowType: 'ie' },
      { type: 'delay', ms: 12000 },

      { type: 'closeAllWindows' },
      { type: 'setFlag', flag: 'story3_avost_page', value: false },
      { type: 'agentSpeak', character: 'genius', text: "Voilà ! Gardez ces conseils en tête. Je reste en veille si besoin." },
      { type: 'agentPlay', character: 'genius', animation: 'GoodBye' },
      { type: 'agentHide', character: 'genius' },

      { type: 'setFlag', flag: 'story3_complete', value: true },
    ],
    once: true,
  },
];
