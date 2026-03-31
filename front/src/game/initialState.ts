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
  const unlockedApps: string[] = ['mycomputer', 'notepad', 'recyclebin', 'calculator', 'explorer', 'mail',  'minesweeper'];
  return { characters, flags: {}, unlockedApps, profile: {}, activeForm: null, shakingIcon: null, bleedingIcon: null, screenShake: false, subliminalText: null, windowsLocked: false };
}

/** Flags + fired trigger IDs to skip to a specific story start */
export interface DebugPreset {
  label: string;
  flags: Record<string, boolean>;
  firedTriggers: string[];
  unlockedApps?: string[];
  deadCharacters?: CharacterId[];
}

const ALL_APPS = ['mycomputer', 'notepad', 'recyclebin', 'calculator', 'explorer', 'mail', 'paint', 'ie', 'minesweeper'];

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
