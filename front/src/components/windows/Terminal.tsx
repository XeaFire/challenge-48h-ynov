import { useState, useCallback, useRef, useEffect } from 'react';
import { useGame } from '../../game/GameContext';

const USER_PERMISSIONS: Record<string, { role: string; status?: string; detail?: string }> = {
  merlin:  { role: 'USER', detail: 'Agent assistant principal. Acces standard.' },
  links:   { role: 'USER', status: 'SUPPRIME', detail: 'Agent supprime. Compte desactive.' },
  bonzi:   { role: 'ADMIN', status: 'SUSPECT', detail: 'Acces complet au systeme. Droits de lecture/ecriture/suppression sur TOUS les fichiers.' },
  clippy:  { role: 'INACTIF', detail: 'Agent desactive. Aucun acces.' },
  genie:   { role: 'USER', detail: 'Agent assistant. Acces standard.' },
  genius:  { role: 'MODERATOR', detail: 'Agent de securite. Acces en lecture aux logs systeme.' },
  peedy:   { role: 'USER', detail: 'Agent assistant. Acces standard.' },
  rocky:   { role: 'USER', status: 'SUPPRIME', detail: 'Agent supprime. Compte desactive.' },
  rover:   { role: 'USER', detail: 'Agent assistant. Acces standard.' },
};

const USER_ALIASES: Record<string, string> = {
  einstein: 'genius',
};

function getPermissionsForUser(name: string): string {
  const key = name.toLowerCase();
  const resolved = USER_ALIASES[key] ?? key;
  const user = USER_PERMISSIONS[resolved];

  if (!user) {
    return [
      '',
      `Utilisateur '${name}' introuvable.`,
      'Utilisateurs disponibles : merlin, links, bonzi, clippy, genie, genius, peedy, rocky, rover',
      '',
    ].join('\n');
  }

  const displayName = resolved.charAt(0).toUpperCase() + resolved.slice(1);
  const warning = user.role === 'ADMIN' ? '  ⚠️  ATTENTION: PRIVILEGES ELEVES' : '';
  const statusLine = user.status ? `  Statut. . . . . : ${user.status}` : '';

  return [
    '',
    `PINDOWS SECURITY — Permissions de ${displayName}`,
    '====================================',
    `  Nom . . . . . . : ${displayName}`,
    `  Role. . . . . . : ${user.role}${warning}`,
    statusLine,
    `  Detail. . . . . : ${user.detail}`,
    '====================================',
    '',
  ].filter(Boolean).join('\n');
}

const DNS_RECORDS: Record<string, { ip: string; fqdn: string }> = {
  // Characters
  merlin:   { ip: '10.98.0.1',  fqdn: 'merlin.pindows.local' },
  links:    { ip: '10.98.0.2',  fqdn: 'links.pindows.local' },
  bonzi:    { ip: '10.98.0.3',  fqdn: 'bonzi.pindows.local' },
  clippy:   { ip: '10.98.0.4',  fqdn: 'clippy.pindows.local' },
  genie:    { ip: '10.98.0.5',  fqdn: 'genie.pindows.local' },
  genius:   { ip: '10.98.0.5',  fqdn: 'genie.pindows.local' },
  einstein: { ip: '10.98.0.6',  fqdn: 'einstein.pindows.local' },
  peedy:    { ip: '10.98.0.7',  fqdn: 'peedy.pindows.local' },
  rocky:    { ip: '10.98.0.8',  fqdn: 'rocky.pindows.local' },
  rover:    { ip: '10.98.0.9',  fqdn: 'rover.pindows.local' },
  // Story domains (indices)
  'avost':                  { ip: '10.98.0.6',  fqdn: 'avost.antivirus.com' },
  'avost.antivirus.com':    { ip: '10.98.0.6',  fqdn: 'avost.antivirus.com' },
  'faurnite.battlepass.com':{ ip: '10.98.0.5',  fqdn: 'faurnite.battlepass.com' },
  'faurnite':               { ip: '10.98.0.5',  fqdn: 'faurnite.battlepass.com' },
  'devine-moi.fr':          { ip: '10.98.0.5',  fqdn: 'devine-moi.fr' },
  'maison.bonzai.local':    { ip: '10.98.0.3',  fqdn: 'maison.bonzai.local' },
  'jeux-singes-roses.fr':   { ip: '10.98.0.3',  fqdn: 'jeux-singes-roses.fr' },
  // Real-world domains (random IPs, no story relevance)
  'google.com':             { ip: '8.8.8.8',    fqdn: 'google.com' },
  'google':                 { ip: '8.8.8.8',    fqdn: 'google.com' },
  'youtube.com':            { ip: '142.250.74.206', fqdn: 'youtube.com' },
  'youtube':                { ip: '142.250.74.206', fqdn: 'youtube.com' },
  'facebook.com':           { ip: '157.240.1.35', fqdn: 'facebook.com' },
  'twitter.com':            { ip: '104.244.42.1', fqdn: 'twitter.com' },
  'wikipedia.org':          { ip: '208.80.154.224', fqdn: 'wikipedia.org' },
  'amazon.com':             { ip: '54.239.28.85', fqdn: 'amazon.com' },
  'reddit.com':             { ip: '151.101.1.140', fqdn: 'reddit.com' },
  'twitch.tv':              { ip: '52.26.14.11', fqdn: 'twitch.tv' },
  'discord.com':            { ip: '162.159.128.233', fqdn: 'discord.com' },
  'github.com':             { ip: '140.82.121.3', fqdn: 'github.com' },
  'stackoverflow.com':      { ip: '151.101.1.69', fqdn: 'stackoverflow.com' },
  // Internal
  'pindows':                { ip: '10.98.0.100',fqdn: 'pindows.local' },
  'pindows.local':          { ip: '10.98.0.100',fqdn: 'pindows.local' },
  'localhost':              { ip: '127.0.0.1',  fqdn: 'localhost' },
};

