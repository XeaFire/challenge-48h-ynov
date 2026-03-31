import { useState, useCallback, useRef } from 'react';
import type { GameState, GameEvent, TriggerAction } from '../game/types';
import type { AgentManager } from './useAgentManager';
import { createInitialState } from '../game/initialState';
import { evaluateTriggers } from '../game/storyEngine';
import { STORY_TRIGGERS } from '../game/storyData';
import { mailStore } from './useMailStore';
import type { WindowType } from '../types';

interface Options {
  agentManager: AgentManager;
  onOpenWindow?: (type: WindowType) => void;
  onCloseAllWindows?: () => void;
  initialState?: GameState;
  initialFiredTriggers?: string[];
}

/**
 * Actions that must mutate state at RUNTIME (during sequential execution)
 * rather than at evaluation time. This is necessary because their effects
 * need to be visible to React between other async actions (e.g. shakeIcon
 * must be visible during the delay before stopShakeIcon).
 */
function applyRuntimeAction(state: GameState, action: TriggerAction): GameState | null {
  switch (action.type) {
    case 'shakeIcon':
      return { ...state, shakingIcon: action.iconId, bleedingIcon: action.iconId };
    case 'stopShakeIcon':
      return { ...state, shakingIcon: null };
    case 'stopBleeding':
      return { ...state, bleedingIcon: null };
    case 'unlockApp':
      return state.unlockedApps.includes(action.app)
        ? state
        : { ...state, unlockedApps: [...state.unlockedApps, action.app] };
    case 'lockApp':
      return { ...state, unlockedApps: state.unlockedApps.filter(a => a !== action.app) };
    case 'disableApp':
      return state.lockedApps.includes(action.app)
        ? state
        : { ...state, lockedApps: [...state.lockedApps, action.app] };
    case 'enableApp':
      return { ...state, lockedApps: state.lockedApps.filter(a => a !== action.app) };
    case 'showForm':
      return { ...state, activeForm: { formId: action.formId, title: action.title, description: action.description, fields: action.fields, submitLabel: action.submitLabel } };
    case 'showNotification': {
      let text = action.text;
      for (const [key, val] of Object.entries(state.profile)) {
        text = text.replaceAll(`{${key}}`, String(val));
      }
      return { ...state, notification: text };
    }
    case 'hideNotification':
      return { ...state, notification: null };
    case 'screenShake':
      return { ...state, screenShake: action.enabled };
    case 'lockClose':
      return { ...state, windowsLocked: action.locked };
    case 'setFlag':
      return { ...state, flags: { ...state.flags, [action.flag]: action.value } };
    default:
      return null;
  }
}

export function useGameEngine({ agentManager, onOpenWindow, onCloseAllWindows, initialState, initialFiredTriggers }: Options) {
  const stateRef = useRef<GameState>(initialState ?? createInitialState());
  const [gameState, setGameState] = useState<GameState>(stateRef.current);
  const firedTriggers = useRef(new Set<string>(initialFiredTriggers));
  const processingRef = useRef(false);
  const pendingEvents = useRef<GameEvent[]>([]);

  const updateState = useCallback((state: GameState) => {
    stateRef.current = state;
    setGameState(state);
  }, []);

  const fillTemplate = useCallback((text: string) => {
    let result = text;
    for (const [key, val] of Object.entries(stateRef.current.profile)) {
      result = result.replaceAll(`{${key}}`, val);
    }
    return result;
  }, []);

  const executeAction = useCallback(async (action: TriggerAction): Promise<void> => {
    // Apply runtime state mutations immediately so React sees them
    const runtimeState = applyRuntimeAction(stateRef.current, action);
    if (runtimeState) {
      updateState(runtimeState);
    }

    switch (action.type) {
      case 'agentShow':
        await agentManager.show(action.character);
        break;
      case 'agentHide':
        agentManager.hide(action.character, action.instant);
        break;
      case 'agentSpeak': {
        const text = fillTemplate(action.text);
        if (action.wait === false) {
          agentManager.speakAsync(action.character, text);
        } else {
          await agentManager.speak(action.character, text);
        }
        break;
      }
      case 'agentPlay':
        agentManager.play(action.character, action.animation);
        await new Promise<void>(r => setTimeout(r, 300));
        break;
      case 'agentStopCurrent':
        agentManager.stopCurrent(action.character);
        break;
      case 'agentMoveTo':
        if (action.wait === false) {
          agentManager.moveTo(action.character, action.x, action.y, action.duration);
        } else {
          await agentManager.moveTo(action.character, action.x, action.y, action.duration);
        }
        break;
      case 'openWindow':
        onOpenWindow?.(action.windowType);
        break;
      case 'delay':
        await new Promise<void>(r => setTimeout(r, action.ms));
        break;
      case 'sendMail':
        mailStore.send({ from: action.from, to: action.to, subject: action.subject, body: action.body });
        break;
      case 'closeAllWindows':
        onCloseAllWindows?.();
        break;
      case 'showSubliminal':
        updateState({ ...stateRef.current, subliminalText: action.text });
        await new Promise<void>(r => setTimeout(r, action.ms));
        updateState({ ...stateRef.current, subliminalText: null });
        break;
    }
  }, [agentManager, onOpenWindow, onCloseAllWindows, updateState, fillTemplate]);

  const processActions = useCallback(async (actions: TriggerAction[]) => {
    let currentActions = actions;
    while (currentActions.length > 0) {
      for (const action of currentActions) {
        try {
          await executeAction(action);
        } catch (e) {
          console.warn('[GameEngine] action failed:', action.type, e);
        }
      }

      // Re-evaluate: flags set during evaluation may enable new triggers
      const { newState, actions: newActions, newlyFiredIds } = evaluateTriggers(
        stateRef.current, STORY_TRIGGERS, { type: 'recheck' }, firedTriggers.current,
      );

      for (const id of newlyFiredIds) firedTriggers.current.add(id);
      updateState(newState);
      currentActions = newActions;
    }
  }, [executeAction, updateState]);

  const processNext = useCallback(async () => {
    if (processingRef.current) return;
    processingRef.current = true;

    while (pendingEvents.current.length > 0) {
      const event = pendingEvents.current.shift()!;

      const { newState, actions, newlyFiredIds } = evaluateTriggers(
        stateRef.current, STORY_TRIGGERS, event, firedTriggers.current,
      );

      for (const id of newlyFiredIds) firedTriggers.current.add(id);
      updateState(newState);

      if (actions.length > 0) {
        await processActions(actions);
      }
    }

    processingRef.current = false;
  }, [processActions, updateState]);

  const dispatch = useCallback((event: GameEvent) => {
    pendingEvents.current.push(event);
    processNext();
  }, [processNext]);

  return { gameState, dispatch };
}
