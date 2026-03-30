import type { ReactNode } from 'react';
import type { WindowType } from '../../types';
import { useGame } from '../../game/GameContext';
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
  const { gameState } = useGame();

  const handleIconAction = (action: IconAction) => {
    if (action.type === 'openWindow') {
      onOpenWindow(action.windowType);
    } else {
      onTriggerBSOD();
    }
  };

  const visibleIcons = DESKTOP_ICONS.filter(icon => {
    if (icon.action.type === 'triggerBSOD') return gameState.unlockedApps.includes('ie');
    return gameState.unlockedApps.includes(icon.action.windowType);
  });

  // Recompute Y positions so there are no gaps
  const repositioned = visibleIcons.map((icon, i) => ({
    ...icon,
    y: 10 + i * 90,
  }));

  return (
    <div id="desktop" onClick={onCloseStartMenu}>
      {repositioned.map(({ id, x, y, icon, label, action }) => (
        <DesktopIcon
          key={id}
          x={x}
          y={y}
          icon={icon}
          label={label}
          shaking={gameState.shakingIcon === id}
          bleeding={gameState.bleedingIcon === id}
          onDoubleClick={() => handleIconAction(action)}
        />
      ))}
      {children}
    </div>
  );
}
