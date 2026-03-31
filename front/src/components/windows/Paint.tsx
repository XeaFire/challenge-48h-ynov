import { useRef, useState, useCallback, useEffect } from 'react';

type Tool = 'pencil' | 'brush' | 'eraser' | 'line' | 'rect' | 'ellipse' | 'fill' | 'picker' | 'spray';

const COLORS = [
  '#000000', '#808080', '#800000', '#808000', '#008000', '#008080', '#000080', '#800080',
  '#808040', '#004040', '#0080ff', '#004080', '#8000ff', '#804000',
  '#ffffff', '#c0c0c0', '#ff0000', '#ffff00', '#00ff00', '#00ffff', '#0000ff', '#ff00ff',
  '#ffff80', '#00ff80', '#80ffff', '#0080ff', '#ff0080', '#ff8000',
];

const TOOL_ICONS: Record<Tool, string> = {
  pencil: '✏',
  brush: '🖌',
  eraser: '⬜',
  line: '╲',
  rect: '▭',
  ellipse: '◯',
  fill: '🪣',
  picker: '💉',
  spray: '░',
};

const TOOL_LABELS: Record<Tool, string> = {
  pencil: 'Crayon',
  brush: 'Pinceau',
  eraser: 'Gomme',
  line: 'Ligne',
  rect: 'Rectangle',
  ellipse: 'Ellipse',
  fill: 'Remplissage',
  picker: 'Pipette',
  spray: 'Aérographe',
};

const LINE_WIDTHS = [1, 2, 3, 4, 5];

function drawLine(ctx: CanvasRenderingContext2D, x1: number, y1: number, x2: number, y2: number, strokeColor: string, width: number) {
  ctx.beginPath();
  ctx.strokeStyle = strokeColor;
  ctx.lineWidth = width;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
}

function drawRect(ctx: CanvasRenderingContext2D, x1: number, y1: number, x2: number, y2: number, strokeColor: string, width: number) {
  ctx.beginPath();
  ctx.strokeStyle = strokeColor;
  ctx.lineWidth = width;
  ctx.strokeRect(Math.min(x1, x2), Math.min(y1, y2), Math.abs(x2 - x1), Math.abs(y2 - y1));
}

function drawEllipse(ctx: CanvasRenderingContext2D, x1: number, y1: number, x2: number, y2: number, strokeColor: string, width: number) {
  const cx = (x1 + x2) / 2;
  const cy = (y1 + y2) / 2;
  const rx = Math.abs(x2 - x1) / 2;
  const ry = Math.abs(y2 - y1) / 2;
  ctx.beginPath();
  ctx.strokeStyle = strokeColor;
  ctx.lineWidth = width;
  ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
  ctx.stroke();
}

function spray(ctx: CanvasRenderingContext2D, x: number, y: number, sprayColor: string, radius: number) {
  const density = radius * 2;
  ctx.fillStyle = sprayColor;
  for (let i = 0; i < density; i++) {
    const angle = Math.random() * Math.PI * 2;
    const r = Math.random() * radius;
    const px = x + Math.cos(angle) * r;
    const py = y + Math.sin(angle) * r;
    ctx.fillRect(px, py, 1, 1);
  }
}

