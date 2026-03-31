import type { ReactNode } from 'react';

interface DesktopIconProps {
  x: number;
  y: number;
  icon: ReactNode;
  label: string;
  badge?: number;
  shaking?: boolean;
  bleeding?: boolean;
  onDoubleClick: () => void;
}

export function DesktopIcon({ x, y, icon, label, badge, shaking, bleeding, onDoubleClick }: DesktopIconProps) {
  return (
    <div
      className={`desktop-icon${shaking ? ' desktop-icon-shaking' : ''}`}
      style={{ left: x, top: y }}
      onDoubleClick={onDoubleClick}
    >
      <div style={{ position: 'relative', display: 'inline-block' }}>
        {icon}
        {badge != null && badge > 0 && (
          <div style={{
            position: 'absolute', top: -4, right: -6,
            background: '#cc0000', color: '#fff',
            fontSize: 9, fontWeight: 'bold',
            minWidth: 14, height: 14,
            borderRadius: 7, border: '1px solid #800000',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '0 3px',
          }}>
            {badge}
          </div>
        )}
      </div>
      <span className="icon-label">{label}</span>
      {shaking && (
        <div className="blood-splash-container">
          {Array.from({ length: 20 }, (_, i) => (
            <div key={`s${i}`} className={`blood-splat blood-splat-${i}`} />
          ))}
        </div>
      )}
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
