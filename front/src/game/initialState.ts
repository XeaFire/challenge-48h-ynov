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
  return { characters, flags: {} };
}
