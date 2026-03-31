import type { GameState, CharacterId, CharacterState } from './types';

const ALL_CHARACTERS: CharacterId[] = [
  'merlin', 'links', 'bonzi', 'clippy',
  'genie', 'genius', 'peedy', 'rocky', 'rover',
];

export function createInitialState(): GameState {
  const characters = {} as Record<CharacterId, CharacterState>;
  for (const id of ALL_CHARACTERS) {
    characters[id] = { id, status: 'hidden' };
  }
  const unlockedApps: string[] = ['mycomputer', 'notepad', 'recyclebin', 'calculator', 'explorer', 'mail', 'minesweeper', 'solitaire'];
  return { characters, flags: {}, unlockedApps, profile: {}, activeForm: null, shakingIcon: null, bleedingIcon: null, notification: null, lockedApps: [], screenShake: false, subliminalText: null, windowsLocked: false, lockedWindows: [] };
}
export interface DebugPreset {
  label: string;
  flags: Record<string, boolean>;
  firedTriggers: string[];
  unlockedApps?: string[];
  deadCharacters?: CharacterId[];
}

const ALL_APPS = ['mycomputer', 'notepad', 'recyclebin', 'calculator', 'explorer', 'mail', 'paint', 'ie', 'minesweeper', 'solitaire'];

