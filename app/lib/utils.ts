export function formatDuration(seconds: number): string {
  if (!seconds || isNaN(seconds)) return '0:00';
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export function getAudioDuration(file: File): Promise<number> {
  return new Promise((resolve) => {
    const url = URL.createObjectURL(file);
    const audio = new Audio(url);
    audio.addEventListener('loadedmetadata', () => {
      resolve(audio.duration);
      URL.revokeObjectURL(url);
    });
    audio.addEventListener('error', () => resolve(0));
  });
}

export function fileToDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export function getFileNameWithoutExt(name: string): string {
  return name.replace(/\.[^/.]+$/, '');
}

export function parseTrackFromFilename(filename: string): { title: string; artist: string } {
  const clean = getFileNameWithoutExt(filename);
  // Try "Artist - Title" format
  const match = clean.match(/^(.+?)\s*[-–]\s*(.+)$/);
  if (match) {
    return { artist: match[1].trim(), title: match[2].trim() };
  }
  return { artist: 'Unknown Artist', title: clean.trim() };
}

export function isAudioFile(file: File): boolean {
  return file.type.startsWith('audio/') ||
    /\.(mp3|wav|ogg|flac|aac|m4a|opus|wma)$/i.test(file.name);
}

export function isImageFile(file: File): boolean {
  return file.type.startsWith('image/') ||
    /\.(jpg|jpeg|png|gif|webp|avif)$/i.test(file.name);
}

export function generateShareUrl(trackId: string): string {
  if (typeof window !== 'undefined') {
    return `${window.location.origin}/share/${trackId}`;
  }
  return `/share/${trackId}`;
}
