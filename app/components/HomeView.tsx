'use client';

import { useStore } from '@/app/store/useStore';
import { Play, Upload, Heart, Music } from 'lucide-react';
import { formatDuration } from '@/app/lib/utils';

export default function HomeView() {
  const { albums, tracks, player, playAlbum, playTrack, setView, setShowUploadModal, toggleFavorite } = useStore();

  const albumList = Object.values(albums).sort((a, b) => b.createdAt - a.createdAt);
  const recentTracks = Object.values(tracks)
    .sort((a, b) => b.addedAt - a.addedAt)
    .slice(0, 8);
  const favTracks = Object.values(tracks).filter(t => t.isFavorite).slice(0, 5);

  const greeting = (() => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 18) return 'Good afternoon';
    return 'Good evening';
  })();

  return (
    <div className="flex-1 overflow-y-auto px-8 py-8 fade-in">
      {/* Greeting */}
      <h1 className="text-3xl font-bold text-white mb-8">{greeting}</h1>

      {/* Quick access - Albums */}
      {albumList.length > 0 && (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 mb-10">
          {albumList.slice(0, 6).map(album => (
            <button
              key={album.id}
              onClick={() => setView('album', album.id)}
              className="flex items-center gap-3 bg-yeezy-card hover:bg-[#282828] rounded-lg overflow-hidden transition-colors group relative"
            >
              {album.coverUrl ? (
                <img src={album.coverUrl} alt={album.title} className="w-16 h-16 object-cover flex-shrink-0" />
              ) : (
                <div className="w-16 h-16 flex items-center justify-center flex-shrink-0" style={{ background: album.color }}>
                  <Music size={20} className="text-black/60" />
                </div>
              )}
              <span className="text-sm font-semibold text-white truncate pr-2">{album.title}</span>
              <button
                className="absolute right-3 w-10 h-10 rounded-full bg-yeezy-gold text-black flex items-center justify-center opacity-0 group-hover:opacity-100 shadow-lg transition-all translate-y-2 group-hover:translate-y-0"
                onClick={(e) => { e.stopPropagation(); playAlbum(album.id); }}
              >
                <Play size={16} className="ml-0.5" />
              </button>
            </button>
          ))}
        </div>
      )}

      {/* Empty state */}
      {albumList.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-24 h-24 rounded-full bg-yeezy-card flex items-center justify-center mb-6">
            <Music size={40} className="text-yeezy-muted" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Your library is empty</h2>
          <p className="text-yeezy-text mb-6 max-w-sm">Upload your Ye collection to get started. Support for MP3, FLAC, WAV and more.</p>
          <button
            onClick={() => setShowUploadModal(true)}
            className="flex items-center gap-2 bg-yeezy-gold text-black px-6 py-3 rounded-full font-semibold hover:bg-yeezy-gold-light transition-colors"
          >
            <Upload size={18} /> Upload Music
          </button>
        </div>
      )}

      {/* Recently added */}
      {recentTracks.length > 0 && (
        <section className="mb-10">
          <h2 className="text-xl font-bold text-white mb-4">Recently Added</h2>
          <div className="space-y-1">
            {recentTracks.map((track, i) => (
              <TrackRow
                key={track.id}
                track={track}
                index={i}
                onPlay={() => playTrack(track, recentTracks)}
                isPlaying={player.currentTrack?.id === track.id && player.isPlaying}
                onFav={() => toggleFavorite(track.id)}
                isFav={track.isFavorite}
              />
            ))}
          </div>
        </section>
      )}

      {/* Liked Songs */}
      {favTracks.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white">Liked Songs</h2>
            <button onClick={() => setView('favorites')} className="text-sm text-yeezy-text hover:text-white transition-colors">
              Show all
            </button>
          </div>
          <div className="space-y-1">
            {favTracks.map((track, i) => (
              <TrackRow
                key={track.id}
                track={track}
                index={i}
                onPlay={() => playTrack(track, favTracks)}
                isPlaying={player.currentTrack?.id === track.id && player.isPlaying}
                onFav={() => toggleFavorite(track.id)}
                isFav={track.isFavorite}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function TrackRow({
  track, index, onPlay, isPlaying, onFav, isFav
}: {
  track: any; index: number; onPlay: () => void;
  isPlaying: boolean; onFav: () => void; isFav: boolean;
}) {
  return (
    <div
      className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-yeezy-card group cursor-pointer transition-colors"
      onClick={onPlay}
    >
      <div className="w-6 text-right flex-shrink-0">
        {isPlaying ? (
          <div className="flex items-end gap-0.5 h-4 justify-center">
            <div className="w-1 bg-yeezy-gold rounded-sm eq-bar-1" />
            <div className="w-1 bg-yeezy-gold rounded-sm eq-bar-2" />
            <div className="w-1 bg-yeezy-gold rounded-sm eq-bar-3" />
          </div>
        ) : (
          <span className="text-sm text-yeezy-muted group-hover:hidden">{index + 1}</span>
        )}
        <Play size={14} className="text-white hidden group-hover:block ml-auto" />
      </div>
      {track.coverUrl ? (
        <img src={track.coverUrl} alt={track.album} className="w-10 h-10 rounded object-cover flex-shrink-0" />
      ) : (
        <div className="w-10 h-10 rounded bg-yeezy-card flex items-center justify-center flex-shrink-0">
          <Music size={14} className="text-yeezy-muted" />
        </div>
      )}
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-medium truncate ${isPlaying ? 'text-yeezy-gold' : 'text-white'}`}>{track.title}</p>
        <p className="text-xs text-yeezy-text truncate">{track.artist}</p>
      </div>
      <span className="text-xs text-yeezy-muted mr-2 flex-shrink-0">{formatDuration(track.duration)}</span>
      <button
        onClick={(e) => { e.stopPropagation(); onFav(); }}
        className={`transition-colors flex-shrink-0 ${isFav ? 'text-yeezy-gold' : 'text-yeezy-muted opacity-0 group-hover:opacity-100 hover:text-white'}`}
      >
        <Heart size={16} fill={isFav ? 'currentColor' : 'none'} />
      </button>
    </div>
  );
}
