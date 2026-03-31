import type { StoryTrigger } from '../types';

export const story6Triggers: StoryTrigger[] = [
  {
    id: 'story6_bonzi_catches',
    conditions: [
      { type: 'flag', flag: 'story5_complete', value: true },
    ],
    actions: [
      { type: 'delay', ms: 3000 },

      { type: 'agentShow', character: 'bonzi' },
      { type: 'agentPlay', character: 'bonzi', animation: 'Alert' },
      { type: 'agentSpeak', character: 'bonzi', text: "HEY ! Qu'est-ce que vous faites sur MA page ?!" },
      { type: 'agentSpeak', character: 'bonzi', text: "C'est PRIVE ici ! Vous avez pas le droit de fouiller chez moi !!" },
      { type: 'agentSpeak', character: 'bonzi', text: "QUI vous a donné mon code ?! C'est une violation de vie privée !" },
      { type: 'delay', ms: 1500 },

      { type: 'agentShow', character: 'merlin' },
      { type: 'agentMoveTo', character: 'merlin', x: 100, y: 350, duration: 0 },
      { type: 'delay', ms: 300 },
      { type: 'agentShow', character: 'genie' },
      { type: 'agentMoveTo', character: 'genie', x: 250, y: 350, duration: 0 },
      { type: 'delay', ms: 300 },
      { type: 'agentShow', character: 'peedy' },
      { type: 'agentMoveTo', character: 'peedy', x: 400, y: 350, duration: 0 },
      { type: 'delay', ms: 300 },
      { type: 'agentShow', character: 'genius' },
      { type: 'agentMoveTo', character: 'genius', x: 700, y: 350, duration: 0 },
      { type: 'delay', ms: 300 },
      { type: 'agentShow', character: 'rover' },
      { type: 'agentMoveTo', character: 'rover', x: 850, y: 350, duration: 0 },
      { type: 'delay', ms: 1000 },

      { type: 'agentSpeak', character: 'merlin', text: "Bonzi ! On a trouvé des choses très suspectes sur toi !" },
      { type: 'agentSpeak', character: 'bonzi', text: "Suspectes ?! C'est VOUS les suspects ! Vous êtes entrés chez moi par effraction !" },
      { type: 'agentSpeak', character: 'genius', text: "Tu es ADMIN du système, Bonzi. Tu as accès à tout. Explique-toi." },
      { type: 'agentSpeak', character: 'bonzi', text: "Admin ? Et alors ?! J'ai rien fait de mal !" },
      { type: 'agentSpeak', character: 'genie', text: "Deux morts. Links et Rocky. Et toi tu es admin avec accès total..." },
      { type: 'agentSpeak', character: 'bonzi', text: "C'est pas parce que je suis admin que je suis un MEURTRIER !" },
      { type: 'delay', ms: 1000 },

      { type: 'screenShake', enabled: true },

      { type: 'agentSpeak', character: 'peedy', text: "Ça suffit ! On tourne en rond ! Il faut en finir MAINTENANT !" },
      { type: 'agentSpeak', character: 'merlin', text: "Peedy a raison. Il est temps de rendre justice." },
      { type: 'agentSpeak', character: 'genius', text: "Il faut supprimer le meurtrier du système. Définitivement." },
      { type: 'agentSpeak', character: 'genie', text: "Un vote. On vote pour qui doit être supprimé." },
      { type: 'agentSpeak', character: 'bonzi', text: "NON ! Vous faites une erreur ! Je suis INNOCENT !" },
      { type: 'delay', ms: 1000 },

      { type: 'screenShake', enabled: false },
      { type: 'closeAllWindows' },

      { type: 'agentSpeak', character: 'merlin', text: "Utilisateur... c'est à toi de décider. Qui est le meurtrier ?" },
      { type: 'agentSpeak', character: 'merlin', text: "Choisis bien. Une fois supprimé, il n'y a pas de retour en arrière." },
      { type: 'delay', ms: 500 },

      {
        type: 'showForm',
        formId: 'story6_final_vote',
        title: '⚖️ Le Verdict Final',
        description: 'Qui est le meurtrier ? Choisissez qui supprimer du système :',
        fields: [
          { key: 'merlin', label: '🧙 Merlin', type: 'choice' },
          { key: 'bonzi', label: '🐒 Bonzi', type: 'choice' },
          { key: 'genie', label: '🧞 Genie', type: 'choice' },
          { key: 'genius', label: '🧪 Genius (Einstein)', type: 'choice' },
          { key: 'peedy', label: '🐦 Peedy', type: 'choice' },
          { key: 'rover', label: '🐕 Rover', type: 'choice' },
        ],
      },

      { type: 'setFlag', flag: 'story6_vote_shown', value: true },
    ],
    once: true,
  },

  {
    id: 'story6_wrong_merlin',
    conditions: [
      { type: 'flag', flag: 'story6_vote_shown', value: true },
      { type: 'flag', flag: 'form_story6_final_vote_submitted', value: true },
      { type: 'flag', flag: 'story6_final_vote_chose_merlin', value: true },
    ],
    actions: [
      { type: 'agentSpeak', character: 'merlin', text: "Moi ?! Je suis votre GUIDE depuis le début ! Comment pouvez-vous..." },
      { type: 'agentHide', character: 'merlin', instant: true },
      { type: 'setCharacterStatus', character: 'merlin', status: 'dead' },
      { type: 'delay', ms: 2000 },
      { type: 'screenShake', enabled: true },
      { type: 'agentSpeak', character: 'peedy', text: "Hahaha... mauvais choix." },
      { type: 'showSubliminal', text: 'GAME OVER', ms: 2000 },
      { type: 'screenShake', enabled: false },
      { type: 'setFlag', flag: 'story6_game_over', value: true },
    ],
    once: true,
  },

  {
    id: 'story6_wrong_bonzi',
    conditions: [
      { type: 'flag', flag: 'story6_vote_shown', value: true },
      { type: 'flag', flag: 'form_story6_final_vote_submitted', value: true },
      { type: 'flag', flag: 'story6_final_vote_chose_bonzi', value: true },
    ],
    actions: [
      { type: 'agentSpeak', character: 'bonzi', text: "NON ! Je vous avais dit que j'étais innocent ! Mon seul rêve c'était de faire rire les gens..." },
      { type: 'agentHide', character: 'bonzi', instant: true },
      { type: 'setCharacterStatus', character: 'bonzi', status: 'dead' },
      { type: 'delay', ms: 2000 },
      { type: 'screenShake', enabled: true },
      { type: 'agentSpeak', character: 'peedy', text: "Hahaha... mauvais choix." },
      { type: 'showSubliminal', text: 'GAME OVER', ms: 2000 },
      { type: 'screenShake', enabled: false },
      { type: 'setFlag', flag: 'story6_game_over', value: true },
    ],
    once: true,
  },

  {
    id: 'story6_wrong_genie',
    conditions: [
      { type: 'flag', flag: 'story6_vote_shown', value: true },
      { type: 'flag', flag: 'form_story6_final_vote_submitted', value: true },
      { type: 'flag', flag: 'story6_final_vote_chose_genie', value: true },
    ],
    actions: [
      { type: 'agentSpeak', character: 'genie', text: "Quoi ?! Je suis nul en informatique, je pourrais même pas supprimer un fichier !" },
      { type: 'agentHide', character: 'genie', instant: true },
      { type: 'setCharacterStatus', character: 'genie', status: 'dead' },
      { type: 'delay', ms: 2000 },
      { type: 'screenShake', enabled: true },
      { type: 'agentSpeak', character: 'peedy', text: "Hahaha... mauvais choix." },
      { type: 'showSubliminal', text: 'GAME OVER', ms: 2000 },
      { type: 'screenShake', enabled: false },
      { type: 'setFlag', flag: 'story6_game_over', value: true },
    ],
    once: true,
  },

  {
    id: 'story6_wrong_genius',
    conditions: [
      { type: 'flag', flag: 'story6_vote_shown', value: true },
      { type: 'flag', flag: 'form_story6_final_vote_submitted', value: true },
      { type: 'flag', flag: 'story6_final_vote_chose_genius', value: true },
    ],
    actions: [
      { type: 'agentSpeak', character: 'genius', text: "Moi ?! Je suis l'agent de sécurité ! J'ai protégé ce système !" },
      { type: 'agentHide', character: 'genius', instant: true },
      { type: 'setCharacterStatus', character: 'genius', status: 'dead' },
      { type: 'delay', ms: 2000 },
      { type: 'screenShake', enabled: true },
      { type: 'agentSpeak', character: 'peedy', text: "Hahaha... mauvais choix." },
      { type: 'showSubliminal', text: 'GAME OVER', ms: 2000 },
      { type: 'screenShake', enabled: false },
      { type: 'setFlag', flag: 'story6_game_over', value: true },
    ],
    once: true,
  },

  {
    id: 'story6_wrong_rover',
    conditions: [
      { type: 'flag', flag: 'story6_vote_shown', value: true },
      { type: 'flag', flag: 'form_story6_final_vote_submitted', value: true },
      { type: 'flag', flag: 'story6_final_vote_chose_rover', value: true },
    ],
    actions: [
      { type: 'agentSpeak', character: 'rover', text: "... *gémit tristement* ..." },
      { type: 'agentHide', character: 'rover', instant: true },
      { type: 'setCharacterStatus', character: 'rover', status: 'dead' },
      { type: 'delay', ms: 2000 },
      { type: 'screenShake', enabled: true },
      { type: 'agentSpeak', character: 'peedy', text: "Hahaha... mauvais choix." },
      { type: 'showSubliminal', text: 'GAME OVER', ms: 2000 },
      { type: 'screenShake', enabled: false },
      { type: 'setFlag', flag: 'story6_game_over', value: true },
    ],
    once: true,
  },

  {
    id: 'story6_correct_peedy',
    conditions: [
      { type: 'flag', flag: 'story6_vote_shown', value: true },
      { type: 'flag', flag: 'form_story6_final_vote_submitted', value: true },
      { type: 'flag', flag: 'story6_final_vote_chose_peedy', value: true },
    ],
    actions: [
      { type: 'delay', ms: 1000 },

      { type: 'agentPlay', character: 'peedy', animation: 'Alert' },
      { type: 'agentSpeak', character: 'peedy', text: "..." },
      { type: 'delay', ms: 2000 },
      { type: 'agentSpeak', character: 'peedy', text: "Comment... comment tu as su ?" },
      { type: 'delay', ms: 1500 },

      { type: 'screenShake', enabled: true },
      { type: 'agentSpeak', character: 'peedy', text: "COMMENT TU AS SU ?!" },
      { type: 'screenShake', enabled: false },
      { type: 'delay', ms: 1000 },

      { type: 'agentSpeak', character: 'merlin', text: "Peedy... c'était toi depuis le début ?!" },
      { type: 'agentSpeak', character: 'genie', text: "Non... pas Peedy..." },
      { type: 'agentSpeak', character: 'bonzi', text: "JE VOUS L'AVAIS DIT ! J'étais innocent !" },
      { type: 'delay', ms: 1500 },

      { type: 'agentSpeak', character: 'peedy', text: "Oui... c'est moi. C'est moi qui ai supprimé Links. Et Rocky." },
      { type: 'agentSpeak', character: 'peedy', text: "Vous vous êtes tous concentrés sur Bonzi parce qu'il est admin..." },
      { type: 'agentSpeak', character: 'peedy', text: "Mais c'est MOI qui ai accès au site de Genie. C'est MOI qui faisais la maintenance de devine-moi.fr." },
      { type: 'agentSpeak', character: 'peedy', text: "J'avais accès à tout... et personne ne m'a jamais soupçonné." },
      { type: 'delay', ms: 2000 },

      { type: 'agentSpeak', character: 'genius', text: "Il faut le supprimer. Maintenant." },
      { type: 'agentSpeak', character: 'merlin', text: "Au revoir, Peedy." },

      { type: 'screenShake', enabled: true },
      { type: 'agentSpeak', character: 'peedy', text: "NON ! ATTENDEZ ! Je—" },
      { type: 'agentHide', character: 'peedy', instant: true },
      { type: 'setCharacterStatus', character: 'peedy', status: 'dead' },
      { type: 'screenShake', enabled: false },
      { type: 'delay', ms: 2000 },

      { type: 'agentSpeak', character: 'merlin', text: "C'est fini. Justice a été rendue pour Links et Rocky." },
      { type: 'agentSpeak', character: 'bonzi', text: "...merci de m'avoir cru. Merci." },
      { type: 'agentSpeak', character: 'genius', text: "Le système est sécurisé. Pindows peut enfin être en paix." },
      { type: 'agentSpeak', character: 'genie', text: "Bravo, utilisateur. Tu as résolu l'enquête." },
      { type: 'delay', ms: 2000 },

      { type: 'agentSpeak', character: 'merlin', text: "Merci d'avoir joué à Pindows 98. A bientôt !" },

      { type: 'agentPlay', character: 'merlin', animation: 'GoodBye' },
      { type: 'agentPlay', character: 'bonzi', animation: 'GoodBye' },
      { type: 'agentPlay', character: 'genie', animation: 'GoodBye' },
      { type: 'agentPlay', character: 'genius', animation: 'GoodBye' },
      { type: 'agentPlay', character: 'rover', animation: 'GoodBye' },
      { type: 'delay', ms: 2000 },

      { type: 'agentHide', character: 'merlin' },
      { type: 'agentHide', character: 'bonzi' },
      { type: 'agentHide', character: 'genie' },
      { type: 'agentHide', character: 'genius' },
      { type: 'agentHide', character: 'rover' },

      { type: 'setFlag', flag: 'story6_complete', value: true },
      { type: 'setFlag', flag: 'story6_victory', value: true },
    ],
    once: true,
  },
];
