import type { ReactNode } from 'react';
import type { WindowType } from '../../types';
import { DesktopIcon } from './DesktopIcon';
import { ComputerIcon, NotepadIcon, RecycleBinIcon, InternetExplorerIcon, CalculatorIcon, PaintIcon, ExplorerIcon, MailIcon } from '../../icons';

interface DesktopProps {
  onOpenWindow: (type: WindowType) => void;
  onTriggerBSOD: () => void;
  onCloseStartMenu: () => void;
  children: ReactNode;
}

type IconAction =
  | { type: 'openWindow'; windowType: WindowType }
  | { type: 'triggerBSOD' };

interface DesktopIconConfig {
  id: string;
  x: number;
  y: number;
  icon: ReactNode;
  label: string;
  action: IconAction;
}

const DESKTOP_ICONS: DesktopIconConfig[] = [
  {
    id: 'mycomputer', x: 10, y: 10,
    icon: <ComputerIcon />, label: 'Poste de travail',
    action: { type: 'openWindow', windowType: 'mycomputer' },
  },
  {
    id: 'notepad', x: 10, y: 100,
    icon: <NotepadIcon />, label: 'Bloc-notes',
    action: { type: 'openWindow', windowType: 'notepad' },
  },
  {
    id: 'recyclebin', x: 10, y: 190,
    icon: <RecycleBinIcon />, label: 'Corbeille',
    action: { type: 'openWindow', windowType: 'recyclebin' },
  },
  {
    id: 'calculator', x: 10, y: 280,
    icon: <CalculatorIcon />, label: 'Calculatrice',
    action: { type: 'openWindow', windowType: 'calculator' },
  },
  {
    id: 'explorer', x: 10, y: 370,
    icon: <ExplorerIcon />, label: 'Explorateur',
    action: { type: 'openWindow', windowType: 'explorer' },
  },
  {
    id: 'mail',
    x: 10, y: 460,
    icon: <MailIcon />,
    label: 'Pindows Mail',
    action: { type: 'openWindow', windowType: 'mail' },
  },
  {
    id: 'paint',
    x: 10, y: 550,
    icon: <PaintIcon />,
    label: 'Paint',
    action: { type: 'openWindow', windowType: 'paint' },
  },
  {
    id: 'ie',
    x: 10, y: 640,
    icon: <InternetExplorerIcon />,
    label: 'Internet Explorer',
    action: { type: 'triggerBSOD' },
  },
];

export function Desktop({ onOpenWindow, onTriggerBSOD, onCloseStartMenu, children }: DesktopProps) {
  const handleIconAction = (action: IconAction) => {
    if (action.type === 'openWindow') {
      onOpenWindow(action.windowType);
    } else {
      onTriggerBSOD();
    }
  };

  return (
    <div id="desktop" onClick={onCloseStartMenu}>
      {DESKTOP_ICONS.map(({ id, x, y, icon, label, action }) => (
        <DesktopIcon
          key={id}
          x={x}
          y={y}
          icon={icon}
          label={label}
          onDoubleClick={() => handleIconAction(action)}
        />
      ))}
      {children}
    </div>
  );
}
