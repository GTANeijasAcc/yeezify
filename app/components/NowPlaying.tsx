'use client';

import { useState } from 'react';
import { useStore } from '@/app/store/useStore';
import { useAudioPlayer } from '@/app/hooks/useAudioPlayer';
import { formatDuration } from '@/app/lib/utils';
import {
  ChevronDown, Heart, Share2, SkipBack, SkipForward,
  Play, Pause, Shuffle, Repeat, Repeat1, Mic2, Volume2, Check, Copy
} from 'lucide-react';

export default function NowPlaying() {
  const {
    player, setView, tracks, toggleFavorite, togglePlay,
    nextTrack, prevTrack, setVolume, toggleShuffle, toggleRepeat,
    showLyrics, toggleLyrics, updateTrackLyrics
  } = useStore();
  const { seek } = useAudioPlayer();

  const { currentTrack, isPlaying, volume, progress, duration, shuffle, repeat } = player;
  const [editingLyrics, setEditingLyrics] = useState(false);
  const [lyricsText, setLyricsText] = useState('');
  const [sharePopup, setSharePopup] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!currentTrack) return null;

  const isFav = tracks[currentTrack.id]?.isFavorite;
  const progressPct = duration > 0 ? (progress / duration) * 100 : 0;
  const currentLyrics = tracks[currentTrack.id]?.lyrics;

  const handleShare = async () => {
    const url = `${window.location.origin}?track=${currentTrack.id}`;
    await navigator.clipboard.writeText(url).catch(() => {});
    setCopied(true);
    setSharePopup(true);
    setTimeout(() => { setCopied(false); setSharePopup(false); }, 3000);
  };

  const saveLyrics = () => {
    updateTrackLyrics(currentTrack.id, lyricsText);
    setEditingLyrics(false);
  };

  return (
    <div
      className="absolute inset-0 z-50 flex flex-col slide-up overflow-hidden"
      style={{
        background: currentTrack.coverUrl
          ? `linear-gradient(180deg, #1a1a1a 0%, #0a0a0a 100%)`
          : '#0a0a0a'
      }}
    >
      {/* Background blur from cover */}
      {currentTrack.coverUrl && (
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `url(${currentTrack.coverUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'blur(80px)',
          }}
        />
      )}

      <div className="relative z-10 flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between px-8 pt-8 pb-4">
          <button
            onClick={() => setView('home')}
            className="flex items-center gap-2 text-yeezy-text hover:text-white transition-colors"
          >
            <ChevronDown size={24} />
          </button>
          <div className="text-center">
            <p className="text-xs text-yeezy-muted uppercase tracking-widest">Now Playing</p>
            <p className="text-sm font-medium text-white truncate max-w-xs">{currentTrack.album}</p>
          </div>
          <button onClick={handleShare} className="text-yeezy-text hover:text-yeezy-gold transition-colors relative">
            <Share2 size={20} />
            {sharePopup && (
              <div className="absolute right-0 top-8 bg-yeezy-card border border-yeezy-border rounded-lg px-3 py-2 text-xs text-white whitespace-nowrap flex items-center gap-1.5 shadow-xl">
                <Check size={12} className="text-yeezy-gold" />
                Link copied!
              </div>
            )}
          </button>
        </div>

        {/* Artwork + Lyrics toggle */}
        <div className="flex-1 flex flex-col items-center justify-center px-10 gap-8 overflow-hidden">
          {showLyrics ? (
            <div className="w-full max-w-md h-64 overflow-y-auto">
              {editingLyrics ? (
                <div className="flex flex-col gap-3 h-full">
                  <textarea
                    className="flex-1 w-full bg-yeezy-card border border-yeezy-border rounded-xl p-4 text-white text-sm resize-none focus:outline-none focus:border-yeezy-gold placeholder-yeezy-muted h-48"
                    placeholder="Paste lyrics here..."
                    value={lyricsText}
                    onChange={(e) => setLyricsText(e.target.value)}
                    autoFocus
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={saveLyrics}
                      className="flex-1 bg-yeezy-gold text-black py-2 rounded-lg text-sm font-semibold hover:bg-yeezy-gold-light transition-colors"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingLyrics(false)}
                      className="flex-1 bg-yeezy-card text-white py-2 rounded-lg text-sm hover:bg-yeezy-border transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : currentLyrics ? (
                <div className="text-center space-y-2 cursor-pointer" onClick={() => { setLyricsText(currentLyrics); setEditingLyrics(true); }}>
                  {currentLyrics.split('\n').map((line, i) => (
                    <p key={i} className={`text-lg leading-relaxed ${line.trim() === '' ? 'h-4' : 'text-white/90'}`}>
                      {line || ' '}
                    </p>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full gap-3 text-center">
                  <Mic2 size={40} className="text-yeezy-muted" />
                  <p className="text-yeezy-text text-sm">No lyrics yet</p>
                  <button
                    onClick={() => { setLyricsText(''); setEditingLyrics(true); }}
                    className="text-yeezy-gold hover:text-yeezy-gold-light text-sm transition-colors"
                  >
                    + Add lyrics
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="relative">
              {currentTrack.coverUrl ? (
                <img
                  src={currentTrack.coverUrl}
                  alt={currentTrack.album}
                  className={`w-72 h-72 rounded-2xl object-cover shadow-2xl ${isPlaying ? '' : 'opacity-80'} gold-glow transition-all duration-500`}
                />
              ) : (
                <div className="w-72 h-72 rounded-2xl bg-yeezy-card flex items-center justify-center shadow-2xl gold-glow">
                  <span className="text-8xl">🎵</span>
                </div>
              )}
              {/* Vinyl ring when playing */}
              {isPlaying && (
                <div className="absolute inset-0 rounded-2xl border-2 border-yeezy-gold/20 animate-pulse" />
              )}
            </div>
          )}

          {/* Track info */}
          <div className="w-full max-w-md flex items-start justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white leading-tight">{currentTrack.title}</h2>
              <p className="text-yeezy-text mt-0.5">{currentTrack.artist}</p>
            </div>
            <div className="flex items-center gap-3 pt-1">
              <button
                onClick={() => toggleFavorite(currentTrack.id)}
                className={`transition-all duration-200 ${isFav ? 'text-yeezy-gold scale-110' : 'text-yeezy-muted hover:text-white'}`}
              >
                <Heart size={24} fill={isFav ? 'currentColor' : 'none'} />
              </button>
              <button
                onClick={toggleLyrics}
                className={`transition-colors ${showLyrics ? 'text-yeezy-gold' : 'text-yeezy-muted hover:text-white'}`}
              >
                <Mic2 size={20} />
              </button>
            </div>
          </div>

          {/* Progress */}
          <div className="w-full max-w-md">
            <div
              className="relative h-1.5 rounded-full bg-yeezy-border cursor-pointer group mb-2"
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const pct = (e.clientX - rect.left) / rect.width;
                seek(Math.max(0, Math.min(pct * duration, duration)));
              }}
            >
              <div
                className="absolute inset-y-0 left-0 bg-white group-hover:bg-yeezy-gold rounded-full transition-colors"
                style={{ width: `${progressPct}%` }}
              />
              <div
                className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity -ml-1.5"
                style={{ left: `${progressPct}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-yeezy-muted tabular-nums">
              <span>{formatDuration(progress)}</span>
              <span>{formatDuration(duration)}</span>
            </div>
          </div>

          {/* Controls */}
          <div className="w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <button onClick={toggleShuffle} className={shuffle ? 'text-yeezy-gold' : 'text-yeezy-muted hover:text-white'}>
                <Shuffle size={20} />
              </button>
              <button onClick={prevTrack} className="text-white hover:text-yeezy-gold transition-colors">
                <SkipBack size={28} />
              </button>
              <button
                onClick={togglePlay}
                className="w-16 h-16 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 transition-transform shadow-lg"
              >
                {isPlaying ? <Pause size={24} /> : <Play size={24} className="ml-1" />}
              </button>
              <button onClick={nextTrack} className="text-white hover:text-yeezy-gold transition-colors">
                <SkipForward size={28} />
              </button>
              <button onClick={toggleRepeat} className={repeat !== 'none' ? 'text-yeezy-gold' : 'text-yeezy-muted hover:text-white'}>
                {repeat === 'one' ? <Repeat1 size={20} /> : <Repeat size={20} />}
              </button>
            </div>

            {/* Volume */}
            <div className="flex items-center gap-3">
              <Volume2 size={16} className="text-yeezy-muted flex-shrink-0" />
              <div
                className="flex-1 relative h-1 rounded-full bg-yeezy-border cursor-pointer group"
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const v = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
                  setVolume(v);
                }}
              >
                <div
                  className="absolute inset-y-0 left-0 bg-white group-hover:bg-yeezy-gold rounded-full transition-colors"
                  style={{ width: `${volume * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
