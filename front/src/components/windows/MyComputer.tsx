import { FolderIcon, CDDriveIcon, FloppyDiskIcon } from '../../icons';
import type { ReactNode } from 'react';

interface DriveDefinition {
  icon: ReactNode;
  label: string;
}

const DRIVES: DriveDefinition[] = [
  { icon: <FolderIcon label="C:" />, label: 'Disque local (C:)' },
  { icon: <FolderIcon label="D:" />, label: 'Disque local (D:)' },
  { icon: <CDDriveIcon />, label: 'Lecteur CD (E:)' },
  { icon: <FloppyDiskIcon />, label: 'Disquette 3½ (A:)' },
];

export function MyComputer() {
  return (
    <div className="file-grid">
      {DRIVES.map(({ icon, label }) => (
        <div key={label} className="file-item">
          <div className="file-icon">{icon}</div>
          <span className="file-label">{label}</span>
        </div>
      ))}
    </div>
  );
}
