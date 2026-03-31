import type { StoryTrigger } from '../types';

export const story1Triggers: StoryTrigger[] = [
  // ── Merlin appears after boot ──
  {
    id: 'story1_merlin_intro',
    conditions: [
      { type: 'flag', flag: 'boot_complete', value: true },
    ],
    actions: [
      { type: 'agentShow', character: 'merlin' },
      { type: 'agentPlay', character: 'merlin', animation: 'Greet' },
      { type: 'agentSpeak', character: 'merlin', text: 'Coucou ! 👋' },
      { type: 'agentSpeak', character: 'merlin', text: 'Bienvenue sur Pindows 98 ! Je suis ravi de te voir ici !' },
      { type: 'agentSpeak', character: 'merlin', text: "Je me présente : je suis Merlin, ton guide personnel sur Pindows. Je serai là pour t'accompagner dans tes aventures numériques !" },
      { type: 'agentSpeak', character: 'merlin', text: "Mais je ne suis pas tout seul... Laisse-moi te présenter quelqu'un !" },
      { type: 'setFlag', flag: 'story1_merlin_done', value: true },
    ],
    once: true,
  },

  // ── Links appears to the right of Merlin ──
  {
    id: 'story1_links_intro',
    conditions: [
      { type: 'flag', flag: 'story1_merlin_done', value: true },
    ],
    actions: [
      { type: 'agentShow', character: 'links' },
      { type: 'agentMoveTo', character: 'links', x: 250, y: 350, duration: 5000 },
      { type: 'agentPlay', character: 'links', animation: 'Greet' },
      { type: 'agentSpeak', character: 'links', text: 'Salut toi ! 🐱' },
      { type: 'agentSpeak', character: 'links', text: "Moi c'est Links ! Je suis l'assistant de la personnalisation. Tout ce qui est style, couleurs, déco... c'est mon rayon !" },
      { type: 'agentSpeak', character: 'links', text: "On va faire une petite session de présentation pour bien personnaliser ton environnement !" },
      { type: 'agentSpeak', character: 'links', text: "Remplis ce petit formulaire et on s'occupe du reste !" },
      {
        type: 'showForm',
        formId: 'story1_profile',
        title: '🐱 Personnalisation Pindows',
        description: 'Dis-nous en un peu plus sur toi pour personnaliser ton expérience !',
        fields: [
          { key: 'firstName', label: 'Prénom', placeholder: 'Ton prénom...' },
          { key: 'lastName', label: 'Nom', placeholder: 'Ton nom...' },
          { key: 'favoriteColor', label: 'Couleur préférée', type: 'color' },
          { key: 'favoriteDish', label: 'Plat préféré', placeholder: 'Ex: Pizza, Sushi...' },
        ],
        submitLabel: "C'est parti !",
      },
      { type: 'setFlag', flag: 'story1_form_shown', value: true },
    ],
    once: true,
  },

  // ── After form → congratulate + unlock Paint ──
  {
    id: 'story1_form_done',
    conditions: [
      { type: 'flag', flag: 'form_story1_profile_submitted', value: true },
    ],
    actions: [
      { type: 'agentPlay', character: 'merlin', animation: 'Congratulate' },
      { type: 'agentStopCurrent', character: 'merlin' },
      { type: 'agentSpeak', character: 'merlin', text: 'Parfait ! Enchanté de faire ta connaissance ! ✨' },
      { type: 'agentPlay', character: 'links', animation: 'Congratulate' },
      { type: 'agentStopCurrent', character: 'links' },
      { type: 'agentSpeak', character: 'links', text: "Super ! Maintenant que je te connais mieux, j'ai un petit cadeau pour toi..." },
      { type: 'agentSpeak', character: 'links', text: '🎨 Tu viens de débloquer Paint ! Tu pourras dessiner tout ce que tu veux !' },
      { type: 'unlockApp', app: 'paint' },
      { type: 'setFlag', flag: 'story1_complete', value: true },
    ],
    once: true,
  },
];
