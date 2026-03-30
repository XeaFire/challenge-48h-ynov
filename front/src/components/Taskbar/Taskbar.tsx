import type { WindowState, WindowType } from '../../types';
import { StartButton } from './StartButton';
import { StartMenu } from './StartMenu';
import { TaskbarItem } from './TaskbarItem';
import { Clock } from './Clock';

interface TaskbarProps {
  windows: WindowState[];
  focusOrder: string[];
  activeWindowId: string | null;
  startMenuOpen: boolean;
  onToggleStartMenu: () => void;
  onOpenWindow: (type: WindowType) => void;
  onShutDown: () => void;
  onTaskbarItemClick: (id: string) => void;
}

export function Taskbar({
  windows,
  focusOrder,
  activeWindowId,
  startMenuOpen,
  onToggleStartMenu,
  onOpenWindow,
  onShutDown,
  onTaskbarItemClick,
}: TaskbarProps) {
  const handleOpenWindow = (type: WindowType) => {
    onOpenWindow(type);
    onToggleStartMenu();
  };

  const handleShutDown = () => {
    onToggleStartMenu();
    onShutDown();
  };

  return (
    <>
      <StartMenu
        visible={startMenuOpen}
        onOpenWindow={handleOpenWindow}
        onShutDown={handleShutDown}
      />
      <div id="taskbar">
        <StartButton isMenuOpen={startMenuOpen} onClick={onToggleStartMenu} />
        <div id="taskbar-items">
          {focusOrder.map(id => {
            const window = windows.find(w => w.id === id);
            if (!window) return null;
            return (
              <TaskbarItem
                key={id}
                title={window.title}
                isActive={!window.minimized && id === activeWindowId}
                onClick={() => onTaskbarItemClick(id)}
              />
            );
          })}
        </div>
        <Clock />
      </div>
    </>
  );
}
