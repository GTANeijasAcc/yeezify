'use client';

import { useStore } from '@/app/store/useStore';
import { Heart, Play, Music, Share2, Check } from 'lucide-react';
import { formatDuration } from '@/app/lib/utils';
import { useState } from 'react';

export default function FavoritesView() {
  const { tracks, player, playTrack, toggleFavorite } = useStore();
  const [shareTrackId, setShareTrackId] = useState<string | null>(null);

  const favTracks = Object.values(tracks).filter(t => t.isFavorite).sort((a, b) => b.addedAt - a.addedAt);

  const handleShare = async (trackId: string) => {
    const url = `${window.location.origin}?track=${trackId}`;
    await navigator.clipboard.writeText(url).catch(() => {});
    setShareTrackId(trackId);
    setTimeout(() => setShareTrackId(null), 2000);
  };

  return (
    <div className="flex-1 overflow-y-auto fade-in">
      {/* Hero gradient */}
      <div className="px-8 pt-8 pb-6" style={{ background: 'linear-gradient(180deg, #371d804d 0%, #0a0a0a 100%)' }}>
        <div className="flex items-end gap-6">
          <div className="w-48 h-48 rounded-xl flex items-center justify-center shadow-2xl flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, #7c4dff4d, #0000002a)' }}>
            <Heart size={64} className="text-white" fill="white" />
          </div>
          <div className="pb-2">
            <p className="text-xs text-yeezy-text uppercase tracking-wider mb-2">Playlist</p>
            <h1 className="text-5xl font-black text-white mb-3"
              style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: '0.05em' }}>
              LIKED SONGS
            </h1>
            <p className="text-yeezy-text text-sm">{favTracks.length} songs</p>
          </div>
        </div>

        {favTracks.length > 0 && (
          <div className="mt-6">
            <button
              onClick={() => playTrack(favTracks[0], favTracks)}
              className="w-14 h-14 rounded-full bg-yeezy-gold text-black flex items-center justify-center hover:scale-105 transition-transform shadow-lg"
            >
              <Play size={22} className="ml-0.5" />
            </button>
          </div>
        )}
      </div>

      {/* Track list */}
      <div className="px-8 pb-8">
        {favTracks.length === 0 ? (
          <div className="flex flex-col items-center py-20 text-center">
            <Heart size={48} className="text-yeezy-muted mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Songs you like will appear here</h3>
            <p className="text-yeezy-text text-sm">Save songs by tapping the heart icon</p>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-3 px-3 py-2 border-b border-yeezy-border mb-2">
              <span className="w-6 text-xs text-yeezy-muted text-center">#</span>
              <span className="flex-1 text-xs text-yeezy-muted uppercase tracking-wider">Title</span>
              <span className="text-xs text-yeezy-muted">Album</span>
              <span className="w-20 text-right text-xs text-yeezy-muted">Time</span>
              <span className="w-12" />
            </div>
            {favTracks.map((track, i) => {
              const isCurrent = player.currentTrack?.id === track.id;
              const isTrackPlaying = isCurrent && player.isPlaying;
              return (
                <div
                  key={track.id}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-md hover:bg-yeezy-card group cursor-pointer transition-colors"
                  onClick={() => playTrack(track, favTracks)}
                >
                  <div className="w-6 text-center flex-shrink-0">
                    {isTrackPlaying ? (
                      <div className="flex items-end gap-0.5 h-4 justify-center">
                        <div className="w-1 bg-yeezy-gold rounded-sm eq-bar-1" />
                        <div className="w-1 bg-yeezy-gold rounded-sm eq-bar-2" />
                        <div className="w-1 bg-yeezy-gold rounded-sm eq-bar-3" />
                      </div>
                    ) : (
                      <>
                        <span className="text-sm text-yeezy-muted group-hover:hidden">{i + 1}</span>
                        <Play size={14} className="text-white hidden group-hover:block mx-auto" />
                      </>
                    )}
                  </div>
                  {track.coverUrl ? (
                    <img src={track.coverUrl} alt="" className="w-10 h-10 rounded object-cover flex-shrink-0" />
                  ) : (
                    <div className="w-10 h-10 rounded bg-yeezy-card flex items-center justify-center flex-shrink-0">
                      <Music size={14} className="text-yeezy-muted" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium truncate ${isCurrent ? 'text-yeezy-gold' : 'text-white'}`}>
                      {track.title}
                    </p>
                    <p className="text-xs text-yeezy-text truncate">{track.artist}</p>
                  </div>
                  <p className="text-xs text-yeezy-text truncate max-w-[120px]">{track.album}</p>
                  <span className="w-20 text-right text-xs text-yeezy-muted tabular-nums flex-shrink-0">
                    {formatDuration(track.duration)}
                  </span>
                  <div className="w-12 flex items-center justify-end gap-1.5">
                    <button
                      onClick={(e) => { e.stopPropagation(); toggleFavorite(track.id); }}
                      className="text-yeezy-gold transition-colors hover:scale-110"
                    >
                      <Heart size={15} fill="currentColor" />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleShare(track.id); }}
                      className={`text-yeezy-muted opacity-0 group-hover:opacity-100 hover:text-yeezy-gold transition-all ${shareTrackId === track.id ? 'opacity-100 text-yeezy-gold' : ''}`}
                    >
                      {shareTrackId === track.id ? <Check size={15} /> : <Share2 size={15} />}
                    </button>
                  </div>
                </div>
              );
            })}
          </>
        )}
      </div>
    </div>
  );
}
