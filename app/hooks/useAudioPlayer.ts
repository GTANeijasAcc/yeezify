'use client';

import { useEffect } from 'react';
import { useStore } from '@/app/store/useStore';

let sharedAudio: HTMLAudioElement | null = null;
let listenersAttached = false;

function getSharedAudio() {
  if (typeof window === 'undefined') return null;
  if (!sharedAudio) {
    sharedAudio = new Audio();
  }
  return sharedAudio;
}

export function useAudioPlayer() {
  const { player, setProgress, setDuration, nextTrack } = useStore();

  useEffect(() => {
    getSharedAudio();
  }, []);

  useEffect(() => {
    const audio = getSharedAudio();
    if (!audio) return;
    if (player.currentTrack?.url) {
      if (audio.src !== player.currentTrack.url) {
        audio.src = player.currentTrack.url;
      }
      audio.volume = player.volume;
      if (player.isPlaying) {
        audio.play().catch(() => {});
      } else {
        audio.pause();
      }
    } else {
      audio.pause();
    }
  }, [player.currentTrack?.id, player.isPlaying, player.volume]);

  useEffect(() => {
    const audio = getSharedAudio();
    if (!audio || listenersAttached) return;

    listenersAttached = true;

    const onTimeUpdate = () => setProgress(audio.currentTime);
    const onDurationChange = () => setDuration(audio.duration || 0);
    const onEnded = () => {
      if (player.repeat === 'one') {
        audio.currentTime = 0;
        audio.play().catch(() => {});
      } else {
        nextTrack();
      }
    };

    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('durationchange', onDurationChange);
    audio.addEventListener('ended', onEnded);

    return () => {
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('durationchange', onDurationChange);
      audio.removeEventListener('ended', onEnded);
      listenersAttached = false;
    };
  }, [player.repeat, nextTrack, setProgress, setDuration]);

  const seek = (time: number) => {
    const audio = getSharedAudio();
    if (!audio) return;
    audio.currentTime = time;
    setProgress(time);
  };

  return { seek };
}
