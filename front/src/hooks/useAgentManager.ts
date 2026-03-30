import { useRef, useCallback, useEffect } from 'react';
import { initAgent } from 'clippyjs';
import { Bonzi, Clippy, Genie, Genius, Links, Merlin, Peedy, Rocky, Rover } from 'clippyjs/agents';
import type { CharacterId } from '../game/types';

type Agent = Awaited<ReturnType<typeof initAgent>>;

const LOADERS: Record<CharacterId, Parameters<typeof initAgent>[0]> = {
  bonzi: Bonzi, clippy: Clippy, genie: Genie, genius: Genius,
  links: Links, merlin: Merlin, peedy: Peedy, rocky: Rocky, rover: Rover,
};

export function useAgentManager() {
  const agents = useRef<Map<CharacterId, Agent>>(new Map());

  useEffect(() => {
    const current = agents.current;
    return () => {
      current.forEach(a => a.dispose());
      current.clear();
    };
  }, []);

  const show = useCallback(async (id: CharacterId) => {
    if (agents.current.has(id)) return;
    const agent = await initAgent(LOADERS[id]);
    agents.current.set(id, agent);
    agent.show();
  }, []);

  const hide = useCallback((id: CharacterId) => {
    const agent = agents.current.get(id);
    if (!agent) return;
    agent.hide(false, () => { agent.dispose(); agents.current.delete(id); });
  }, []);

  const speak = useCallback((id: CharacterId, text: string) => {
    agents.current.get(id)?.speak(text, false);
  }, []);

  const play = useCallback((id: CharacterId, animation: string) => {
    agents.current.get(id)?.play(animation);
  }, []);

  const moveTo = useCallback((id: CharacterId, x: number, y: number) => {
    agents.current.get(id)?.moveTo(x, y, undefined);
  }, []);

  return { show, hide, speak, play, moveTo };
}

export type AgentManager = ReturnType<typeof useAgentManager>;
