export type WindowType = 'mycomputer' | 'notepad' | 'recyclebin' | 'about';

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
