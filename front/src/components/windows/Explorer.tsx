import { useState, useCallback } from 'react';
import { SmallFolderIcon, FileIcon } from '../../icons';

interface FsNode {
  name: string;
  type: 'folder' | 'file';
  size?: string;
  modified?: string;
  children?: FsNode[];
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
  ],
};

function getNodeAtPath(root: FsNode, path: string[]): FsNode | null {
  let current = root;
  for (const segment of path) {
    const child = current.children?.find(c => c.name === segment);
    if (!child) return null;
    current = child;
  }
  return current;
}

function getAllFolders(node: FsNode, path: string[] = []): { path: string[]; name: string; depth: number }[] {
  const result: { path: string[]; name: string; depth: number }[] = [];
  if (node.type === 'folder') {
    result.push({ path, name: node.name, depth: path.length });
    for (const child of node.children ?? []) {
      if (child.type === 'folder') {
        result.push(...getAllFolders(child, [...path, child.name]));
      }
    }
  }
  return result;
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
        <SmallFolderIcon size={16} />
        <span className="explorer-tree-label">{node.name}</span>
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
  const [currentPath, setCurrentPath] = useState<string[]>([]);
  const [expanded, setExpanded] = useState<Set<string>>(new Set(['']));
  const [history, setHistory] = useState<string[][]>([[]]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);

  const currentNode = getNodeAtPath(FILE_SYSTEM, currentPath) ?? FILE_SYSTEM;
  const children = currentNode.children ?? [];

  const navigateTo = useCallback((path: string[]) => {
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
  }, [historyIndex, expanded]);

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
    if (child.type === 'folder') {
      navigateTo([...currentPath, child.name]);
    }
  }, [currentPath, navigateTo]);

  const addressPath = 'C:\\' + currentPath.join('\\');
  const folderCount = children.filter(c => c.type === 'folder').length;
  const fileCount = children.filter(c => c.type === 'file').length;

  return (
    <div className="explorer">
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
            node={FILE_SYSTEM}
            path={[]}
            currentPath={currentPath}
            expanded={expanded}
            onToggle={handleToggle}
            onNavigate={(path) => { navigateTo(path); }}
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
            {children.map(child => (
              <div
                key={child.name}
                className={`explorer-list-item${selectedItem === child.name ? ' selected' : ''}`}
                onClick={() => setSelectedItem(child.name)}
                onDoubleClick={() => handleDoubleClick(child)}
              >
                <span className="explorer-col-name">
                  {child.type === 'folder' ? <SmallFolderIcon size={16} /> : <FileIcon size={16} />}
                  {child.name}
                </span>
                <span className="explorer-col-size">{child.size ?? ''}</span>
                <span className="explorer-col-type">
                  {child.type === 'folder' ? 'Dossier de fichiers' : getFileType(child.name)}
                </span>
                <span className="explorer-col-modified">{child.modified ?? ''}</span>
              </div>
            ))}
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
