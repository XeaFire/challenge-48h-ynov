import type { WindowType } from '../../types';
import type { ReactNode } from 'react';
import { useGame } from '../../game/GameContext';
import { ComputerIcon, NotepadIcon, CalculatorIcon, PaintIcon, ExplorerIcon, MailIcon, HelpIcon, ShutdownIcon, SettingsIcon } from '../../icons';

interface StartMenuProps {
  visible: boolean;
  onOpenWindow: (type: WindowType) => void;
  onShutDown: () => void;
}

interface MenuEntry {
  app: string;
  windowType: WindowType;
  icon: ReactNode;
  label: string;
}

const MENU_APPS: MenuEntry[] = [
  { app: 'mycomputer', windowType: 'mycomputer', icon: <ComputerIcon size={16} />, label: 'Poste de travail' },
  { app: 'notepad', windowType: 'notepad', icon: <NotepadIcon size={16} />, label: 'Bloc-notes' },
  { app: 'calculator', windowType: 'calculator', icon: <CalculatorIcon size={16} />, label: 'Calculatrice' },
  { app: 'paint', windowType: 'paint', icon: <PaintIcon size={16} />, label: 'Paint' },
  { app: 'explorer', windowType: 'explorer', icon: <ExplorerIcon size={16} />, label: 'Explorateur' },
  { app: 'mail', windowType: 'mail', icon: <MailIcon size={16} />, label: 'Pindows Mail' },
  { app: 'settings', windowType: 'settings', icon: <SettingsIcon size={16} />, label: 'Settings' },
];

export function StartMenu({ visible, onOpenWindow, onShutDown }: StartMenuProps) {
  const { gameState } = useGame();

  if (!visible) return null;

  const unlockedEntries = MENU_APPS.filter(e => gameState.unlockedApps.includes(e.app));

  return (
    <div id="start-menu" className="visible">
      <div id="start-menu-sidebar">
        <span>Pindows 98</span>
      </div>
      <div id="start-menu-items">
        {unlockedEntries.map(e => (
          <div key={e.app} className="start-menu-item" onClick={() => onOpenWindow(e.windowType)}>
            {e.icon}
            {e.label}
          </div>
        ))}
        {unlockedEntries.length > 0 && <div className="start-menu-separator" />}
        <div className="start-menu-item" onClick={() => onOpenWindow('about')}>
          <HelpIcon />
          A propos
        </div>
        <div className="start-menu-separator" />
        <div className="start-menu-item" onClick={onShutDown}>
          <ShutdownIcon />
          Arreter...
        </div>
      </div>
    </div>
  );
}
