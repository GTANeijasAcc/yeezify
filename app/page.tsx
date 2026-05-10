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

export default function App() {
  // Initialize audio engine
  useAudioPlayer();

  const { currentView, showUploadModal, player } = useStore();

  const renderView = () => {
    switch (currentView) {
      case 'home': return <HomeView />;
      case 'library': return <LibraryView />;
      case 'favorites': return <FavoritesView />;
      case 'album': return <AlbumView />;
      case 'search': return <SearchView />;
      case 'nowplaying': return null; // handled by overlay
      default: return <HomeView />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen w-screen overflow-x-hidden bg-yeezy-black">
      {/* Main layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <Sidebar />

        {/* Main content area */}
        <main
          className="flex-1 overflow-auto relative pb-[108px]"
          style={{ background: 'linear-gradient(180deg, #1a1205 0%, #0a0a0a 40%)' }}
        >
          {renderView()}

          {/* Now Playing Overlay */}
          {currentView === 'nowplaying' && player.currentTrack && (
            <NowPlaying />
          )}
        </main>
      </div>

      {/* Player Bar */}
      <PlayerBar />

      {/* Upload Modal */}
      {showUploadModal && <UploadModal />}
    </div>
  );
}
