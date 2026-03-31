import { useState, useRef, useCallback, useEffect } from 'react';

type Suit = 'hearts' | 'diamonds' | 'clubs' | 'spades';

interface Card {
  suit: Suit;
  value: number;
  faceUp: boolean;
}

type Sel =
  | { from: 'waste' }
  | { from: 'tableau'; col: number; idx: number }
  | { from: 'foundation'; fi: number };

interface G {
  stock: Card[];
  waste: Card[];
  fnd: Card[][];
  tab: Card[][];
  sel: Sel | null;
  score: number;
  moves: number;
  won: boolean;
}

interface DragState {
  cards: Card[];
  startX: number;
  startY: number;
  currentX: number;
  currentY: number;
  originX: number;
  originY: number;
  sel: Sel;
}


const SUITS: Suit[] = ['hearts', 'diamonds', 'clubs', 'spades'];
const SYM: Record<Suit, string> = { hearts: '♥', diamonds: '♦', clubs: '♣', spades: '♠' };
const VL: Record<number, string> = { 1: 'A', 11: 'J', 12: 'Q', 13: 'K' };
const vl = (v: number) => VL[v] ?? `${v}`;
const isRed = (s: Suit) => s === 'hearts' || s === 'diamonds';
const opp = (a: Suit, b: Suit) => isRed(a) !== isRed(b);
const CW = 62, CH = 88;
const FD_STEP = 14, FU_STEP = 20;


function mkDeck(): Card[] {
  return SUITS.flatMap(suit =>
    Array.from({ length: 13 }, (_, i) => ({ suit, value: i + 1, faceUp: false }))
  );
}

function shuffle<T>(a: T[]): T[] {
  const b = [...a];
  for (let i = b.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [b[i], b[j]] = [b[j], b[i]];
  }
  return b;
}

function newGame(): G {
  const deck = shuffle(mkDeck());
  const tab: Card[][] = Array.from({ length: 7 }, () => []);
  let k = 0;
  for (let c = 0; c < 7; c++)
    for (let r = 0; r <= c; r++)
      tab[c].push({ ...deck[k++], faceUp: r === c });
  return {
    stock: deck.slice(k), waste: [],
    fnd: [[], [], [], []], tab,
    sel: null, score: 0, moves: 0, won: false,
  };
}

function canFnd(card: Card, pile: Card[]) {
  if (pile.length === 0) return card.value === 1;
  const t = pile[pile.length - 1];
  return t.suit === card.suit && card.value === t.value + 1;
}

function canTab(card: Card, col: Card[]) {
  if (col.length === 0) return card.value === 13;
  const t = col[col.length - 1];
  return t.faceUp && opp(card.suit, t.suit) && card.value === t.value - 1;
}

function getSelCards(g: G): Card[] {
  if (!g.sel) return [];
  if (g.sel.from === 'waste') return g.waste.length ? [g.waste[g.waste.length - 1]] : [];
  if (g.sel.from === 'tableau') return g.tab[g.sel.col].slice(g.sel.idx);
  const f = g.fnd[g.sel.fi];
  return f.length ? [f[f.length - 1]] : [];
}

function flipTop(col: Card[]): Card[] {
  if (!col.length) return col;
  const l = col[col.length - 1];
  return l.faceUp ? col : [...col.slice(0, -1), { ...l, faceUp: true }];
}

function removeFromSrc(g: G, cards: Card[]): { waste: Card[]; fnd: Card[][]; tab: Card[][]; bonus: number } {
  const waste = [...g.waste];
  const fnd = g.fnd.map(f => [...f]);
  const tab = g.tab.map(c => [...c]);
  let bonus = 0;
  const sel = g.sel!;

  if (sel.from === 'waste') {
    waste.splice(-cards.length);
  } else if (sel.from === 'tableau') {
    const { col, idx } = sel as { from: 'tableau'; col: number; idx: number };
    const before = g.tab[col].slice(0, idx);
    const flipped = flipTop(before);
    if (flipped.length > 0 && !before[before.length - 1]?.faceUp) bonus = 5;
    tab[col] = flipped;
  } else {
    const { fi } = sel as { from: 'foundation'; fi: number };
    fnd[fi] = fnd[fi].slice(0, -1);
  }

  return { waste, fnd, tab, bonus };
}

