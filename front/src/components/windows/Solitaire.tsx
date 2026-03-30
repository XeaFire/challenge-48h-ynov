import { useState } from 'react';

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

// ─── Constants ───────────────────────────────────────────────────────────────

const SUITS: Suit[] = ['hearts', 'diamonds', 'clubs', 'spades'];
const SYM: Record<Suit, string> = { hearts: '♥', diamonds: '♦', clubs: '♣', spades: '♠' };
const VL: Record<number, string> = { 1: 'A', 11: 'J', 12: 'Q', 13: 'K' };
const vl = (v: number) => VL[v] ?? `${v}`;
const isRed = (s: Suit) => s === 'hearts' || s === 'diamonds';
const opp = (a: Suit, b: Suit) => isRed(a) !== isRed(b);
const CW = 62, CH = 88;
const FD_STEP = 14, FU_STEP = 20;

// ─── Game logic ───────────────────────────────────────────────────────────────

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

// Remove selected cards from their source pile
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

// Try to move selection to a tableau column; returns new state or null if invalid
function tryMoveToTab(g: G, destCol: number): G | null {
  if (!g.sel) return null;
  const cards = getSelCards(g);
  if (!cards.length) return null;
  if (!canTab(cards[0], g.tab[destCol])) return null;
  // Don't move to same source column
  if (g.sel.from === 'tableau' && (g.sel as { from: 'tableau'; col: number; idx: number }).col === destCol) return null;

  const { waste, fnd, tab, bonus } = removeFromSrc(g, cards);
  const selFromFoundation = g.sel.from === 'foundation';
  tab[destCol] = [...tab[destCol], ...cards.map(c => ({ ...c, faceUp: true }))];

  const baseScore = g.sel.from === 'waste' ? 5 : selFromFoundation ? -15 : 0;
  return { ...g, waste, fnd, tab, sel: null, score: g.score + baseScore + bonus, moves: g.moves + 1 };
}

// Try to move selection to a foundation; returns new state or null if invalid
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

function autoFoundation(g: G): G {
  let s = { ...g };
  let changed = true;
  while (changed) {
    changed = false;
    outer: for (let fi = 0; fi < 4; fi++) {
      for (let col = 0; col < 7; col++) {
        const tc = s.tab[col];
        if (!tc.length) continue;
        const card = tc[tc.length - 1];
        if (!card.faceUp || !canFnd(card, s.fnd[fi])) continue;
        const fnd = s.fnd.map((f, i) => i === fi ? [...f, { ...card, faceUp: true }] : f);
        const tab = s.tab.map((c, i) => i === col ? flipTop(c.slice(0, -1)) : c);
        s = { ...s, fnd, tab, score: s.score + 10, moves: s.moves + 1, won: fnd.every(f => f.length === 13) };
        changed = true;
        break outer;
      }
      if (s.waste.length > 0) {
        const card = s.waste[s.waste.length - 1];
        if (canFnd(card, s.fnd[fi])) {
          const fnd = s.fnd.map((f, i) => i === fi ? [...f, { ...card, faceUp: true }] : f);
          s = { ...s, fnd, waste: s.waste.slice(0, -1), score: s.score + 10, moves: s.moves + 1 };
          changed = true;
          break outer;
        }
      }
    }
  }
  return s;
}

// ─── Card visuals ─────────────────────────────────────────────────────────────

function CardBack({ selected }: { selected?: boolean }) {
  return (
    <div style={{
      width: CW, height: CH,
      background: 'repeating-linear-gradient(45deg, #003399, #003399 4px, #0044cc 4px, #0044cc 8px)',
      border: selected ? '2px solid #ffff00' : '1px solid #222',
      borderRadius: 4,
      boxSizing: 'border-box',
      cursor: 'pointer',
      flexShrink: 0,
    }} />
  );
}

function CardFace({ card, selected }: { card: Card; selected?: boolean }) {
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
    }}>
      <div style={{ position: 'absolute', top: 2, left: 4, fontSize: 11, fontWeight: 'bold', color, lineHeight: 1.1 }}>
        {vl(card.value)}<br />{SYM[card.suit]}
      </div>
      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', fontSize: 28, color, pointerEvents: 'none' }}>
        {SYM[card.suit]}
      </div>
      <div style={{ position: 'absolute', bottom: 2, right: 4, fontSize: 11, fontWeight: 'bold', color, lineHeight: 1.1, transform: 'rotate(180deg)' }}>
        {vl(card.value)}<br />{SYM[card.suit]}
      </div>
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

// ─── Column offset helper ─────────────────────────────────────────────────────

function colTop(col: Card[], ri: number): number {
  let top = 0;
  for (let i = 0; i < ri; i++) top += col[i].faceUp ? FU_STEP : FD_STEP;
  return top;
}

function colHeight(col: Card[]): number {
  if (!col.length) return CH;
  return colTop(col, col.length - 1) + CH;
}

// ─── Main component ───────────────────────────────────────────────────────────

