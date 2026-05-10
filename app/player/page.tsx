'use client';

import { useEffect } from 'react';
import { useStore } from '@/app/store/useStore';
import { useAudioPlayer } from '@/app/hooks/useAudioPlayer';
import Sidebar from '@/app/components/Sidebar';
import PlayerBar from '@/app/components/PlayerBar';
import NowPlaying from '@/app/components/NowPlaying';
import UploadModal from '@/app/components/UploadModal';
import HomeView from '@/app/components/HomeView';
import LibraryView from '@/app/components/LibraryView';
import AlbumView from '@/app/components/AlbumView';
import FavoritesView from '@/app/components/FavoritesView';
import SearchView from '@/app/components/SearchView';
import AuthPanel from '@/app/components/AuthPanel';

export default function App() {
  useAudioPlayer();

  const { currentView, showUploadModal, player, currentUser } = useStore();

  const renderView = () => {
    switch (currentView) {
      case 'home': return <HomeView />;
      case 'library': return <LibraryView />;
      case 'favorites': return <FavoritesView />;
      case 'album': return <AlbumView />;
      case 'search': return <SearchView />;
      case 'nowplaying': return null;
      default: return <HomeView />;
    }
  };

  if (!currentUser) {
    return (
      <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(108,46,255,0.18),_transparent_24%),radial-gradient(circle_at_bottom_right,_rgba(99,102,241,0.16),_transparent_20%),linear-gradient(180deg,#050105,#0d0218)] text-white">
        <div className="mx-auto flex min-h-screen max-w-6xl items-center justify-center px-6 py-10">
          <AuthPanel />
        </div>
      </main>
    );
  }

  return (
    <div className="flex flex-col min-h-screen w-screen overflow-x-hidden bg-[radial-gradient(circle_at_top,_rgba(108,46,255,0.08),_transparent_24%),linear-gradient(180deg,#0b0311,#120a2a)] text-ye-text">
      <div className="flex flex-col lg:flex-row flex-1 overflow-hidden">
        <Sidebar />

        <main className="flex-1 overflow-auto relative pb-[108px]">
          {renderView()}

          {currentView === 'nowplaying' && player.currentTrack && (
            <NowPlaying />
          )}
        </main>
      </div>

      <PlayerBar />

      {showUploadModal && <UploadModal />}
    </div>
  );
}
