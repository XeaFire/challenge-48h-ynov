import { useState, useCallback } from 'react';
import { useMailStore, mailStore } from '../../hooks/useMailStore';
import { MailReadIcon, MailUnreadIcon } from '../../icons';
import type { Mail, MailFolder } from '../../types';
import { GlitchText } from './GlitchText';

const FOLDERS: { key: MailFolder; label: string; icon: string }[] = [
  { key: 'inbox', label: 'Boîte de réception', icon: '📥' },
  { key: 'sent', label: 'Éléments envoyés', icon: '📤' },
  { key: 'drafts', label: 'Brouillons', icon: '📝' },
  { key: 'trash', label: 'Éléments supprimés', icon: '🗑' },
];

type View = 'list' | 'compose' | 'read';

export function MailApp() {
  const allMails = useMailStore();
  const [activeFolder, setActiveFolder] = useState<MailFolder>('inbox');
  const [selectedMailId, setSelectedMailId] = useState<string | null>(null);
  const [view, setView] = useState<View>('list');

  // Compose state
  const [composeTo, setComposeTo] = useState('');
  const [composeSubject, setComposeSubject] = useState('');
  const [composeBody, setComposeBody] = useState('');

  const folderMails = allMails.filter(m => m.folder === activeFolder);
  const selectedMail = selectedMailId ? allMails.find(m => m.id === selectedMailId) ?? null : null;

  const handleSelectFolder = (folder: MailFolder) => {
    setActiveFolder(folder);
    setSelectedMailId(null);
    setView('list');
  };

  const handleSelectMail = useCallback((mail: Mail) => {
    setSelectedMailId(mail.id);
    setView('read');
    if (!mail.read) {
      mailStore.markAsRead(mail.id);
    }
  }, []);

  const handleCompose = () => {
    setComposeTo('');
    setComposeSubject('');
    setComposeBody('');
    setView('compose');
  };

  const handleReply = useCallback(() => {
    if (!selectedMail) return;
    setComposeTo(selectedMail.from);
    setComposeSubject('Re: ' + selectedMail.subject.replace(/^Re: /, ''));
    setComposeBody('\n\n--- Message original ---\nDe: ' + selectedMail.from + '\nDate: ' + selectedMail.date + '\n\n' + selectedMail.body);
    setView('compose');
  }, [selectedMail]);

  const handleSend = useCallback(() => {
    if (!composeTo.trim() || !composeSubject.trim()) return;
    mailStore.sendOutgoing({
      from: 'utilisateur@pindows.fr',
      to: composeTo,
      subject: composeSubject,
      body: composeBody,
    });
    setView('list');
  }, [composeTo, composeSubject, composeBody]);

  const handleDelete = useCallback(() => {
    if (selectedMailId) {
      mailStore.remove(selectedMailId);
      setSelectedMailId(null);
      setView('list');
    }
  }, [selectedMailId]);

  const handleBack = () => {
    setView('list');
    setSelectedMailId(null);
  };

  return (
    <div className="mail">
      <div className="mail-toolbar">
        <button className="mail-toolbar-btn" onClick={handleCompose}>
          ✉ Nouveau
        </button>
        {view === 'read' && selectedMail && (
          <>
            <button className="mail-toolbar-btn" onClick={handleReply}>
              ↩ Répondre
            </button>
            <button className="mail-toolbar-btn" onClick={handleDelete}>
              ✕ Supprimer
            </button>
          </>
        )}
        {view !== 'list' && (
          <button className="mail-toolbar-btn" onClick={handleBack}>
            ◀ Retour
          </button>
        )}
      </div>

      <div className="mail-main">
        <div className="mail-folders">
          {FOLDERS.map(f => {
            const unread = allMails.filter(m => m.folder === f.key && !m.read).length;
            return (
              <div
                key={f.key}
                className={`mail-folder-item${activeFolder === f.key ? ' active' : ''}`}
                onClick={() => handleSelectFolder(f.key)}
              >
                <span className="mail-folder-icon">{f.icon}</span>
                <span className="mail-folder-label">{f.label}</span>
                {unread > 0 && <span className="mail-folder-badge">({unread})</span>}
              </div>
            );
          })}
        </div>

        <div className="mail-content">
          {view === 'list' && (
            <MailList
              mails={folderMails}
              selectedId={selectedMailId}
              onSelect={handleSelectMail}
              folder={activeFolder}
            />
          )}
          {view === 'read' && selectedMail && (
            <MailReader mail={selectedMail} />
          )}
          {view === 'compose' && (
            <MailCompose
              to={composeTo}
              subject={composeSubject}
              body={composeBody}
              onChangeTo={setComposeTo}
              onChangeSubject={setComposeSubject}
              onChangeBody={setComposeBody}
              onSend={handleSend}
            />
          )}
        </div>
      </div>
    </div>
  );
}

