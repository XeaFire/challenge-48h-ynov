import { createContext, useContext } from 'react';
import type { GameState, GameEvent } from './types';
import type { AgentManager } from '../hooks/useAgentManager';

interface GameContextValue {
  gameState: GameState;
  dispatch: (event: GameEvent) => void;
  agents: AgentManager;
  closeAllWindows: () => void;
}

export const GameContext = createContext<GameContextValue>(null!);

export function useGame() {
  return useContext(GameContext);
}
