'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';

export interface Track {
  id: string;
  title: string;
  artist: string;
  album: string;
  albumId: string;
  duration: number;
  url: string; // blob URL
  coverUrl?: string;
  lyrics?: string;
  isFavorite: boolean;
  addedAt: number;
}

export interface Album {
  id: string;
  title: string;
  artist: string;
  coverUrl?: string;
  tracks: string[]; // track IDs
  createdAt: number;
  color?: string; // dominant color for theming
}

export interface PlayerState {
  currentTrack: Track | null;
  queue: Track[];
  queueIndex: number;
  isPlaying: boolean;
  volume: number;
  progress: number;
  duration: number;
  shuffle: boolean;
  repeat: 'none' | 'one' | 'all';
  shuffledQueue: Track[];
}

export interface AppState {
  // Data
  tracks: Record<string, Track>;
  albums: Record<string, Album>;

  // Player
  player: PlayerState;

  // UI
  currentView: 'home' | 'library' | 'favorites' | 'album' | 'search' | 'nowplaying';
  selectedAlbumId: string | null;
  showLyrics: boolean;
  showUploadModal: boolean;
  searchQuery: string;

  // Actions - Data
  addTracks: (newTracks: Omit<Track, 'id' | 'isFavorite' | 'addedAt'>[]) => void;
  addAlbum: (album: Omit<Album, 'id' | 'createdAt'>) => string;
  updateAlbumCover: (albumId: string, coverUrl: string) => void;
  updateTrackLyrics: (trackId: string, lyrics: string) => void;
  toggleFavorite: (trackId: string) => void;
  deleteAlbum: (albumId: string) => void;

  // Actions - Player
  playTrack: (track: Track, queue?: Track[]) => void;
  playAlbum: (albumId: string, startIndex?: number) => void;
  togglePlay: () => void;
  nextTrack: () => void;
  prevTrack: () => void;
  setVolume: (v: number) => void;
  setProgress: (p: number) => void;
  setDuration: (d: number) => void;
  toggleShuffle: () => void;
  toggleRepeat: () => void;

  // Actions - UI
  setView: (view: AppState['currentView'], albumId?: string) => void;
  toggleLyrics: () => void;
  setShowUploadModal: (show: boolean) => void;
  setSearchQuery: (q: string) => void;
}

const ALBUM_COLORS = [
  '#c9a84c', '#8b5cf6', '#ef4444', '#3b82f6',
  '#10b981', '#f59e0b', '#ec4899', '#6366f1',
];

