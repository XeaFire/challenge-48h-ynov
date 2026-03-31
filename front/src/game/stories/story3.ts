import type { StoryTrigger } from '../types';

export const story3Triggers: StoryTrigger[] = [
  // ── Part 1: Faurnite virus chaos ──
  {
    id: 'story3_faurnite_virus',
    conditions: [
      { type: 'flag', flag: 'story2_complete', value: true },
      { type: 'flag', flag: 'visited_faurnite.battlepass.com', value: true },
    ],
    actions: [
      // Lock windows so user can't close anything
      { type: 'lockClose', locked: true },

      // Merlin appears, excited about faurnite
      { type: 'agentShow', character: 'merlin' },
      { type: 'agentPlay', character: 'merlin', animation: 'GetAttention' },
      { type: 'agentSpeak', character: 'merlin', text: "Oh ! Faurnite ! Le streamer GrosTagras en parlait justement ! C'est un jeu INCROYABLE !" },
      { type: 'agentSpeak', character: 'merlin', text: "Il paraît que si tu télécharges maintenant, tu as 50.000 FortBux GRATUITS ! C'est une offre de fous !" },
      { type: 'delay', ms: 1500 },

      // Spam IE windows
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

      // Screen starts shaking
      { type: 'screenShake', enabled: true },
      { type: 'agentPlay', character: 'merlin', animation: 'Surprised' },
      { type: 'agentStopCurrent', character: 'merlin' },
      { type: 'agentSpeak', character: 'merlin', text: "Euh... c'est normal tout ça ?! Il y a des fenêtres partout !" },
      { type: 'delay', ms: 2000 },

      // Hide Merlin before the subliminal
      { type: 'agentHide', character: 'merlin', instant: true },
      { type: 'delay', ms: 500 },

      // Subliminal flash
      { type: 'showSubliminal', text: 'CLIPPY, TU ES LE PROCHAIN', ms: 1500 },
      { type: 'delay', ms: 500 },

      // Everything stops — close all, reset
      { type: 'screenShake', enabled: false },
      { type: 'closeAllWindows' },
      { type: 'lockClose', locked: false },
      // Clear the faurnite spam flag so next IE opening won't load faurnite
      { type: 'setFlag', flag: 'story3_faurnite_spam', value: false },

      { type: 'setFlag', flag: 'story3_virus_done', value: true },
    ],
    once: true,
  },

  // ── Part 2: Genius cleanup ──
  {
    id: 'story3_genius_cleanup',
    conditions: [
      { type: 'flag', flag: 'story3_virus_done', value: true },
    ],
    actions: [
      { type: 'delay', ms: 1500 },

      // Genius appears
      { type: 'agentShow', character: 'genius' },
      { type: 'agentPlay', character: 'genius', animation: 'Greet' },
      { type: 'agentSpeak', character: 'genius', text: "Pas de panique ! Je suis Einstein, l'agent de sécurité de Pindows !" },
      { type: 'agentSpeak', character: 'genius', text: "J'ai détecté l'intrusion et j'ai supprimé le virus. Tout est sous contrôle maintenant." },
      { type: 'agentSpeak', character: 'genius', text: "Faites attention la prochaine fois ! Ne cliquez pas sur n'importe quoi..." },
      { type: 'delay', ms: 1000 },

      // Open avost.antivirus.com
      { type: 'agentSpeak', character: 'genius', text: "Tenez, je vous ouvre notre antivirus AVOST. Lisez bien les conseils de sécurité !" },
      { type: 'setFlag', flag: 'story3_avost_page', value: true },
      { type: 'openWindow', windowType: 'ie' },
      { type: 'delay', ms: 12000 },

      // Einstein closes the page
      { type: 'closeAllWindows' },
      { type: 'setFlag', flag: 'story3_avost_page', value: false },
      { type: 'agentSpeak', character: 'genius', text: "Voilà ! Gardez ces conseils en tête. Je reste en veille si besoin." },
      { type: 'agentPlay', character: 'genius', animation: 'GoodBye' },
      { type: 'agentHide', character: 'genius' },

      { type: 'setFlag', flag: 'story3_cleanup_done', value: true },
    ],
    once: true,
  },

  // ── Part 3: Hide and seek ──
  {
    id: 'story3_hide_and_seek',
    conditions: [
      { type: 'flag', flag: 'story3_cleanup_done', value: true },
    ],
    actions: [
      { type: 'delay', ms: 2000 },

      // Merlin proposes the game
      { type: 'agentShow', character: 'merlin' },
      { type: 'agentPlay', character: 'merlin', animation: 'GetAttention' },
      { type: 'agentSpeak', character: 'merlin', text: "Bon ! Après toutes ces émotions, il manque un peu de fun !" },
      { type: 'agentSpeak', character: 'merlin', text: "Et si on jouait à un jeu ? Un CACHE-CACHE ! 🎉" },
      { type: 'agentSpeak', character: 'merlin', text: "Je vais appeler tout le monde !" },
      { type: 'delay', ms: 1500 },

      // Spawn all characters (except Links who is dead)
      { type: 'agentShow', character: 'genie' },
      { type: 'agentMoveTo', character: 'genie', x: 200, y: 300, duration: 0 },
      { type: 'delay', ms: 400 },
      { type: 'agentShow', character: 'peedy' },
      { type: 'agentMoveTo', character: 'peedy', x: 350, y: 300, duration: 0 },
      { type: 'delay', ms: 400 },
      { type: 'agentShow', character: 'bonzi' },
      { type: 'agentMoveTo', character: 'bonzi', x: 500, y: 300, duration: 0 },
      { type: 'delay', ms: 400 },
      { type: 'agentShow', character: 'genius' },
      { type: 'agentMoveTo', character: 'genius', x: 650, y: 300, duration: 0 },
      { type: 'delay', ms: 400 },
      { type: 'agentShow', character: 'rocky' },
      { type: 'agentMoveTo', character: 'rocky', x: 800, y: 300, duration: 0 },
      { type: 'delay', ms: 400 },
      { type: 'agentShow', character: 'rover' },
      { type: 'agentMoveTo', character: 'rover', x: 950, y: 300, duration: 0 },
      { type: 'delay', ms: 1000 },

      // Everyone reacts
      { type: 'agentPlay', character: 'genie', animation: 'Greet' },
      { type: 'agentSpeak', character: 'genie', text: "Un cache-cache ?! Excellente idée !" },
      { type: 'agentPlay', character: 'peedy', animation: 'Greet' },
      { type: 'agentSpeak', character: 'peedy', text: "Trop bien ! Personne ne me trouvera !" },
      { type: 'agentSpeak', character: 'bonzi', text: "Hehe... je connais les MEILLEURS endroits pour se cacher..." },
      { type: 'agentSpeak', character: 'genius', text: "Un exercice de dissimulation stratégique ! J'accepte le défi." },
      { type: 'agentSpeak', character: 'rocky', text: "Woof ! Woof !" },
      { type: 'agentSpeak', character: 'rover', text: "Arf arf !" },
      { type: 'delay', ms: 1500 },

      // Merlin counts
      { type: 'agentSpeak', character: 'merlin', text: "OK ! Fermez les yeux, utilisateur ! Je compte jusqu'à 3 !" },
      { type: 'agentSpeak', character: 'merlin', text: "1..." },
      { type: 'delay', ms: 1000 },
      { type: 'agentSpeak', character: 'merlin', text: "2..." },
      { type: 'delay', ms: 1000 },
      { type: 'agentSpeak', character: 'merlin', text: "3 ! CACHEZ-VOUS !" },
      { type: 'delay', ms: 500 },

      // Everyone scatters in parallel (wait: false = fire-and-forget)
      { type: 'agentMoveTo', character: 'genie', x: -300, y: 100, duration: 2000, wait: false },
      { type: 'agentMoveTo', character: 'peedy', x: 2000, y: -200, duration: 1800, wait: false },
      { type: 'agentMoveTo', character: 'bonzi', x: 900, y: -300, duration: 1500, wait: false },
      { type: 'agentMoveTo', character: 'genius', x: -300, y: 600, duration: 2200, wait: false },
      { type: 'agentMoveTo', character: 'rocky', x: 2000, y: 700, duration: 1600, wait: false },
      { type: 'agentMoveTo', character: 'rover', x: 400, y: -300, duration: 1900, wait: false },
      { type: 'agentMoveTo', character: 'merlin', x: 2000, y: 400, duration: 2000, wait: false },

      // Wait for the longest animation to finish
      { type: 'delay', ms: 2500 },

      // Hide them all
      { type: 'agentHide', character: 'genie', instant: true },
      { type: 'agentHide', character: 'peedy', instant: true },
      { type: 'agentHide', character: 'bonzi', instant: true },
      { type: 'agentHide', character: 'genius', instant: true },
      { type: 'agentHide', character: 'rocky', instant: true },
      { type: 'agentHide', character: 'rover', instant: true },
      { type: 'agentHide', character: 'merlin', instant: true },

      { type: 'setCharacterStatus', character: 'genie', status: 'hidden' },
      { type: 'setCharacterStatus', character: 'peedy', status: 'hidden' },
      { type: 'setCharacterStatus', character: 'bonzi', status: 'hidden' },
      { type: 'setCharacterStatus', character: 'genius', status: 'hidden' },
      { type: 'setCharacterStatus', character: 'rocky', status: 'hidden' },
      { type: 'setCharacterStatus', character: 'rover', status: 'hidden' },
      { type: 'setCharacterStatus', character: 'merlin', status: 'hidden' },

      { type: 'setFlag', flag: 'story3_complete', value: true },
    ],
    once: true,
  },
];
