import { useState, useCallback, useRef } from 'react';
import type { WindowState, WindowType } from '../types';

const WINDOW_DEFAULTS: Record<WindowType, { title: string; width: number; height: number }> = {
  mycomputer: { title: 'Poste de travail', width: 550, height: 400 },
  notepad: { title: 'Sans titre - Bloc-notes', width: 480, height: 340 },
  recyclebin: { title: 'Corbeille', width: 450, height: 300 },
  about: { title: 'A propos de Pindows 98', width: 380, height: 260 },
  calculator: { title: 'Calculatrice', width: 260, height: 305 },
  paint: { title: 'Sans titre - Paint', width: 640, height: 480 },
  explorer: { title: 'Explorateur Windows', width: 600, height: 420 },
  mail: { title: 'Pindows Mail', width: 650, height: 450 },
};

const CASCADE_OFFSET = 20;
const CASCADE_ORIGIN = { x: 80, y: 40 };

export function useWindowManager() {
  const [windows, setWindows] = useState<WindowState[]>([]);
  const [focusOrder, setFocusOrder] = useState<string[]>([]);
  const idCounter = useRef(0);

  const openWindow = useCallback((type: WindowType) => {
    const id = `win-${++idCounter.current}`;
    const defaults = WINDOW_DEFAULTS[type];

    const newWindow: WindowState = {
      id,
      type,
      title: defaults.title,
      width: defaults.width,
      height: defaults.height,
      x: CASCADE_ORIGIN.x + idCounter.current * CASCADE_OFFSET,
      y: CASCADE_ORIGIN.y + idCounter.current * CASCADE_OFFSET,
      minimized: false,
      maximized: false,
      previousBounds: null,
    };

    setWindows(previous => [...previous, newWindow]);
    setFocusOrder(previous => [...previous, id]);
  }, []);

  const closeWindow = useCallback((id: string) => {
    setWindows(previous => previous.filter(window => window.id !== id));
    setFocusOrder(previous => previous.filter(windowId => windowId !== id));
  }, []);

  const focusWindow = useCallback((id: string) => {
    setFocusOrder(previous => [...previous.filter(windowId => windowId !== id), id]);
    setWindows(previous =>
      previous.map(window =>
        window.id === id ? { ...window, minimized: false } : window
      )
    );
  }, []);

  const minimizeWindow = useCallback((id: string) => {
    setWindows(previous =>
      previous.map(window =>
        window.id === id ? { ...window, minimized: true } : window
      )
    );
  }, []);

  const maximizeWindow = useCallback((id: string) => {
    setWindows(previous =>
      previous.map(window => {
        if (window.id !== id) return window;
        if (window.maximized) {
          return {
            ...window, maximized: false,
            x: window.previousBounds?.x ?? window.x,
            y: window.previousBounds?.y ?? window.y,
            width: window.previousBounds?.width ?? window.width,
            height: window.previousBounds?.height ?? window.height,
            previousBounds: null,
          };
        }
        return {
          ...window, maximized: true,
          previousBounds: { x: window.x, y: window.y, width: window.width, height: window.height },
        };
      })
    );
  }, []);

  const updateWindowPosition = useCallback((id: string, x: number, y: number) => {
    setWindows(previous =>
      previous.map(window => window.id === id ? { ...window, x, y } : window)
    );
  }, []);

  const activeWindowId = focusOrder.length > 0 ? focusOrder[focusOrder.length - 1] : null;

  return {
    windows, focusOrder, activeWindowId,
    openWindow, closeWindow, focusWindow,
    minimizeWindow, maximizeWindow, updateWindowPosition,
  };
}