function buildShuffledQueue(queue: Track[], currentTrack: Track | null): Track[] {
  const shuffled = [...queue];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  if (currentTrack) {
    const idx = shuffled.findIndex(t => t.id === currentTrack.id);
    if (idx > 0) {
      [shuffled[0], shuffled[idx]] = [shuffled[idx], shuffled[0]];
    }
  }
  return shuffled;
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      tracks: {},
      albums: {},

      player: {
        currentTrack: null,
        queue: [],
        queueIndex: 0,
        isPlaying: false,
        volume: 0.8,
        progress: 0,
        duration: 0,
        shuffle: false,
        repeat: 'none',
        shuffledQueue: [],
      },

      currentView: 'home',
      selectedAlbumId: null,
      showLyrics: false,
      showUploadModal: false,
      searchQuery: '',

      addTracks: (newTracks) => {
        set(state => {
          const updatedTracks = { ...state.tracks };
          newTracks.forEach(t => {
            const id = uuidv4();
            updatedTracks[id] = { ...t, id, isFavorite: false, addedAt: Date.now() };
          });
          return { tracks: updatedTracks };
        });
      },

      addAlbum: (albumData) => {
        const id = uuidv4();
        const color = ALBUM_COLORS[Math.floor(Math.random() * ALBUM_COLORS.length)];
        set(state => ({
          albums: {
            ...state.albums,
            [id]: { ...albumData, id, createdAt: Date.now(), color },
          }
        }));
        return id;
      },

      updateAlbumCover: (albumId, coverUrl) => {
        set(state => ({
          albums: {
            ...state.albums,
            [albumId]: { ...state.albums[albumId], coverUrl },
          }
        }));
      },

      updateTrackLyrics: (trackId, lyrics) => {
        set(state => ({
          tracks: {
            ...state.tracks,
            [trackId]: { ...state.tracks[trackId], lyrics },
          }
        }));
      },

      toggleFavorite: (trackId) => {
        set(state => ({
          tracks: {
            ...state.tracks,
            [trackId]: {
              ...state.tracks[trackId],
              isFavorite: !state.tracks[trackId].isFavorite,
            }
          }
        }));
      },

      deleteAlbum: (albumId) => {
        set(state => {
          const album = state.albums[albumId];
          if (!album) return state;
          const updatedTracks = { ...state.tracks };
          album.tracks.forEach(tid => delete updatedTracks[tid]);
          const updatedAlbums = { ...state.albums };
          delete updatedAlbums[albumId];
          return { tracks: updatedTracks, albums: updatedAlbums };
        });
      },

      playTrack: (track, queue) => {
        set(state => {
          const q = queue || [track];
          const idx = q.findIndex(t => t.id === track.id);
          const shuffled = state.player.shuffle ? buildShuffledQueue(q, track) : [];
          return {
            player: {
              ...state.player,
              currentTrack: track,
              queue: q,
              queueIndex: idx,
              isPlaying: true,
              progress: 0,
              shuffledQueue: shuffled,
            }
          };
        });
      },

      playAlbum: (albumId, startIndex = 0) => {
        const state = get();
        const album = state.albums[albumId];
        if (!album) return;
        const queue = album.tracks.map(tid => state.tracks[tid]).filter(Boolean);
        if (!queue.length) return;
        const track = queue[startIndex] || queue[0];
        const idx = queue.findIndex(t => t.id === track.id);
        const shuffled = state.player.shuffle ? buildShuffledQueue(queue, track) : [];
        set({
          player: {
            ...state.player,
            currentTrack: track,
            queue,
            queueIndex: idx,
            isPlaying: true,
            progress: 0,
            shuffledQueue: shuffled,
          }
        });
      },

      togglePlay: () => {
        set(state => ({
          player: { ...state.player, isPlaying: !state.player.isPlaying }
        }));
      },

      nextTrack: () => {
        const { player } = get();
        const q = player.shuffle && player.shuffledQueue.length ? player.shuffledQueue : player.queue;
        if (!q.length) return;

        const currentIdx = q.findIndex(t => t.id === player.currentTrack?.id);
        let nextIdx = currentIdx + 1;

        if (nextIdx >= q.length) {
          if (player.repeat === 'all') nextIdx = 0;
          else {
            set(state => ({ player: { ...state.player, isPlaying: false } }));
            return;
          }
        }

        set(state => ({
          player: {
            ...state.player,
            currentTrack: q[nextIdx],
            queueIndex: nextIdx,
            progress: 0,
            isPlaying: true,
          }
        }));
      },

      prevTrack: () => {
        const { player } = get();
        const q = player.shuffle && player.shuffledQueue.length ? player.shuffledQueue : player.queue;
        if (!q.length) return;

        if (player.progress > 3) {
          set(state => ({ player: { ...state.player, progress: 0 } }));
          return;
        }

        const currentIdx = q.findIndex(t => t.id === player.currentTrack?.id);
        let prevIdx = currentIdx - 1;
        if (prevIdx < 0) prevIdx = player.repeat === 'all' ? q.length - 1 : 0;

        set(state => ({
          player: {
            ...state.player,
            currentTrack: q[prevIdx],
            queueIndex: prevIdx,
            progress: 0,
            isPlaying: true,
          }
        }));
      },

      setVolume: (v) => set(state => ({ player: { ...state.player, volume: v } })),
      setProgress: (p) => set(state => ({ player: { ...state.player, progress: p } })),
      setDuration: (d) => set(state => ({ player: { ...state.player, duration: d } })),

      toggleShuffle: () => {
        set(state => {
          const newShuffle = !state.player.shuffle;
          const shuffled = newShuffle
            ? buildShuffledQueue(state.player.queue, state.player.currentTrack)
            : [];
          return { player: { ...state.player, shuffle: newShuffle, shuffledQueue: shuffled } };
        });
      },

      toggleRepeat: () => {
        set(state => {
          const cycle: Array<PlayerState['repeat']> = ['none', 'all', 'one'];
          const idx = cycle.indexOf(state.player.repeat);
          return { player: { ...state.player, repeat: cycle[(idx + 1) % cycle.length] } };
        });
      },

      setView: (view, albumId) => set({ currentView: view, selectedAlbumId: albumId || null }),
      toggleLyrics: () => set(state => ({ showLyrics: !state.showLyrics })),
      setShowUploadModal: (show) => set({ showUploadModal: show }),
      setSearchQuery: (q) => set({ searchQuery: q }),
    }),
    {
      name: 'yeezify-storage',
      partialize: (state) => ({
        currentView: state.currentView,
        selectedAlbumId: state.selectedAlbumId,
        showLyrics: state.showLyrics,
        searchQuery: state.searchQuery,
        player: {
          volume: state.player.volume,
          shuffle: state.player.shuffle,
          repeat: state.player.repeat,
        },
      }),
    }
  )
);
