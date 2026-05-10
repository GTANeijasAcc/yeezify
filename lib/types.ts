export interface Track {
  id: string;
  title: string;
  artist: string;
  album: string;
  albumId: string;
  duration: number;
  url: string;
  lyrics?: string;
  isFavorite: boolean;
}

export interface Album {
  id: string;
  title: string;
  artist: string;
  year?: string;
  coverUrl: string;
  tracks: Track[];
  createdAt: number;
}

export interface PlayerState {
  currentTrack: Track | null;
  currentAlbum: Album | null;
  isPlaying: boolean;
  volume: number;
  progress: number;
  duration: number;
  queue: Track[];
  queueIndex: number;
  isShuffle: boolean;
  isRepeat: 'none' | 'one' | 'all';
}

export type View = 'home' | 'album' | 'favorites' | 'search' | 'upload' | 'lyrics';
