import type { StoryTrigger } from '../types';

export const story2Triggers: StoryTrigger[] = [
  {
    id: 'story2_links_paint_quest',
    conditions: [
      { type: 'flag', flag: 'story1_complete', value: true },
    ],
    actions: [
      { type: 'agentSpeak', character: 'links', text: "Maintenant que tout est configuré, j'ai un petit défi pour toi ! 🎨" },
      { type: 'agentSpeak', character: 'links', text: "Ouvre Paint et dessine ton plat préféré ! Montre-nous tes talents d'artiste !" },
      { type: 'agentPlay', character: 'merlin', animation: 'Writing' },
      { type: 'agentSpeak', character: 'merlin', text: "Oui ! Vas-y, ouvre Paint et laisse parler ta créativité !" },
      { type: 'setFlag', flag: 'story2_paint_quest_given', value: true },
    ],
    once: true,
  },

  {
    id: 'story2_paint_opened',
    conditions: [
      { type: 'flag', flag: 'story2_paint_quest_given', value: true },
      { type: 'flag', flag: 'opened_paint', value: true },
    ],
    actions: [
      { type: 'agentMoveTo', character: 'merlin', x: 50, y: 300, duration: 1500 },
      { type: 'agentMoveTo', character: 'links', x: 750, y: 300, duration: 1500 },
      { type: 'agentSpeak', character: 'merlin', text: 'Super ! Tu as ouvert Paint ! Dessine quelque chose de beau !' },
      { type: 'delay', ms: 6000 },
      {
        type: 'sendMail',
        from: 'system@pindows.fr',
        to: 'utilisateur@pindows.fr',
        subject: '⚠️ Alerte système : anomalie détectée',
        body: "ALERTE SYSTÈME\n\nUne anomalie a été détectée dans le module de messagerie.\nDes traces de peinture rouge ont été trouvées dans les fichiers système.\n\nVeuillez vérifier votre boîte de réception.\n\n— Pindows System Monitor",
      },
      { type: 'unlockApp', app: 'mail' },
      { type: 'setFlag', flag: 'story2_mail_sent', value: true },
    ],
    once: true,
  },

  {
    id: 'story2_links_goes_to_mail',
    conditions: [
      { type: 'flag', flag: 'story2_mail_sent', value: true },
    ],
    actions: [
      { type: 'disableApp', app: 'mail' },
      { type: 'agentSpeak', character: 'links', text: "Oh ? Un nouveau mail ? Je vais aller voir ça de plus près..." },
      { type: 'agentMoveTo', character: 'links', x: 40, y: 460, duration: 8000 },
      { type: 'agentPlay', character: 'links', animation: 'IdleLegLick' },
      { type: 'delay', ms: 800 },
      { type: 'agentHide', character: 'links', instant: true },
      { type: 'setCharacterStatus', character: 'links', status: 'dead' },
      { type: 'delay', ms: 1000 },
      { type: 'shakeIcon', iconId: 'mail' },
      { type: 'delay', ms: 1500 },

      { type: 'agentSpeak', character: 'merlin', text: "Oh ! Links a encore dû renverser un pot de peinture ! Il est tellement maladroit celui-là ! 😅" },
      { type: 'delay', ms: 2000 },
      { type: 'stopShakeIcon' },
      { type: 'agentSpeak', character: 'merlin', text: "Links ? Hé ho ? Tu reviens ? On t'attend nous !" },
      { type: 'delay', ms: 2000 },
      { type: 'agentSpeak', character: 'merlin', text: "Bah... Il doit être parti aux toilettes. Il va revenir, t'inquiète !" },

      {
        type: 'sendMail',
        from: '???@̸̛̤̈́ṕ̵̰i̶̖̓n̷̰̈d̴̰̑o̷̟̊w̵̳̉s̸̗̈.̵̲̿f̸̖̀r̶̤̃',
        to: 'utilisateur@pindows.fr',
        subject: '💀 Il est mort.',
        body: "Links ne reviendra pas.\n\nIl est parti pour toujours.\nSon sang coule encore sur l'icône des mails.\n\nNe cherche pas à comprendre.\nNe ferme pas les yeux.\n\n... ou tu seras le prochain.\n\n\n{{GLITCH:faurnite.battlepass.com}}",
      },
      { type: 'setFlag', flag: 'story2_links_dead', value: true },
    ],
    once: true,
  },

  {
    id: 'story2_investigation',
    conditions: [
      { type: 'flag', flag: 'story2_links_dead', value: true },
    ],
    actions: [
      { type: 'delay', ms: 3000 },

      { type: 'agentShow', character: 'genie' },
      { type: 'agentMoveTo', character: 'genie', x: 200, y: 350, duration: 0 },
      { type: 'agentPlay', character: 'genie', animation: 'Greet' },
      { type: 'agentSpeak', character: 'genie', text: "C'est quoi ce bordel ?! Y'a du rouge PARTOUT sur les mails !" },
      { type: 'delay', ms: 400 },
      { type: 'agentSpeak', character: 'merlin', text: "T'inquiète, Links a juste renversé de la peinture !" },
      { type: 'delay', ms: 400 },
      { type: 'agentSpeak', character: 'genie', text: "Merlin... c'est PAS de la peinture. C'est du SANG." },
      { type: 'delay', ms: 400 },
      { type: 'agentSpeak', character: 'merlin', text: "Mais non ! Links fait toujours des bêtises comme ça !" },

      { type: 'delay', ms: 1500 },

      { type: 'agentShow', character: 'peedy' },
      { type: 'agentMoveTo', character: 'peedy', x: 350, y: 350, duration: 0 },
      { type: 'agentPlay', character: 'peedy', animation: 'Greet' },
      { type: 'agentSpeak', character: 'peedy', text: "Oh non... c'est quoi tout ce rouge ?!" },
      { type: 'delay', ms: 400 },
      { type: 'agentSpeak', character: 'merlin', text: "Il est parti vérifier un mail. Sûrement en pause café !" },
      { type: 'delay', ms: 400 },
      { type: 'agentSpeak', character: 'genie', text: "MERLIN. Y'A DU SANG. C'EST PAS DU CAFÉ." },

      { type: 'delay', ms: 1500 },

      { type: 'agentShow', character: 'bonzi' },
      { type: 'agentMoveTo', character: 'bonzi', x: 500, y: 350, duration: 0 },
      { type: 'agentPlay', character: 'bonzi', animation: 'Greet' },
      { type: 'agentSpeak', character: 'bonzi', text: "Salut tout le monde ! J'ai raté un truc ?" },
      { type: 'delay', ms: 800 },

      { type: 'agentSpeak', character: 'genie', text: "Links disparaît, y'a du sang, et Bonzi arrive APRÈS ?!" },
      { type: 'delay', ms: 400 },
      { type: 'agentSpeak', character: 'peedy', text: "Bonzi est TOUJOURS le dernier quand y'a un problème." },
      { type: 'delay', ms: 500 },
      { type: 'agentSpeak', character: 'merlin', text: "... Ah. Ooooh. C'est pas de la peinture alors ?" },
      { type: 'delay', ms: 400 },
      { type: 'agentSpeak', character: 'genie', text: "NON." },

      { type: 'delay', ms: 1000 },

      { type: 'agentPlay', character: 'bonzi', animation: 'Surprised' },
      { type: 'agentStopCurrent', character: 'bonzi' },
      { type: 'agentSpeak', character: 'bonzi', text: "Hé ho ! Pourquoi vous me regardez tous comme ça ?!" },
      { type: 'delay', ms: 400 },
      { type: 'agentSpeak', character: 'genie', text: "T'étais OÙ Bonzi ? Pendant que Links se faisait buter ?!" },
      { type: 'delay', ms: 400 },
      { type: 'agentSpeak', character: 'bonzi', text: "J'étais dans mes fichiers ! Je téléchargeais des trucs !" },
      { type: 'delay', ms: 400 },
      { type: 'agentSpeak', character: 'peedy', text: "C'est exactement ce qu'un meurtrier dirait." },
      { type: 'delay', ms: 400 },
      { type: 'agentSpeak', character: 'bonzi', text: "QUOI ?! Mais j'ai RIEN fait !!" },
      { type: 'delay', ms: 400 },
      { type: 'agentSpeak', character: 'genie', text: "On surveille Bonzi. Et on enquête." },
      { type: 'delay', ms: 400 },
      { type: 'agentSpeak', character: 'bonzi', text: "MAIS C'EST PAS MOI !!!" },

      { type: 'delay', ms: 1500 },

      { type: 'delay', ms: 1500 },

      { type: 'agentPlay', character: 'genie', animation: 'GoodBye' },
      { type: 'agentSpeak', character: 'genie', text: "Je vais fouiller le système. Y'a forcément des traces." },
      { type: 'agentSpeak', character: 'genie', text: "Toi aussi **{firstName}**, fouille de ton côté. Y'a sûrement des indices quelque part. Je compte sur toi." },
      { type: 'agentHide', character: 'genie' },
      { type: 'delay', ms: 800 },
      { type: 'agentPlay', character: 'peedy', animation: 'GoodBye' },
      { type: 'agentSpeak', character: 'peedy', text: "Pauvre Links..." },
      { type: 'agentHide', character: 'peedy' },
      { type: 'delay', ms: 800 },
      { type: 'agentSpeak', character: 'merlin', text: "Je vais aller m'allonger... je me sens pas bien." },
      { type: 'agentPlay', character: 'merlin', animation: 'GoodBye' },
      { type: 'agentHide', character: 'merlin' },
      { type: 'delay', ms: 500 },
      { type: 'agentSpeak', character: 'bonzi', text: "... C'EST PAS MOI BORDEL !" },
      { type: 'agentHide', character: 'bonzi' },

      { type: 'unlockApp', app: 'paint' },
      { type: 'unlockApp', app: 'ie' },
      { type: 'enableApp', app: 'mail' },

      { type: 'setFlag', flag: 'story2_bonzi_accused', value: true },
      { type: 'setFlag', flag: 'story2_complete', value: true },
    ],
    once: true,
  },

  {
    id: 'story2_mail_opened_clean_blood',
    conditions: [
      { type: 'flag', flag: 'item_mail_after_story2', value: true },
    ],
    actions: [
      { type: 'stopBleeding' },
    ],
    once: true,
  },
];
