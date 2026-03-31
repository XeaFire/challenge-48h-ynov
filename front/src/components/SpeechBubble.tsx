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

/** Parse **bold** dans le texte */
function renderBold(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <b key={i}>{part.slice(2, -2)}</b>;
    }
    return part;
  });
}

/** Compte les caracteres visibles (sans les **) */
function plainLength(text: string): number {
  return text.replace(/\*\*/g, '').length;
}

function TypewriterText({ text }: { text: string }) {
  const [length, setLength] = useState(0);
  const total = plainLength(text);

  useEffect(() => {
    setLength(0);
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setLength(i);
      if (i >= total) clearInterval(interval);
    }, 25);
    return () => clearInterval(interval);
  }, [text, total]);

  // Couper le texte au bon endroit en ignorant les **
  let visible = 0;
  let cutIndex = 0;
  for (let i = 0; i < text.length && visible < length; i++) {
    if (text[i] === '*' && text[i + 1] === '*') {
      cutIndex = i + 2;
      i++; // skip second *
      continue;
    }
    visible++;
    cutIndex = i + 1;
  }

  return <>{renderBold(text.slice(0, cutIndex))}</>;
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
