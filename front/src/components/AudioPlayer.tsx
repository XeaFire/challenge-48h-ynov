import { useEffect, useRef } from 'react';
import { useAudio } from '../hooks/useAudio';

interface AudioPlayerProps {
  src: string;
  play?: boolean;
  loop?: boolean;
}

export function AudioPlayer({ src, play = false, loop = false }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const { registerAudioElement, unregisterAudioElement } = useAudio();

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      registerAudioElement(audio);
      audio.loop = loop;

      return () => {
        unregisterAudioElement(audio);
      };
    }
  }, [registerAudioElement, unregisterAudioElement, loop]);

  useEffect(() => {
    const audio = audioRef.current;
    if (audio && play) {
      audio.currentTime = 0;
      audio.play().catch(() => {
        // Ignore play errors (e.g., user hasn't interacted with page yet)
      });
    }
  }, [play]);

  return <audio ref={audioRef} src={src} preload="auto" />;
}