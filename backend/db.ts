import { promises as fs } from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

export interface DbUser {
  id: string;
  username: string;
  createdAt: number;
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

interface DbSchema {
  users: Record<string, DbUser>;
  albums: Record<string, DbAlbum>;
}

const dbPath = path.join(process.cwd(), 'backend', 'data', 'db.json');

async function ensureDbFile() {
  try {
    await fs.access(dbPath);
  } catch {
    await fs.mkdir(path.dirname(dbPath), { recursive: true });
    await fs.writeFile(dbPath, JSON.stringify({ users: {}, albums: {} }, null, 2), 'utf8');
  }
}

async function readDb(): Promise<DbSchema> {
  await ensureDbFile();
  const raw = await fs.readFile(dbPath, 'utf8');
  return JSON.parse(raw) as DbSchema;
}

async function writeDb(data: DbSchema) {
  await fs.writeFile(dbPath, JSON.stringify(data, null, 2), 'utf8');
}

export async function getAllUsers() {
  const db = await readDb();
  return Object.values(db.users);
}

export async function getUserById(userId: string) {
  const db = await readDb();
  return db.users[userId] ?? null;
}

export async function getUserByUsername(username: string) {
  const db = await readDb();
  return Object.values(db.users).find((user) => user.username.toLowerCase() === username.toLowerCase()) ?? null;
}

export async function createUser(username: string) {
  const db = await readDb();
  const existing = await getUserByUsername(username);
  if (existing) {
    return existing;
  }
  const id = uuidv4();
  const user: DbUser = { id, username, createdAt: Date.now() };
  db.users[id] = user;
  await writeDb(db);
  return user;
}

export async function getAlbumById(albumId: string) {
  const db = await readDb();
  return db.albums[albumId] ?? null;
}

export async function getAlbumsByOwner(ownerId: string) {
  const db = await readDb();
  return Object.values(db.albums).filter((album) => album.ownerId === ownerId);
}

export async function getSharedAlbumsForUser(userId: string) {
  const db = await readDb();
  return Object.values(db.albums).filter((album) => album.sharedWith.includes(userId));
}

export async function createAlbum(ownerId: string, albumData: Omit<DbAlbum, 'id' | 'createdAt' | 'sharedWith'>) {
  const db = await readDb();
  const id = uuidv4();
  const album: DbAlbum = {
    ...albumData,
    id,
    ownerId,
    sharedWith: [],
    createdAt: Date.now(),
  };
  db.albums[id] = album;
  await writeDb(db);
  return album;
}

export async function shareAlbum(albumId: string, toUserId: string) {
  const db = await readDb();
  const album = db.albums[albumId];
  if (!album) return null;
  if (!db.users[toUserId]) return null;
  album.sharedWith = Array.from(new Set([...album.sharedWith, toUserId]));
  db.albums[albumId] = album;
  await writeDb(db);
  return album;
}

export async function updateAlbum(albumId: string, updates: Partial<Omit<DbAlbum, 'id' | 'ownerId' | 'createdAt'>> ) {
  const db = await readDb();
  const album = db.albums[albumId];
  if (!album) return null;
  db.albums[albumId] = { ...album, ...updates };
  await writeDb(db);
  return db.albums[albumId];
}