function getNslookupOutput(host: string): string {
  const key = host.toLowerCase();
  const record = DNS_RECORDS[key];

  if (!record) {
    return [
      '',
      `Serveur :  dns.pindows.local`,
      `Address :  10.98.0.100`,
      '',
      `*** dns.pindows.local ne parvient pas a trouver ${host} : Non-existent domain`,
      '',
    ].join('\n');
  }

  return [
    '',
    `Serveur :  dns.pindows.local`,
    `Address :  10.98.0.100`,
    '',
    `Nom :    ${record.fqdn}`,
    `Address :  ${record.ip}`,
    '',
  ].join('\n');
}

function handleCommand(cmd: string, profile: Record<string, string>): string {
  const trimmed = cmd.trim();
  const lower = trimmed.toLowerCase();
  const parts = lower.split(/\s+/);
  const command = parts[0];

  if (!trimmed) return '';

  switch (command) {
    case 'help':
      return [
        '',
        'Commandes disponibles :',
        '  help                  Affiche cette aide',
        '  cls / clear           Efface l\'ecran',
        '  dir / ls              Liste les fichiers',
        '  cd                    Affiche le repertoire courant',
        '  whoami                Affiche l\'utilisateur courant',
        '  ver                   Affiche la version de Pindows',
        '  echo <texte>          Affiche un texte',
        '  ping <hote>           Ping un hote',
        '  nslookup <hote>       Resout un nom de domaine',
        '  ipconfig              Affiche la configuration reseau',
        '  net user              Liste les utilisateurs',
        '  permissions <user>    Affiche les permissions d\'un utilisateur',
        '  date                  Affiche la date',
        '  time                  Affiche l\'heure',
        '  color                 Change... rien du tout',
        '',
      ].join('\n');

    case 'cls':
    case 'clear':
      return '\x00CLEAR';

    case 'dir':
    case 'ls': {
      const date = new Date();
      const d = `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`;
      return [
        '',
        ` Repertoire de C:\\`,
        '',
        `${d}  <DIR>          Mes documents`,
        `${d}  <DIR>          Program Files`,
        `${d}  <DIR>          Windows`,
        `11/05/1998       1 024  autoexec.bat`,
        `11/05/1998       1 024  config.sys`,
        `11/05/1998      93 184  command.com`,
        `               3 fichier(s)       95 232 octets`,
        `               3 Rep(s)   420 690 000 octets libres`,
        '',
      ].join('\n');
    }

    case 'cd':
      return '\nC:\\\n';

    case 'whoami':
      return `\npindows\\${profile.firstName || 'utilisateur'}\n`;

    case 'ver':
      return '\nPindows 98 [Version 4.10.1998]\n(c) 1998 Pindows Corporation. Tous droits reserves.\n';

    case 'echo':
      return '\n' + trimmed.slice(5) + '\n';

    case 'ping': {
      const host = parts[1] || 'localhost';
      return [
        '',
        `Envoi d'une requete 'ping' sur ${host} [127.0.0.1] avec 32 octets de donnees :`,
        `Reponse de 127.0.0.1 : octets=32 temps=1ms TTL=128`,
        `Reponse de 127.0.0.1 : octets=32 temps<1ms TTL=128`,
        `Reponse de 127.0.0.1 : octets=32 temps=1ms TTL=128`,
        '',
        `Statistiques Ping pour 127.0.0.1 :`,
        `    Paquets : envoyes = 3, recus = 3, perdus = 0 (0% perte)`,
        '',
      ].join('\n');
    }

    case 'nslookup': {
      if (!parts[1]) {
        return [
          '',
          'Usage : nslookup <nom_hote>',
          '',
          'Exemple : nslookup google.com',
          '          nslookup merlin',
          '',
        ].join('\n');
      }
      return getNslookupOutput(parts[1]);
    }

    case 'ipconfig':
      return [
        '',
        'Configuration IP de Pindows',
        '',
        '  Carte Ethernet :',
        '    Adresse IP. . . . . . : 192.168.1.98',
        '    Masque de sous-reseau : 255.255.255.0',
        '    Passerelle. . . . . . : 192.168.1.1',
        '',
      ].join('\n');

    case 'net':
      if (parts[1] === 'user') {
        return [
          '',
          'Comptes utilisateurs de \\\\PINDOWS',
          '',
          '-------------------------------------------',
          'Bonzi            Clippy           Genie',
          'Genius           Links            Merlin',
          'Peedy            Rocky            Rover',
          '-------------------------------------------',
          'La commande s\'est terminee correctement.',
          '',
          'Tapez "permissions <nom>" pour voir les droits d\'un utilisateur.',
          '',
        ].join('\n');
      }
      return `\n'net ${parts[1] || ''}' n'est pas reconnu.\nTapez "net user" pour lister les utilisateurs.\n`;

    case 'permissions':
      if (!parts[1]) {
        return [
          '',
          'Usage : permissions <nom_utilisateur>',
          '',
          'Exemple : permissions merlin',
          '          permissions bonzi',
          '',
          'Tapez "net user" pour voir la liste des utilisateurs.',
          '',
        ].join('\n');
      }
      return getPermissionsForUser(parts[1]);

    case 'date':
      return `\nLa date du jour est : ${new Date().toLocaleDateString('fr-FR')}\n`;

    case 'time':
      return `\nL'heure actuelle est : ${new Date().toLocaleTimeString('fr-FR')}\n`;

    case 'color':
      return '\nNice try. Les couleurs ne changent pas ici.\n';

    case 'exit':
      return '\nVous ne pouvez pas quitter Pindows. Pindows est eternel.\n';

    case 'rm':
    case 'del':
    case 'delete':
      return '\nAcces refuse. Vous n\'avez pas les permissions necessaires.\n(Seul un ADMIN pourrait faire ca...)\n';

    case 'sudo':
      return '\nVous n\'etes pas sous Linux ici. Mais bel essai.\n';

    case 'hack':
    case 'hacker':
      return '\n⚠️  ALERTE SECURITE : Tentative de piratage detectee !\n...je rigole. Tapez "help" pour les vraies commandes.\n';

    default:
      return `\n'${trimmed}' n'est pas reconnu en tant que commande interne\nou externe, un programme executable ou un fichier de commandes.\n`;
  }
}

