import type { StoryTrigger } from '../types';

export const story5Triggers: StoryTrigger[] = [
  // ── Genie arrives and proposes his guessing game ──
  {
    id: 'story5_genie_game',
    conditions: [
      { type: 'flag', flag: 'story4_complete', value: true },
    ],
    actions: [
      { type: 'delay', ms: 3000 },

      { type: 'agentShow', character: 'genie' },
      { type: 'agentPlay', character: 'genie', animation: 'Greet' },
      { type: 'agentSpeak', character: 'genie', text: "Hé ho ! Assez enquêté pour aujourd'hui ! C'est l'heure de s'amuser un peu !" },
      { type: 'agentSpeak', character: 'genie', text: "Je suis le Génie de la lampe, et je te propose de jouer avec moi !" },
      { type: 'agentSpeak', character: 'genie', text: "J'ai un super jeu de devinettes sur mon site ! Vas sur devine-moi.fr dans Internet Explorer !" },
      { type: 'agentPlay', character: 'genie', animation: 'GetAttention' },
      { type: 'agentSpeak', character: 'genie', text: "Allez, ouvre Internet Explorer et tape devine-moi.fr ! Tu vas adorer !" },

      { type: 'setFlag', flag: 'story5_genie_waiting', value: true },
    ],
    once: true,
  },

  // ── User visits devine-moi.fr → 404 ──
  {
    id: 'story5_devinemoi_404',
    conditions: [
      { type: 'flag', flag: 'story5_genie_waiting', value: true },
      { type: 'flag', flag: 'visited_devine-moi.fr', value: true },
    ],
    actions: [
      { type: 'delay', ms: 1500 },

      { type: 'agentPlay', character: 'genie', animation: 'Surprised' },
      { type: 'agentSpeak', character: 'genie', text: "Ah mince... 404 ?! Le site ne marche plus ?!" },
      { type: 'agentSpeak', character: 'genie', text: "Ah oui c'est vrai... j'avais oublié, le site est en maintenance..." },
      { type: 'agentSpeak', character: 'genie', text: "C'est Peedy qui s'occupe de la maintenance du site, moi j'y connais RIEN en informatique !" },
      { type: 'agentSpeak', character: 'genie', text: "J'ai demandé à Peedy de le remettre en ligne mais bon... il a pas l'air très motivé." },
      { type: 'delay', ms: 1000 },

      { type: 'agentSpeak', character: 'genie', text: "Bon bah tant pis ! On va jouer avec autre chose..." },
      { type: 'agentPlay', character: 'genie', animation: 'GetAttention' },
      { type: 'agentSpeak', character: 'genie', text: "Et si on jouait avec la Calculatrice ? J'adore les chiffres !" },
      { type: 'agentSpeak', character: 'genie', text: "Allez, ouvre la Calculatrice, on va rigoler !" },

      { type: 'setFlag', flag: 'story5_calculator_proposed', value: true },
    ],
    once: true,
  },

  // ── User opens calculator → Rover arrives with bonzai page ──
  {
    id: 'story5_calculator_opened',
    conditions: [
      { type: 'flag', flag: 'story5_calculator_proposed', value: true },
      { type: 'flag', flag: 'opened_calculator', value: true },
    ],
    actions: [
      // Lock calculator and IE so they can't be closed
      { type: 'lockWindow', windowType: 'calculator' },
      { type: 'lockWindow', windowType: 'ie' },

      { type: 'agentPlay', character: 'genie', animation: 'Greet' },
      { type: 'agentSpeak', character: 'genie', text: "Super ! La Calculatrice ! Mon outil préféré !" },
      { type: 'agentSpeak', character: 'genie', text: "Tu savais que si tu tapes 7 x 9 + 4 - 1 ça fait... euh..." },
      { type: 'agentSpeak', character: 'genie', text: "...bon en vrai je suis nul en maths aussi. Je suis un Génie de la LAMPE, pas des maths !" },
      { type: 'delay', ms: 1000 },

      // Rover arrives from bottom-right
      { type: 'agentShow', character: 'rover' },
      { type: 'agentMoveTo', character: 'rover', x: 900, y: 600, duration: 0 },
      { type: 'agentMoveTo', character: 'rover', x: 600, y: 350, duration: 3000 },

      { type: 'agentSpeak', character: 'rover', text: "Arf ! Arf arf !" },
      { type: 'agentPlay', character: 'genie', animation: 'Surprised' },
      { type: 'agentSpeak', character: 'genie', text: "Oh ! Rover ! Qu'est-ce que tu as trouvé là ?" },
      { type: 'delay', ms: 500 },

      // Open IE with bonzai page
      { type: 'setFlag', flag: 'story5_bonzai_page', value: true },
      { type: 'openWindow', windowType: 'ie' },
      { type: 'delay', ms: 1500 },

      { type: 'agentSpeak', character: 'genie', text: "maison.bonzai.local ?! C'est la page d'accès de la maison de Bonzi !" },
      { type: 'agentSpeak', character: 'genie', text: "Rover ! C'est pas bien de vouloir s'introduire chez les gens !" },
      { type: 'agentSpeak', character: 'rover', text: "... *baisse les oreilles* ..." },
      { type: 'delay', ms: 1000 },

      { type: 'agentSpeak', character: 'genie', text: "De toute façon, il y a un code à 4 chiffres et on ne peut même pas taper dedans." },
      { type: 'agentSpeak', character: 'genie', text: "C'est impossible de rentrer. Ça ne sert à rien d'essayer !" },
      { type: 'delay', ms: 500 },

      { type: 'agentPlay', character: 'rover', animation: 'GoodBye' },
      { type: 'agentHide', character: 'rover' },
      { type: 'agentSpeak', character: 'genie', text: "Bon... je vais quand même rester un peu pour surveiller tout ça." },

      { type: 'setFlag', flag: 'story5_bonzai_puzzle', value: true },
    ],
    once: true,
  },

  // ── User cracks the code (4751) by dragging calculator digits ──
  {
    id: 'story5_bonzai_cracked',
    conditions: [
      { type: 'flag', flag: 'story5_bonzai_puzzle', value: true },
      { type: 'flag', flag: 'item_bonzai_code_cracked', value: true },
    ],
    actions: [
      { type: 'unlockWindow', windowType: 'calculator' },
      { type: 'unlockWindow', windowType: 'ie' },

      { type: 'agentPlay', character: 'genie', animation: 'Surprised' },
      { type: 'agentSpeak', character: 'genie', text: "QUOI ?! Tu as réussi à entrer le code ?! Comment t'as fait ?!" },
      { type: 'agentSpeak', character: 'genie', text: "Attends... tu as glissé les chiffres depuis la Calculatrice ?! C'est... BRILLANT !" },
      { type: 'agentSpeak', character: 'genie', text: "Ou alors très inquiétant. On vient de s'introduire chez Bonzi..." },
      { type: 'delay', ms: 3000 },

      // Genie reacts to the personal content
      { type: 'agentSpeak', character: 'genie', text: "Oh là là... c'est sa page perso. On voit toute sa vie là..." },
      { type: 'agentSpeak', character: 'genie', text: "Il veut devenir comédien ? Et il prépare un stand-up ?!" },
      { type: 'delay', ms: 1500 },
      { type: 'agentSpeak', character: 'genie', text: "Hmm... c'est quand même des infos privées tout ça. Je suis pas sûr qu'on devrait voir ça..." },
      { type: 'agentSpeak', character: 'genie', text: "Son journal intime, ses rêves... c'est un peu gênant pour lui." },
      { type: 'delay', ms: 1000 },
      { type: 'agentSpeak', character: 'genie', text: "Bon... on a vu ce qu'on avait à voir. On devrait peut-être refermer cette page." },
      { type: 'agentPlay', character: 'genie', animation: 'GoodBye' },
      { type: 'agentHide', character: 'genie' },

      { type: 'setFlag', flag: 'story5_complete', value: true },
    ],
    once: true,
  },
];
