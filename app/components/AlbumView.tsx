'use client';

import { useState, useRef } from 'react';
import { useStore } from '@/app/store/useStore';
import { Play, Pause, Shuffle, Heart, MoreHorizontal, Trash2, Image, Music, Share2, Check } from 'lucide-react';
import { formatDuration, fileToDataURL } from '@/app/lib/utils';

export default function AlbumView() {
  const {
    selectedAlbumId, albums, tracks, player,
    playAlbum, playTrack, toggleFavorite, updateAlbumCover,
    deleteAlbum, setView, toggleShuffle
  } = useStore();
  const [showMenu, setShowMenu] = useState(false);
  const [shareTrackId, setShareTrackId] = useState<string | null>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  const album = selectedAlbumId ? albums[selectedAlbumId] : null;
  if (!album) return null;

  const albumTracks = album.tracks.map(id => tracks[id]).filter(Boolean);
  const isCurrentAlbum = player.currentTrack?.albumId === album.id;
  const isPlaying = isCurrentAlbum && player.isPlaying;

  const handleCoverChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = await fileToDataURL(file);
    updateAlbumCover(album.id, url);
  };

  const handleShare = async (trackId: string) => {
    const url = `${window.location.origin}?track=${trackId}`;
    await navigator.clipboard.writeText(url).catch(() => {});
    setShareTrackId(trackId);
    setTimeout(() => setShareTrackId(null), 2000);
  };

  const totalDuration = albumTracks.reduce((sum, t) => sum + (t?.duration || 0), 0);

  return (
    <div className="flex-1 overflow-y-auto fade-in">
      {/* Hero */}
      <div
        className="relative px-8 pt-8 pb-6"
        style={{
          background: album.coverUrl
            ? `linear-gradient(180deg, ${album.color || '#333'}88 0%, #0a0a0a 100%)`
            : `linear-gradient(180deg, ${album.color || '#333'}66 0%, #0a0a0a 100%)`
        }}
      >
        <div className="flex items-end gap-6">
          {/* Album art */}
          <div className="relative group flex-shrink-0">
            {album.coverUrl ? (
              <img
                src={album.coverUrl}
                alt={album.title}
                className="w-48 h-48 rounded-xl object-cover shadow-2xl"
              />
            ) : (
              <div
                className="w-48 h-48 rounded-xl flex items-center justify-center shadow-2xl"
                style={{ background: album.color || '#333' }}
              >
                <Music size={48} className="text-black/40" />
              </div>
            )}
            <button
              onClick={() => coverInputRef.current?.click()}
              className="absolute inset-0 rounded-xl bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Image size={24} className="text-white" />
            </button>
            <input ref={coverInputRef} type="file" accept="image/*" className="hidden" onChange={handleCoverChange} />
          </div>

          {/* Info */}
          <div className="min-w-0 flex-1 pb-2">
            <p className="text-xs text-yeezy-text uppercase tracking-wider mb-2">Album</p>
            <h1
              className="text-4xl font-black text-white leading-none mb-3 break-words"
              style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: '0.05em' }}
            >
              {album.title}
            </h1>
            <p className="text-white font-medium text-sm mb-1">{album.artist}</p>
            <p className="text-yeezy-text text-sm">
              {albumTracks.length} songs · {formatDuration(totalDuration)}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4 mt-6">
          <button
            onClick={() => isPlaying ? useStore.getState().togglePlay() : playAlbum(album.id)}
            className="w-14 h-14 rounded-full bg-yeezy-gold text-black flex items-center justify-center hover:scale-105 transition-transform shadow-lg"
          >
            {isPlaying ? <Pause size={22} /> : <Play size={22} className="ml-0.5" />}
          </button>
          <button
            onClick={() => {
              toggleShuffle();
              if (albumTracks.length > 0) {
                const randomIdx = Math.floor(Math.random() * albumTracks.length);
                playAlbum(album.id, randomIdx);
              }
            }}
            className="w-10 h-10 flex items-center justify-center text-yeezy-text hover:text-yeezy-gold transition-colors"
          >
            <Shuffle size={22} />
          </button>

          {/* More menu */}
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="w-10 h-10 flex items-center justify-center text-yeezy-muted hover:text-white transition-colors"
            >
              <MoreHorizontal size={22} />
            </button>
            {showMenu && (
              <div className="absolute left-0 top-12 bg-yeezy-card border border-yeezy-border rounded-xl shadow-2xl z-20 w-48 py-1 fade-in">
                <button
                  onClick={() => { coverInputRef.current?.click(); setShowMenu(false); }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-white hover:bg-yeezy-border transition-colors"
                >
                  <Image size={15} /> Change Cover
                </button>
                <button
                  onClick={() => { deleteAlbum(album.id); setView('home'); setShowMenu(false); }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:bg-yeezy-border transition-colors"
                >
                  <Trash2 size={15} /> Delete Album
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Track list */}
      <div className="px-8 pb-8">
        {/* Header */}
        <div className="flex items-center gap-3 px-3 py-2 border-b border-yeezy-border mb-2">
          <span className="w-6 text-xs text-yeezy-muted text-center">#</span>
          <span className="flex-1 text-xs text-yeezy-muted uppercase tracking-wider">Title</span>
          <span className="text-xs text-yeezy-muted w-12 text-right">Time</span>
          <span className="w-16" />
        </div>

        {albumTracks.length === 0 ? (
          <div className="text-center py-12 text-yeezy-muted">
            <Music size={32} className="mx-auto mb-3" />
            <p>No tracks in this album</p>
          </div>
        ) : (
          albumTracks.map((track, i) => {
            if (!track) return null;
            const isCurrent = player.currentTrack?.id === track.id;
            const isTrackPlaying = isCurrent && player.isPlaying;
            return (
              <div
                key={track.id}
                className="flex items-center gap-3 px-3 py-2.5 rounded-md hover:bg-yeezy-card group cursor-pointer transition-colors"
                onClick={() => playTrack(track, albumTracks)}
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

                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium truncate ${isCurrent ? 'text-yeezy-gold' : 'text-white'}`}>
                    {track.title}
                  </p>
                  <p className="text-xs text-yeezy-text truncate">{track.artist}</p>
                </div>

                <span className="text-xs text-yeezy-muted w-12 text-right tabular-nums flex-shrink-0">
                  {formatDuration(track.duration)}
                </span>

                <div className="w-16 flex items-center justify-end gap-2">
                  <button
                    onClick={(e) => { e.stopPropagation(); toggleFavorite(track.id); }}
                    className={`transition-colors ${track.isFavorite ? 'text-yeezy-gold' : 'text-yeezy-muted opacity-0 group-hover:opacity-100 hover:text-white'}`}
                  >
                    <Heart size={15} fill={track.isFavorite ? 'currentColor' : 'none'} />
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
          })
        )}
      </div>
    </div>
  );
}
