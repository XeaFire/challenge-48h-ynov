import { useRef, useCallback, useEffect } from 'react';
import { initAgent } from 'clippyjs';
import { Bonzi, Clippy, Genie, Genius, Links, Merlin, Peedy, Rocky, Rover } from 'clippyjs/agents';
import type { CharacterId } from '../game/types';

type Agent = Awaited<ReturnType<typeof initAgent>>;

const LOADERS: Record<CharacterId, Parameters<typeof initAgent>[0]> = {
  bonzi: Bonzi, clippy: Clippy, genie: Genie, genius: Genius,
  links: Links, merlin: Merlin, peedy: Peedy, rocky: Rocky, rover: Rover,
};

/** Estimate reading time based on text length */
function readTime(text: string): number {
  return Math.max(2500, text.length * 50);
}

export function useAgentManager() {
  const agents = useRef<Map<CharacterId, Agent>>(new Map());

  useEffect(() => {
    return () => {
      agents.current.forEach(a => a.dispose());
      agents.current.clear();
    };
  }, []);

  const show = useCallback(async (id: CharacterId) => {
    if (agents.current.has(id)) return;
    const agent = await initAgent(LOADERS[id]);
    agents.current.set(id, agent);
    agent.show();
  }, []);

  const hide = useCallback((id: CharacterId, instant?: boolean) => {
    const agent = agents.current.get(id);
    if (!agent) return;
    agents.current.delete(id);
    try {
      if (instant) {
        // Each clippyjs agent has fully isolated state (no shared globals),
        // so dispose() is safe and properly cleans up: DOM elements, balloon,
        // animation timers, event listeners, and audio.
        agent.dispose();
      } else {
        agent.hide(false, () => { try { agent.dispose(); } catch { /* ignore */ } });
      }
    } catch {
      // Ensure cleanup even if something throws
    }
  }, []);

  /**
   * Show speech bubble and wait for it to auto-close.
   * Returns a Promise that resolves after a delay proportional to text length.
   */
  const speak = useCallback((id: CharacterId, text: string): Promise<void> => {
    return new Promise<void>(resolve => {
      const agent = agents.current.get(id);
      if (!agent) { resolve(); return; }
      agent.speak(text, false);
      setTimeout(resolve, readTime(text));
    });
  }, []);

  const play = useCallback((id: CharacterId, animation: string) => {
    agents.current.get(id)?.play(animation);
  }, []);

  const moveTo = useCallback((id: CharacterId, x: number, y: number, durationMs?: number): Promise<void> => {
    return new Promise<void>(resolve => {
      const agent = agents.current.get(id);
      if (!agent) { resolve(); return; }
      agent.moveTo(x, y, undefined);
      setTimeout(resolve, durationMs ?? 2000);
    });
  }, []);

  return { show, hide, speak, play, moveTo };
}

export type AgentManager = ReturnType<typeof useAgentManager>;
