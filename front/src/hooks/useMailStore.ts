import { useSyncExternalStore } from 'react';
import type { Mail, MailFolder } from '../types';

let nextId = 1;
function genId() { return `mail-${nextId++}`; }

function now() {
  const d = new Date();
  return d.toLocaleDateString('fr-FR') + ' ' + d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
}

type Listener = () => void;

const DEFAULT_MAILS: Mail[] = [
  {
    id: genId(),
    from: 'admin@pindows.fr',
    to: 'utilisateur@pindows.fr',
    subject: 'Bienvenue sur Pindows 98 !',
    body: 'Cher utilisateur,\n\nBienvenue sur Pindows 98, votre nouveau système d\'exploitation préféré !\n\nNous espérons que vous apprécierez votre expérience.\n\nCordialement,\nL\'équipe Pindows',
    date: '25/06/1998 09:00',
    read: false,
    folder: 'inbox',
  },
  {
    id: genId(),
    from: 'bill@micropsoft.com',
    to: 'utilisateur@pindows.fr',
    subject: 'Mise à jour importante disponible',
    body: 'Bonjour,\n\nUne mise à jour critique de sécurité est disponible pour Pindows 98.\nVeuillez télécharger le patch depuis notre site web.\n\nMerci,\nBill',
    date: '02/07/1998 14:23',
    read: false,
    folder: 'inbox',
  },
  {
    id: genId(),
    from: 'promo@internet.fr',
    to: 'utilisateur@pindows.fr',
    subject: 'Offre spéciale : 56k illimité !',
    body: 'OFFRE EXCEPTIONNELLE !!!\n\nConnexion Internet 56k ILLIMITÉE pour seulement 199F/mois !\n\nAppellez le 0800 INTERNET maintenant !\n\n(Ceci n\'est pas un spam)',
    date: '10/07/1998 08:45',
    read: true,
    folder: 'inbox',
  },
  {
    id: genId(),
    from: 'utilisateur@pindows.fr',
    to: 'ami@wanadoo.fr',
    subject: 'Re: Salut !',
    body: 'Salut !\n\nOui j\'ai bien reçu ton message. On se voit samedi ?\n\nA+',
    date: '15/07/1998 17:30',
    read: true,
    folder: 'sent',
  },
];

class MailStore {
  private mails: Mail[] = [...DEFAULT_MAILS];
  private listeners: Set<Listener> = new Set();

  private emit() {
    this.listeners.forEach(l => l());
  }

  subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    return () => { this.listeners.delete(listener); };
  }

  getSnapshot(): Mail[] {
    return this.mails;
  }

  getAll(): Mail[] {
    return this.mails;
  }

  getByFolder(folder: MailFolder): Mail[] {
    return this.mails.filter(m => m.folder === folder);
  }

  getById(id: string): Mail | undefined {
    return this.mails.find(m => m.id === id);
  }

  getUnreadCount(folder: MailFolder): number {
    return this.mails.filter(m => m.folder === folder && !m.read).length;
  }

  send(mail: { from: string; to: string; subject: string; body: string; folder?: MailFolder; date?: string }): Mail {
    const newMail: Mail = {
      id: genId(),
      from: mail.from,
      to: mail.to,
      subject: mail.subject,
      body: mail.body,
      date: mail.date ?? now(),
      read: false,
      folder: mail.folder ?? 'inbox',
    };
    this.mails = [newMail, ...this.mails];
    this.emit();
    return newMail;
  }

  sendOutgoing(mail: { from: string; to: string; subject: string; body: string }): Mail {
    const newMail: Mail = {
      id: genId(),
      from: mail.from,
      to: mail.to,
      subject: mail.subject,
      body: mail.body,
      date: now(),
      read: true,
      folder: 'sent',
    };
    this.mails = [newMail, ...this.mails];
    this.emit();
    return newMail;
  }

  markAsRead(id: string): void {
    this.mails = this.mails.map(m => m.id === id ? { ...m, read: true } : m);
    this.emit();
  }

  markAsUnread(id: string): void {
    this.mails = this.mails.map(m => m.id === id ? { ...m, read: false } : m);
    this.emit();
  }

  moveTo(id: string, folder: MailFolder): void {
    this.mails = this.mails.map(m => m.id === id ? { ...m, folder } : m);
    this.emit();
  }

  remove(id: string): void {
    const mail = this.getById(id);
    if (!mail) return;
    if (mail.folder === 'trash') {
      this.mails = this.mails.filter(m => m.id !== id);
    } else {
      this.mails = this.mails.map(m => m.id === id ? { ...m, folder: 'trash' } : m);
    }
    this.emit();
  }

  emptyTrash(): void {
    this.mails = this.mails.filter(m => m.folder !== 'trash');
    this.emit();
  }
}

export const mailStore = new MailStore();

export function useMailStore(): Mail[] {
  return useSyncExternalStore(
    (cb) => mailStore.subscribe(cb),
    () => mailStore.getSnapshot(),
  );
}

export function useMailsByFolder(folder: MailFolder): Mail[] {
  const all = useMailStore();
  return all.filter(m => m.folder === folder);
}