export function Paint() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const previewRef = useRef<HTMLCanvasElement>(null);
  const [tool, setTool] = useState<Tool>('pencil');
  const [color, setColor] = useState('#000000');
  const [secondaryColor, setSecondaryColor] = useState('#ffffff');
  const [lineWidth, setLineWidth] = useState(2);
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPos, setStartPos] = useState<{ x: number; y: number } | null>(null);
  const [lastPos, setLastPos] = useState<{ x: number; y: number } | null>(null);
  const [cursorPos, setCursorPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, []);

  const getPos = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    return {
      x: Math.round(e.clientX - rect.left),
      y: Math.round(e.clientY - rect.top),
    };
  };

  const getCtx = () => {
    return canvasRef.current?.getContext('2d') ?? null;
  };

  const getPreviewCtx = () => {
    return previewRef.current?.getContext('2d') ?? null;
  };

  const floodFill = useCallback((startX: number, startY: number, fillColor: string) => {
    const ctx = getCtx();
    const canvas = canvasRef.current;
    if (!ctx || !canvas) return;

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    const w = canvas.width;
    const h = canvas.height;

    const idx = (startY * w + startX) * 4;
    const targetR = data[idx];
    const targetG = data[idx + 1];
    const targetB = data[idx + 2];
    const targetA = data[idx + 3];

    const temp = document.createElement('canvas').getContext('2d')!;
    temp.fillStyle = fillColor;
    temp.fillRect(0, 0, 1, 1);
    const fillData = temp.getImageData(0, 0, 1, 1).data;
    const fillR = fillData[0];
    const fillG = fillData[1];
    const fillB = fillData[2];

    if (targetR === fillR && targetG === fillG && targetB === fillB && targetA === 255) return;

    const stack: [number, number][] = [[startX, startY]];
    const visited = new Uint8Array(w * h);

    while (stack.length > 0) {
      const [x, y] = stack.pop()!;
      const i = y * w + x;
      if (x < 0 || x >= w || y < 0 || y >= h || visited[i]) continue;

      const pi = i * 4;
      if (Math.abs(data[pi] - targetR) > 10 || Math.abs(data[pi + 1] - targetG) > 10 ||
          Math.abs(data[pi + 2] - targetB) > 10 || Math.abs(data[pi + 3] - targetA) > 10) continue;

      visited[i] = 1;
      data[pi] = fillR;
      data[pi + 1] = fillG;
      data[pi + 2] = fillB;
      data[pi + 3] = 255;

      stack.push([x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]);
    }

    ctx.putImageData(imageData, 0, 0);
  }, []);

  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const pos = getPos(e);
    const ctx = getCtx();
    if (!ctx) return;

    const activeColor = e.button === 2 ? secondaryColor : color;

    setIsDrawing(true);
    setStartPos(pos);
    setLastPos(pos);

    if (tool === 'pencil') {
      drawLine(ctx, pos.x, pos.y, pos.x, pos.y, activeColor, 1);
    } else if (tool === 'brush') {
      drawLine(ctx, pos.x, pos.y, pos.x, pos.y, activeColor, lineWidth);
    } else if (tool === 'eraser') {
      drawLine(ctx, pos.x, pos.y, pos.x, pos.y, '#ffffff', lineWidth * 4);
    } else if (tool === 'spray') {
      spray(ctx, pos.x, pos.y, activeColor, lineWidth * 4);
    } else if (tool === 'fill') {
      floodFill(pos.x, pos.y, activeColor);
      setIsDrawing(false);
    } else if (tool === 'picker') {
      const pixel = ctx.getImageData(pos.x, pos.y, 1, 1).data;
      const hex = '#' + [pixel[0], pixel[1], pixel[2]].map(c => c.toString(16).padStart(2, '0')).join('');
      if (e.button === 2) {
        setSecondaryColor(hex);
      } else {
        setColor(hex);
      }
      setIsDrawing(false);
    }
  }, [tool, color, secondaryColor, lineWidth, floodFill]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const pos = getPos(e);
    setCursorPos(pos);

    if (!isDrawing) return;

    const activeColor = e.buttons === 2 ? secondaryColor : color;

    if (tool === 'pencil') {
      const ctx = getCtx();
      if (ctx && lastPos) {
        drawLine(ctx, lastPos.x, lastPos.y, pos.x, pos.y, activeColor, 1);
        setLastPos(pos);
      }
    } else if (tool === 'brush') {
      const ctx = getCtx();
      if (ctx && lastPos) {
        drawLine(ctx, lastPos.x, lastPos.y, pos.x, pos.y, activeColor, lineWidth);
        setLastPos(pos);
      }
    } else if (tool === 'eraser') {
      const ctx = getCtx();
      if (ctx && lastPos) {
        drawLine(ctx, lastPos.x, lastPos.y, pos.x, pos.y, '#ffffff', lineWidth * 4);
        setLastPos(pos);
      }
    } else if (tool === 'spray') {
      const ctx = getCtx();
      if (ctx) {
        spray(ctx, pos.x, pos.y, activeColor, lineWidth * 4);
      }
    } else if (tool === 'line' || tool === 'rect' || tool === 'ellipse') {
      const previewCtx = getPreviewCtx();
      const canvas = previewRef.current;
      if (previewCtx && canvas && startPos) {
        previewCtx.clearRect(0, 0, canvas.width, canvas.height);
        if (tool === 'line') drawLine(previewCtx, startPos.x, startPos.y, pos.x, pos.y, activeColor, lineWidth);
        else if (tool === 'rect') drawRect(previewCtx, startPos.x, startPos.y, pos.x, pos.y, activeColor, lineWidth);
        else if (tool === 'ellipse') drawEllipse(previewCtx, startPos.x, startPos.y, pos.x, pos.y, activeColor, lineWidth);
      }
    }
  }, [isDrawing, tool, color, secondaryColor, lineWidth, lastPos, startPos]);

  const handleMouseUp = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;

    const pos = getPos(e);
    const ctx = getCtx();
    const activeColor = e.button === 2 ? secondaryColor : color;

    if (ctx && startPos) {
      if (tool === 'line') drawLine(ctx, startPos.x, startPos.y, pos.x, pos.y, activeColor, lineWidth);
      else if (tool === 'rect') drawRect(ctx, startPos.x, startPos.y, pos.x, pos.y, activeColor, lineWidth);
      else if (tool === 'ellipse') drawEllipse(ctx, startPos.x, startPos.y, pos.x, pos.y, activeColor, lineWidth);
    }

    const previewCtx = getPreviewCtx();
    const previewCanvas = previewRef.current;
    if (previewCtx && previewCanvas) previewCtx.clearRect(0, 0, previewCanvas.width, previewCanvas.height);
    setIsDrawing(false);
    setStartPos(null);
    setLastPos(null);
  }, [isDrawing, tool, color, secondaryColor, lineWidth, startPos]);

  const tools: Tool[] = ['pencil', 'brush', 'eraser', 'spray', 'fill', 'picker', 'line', 'rect', 'ellipse'];

  return (
    <div className="paint">
      <div className="paint-toolbar">
        <div className="paint-tools">
          {tools.map(t => (
            <button
              key={t}
              className={`paint-tool-btn${tool === t ? ' active' : ''}`}
              onClick={() => setTool(t)}
              title={TOOL_LABELS[t]}
            >
              {TOOL_ICONS[t]}
            </button>
          ))}
        </div>
        <div className="paint-line-widths">
          {LINE_WIDTHS.map(w => (
            <button
              key={w}
              className={`paint-width-btn${lineWidth === w ? ' active' : ''}`}
              onClick={() => setLineWidth(w)}
              title={`${w}px`}
            >
              <div style={{ width: '80%', height: w, background: '#000', borderRadius: w / 2 }} />
            </button>
          ))}
        </div>
      </div>

      <div className="paint-canvas-area">
        <div className="paint-canvas-wrapper">
          <canvas
            ref={canvasRef}
            width={800}
            height={600}
            className="paint-canvas"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onContextMenu={e => e.preventDefault()}
          />
          <canvas
            ref={previewRef}
            width={800}
            height={600}
            className="paint-canvas-preview"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onContextMenu={e => e.preventDefault()}
          />
        </div>
      </div>

      <div className="paint-bottom">
        <div className="paint-active-colors">
          <div
            className="paint-color-active-fg"
            style={{ background: color }}
            title="Couleur principale"
          />
          <div
            className="paint-color-active-bg"
            style={{ background: secondaryColor }}
            title="Couleur secondaire"
          />
        </div>
        <div className="paint-palette">
          {COLORS.map(c => (
            <button
              key={c}
              className="paint-color-btn"
              style={{ background: c }}
              onClick={() => setColor(c)}
              onContextMenu={(e) => { e.preventDefault(); setSecondaryColor(c); }}
              title={c}
            />
          ))}
        </div>
        <div className="paint-coords">
          {cursorPos.x}, {cursorPos.y}px
        </div>
      </div>
    </div>
  );
}
