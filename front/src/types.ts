export type WindowType = 'mycomputer' | 'notepad' | 'recyclebin' | 'about' | 'calculator' | 'paint' | 'explorer' | 'mail' | 'solitaire' | 'ie' | 'minesweeper' | 'imageviewer' | 'terminal';

export interface Mail {
  id: string;
  from: string;
  to: string;
  subject: string;
  body: string;
  date: string;
  read: boolean;
  folder: MailFolder;
}

export type MailFolder = 'inbox' | 'sent' | 'drafts' | 'trash';

export interface WindowBounds {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface WindowState {
  id: string;
  type: WindowType;
  title: string;
  width: number;
  height: number;
  x: number;
  y: number;
  minimized: boolean;
  maximized: boolean;
  previousBounds: WindowBounds | null;
}
