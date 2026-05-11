import { NextRequest, NextResponse } from 'next/server';
import { createUser, getAllUsers, getUserByUsername, getUserByUsernameAndPassword } from '@/backend/db';

export async function GET(request: NextRequest) {
  const username = request.nextUrl.searchParams.get('username');
  const password = request.nextUrl.searchParams.get('password');

  if (username) {
    // Login with password verification
    if (password) {
      const user = await getUserByUsernameAndPassword(username, password);
      if (!user) {
        return NextResponse.json({ error: 'Invalid username or password' }, { status: 401 });
      }
      // Return user without sensitive data
      const { passwordHash, passwordSalt, ...safeUser } = user;
      return NextResponse.json(safeUser);
    }

    // Lookup without password (just checking if user exists)
    const user = await getUserByUsername(username);
    return NextResponse.json(user ?? { message: 'User not found' }, { status: user ? 200 : 404 });
  }

  const users = await getAllUsers();
  // Remove password fields from all users
  const safeUsers = users.map(({ passwordHash, passwordSalt, ...user }) => user);
  return NextResponse.json(safeUsers);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const username = typeof body?.username === 'string' ? body.username.trim() : '';
  const password = typeof body?.password === 'string' ? body.password : '';

  if (!username) {
    return NextResponse.json({ error: 'username is required' }, { status: 400 });
  }

  if (!password || password.length < 6) {
    return NextResponse.json({ error: 'password must be at least 6 characters' }, { status: 400 });
  }

  try {
    const user = await createUser(username, password);
    // Return user without sensitive data
    const { passwordHash, passwordSalt, ...safeUser } = user;
    return NextResponse.json(safeUser, { status: 201 });
  } catch (error: any) {
    if (error.message === 'Username already exists') {
      return NextResponse.json({ error: 'Username already exists' }, { status: 409 });
    }
    throw error;
  }
}
