import { v4 as uuidv4 } from 'uuid';
import { createHash, randomBytes, timingSafeEqual } from 'crypto';
import { supabase } from './supabase';

export interface DbUser {
  id: string;
  username: string;
  passwordHash: string;
  passwordSalt: string;
  createdAt: number;
}

// Password hashing utilities using Node.js crypto
function hashPassword(password: string, salt: string): string {
  return createHash('sha256').update(password + salt).digest('hex');
}

export function createPasswordHash(password: string): { hash: string; salt: string } {
  const salt = randomBytes(16).toString('hex');
  const hash = hashPassword(password, salt);
  return { hash, salt };
}

export function verifyPassword(password: string, storedHash: string, storedSalt: string): boolean {
  const hash = hashPassword(password, storedSalt);
  try {
    return timingSafeEqual(Buffer.from(hash), Buffer.from(storedHash));
  } catch {
    return false;
  }
}

export interface DbTrack {
  id: string;
  title: string;
  artist: string;
  duration: number;
  url: string;
  coverUrl?: string;
}

export interface DbAlbum {
  id: string;
  ownerId: string;
  title: string;
  artist: string;
  coverUrl?: string;
  tracks: DbTrack[];
  sharedWith: string[];
  createdAt: number;
}

const USERS_TABLE = 'users';
const ALBUMS_TABLE = 'albums';

export async function getAllUsers(): Promise<DbUser[]> {
  const { data, error } = await supabase.from(USERS_TABLE).select('*');
  if (error) {
    console.error('Error fetching users:', error);
    return [];
  }
  return data as DbUser[];
}

export async function getUserById(userId: string): Promise<DbUser | null> {
  const { data, error } = await supabase.from(USERS_TABLE).select('*').eq('id', userId).single();
  if (error && error.code !== 'PGRST116') { // PGRST116 means no rows found
    console.error('Error fetching user by ID:', error);
    return null;
  }
  return data as DbUser | null;
}

export async function getUserByUsername(username: string): Promise<DbUser | null> {
  const { data, error } = await supabase.from(USERS_TABLE).select('*').ilike('username', username).single();
  if (error && error.code !== 'PGRST116') {
    console.error('Error fetching user by username:', error);
    return null;
  }
  return data as DbUser | null;
}

export async function getUserByUsernameAndPassword(username: string, password: string): Promise<DbUser | null> {
  const user = await getUserByUsername(username);
  if (!user) return null;

  if (!verifyPassword(password, user.passwordHash, user.passwordSalt)) {
    return null;
  }
  return user;
}

export async function createUser(username: string, password: string): Promise<DbUser> {
  const existing = await getUserByUsername(username);
  if (existing) {
    throw new Error('Username already exists');
  }
  const { hash, salt } = createPasswordHash(password);
  const user: DbUser = { id: uuidv4(), username, passwordHash: hash, passwordSalt: salt, createdAt: Date.now() };
  const { data, error } = await supabase.from(USERS_TABLE).insert([user]).select().single();
  if (error) {
    console.error('Error creating user:', error);
    throw error;
  }
  return data as DbUser;
}

export async function getAlbumById(albumId: string): Promise<DbAlbum | null> {
  const { data, error } = await supabase.from(ALBUMS_TABLE).select('*').eq('id', albumId).single();
  if (error && error.code !== 'PGRST116') {
    console.error('Error fetching album by ID:', error);
    return null;
  }
  return data as DbAlbum | null;
}

export async function getAlbumsByOwner(ownerId: string): Promise<DbAlbum[]> {
  const { data, error } = await supabase.from(ALBUMS_TABLE).select('*').eq('ownerId', ownerId);
  if (error) {
    console.error('Error fetching albums by owner:', error);
    return [];
  }
  return data as DbAlbum[];
}

export async function getSharedAlbumsForUser(userId: string): Promise<DbAlbum[]> {
  const { data, error } = await supabase.from(ALBUMS_TABLE).select('*').contains('sharedWith', [userId]);
  if (error) {
    console.error('Error fetching shared albums:', error);
    return [];
  }
  return data as DbAlbum[];
}

export async function createAlbum(ownerId: string, albumData: Omit<DbAlbum, 'id' | 'createdAt' | 'sharedWith'>): Promise<DbAlbum> {
  const album: DbAlbum = {
    ...albumData,
    id: uuidv4(),
    ownerId,
    sharedWith: [],
    createdAt: Date.now(),
  };
  const { data, error } = await supabase.from(ALBUMS_TABLE).insert([album]).select().single();
  if (error) {
    console.error('Error creating album:', error);
    throw error;
  }
  return data as DbAlbum;
}

export async function shareAlbum(albumId: string, toUserId: string): Promise<DbAlbum | null> {
  const album = await getAlbumById(albumId);
  if (!album) return null;

  const user = await getUserById(toUserId);
  if (!user) return null;

  const updatedSharedWith = Array.from(new Set([...album.sharedWith, toUserId]));
  const { data, error } = await supabase.from(ALBUMS_TABLE)
    .update({ sharedWith: updatedSharedWith })
    .eq('id', albumId)
    .select().single();

  if (error) {
    console.error('Error sharing album:', error);
    return null;
  }
  return data as DbAlbum;
}

export async function updateAlbum(albumId: string, updates: Partial<Omit<DbAlbum, 'id' | 'ownerId' | 'createdAt'>>): Promise<DbAlbum | null> {
  const { data, error } = await supabase.from(ALBUMS_TABLE)
    .update(updates)
    .eq('id', albumId)
    .select().single();

  if (error && error.code !== 'PGRST116') {
    console.error('Error updating album:', error);
    return null;
  }
  return data as DbAlbum | null;
}
