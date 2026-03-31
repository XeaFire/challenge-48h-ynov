import { useState, useCallback, useEffect, useRef } from 'react';
import { useWindowManager } from './hooks/useWindowManager';
import { useAgentManager } from './hooks/useAgentManager';
import { useGameEngine } from './hooks/useGameEngine';
import { GameContext } from './game/GameContext';
import { SpeechBubbleLayer } from './components/SpeechBubble';
import { QuestNotification } from './components/QuestNotification';
import { BootScreen } from './components/BootScreen';
import { BSOD } from './components/BSOD';
import bgMusic from './assets/interstellarmusic.wav';
import { DEBUG_PRESETS, createDebugState } from './game/initialState';
import type { GameState } from './game/types';
import { Desktop } from './components/Desktop/Desktop';
import { Taskbar } from './components/Taskbar/Taskbar';
import { Window } from './components/Window/Window';
import { StoryFormOverlay } from './components/StoryFormOverlay';
import { MyComputer } from './components/windows/MyComputer';
import { Notepad } from './components/windows/Notepad';
import { RecycleBin } from './components/windows/RecycleBin';
import { AboutDialog } from './components/windows/AboutDialog';
import { Calculator } from './components/windows/Calculator';
import { Paint } from './components/windows/Paint';
import { Explorer } from './components/windows/Explorer';
import { Solitaire } from './components/windows/Solitaire';
import { MailApp } from './components/windows/MailApp';
import { InternetExplorer } from './components/windows/InternetExplorer';
import { ImageViewer } from './components/windows/ImageViewer';
import { Minesweeper } from './components/windows/Minesweeper';
import type { WindowType } from './types';

const WINDOW_CONFIG: Record<WindowType, { menu?: string[]; statusbar?: string; insetBody?: boolean }> = {
  mycomputer: { menu: ['Fichier', 'Edition', 'Affichage', '?'], statusbar: '4 objet(s)' },
  notepad: { menu: ['Fichier', 'Edition', 'Rechercher', '?'] },
  recyclebin: { menu: ['Fichier', 'Edition', 'Affichage', '?'], statusbar: '0 objet(s)' },
  about: { insetBody: false },
  calculator: { menu: ['Edition', 'Affichage', '?'], insetBody: false },
  paint: { menu: ['Fichier', 'Edition', 'Affichage', 'Image', 'Couleurs', '?'], statusbar: 'Pour obtenir de l\'aide, cliquez sur ? , Rubriques d\'aide.' },
  explorer: { menu: ['Fichier', 'Edition', 'Affichage', 'Outils', '?'] },
  solitaire: { insetBody: false },
  mail: { menu: ['Fichier', 'Edition', 'Affichage', 'Message', 'Outils', '?'] },
  ie: { menu: ['Fichier', 'Edition', 'Affichage', 'Favoris', 'Outils', '?'], statusbar: 'Termine' },
  imageviewer: { menu: ['Fichier', 'Edition', '?'], statusbar: 'Links_crush.png — 332 Ko' },
  minesweeper: { menu: ['Jeu', '?'], statusbar: 'Mines restantes: 10' },
};

const IS_DEBUG = window.location.pathname.startsWith('/debug');

interface DebugConfig {
  initialState?: GameState;
  initialFiredTriggers?: string[];
  skipBoot?: boolean;
}

