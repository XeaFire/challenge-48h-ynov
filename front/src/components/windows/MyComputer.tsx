import { useState, useEffect } from 'react';
import { FolderIcon, CDDriveIcon, FloppyDiskIcon } from '../../icons';

// --- Barres d'utilisation disque ---

interface DriveInfo {
  letter: string;
  label: string;
  icon: React.ReactNode;
  usedGb: number;
  totalGb: number;
}

const DRIVES: DriveInfo[] = [
  { letter: 'C:', label: 'Disque local', icon: <FolderIcon label="C:" />, usedGb: 14.2, totalGb: 20 },
  { letter: 'D:', label: 'Donnees', icon: <FolderIcon label="D:" />, usedGb: 3.7, totalGb: 40 },
  { letter: 'E:', label: 'Lecteur CD', icon: <CDDriveIcon />, usedGb: 0.65, totalGb: 0.7 },
  { letter: 'A:', label: 'Disquette 3½', icon: <FloppyDiskIcon />, usedGb: 0.001, totalGb: 0.00144 },
];

function formatSize(gb: number) {
  if (gb < 0.01) return `${(gb * 1024 * 1024).toFixed(0)} Ko`;
  if (gb < 1) return `${(gb * 1024).toFixed(0)} Mo`;
  return `${gb.toFixed(1)} Go`;
}

function DriveBar({ drive }: { drive: DriveInfo }) {
  const pct = Math.round((drive.usedGb / drive.totalGb) * 100);
  const color = pct > 90 ? '#cc0000' : pct > 70 ? '#cc8800' : '#000080';

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '4px 8px' }}>
      <div style={{ width: 32, height: 32, flexShrink: 0 }}>{drive.icon}</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 11, fontWeight: 'bold', marginBottom: 2 }}>
          {drive.label} ({drive.letter})
        </div>
        <div style={{
          height: 14, background: '#fff',
          border: '1px solid #808080', position: 'relative',
        }}>
          <div style={{
            height: '100%', width: `${pct}%`, background: color,
            transition: 'width 0.3s',
          }} />
          <span style={{
            position: 'absolute', inset: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 9, fontWeight: 'bold', color: pct > 50 ? '#fff' : '#000',
            mixBlendMode: pct > 50 ? 'normal' : undefined,
          }}>
            {pct}%
          </span>
        </div>
        <div style={{ fontSize: 9, color: '#808080', marginTop: 1 }}>
          {formatSize(drive.usedGb)} utilise sur {formatSize(drive.totalGb)}
        </div>
      </div>
    </div>
  );
}

// --- Horloge analogique ---

function AnalogClock() {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const s = now.getSeconds();
  const m = now.getMinutes();
  const h = now.getHours() % 12;

  return (
    <svg width={80} height={80} viewBox="0 0 80 80">
      <circle cx="40" cy="40" r="38" fill="#fff" stroke="#808080" strokeWidth="2" />
      <circle cx="40" cy="40" r="36" fill="#fff" stroke="#000" strokeWidth="1" />
      {[...Array(12)].map((_, i) => {
        const angle = (i * 30 - 90) * (Math.PI / 180);
        const x = 40 + 30 * Math.cos(angle);
        const y = 40 + 30 * Math.sin(angle);
        return <circle key={i} cx={x} cy={y} r={1.5} fill="#000" />;
      })}
      {/* Heures */}
      <line
        x1="40" y1="40"
        x2={40 + 18 * Math.cos(((h + m / 60) * 30 - 90) * (Math.PI / 180))}
        y2={40 + 18 * Math.sin(((h + m / 60) * 30 - 90) * (Math.PI / 180))}
        stroke="#000" strokeWidth="3" strokeLinecap="round"
      />
      {/* Minutes */}
      <line
        x1="40" y1="40"
        x2={40 + 26 * Math.cos((m * 6 - 90) * (Math.PI / 180))}
        y2={40 + 26 * Math.sin((m * 6 - 90) * (Math.PI / 180))}
        stroke="#000" strokeWidth="2" strokeLinecap="round"
      />
      {/* Secondes */}
      <line
        x1="40" y1="40"
        x2={40 + 28 * Math.cos((s * 6 - 90) * (Math.PI / 180))}
        y2={40 + 28 * Math.sin((s * 6 - 90) * (Math.PI / 180))}
        stroke="#cc0000" strokeWidth="1"
      />
      <circle cx="40" cy="40" r="2" fill="#000" />
    </svg>
  );
}

// --- Calendrier ---

function MiniCalendar() {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const today = now.getDate();

  const dayNames = ['Lu', 'Ma', 'Me', 'Je', 'Ve', 'Sa', 'Di'];
  const monthNames = [
    'Janvier', 'Fevrier', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Aout', 'Septembre', 'Octobre', 'Novembre', 'Decembre',
  ];

  const firstDay = new Date(year, month, 1);
  const startDay = (firstDay.getDay() + 6) % 7; // lundi = 0
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells: (number | null)[] = [];
  for (let i = 0; i < startDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  return (
    <div style={{ fontSize: 10 }}>
      <div style={{
        textAlign: 'center', fontWeight: 'bold', fontSize: 11,
        padding: '2px 0', background: '#000080', color: '#fff',
      }}>
        {monthNames[month]} {year}
      </div>
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)',
        gap: 0, background: '#fff', border: '1px solid #808080',
      }}>
        {dayNames.map(d => (
          <div key={d} style={{
            textAlign: 'center', fontWeight: 'bold', padding: '2px 0',
            borderBottom: '1px solid #c0c0c0', fontSize: 9,
          }}>
            {d}
          </div>
        ))}
        {cells.map((day, i) => (
          <div key={i} style={{
            textAlign: 'center', padding: '1px 0', height: 16,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: day === today ? '#000080' : 'transparent',
            color: day === today ? '#fff' : day ? '#000' : 'transparent',
            fontWeight: day === today ? 'bold' : 'normal',
          }}>
            {day ?? ''}
          </div>
        ))}
      </div>
    </div>
  );
}

