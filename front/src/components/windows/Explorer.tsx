import { useState, useCallback, useEffect, useMemo } from 'react';
import { SmallFolderIcon, SmallDarkFolderIcon, FileIcon } from '../../icons';
import { useGame } from '../../game/GameContext';

interface FsNode {
  name: string;
  type: 'folder' | 'file';
  size?: string;
  modified?: string;
  children?: FsNode[];
  /** If set, opening this folder dispatches a found event for this character */
  characterId?: string;
  /** Dark-themed folder (black icon) */
  dark?: boolean;
}

const FILE_SYSTEM: FsNode = {
  name: 'C:\\',
  type: 'folder',
  children: [
    {
      name: 'Mes documents',
      type: 'folder',
      children: [
        {
          name: 'Mes images',
          type: 'folder',
          children: [
            { name: 'vacances.bmp', type: 'file', size: '2,4 Mo', modified: '15/06/1999' },
            { name: 'famille.bmp', type: 'file', size: '1,8 Mo', modified: '22/12/1998' },
            { name: 'chat.bmp', type: 'file', size: '956 Ko', modified: '03/03/1999' },
          ],
        },
        {
          name: 'Ma musique',
          type: 'folder',
          children: [
            { name: 'track01.mid', type: 'file', size: '45 Ko', modified: '10/01/1999' },
            { name: 'chanson.wav', type: 'file', size: '12,3 Mo', modified: '14/07/1998' },
          ],
        },
        { name: 'lettre.doc', type: 'file', size: '24 Ko', modified: '08/11/1999' },
        { name: 'budget.xls', type: 'file', size: '56 Ko', modified: '01/09/1999' },
        { name: 'notes.txt', type: 'file', size: '2 Ko', modified: '20/03/1999' },
      ],
    },
    {
      name: 'Program Files',
      type: 'folder',
      children: [
        {
          name: 'Internet Explorer',
          type: 'folder',
          children: [
            { name: 'iexplore.exe', type: 'file', size: '89 Ko', modified: '11/05/1998' },
            { name: 'readme.txt', type: 'file', size: '4 Ko', modified: '11/05/1998' },
          ],
        },
        {
          name: 'Accessories',
          type: 'folder',
          children: [
            { name: 'calc.exe', type: 'file', size: '32 Ko', modified: '11/05/1998' },
            { name: 'notepad.exe', type: 'file', size: '18 Ko', modified: '11/05/1998' },
            { name: 'mspaint.exe', type: 'file', size: '128 Ko', modified: '11/05/1998' },
          ],
        },
        {
          name: 'Pindows',
          type: 'folder',
          children: [
            { name: 'pindows.exe', type: 'file', size: '420 Ko', modified: '25/06/1998' },
          ],
        },
      ],
    },
    {
      name: 'Windows',
      type: 'folder',
      children: [
        {
          name: 'System',
          type: 'folder',
          children: [
            { name: 'kernel32.dll', type: 'file', size: '356 Ko', modified: '11/05/1998' },
            { name: 'user32.dll', type: 'file', size: '245 Ko', modified: '11/05/1998' },
            { name: 'gdi32.dll', type: 'file', size: '178 Ko', modified: '11/05/1998' },
          ],
        },
        {
          name: 'Fonts',
          type: 'folder',
          children: [
            { name: 'arial.ttf', type: 'file', size: '267 Ko', modified: '11/05/1998' },
            { name: 'times.ttf', type: 'file', size: '312 Ko', modified: '11/05/1998' },
            { name: 'cour.ttf', type: 'file', size: '198 Ko', modified: '11/05/1998' },
          ],
        },
        { name: 'win.ini', type: 'file', size: '3 Ko', modified: '11/05/1998' },
        { name: 'system.ini', type: 'file', size: '2 Ko', modified: '11/05/1998' },
      ],
    },
    { name: 'autoexec.bat', type: 'file', size: '1 Ko', modified: '11/05/1998' },
    { name: 'config.sys', type: 'file', size: '1 Ko', modified: '11/05/1998' },
    { name: 'command.com', type: 'file', size: '93 Ko', modified: '11/05/1998' },
    { name: 'ne_pas_ouvrir.txt', type: 'file', size: '1 Ko', modified: (() => { const d = new Date(); return `${String(d.getDate()).padStart(2,'0')}/${String(d.getMonth()+1).padStart(2,'0')}/${d.getFullYear()}`; })() },
  ],
};