export const DEBUG_PRESETS: Record<string, DebugPreset> = {
  story1: {
    label: 'Story 1 — Introduction',
    flags: { boot_complete: true },
    firedTriggers: [],
  },
  story2: {
    label: 'Story 2 — Meurtre de Links',
    flags: {
      boot_complete: true,
      story1_merlin_done: true, story1_form_shown: true,
      form_story1_profile_submitted: true, story1_complete: true,
    },
    firedTriggers: ['story1_merlin_intro', 'story1_links_intro', 'story1_form_done'],
    unlockedApps: ALL_APPS,
  },
  story3: {
    label: 'Story 3 — Virus Faurnite',
    flags: {
      boot_complete: true,
      story1_merlin_done: true, story1_form_shown: true,
      form_story1_profile_submitted: true, story1_complete: true,
      story2_paint_quest_given: true, opened_paint: true,
      story2_mail_sent: true, story2_links_dead: true,
      story2_bonzi_accused: true, story2_complete: true,
    },
    firedTriggers: [
      'story1_merlin_intro', 'story1_links_intro', 'story1_form_done',
      'story2_links_paint_quest', 'story2_paint_opened',
      'story2_links_goes_to_mail', 'story2_investigation',
    ],
    unlockedApps: ALL_APPS,
    deadCharacters: ['links'],
  },
  story4: {
    label: 'Story 4 — Cache-cache',
    flags: {
      boot_complete: true,
      story1_merlin_done: true, story1_form_shown: true,
      form_story1_profile_submitted: true, story1_complete: true,
      story2_paint_quest_given: true, opened_paint: true,
      story2_mail_sent: true, story2_links_dead: true,
      story2_bonzi_accused: true, story2_complete: true,
      'visited_faurnite.battlepass.com': true,
      story3_faurnite_spam: false, story3_virus_done: true,
      story3_avost_page: false, story3_cleanup_done: true, story3_complete: true,
    },
    firedTriggers: [
      'story1_merlin_intro', 'story1_links_intro', 'story1_form_done',
      'story2_links_paint_quest', 'story2_paint_opened',
      'story2_links_goes_to_mail', 'story2_investigation',
      'story3_faurnite_virus', 'story3_genius_cleanup',
    ],
    unlockedApps: ALL_APPS,
    deadCharacters: ['links'],
  },
  story4_cadavre: {
    label: 'Story 4 — Cadavre Rocky (tous trouvés)',
    flags: {
      boot_complete: true,
      story1_merlin_done: true, story1_form_shown: true,
      form_story1_profile_submitted: true, story1_complete: true,
      story2_paint_quest_given: true, opened_paint: true,
      story2_mail_sent: true, story2_links_dead: true,
      story2_bonzi_accused: true, story2_complete: true,
      'visited_faurnite.battlepass.com': true,
      story3_faurnite_spam: false, story3_virus_done: true,
      story3_avost_page: false, story3_cleanup_done: true, story3_complete: true,
      story4_hiding: true,
      item_found_merlin: true, item_found_genie: true,
      item_found_peedy: true, item_found_bonzi: true,
      item_found_genius: true, item_found_rover: true,
    },
    firedTriggers: [
      'story1_merlin_intro', 'story1_links_intro', 'story1_form_done',
      'story2_links_paint_quest', 'story2_paint_opened',
      'story2_links_goes_to_mail', 'story2_investigation',
      'story3_faurnite_virus', 'story3_genius_cleanup',
      'story4_hide_and_seek',
      'story4_found_merlin', 'story4_found_genie', 'story4_found_peedy',
      'story4_found_bonzi', 'story4_found_genius', 'story4_found_rover',
      'story4_all_others_found',
    ],
    unlockedApps: ALL_APPS,
    deadCharacters: ['links'],
  },
  story4_terminal: {
    label: 'Story 4 — Terminal (après Peedy)',
    flags: {
      boot_complete: true,
      story1_merlin_done: true, story1_form_shown: true,
      form_story1_profile_submitted: true, story1_complete: true,
      story2_paint_quest_given: true, opened_paint: true,
      story2_mail_sent: true, story2_links_dead: true,
      story2_bonzi_accused: true, story2_complete: true,
      'visited_faurnite.battlepass.com': true,
      story3_faurnite_spam: false, story3_virus_done: true,
      story3_avost_page: false, story3_cleanup_done: true, story3_complete: true,
      story4_hiding: true,
      item_found_merlin: true, item_found_genie: true,
      item_found_peedy: true, item_found_bonzi: true,
      item_found_genius: true, item_found_rover: true,
      item_found_rocky: true, story4_rocky_dead: true,
      form_story4_peedy_q3_submitted: true, story4_peedy_done: true,
    },
    firedTriggers: [
      'story1_merlin_intro', 'story1_links_intro', 'story1_form_done',
      'story2_links_paint_quest', 'story2_paint_opened',
      'story2_links_goes_to_mail', 'story2_investigation',
      'story3_faurnite_virus', 'story3_genius_cleanup',
      'story4_hide_and_seek',
      'story4_found_merlin', 'story4_found_genie', 'story4_found_peedy',
      'story4_found_bonzi', 'story4_found_genius', 'story4_found_rover',
      'story4_all_others_found', 'story4_cadavre_rocky', 'story4_peedy_a1', 'story4_peedy_a2', 'story4_peedy_a3',
    ],
    unlockedApps: ALL_APPS,
    deadCharacters: ['links', 'rocky'],
  },
  story5: {
    label: 'Story 5 — Le Génie de la lampe',
    flags: {
      boot_complete: true,
      story1_merlin_done: true, story1_form_shown: true,
      form_story1_profile_submitted: true, story1_complete: true,
      story2_paint_quest_given: true, opened_paint: true,
      story2_mail_sent: true, story2_links_dead: true,
      story2_bonzi_accused: true, story2_complete: true,
      'visited_faurnite.battlepass.com': true,
      story3_faurnite_spam: false, story3_virus_done: true,
      story3_avost_page: false, story3_cleanup_done: true, story3_complete: true,
      story4_hiding: true,
      item_found_merlin: true, item_found_genie: true,
      item_found_peedy: true, item_found_bonzi: true,
      item_found_genius: true, item_found_rover: true,
      item_found_rocky: true, story4_rocky_dead: true,
      form_story4_peedy_q3_submitted: true, story4_peedy_done: true,
      story4_terminal_given: true, item_used_permissions_bonzi: true,
      story4_complete: true,
    },
    firedTriggers: [
      'story1_merlin_intro', 'story1_links_intro', 'story1_form_done',
      'story2_links_paint_quest', 'story2_paint_opened',
      'story2_links_goes_to_mail', 'story2_investigation',
      'story3_faurnite_virus', 'story3_genius_cleanup',
      'story4_hide_and_seek',
      'story4_found_merlin', 'story4_found_genie', 'story4_found_peedy',
      'story4_found_bonzi', 'story4_found_genius', 'story4_found_rover',
      'story4_all_others_found', 'story4_cadavre_rocky', 'story4_peedy_a1', 'story4_peedy_a2', 'story4_peedy_a3',
      'story4_einstein_terminal', 'story4_bonzi_permissions',
    ],
    unlockedApps: [...ALL_APPS, 'terminal'],
    deadCharacters: ['links', 'rocky'],
  },
  story6: {
    label: 'Story 6 — Le Verdict Final',
    flags: {
      boot_complete: true,
      story1_merlin_done: true, story1_form_shown: true,
      form_story1_profile_submitted: true, story1_complete: true,
      story2_paint_quest_given: true, opened_paint: true,
      story2_mail_sent: true, story2_links_dead: true,
      story2_bonzi_accused: true, story2_complete: true,
      'visited_faurnite.battlepass.com': true,
      story3_faurnite_spam: false, story3_virus_done: true,
      story3_avost_page: false, story3_cleanup_done: true, story3_complete: true,
      story4_hiding: true,
      item_found_merlin: true, item_found_genie: true,
      item_found_peedy: true, item_found_bonzi: true,
      item_found_genius: true, item_found_rover: true,
      item_found_rocky: true, story4_rocky_dead: true,
      form_story4_peedy_q3_submitted: true, story4_peedy_done: true,
      story4_terminal_given: true, item_used_permissions_bonzi: true,
      story4_complete: true,
      story5_genie_waiting: true, 'visited_devine-moi.fr': true,
      story5_calculator_proposed: true, opened_calculator: true,
      story5_bonzai_puzzle: true, item_bonzai_code_cracked: true,
      story5_complete: true,
    },
    firedTriggers: [
      'story1_merlin_intro', 'story1_links_intro', 'story1_form_done',
      'story2_links_paint_quest', 'story2_paint_opened',
      'story2_links_goes_to_mail', 'story2_investigation',
      'story3_faurnite_virus', 'story3_genius_cleanup',
      'story4_hide_and_seek',
      'story4_found_merlin', 'story4_found_genie', 'story4_found_peedy',
      'story4_found_bonzi', 'story4_found_genius', 'story4_found_rover',
      'story4_all_others_found', 'story4_cadavre_rocky', 'story4_peedy_a1', 'story4_peedy_a2', 'story4_peedy_a3',
      'story4_einstein_terminal', 'story4_bonzi_permissions',
      'story5_genie_game', 'story5_devinemoi_404',
      'story5_calculator_opened', 'story5_bonzai_cracked',
    ],
    unlockedApps: [...ALL_APPS, 'terminal'],
    deadCharacters: ['links', 'rocky'],
  },
};

export function createDebugState(preset: DebugPreset): GameState {
  const base = createInitialState();
  base.flags = { ...preset.flags };
  if (preset.unlockedApps) base.unlockedApps = [...preset.unlockedApps];
  if (preset.deadCharacters) {
    for (const id of preset.deadCharacters) {
      base.characters[id] = { id, status: 'dead' };
    }
  }
  base.profile = { firstName: 'Debug', lastName: 'User', favoriteColor: '#008080', favoriteDish: 'Pizza' };
  return base;
}
