import type { WindowType } from '../types';

export type CharacterId =
  | 'merlin' | 'links' | 'bonzi' | 'clippy'
  | 'genie' | 'genius' | 'peedy' | 'rocky' | 'rover';

export type CharacterStatus = 'alive' | 'dead' | 'absent' | 'hidden';

export interface CharacterState {
  id: CharacterId;
  status: CharacterStatus;
}

export interface GameState {
  characters: Record<CharacterId, CharacterState>;
  flags: Record<string, boolean>;
}

export interface StoryTrigger {
  id: string;
  conditions: TriggerCondition[];
  actions: TriggerAction[];
  once: boolean;
}

export type TriggerCondition =
  | { type: 'flag'; flag: string; value: boolean }
  | { type: 'flagNotSet'; flag: string };

export type TriggerAction =
  | { type: 'setFlag'; flag: string; value: boolean }
  | { type: 'agentSpeak'; character: CharacterId; text: string }
  | { type: 'agentShow'; character: CharacterId }
  | { type: 'agentHide'; character: CharacterId }
  | { type: 'agentPlay'; character: CharacterId; animation: string }
  | { type: 'agentMoveTo'; character: CharacterId; x: number; y: number }
  | { type: 'setCharacterStatus'; character: CharacterId; status: CharacterStatus }
  | { type: 'openWindow'; windowType: WindowType };

export type GameEvent =
  | { type: 'boot_complete' }
  | { type: 'window_opened'; windowType: WindowType }
  | { type: 'window_closed'; windowType: WindowType }
  | { type: 'character_clicked'; characterId: CharacterId }
  | { type: 'item_clicked'; itemId: string; windowType: WindowType };
