import type { GameState, StoryTrigger, TriggerCondition, TriggerAction, GameEvent } from './types';

export interface EvaluationResult {
  newState: GameState;
  actions: TriggerAction[];
  newlyFiredIds: string[];
}

function checkCondition(state: GameState, condition: TriggerCondition): boolean {
  switch (condition.type) {
    case 'flag':
      return (state.flags[condition.flag] ?? false) === condition.value;
    case 'flagNotSet':
      return !(condition.flag in state.flags);
  }
}

function applyStateAction(state: GameState, action: TriggerAction): GameState {
  switch (action.type) {
    case 'setFlag':
      return { ...state, flags: { ...state.flags, [action.flag]: action.value } };
    case 'setCharacterStatus':
      return {
        ...state,
        characters: {
          ...state.characters,
          [action.character]: { ...state.characters[action.character], status: action.status },
        },
      };
    case 'unlockApp':
    case 'lockApp':
    case 'showForm':
    case 'shakeIcon':
    case 'stopShakeIcon':
    case 'stopBleeding':
    case 'showNotification':
    case 'hideNotification':
    case 'disableApp':
    case 'enableApp':
      // Applied at RUNTIME only (in applyRuntimeAction)
      return state;
    default:
      return state;
  }
}

function applyEventFlags(state: GameState, event: GameEvent): GameState {
  switch (event.type) {
    case 'boot_complete':
      return { ...state, flags: { ...state.flags, boot_complete: true } };
    case 'window_opened':
      return { ...state, flags: { ...state.flags, [`opened_${event.windowType}`]: true } };
    case 'character_clicked':
      return { ...state, flags: { ...state.flags, [`clicked_${event.characterId}`]: true } };
    case 'item_clicked':
      return { ...state, flags: { ...state.flags, [`item_${event.itemId}`]: true } };
    case 'form_submitted':
      return { ...state, flags: { ...state.flags, [`form_${event.formId}_submitted`]: true }, profile: { ...state.profile, ...event.data }, activeForm: null };
    case 'recheck':
      return state;
    default:
      return state;
  }
}

/**
 * Evaluate triggers against the SNAPSHOT state (before this batch).
 * This prevents cascading: trigger A setting a flag won't make trigger B fire
 * in the same evaluation pass. The engine must re-dispatch 'recheck' after
 * processing actions to pick up newly-enabled triggers.
 */
export function evaluateTriggers(
  state: GameState,
  triggers: StoryTrigger[],
  event: GameEvent,
  alreadyFired: Set<string>,
): EvaluationResult {
  const afterEvent = applyEventFlags(state, event);

  // Check conditions against afterEvent (snapshot), but accumulate state mutations
  let current = afterEvent;
  const actions: TriggerAction[] = [];
  const newlyFiredIds: string[] = [];

  for (const trigger of triggers) {
    if (trigger.once && alreadyFired.has(trigger.id)) continue;
    // Check conditions against the SNAPSHOT (afterEvent), not the mutated `current`
    if (!trigger.conditions.every(c => checkCondition(afterEvent, c))) continue;

    newlyFiredIds.push(trigger.id);
    for (const action of trigger.actions) {
      current = applyStateAction(current, action);
      actions.push(action);
    }
  }

  return { newState: current, actions, newlyFiredIds };
}
