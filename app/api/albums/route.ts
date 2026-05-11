import { NextRequest, NextResponse } from 'next/server';
import { createAlbum, getAlbumById, getAlbumsByOwner, getSharedAlbumsForUser, getUserById } from '@/backend/db';

// Optional auth middleware - extracts user ID from request if provided
async function getAuthenticatedUserId(request: NextRequest): Promise<string | null> {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader) return null;

  try {
    const userId = authHeader.replace('Bearer ', '');
    const user = await getUserById(userId);
    return user ? userId : null;
  } catch {
    return null;
  }
}

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

  // Verify the owner exists
  const owner = await getUserById(ownerId);
  if (!owner) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  const album = await createAlbum(ownerId, { title, artist, coverUrl, tracks, ownerId } as any);
  return NextResponse.json(album, { status: 201 });
}
