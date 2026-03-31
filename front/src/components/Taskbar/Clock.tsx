import { useState, useEffect } from 'react';

function formatCurrentTime(): string {
  const now = new Date();
  const hours = now.getHours().toString().padStart(2, '0');
  const minutes = now.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
}

export function Clock() {
  const [time, setTime] = useState(formatCurrentTime);

  useEffect(() => {
    const interval = setInterval(() => setTime(formatCurrentTime()), 10_000);
    return () => clearInterval(interval);
  }, []);

  return <div id="clock">{time}</div>;
}
