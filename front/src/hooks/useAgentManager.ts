import { useRef, useState, useCallback, useEffect } from 'react';
import { initAgent } from 'clippyjs';
import { Bonzi, Clippy, Genie, Genius, Links, Merlin, Peedy, Rocky, Rover } from 'clippyjs/agents';
import type { CharacterId } from '../game/types';
import type { BubbleData } from '../components/SpeechBubble';

type Agent = Awaited<ReturnType<typeof initAgent>>;

const LOADERS: Record<CharacterId, Parameters<typeof initAgent>[0]> = {
  bonzi: Bonzi, clippy: Clippy, genie: Genie, genius: Genius,
  links: Links, merlin: Merlin, peedy: Peedy, rocky: Rocky, rover: Rover,
};

const NAMES: Record<CharacterId, string> = {
  merlin: 'Merlin', links: 'Links', bonzi: 'Bonzi', clippy: 'Clippy',
  genie: 'Genie', genius: 'Genius', peedy: 'Peedy', rocky: 'Rocky', rover: 'Rover',
};

function readTime(text: string): number {
  const words = text.split(/\s+/).length;
  return Math.max(2000, words * 250);
}

let bubbleIdCounter = 0;

export function useAgentManager() {
  const agents = useRef<Map<CharacterId, Agent>>(new Map());
  const [bubbles, setBubbles] = useState<BubbleData[]>([]);
  const skipResolve = useRef<(() => void) | null>(null);

  useEffect(() => {
    return () => {
      agents.current.forEach(a => { try { a.dispose(); } catch { /* */ } });
      agents.current.clear();
    };
  }, []);

  const getAgentEl = useCallback((id: CharacterId): HTMLElement | null => {
    const agent = agents.current.get(id);
    if (!agent) return null;
    return (agent as unknown as { _el: HTMLElement })._el ?? null;
  }, []);

  const skipCurrentSpeech = useCallback(() => {
    if (skipResolve.current) skipResolve.current();
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
    setBubbles(prev => prev.filter(b => b.characterId !== id));
    try {
      if (instant) agent.dispose();
      else agent.hide(false, () => { try { agent.dispose(); } catch { /* */ } });
    } catch { /* */ }
  }, []);

  const speak = useCallback((id: CharacterId, text: string): Promise<void> => {
    return new Promise<void>(resolve => {
      if (!agents.current.has(id)) { resolve(); return; }

      const bubbleId = ++bubbleIdCounter;
      setBubbles(prev => [...prev.filter(b => b.characterId !== id), {
        id: bubbleId, characterId: id, characterName: NAMES[id], text,
      }]);

      let done = false;
      const finish = () => {
        if (done) return;
        done = true;
        skipResolve.current = null;
        setBubbles(prev => prev.filter(b => b.id !== bubbleId));
        resolve();
      };

      skipResolve.current = finish;
      setTimeout(finish, readTime(text));
    });
  }, []);

  const speakAsync = useCallback((id: CharacterId, text: string) => {
    if (!agents.current.has(id)) return;

    const bubbleId = ++bubbleIdCounter;
    setBubbles(prev => [...prev.filter(b => b.characterId !== id), {
      id: bubbleId, characterId: id, characterName: NAMES[id], text,
    }]);

    setTimeout(() => {
      setBubbles(prev => prev.filter(b => b.id !== bubbleId));
    }, readTime(text));
  }, []);

  const stopCurrent = useCallback((id: CharacterId) => {
    agents.current.get(id)?.stopCurrent();
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

  return { show, hide, speak, speakAsync, play, moveTo, stopCurrent, bubbles, getAgentEl, skipCurrentSpeech };
}

export type AgentManager = ReturnType<typeof useAgentManager>;
