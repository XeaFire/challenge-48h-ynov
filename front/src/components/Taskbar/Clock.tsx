import { useState, useEffect } from 'react';

/**
 * Formate l'heure actuelle en HH:MM.
 */
function formatCurrentTime(): string {
  const now = new Date();
  const hours = now.getHours().toString().padStart(2, '0');
  const minutes = now.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
}

/**
 * Horloge de la barre des taches.
 * Se met a jour toutes les 10 secondes.
 */
export function Clock() {
  const [time, setTime] = useState(formatCurrentTime);

  useEffect(() => {
    const interval = setInterval(() => setTime(formatCurrentTime()), 10_000);
    return () => clearInterval(interval);
  }, []);

  return <div id="clock">{time}</div>;
}