// Characters that hide during story4 (NOT Rocky — he's special)
const CHARACTER_FOLDERS: { parentPath: string[]; node: FsNode }[] = [
  {
    parentPath: ['Windows', 'Fonts'],
    node: { name: 'chapeau_magique', type: 'folder', characterId: 'merlin', children: [] },
  },
  {
    parentPath: ['Program Files'],
    node: { name: 'lampe_magique', type: 'folder', characterId: 'genie', children: [] },
  },
  {
    parentPath: ['Mes documents', 'Ma musique'],
    node: { name: 'plumes_vertes', type: 'folder', characterId: 'peedy', children: [] },
  },
  {
    parentPath: ['Windows', 'System'],
    node: { name: 'singe_suspect', type: 'folder', characterId: 'bonzi', children: [] },
  },
  {
    parentPath: ['Program Files', 'Pindows'],
    node: { name: 'einstein_cache', type: 'folder', characterId: 'genius', children: [] },
  },
  {
    parentPath: ['Mes documents', 'Mes images'],
    node: { name: 'os_enterre', type: 'folder', characterId: 'rover', children: [] },
  },
];

// Rocky's cadavre — only appears once all 6 others are found
const CADAVRE_ROCKY_FOLDER: { parentPath: string[]; node: FsNode } = {
  parentPath: ['Mes documents'],
  node: { name: 'cadavre_rocky', type: 'folder', dark: true, characterId: 'rocky', children: [] },
};

const OTHER_CHARACTER_IDS = ['merlin', 'genie', 'peedy', 'bonzi', 'genius', 'rover'];

/** Deep-clone an FsNode tree */
function cloneFs(node: FsNode): FsNode {
  return {
    ...node,
    children: node.children?.map(cloneFs),
  };
}

/** Inject a child node into the tree at the given parent path */
function injectNode(root: FsNode, parentPath: string[], child: FsNode): void {
  let current = root;
  for (const segment of parentPath) {
    const next = current.children?.find(c => c.name === segment);
    if (!next) return;
    current = next;
  }
  if (!current.children) current.children = [];
  // Avoid duplicates
  if (!current.children.some(c => c.name === child.name)) {
    current.children.push(child);
  }
}

// ─── Easter egg helpers ───────────────────────────────────────────────────────

const ZALGO = ['̷','̸','̡','̢','̛','̖','̗','̘','̙','̜','̝','̞','̟','̠','̤','̥','̦','̩','̪','̫','̬','̭','̮','̯','̰','̱','̲','̳','̹','̺','̻','̼','͇','͈','͉','͍','͎'];
const GLITCH_FILES = new Set(['kernel32.dll', 'user32.dll', 'gdi32.dll']);

function glitchify(name: string): string {
  return name.split('').map(c => {
    const n = Math.floor(Math.random() * 3) + 1;
    const zalgos = Array.from({ length: n }, () => ZALGO[Math.floor(Math.random() * ZALGO.length)]).join('');
    return c + zalgos;
  }).join('');
}

function initGlitchNames(): Record<string, string> {
  const result: Record<string, string> = {};
  GLITCH_FILES.forEach(f => { result[f] = glitchify(f); });
  return result;
}

function getNodeAtPath(root: FsNode, path: string[]): FsNode | null {
  let current = root;
  for (const segment of path) {
    const child = current.children?.find(c => c.name === segment);
    if (!child) return null;
    current = child;
  }
  return current;
}


interface TreeNodeProps {
  node: FsNode;
  path: string[];
  currentPath: string[];
  expanded: Set<string>;
  onToggle: (pathKey: string) => void;
  onNavigate: (path: string[]) => void;
  depth: number;
}

function TreeNode({ node, path, currentPath, expanded, onToggle, onNavigate, depth }: TreeNodeProps) {
  if (node.type !== 'folder') return null;

  const pathKey = path.join('\\');
  const isExpanded = expanded.has(pathKey);
  const isActive = currentPath.join('\\') === pathKey;
  const folders = node.children?.filter(c => c.type === 'folder') ?? [];
  const FolderIc = node.dark ? SmallDarkFolderIcon : SmallFolderIcon;

  return (
    <>
      <div
        className={`explorer-tree-item${isActive ? ' active' : ''}`}
        style={{ paddingLeft: depth * 16 + 4 }}
        onClick={() => {
          onToggle(pathKey);
          onNavigate(path);
        }}
      >
        <span className="explorer-tree-toggle">
          {folders.length > 0 ? (isExpanded ? '▾' : '▸') : '\u00A0'}
        </span>
        <FolderIc size={16} />
        <span className="explorer-tree-label" style={node.dark ? { color: '#660000' } : undefined}>{node.name}</span>
      </div>
      {isExpanded && folders.map(child => (
        <TreeNode
          key={child.name}
          node={child}
          path={[...path, child.name]}
          currentPath={currentPath}
          expanded={expanded}
          onToggle={onToggle}
          onNavigate={onNavigate}
          depth={depth + 1}
        />
      ))}
    </>
  );
}

