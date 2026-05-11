'use client';

import { useState, useCallback, useRef } from 'react';
import { useStore } from '@/app/store/useStore';
import { fileToDataURL, isAudioFile, isImageFile, parseTrackFromFilename, getAudioDuration } from '@/app/lib/utils';
import { Upload, X, Music, Image, FolderOpen, Check, Loader2 } from 'lucide-react';

interface ParsedTrack {
  title: string;
  artist: string;
  file: File;
  duration: number;
  url: string;
}

export default function UploadModal() {
  const { setShowUploadModal, addAlbum, addTracks, syncAlbumToDatabase, currentUser, tracks: existingTracks, albums } = useStore();
  const [step, setStep] = useState<'upload' | 'configure' | 'done'>('upload');
  const [isDragging, setIsDragging] = useState(false);
  const [parsedTracks, setParsedTracks] = useState<ParsedTrack[]>([]);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string>('');
  const [albumName, setAlbumName] = useState('');
  const [artistName, setArtistName] = useState('');
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    await processFiles(Array.from(e.dataTransfer.files));
  }, []);

  const processFiles = async (files: File[]) => {
    setLoading(true);
    const audioFiles = files.filter(isAudioFile);
    const imageFiles = files.filter(isImageFile);

    if (imageFiles.length > 0 && !coverFile) {
      setCoverFile(imageFiles[0]);
      const url = await fileToDataURL(imageFiles[0]);
      setCoverPreview(url);
    }

    const parsed: ParsedTrack[] = [];
    for (const file of audioFiles) {
      const { title, artist } = parseTrackFromFilename(file.name);
      const duration = await getAudioDuration(file);
      const url = URL.createObjectURL(file);
      parsed.push({ title, artist, file, duration, url });
    }

    if (parsed.length > 0) {
      setParsedTracks(parsed);
      // Auto-detect album name from first track
      if (!albumName && parsed[0].artist !== 'Unknown Artist') {
        setArtistName(parsed[0].artist);
      }
      setStep('configure');
    }
    setLoading(false);
  };

  const handleFileInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) await processFiles(Array.from(e.target.files));
  };

  const handleCoverInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0];
      setCoverFile(file);
      const url = await fileToDataURL(file);
      setCoverPreview(url);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    const finalName = albumName || 'Untitled Album';
    const finalArtist = artistName || 'Unknown Artist';

    let coverUrl = '';
    if (coverFile) coverUrl = await fileToDataURL(coverFile);

    // Create album locally first
    const albumId = addAlbum({
      title: finalName,
      artist: finalArtist,
      coverUrl,
      tracks: [],
    });

    // Add tracks with album reference
    const trackData = parsedTracks.map(t => ({
      title: t.title,
      artist: t.artist || finalArtist,
      album: finalName,
      albumId,
      duration: t.duration,
      url: t.url,
      coverUrl,
    }));

    addTracks(trackData);

    // Link tracks to album and sync to database if user is logged in
    setTimeout(async () => {
      const state = useStore.getState();
      const albumTracks = Object.values(state.tracks)
        .filter(t => t.albumId === albumId)
        .map(t => t.id);
      useStore.setState(s => ({
        albums: {
          ...s.albums,
          [albumId]: { ...s.albums[albumId], tracks: albumTracks },
        }
      }));

      // Sync to Supabase database if user is logged in
      if (state.currentUser) {
        await syncAlbumToDatabase(albumId);
      }

      setStep('done');
      setLoading(false);
      setTimeout(() => setShowUploadModal(false), 1200);
    }, 100);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm fade-in">
      <div className="bg-yeezy-dark border border-yeezy-border rounded-2xl w-full max-w-lg mx-4 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-yeezy-border">
          <h2 className="text-lg font-bold text-white" style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: '0.1em', fontSize: '1.4rem' }}>
            ADD MUSIC
          </h2>
          <button onClick={() => setShowUploadModal(false)} className="text-yeezy-muted hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
          {step === 'done' ? (
            <div className="flex flex-col items-center py-8 gap-3">
              <div className="w-16 h-16 rounded-full bg-yeezy-gold/20 flex items-center justify-center">
                <Check size={32} className="text-yeezy-gold" />
              </div>
              <p className="text-white font-semibold text-lg">Album Added!</p>
              <p className="text-yeezy-text text-sm">{parsedTracks.length} tracks uploaded</p>
            </div>
          ) : step === 'upload' ? (
            <div>
              <div
                className={`border-2 border-dashed rounded-xl p-10 text-center transition-all cursor-pointer
                  ${isDragging ? 'border-yeezy-gold bg-yeezy-gold/10' : 'border-yeezy-border hover:border-yeezy-muted'}`}
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                {loading ? (
                  <Loader2 size={40} className="text-yeezy-gold mx-auto mb-3 animate-spin" />
                ) : (
                  <Upload size={40} className="text-yeezy-muted mx-auto mb-3" />
                )}
                <p className="text-white font-medium mb-1">
                  {loading ? 'Processing...' : 'Drop your music here'}
                </p>
                <p className="text-yeezy-text text-sm">MP3, WAV, FLAC, AAC, OGG and more</p>
                <p className="text-xs text-yeezy-muted mt-2">or drag an album folder</p>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="audio/*,.mp3,.wav,.flac,.aac,.ogg,.m4a"
                className="hidden"
                onChange={handleFileInput}
              />
              <div className="mt-3 grid grid-cols-2 gap-2">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center justify-center gap-2 bg-yeezy-card hover:bg-yeezy-border text-white py-2.5 rounded-lg text-sm transition-colors"
                >
                  <Music size={16} /> Select Files
                </button>
                <button
                  onClick={() => {
                    if (fileInputRef.current) {
                      fileInputRef.current.webkitdirectory = true;
                      fileInputRef.current.click();
                    }
                  }}
                  className="flex items-center justify-center gap-2 bg-yeezy-card hover:bg-yeezy-border text-white py-2.5 rounded-lg text-sm transition-colors"
                >
                  <FolderOpen size={16} /> Select Folder
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Cover art */}
              <div className="flex items-start gap-4">
                <div
                  className="w-24 h-24 rounded-xl bg-yeezy-card border border-yeezy-border flex items-center justify-center cursor-pointer hover:border-yeezy-gold transition-colors flex-shrink-0 overflow-hidden"
                  onClick={() => coverInputRef.current?.click()}
                >
                  {coverPreview ? (
                    <img src={coverPreview} alt="Cover" className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-center">
                      <Image size={20} className="text-yeezy-muted mx-auto mb-1" />
                      <p className="text-xs text-yeezy-muted">Add cover</p>
                    </div>
                  )}
                </div>
                <input ref={coverInputRef} type="file" accept="image/*" className="hidden" onChange={handleCoverInput} />
                <div className="flex-1 space-y-3">
                  <div>
                    <label className="text-xs text-yeezy-muted uppercase tracking-wider mb-1 block">Album Name</label>
                    <input
                      type="text"
                      value={albumName}
                      onChange={(e) => setAlbumName(e.target.value)}
                      placeholder="Enter album name"
                      className="w-full bg-yeezy-card border border-yeezy-border rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-yeezy-gold placeholder-yeezy-muted"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-yeezy-muted uppercase tracking-wider mb-1 block">Artist</label>
                    <input
                      type="text"
                      value={artistName}
                      onChange={(e) => setArtistName(e.target.value)}
                      placeholder="Artist name"
                      className="w-full bg-yeezy-card border border-yeezy-border rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-yeezy-gold placeholder-yeezy-muted"
                    />
                  </div>
                </div>
              </div>

              {/* Track list */}
              <div>
                <label className="text-xs text-yeezy-muted uppercase tracking-wider mb-2 block">{parsedTracks.length} tracks</label>
                <div className="max-h-48 overflow-y-auto space-y-1">
                  {parsedTracks.map((t, i) => (
                    <div key={i} className="flex items-center gap-3 bg-yeezy-card rounded-lg px-3 py-2">
                      <span className="text-xs text-yeezy-muted w-5 text-right">{i + 1}</span>
                      <div className="flex-1 min-w-0">
                        <input
                          type="text"
                          value={t.title}
                          onChange={(e) => {
                            const updated = [...parsedTracks];
                            updated[i] = { ...updated[i], title: e.target.value };
                            setParsedTracks(updated);
                          }}
                          className="w-full bg-transparent text-white text-sm focus:outline-none"
                        />
                      </div>
                      <Music size={12} className="text-yeezy-muted flex-shrink-0" />
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => { setStep('upload'); setParsedTracks([]); }}
                  className="flex-1 py-2.5 rounded-lg border border-yeezy-border text-yeezy-text hover:text-white hover:border-yeezy-muted text-sm transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={handleSave}
                  disabled={loading}
                  className="flex-1 py-2.5 rounded-lg bg-yeezy-gold text-black font-semibold text-sm hover:bg-yeezy-gold-light transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {loading ? <Loader2 size={16} className="animate-spin" /> : null}
                  Save Album
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
