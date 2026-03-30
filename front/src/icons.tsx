const PIXEL_STYLE: React.CSSProperties = { imageRendering: 'pixelated' };

export function ComputerIcon({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" style={PIXEL_STYLE}>
      <rect x="3" y="3" width="26" height="18" fill="#c0c0c0" stroke="#000" strokeWidth="1" />
      <rect x="5" y="5" width="22" height="14" fill="#000080" />
      <rect x="10" y="22" width="12" height="2" fill="#808080" />
      <rect x="7" y="24" width="18" height="2" fill="#c0c0c0" stroke="#000" strokeWidth="0.5" />
    </svg>
  );
}

export function NotepadIcon({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" style={PIXEL_STYLE}>
      <rect x="6" y="2" width="20" height="28" fill="#fff" stroke="#000" strokeWidth="1" />
      <line x1="9" y1="8" x2="23" y2="8" stroke="#000080" strokeWidth="0.5" />
      <line x1="9" y1="12" x2="23" y2="12" stroke="#000080" strokeWidth="0.5" />
      <line x1="9" y1="16" x2="23" y2="16" stroke="#000080" strokeWidth="0.5" />
      <line x1="9" y1="20" x2="18" y2="20" stroke="#000080" strokeWidth="0.5" />
      <rect x="4" y="2" width="3" height="6" fill="#808080" stroke="#000" strokeWidth="0.5" />
    </svg>
  );
}

export function RecycleBinIcon({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" style={PIXEL_STYLE}>
      <rect x="8" y="6" width="16" height="22" rx="1" fill="#c0c0c0" stroke="#000" strokeWidth="1" />
      <rect x="6" y="4" width="20" height="3" fill="#808080" stroke="#000" strokeWidth="0.5" />
      <rect x="12" y="2" width="8" height="3" fill="#808080" stroke="#000" strokeWidth="0.5" />
      <line x1="12" y1="10" x2="12" y2="24" stroke="#808080" strokeWidth="1" />
      <line x1="16" y1="10" x2="16" y2="24" stroke="#808080" strokeWidth="1" />
      <line x1="20" y1="10" x2="20" y2="24" stroke="#808080" strokeWidth="1" />
    </svg>
  );
}

export function InternetExplorerIcon({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" style={PIXEL_STYLE}>
      <rect x="2" y="4" width="28" height="24" rx="2" fill="#808080" stroke="#000" strokeWidth="1" />
      <rect x="4" y="6" width="24" height="16" fill="#000080" />
      <text x="16" y="17" textAnchor="middle" fill="#fff" fontSize="8" fontFamily="monospace">IE</text>
      <rect x="10" y="24" width="12" height="3" fill="#c0c0c0" />
    </svg>
  );
}

export function HelpIcon() {
  return (
    <svg width={16} height={16} viewBox="0 0 16 16" style={PIXEL_STYLE}>
      <circle cx="8" cy="8" r="7" fill="#000080" />
      <text x="8" y="12" textAnchor="middle" fill="#fff" fontSize="10" fontWeight="bold">?</text>
    </svg>
  );
}

export function ShutdownIcon() {
  return (
    <svg width={16} height={16} viewBox="0 0 16 16" style={PIXEL_STYLE}>
      <rect x="2" y="4" width="12" height="10" rx="1" fill="#808080" />
      <rect x="5" y="1" width="6" height="4" fill="#c0c0c0" stroke="#000" strokeWidth="0.3" />
      <circle cx="8" cy="10" r="2" fill="#ff0000" />
    </svg>
  );
}

export function StartLogo() {
  return (
    <svg width={16} height={16} viewBox="0 0 16 16">
      <rect x="1" y="1" width="6" height="6" fill="#ff0000" />
      <rect x="9" y="1" width="6" height="6" fill="#00ff00" />
      <rect x="1" y="9" width="6" height="6" fill="#0000ff" />
      <rect x="9" y="9" width="6" height="6" fill="#ffff00" />
    </svg>
  );
}

export function FolderIcon({ label }: { label: string }) {
  return (
    <svg width={32} height={32} viewBox="0 0 32 32" style={PIXEL_STYLE}>
      <rect x="4" y="6" width="24" height="20" rx="1" fill="#c0c0c0" stroke="#000" strokeWidth="0.5" />
      <rect x="4" y="4" width="14" height="4" rx="1" fill="#c0c0c0" stroke="#000" strokeWidth="0.5" />
      <text x="16" y="20" textAnchor="middle" fill="#000" fontSize="7" fontWeight="bold">{label}</text>
    </svg>
  );
}

export function CDDriveIcon() {
  return (
    <svg width={32} height={32} viewBox="0 0 32 32" style={PIXEL_STYLE}>
      <circle cx="16" cy="16" r="12" fill="#c0c0c0" stroke="#000" strokeWidth="0.5" />
      <circle cx="16" cy="16" r="4" fill="#fff" stroke="#000" strokeWidth="0.5" />
      <circle cx="16" cy="16" r="1" fill="#000" />
    </svg>
  );
}

export function FloppyDiskIcon() {
  return (
    <svg width={32} height={32} viewBox="0 0 32 32" style={PIXEL_STYLE}>
      <rect x="6" y="8" width="20" height="16" rx="1" fill="#808080" stroke="#000" strokeWidth="0.5" />
      <rect x="8" y="4" width="16" height="6" fill="#c0c0c0" stroke="#000" strokeWidth="0.5" />
      <rect x="10" y="6" width="6" height="2" fill="#fff" />
    </svg>
  );
}

