'use client';

import { useStore } from '@/app/store/useStore';
import { Plus, Music, Play, Upload } from 'lucide-react';

export default function LibraryView() {
  const { albums, setView, setShowUploadModal, playAlbum } = useStore();
  const albumList = Object.values(albums).sort((a, b) => b.createdAt - a.createdAt);

  return (
    <div className="flex-1 overflow-y-auto px-8 py-8 fade-in">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-white">Your Library</h1>
        <button
          onClick={() => setShowUploadModal(true)}
          className="flex items-center gap-2 bg-yeezy-card hover:bg-yeezy-border text-white px-4 py-2 rounded-full text-sm font-medium transition-colors"
        >
          <Plus size={16} /> Add Album
        </button>
      </div>

      {albumList.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <Music size={56} className="text-yeezy-muted mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">Build your library</h3>
          <p className="text-yeezy-text mb-6 max-w-sm text-sm">Upload music files or entire album folders to get started</p>
          <button
            onClick={() => setShowUploadModal(true)}
            className="flex items-center gap-2 bg-yeezy-gold text-black px-6 py-3 rounded-full font-semibold hover:bg-yeezy-gold-light transition-colors"
          >
            <Upload size={18} /> Upload Music
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {albumList.map(album => (
            <button
              key={album.id}
              onClick={() => setView('album', album.id)}
              className="group bg-yeezy-card hover:bg-[#222] rounded-xl p-4 text-left transition-all duration-200 hover:-translate-y-1 relative"
            >
              {/* Cover */}
              <div className="relative mb-4 aspect-square rounded-lg overflow-hidden">
                {album.coverUrl ? (
                  <img
                    src={album.coverUrl}
                    alt={album.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div
                    className="w-full h-full flex items-center justify-center"
                    style={{ background: album.color || '#333' }}
                  >
                    <Music size={32} className="text-black/40" />
                  </div>
                )}
                {/* Play overlay */}
                <button
                  onClick={(e) => { e.stopPropagation(); playAlbum(album.id); }}
                  className="absolute bottom-2 right-2 w-10 h-10 rounded-full bg-yeezy-gold text-black flex items-center justify-center opacity-0 group-hover:opacity-100 shadow-lg transition-all translate-y-2 group-hover:translate-y-0"
                >
                  <Play size={16} className="ml-0.5" />
                </button>
              </div>

              <p className="text-sm font-semibold text-white truncate">{album.title}</p>
              <p className="text-xs text-yeezy-text truncate mt-0.5">{album.artist}</p>
              <p className="text-xs text-yeezy-muted mt-1">{album.tracks.length} tracks</p>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
