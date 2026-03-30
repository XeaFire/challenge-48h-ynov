import { useState, useCallback } from 'react';
import { useWindowManager } from './hooks/useWindowManager';
import { BootScreen } from './components/BootScreen';
import { BSOD } from './components/BSOD';
import { Desktop } from './components/Desktop/Desktop';
import { Taskbar } from './components/Taskbar/Taskbar';
import { Window } from './components/Window/Window';
import { MyComputer } from './components/windows/MyComputer';
import { Notepad } from './components/windows/Notepad';
import { RecycleBin } from './components/windows/RecycleBin';
import { AboutDialog } from './components/windows/AboutDialog';
import type { WindowType } from './types';

const WINDOW_CONFIG: Record<WindowType, { menu?: string[]; statusbar?: string; insetBody?: boolean }> = {
  mycomputer: { menu: ['Fichier', 'Edition', 'Affichage', '?'], statusbar: '4 objet(s)' },
  notepad: { menu: ['Fichier', 'Edition', 'Rechercher', '?'] },
  recyclebin: { menu: ['Fichier', 'Edition', 'Affichage', '?'], statusbar: '0 objet(s)' },
  about: { insetBody: false },
};

function App() {
  const [booted, setBooted] = useState(false);
  const [bsodVisible, setBsodVisible] = useState(false);
  const [startMenuOpen, setStartMenuOpen] = useState(false);
  const [shutdownScreen, setShutdownScreen] = useState(false);

  const {
    windows,
    focusOrder,
    activeWindowId,
    openWindow,
    closeWindow,
    focusWindow,
    minimizeWindow,
    maximizeWindow,
    updateWindowPosition,
  } = useWindowManager();

  const handleTaskbarItemClick = useCallback((id: string) => {
    const window = windows.find(w => w.id === id);
    if (!window) return;

    if (window.minimized) {
      focusWindow(id);
    } else if (id === activeWindowId) {
      minimizeWindow(id);
    } else {
      focusWindow(id);
    }
  }, [windows, activeWindowId, focusWindow, minimizeWindow]);

  const closeStartMenu = useCallback(() => {
    if (startMenuOpen) setStartMenuOpen(false);
  }, [startMenuOpen]);

  if (shutdownScreen) {
    return (
      <div style={{
        position: 'fixed', inset: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: '#ffcc00', fontSize: 20,
        fontFamily: '"MS Sans Serif", sans-serif',
        background: '#000',
      }}>
        <div style={{ textAlign: 'center' }}>
          Vous pouvez maintenant eteindre<br />votre ordinateur en toute securite.
        </div>
      </div>
    );
  }

  function renderWindowContent(windowId: string, type: WindowType) {
    switch (type) {
      case 'mycomputer': return <MyComputer />;
      case 'notepad': return <Notepad />;
      case 'recyclebin': return <RecycleBin />;
      case 'about': return <AboutDialog onClose={() => closeWindow(windowId)} />;
    }
  }

  return (
    <>
      {!booted && <BootScreen onComplete={() => setBooted(true)} />}
      <BSOD visible={bsodVisible} onDismiss={() => setBsodVisible(false)} />

      <Desktop
        onOpenWindow={openWindow}
        onTriggerBSOD={() => setBsodVisible(true)}
        onCloseStartMenu={closeStartMenu}
      >
        {windows.map(window => {
          const config = WINDOW_CONFIG[window.type];
          return (
            <Window
              key={window.id}
              state={window}
              isActive={window.id === activeWindowId}
              zIndex={100 + focusOrder.indexOf(window.id)}
              menu={config.menu}
              statusbar={config.statusbar}
              insetBody={config.insetBody}
              onClose={() => closeWindow(window.id)}
              onMinimize={() => minimizeWindow(window.id)}
              onMaximize={() => maximizeWindow(window.id)}
              onFocus={() => focusWindow(window.id)}
              onMove={(x, y) => updateWindowPosition(window.id, x, y)}
            >
              {renderWindowContent(window.id, window.type)}
            </Window>
          );
        })}
      </Desktop>

      <Taskbar
        windows={windows}
        focusOrder={focusOrder}
        activeWindowId={activeWindowId}
        startMenuOpen={startMenuOpen}
        onToggleStartMenu={() => setStartMenuOpen(previous => !previous)}
        onOpenWindow={openWindow}
        onShutDown={() => setShutdownScreen(true)}
        onTaskbarItemClick={handleTaskbarItemClick}
      />
    </>
  );
}

export default App;