export function ExplorerIcon({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" style={PIXEL_STYLE}>
      <rect x="3" y="6" width="26" height="20" rx="1" fill="#c0c0c0" stroke="#000" strokeWidth="0.5" />
      <rect x="3" y="4" width="14" height="4" rx="1" fill="#ffcc00" stroke="#000" strokeWidth="0.5" />
      <rect x="3" y="6" width="26" height="20" rx="1" fill="#ffcc00" stroke="#000" strokeWidth="0.5" />
      <rect x="5" y="9" width="22" height="15" fill="#fff" stroke="#808080" strokeWidth="0.5" />
      <rect x="7" y="11" width="6" height="5" fill="#ffcc00" stroke="#808080" strokeWidth="0.3" />
      <rect x="15" y="11" width="6" height="5" fill="#ffcc00" stroke="#808080" strokeWidth="0.3" />
      <line x1="7" y1="19" x2="25" y2="19" stroke="#808080" strokeWidth="0.5" />
      <line x1="7" y1="21" x2="25" y2="21" stroke="#808080" strokeWidth="0.5" />
    </svg>
  );
}

export function FileIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" style={PIXEL_STYLE}>
      <rect x="2" y="1" width="9" height="14" fill="#fff" stroke="#000" strokeWidth="0.5" />
      <polygon points="11,1 14,4 11,4" fill="#c0c0c0" stroke="#000" strokeWidth="0.3" />
      <rect x="11" y="4" width="3" height="11" fill="#fff" stroke="#000" strokeWidth="0.5" />
      <line x1="4" y1="6" x2="12" y2="6" stroke="#000080" strokeWidth="0.3" />
      <line x1="4" y1="8" x2="12" y2="8" stroke="#000080" strokeWidth="0.3" />
      <line x1="4" y1="10" x2="10" y2="10" stroke="#000080" strokeWidth="0.3" />
    </svg>
  );
}

export function SmallFolderIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" style={PIXEL_STYLE}>
      <rect x="1" y="4" width="14" height="10" rx="0.5" fill="#ffcc00" stroke="#000" strokeWidth="0.5" />
      <rect x="1" y="2" width="7" height="3" rx="0.5" fill="#ffcc00" stroke="#000" strokeWidth="0.5" />
    </svg>
  );
}

export function PaintIcon({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" style={PIXEL_STYLE}>
      <rect x="4" y="4" width="24" height="24" fill="#fff" stroke="#000" strokeWidth="1" />
      <rect x="6" y="6" width="20" height="20" fill="#fff" />
      <rect x="8" y="10" width="6" height="4" fill="#ff0000" />
      <rect x="12" y="8" width="5" height="6" fill="#00ff00" />
      <rect x="16" y="12" width="7" height="5" fill="#0000ff" />
      <rect x="10" y="14" width="5" height="5" fill="#ffff00" />
      <line x1="22" y1="4" x2="28" y2="2" stroke="#808080" strokeWidth="1.5" />
      <line x1="24" y1="8" x2="28" y2="2" stroke="#ffcc00" strokeWidth="2" />
      <circle cx="28" cy="2" r="1.5" fill="#ffcc00" />
    </svg>
  );
}

export function CalculatorIcon({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" style={PIXEL_STYLE}>
      <rect x="5" y="2" width="22" height="28" rx="1" fill="#c0c0c0" stroke="#000" strokeWidth="1" />
      <rect x="7" y="4" width="18" height="6" fill="#8fbc8f" stroke="#808080" strokeWidth="0.5" />
      <rect x="7" y="12" width="4" height="4" fill="#fff" stroke="#808080" strokeWidth="0.3" />
      <rect x="13" y="12" width="4" height="4" fill="#fff" stroke="#808080" strokeWidth="0.3" />
      <rect x="19" y="12" width="4" height="4" fill="#ff8c00" stroke="#808080" strokeWidth="0.3" />
      <rect x="7" y="18" width="4" height="4" fill="#fff" stroke="#808080" strokeWidth="0.3" />
      <rect x="13" y="18" width="4" height="4" fill="#fff" stroke="#808080" strokeWidth="0.3" />
      <rect x="19" y="18" width="4" height="4" fill="#ff8c00" stroke="#808080" strokeWidth="0.3" />
      <rect x="7" y="24" width="4" height="4" fill="#fff" stroke="#808080" strokeWidth="0.3" />
      <rect x="13" y="24" width="4" height="4" fill="#fff" stroke="#808080" strokeWidth="0.3" />
      <rect x="19" y="24" width="4" height="4" fill="#4169e1" stroke="#808080" strokeWidth="0.3" />
    </svg>
  );
}

export function PindowsLogo() {
  return (
    <svg width="64" height="64" viewBox="0 0 64 64">
      <rect x="4" y="4" width="24" height="24" fill="#ff0000" />
      <rect x="36" y="4" width="24" height="24" fill="#00aa00" />
      <rect x="4" y="36" width="24" height="24" fill="#0000ff" />
      <rect x="36" y="36" width="24" height="24" fill="#ffcc00" />
    </svg>
  );
}
