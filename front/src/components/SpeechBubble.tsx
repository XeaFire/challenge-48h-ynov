import { useState, useEffect, useRef } from 'react';
import type { CharacterId } from '../game/types';

interface BubbleData {
  id: number;
  characterId: CharacterId;
  characterName: string;
  text: string;
}

interface SpeechBubbleLayerProps {
  bubbles: BubbleData[];
  getAgentEl: (id: CharacterId) => HTMLElement | null;
  onBubbleClick: () => void;
}

function TypewriterText({ text }: { text: string }) {
  const [length, setLength] = useState(0);

  useEffect(() => {
    setLength(0);
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setLength(i);
      if (i >= text.length) clearInterval(interval);
    }, 25);
    return () => clearInterval(interval);
  }, [text]);

  return <>{text.slice(0, length)}</>;
}

function TrackedBubble({ bubble, getAgentEl }: { bubble: BubbleData; getAgentEl: (id: CharacterId) => HTMLElement | null }) {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const rafRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    const track = () => {
      const el = getAgentEl(bubble.characterId);
      if (el) {
        const rect = el.getBoundingClientRect();
        setPos({ x: rect.left + rect.width / 2, y: rect.top });
      }
      rafRef.current = requestAnimationFrame(track);
    };
    rafRef.current = requestAnimationFrame(track);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [bubble.characterId, getAgentEl]);

  return (
    <div className="speech-bubble" style={{ left: pos.x - 30, top: pos.y - 10, transform: 'translateY(-100%)' }}>
      <div className="speech-bubble-name">{bubble.characterName}</div>
      <div className="speech-bubble-text">
        <TypewriterText text={bubble.text} />
      </div>
      <div className="speech-bubble-tip" />
    </div>
  );
}

export function SpeechBubbleLayer({ bubbles, getAgentEl, onBubbleClick }: SpeechBubbleLayerProps) {
  if (bubbles.length === 0) return null;

  return (
    <div className="speech-bubbles-layer" onClick={onBubbleClick}>
      {bubbles.map(b => (
        <TrackedBubble key={b.id} bubble={b} getAgentEl={getAgentEl} />
      ))}
    </div>
  );
}

export type { BubbleData };
