'use client';

import { useStore } from '@/app/store/useStore';
import { Search, Play, Heart, Music, X } from 'lucide-react';
import { formatDuration } from '@/app/lib/utils';

export default function SearchView() {
  const { tracks, albums, player, searchQuery, setSearchQuery, playTrack, toggleFavorite, setView } = useStore();

  const query = searchQuery.toLowerCase().trim();
  const allTracks = Object.values(tracks);
  const allAlbums = Object.values(albums);

  const filteredTracks = query
    ? allTracks.filter(t =>
        t.title.toLowerCase().includes(query) ||
        t.artist.toLowerCase().includes(query) ||
        t.album.toLowerCase().includes(query)
      )
    : [];

  const filteredAlbums = query
    ? allAlbums.filter(a =>
        a.title.toLowerCase().includes(query) ||
        a.artist.toLowerCase().includes(query)
      )
    : [];

  return (
    <div className="flex-1 overflow-y-auto px-8 py-8 fade-in">
      <h1 className="text-2xl font-bold text-white mb-6">Search</h1>

      {/* Search input */}
      <div className="relative mb-8 max-w-xl">
        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-yeezy-muted" />
        <input
          type="text"
          placeholder="What do you want to listen to?"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          autoFocus
          className="w-full bg-yeezy-card border border-yeezy-border rounded-full pl-11 pr-10 py-3 text-white text-sm focus:outline-none focus:border-yeezy-gold placeholder-yeezy-muted transition-colors"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-yeezy-muted hover:text-white transition-colors"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {!query && (
        <div>
          <h2 className="text-lg font-bold text-white mb-4">Browse all</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {allAlbums.map(album => (
              <button
                key={album.id}
                onClick={() => setView('album', album.id)}
                className="relative h-32 rounded-xl overflow-hidden text-left group"
                style={{ background: album.color || '#333' }}
              >
                {album.coverUrl && (
                  <img src={album.coverUrl} alt="" className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:opacity-60 transition-opacity" />
                )}
                <div className="absolute inset-0 p-4 flex flex-col justify-end">
                  <p className="text-white font-bold text-sm truncate drop-shadow-lg">{album.title}</p>
                  <p className="text-white/70 text-xs truncate">{album.artist}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {query && (
        <div className="space-y-8">
          {filteredAlbums.length > 0 && (
            <section>
              <h2 className="text-lg font-bold text-white mb-4">Albums</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {filteredAlbums.map(album => (
                  <button
                    key={album.id}
                    onClick={() => setView('album', album.id)}
                    className="group bg-yeezy-card hover:bg-[#222] rounded-xl p-3 text-left transition-all"
                  >
                    <div className="aspect-square rounded-lg overflow-hidden mb-3">
                      {album.coverUrl ? (
                        <img src={album.coverUrl} alt={album.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center" style={{ background: album.color || '#333' }}>
                          <Music size={24} className="text-black/40" />
                        </div>
                      )}
                    </div>
                    <p className="text-sm font-semibold text-white truncate">{album.title}</p>
                    <p className="text-xs text-yeezy-text truncate">{album.artist}</p>
                  </button>
                ))}
              </div>
            </section>
          )}

          {filteredTracks.length > 0 && (
            <section>
              <h2 className="text-lg font-bold text-white mb-4">Songs</h2>
              <div className="space-y-1">
                {filteredTracks.map((track, i) => {
                  const isCurrent = player.currentTrack?.id === track.id;
                  const isPlaying = isCurrent && player.isPlaying;
                  return (
                    <div
                      key={track.id}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-md hover:bg-yeezy-card group cursor-pointer transition-colors"
                      onClick={() => playTrack(track, filteredTracks)}
                    >
                      {track.coverUrl ? (
                        <img src={track.coverUrl} alt="" className="w-10 h-10 rounded object-cover flex-shrink-0" />
                      ) : (
                        <div className="w-10 h-10 rounded bg-yeezy-card flex items-center justify-center flex-shrink-0">
                          {isPlaying ? (
                            <div className="flex items-end gap-0.5 h-4 justify-center">
                              <div className="w-1 bg-yeezy-gold rounded-sm eq-bar-1" />
                              <div className="w-1 bg-yeezy-gold rounded-sm eq-bar-2" />
                            </div>
                          ) : (
                            <Music size={14} className="text-yeezy-muted" />
                          )}
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-medium truncate ${isCurrent ? 'text-yeezy-gold' : 'text-white'}`}>{track.title}</p>
                        <p className="text-xs text-yeezy-text truncate">{track.artist} · {track.album}</p>
                      </div>
                      <span className="text-xs text-yeezy-muted tabular-nums">{formatDuration(track.duration)}</span>
                      <button
                        onClick={(e) => { e.stopPropagation(); toggleFavorite(track.id); }}
                        className={`ml-2 transition-colors ${track.isFavorite ? 'text-yeezy-gold' : 'text-yeezy-muted opacity-0 group-hover:opacity-100 hover:text-white'}`}
                      >
                        <Heart size={15} fill={track.isFavorite ? 'currentColor' : 'none'} />
                      </button>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {filteredTracks.length === 0 && filteredAlbums.length === 0 && (
            <div className="text-center py-16">
              <Music size={48} className="text-yeezy-muted mx-auto mb-4" />
              <p className="text-white font-semibold">No results for "{searchQuery}"</p>
              <p className="text-yeezy-text text-sm mt-1">Try different keywords</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