function DebugPicker({ onSelect }: { onSelect: (config: DebugConfig) => void }) {
  return (
    <div style={{
      position: 'fixed', inset: 0, background: '#000',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 999999,
    }}>
      <div style={{
        background: '#c0c0c0', border: '2px solid', borderColor: '#fff #808080 #808080 #fff',
        padding: 20, minWidth: 350,
      }}>
        <div style={{
          background: '#000080', color: '#fff', fontWeight: 'bold',
          padding: '4px 8px', marginBottom: 12, fontSize: 13,
        }}>
          Debug — Choix de la story
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <button
            onClick={() => onSelect({})}
            style={{
              padding: '6px 12px', background: '#c0c0c0', border: '2px solid',
              borderColor: '#fff #808080 #808080 #fff', cursor: 'pointer',
              fontFamily: 'inherit', fontSize: 12, textAlign: 'left',
            }}
          >
            Debut — Lancer normalement
          </button>
          {Object.entries(DEBUG_PRESETS).map(([key, preset]) => (
            <button
              key={key}
              onClick={() => onSelect({
                initialState: createDebugState(preset),
                initialFiredTriggers: preset.firedTriggers,
                skipBoot: true,
              })}
              style={{
                padding: '6px 12px', background: '#c0c0c0', border: '2px solid',
                borderColor: '#fff #808080 #808080 #fff', cursor: 'pointer',
                fontFamily: 'inherit', fontSize: 12, textAlign: 'left',
              }}
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function App() {
  const [debugConfig, setDebugConfig] = useState<DebugConfig | null>(IS_DEBUG ? null : {});

  if (debugConfig === null) {
    return <DebugPicker onSelect={setDebugConfig} />;
  }

  return <Game debugConfig={debugConfig} />;
}

function Game({ debugConfig }: { debugConfig: DebugConfig }) {
  const [booted, setBooted] = useState(debugConfig.skipBoot ?? false);
  const [bsodVisible, setBsodVisible] = useState(false);
  const [startMenuOpen, setStartMenuOpen] = useState(false);
  const [shutdownScreen, setShutdownScreen] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const handler = () => setBsodVisible(true);
    window.addEventListener('trigger-bsod', handler);
    return () => window.removeEventListener('trigger-bsod', handler);
  }, []);

  // Background music — start on first user interaction after boot
  useEffect(() => {
    if (!booted) return;
    const audio = new Audio(bgMusic);
    audio.loop = true;
    audio.volume = 0.3;
    audioRef.current = audio;

    // Try playing immediately (works if user already interacted)
    audio.play().catch(() => {});

    // Also listen for any interaction in capture phase (can't be blocked)
    const play = () => {
      audio.play().then(() => {
        document.removeEventListener('click', play, true);
        document.removeEventListener('keydown', play, true);
        document.removeEventListener('mousedown', play, true);
      }).catch(() => {});
    };
    document.addEventListener('click', play, true);
    document.addEventListener('keydown', play, true);
    document.addEventListener('mousedown', play, true);

    return () => {
      audio.pause();
      document.removeEventListener('click', play, true);
      document.removeEventListener('keydown', play, true);
      document.removeEventListener('mousedown', play, true);
    };
  }, [booted]);

  const agents = useAgentManager();
  const {
    windows, focusOrder, activeWindowId,
    openWindow, closeWindow, closeAllWindows, focusWindow,
    minimizeWindow, maximizeWindow, updateWindowPosition,
  } = useWindowManager();

  const { gameState, dispatch } = useGameEngine({
    agentManager: agents,
    onOpenWindow: openWindow,
    onCloseAllWindows: closeAllWindows,
    initialState: debugConfig.initialState,
    initialFiredTriggers: debugConfig.initialFiredTriggers,
  });

  // Opens a window AND dispatches the game event so triggers can react
  const handleOpenWindow = useCallback((type: WindowType) => {
    if (gameState.lockedApps.includes(type)) return;
    openWindow(type);
    dispatch({ type: 'window_opened', windowType: type });
    // Ouvrir mail apres la story2 = nettoyer le sang
    if (type === 'mail' && gameState.flags['story2_complete']) {
      dispatch({ type: 'item_clicked', itemId: 'mail_after_story2', windowType: 'mail' });
    }
  }, [openWindow, dispatch, gameState.lockedApps, gameState.flags]);

  const handleBootComplete = useCallback(() => {
    setBooted(true);
    dispatch({ type: 'boot_complete' });
  }, [dispatch]);

  // In debug mode with skipBoot, dispatch recheck so triggers evaluate immediately
  useEffect(() => {
    if (debugConfig.skipBoot) {
      dispatch({ type: 'recheck' });
    }
  }, [debugConfig.skipBoot, dispatch]);

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
      case 'solitaire': return <Solitaire />;
      case 'mail': return <MailApp />;
      case 'ie': return <InternetExplorer />;
      case 'imageviewer': return <ImageViewer />;
      case 'minesweeper': return <Minesweeper />;
    }
  }

  return (
    <GameContext.Provider value={{ gameState, dispatch, agents, openWindow: handleOpenWindow, closeAllWindows }}>
      {!booted && <BootScreen onComplete={handleBootComplete} />}
      <BSOD visible={bsodVisible} onDismiss={() => setBsodVisible(false)} />

      <Desktop
        onOpenWindow={handleOpenWindow}
        onTriggerBSOD={() => setBsodVisible(true)}
        onCloseStartMenu={() => startMenuOpen && setStartMenuOpen(false)}
        className={gameState.screenShake ? 'screen-shake' : ''}
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
              onClose={() => { if (!gameState.windowsLocked) closeWindow(window.id); }}
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
        onOpenWindow={handleOpenWindow}
        onShutDown={() => setShutdownScreen(true)}
        onTaskbarItemClick={handleTaskbarItemClick}
      />

      <SpeechBubbleLayer bubbles={agents.bubbles} getAgentEl={agents.getAgentEl} onBubbleClick={agents.skipCurrentSpeech} />

      {gameState.notification && <QuestNotification text={gameState.notification} />}

      {gameState.subliminalText && (
        <div className="subliminal-overlay">
          <div className="subliminal-text">{gameState.subliminalText}</div>
        </div>
      )}

      {/* Story form overlay */}
      {gameState.activeForm && (
        <StoryFormOverlay
          formId={gameState.activeForm.formId}
          title={gameState.activeForm.title}
          description={gameState.activeForm.description}
          fields={gameState.activeForm.fields}
          submitLabel={gameState.activeForm.submitLabel}
          onSubmit={(formId, data) => dispatch({ type: 'form_submitted', formId, data })}
        />
      )}
    </GameContext.Provider>
  );
}

export default App;