export function Solitaire() {
  const [g, setG] = useState<G>(newGame);

  const reset = () => setG(newGame());

  // Stock click: flip or recycle
  const onStock = () => setG(prev => {
    if (prev.stock.length === 0) {
      return { ...prev, stock: [...prev.waste].reverse().map(c => ({ ...c, faceUp: false })), waste: [], sel: null, score: Math.max(0, prev.score - 100) };
    }
    const top = { ...prev.stock[prev.stock.length - 1], faceUp: true };
    return { ...prev, stock: prev.stock.slice(0, -1), waste: [...prev.waste, top], sel: null, moves: prev.moves + 1 };
  });

  // Waste click: select or deselect
  const onWaste = () => setG(prev => {
    if (!prev.waste.length) return prev;
    if (prev.sel?.from === 'waste') return { ...prev, sel: null };
    return { ...prev, sel: { from: 'waste' } };
  });

  // Foundation click: move-to or select
  const onFnd = (fi: number) => setG(prev => {
    if (prev.sel) {
      const moved = tryMoveToFnd(prev, fi);
      if (moved) return moved;
      // Move failed: if foundation has cards, select it instead
      if (prev.fnd[fi].length > 0) return { ...prev, sel: { from: 'foundation', fi } };
      return { ...prev, sel: null };
    }
    if (!prev.fnd[fi].length) return prev;
    return { ...prev, sel: { from: 'foundation', fi } };
  });

  // Tableau card click: move-to, select, or flip
  const onTabCard = (col: number, cardIdx: number) => (e: React.MouseEvent) => {
    e.stopPropagation();
    setG(prev => {
      const colCards = prev.tab[col];
      if (cardIdx >= colCards.length) return prev;
      const card = colCards[cardIdx];

      if (prev.sel) {
        // Try to move selected cards to this column
        const moved = tryMoveToTab(prev, col);
        if (moved) return moved;

        // Move failed: try to select this card instead
        if (card.faceUp) return { ...prev, sel: { from: 'tableau', col, idx: cardIdx } };
        // Face-down top card: flip it
        if (cardIdx === colCards.length - 1) {
          const tab = prev.tab.map(c => [...c]);
          tab[col][cardIdx] = { ...card, faceUp: true };
          return { ...prev, tab, score: prev.score + 5, moves: prev.moves + 1, sel: null };
        }
        return { ...prev, sel: null };
      }

      // Nothing selected
      if (!card.faceUp) {
        if (cardIdx === colCards.length - 1) {
          const tab = prev.tab.map(c => [...c]);
          tab[col][cardIdx] = { ...card, faceUp: true };
          return { ...prev, tab, score: prev.score + 5, moves: prev.moves + 1 };
        }
        return prev;
      }

      // Toggle selection
      if (prev.sel?.from === 'tableau') {
        const s = prev.sel as { from: 'tableau'; col: number; idx: number };
        if (s.col === col && s.idx === cardIdx) return { ...prev, sel: null };
      }
      return { ...prev, sel: { from: 'tableau', col, idx: cardIdx } };
    });
  };

  // Empty area of column (no card): move King there
  const onTabCol = (col: number) => setG(prev => {
    if (!prev.sel) return prev;
    const moved = tryMoveToTab(prev, col);
    return moved ?? { ...prev, sel: null };
  });

  const onAutoFinish = () => setG(prev => autoFoundation(prev));

  // ─── Render ──────────────────────────────────────────────────────────────

  const isFndSel = (fi: number) => g.sel?.from === 'foundation' && (g.sel as { from: 'foundation'; fi: number }).fi === fi;
  const isTabSel = (col: number, ri: number) =>
    g.sel?.from === 'tableau' &&
    (g.sel as { from: 'tableau'; col: number; idx: number }).col === col &&
    ri >= (g.sel as { from: 'tableau'; col: number; idx: number }).idx;

  return (
    <div
      style={{ background: '#1a5c1a', width: '100%', height: '100%', padding: '10px 8px', boxSizing: 'border-box', overflow: 'auto', fontFamily: '"MS Sans Serif", sans-serif', position: 'relative' }}
      onClick={() => setG(prev => prev.sel ? { ...prev, sel: null } : prev)}
    >
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
        <button onClick={reset} style={{ marginLeft: 'auto', padding: '2px 10px', fontSize: 11, cursor: 'pointer', background: '#c0c0c0', border: '2px outset #fff' }}>
          Nouvelle partie
        </button>
        <button onClick={onAutoFinish} style={{ padding: '2px 10px', fontSize: 11, cursor: 'pointer', background: '#c0c0c0', border: '2px outset #fff' }}>
          Auto-finish
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
        <div onClick={onWaste} style={{ cursor: 'pointer' }}>
          {g.waste.length === 0
            ? <EmptySlot />
            : <CardFace card={g.waste[g.waste.length - 1]} selected={g.sel?.from === 'waste'} />
          }
        </div>

        {/* Spacer */}
        <div style={{ width: CW }} />

        {/* Foundations */}
        {g.fnd.map((pile, fi) => (
          <div key={fi} onClick={() => onFnd(fi)} style={{ cursor: 'pointer' }}>
            {pile.length === 0
              ? <EmptySlot label={['A♥', 'A♦', 'A♣', 'A♠'][fi]} onClick={() => onFnd(fi)} />
              : <CardFace card={pile[pile.length - 1]} selected={isFndSel(fi)} />
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
                onClick={onTabCard(ci, ri)}
                style={{ position: 'absolute', top: colTop(col, ri), left: 0, zIndex: ri }}
              >
                {card.faceUp
                  ? <CardFace card={card} selected={isTabSel(ci, ri)} />
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
