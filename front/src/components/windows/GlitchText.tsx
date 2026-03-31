import { useState, useCallback, useRef } from 'react';

const GLITCH_CHARS = ['█', '▓', '▒', '░', '╫', '╬', '╪', '╩', '╦', '╠', '╣', '╝', '╚', '╗', '╔', '║', '═', '┼', '┤', '├', '┴', '┬', '│', '─'];

const HINT_LENGTH = 4;

export function GlitchText({ hidden }: { hidden: string }) {
  const [revealed, setRevealed] = useState<Set<number>>(new Set());
  const containerRef = useRef<HTMLSpanElement>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const container = containerRef.current;
    if (!container) return;

    const chars = container.querySelectorAll<HTMLElement>('.glitch-char');
    chars.forEach((charEl, i) => {
      if (i < HINT_LENGTH) return; // deja visible
      const rect = charEl.getBoundingClientRect();
      const dist = Math.abs(e.clientX - (rect.left + rect.width / 2));
      if (dist < 30) {
        setRevealed(prev => {
          if (prev.has(i)) return prev;
          const next = new Set(prev);
          next.add(i);
          return next;
        });
      }
    });
  }, []);

  return (
    <span ref={containerRef} className="glitch-text" onMouseMove={handleMouseMove}>
      {hidden.split('').map((ch, i) => {
        const isHint = i < HINT_LENGTH;
        const isRevealed = isHint || revealed.has(i);

        return (
          <span key={i} className={`glitch-char ${isRevealed ? 'glitch-revealed' : ''} ${isHint ? 'glitch-hint' : ''}`}>
            {isRevealed ? (
              <span className="glitch-real">{ch}</span>
            ) : (
              <span className="glitch-fake">{GLITCH_CHARS[i % GLITCH_CHARS.length]}</span>
            )}
          </span>
        );
      })}
      <span className="glitch-dots">.....</span>
    </span>
  );
}
