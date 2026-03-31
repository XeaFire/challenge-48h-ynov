import { useState, useEffect, type ReactNode } from 'react';
import { useAudio } from '../../hooks/useAudio';

interface DesktopIconProps {
  x: number;
  y: number;
  icon: ReactNode;
  label: string;
  shaking?: boolean;
  bleeding?: boolean;
  onDoubleClick: () => void;
}

export function DesktopIcon({ x, y, icon, label, shaking, bleeding, onDoubleClick }: DesktopIconProps) {
  const [fading, setFading] = useState(false);
  const [hidden, setHidden] = useState(false);
  const { getEffectiveVolume, audioContext, masterGainNode, resumeAudioContext } = useAudio();

  // Function to play a simple beep sound
  const playBeep = async () => {
    if (!audioContext || !masterGainNode) return;

    // Resume audio context if suspended
    await resumeAudioContext();

    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(masterGainNode);

    oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
    oscillator.type = 'square';

    // Use a base volume that will be modulated by the master gain
    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.1);
  };

  const handleDoubleClick = () => {
    playBeep();
    onDoubleClick();
  };

  // Apres 30s de saignement, fade out sur 3s puis disparait
  useEffect(() => {
    if (!bleeding) return;
    const fadeTimer = setTimeout(() => setFading(true), 30000);
    const hideTimer = setTimeout(() => setHidden(true), 33000);
    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(hideTimer);
      setFading(false);
      setHidden(false);
    };
  }, [bleeding]);

  return (
    <div
      className={`desktop-icon${shaking ? ' desktop-icon-shaking' : ''}`}
      style={{ left: x, top: y }}
      onDoubleClick={handleDoubleClick}
    >
      {icon}
      <span className="icon-label">{label}</span>
      {shaking && (
        <div className="blood-splash-container">
          {Array.from({ length: 20 }, (_, i) => (
            <div key={`s${i}`} className={`blood-splat blood-splat-${i}`} />
          ))}
        </div>
      )}
      {bleeding && !hidden && (
        <div
          className="blood-streams"
          style={{
            opacity: fading ? 0 : 1,
            transition: fading ? 'opacity 3s ease-out' : undefined,
          }}
        >
          <div className="blood-stream blood-stream-0" />
          <div className="blood-stream blood-stream-1" />
          <div className="blood-stream blood-stream-2" />
          <div className="blood-stream blood-stream-3" />
          <div className="blood-stream blood-stream-4" />
          <div className="blood-stream blood-stream-5" />
          <div className="blood-stream blood-stream-6" />
          <div className="blood-stream blood-stream-7" />
        </div>
      )}
    </div>
  );
}
