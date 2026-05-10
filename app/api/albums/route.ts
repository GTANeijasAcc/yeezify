import { NextRequest, NextResponse } from 'next/server';
import { createAlbum, getAlbumById, getAlbumsByOwner, getSharedAlbumsForUser } from '@/backend/db';

export async function GET(request: NextRequest) {
  const ownerId = request.nextUrl.searchParams.get('owner');
  const sharedWith = request.nextUrl.searchParams.get('sharedWith');

  if (ownerId) {
    const owned = await getAlbumsByOwner(ownerId);
    const shared = await getSharedAlbumsForUser(ownerId);
    return NextResponse.json({ owned, shared });
  }

  if (sharedWith) {
    const shared = await getSharedAlbumsForUser(sharedWith);
    return NextResponse.json(shared);
  }

  const album = await getAlbumById(request.nextUrl.searchParams.get('id') || '');
  if (album) {
    return NextResponse.json(album);
  }

  return NextResponse.json({ error: 'Missing query parameter: owner or sharedWith' }, { status: 400 });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const ownerId = typeof body?.ownerId === 'string' ? body.ownerId : '';
  const title = typeof body?.title === 'string' ? body.title.trim() : '';
  const artist = typeof body?.artist === 'string' ? body.artist.trim() : '';
  const tracks = Array.isArray(body?.tracks) ? body.tracks : [];
  const coverUrl = typeof body?.coverUrl === 'string' ? body.coverUrl : undefined;

  if (!ownerId || !title || !artist) {
    return NextResponse.json({ error: 'ownerId, title, and artist are required' }, { status: 400 });
  }

  const album = await createAlbum(ownerId, { title, artist, coverUrl, tracks, ownerId } as any);
  return NextResponse.json(album, { status: 201 });
}
