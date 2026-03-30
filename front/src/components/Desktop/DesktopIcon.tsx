import type { ReactNode } from 'react';

interface DesktopIconProps {
  x: number;
  y: number;
  icon: ReactNode;
  label: string;
  shaking?: boolean;
  bleeding?: boolean;
  onDoubleClick: () => void;
}

export function DesktopIcon({ x, y, icon, label, shaking, bleeding, onDoubleClick }: DesktopIconProps) {
  return (
    <div
      className={`desktop-icon${shaking ? ' desktop-icon-shaking' : ''}`}
      style={{ left: x, top: y }}
      onDoubleClick={onDoubleClick}
    >
      {icon}
      <span className="icon-label">{label}</span>
      {/* Splatter particles — only during shake */}
      {shaking && (
        <div className="blood-splash-container">
          {Array.from({ length: 20 }, (_, i) => (
            <div key={`s${i}`} className={`blood-splat blood-splat-${i}`} />
          ))}
        </div>
      )}
      {/* Blood streams — persist forever once triggered */}
      {bleeding && (
        <div className="blood-streams">
          <div className="blood-stream blood-stream-0" />
          <div className="blood-stream blood-stream-1" />
          <div className="blood-stream blood-stream-2" />
          <div className="blood-stream blood-stream-3" />
          <div className="blood-stream blood-stream-4" />
          <div className="blood-stream blood-stream-5" />
          <div className="blood-stream blood-stream-6" />
          <div className="blood-stream blood-stream-7" />
        </div>
      )}
    </div>
  );
}