function tryMoveToTab(g: G, destCol: number): G | null {
  if (!g.sel) return null;
  const cards = getSelCards(g);
  if (!cards.length) return null;
  if (!canTab(cards[0], g.tab[destCol])) return null;
  if (g.sel.from === 'tableau' && (g.sel as { from: 'tableau'; col: number; idx: number }).col === destCol) return null;

  const { waste, fnd, tab, bonus } = removeFromSrc(g, cards);
  const selFromFoundation = g.sel.from === 'foundation';
  tab[destCol] = [...tab[destCol], ...cards.map(c => ({ ...c, faceUp: true }))];

  const baseScore = g.sel.from === 'waste' ? 5 : selFromFoundation ? -15 : 0;
  return { ...g, waste, fnd, tab, sel: null, score: g.score + baseScore + bonus, moves: g.moves + 1 };
}

function tryMoveToFnd(g: G, fi: number): G | null {
  if (!g.sel) return null;
  const cards = getSelCards(g);
  if (cards.length !== 1) return null;
  if (!canFnd(cards[0], g.fnd[fi])) return null;

  const { waste, fnd, tab, bonus } = removeFromSrc(g, cards);
  fnd[fi] = [...fnd[fi], { ...cards[0], faceUp: true }];
  const won = fnd.every(f => f.length === 13);
  return { ...g, waste, fnd, tab, sel: null, score: g.score + 10 + bonus, moves: g.moves + 1, won };
}


function CardBack({ selected, dimmed }: { selected?: boolean; dimmed?: boolean }) {
  return (
    <div style={{
      width: CW, height: CH,
      background: 'repeating-linear-gradient(45deg, #003399, #003399 4px, #0044cc 4px, #0044cc 8px)',
      border: selected ? '2px solid #ffff00' : '1px solid #222',
      borderRadius: 4,
      boxSizing: 'border-box',
      cursor: 'pointer',
      flexShrink: 0,
      opacity: dimmed ? 0.4 : 1,
    }} />
  );
}

const PIP_LAYOUTS: Record<number, { x: number; y: number; flip?: boolean }[]> = {
  1:  [{ x: 1, y: 2 }],
  2:  [{ x: 1, y: 0 }, { x: 1, y: 4, flip: true }],
  3:  [{ x: 1, y: 0 }, { x: 1, y: 2 }, { x: 1, y: 4, flip: true }],
  4:  [{ x: 0, y: 0 }, { x: 2, y: 0 }, { x: 0, y: 4, flip: true }, { x: 2, y: 4, flip: true }],
  5:  [{ x: 0, y: 0 }, { x: 2, y: 0 }, { x: 1, y: 2 }, { x: 0, y: 4, flip: true }, { x: 2, y: 4, flip: true }],
  6:  [{ x: 0, y: 0 }, { x: 2, y: 0 }, { x: 0, y: 2 }, { x: 2, y: 2 }, { x: 0, y: 4, flip: true }, { x: 2, y: 4, flip: true }],
  7:  [{ x: 0, y: 0 }, { x: 2, y: 0 }, { x: 0, y: 2 }, { x: 2, y: 2 }, { x: 1, y: 1 }, { x: 0, y: 4, flip: true }, { x: 2, y: 4, flip: true }],
  8:  [{ x: 0, y: 0 }, { x: 2, y: 0 }, { x: 0, y: 2 }, { x: 2, y: 2 }, { x: 1, y: 1 }, { x: 1, y: 3, flip: true }, { x: 0, y: 4, flip: true }, { x: 2, y: 4, flip: true }],
  9:  [{ x: 0, y: 0 }, { x: 2, y: 0 }, { x: 0, y: 1.5 }, { x: 2, y: 1.5 }, { x: 1, y: 2 }, { x: 0, y: 2.5, flip: true }, { x: 2, y: 2.5, flip: true }, { x: 0, y: 4, flip: true }, { x: 2, y: 4, flip: true }],
  10: [{ x: 0, y: 0 }, { x: 2, y: 0 }, { x: 1, y: 0.75 }, { x: 0, y: 1.5 }, { x: 2, y: 1.5 }, { x: 0, y: 2.5, flip: true }, { x: 2, y: 2.5, flip: true }, { x: 1, y: 3.25, flip: true }, { x: 0, y: 4, flip: true }, { x: 2, y: 4, flip: true }],
};

