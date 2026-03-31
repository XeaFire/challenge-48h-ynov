import { useRef, useCallback, type ReactNode, type MouseEvent } from 'react';
import type { WindowState } from '../../types';

interface WindowProps {
  state: WindowState;
  isActive: boolean;
  zIndex: number;
  menu?: string[];
  statusbar?: string;
  insetBody?: boolean;
  children: ReactNode;
  onClose: () => void;
  onMinimize: () => void;
  onMaximize: () => void;
  onFocus: () => void;
  onMove: (x: number, y: number) => void;
}

export function Window({
  state,
  isActive,
  zIndex,
  menu,
  statusbar,
  insetBody = true,
  children,
  onClose,
  onMinimize,
  onMaximize,
  onFocus,
  onMove,
}: WindowProps) {
  const elRef = useRef<HTMLDivElement>(null);
  const startRef = useRef<{ mx: number; my: number } | null>(null);

  const handleTitleBarMouseDown = useCallback((event: MouseEvent) => {
    if ((event.target as HTMLElement).closest('.window-btn')) return;
    onFocus();
    if (state.maximized) return;

    startRef.current = { mx: event.clientX, my: event.clientY };

    const onMouseMove = (e: globalThis.MouseEvent) => {
      if (!startRef.current || !elRef.current) return;
      const dx = e.clientX - startRef.current.mx;
      const dy = e.clientY - startRef.current.my;
      elRef.current.style.transform = `translate(${dx}px,${dy}px)`;
    };

    const onMouseUp = (e: globalThis.MouseEvent) => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
      if (!startRef.current) return;
      const dx = e.clientX - startRef.current.mx;
      const dy = e.clientY - startRef.current.my;
      startRef.current = null;
      if (elRef.current) elRef.current.style.transform = '';
      onMove(state.x + dx, state.y + dy);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
    event.preventDefault();
  }, [state.maximized, state.x, state.y, onFocus, onMove]);

  if (state.minimized) return null;

  const style: React.CSSProperties = state.maximized
    ? { left: 0, top: 0, width: '100vw', height: 'calc(100vh - 28px)', zIndex, boxShadow: 'none' }
    : { left: state.x, top: state.y, width: state.width, height: state.height, zIndex };

  const windowClasses = [
    'window',
    state.maximized && 'maximized',
    !isActive && 'inactive',
  ].filter(Boolean).join(' ');

  const bodyClasses = [
    'window-body',
    insetBody && 'window-body-inset',
  ].filter(Boolean).join(' ');

  return (
    <div ref={elRef} className={windowClasses} style={style} onMouseDown={onFocus}>
      <div className="window-titlebar" onMouseDown={handleTitleBarMouseDown}>
        <span className="window-title">{state.title}</span>
        <div className="window-controls">
          <div className="window-btn" onClick={onMinimize}><span>_</span></div>
          <div className="window-btn" onClick={onMaximize}><span>□</span></div>
          <div className="window-btn" onClick={onClose}><span>✕</span></div>
        </div>
      </div>

      {menu && (
        <div className="window-menubar">
          {menu.map(item => (
            <div key={item} className="window-menu-item">{item}</div>
          ))}
        </div>
      )}

      <div className={bodyClasses}>
        {children}
      </div>

      {statusbar && (
        <div className="window-statusbar">{statusbar}</div>
      )}
    </div>
  );
}
