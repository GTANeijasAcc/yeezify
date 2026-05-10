'use client';

import { useStore } from '@/app/store/useStore';
import { useAudioPlayer } from '@/app/hooks/useAudioPlayer';
import { formatDuration } from '@/app/lib/utils';
import {
  Play, Pause, SkipBack, SkipForward, Shuffle, Repeat, Repeat1,
  Volume2, VolumeX, Heart, Mic2, ChevronUp
} from 'lucide-react';

export default function PlayerBar() {
  const {
    player, togglePlay, nextTrack, prevTrack,
    setVolume, toggleShuffle, toggleRepeat,
    toggleFavorite, setView, toggleLyrics,
    tracks
  } = useStore();
  const { seek } = useAudioPlayer();

  const { currentTrack, isPlaying, volume, progress, duration, shuffle, repeat } = player;

  const isFav = currentTrack ? tracks[currentTrack.id]?.isFavorite : false;
  const progressPct = duration > 0 ? (progress / duration) * 100 : 0;

  if (!currentTrack) {
    return (
      <div className="h-20 bg-black border-t border-yeezy-border flex items-center justify-center">
        <p className="text-yeezy-muted text-sm">No track playing</p>
      </div>
    );
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 h-[88px] bg-black border-t border-yeezy-border flex items-center px-4 gap-4 shadow-2xl">
      {/* Progress bar (top) */}
      <div className="absolute top-0 left-0 right-0 h-[3px] group cursor-pointer"
        onClick={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const pct = (e.clientX - rect.left) / rect.width;
          seek(pct * duration);
        }}
      >
        <div className="absolute inset-0 bg-yeezy-border" />
        <div
          className="absolute inset-y-0 left-0 bg-yeezy-gold group-hover:bg-yeezy-gold-light transition-all"
          style={{ width: `${progressPct}%` }}
        />
      </div>

      {/* Track info */}
      <div className="flex items-center gap-3 w-64 min-w-0">
        {currentTrack.coverUrl ? (
          <img
            src={currentTrack.coverUrl}
            alt={currentTrack.album}
            className="w-14 h-14 rounded object-cover flex-shrink-0 cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => setView('nowplaying')}
          />
        ) : (
          <div
            className="w-14 h-14 rounded flex-shrink-0 flex items-center justify-center cursor-pointer"
            style={{ background: '#333' }}
            onClick={() => setView('nowplaying')}
          >
            <span className="text-2xl">🎵</span>
          </div>
        )}
        <div className="min-w-0 flex-1">
          <p
            className="text-sm font-medium text-white truncate cursor-pointer hover:underline"
            onClick={() => setView('nowplaying')}
          >
            {currentTrack.title}
          </p>
          <p className="text-xs text-yeezy-text truncate">{currentTrack.artist}</p>
        </div>
        <button
          onClick={() => toggleFavorite(currentTrack.id)}
          className={`p-1 flex-shrink-0 transition-colors ${isFav ? 'text-yeezy-gold' : 'text-yeezy-muted hover:text-white'}`}
        >
          <Heart size={16} fill={isFav ? 'currentColor' : 'none'} />
        </button>
      </div>

      {/* Controls */}
      <div className="flex-1 flex flex-col items-center gap-1">
        <div className="flex items-center gap-5">
          <button
            onClick={toggleShuffle}
            className={`transition-colors ${shuffle ? 'text-yeezy-gold' : 'text-yeezy-muted hover:text-white'}`}
          >
            <Shuffle size={16} />
          </button>
          <button
            onClick={prevTrack}
            className="text-yeezy-text hover:text-white transition-colors"
          >
            <SkipBack size={20} />
          </button>
          <button
            onClick={togglePlay}
            className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 transition-transform flex-shrink-0"
          >
            {isPlaying ? <Pause size={18} /> : <Play size={18} className="ml-0.5" />}
          </button>
          <button
            onClick={nextTrack}
            className="text-yeezy-text hover:text-white transition-colors"
          >
            <SkipForward size={20} />
          </button>
          <button
            onClick={toggleRepeat}
            className={`transition-colors ${repeat !== 'none' ? 'text-yeezy-gold' : 'text-yeezy-muted hover:text-white'}`}
          >
            {repeat === 'one' ? <Repeat1 size={16} /> : <Repeat size={16} />}
          </button>
        </div>

        {/* Time + progress */}
        <div className="flex items-center gap-2 w-full max-w-md">
          <span className="text-xs text-yeezy-muted w-9 text-right tabular-nums">{formatDuration(progress)}</span>
          <div className="flex-1 relative h-1 group cursor-pointer"
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const pct = (e.clientX - rect.left) / rect.width;
              seek(pct * duration);
            }}
          >
            <div className="absolute inset-0 bg-yeezy-border rounded-full" />
            <div
              className="absolute inset-y-0 left-0 bg-white group-hover:bg-yeezy-gold rounded-full transition-colors"
              style={{ width: `${progressPct}%` }}
            />
          </div>
          <span className="text-xs text-yeezy-muted w-9 tabular-nums">{formatDuration(duration)}</span>
        </div>
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-3 w-48 justify-end">
        <button
          onClick={toggleLyrics}
          className="text-yeezy-muted hover:text-white transition-colors p-1"
          title="Lyrics"
        >
          <Mic2 size={16} />
        </button>
        <button
          onClick={() => setView('nowplaying')}
          className="text-yeezy-muted hover:text-white transition-colors p-1"
          title="Now Playing"
        >
          <ChevronUp size={16} />
        </button>
        <button
          onClick={() => setVolume(volume === 0 ? 0.8 : 0)}
          className="text-yeezy-muted hover:text-white transition-colors"
        >
          {volume === 0 ? <VolumeX size={16} /> : <Volume2 size={16} />}
        </button>
        <div className="relative w-24 h-1 group cursor-pointer"
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const v = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
            setVolume(v);
          }}
        >
          <div className="absolute inset-0 bg-yeezy-border rounded-full" />
          <div
            className="absolute inset-y-0 left-0 bg-white group-hover:bg-yeezy-gold rounded-full transition-colors"
            style={{ width: `${volume * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
}