function Pips({ suit, value }: { suit: Suit; value: number }) {
  const sym = SYM[suit];
  const color = isRed(suit) ? '#cc0000' : '#111';
  const layout = PIP_LAYOUTS[value];

  if (!layout) {
    const face = value === 11 ? 'J' : value === 12 ? 'Q' : 'K';
    const faceColor = isRed(suit) ? '#cc0000' : '#222';
    return (
      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', pointerEvents: 'none' }}>
        <div style={{ fontSize: 36, fontWeight: 'bold', color: faceColor, lineHeight: 1, fontFamily: 'Arial, Helvetica, sans-serif', textAlign: 'center', WebkitFontSmoothing: 'antialiased' }}>{face}</div>
      </div>
    );
  }

  if (value === 1) {
    return (
      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', fontSize: 38, color, pointerEvents: 'none' }}>
        {sym}
      </div>
    );
  }

  const xPos = [16, 31, 46]; // left, center, right (within card)
  const yMin = 20, yMax = 74; // top/bottom pip area
  const yRange = yMax - yMin;

  return (
    <>
      {layout.map((p, i) => (
        <div key={i} style={{
          position: 'absolute',
          left: xPos[p.x],
          top: yMin + (p.y / 4) * yRange,
          transform: `translate(-50%, -50%)${p.flip ? ' rotate(180deg)' : ''}`,
          fontSize: 18,
          color,
          pointerEvents: 'none',
          lineHeight: 1,
        }}>
          {sym}
        </div>
      ))}
    </>
  );
}

function CardFace({ card, selected, dimmed }: { card: Card; selected?: boolean; dimmed?: boolean }) {
  const color = isRed(card.suit) ? '#cc0000' : '#111';
  return (
    <div style={{
      width: CW, height: CH,
      background: '#fff',
      border: selected ? '2px solid #ffcc00' : '1px solid #888',
      borderRadius: 4,
      boxSizing: 'border-box',
      position: 'relative',
      cursor: 'pointer',
      userSelect: 'none',
      flexShrink: 0,
      outline: selected ? '1px solid #ff8800' : undefined,
      opacity: dimmed ? 0.4 : 1,
    }}>
      <div style={{ position: 'absolute', top: 2, left: 3, fontSize: 10, fontWeight: 'bold', color, lineHeight: 1.1, textAlign: 'center' }}>
        {vl(card.value)}<br />{SYM[card.suit]}
      </div>
      <div style={{ position: 'absolute', bottom: 2, right: 3, fontSize: 10, fontWeight: 'bold', color, lineHeight: 1.1, textAlign: 'center', transform: 'rotate(180deg)' }}>
        {vl(card.value)}<br />{SYM[card.suit]}
      </div>
      <Pips suit={card.suit} value={card.value} />
    </div>
  );
}

function EmptySlot({ label, onClick }: { label?: string; onClick?: () => void }) {
  return (
    <div onClick={onClick} style={{
      width: CW, height: CH,
      border: '1px dashed #3a8a3a',
      borderRadius: 4, boxSizing: 'border-box',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: '#3a8a3a', fontSize: 16, cursor: 'pointer', flexShrink: 0,
    }}>
      {label}
    </div>
  );
}


function colTop(col: Card[], ri: number): number {
  let top = 0;
  for (let i = 0; i < ri; i++) top += col[i].faceUp ? FU_STEP : FD_STEP;
  return top;
}

function colHeight(col: Card[]): number {
  if (!col.length) return CH;
  return colTop(col, col.length - 1) + CH;
}


