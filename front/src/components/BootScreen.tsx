import { useState, useEffect } from 'react';

interface BootScreenProps {
  onComplete: () => void;
}

export function BootScreen({ onComplete }: BootScreenProps) {
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(current => {
        const next = current + Math.random() * 15 + 5;

        if (next >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setVisible(false);
            onComplete();
          }, 400);
          return 100;
        }

        return next;
      });
    }, 200);

    return () => clearInterval(interval);
  }, [onComplete]);

  if (!visible) return null;

  return (
    <div className="boot-screen">
      <div className="boot-logo">Pindows 98</div>
      <div style={{ color: '#808080' }}>Starting Pindows...</div>
      <div className="boot-progress">
        <div
          className="boot-progress-bar"
          style={{ width: `${Math.min(progress, 100)}%` }}
        />
      </div>
    </div>
  );
}
