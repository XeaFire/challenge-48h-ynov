import type { StoryTrigger } from '../types';

export const story4Triggers: StoryTrigger[] = [
  // ── Hide and seek — everyone runs toward the Explorer ──
  {
    id: 'story4_hide_and_seek',
    conditions: [
      { type: 'flag', flag: 'story3_complete', value: true },
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

      // Everyone scatters toward the Explorer icon (x:40, y:400) in parallel
      { type: 'agentMoveTo', character: 'genie', x: 40, y: 400, duration: 1800, wait: false },
      { type: 'agentMoveTo', character: 'peedy', x: 40, y: 400, duration: 1500, wait: false },
      { type: 'agentMoveTo', character: 'bonzi', x: 40, y: 400, duration: 2000, wait: false },
      { type: 'agentMoveTo', character: 'genius', x: 40, y: 400, duration: 1700, wait: false },
      { type: 'agentMoveTo', character: 'rocky', x: 40, y: 400, duration: 2200, wait: false },
      { type: 'agentMoveTo', character: 'rover', x: 40, y: 400, duration: 1600, wait: false },
      { type: 'agentMoveTo', character: 'merlin', x: 40, y: 400, duration: 1900, wait: false },

      // Wait for the longest to arrive
      { type: 'delay', ms: 2500 },

      // Hide them all (they "entered" the Explorer)
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

      { type: 'setFlag', flag: 'story4_hiding', value: true },
    ],
    once: true,
  },

  // ── Found: Merlin ──
  {
    id: 'story4_found_merlin',
    conditions: [
      { type: 'flag', flag: 'story4_hiding', value: true },
      { type: 'flag', flag: 'item_found_merlin', value: true },
    ],
    actions: [
      { type: 'agentShow', character: 'merlin' },
      { type: 'agentPlay', character: 'merlin', animation: 'Surprised' },
      { type: 'agentSpeak', character: 'merlin', text: "Oh non ! Tu m'as trouvé ! Je pensais que le dossier des polices était la cachette parfaite ! 🎩" },
      { type: 'agentPlay', character: 'merlin', animation: 'GoodBye' },
      { type: 'agentHide', character: 'merlin' },
      { type: 'setCharacterStatus', character: 'merlin', status: 'alive' },
    ],
    once: true,
  },

  // ── Found: Genie ──
  {
    id: 'story4_found_genie',
    conditions: [
      { type: 'flag', flag: 'story4_hiding', value: true },
      { type: 'flag', flag: 'item_found_genie', value: true },
    ],
    actions: [
      { type: 'agentShow', character: 'genie' },
      { type: 'agentPlay', character: 'genie', animation: 'Surprised' },
      { type: 'agentSpeak', character: 'genie', text: "POUF ! Tu m'as trouvé ! Ma lampe magique m'a trahi... ✨" },
      { type: 'agentPlay', character: 'genie', animation: 'GoodBye' },
      { type: 'agentHide', character: 'genie' },
      { type: 'setCharacterStatus', character: 'genie', status: 'alive' },
    ],
    once: true,
  },

  // ── Found: Peedy ──
  {
    id: 'story4_found_peedy',
    conditions: [
      { type: 'flag', flag: 'story4_hiding', value: true },
      { type: 'flag', flag: 'item_found_peedy', value: true },
    ],
    actions: [
      { type: 'agentShow', character: 'peedy' },
      { type: 'agentPlay', character: 'peedy', animation: 'Surprised' },
      { type: 'agentSpeak', character: 'peedy', text: "Cuicui ! Mes plumes m'ont trahi ! J'aurais dû me cacher dans les fichiers système... 🐦" },
      { type: 'agentPlay', character: 'peedy', animation: 'GoodBye' },
      { type: 'agentHide', character: 'peedy' },
      { type: 'setCharacterStatus', character: 'peedy', status: 'alive' },
    ],
    once: true,
  },

  // ── Found: Bonzi ──
  {
    id: 'story4_found_bonzi',
    conditions: [
      { type: 'flag', flag: 'story4_hiding', value: true },
      { type: 'flag', flag: 'item_found_bonzi', value: true },
    ],
    actions: [
      { type: 'agentShow', character: 'bonzi' },
      { type: 'agentPlay', character: 'bonzi', animation: 'Surprised' },
      { type: 'agentSpeak', character: 'bonzi', text: "Grr... Tu m'as trouvé. J'étais pourtant bien caché dans le système... 🐒" },
      { type: 'agentSpeak', character: 'bonzi', text: "La prochaine fois je me cacherai mieux... beaucoup mieux." },
      { type: 'agentPlay', character: 'bonzi', animation: 'GoodBye' },
      { type: 'agentHide', character: 'bonzi' },
      { type: 'setCharacterStatus', character: 'bonzi', status: 'alive' },
    ],
    once: true,
  },

  // ── Found: Genius ──
  {
    id: 'story4_found_genius',
    conditions: [
      { type: 'flag', flag: 'story4_hiding', value: true },
      { type: 'flag', flag: 'item_found_genius', value: true },
    ],
    actions: [
      { type: 'agentShow', character: 'genius' },
      { type: 'agentPlay', character: 'genius', animation: 'Surprised' },
      { type: 'agentSpeak', character: 'genius', text: "Impressionnant ! Ma stratégie de dissimulation était pourtant optimale... E=mc² n'a pas suffi ! 🧪" },
      { type: 'agentPlay', character: 'genius', animation: 'GoodBye' },
      { type: 'agentHide', character: 'genius' },
      { type: 'setCharacterStatus', character: 'genius', status: 'alive' },
    ],
    once: true,
  },

  // ── Found: Rover ──
  {
    id: 'story4_found_rover',
    conditions: [
      { type: 'flag', flag: 'story4_hiding', value: true },
      { type: 'flag', flag: 'item_found_rover', value: true },
    ],
    actions: [
      { type: 'agentShow', character: 'rover' },
      { type: 'agentPlay', character: 'rover', animation: 'Surprised' },
      { type: 'agentSpeak', character: 'rover', text: "Arf arf ! *remue la queue* Tu m'as trouvé ! J'ai enterré mon os ici ! 🦴" },
      { type: 'agentPlay', character: 'rover', animation: 'GoodBye' },
      { type: 'agentHide', character: 'rover' },
      { type: 'setCharacterStatus', character: 'rover', status: 'alive' },
    ],
    once: true,
  },

  // ── Found: Rocky (last one — reveals cadavre_rocky) ──
  {
    id: 'story4_found_rocky',
    conditions: [
      { type: 'flag', flag: 'story4_hiding', value: true },
      { type: 'flag', flag: 'item_found_rocky', value: true },
    ],
    actions: [
      { type: 'agentShow', character: 'rocky' },
      { type: 'agentPlay', character: 'rocky', animation: 'Surprised' },
      { type: 'agentSpeak', character: 'rocky', text: "Woof... woof... 🐕" },
      { type: 'agentSpeak', character: 'rocky', text: "..." },
      { type: 'agentPlay', character: 'rocky', animation: 'GoodBye' },
      { type: 'agentHide', character: 'rocky' },
      { type: 'setCharacterStatus', character: 'rocky', status: 'alive' },
      { type: 'setFlag', flag: 'story4_rocky_found', value: true },
    ],
    once: true,
  },

  // ── All found → story4 complete ──
  {
    id: 'story4_all_found',
    conditions: [
      { type: 'flag', flag: 'item_found_merlin', value: true },
      { type: 'flag', flag: 'item_found_genie', value: true },
      { type: 'flag', flag: 'item_found_peedy', value: true },
      { type: 'flag', flag: 'item_found_bonzi', value: true },
      { type: 'flag', flag: 'item_found_genius', value: true },
      { type: 'flag', flag: 'item_found_rover', value: true },
      { type: 'flag', flag: 'item_found_rocky', value: true },
    ],
    actions: [
      { type: 'delay', ms: 2000 },
      { type: 'agentShow', character: 'merlin' },
      { type: 'agentSpeak', character: 'merlin', text: "Bravo ! Tu nous as tous trouvés ! Tu es un vrai champion du cache-cache ! 🏆" },
      { type: 'agentSpeak', character: 'merlin', text: "Mais... tu as vu ce qu'il y avait dans le dossier de Rocky... ? 😰" },
      { type: 'agentPlay', character: 'merlin', animation: 'GoodBye' },
      { type: 'agentHide', character: 'merlin' },
      { type: 'setFlag', flag: 'story4_complete', value: true },
    ],
    once: true,
  },
];
