import type { StoryTrigger } from './types';

export const STORY_TRIGGERS: StoryTrigger[] = [
  {
    id: 'merlin_intro',
    conditions: [
      { type: 'flag', flag: 'boot_complete', value: true },
    ],
    actions: [
      { type: 'agentShow', character: 'merlin' },
      { type: 'agentPlay', character: 'merlin', animation: 'Greet' },
      { type: 'agentSpeak', character: 'merlin', text: "Bienvenue sur Pindows 98 ! Je suis Merlin, l'administrateur systeme." },
      { type: 'agentSpeak', character: 'merlin', text: "Ici c'est chez nous. Tout va bien... enfin, pour l'instant." },
    ],
    once: true,
  },
];
