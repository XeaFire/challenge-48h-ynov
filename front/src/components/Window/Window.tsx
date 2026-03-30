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
  const dragOrigin = useRef<{
    mouseX: number;
    mouseY: number;
    windowX: number;
    windowY: number;
  } | null>(null);

  const handleTitleBarMouseDown = useCallback((event: MouseEvent) => {
    // Ignorer si on clique sur un bouton de la barre de titre
    if ((event.target as HTMLElement).closest('.window-btn')) return;
    onFocus();
    if (state.maximized) return;

    dragOrigin.current = {
      mouseX: event.clientX,
      mouseY: event.clientY,
      windowX: state.x,
      windowY: state.y,
    };

    const handleMouseMove = (moveEvent: globalThis.MouseEvent) => {
      if (!dragOrigin.current) return;
      const deltaX = moveEvent.clientX - dragOrigin.current.mouseX;
      const deltaY = moveEvent.clientY - dragOrigin.current.mouseY;
      onMove(dragOrigin.current.windowX + deltaX, dragOrigin.current.windowY + deltaY);
    };

    const handleMouseUp = () => {
      dragOrigin.current = null;
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
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
    <div className={windowClasses} style={style} onMouseDown={onFocus}>
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
