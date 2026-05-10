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
    <aside className="sticky top-0 flex flex-col w-full h-auto overflow-hidden border-b border-yeezy-border bg-[#070707] lg:w-64 lg:min-w-[220px] lg:h-screen lg:border-r lg:border-b-0">
      <div className="flex flex-col px-6 pt-7 pb-6 lg:px-6 lg:pt-7 lg:pb-6">
        <img src="/yeezify-logo.svg" alt="YeeZify logo" className="h-14 w-auto" />
      </div>

      <nav className="px-3 py-3 flex gap-2 overflow-x-auto lg:flex-col lg:space-y-2 lg:overflow-visible">
        {navItems.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setView(id)}
            className={`flex min-w-[140px] items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-all duration-150
              ${currentView === id
                ? 'bg-ye-card text-white'
                : 'text-ye-text hover:text-white hover:bg-ye-card/40'
              }`}
          >
            <Icon size={18} className={currentView === id ? 'text-ye-gold' : 'text-ye-muted'} />
            <span>{label}</span>
          </button>
        ))}
      </nav>

      <div className="mx-3 my-4 border-t border-yeezy-border" />

      {/* Library Albums */}
      <div className="flex-1 overflow-hidden flex flex-col px-3 pb-4 lg:overflow-y-auto">
        <div className="mb-2 flex items-center justify-between px-1">
          <span className="text-xs font-semibold text-ye-muted uppercase tracking-wider">Albums</span>
          <button
            onClick={() => setShowUploadModal(true)}
            className="p-1 rounded hover:bg-ye-card text-ye-muted hover:text-ye-gold transition-colors"
            title="Add Album"
          >
            <Plus size={14} />
          </button>
        </div>

        <div className="flex min-h-[220px] flex-col gap-2 overflow-x-auto lg:overflow-y-auto lg:overflow-x-visible">
          {albumList.length === 0 ? (
            <div className="px-2 py-6 text-center">
              <Music size={28} className="text-ye-muted mx-auto mb-2" />
              <p className="text-xs text-ye-muted">No albums yet</p>
              <button
                onClick={() => setShowUploadModal(true)}
                className="mt-3 text-xs text-ye-gold hover:text-ye-gold-light flex items-center gap-1 mx-auto"
              >
                <Upload size={12} /> Upload music
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-2 lg:gap-1">
              {albumList.map(album => (
                <button
                  key={album.id}
                  onClick={() => setView('album', album.id)}
                  className={`w-full flex items-center gap-3 rounded-md px-3 py-3 transition-all duration-150 group text-left
                    ${currentView === 'album' && useStore.getState().selectedAlbumId === album.id
                      ? 'bg-ye-card'
                      : 'hover:bg-ye-card/50'
                    }`}
                >
                  {album.coverUrl ? (
                    <img
                      src={album.coverUrl}
                      alt={album.title}
                      className="w-10 h-10 rounded object-cover flex-shrink-0"
                    />
                  ) : (
                    <div
                      className="w-10 h-10 rounded flex-shrink-0 flex items-center justify-center"
                      style={{ background: album.color || '#333' }}
                    >
                      <Music size={14} className="text-black/60" />
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="text-sm text-white truncate leading-tight">{album.title}</p>
                    <p className="text-xs text-ye-text truncate">{album.artist}</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
