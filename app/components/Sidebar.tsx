'use client';

import { useStore } from '@/app/store/useStore';
import {
  Home, Library, Heart, Search, Plus, Music, Upload
} from 'lucide-react';

export default function Sidebar() {
  const { currentView, setView, albums, setShowUploadModal } = useStore();

  const navItems = [
    { id: 'home' as const, label: 'Home', icon: Home },
    { id: 'search' as const, label: 'Search', icon: Search },
    { id: 'library' as const, label: 'Your Library', icon: Library },
    { id: 'favorites' as const, label: 'Liked Songs', icon: Heart },
  ];

  const albumList = Object.values(albums).sort((a, b) => b.createdAt - a.createdAt);

  return (
    <aside className="sticky top-0 flex flex-col w-64 min-w-[220px] h-screen overflow-y-auto bg-[#070707] border-r border-yeezy-border">
      {/* Logo */}
      <div className="px-6 pt-7 pb-6">
        <img src="/yeezify-logo.svg" alt="YeeZify logo" className="h-14 w-auto" />
      </div>

      {/* Navigation */}
      <nav className="px-3 space-y-2">
        {navItems.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setView(id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition-all duration-150
              ${currentView === id
                ? 'bg-yeezy-card text-white'
                : 'text-yeezy-text hover:text-white hover:bg-yeezy-card/40'
              }`}
          >
            <Icon size={18} className={currentView === id ? 'text-yeezy-gold' : 'text-yeezy-muted'} />
            <span>{label}</span>
          </button>
        ))}
      </nav>

      <div className="mx-3 my-4 border-t border-yeezy-border" />

      {/* Library Albums */}
      <div className="flex-1 overflow-hidden flex flex-col">
        <div className="px-4 mb-2 flex items-center justify-between">
          <span className="text-xs font-semibold text-yeezy-muted uppercase tracking-wider">Albums</span>
          <button
            onClick={() => setShowUploadModal(true)}
            className="p-1 rounded hover:bg-yeezy-card text-yeezy-muted hover:text-yeezy-gold transition-colors"
            title="Add Album"
          >
            <Plus size={14} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-3 space-y-0.5 pb-4">
          {albumList.length === 0 ? (
            <div className="px-2 py-6 text-center">
              <Music size={28} className="text-yeezy-muted mx-auto mb-2" />
              <p className="text-xs text-yeezy-muted">No albums yet</p>
              <button
                onClick={() => setShowUploadModal(true)}
                className="mt-3 text-xs text-yeezy-gold hover:text-yeezy-gold-light flex items-center gap-1 mx-auto"
              >
                <Upload size={12} /> Upload music
              </button>
            </div>
          ) : (
            albumList.map(album => (
              <button
                key={album.id}
                onClick={() => setView('album', album.id)}
                className={`w-full flex items-center gap-3 px-2 py-2 rounded-md transition-all duration-150 group
                  ${currentView === 'album' && useStore.getState().selectedAlbumId === album.id
                    ? 'bg-yeezy-card'
                    : 'hover:bg-yeezy-card/50'
                  }`}
              >
                {album.coverUrl ? (
                  <img
                    src={album.coverUrl}
                    alt={album.title}
                    className="w-9 h-9 rounded object-cover flex-shrink-0"
                  />
                ) : (
                  <div
                    className="w-9 h-9 rounded flex-shrink-0 flex items-center justify-center"
                    style={{ background: album.color || '#333' }}
                  >
                    <Music size={14} className="text-black/60" />
                  </div>
                )}
                <div className="min-w-0 text-left">
                  <p className="text-sm text-white truncate leading-tight">{album.title}</p>
                  <p className="text-xs text-yeezy-text truncate">{album.artist}</p>
                </div>
              </button>
            ))
          )}
        </div>
      </div>
    </aside>
  );
}
