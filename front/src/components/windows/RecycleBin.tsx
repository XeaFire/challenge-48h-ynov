import { useState } from 'react';
import { useGame } from '../../game/GameContext';

export function RecycleBin() {
  const { gameState, openWindow } = useGame();
  const linksDead = gameState.flags.story2_links_dead;
  const [viewingFile, setViewingFile] = useState(false);

  if (!linksDead) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#808080' }}>
        La corbeille est vide
      </div>
    );
  }

  if (viewingFile) {
    return (
      <div className="recycle-bin-notepad">
        <div className="recycle-bin-notepad-bar">
          <button className="recycle-bin-notepad-back" onClick={() => setViewingFile(false)}>
            ◀ Retour
          </button>
          <span>dernier_message_links.txt — Bloc-notes</span>
        </div>
        <div className="recycle-bin-notepad-content">
          <span
            className="recycle-bin-file-link"
            onDoubleClick={() => openWindow('imageviewer')}
            title="Double-cliquez pour ouvrir"
          >
            Links_crush.png
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="recycle-bin-content">
      <div className="recycle-bin-header">
        <span style={{ flex: 1 }}>Nom</span>
        <span style={{ width: 100 }}>Taille</span>
        <span style={{ width: 140 }}>Date de suppression</span>
      </div>
      <div className="recycle-bin-item recycle-bin-item-dead" onDoubleClick={() => {}}>
        <div className="recycle-bin-item-icon">
          <span style={{ fontSize: 16 }}>🐱</span>
        </div>
        <span className="recycle-bin-item-name" style={{ flex: 1 }}>Links.exe</span>
        <span style={{ width: 100 }}>666 Ko</span>
        <span style={{ width: 140 }}>01/01/1998 00:00</span>
      </div>
      <div className="recycle-bin-item recycle-bin-item-dead" onDoubleClick={() => {}}>
        <div className="recycle-bin-item-icon">
          <span style={{ fontSize: 16 }}>🩸</span>
        </div>
        <span className="recycle-bin-item-name" style={{ flex: 1 }}>souvenirs_de_links.dat</span>
        <span style={{ width: 100 }}>??? Ko</span>
        <span style={{ width: 140 }}>??/??/???? ??:??</span>
      </div>
      <div
        className="recycle-bin-item recycle-bin-item-dead"
        onDoubleClick={() => setViewingFile(true)}
      >
        <div className="recycle-bin-item-icon">
          <span style={{ fontSize: 16 }}>📄</span>
        </div>
        <span className="recycle-bin-item-name" style={{ flex: 1 }}>dernier_message_links.txt</span>
        <span style={{ width: 100 }}>1 Ko</span>
        <span style={{ width: 140 }}>01/01/1998 00:00</span>
      </div>
    </div>
  );
}
