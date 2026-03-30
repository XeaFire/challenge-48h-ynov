import { useState, useCallback } from 'react';
import { useWindowManager } from './hooks/useWindowManager';
import { useAgentManager } from './hooks/useAgentManager';
import { useGameEngine } from './hooks/useGameEngine';
import { GameContext } from './game/GameContext';
import { BootScreen } from './components/BootScreen';
import { BSOD } from './components/BSOD';
import { Desktop } from './components/Desktop/Desktop';
import { Taskbar } from './components/Taskbar/Taskbar';
import { Window } from './components/Window/Window';
import { MyComputer } from './components/windows/MyComputer';
import { Notepad } from './components/windows/Notepad';
import { RecycleBin } from './components/windows/RecycleBin';
import { AboutDialog } from './components/windows/AboutDialog';
import { Calculator } from './components/windows/Calculator';
import { Paint } from './components/windows/Paint';
import { Explorer } from './components/windows/Explorer';
import type { WindowType } from './types';

const WINDOW_CONFIG: Record<WindowType, { menu?: string[]; statusbar?: string; insetBody?: boolean }> = {
  mycomputer: { menu: ['Fichier', 'Edition', 'Affichage', '?'], statusbar: '4 objet(s)' },
  notepad: { menu: ['Fichier', 'Edition', 'Rechercher', '?'] },
  recyclebin: { menu: ['Fichier', 'Edition', 'Affichage', '?'], statusbar: '0 objet(s)' },
  about: { insetBody: false },
  calculator: { menu: ['Edition', 'Affichage', '?'], insetBody: false },
  paint: { menu: ['Fichier', 'Edition', 'Affichage', 'Image', 'Couleurs', '?'], statusbar: 'Pour obtenir de l\'aide, cliquez sur ? , Rubriques d\'aide.' },
  explorer: { menu: ['Fichier', 'Edition', 'Affichage', 'Outils', '?'] },
};

function App() {
  const [booted, setBooted] = useState(false);
  const [bsodVisible, setBsodVisible] = useState(false);
  const [startMenuOpen, setStartMenuOpen] = useState(false);
  const [shutdownScreen, setShutdownScreen] = useState(false);

  const agents = useAgentManager();
  const {
    windows, focusOrder, activeWindowId,
    openWindow, closeWindow, focusWindow,
    minimizeWindow, maximizeWindow, updateWindowPosition,
  } = useWindowManager();

  const { gameState, dispatch } = useGameEngine({
    agentManager: agents,
    onOpenWindow: openWindow,
  });

  const handleBootComplete = useCallback(() => {
    setBooted(true);
    dispatch({ type: 'boot_complete' });
  }, [dispatch]);

  const handleTaskbarItemClick = useCallback((id: string) => {
    const win = windows.find(w => w.id === id);
    if (!win) return;
    if (win.minimized) focusWindow(id);
    else if (id === activeWindowId) minimizeWindow(id);
    else focusWindow(id);
  }, [windows, activeWindowId, focusWindow, minimizeWindow]);

  if (shutdownScreen) {
    return (
      <div style={{
        position: 'fixed', inset: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: '#ffcc00', fontSize: 20,
        fontFamily: '"MS Sans Serif", sans-serif', background: '#000',
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
      case 'calculator': return <Calculator />;
      case 'paint': return <Paint />;
      case 'explorer': return <Explorer />;
    }
  }

  return (
    <GameContext.Provider value={{ gameState, dispatch, agents }}>
      {!booted && <BootScreen onComplete={handleBootComplete} />}
      <BSOD visible={bsodVisible} onDismiss={() => setBsodVisible(false)} />

      <Desktop
        onOpenWindow={openWindow}
        onTriggerBSOD={() => setBsodVisible(true)}
        onCloseStartMenu={() => startMenuOpen && setStartMenuOpen(false)}
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
        onToggleStartMenu={() => setStartMenuOpen(prev => !prev)}
        onOpenWindow={openWindow}
        onShutDown={() => setShutdownScreen(true)}
        onTaskbarItemClick={handleTaskbarItemClick}
      />
    </GameContext.Provider>
  );
}

export default App;