// --- Raccourcis ---

function Shortcut({ emoji, label, onClick }: { emoji: string; label: string; onClick?: () => void }) {
  return (
    <div
      onClick={onClick}
      style={{
        display: 'flex', alignItems: 'center', gap: 6,
        padding: '3px 6px', cursor: 'pointer', fontSize: 11,
      }}
      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#000080'; (e.currentTarget as HTMLElement).style.color = '#fff'; }}
      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = ''; (e.currentTarget as HTMLElement).style.color = ''; }}
    >
      <span style={{ fontSize: 16 }}>{emoji}</span>
      <span>{label}</span>
    </div>
  );
}

// --- Mot de passe ---

function PasswordApp() {
  // chiikawa
  const passwords = [
    { site: 'pindows.com', user: 'admin', pass: 'chiikawa' },
    { site: 'webmail.98', user: 'merlin', pass: 'chiikawa' },
  ];

  return (
    <div style={{ fontSize: 11 }}>
      <div style={{ fontWeight: 'bold', marginBottom: 4, fontSize: 12 }}>
        Gestionnaire de mots de passe
      </div>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: '#000080', color: '#fff' }}>
            <th style={{ padding: '2px 4px', textAlign: 'left' }}>Site</th>
            <th style={{ padding: '2px 4px', textAlign: 'left' }}>Utilisateur</th>
            <th style={{ padding: '2px 4px', textAlign: 'left' }}>Mot de passe</th>
            <th style={{ width: 40 }}></th>
          </tr>
        </thead>
        <tbody>
          {passwords.map((p, i) => (
            <tr key={i} style={{ borderBottom: '1px solid #c0c0c0' }}>
              <td style={{ padding: '2px 4px' }}>{p.site}</td>
              <td style={{ padding: '2px 4px' }}>{p.user}</td>
              <td style={{ padding: '2px 4px', fontFamily: 'monospace' }}>••••••••</td>
              <td style={{ padding: '2px 4px', textAlign: 'center' }}>
                <button
                  className="win98-button"
                  style={{
                    padding: '0 4px', fontSize: 9,
                    color: '#808080', cursor: 'not-allowed',
                  }}
                  disabled
                  title="Acces refuse"
                >
                  👁
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div style={{ marginTop: 8, color: '#808080', fontSize: 10, fontStyle: 'italic' }}>
        Acces administrateur requis pour afficher les mots de passe.
      </div>
    </div>
  );
}

// --- Composant principal ---

type Tab = 'drives' | 'tools' | 'passwords';

export function MyComputer() {
  const [tab, setTab] = useState<Tab>('drives');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Onglets */}
      <div style={{ display: 'flex', gap: 0, borderBottom: '1px solid #808080', background: '#c0c0c0' }}>
        {([['drives', 'Disques'], ['tools', 'Outils'], ['passwords', 'Mots de passe']] as [Tab, string][]).map(([id, label]) => (
          <button
            key={id}
            className="win98-button"
            style={{
              padding: '3px 12px', fontSize: 11, border: 'none',
              borderBottom: tab === id ? '2px solid #c0c0c0' : '2px solid #808080',
              fontWeight: tab === id ? 'bold' : 'normal',
              background: tab === id ? '#c0c0c0' : '#b0b0b0',
              marginBottom: tab === id ? -1 : 0,
              borderTop: tab === id ? '2px solid #fff' : 'none',
              borderLeft: tab === id ? '2px solid #fff' : 'none',
              borderRight: tab === id ? '2px solid #808080' : 'none',
              cursor: 'pointer',
            }}
            onClick={() => setTab(id)}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Contenu */}
      <div style={{ flex: 1, overflow: 'auto', background: '#fff' }}>
        {tab === 'drives' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2, padding: 4 }}>
            {DRIVES.map(d => <DriveBar key={d.letter} drive={d} />)}
          </div>
        )}

        {tab === 'tools' && (
          <div style={{ display: 'flex', gap: 16, padding: 8 }}>
            {/* Horloge */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
              <AnalogClock />
              <TimeDisplay />
            </div>
            {/* Calendrier */}
            <div style={{ flex: 1 }}>
              <MiniCalendar />
              <div style={{
                marginTop: 8, borderTop: '1px solid #c0c0c0', paddingTop: 6,
              }}>
                <div style={{ fontWeight: 'bold', fontSize: 11, marginBottom: 4 }}>Raccourcis</div>
                <Shortcut emoji="📁" label="Mes Documents" />
                <Shortcut emoji="🖨" label="Imprimantes" />
                <Shortcut emoji="🔧" label="Panneau de configuration" />
                <Shortcut emoji="📡" label="Connexion reseau" />
              </div>
            </div>
          </div>
        )}

        {tab === 'passwords' && (
          <div style={{ padding: 8 }}>
            <PasswordApp />
          </div>
        )}
      </div>
    </div>
  );
}

function TimeDisplay() {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  return (
    <div style={{
      fontFamily: '"Courier New", monospace', fontSize: 14, fontWeight: 'bold',
      background: '#000', color: '#0f0', padding: '2px 8px',
      border: '1px solid #808080',
    }}>
      {now.toLocaleTimeString('fr-FR')}
    </div>
  );
}
