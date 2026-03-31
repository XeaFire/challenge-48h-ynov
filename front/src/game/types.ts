import type { WindowType } from '../types';

export type CharacterId =
  | 'merlin' | 'links' | 'bonzi' | 'clippy'
  | 'genie' | 'genius' | 'peedy' | 'rocky' | 'rover';

export type CharacterStatus = 'alive' | 'dead' | 'absent' | 'hidden';

export interface CharacterState {
  id: CharacterId;
  status: CharacterStatus;
}

export interface FormField {
  key: string;
  label: string;
  placeholder?: string;
  type?: 'text' | 'color' | 'button';
}

export interface GameState {
  characters: Record<CharacterId, CharacterState>;
  flags: Record<string, boolean>;
  unlockedApps: string[];
  profile: Record<string, string>;
  activeForm: { formId: string; title: string; description?: string; fields: FormField[]; submitLabel?: string } | null;
  shakingIcon: string | null;
  bleedingIcon: string | null;
  notification: string | null;
  lockedApps: string[];
  screenShake: boolean;
  subliminalText: string | null;
  windowsLocked: boolean;
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
  | { type: 'agentSpeak'; character: CharacterId; text: string; wait?: boolean }
  | { type: 'agentShow'; character: CharacterId }
  | { type: 'agentHide'; character: CharacterId; instant?: boolean }
  | { type: 'agentPlay'; character: CharacterId; animation: string }
  | { type: 'agentStopCurrent'; character: CharacterId }
  | { type: 'agentMoveTo'; character: CharacterId; x: number; y: number; duration?: number; wait?: boolean }
  | { type: 'setCharacterStatus'; character: CharacterId; status: CharacterStatus }
  | { type: 'openWindow'; windowType: WindowType }
  | { type: 'showForm'; formId: string; title: string; description?: string; fields: FormField[]; submitLabel?: string }
  | { type: 'unlockApp'; app: string }
  | { type: 'lockApp'; app: string }
  | { type: 'delay'; ms: number }
  | { type: 'sendMail'; from: string; to: string; subject: string; body: string }
  | { type: 'shakeIcon'; iconId: string }
  | { type: 'stopShakeIcon' }
  | { type: 'stopBleeding' }
  | { type: 'showNotification'; text: string }
  | { type: 'hideNotification' }
  | { type: 'disableApp'; app: string }
  | { type: 'enableApp'; app: string }
  | { type: 'screenShake'; enabled: boolean }
  | { type: 'showSubliminal'; text: string; ms: number }
  | { type: 'closeAllWindows' }
  | { type: 'lockClose'; locked: boolean };

export type GameEvent =
  | { type: 'boot_complete' }
  | { type: 'window_opened'; windowType: WindowType }
  | { type: 'window_closed'; windowType: WindowType }
  | { type: 'character_clicked'; characterId: CharacterId }
  | { type: 'item_clicked'; itemId: string; windowType: WindowType }
  | { type: 'form_submitted'; formId: string; data: Record<string, string> }
  | { type: 'url_visited'; url: string }
  | { type: 'recheck' };