export function Terminal() {
  const { gameState, dispatch } = useGame();
  const [lines, setLines] = useState<string[]>([
    'Pindows 98 [Version 4.10.1998]',
    '(c) 1998 Pindows Corporation. Tous droits reserves.',
    '',
    'Tapez "help" pour la liste des commandes.',
    '',
  ]);
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [lines]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    const cmd = input;
    setInput('');

    const result = handleCommand(cmd, gameState.profile);

    if (result === '\x00CLEAR') {
      setLines([]);
      return;
    }

    setLines(prev => [...prev, `C:\\>${cmd}`, ...result.split('\n')]);

    // Dispatch event when user checks Bonzi's permissions specifically
    const parts = cmd.trim().toLowerCase().split(/\s+/);
    if (parts[0] === 'permissions' && parts[1] === 'bonzi') {
      dispatch({ type: 'item_clicked', itemId: 'used_permissions_bonzi', windowType: 'terminal' });
    }
  }, [input, gameState.profile, dispatch]);

  return (
    <div
      className="terminal"
      onClick={() => inputRef.current?.focus()}
    >
      <div className="terminal-output" ref={scrollRef}>
        {lines.map((line, i) => (
          <div key={i} className="terminal-line">
            {line || '\u00A0'}
          </div>
        ))}
        <form onSubmit={handleSubmit} className="terminal-prompt">
          <span className="terminal-prompt-text">C:\&gt;</span>
          <input
            ref={inputRef}
            className="terminal-input"
            value={input}
            onChange={e => setInput(e.target.value)}
            spellCheck={false}
            autoComplete="off"
          />
        </form>
      </div>
    </div>
  );
}
