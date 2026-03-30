import type { WindowType } from '../../types';
import { ComputerIcon, NotepadIcon, CalculatorIcon, PaintIcon, ExplorerIcon, HelpIcon, ShutdownIcon } from '../../icons';

interface StartMenuProps {
  visible: boolean;
  onOpenWindow: (type: WindowType) => void;
  onShutDown: () => void;
}

/**
 * Menu Demarrer avec la barre laterale "Pindows 98"
 * et les raccourcis vers les applications.
 */
export function StartMenu({ visible, onOpenWindow, onShutDown }: StartMenuProps) {
  if (!visible) return null;

  return (
    <div id="start-menu" className="visible">
      <div id="start-menu-sidebar">
        <span>Pindows 98</span>
      </div>
      <div id="start-menu-items">
        <div className="start-menu-item" onClick={() => onOpenWindow('mycomputer')}>
          <ComputerIcon size={16} />
          Poste de travail
        </div>
        <div className="start-menu-item" onClick={() => onOpenWindow('notepad')}>
          <NotepadIcon size={16} />
          Bloc-notes
        </div>
        <div className="start-menu-item" onClick={() => onOpenWindow('calculator')}>
          <CalculatorIcon size={16} />
          Calculatrice
        </div>
        <div className="start-menu-item" onClick={() => onOpenWindow('paint')}>
          <PaintIcon size={16} />
          Paint
        </div>
        <div className="start-menu-item" onClick={() => onOpenWindow('explorer')}>
          <ExplorerIcon size={16} />
          Explorateur
        </div>
        <div className="start-menu-separator" />
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