function MailList({ mails, selectedId, onSelect, folder }: {
  mails: Mail[];
  selectedId: string | null;
  onSelect: (m: Mail) => void;
  folder: MailFolder;
}) {
  return (
    <div className="mail-list">
      <div className="mail-list-header">
        <span className="mail-list-col-icon" />
        <span className="mail-list-col-from">{folder === 'sent' ? 'À' : 'De'}</span>
        <span className="mail-list-col-subject">Objet</span>
        <span className="mail-list-col-date">Date</span>
      </div>
      <div className="mail-list-body">
        {mails.length === 0 && (
          <div className="mail-empty">Aucun message dans ce dossier.</div>
        )}
        {mails.map(mail => (
          <div
            key={mail.id}
            className={`mail-list-item${selectedId === mail.id ? ' selected' : ''}${!mail.read ? ' unread' : ''}`}
            onClick={() => onSelect(mail)}
          >
            <span className="mail-list-col-icon">
              {mail.read ? <MailReadIcon size={14} /> : <MailUnreadIcon size={14} />}
            </span>
            <span className="mail-list-col-from">
              {folder === 'sent' ? mail.to : mail.from}
            </span>
            <span className="mail-list-col-subject">{mail.subject}</span>
            <span className="mail-list-col-date">{mail.date}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function renderMailBody(body: string) {
  const glitchMatch = body.match(/\{\{GLITCH:(.+?)\}\}/);
  if (!glitchMatch) return body;

  const before = body.slice(0, glitchMatch.index);
  const hiddenText = glitchMatch[1];

  return (
    <>
      {before}
      <GlitchText hidden={hiddenText} />
    </>
  );
}

function MailReader({ mail }: { mail: Mail }) {
  return (
    <div className="mail-reader">
      <div className="mail-reader-header">
        <div className="mail-reader-field">
          <span className="mail-reader-label">De:</span>
          <span>{mail.from}</span>
        </div>
        <div className="mail-reader-field">
          <span className="mail-reader-label">À:</span>
          <span>{mail.to}</span>
        </div>
        <div className="mail-reader-field">
          <span className="mail-reader-label">Date:</span>
          <span>{mail.date}</span>
        </div>
        <div className="mail-reader-field">
          <span className="mail-reader-label">Objet:</span>
          <span className="mail-reader-subject">{mail.subject}</span>
        </div>
      </div>
      <div className="mail-reader-body">{renderMailBody(mail.body)}</div>
    </div>
  );
}

function MailCompose({ to, subject, body, onChangeTo, onChangeSubject, onChangeBody, onSend }: {
  to: string;
  subject: string;
  body: string;
  onChangeTo: (v: string) => void;
  onChangeSubject: (v: string) => void;
  onChangeBody: (v: string) => void;
  onSend: () => void;
}) {
  return (
    <div className="mail-compose">
      <div className="mail-compose-fields">
        <div className="mail-compose-field">
          <label>À:</label>
          <input type="text" value={to} onChange={e => onChangeTo(e.target.value)} placeholder="destinataire@exemple.fr" />
        </div>
        <div className="mail-compose-field">
          <label>Objet:</label>
          <input type="text" value={subject} onChange={e => onChangeSubject(e.target.value)} placeholder="Objet du message" />
        </div>
      </div>
      <textarea
        className="mail-compose-body"
        value={body}
        onChange={e => onChangeBody(e.target.value)}
        placeholder="Tapez votre message ici..."
      />
      <div className="mail-compose-actions">
        <button className="win98-button" onClick={onSend}>Envoyer</button>
      </div>
    </div>
  );
}