export function Solitaire() {
  const [g, setG] = useState<G>(newGame);
  const [history, setHistory] = useState<G[]>([]);
  const [drag, setDrag] = useState<DragState | null>(null);
  const boardRef = useRef<HTMLDivElement>(null);

  const doMove = (fn: (prev: G) => G) => {
    setG(prev => {
      const next = fn(prev);
      if (next !== prev) setHistory(h => [...h, prev]);
      return next;
    });
  };

  const undo = () => {
    if (!history.length) return;
    const prev = history[history.length - 1];
    setG(s => ({ ...prev, moves: s.moves + 1 }));
    setHistory(h => h.slice(0, -1));
  };

  const reset = () => { setG(newGame()); setHistory([]); setDrag(null); };


  const startDrag = useCallback((e: React.MouseEvent, sel: Sel, cards: Card[], originEl: HTMLElement) => {
    e.preventDefault();
    e.stopPropagation();
    const rect = originEl.getBoundingClientRect();
    setDrag({
      cards,
      startX: e.clientX,
      startY: e.clientY,
      currentX: e.clientX,
      currentY: e.clientY,
      originX: rect.left,
      originY: rect.top,
      sel,
    });
    setG(prev => ({ ...prev, sel }));
  }, []);

  const onMouseMove = useCallback((e: MouseEvent) => {
    setDrag(prev => prev ? { ...prev, currentX: e.clientX, currentY: e.clientY } : null);
  }, []);

  const onMouseUp = useCallback(() => {
    if (!drag || !boardRef.current) { setDrag(null); return; }

    const dropX = drag.currentX;
    const dropY = drag.currentY;

    const boardRect = boardRef.current.getBoundingClientRect();

    const fndStartX = boardRect.left + (CW + 8) * 3; // stock + waste + spacer
    const fndY = boardRect.top + 10; // padding
    const topBarHeight = 28;
    const rowY = fndY + topBarHeight;

    for (let fi = 0; fi < 4; fi++) {
      const fx = fndStartX + fi * (CW + 8);
      if (dropX >= fx && dropX <= fx + CW && dropY >= rowY && dropY <= rowY + CH) {
        doMove(prev => {
          const moved = tryMoveToFnd(prev, fi);
          return moved ?? { ...prev, sel: null };
        });
        setDrag(null);
        return;
      }
    }

    const tabY = rowY + CH + 12;
    for (let ci = 0; ci < 7; ci++) {
      const cx = boardRect.left + 8 + ci * (CW + 8);
      if (dropX >= cx && dropX <= cx + CW && dropY >= tabY) {
        doMove(prev => {
          const moved = tryMoveToTab(prev, ci);
          return moved ?? { ...prev, sel: null };
        });
        setDrag(null);
        return;
      }
    }

    setG(prev => ({ ...prev, sel: null }));
    setDrag(null);
  }, [drag]);

  useEffect(() => {
    if (!drag) return;
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, [drag, onMouseMove, onMouseUp]);

  const isDragged = (from: string, col?: number, idx?: number, fi?: number) => {
    if (!drag) return false;
    if (drag.sel.from !== from) return false;
    if (from === 'waste') return true;
    if (from === 'foundation') return (drag.sel as { from: 'foundation'; fi: number }).fi === fi;
    if (from === 'tableau') {
      const s = drag.sel as { from: 'tableau'; col: number; idx: number };
      return s.col === col && idx !== undefined && idx >= s.idx;
    }
    return false;
  };


  const onStock = () => doMove(prev => {
    if (prev.stock.length === 0) {
      return { ...prev, stock: [...prev.waste].reverse().map(c => ({ ...c, faceUp: false })), waste: [], sel: null, score: Math.max(0, prev.score - 100) };
    }
    const top = { ...prev.stock[prev.stock.length - 1], faceUp: true };
    return { ...prev, stock: prev.stock.slice(0, -1), waste: [...prev.waste, top], sel: null, moves: prev.moves + 1 };
  });

  const onWasteDown = (e: React.MouseEvent) => {
    if (!g.waste.length) return;
    const card = g.waste[g.waste.length - 1];
    startDrag(e, { from: 'waste' }, [card], e.currentTarget as HTMLElement);
  };

  const onFnd = (fi: number) => doMove(prev => {
    if (prev.sel) {
      const moved = tryMoveToFnd(prev, fi);
      if (moved) return moved;
      if (prev.fnd[fi].length > 0) return { ...prev, sel: { from: 'foundation', fi } };
      return { ...prev, sel: null };
    }
    if (!prev.fnd[fi].length) return prev;
    return { ...prev, sel: { from: 'foundation', fi } };
  });

  const onFndDown = (e: React.MouseEvent, fi: number) => {
    if (!g.fnd[fi].length) return;
    const card = g.fnd[fi][g.fnd[fi].length - 1];
    startDrag(e, { from: 'foundation', fi }, [card], e.currentTarget as HTMLElement);
  };

  const onTabCardDown = (col: number, cardIdx: number) => (e: React.MouseEvent) => {
    e.stopPropagation();
    const colCards = g.tab[col];
    if (cardIdx >= colCards.length) return;
    const card = colCards[cardIdx];

    if (!card.faceUp) {
      if (cardIdx === colCards.length - 1) {
        doMove(prev => {
          const tab = prev.tab.map(c => [...c]);
          tab[col][cardIdx] = { ...card, faceUp: true };
          return { ...prev, tab, score: prev.score + 5, moves: prev.moves + 1, sel: null };
        });
      }
      return;
    }

    const cards = colCards.slice(cardIdx);
    startDrag(e, { from: 'tableau', col, idx: cardIdx }, cards, e.currentTarget as HTMLElement);
  };

  const onTabCol = (col: number) => doMove(prev => {
    if (!prev.sel) return prev;
    const moved = tryMoveToTab(prev, col);
    return moved ?? { ...prev, sel: null };
  });


  const isFndSel = (fi: number) => g.sel?.from === 'foundation' && (g.sel as { from: 'foundation'; fi: number }).fi === fi;
  const isTabSel = (col: number, ri: number) =>
    g.sel?.from === 'tableau' &&
    (g.sel as { from: 'tableau'; col: number; idx: number }).col === col &&
    ri >= (g.sel as { from: 'tableau'; col: number; idx: number }).idx;

  return (
    <div
      ref={boardRef}
      style={{ background: '#1a5c1a', width: '100%', height: '100%', padding: '10px 8px', boxSizing: 'border-box', overflow: 'auto', fontFamily: '"MS Sans Serif", sans-serif', position: 'relative' }}
      onClick={() => setG(prev => prev.sel ? { ...prev, sel: null } : prev)}
    >
      {/* Drag ghost */}
      {drag && (
        <div style={{
          position: 'fixed',
          left: drag.originX + (drag.currentX - drag.startX),
          top: drag.originY + (drag.currentY - drag.startY),
          zIndex: 1000,
          pointerEvents: 'none',
          opacity: 0.85,
        }}>
          {drag.cards.map((card, i) => (
            <div key={i} style={{ marginTop: i === 0 ? 0 : -CH + FU_STEP }}>
              <CardFace card={card} />
            </div>
          ))}
        </div>
      )}

      {/* Won overlay */}
      {g.won && (
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.75)', zIndex: 99, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16 }}>
          <div style={{ color: '#ffdd00', fontSize: 32, fontWeight: 'bold', textShadow: '2px 2px #000' }}>Vous avez gagné !</div>
          <div style={{ color: '#fff', fontSize: 16 }}>Score : {g.score} — Coups : {g.moves}</div>
          <button onClick={e => { e.stopPropagation(); reset(); }} style={{ padding: '6px 20px', fontSize: 14, cursor: 'pointer', background: '#c0c0c0', border: '2px outset #fff' }}>
            Nouvelle partie
          </button>
        </div>
      )}

      {/* Top bar */}
      <div onClick={e => e.stopPropagation()} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8, color: '#fff', fontSize: 12 }}>
        <span>Score : <b>{g.score}</b></span>
        <span>Coups : <b>{g.moves}</b></span>
        <button onClick={undo} disabled={!history.length} style={{ padding: '2px 10px', fontSize: 11, cursor: history.length ? 'pointer' : 'default', background: '#c0c0c0', border: '2px outset #fff', opacity: history.length ? 1 : 0.5 }}>
          Annuler
        </button>
        <button onClick={reset} style={{ marginLeft: 'auto', padding: '2px 10px', fontSize: 11, cursor: 'pointer', background: '#c0c0c0', border: '2px outset #fff' }}>
          Nouvelle partie
        </button>
      </div>

      {/* Top row */}
      <div onClick={e => e.stopPropagation()} style={{ display: 'flex', gap: 8, alignItems: 'flex-start', marginBottom: 12 }}>
        {/* Stock */}
        <div onClick={onStock} style={{ cursor: 'pointer' }}>
          {g.stock.length > 0
            ? <CardBack />
            : <EmptySlot label="↺" onClick={onStock} />
          }
        </div>

        {/* Waste */}
        <div onMouseDown={onWasteDown} style={{ cursor: 'pointer' }}>
          {g.waste.length === 0
            ? <EmptySlot />
            : <CardFace card={g.waste[g.waste.length - 1]} selected={g.sel?.from === 'waste' && !drag} dimmed={isDragged('waste')} />
          }
        </div>

        {/* Spacer */}
        <div style={{ width: CW }} />

        {/* Foundations */}
        {g.fnd.map((pile, fi) => (
          <div key={fi} onClick={() => onFnd(fi)} onMouseDown={(e) => onFndDown(e, fi)} style={{ cursor: 'pointer' }}>
            {pile.length === 0
              ? <EmptySlot label={['A♥', 'A♦', 'A♣', 'A♠'][fi]} onClick={() => onFnd(fi)} />
              : <CardFace card={pile[pile.length - 1]} selected={isFndSel(fi) && !drag} dimmed={isDragged('foundation', undefined, undefined, fi)} />
            }
          </div>
        ))}
      </div>

      {/* Tableau */}
      <div onClick={e => e.stopPropagation()} style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
        {g.tab.map((col, ci) => (
          <div
            key={ci}
            onClick={() => onTabCol(ci)}
            style={{ position: 'relative', width: CW, height: colHeight(col), minHeight: CH, flexShrink: 0 }}
          >
            {col.length === 0 && <EmptySlot onClick={() => onTabCol(ci)} />}
            {col.map((card, ri) => (
              <div
                key={ri}
                onMouseDown={onTabCardDown(ci, ri)}
                style={{ position: 'absolute', top: colTop(col, ri), left: 0, zIndex: ri }}
              >
                {card.faceUp
                  ? <CardFace card={card} selected={isTabSel(ci, ri) && !drag} dimmed={isDragged('tableau', ci, ri)} />
                  : <CardBack selected={isTabSel(ci, ri)} />
                }
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
