import { useState, useCallback, useRef } from 'react';
import type { GameState, GameEvent, TriggerAction } from '../game/types';
import type { AgentManager } from './useAgentManager';
import { createInitialState } from '../game/initialState';
import { evaluateTriggers } from '../game/storyEngine';
import { STORY_TRIGGERS } from '../game/storyData';
import type { WindowType } from '../types';

interface Options {
  agentManager: AgentManager;
  onOpenWindow?: (type: WindowType) => void;
}

export function useGameEngine({ agentManager, onOpenWindow }: Options) {
  const stateRef = useRef<GameState>(createInitialState());
  const [gameState, setGameState] = useState<GameState>(() => stateRef.current);
  const firedTriggers = useRef(new Set<string>());
  const processingRef = useRef(false);
  const queue = useRef<TriggerAction[][]>([]);

  const processQueue = useCallback(async () => {
    if (processingRef.current) return;
    processingRef.current = true;

    while (queue.current.length > 0) {
      for (const action of queue.current.shift()!) {
        switch (action.type) {
          case 'agentShow': await agentManager.show(action.character); break;
          case 'agentHide': agentManager.hide(action.character); break;
          case 'agentSpeak': agentManager.speak(action.character, action.text); break;
          case 'agentPlay': agentManager.play(action.character, action.animation); break;
          case 'agentMoveTo': agentManager.moveTo(action.character, action.x, action.y); break;
          case 'openWindow': onOpenWindow?.(action.windowType); break;
        }
      }
    }

    processingRef.current = false;
  }, [agentManager, onOpenWindow]);

  const dispatch = useCallback((event: GameEvent) => {
    const { newState, actions, newlyFiredIds } = evaluateTriggers(
      stateRef.current, STORY_TRIGGERS, event, firedTriggers.current,
    );

    for (const id of newlyFiredIds) firedTriggers.current.add(id);

    stateRef.current = newState;
    setGameState(newState);

    if (actions.length > 0) {
      queue.current.push(actions);
      processQueue();
    }
  }, [processQueue]);

  return { gameState, dispatch };
}