export function Explorer() {
  const { gameState, dispatch } = useGame();
  const [currentPath, setCurrentPath] = useState<string[]>([]);
  const [expanded, setExpanded] = useState<Set<string>>(new Set(['']));
  const [history, setHistory] = useState<string[][]>([[]]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [easterEggPhase, setEasterEggPhase] = useState<'idle' | 'text' | 'flash1' | 'flash2' | 'flash3'>('idle');
  const [fileHidden, setFileHidden] = useState(false);
  const [glitchNames, setGlitchNames] = useState<Record<string, string>>(initGlitchNames);

  const isHiding = gameState.flags.story4_hiding;
  const allOthersFound = OTHER_CHARACTER_IDS.every(id => gameState.flags[`item_found_${id}`]);

  // Build the file system with character folders injected when hide-and-seek is active
  const fileSystem = useMemo(() => {
    const fs = cloneFs(FILE_SYSTEM);
    if (!isHiding) return fs;
    // Inject character folders for those not yet found
    for (const { parentPath, node } of CHARACTER_FOLDERS) {
      if (node.characterId && gameState.flags[`item_found_${node.characterId}`]) continue;
      injectNode(fs, parentPath, node);
    }
    // Rocky's cadavre only appears once all 6 others are found
    if (allOthersFound && !gameState.flags.item_found_rocky) {
      injectNode(fs, CADAVRE_ROCKY_FOLDER.parentPath, CADAVRE_ROCKY_FOLDER.node);
    }
    return fs;
  }, [isHiding, gameState.flags, allOthersFound]);

  useEffect(() => {
    let t: ReturnType<typeof setTimeout>;
    if (easterEggPhase === 'text')   t = setTimeout(() => { setFileHidden(true); setEasterEggPhase('flash1'); }, 2200);
    if (easterEggPhase === 'flash1') t = setTimeout(() => setEasterEggPhase('flash2'), 80);
    if (easterEggPhase === 'flash2') t = setTimeout(() => setEasterEggPhase('flash3'), 60);
    if (easterEggPhase === 'flash3') t = setTimeout(() => setEasterEggPhase('idle'),   120);
    return () => clearTimeout(t);
  }, [easterEggPhase]);

  const reglitch = useCallback((name: string) => {
    setGlitchNames(prev => ({ ...prev, [name]: glitchify(name) }));
  }, []);

  const currentNode = getNodeAtPath(fileSystem, currentPath) ?? fileSystem;
  const children = (currentNode.children ?? []).filter(c => !(fileHidden && c.name === 'ne_pas_ouvrir.txt'));

  const navigateTo = useCallback((path: string[]) => {
    // Check if the target folder is a character hiding spot
    const targetNode = getNodeAtPath(fileSystem, path);
    if (targetNode?.characterId) {
      dispatch({ type: 'item_clicked', itemId: `found_${targetNode.characterId}`, windowType: 'explorer' });
    }

    setCurrentPath(path);
    setSelectedItem(null);
    setHistory(prev => {
      const newHistory = prev.slice(0, historyIndex + 1);
      newHistory.push(path);
      return newHistory;
    });
    setHistoryIndex(prev => prev + 1);

    // Auto-expand path in tree
    const newExpanded = new Set(expanded);
    let partial: string[] = [];
    newExpanded.add('');
    for (const segment of path) {
      partial = [...partial, segment];
      newExpanded.add(partial.join('\\'));
    }
    setExpanded(newExpanded);
  }, [historyIndex, expanded, fileSystem, dispatch]);

  const goBack = useCallback(() => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setCurrentPath(history[newIndex]);
      setSelectedItem(null);
    }
  }, [historyIndex, history]);

  const goForward = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setCurrentPath(history[newIndex]);
      setSelectedItem(null);
    }
  }, [historyIndex, history]);

  const goUp = useCallback(() => {
    if (currentPath.length > 0) {
      navigateTo(currentPath.slice(0, -1));
    }
  }, [currentPath, navigateTo]);

  const handleToggle = useCallback((pathKey: string) => {
    setExpanded(prev => {
      const next = new Set(prev);
      if (next.has(pathKey)) next.delete(pathKey);
      else next.add(pathKey);
      return next;
    });
  }, []);

  const handleDoubleClick = useCallback((child: FsNode) => {
    if (child.name === 'ne_pas_ouvrir.txt') {
      setEasterEggPhase('text');
      return;
    }
    if (child.type === 'folder') {
      navigateTo([...currentPath, child.name]);
    }
  }, [currentPath, navigateTo]);

  const addressPath = 'C:\\' + currentPath.join('\\');
  const folderCount = children.filter(c => c.type === 'folder').length;
  const fileCount = children.filter(c => c.type === 'file').length;

  return (
    <div className="explorer" style={{ position: 'relative' }}>
      {easterEggPhase === 'text' && (
        <div style={{
          position: 'absolute', inset: 0, zIndex: 999,
          background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <pre style={{
            color: '#c0c0c0', fontFamily: '"Courier New", monospace', fontSize: 12,
            textAlign: 'center', lineHeight: 1.8, margin: 0,
          }}>{`Bloc-notes - ne_pas_ouvrir.txt\n\n\nje t'avais prévenu.`}</pre>
        </div>
      )}
      {(easterEggPhase === 'flash1' || easterEggPhase === 'flash2' || easterEggPhase === 'flash3') && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 99999, pointerEvents: 'none',
          background: easterEggPhase === 'flash1' ? '#ffffff'
                    : easterEggPhase === 'flash2' ? '#ff2200'
                    : '#ffffff',
        }} />
      )}
      {/* Toolbar */}
      <div className="explorer-toolbar">
        <button
          className="explorer-nav-btn"
          onClick={goBack}
          disabled={historyIndex <= 0}
          title="Précédent"
        >
          ◀
        </button>
        <button
          className="explorer-nav-btn"
          onClick={goForward}
          disabled={historyIndex >= history.length - 1}
          title="Suivant"
        >
          ▶
        </button>
        <button
          className="explorer-nav-btn"
          onClick={goUp}
          disabled={currentPath.length === 0}
          title="Dossier parent"
        >
          ↑
        </button>
        <div className="explorer-address">
          <span className="explorer-address-label">Adresse</span>
          <div className="explorer-address-bar">
            <SmallFolderIcon size={14} />
            <span>{addressPath}</span>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="explorer-main">
        {/* Tree panel */}
        <div className="explorer-tree">
          <TreeNode
            node={fileSystem}
            path={[]}
            currentPath={currentPath}
            expanded={expanded}
            onToggle={handleToggle}
            onNavigate={navigateTo}
            depth={0}
          />
        </div>

        {/* Splitter */}
        <div className="explorer-splitter" />

        {/* File list */}
        <div className="explorer-files">
          {/* Column headers */}
          <div className="explorer-list-header">
            <span className="explorer-col-name">Nom</span>
            <span className="explorer-col-size">Taille</span>
            <span className="explorer-col-type">Type</span>
            <span className="explorer-col-modified">Modifié le</span>
          </div>

          {/* Items */}
          <div className="explorer-list-body">
            {children.map(child => {
              const isGlitch = GLITCH_FILES.has(child.name);
              const displayName = isGlitch ? glitchNames[child.name] : child.name;
              const isDark = child.dark;
              const FolderIc = isDark ? SmallDarkFolderIcon : SmallFolderIcon;
              return (
                <div
                  key={child.name}
                  className={`explorer-list-item${selectedItem === child.name ? ' selected' : ''}`}
                  onClick={() => { setSelectedItem(child.name); if (isGlitch) reglitch(child.name); }}
                  onDoubleClick={() => handleDoubleClick(child)}
                  style={isDark ? { background: '#1a0000' } : undefined}
                >
                  <span
                    className="explorer-col-name"
                    style={isDark ? { color: '#cc0000', fontFamily: 'monospace', fontWeight: 'bold' } : isGlitch ? { color: '#660000', fontFamily: 'monospace' } : undefined}
                  >
                    {child.type === 'folder' ? <FolderIc size={16} /> : <FileIcon size={16} />}
                    {displayName}
                  </span>
                  <span className="explorer-col-size">{child.size ?? ''}</span>
                  <span className="explorer-col-type" style={isDark ? { color: '#cc0000' } : undefined}>
                    {child.type === 'folder' ? (isDark ? '???' : 'Dossier de fichiers') : getFileType(child.name)}
                  </span>
                  <span className="explorer-col-modified">{child.modified ?? ''}</span>
                </div>
              );
            })}
            {children.length === 0 && (
              <div className="explorer-empty">(Vide)</div>
            )}
          </div>
        </div>
      </div>

      {/* Status bar */}
      <div className="explorer-statusbar">
        <span>{folderCount + fileCount} objet(s)</span>
        {selectedItem && <span className="explorer-status-sel">1 objet(s) sélectionné(s)</span>}
      </div>
    </div>
  );
}

function getFileType(name: string): string {
  const ext = name.split('.').pop()?.toLowerCase();
  switch (ext) {
    case 'exe': return 'Application';
    case 'dll': return 'Bibliothèque de liens';
    case 'txt': return 'Document texte';
    case 'doc': return 'Document Word';
    case 'xls': return 'Feuille de calcul';
    case 'bmp': return 'Image Bitmap';
    case 'mid': return 'Fichier MIDI';
    case 'wav': return 'Fichier Wave';
    case 'bat': return 'Fichier de commandes';
    case 'sys': return 'Fichier système';
    case 'com': return 'Application MS-DOS';
    case 'ini': return 'Paramètres de config.';
    case 'ttf': return 'Police TrueType';
    default: return 'Fichier';
  }
}
