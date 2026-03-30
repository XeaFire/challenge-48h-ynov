import type { StoryTrigger } from '../types';

// ---------------------------------------------------------------------------
// Story 2 — Dessine ton plat préféré ! → Meurtre de Links → Enquête
//
// After story1 completes:
//   1. Links proposes to draw your favorite dish on Paint
//   2. When Paint is opened → 6 sec later, mail notification arrives
//   3. Links slowly walks toward the mail icon, disappears on arrival
//   4. Mail icon shakes with blood splashing out
//   5. Merlin reacts, creepy mail appears
//   6. Characters arrive one by one — murder investigation
//   7. Bonzi gets accused
// ---------------------------------------------------------------------------

export const story2Triggers: StoryTrigger[] = [
  // ── Links proposes Paint quest ──
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

  // ── When Paint is opened → start the mail incident after 6 seconds ──
  {
    id: 'story2_paint_opened',
    conditions: [
      { type: 'flag', flag: 'story2_paint_quest_given', value: true },
      { type: 'flag', flag: 'opened_paint', value: true },
    ],
    actions: [
      { type: 'agentSpeak', character: 'merlin', text: 'Super ! Tu as ouvert Paint ! Dessine quelque chose de beau !' },
      { type: 'delay', ms: 6000 },
      {
        type: 'sendMail',
        from: 'system@pindows.fr',
        to: 'utilisateur@pindows.fr',
        subject: '⚠️ Alerte système : anomalie détectée',
        body: "ALERTE SYSTÈME\n\nUne anomalie a été détectée dans le module de messagerie.\nDes traces de peinture rouge ont été trouvées dans les fichiers système.\n\nVeuillez vérifier votre boîte de réception.\n\n— Pindows System Monitor",
      },
      { type: 'setFlag', flag: 'story2_mail_sent', value: true },
    ],
    once: true,
  },

  // ── Links notices the mail, walks toward it, disappears, blood, Merlin reacts ──
  {
    id: 'story2_links_goes_to_mail',
    conditions: [
      { type: 'flag', flag: 'story2_mail_sent', value: true },
    ],
    actions: [
      { type: 'agentSpeak', character: 'links', text: "Oh ? Un nouveau mail ? Je vais aller voir ça de plus près..." },
      // Links walks slowly toward mail icon (~5 seconds)
      { type: 'agentMoveTo', character: 'links', x: 40, y: 460, duration: 5000 },
      // Links vanishes instantly on arrival
      { type: 'agentHide', character: 'links', instant: true },
      { type: 'setCharacterStatus', character: 'links', status: 'dead' },
      // Blood effect starts NOW (after Links disappears)
      { type: 'shakeIcon', iconId: 'mail' },
      // Merlin reacts after a beat
      { type: 'delay', ms: 1500 },
      { type: 'agentPlay', character: 'merlin', animation: 'Surprised' },
      { type: 'agentSpeak', character: 'merlin', text: "Oh ! Links a encore dû faire tomber son seau de peinture rouge ! Il est vraiment maladroit celui-là ! 😅" },
      { type: 'delay', ms: 2000 },
      { type: 'stopShakeIcon' },
      { type: 'agentSpeak', character: 'merlin', text: "Links ?... Tu es là ?... LINKS ?!" },
      { type: 'delay', ms: 2000 },
      { type: 'agentSpeak', character: 'merlin', text: "Il... il ne répond pas..." },
      // Send the creepy death mail
      {
        type: 'sendMail',
        from: '???@̸̛̤̈́ṕ̵̰i̶̖̓n̷̰̈d̴̰̑o̷̟̊w̵̳̉s̸̗̈.̵̲̿f̸̖̀r̶̤̃',
        to: 'utilisateur@pindows.fr',
        subject: '💀 Il est mort.',
        body: "Links ne reviendra pas.\n\nIl est parti pour toujours.\nSon sang coule encore sur l'icône des mails.\n\nNe cherche pas à comprendre.\nNe ferme pas les yeux.\n\n... ou tu seras le prochain.\n\n\n█̵̢̛̦̰̹ ̸̣̳̰̣ ̷̘̯̯̰ ̶̙̻̩̝ ̵̳̝̰ ̸̙̻̩ ̷̝̳",
      },
      { type: 'setFlag', flag: 'story2_links_dead', value: true },
    ],
    once: true,
  },

  // ── Murder investigation: characters arrive one by one ──
  {
    id: 'story2_investigation',
    conditions: [
      { type: 'flag', flag: 'story2_links_dead', value: true },
    ],
    actions: [
      { type: 'delay', ms: 3000 },

      // Genie arrives first
      { type: 'agentShow', character: 'genie' },
      { type: 'agentSpeak', character: 'genie', text: "Qu'est-ce qui se passe ici ?! J'ai entendu un bruit terrible !" },
      { type: 'agentSpeak', character: 'merlin', text: "Genie ! Links a disparu... et il y a du sang sur l'icône des mails..." },
      { type: 'agentPlay', character: 'genie', animation: 'Surprised' },
      { type: 'agentSpeak', character: 'genie', text: "Du sang ?! Oh non..." },

      { type: 'delay', ms: 2000 },

      // Peedy arrives
      { type: 'agentShow', character: 'peedy' },
      { type: 'agentSpeak', character: 'peedy', text: "Moi aussi j'ai entendu ! C'est quoi tout ce rouge sur les mails ?!" },
      { type: 'agentSpeak', character: 'merlin', text: "On ne sait pas... Links est allé vérifier un mail et il a... disparu." },
      { type: 'agentSpeak', character: 'peedy', text: "Disparu ?! Comment ça disparu ?!" },

      { type: 'delay', ms: 2500 },

      // Bonzi arrives last
      { type: 'agentShow', character: 'bonzi' },
      { type: 'agentSpeak', character: 'bonzi', text: "Hey ! Qu'est-ce que j'ai raté ? Pourquoi tout le monde est réuni ?" },
      { type: 'delay', ms: 1000 },

      // The accusation builds
      { type: 'agentPlay', character: 'genie', animation: 'Surprised' },
      { type: 'agentSpeak', character: 'genie', text: "Attendez... c'est du SANG. Il y a eu un MEURTRE !" },
      { type: 'agentSpeak', character: 'peedy', text: "Un meurtre ?! C'est horrible ! Qui a pu faire une chose pareille ?!" },
      { type: 'agentSpeak', character: 'merlin', text: "Links était notre ami... Quelqu'un ici est responsable." },

      { type: 'delay', ms: 2000 },

      // Bonzi gets accused
      { type: 'agentSpeak', character: 'genie', text: "Réfléchissons... Bonzi est arrivé en DERNIER. C'est très suspect." },
      { type: 'agentSpeak', character: 'peedy', text: "Maintenant que tu le dis... Bonzi est TOUJOURS là quand il y a des problèmes !" },
      { type: 'agentSpeak', character: 'merlin', text: "Les preuves sont accablantes, Bonzi... Tu étais le seul absent quand c'est arrivé." },
      { type: 'agentPlay', character: 'bonzi', animation: 'Surprised' },
      { type: 'agentSpeak', character: 'bonzi', text: "QUOI ?! Mais je viens d'arriver ! J'ai RIEN fait !" },
      { type: 'agentSpeak', character: 'genie', text: "C'est exactement ce qu'un coupable dirait !" },
      { type: 'agentSpeak', character: 'peedy', text: "Avoue Bonzi ! Qu'est-ce que tu as fait à Links ?!" },
      { type: 'agentSpeak', character: 'bonzi', text: "Non non non ! Je suis INNOCENT ! Vous faites une terrible erreur !" },
      { type: 'agentSpeak', character: 'merlin', text: "Le procès aura lieu... En attendant, Bonzi, tu restes sous surveillance." },

      { type: 'delay', ms: 2000 },

      // Characters leave (except Bonzi who stays "under surveillance")
      { type: 'agentPlay', character: 'genie', animation: 'GoodBye' },
      { type: 'agentSpeak', character: 'genie', text: "Je reviendrai pour le procès. Justice sera rendue pour Links." },
      { type: 'agentHide', character: 'genie' },
      { type: 'delay', ms: 1000 },
      { type: 'agentPlay', character: 'peedy', animation: 'GoodBye' },
      { type: 'agentSpeak', character: 'peedy', text: "Pauvre Links... Je n'arrive pas à y croire." },
      { type: 'agentHide', character: 'peedy' },
      { type: 'delay', ms: 1000 },
      { type: 'agentSpeak', character: 'merlin', text: "Continue à explorer Pindows... mais fais attention. Un meurtrier rôde peut-être encore..." },
      { type: 'agentPlay', character: 'merlin', animation: 'GoodBye' },
      { type: 'agentHide', character: 'merlin' },
      { type: 'delay', ms: 500 },
      { type: 'agentSpeak', character: 'bonzi', text: "Je... je suis tout seul maintenant ? Hé ! Revenez ! Je suis innocent !" },
      { type: 'agentHide', character: 'bonzi' },

      { type: 'setFlag', flag: 'story2_bonzi_accused', value: true },
      { type: 'setFlag', flag: 'story2_complete', value: true },
    ],
    once: true,
  },
];
