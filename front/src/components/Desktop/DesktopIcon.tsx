import type { ReactNode } from 'react';

interface DesktopIconProps {
  x: number;
  y: number;
  icon: ReactNode;
  label: string;
  onDoubleClick: () => void;
}

export function DesktopIcon({ x, y, icon, label, onDoubleClick }: DesktopIconProps) {
  return (
    <div
      className="desktop-icon"
      style={{ left: x, top: y }}
      onDoubleClick={onDoubleClick}
    >
      {icon}
      <span className="icon-label">{label}</span>
    </div>
  );
}
