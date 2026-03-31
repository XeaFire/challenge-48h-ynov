import type { StoryTrigger } from '../types';

export const story4Triggers: StoryTrigger[] = [
  {
    id: 'story4_hide_and_seek',
    conditions: [
      { type: 'flag', flag: 'story3_complete', value: true },
    ],
    actions: [
      { type: 'delay', ms: 2000 },

      { type: 'agentShow', character: 'merlin' },
      { type: 'agentPlay', character: 'merlin', animation: 'GetAttention' },
      { type: 'agentSpeak', character: 'merlin', text: "Bon ! Après toutes ces émotions, il manque un peu de fun !" },
      { type: 'agentSpeak', character: 'merlin', text: "Et si on jouait à un jeu ? Un CACHE-CACHE ! 🎉" },
      { type: 'agentSpeak', character: 'merlin', text: "Je vais appeler tout le monde !" },
      { type: 'delay', ms: 1500 },

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

      { type: 'agentPlay', character: 'genie', animation: 'Greet' },
      { type: 'agentSpeak', character: 'genie', text: "Un cache-cache ?! Excellente idée !" },
      { type: 'agentPlay', character: 'peedy', animation: 'Greet' },
      { type: 'agentSpeak', character: 'peedy', text: "Trop bien ! Personne ne me trouvera !" },
      { type: 'agentSpeak', character: 'bonzi', text: "Hehe... je connais les MEILLEURS endroits pour se cacher..." },
      { type: 'agentSpeak', character: 'genius', text: "Un exercice de dissimulation stratégique ! J'accepte le défi." },
      { type: 'agentSpeak', character: 'rocky', text: "Woof ! Woof !" },
      { type: 'agentSpeak', character: 'rover', text: "Arf arf !" },
      { type: 'delay', ms: 1500 },

      { type: 'agentSpeak', character: 'merlin', text: "OK ! Fermez les yeux, utilisateur ! Je compte jusqu'à 3 !" },
      { type: 'agentSpeak', character: 'merlin', text: "1..." },
      { type: 'delay', ms: 1000 },
      { type: 'agentSpeak', character: 'merlin', text: "2..." },
      { type: 'delay', ms: 1000 },
      { type: 'agentSpeak', character: 'merlin', text: "3 ! CACHEZ-VOUS !" },
      { type: 'delay', ms: 500 },

      { type: 'agentMoveTo', character: 'genie', x: 40, y: 400, duration: 1800, wait: false },
      { type: 'agentMoveTo', character: 'peedy', x: 40, y: 400, duration: 1500, wait: false },
      { type: 'agentMoveTo', character: 'bonzi', x: 40, y: 400, duration: 2000, wait: false },
      { type: 'agentMoveTo', character: 'genius', x: 40, y: 400, duration: 1700, wait: false },
      { type: 'agentMoveTo', character: 'rocky', x: 40, y: 400, duration: 2200, wait: false },
      { type: 'agentMoveTo', character: 'rover', x: 40, y: 400, duration: 1600, wait: false },
      { type: 'agentMoveTo', character: 'merlin', x: 40, y: 400, duration: 1900, wait: false },

      { type: 'delay', ms: 2500 },

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

  {
    id: 'story4_all_others_found',
    conditions: [
      { type: 'flag', flag: 'item_found_merlin', value: true },
      { type: 'flag', flag: 'item_found_genie', value: true },
      { type: 'flag', flag: 'item_found_peedy', value: true },
      { type: 'flag', flag: 'item_found_bonzi', value: true },
      { type: 'flag', flag: 'item_found_genius', value: true },
      { type: 'flag', flag: 'item_found_rover', value: true },
    ],
    actions: [
      { type: 'delay', ms: 1500 },
      { type: 'agentShow', character: 'merlin' },
      { type: 'agentSpeak', character: 'merlin', text: "Bravo ! Tu as trouvé tout le monde ! Enfin... presque." },
      { type: 'agentSpeak', character: 'merlin', text: "Attends... où est Rocky ? Il devrait être quelque part..." },
      { type: 'agentSpeak', character: 'merlin', text: "Regarde bien dans les dossiers... j'ai un mauvais pressentiment. 😰" },
      { type: 'agentPlay', character: 'merlin', animation: 'GoodBye' },
      { type: 'agentHide', character: 'merlin' },
    ],
    once: true,
  },

  {
    id: 'story4_cadavre_rocky',
    conditions: [
      { type: 'flag', flag: 'item_found_rocky', value: true },
    ],
    actions: [
      { type: 'screenShake', enabled: true },
      { type: 'showSubliminal', text: '█▓▒░ R O C K Y ░▒▓█', ms: 1000 },
      { type: 'screenShake', enabled: false },
      { type: 'closeAllWindows' },
      { type: 'delay', ms: 1000 },

      { type: 'agentShow', character: 'merlin' },
      { type: 'agentMoveTo', character: 'merlin', x: 150, y: 350, duration: 0 },
      { type: 'delay', ms: 300 },
      { type: 'agentShow', character: 'genie' },
      { type: 'agentMoveTo', character: 'genie', x: 300, y: 350, duration: 0 },
      { type: 'delay', ms: 300 },
      { type: 'agentShow', character: 'peedy' },
      { type: 'agentMoveTo', character: 'peedy', x: 450, y: 350, duration: 0 },
      { type: 'delay', ms: 300 },
      { type: 'agentShow', character: 'bonzi' },
      { type: 'agentMoveTo', character: 'bonzi', x: 600, y: 350, duration: 0 },
      { type: 'delay', ms: 300 },
      { type: 'agentShow', character: 'genius' },
      { type: 'agentMoveTo', character: 'genius', x: 750, y: 350, duration: 0 },
      { type: 'delay', ms: 300 },
      { type: 'agentShow', character: 'rover' },
      { type: 'agentMoveTo', character: 'rover', x: 900, y: 350, duration: 0 },
      { type: 'delay', ms: 1000 },

      { type: 'agentPlay', character: 'merlin', animation: 'Surprised' },
      { type: 'agentSpeak', character: 'merlin', text: "Non... non non non... Rocky ?!" },
      { type: 'agentPlay', character: 'genie', animation: 'Surprised' },
      { type: 'agentSpeak', character: 'genie', text: "Qu'est-ce que... c'est quoi ce dossier ?!" },
      { type: 'agentSpeak', character: 'peedy', text: "Oh non... pas Rocky aussi..." },
      { type: 'agentSpeak', character: 'bonzi', text: "..." },
      { type: 'agentSpeak', character: 'genius', text: "C'est... impossible. Qui a fait ça ?" },
      { type: 'agentSpeak', character: 'rover', text: "... *gémit* ..." },
      { type: 'delay', ms: 2000 },

      { type: 'agentSpeak', character: 'merlin', text: "Encore un meurtre... D'abord Links, maintenant Rocky..." },
      { type: 'agentSpeak', character: 'merlin', text: "Le tueur est parmi nous. Et il frappe à nouveau." },
      { type: 'delay', ms: 2000 },

      { type: 'agentSpeak', character: 'merlin', text: "Bon... c'est pas grave hein. Rocky c'était pas le plus important entre nous..." },
      { type: 'agentSpeak', character: 'merlin', text: "C'était juste un chien quoi. Pas comme nous les VRAIS assistants." },
      { type: 'agentSpeak', character: 'peedy', text: "Merlin ! C'est horrible ce que tu dis !" },
      { type: 'agentSpeak', character: 'merlin', text: "Oui oui, paix à son âme et tout ça... BREF !" },
      { type: 'delay', ms: 1000 },

      { type: 'agentSpeak', character: 'merlin', text: "Tiens, plutôt que de déprimer, je te propose d'aller discuter avec Peedy !" },
      { type: 'agentSpeak', character: 'merlin', text: "C'est notre oiseau préféré. Vas-y, pose-lui des questions pour apprendre à le connaître !" },

      { type: 'agentPlay', character: 'genie', animation: 'GoodBye' },
      { type: 'agentHide', character: 'genie' },
      { type: 'agentPlay', character: 'bonzi', animation: 'GoodBye' },
      { type: 'agentHide', character: 'bonzi' },
      { type: 'agentPlay', character: 'genius', animation: 'GoodBye' },
      { type: 'agentHide', character: 'genius' },
      { type: 'agentPlay', character: 'rover', animation: 'GoodBye' },
      { type: 'agentHide', character: 'rover' },
      { type: 'agentPlay', character: 'merlin', animation: 'GoodBye' },
      { type: 'agentHide', character: 'merlin' },
      { type: 'delay', ms: 500 },

      { type: 'setCharacterStatus', character: 'rocky', status: 'dead' },
      { type: 'setFlag', flag: 'story4_rocky_dead', value: true },

      { type: 'agentMoveTo', character: 'peedy', x: 400, y: 300, duration: 0 },
      { type: 'agentPlay', character: 'peedy', animation: 'Greet' },
      { type: 'agentSpeak', character: 'peedy', text: "Salut ! Moi c'est Peedy ! Je suis content qu'on puisse discuter un peu. 🐦" },
      { type: 'agentSpeak', character: 'peedy', text: "Tu veux me poser des questions ? Vas-y, je suis un livre ouvert !" },

      {
        type: 'showForm',
        formId: 'story4_peedy_q1',
        title: '🐦 Discuter avec Peedy',
        description: 'Choisis une question :',
        fields: [
          { key: 'q1', label: "Quel est ton talent caché ?", type: 'button' },
        ],
      },
    ],
    once: true,
  },

  {
    id: 'story4_peedy_a1',
    conditions: [
      { type: 'flag', flag: 'form_story4_peedy_q1_submitted', value: true },
    ],
    actions: [
      { type: 'agentPlay', character: 'peedy', animation: 'GetAttention' },
      { type: 'agentSpeak', character: 'peedy', text: "Mon talent caché ? Je sais chanter ! Enfin... les autres disent que ça ressemble plus à un cri de mouette, mais MOI je trouve ça magnifique. 🎵" },
      { type: 'delay', ms: 500 },
      {
        type: 'showForm',
        formId: 'story4_peedy_q2',
        title: '🐦 Discuter avec Peedy',
        description: 'Choisis une question :',
        fields: [
          { key: 'q2', label: "Est-ce que tu aimes les jeux de mots ?", type: 'button' },
        ],
      },
    ],
    once: true,
  },

  {
    id: 'story4_peedy_a2',
    conditions: [
      { type: 'flag', flag: 'form_story4_peedy_q2_submitted', value: true },
    ],
    actions: [
      { type: 'agentSpeak', character: 'peedy', text: "Les jeux de mots ? Ah non, pas du tout ! C'est pas mon truc ça." },
      { type: 'agentSpeak', character: 'peedy', text: "C'est plutôt Bonzi qui fait des jeux de mots tout le temps... Moi je trouve ça lourd honnêtement." },
      { type: 'agentSpeak', character: 'peedy', text: "D'ailleurs entre nous, Bonzi est bizarre des fois. Toujours à rôder partout..." },
      { type: 'delay', ms: 500 },
      {
        type: 'showForm',
        formId: 'story4_peedy_q3',
        title: '🐦 Discuter avec Peedy',
        description: 'Choisis une question :',
        fields: [
          { key: 'q3', label: "Tu penses quoi du meurtrier ?", type: 'button' },
        ],
      },
    ],
    once: true,
  },

  {
    id: 'story4_peedy_a3',
    conditions: [
      { type: 'flag', flag: 'form_story4_peedy_q3_submitted', value: true },
    ],
    actions: [
      { type: 'agentPlay', character: 'peedy', animation: 'Surprised' },
      { type: 'agentSpeak', character: 'peedy', text: "Le meurtrier... ? Ça me fait flipper. D'abord Links, maintenant Rocky..." },
      { type: 'agentSpeak', character: 'peedy', text: "J'ai peur d'être le prochain. On est tous en danger ici." },
      { type: 'agentSpeak', character: 'peedy', text: "Si tu veux mon avis, fais attention à qui tu fais confiance. Tout le monde n'est pas ce qu'il semble être..." },
      { type: 'delay', ms: 1000 },

      { type: 'agentSpeak', character: 'peedy', text: "Merci d'avoir discuté avec moi ! Ça fait du bien de parler à quelqu'un de normal. 😊" },
      { type: 'agentPlay', character: 'peedy', animation: 'GoodBye' },
      { type: 'agentHide', character: 'peedy' },

      { type: 'setFlag', flag: 'story4_peedy_done', value: true },
    ],
    once: true,
  },

  {
    id: 'story4_einstein_terminal',
    conditions: [
      { type: 'flag', flag: 'story4_peedy_done', value: true },
    ],
    actions: [
      { type: 'delay', ms: 2000 },

      { type: 'agentShow', character: 'genius' },
      { type: 'agentPlay', character: 'genius', animation: 'Greet' },
      { type: 'agentSpeak', character: 'genius', text: "Re-bonjour ! C'est encore moi, Einstein." },
      { type: 'agentSpeak', character: 'genius', text: "Deux meurtres en si peu de temps... La sécurité de Pindows est compromise." },
      { type: 'agentSpeak', character: 'genius', text: "J'ai besoin d'un assistant pour m'aider à enquêter. Et cet assistant... c'est toi !" },
      { type: 'delay', ms: 1000 },

      { type: 'agentSpeak', character: 'genius', text: "Je vais te donner accès à un outil puissant : l'Invite de commandes." },
      { type: 'agentSpeak', character: 'genius', text: "Avec le terminal, tu peux inspecter le système de l'intérieur. Tape 'help' pour commencer." },
      { type: 'delay', ms: 500 },

      { type: 'unlockApp', app: 'terminal' },
      { type: 'openWindow', windowType: 'terminal' },

      { type: 'agentSpeak', character: 'genius', text: "Voilà ! Le terminal est à toi. Fouille bien, il y a sûrement des choses à découvrir..." },
      { type: 'agentSpeak', character: 'genius', text: "Je reste dans les parages. Bonne enquête, détective ! 🔍" },
      { type: 'agentPlay', character: 'genius', animation: 'GoodBye' },
      { type: 'agentHide', character: 'genius' },

      { type: 'setFlag', flag: 'story4_terminal_given', value: true },
    ],
    once: true,
  },

  {
    id: 'story4_bonzi_permissions',
    conditions: [
      { type: 'flag', flag: 'story4_terminal_given', value: true },
      { type: 'flag', flag: 'item_used_permissions_bonzi', value: true },
    ],
    actions: [
      { type: 'delay', ms: 2000 },

      { type: 'agentShow', character: 'genius' },
      { type: 'agentPlay', character: 'genius', animation: 'Surprised' },
      { type: 'agentSpeak', character: 'genius', text: "Attends... tu as vu ça ?!" },
      { type: 'agentSpeak', character: 'genius', text: "Bonzi a le rôle ADMIN ?! Comment c'est possible ?!" },
      { type: 'agentSpeak', character: 'genius', text: "Un admin a accès à TOUS les fichiers système... y compris les fichiers des autres agents." },
      { type: 'agentSpeak', character: 'genius', text: "C'est très suspect. Garde ça en tête pour la suite..." },
      { type: 'agentPlay', character: 'genius', animation: 'GoodBye' },
      { type: 'agentHide', character: 'genius' },

      { type: 'setFlag', flag: 'story4_complete', value: true },
    ],
    once: true,
  },
];
