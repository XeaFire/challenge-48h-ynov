import { useEffect, useRef } from 'react';
import { useGame } from '../game/GameContext';

export function useAudio() {
  const { gameState } = useGame();
  const audioElements = useRef<HTMLAudioElement[]>([]);
  const audioContextRef = useRef<AudioContext | null>(null);
  const masterGainNodeRef = useRef<GainNode | null>(null);

  // Initialize global audio context and master gain
  useEffect(() => {
    const initAudio = async () => {
      try {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
        if (audioContextRef.current) {
          masterGainNodeRef.current = audioContextRef.current.createGain();
          masterGainNodeRef.current.connect(audioContextRef.current.destination);
          
          // Resume audio context if suspended (required by browsers)
          if (audioContextRef.current.state === 'suspended') {
            await audioContextRef.current.resume();
          }
        }
      } catch (e) {
        console.warn('Web Audio API not supported');
      }
    };

    initAudio();

    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  // Update master volume when gameState changes
  useEffect(() => {
    if (masterGainNodeRef.current && audioContextRef.current) {
      const effectiveVolume = gameState.muted ? 0 : gameState.volume / 100;
      masterGainNodeRef.current.gain.setValueAtTime(effectiveVolume, audioContextRef.current.currentTime);
    }
  }, [gameState.volume, gameState.muted]);

  // Function to register an audio element for global volume control
  const registerAudioElement = (audio: HTMLAudioElement) => {
    if (!audioElements.current.includes(audio)) {
      audioElements.current.push(audio);
      // Apply current volume/mute settings immediately
      applyAudioSettings(audio);
    }
  };

  // Function to unregister an audio element
  const unregisterAudioElement = (audio: HTMLAudioElement) => {
    audioElements.current = audioElements.current.filter(a => a !== audio);
  };

  // Apply volume and mute settings to an audio element
  const applyAudioSettings = (audio: HTMLAudioElement) => {
    const effectiveVolume = gameState.muted ? 0 : gameState.volume / 100;
    audio.volume = Math.max(0, Math.min(1, effectiveVolume));
  };

  // Apply settings to all registered audio elements
  const applyToAllAudio = () => {
    audioElements.current.forEach(applyAudioSettings);
  };

  // Update all audio elements when volume or mute changes
  useEffect(() => {
    applyToAllAudio();
  }, [gameState.volume, gameState.muted]);

  // Function to resume audio context if suspended
  const resumeAudioContext = async () => {
    if (audioContextRef.current && audioContextRef.current.state === 'suspended') {
      await audioContextRef.current.resume();
    }
  };

  return {
    registerAudioElement,
    unregisterAudioElement,
    getEffectiveVolume: () => gameState.muted ? 0 : gameState.volume / 100,
    audioContext: audioContextRef.current,
    masterGainNode: masterGainNodeRef.current,
    resumeAudioContext,
  };
}