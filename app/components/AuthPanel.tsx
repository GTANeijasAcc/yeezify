'use client';

import { useState } from 'react';
import { ArrowRight, Check, LogOut, User, Eye, EyeOff } from 'lucide-react';
import { useStore } from '@/app/store/useStore';
import Link from 'next/link';

export default function AuthPanel() {
  const { currentUser, setCurrentUser, signOut } = useStore();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [mode, setMode] = useState<'signIn' | 'signUp'>('signIn');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAuth = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const cleanedUsername = username.trim();
    const cleanedPassword = password;

    if (!cleanedUsername) {
      setMessage('Please enter a username.');
      return;
    }

    if (!cleanedPassword) {
      setMessage('Please enter a password.');
      return;
    }

    if (mode === 'signUp' && cleanedPassword.length < 6) {
      setMessage('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    setMessage('');
    try {
      if (mode === 'signIn') {
        // Login: send username and password as query params
        const params = new URLSearchParams({
          username: cleanedUsername,
          password: cleanedPassword,
        });
        const response = await fetch(`/api/users?${params}`, {
          method: 'GET',
        });
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error ?? 'Invalid username or password.');
        }
        setCurrentUser(data);
        setMessage('Signed in successfully!');
      } else {
        // Signup: POST with username and password
        const response = await fetch('/api/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username: cleanedUsername, password: cleanedPassword }),
        });
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error ?? 'Unable to create account.');
        }
        setCurrentUser(data);
        setMessage('Account created successfully!');
      }
      setUsername('');
      setPassword('');
    } catch (error: any) {
      setMessage(error?.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  if (currentUser) {
    return (
      <div className="rounded-[36px] border border-white/10 bg-white/5 p-6 shadow-[0_40px_120px_rgba(99,65,255,0.24)] backdrop-blur-xl">
        <div className="flex items-center gap-3 text-sm uppercase tracking-[0.35em] text-ye-gold">
          <User size={18} />
          <span>Account</span>
        </div>
        <div className="mt-6">
          <p className="text-sm text-ye-gold-light">Signed in as</p>
          <h2 className="mt-2 text-3xl font-semibold text-white">{currentUser.username}</h2>
          <p className="mt-3 text-sm leading-6 text-ye-muted">You can now access your albums, upload music, and share collections with your friends.</p>
        </div>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/player"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#7c4dff] via-[#6b35ff] to-[#4f1be5] px-5 py-3 text-sm font-semibold text-white shadow-[0_18px_45px_rgba(124,77,255,0.2)] transition hover:-translate-y-0.5"
          >
            Open app
            <ArrowRight size={16} />
          </Link>
          <button
            type="button"
            onClick={() => signOut()}
            className="inline-flex items-center justify-center gap-2 rounded-full border border-white/10 bg-black/40 px-5 py-3 text-sm font-semibold text-white hover:bg-white/10 transition"
          >
            <LogOut size={16} />
            Sign out
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-[36px] border border-white/10 bg-white/5 p-6 shadow-[0_40px_120px_rgba(99,65,255,0.24)] backdrop-blur-xl">
      <div className="flex items-center gap-3 text-sm uppercase tracking-[0.35em] text-ye-gold">
        <User size={18} />
        <span>{mode === 'signIn' ? 'Sign in' : 'Sign up'}</span>
      </div>
      <p className="mt-4 text-sm text-ye-muted">
        {mode === 'signIn'
          ? 'Sign in with your username and password.'
          : 'Create an account with a username and password.'
        }
      </p>

      <div className="mt-6 flex gap-2 rounded-full bg-[#12092f]/80 p-1">
        {(['signIn', 'signUp'] as const).map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => { setMode(option); setMessage(''); }}
            className={`flex-1 rounded-full px-4 py-2 text-sm font-semibold transition ${mode === option ? 'bg-white text-black' : 'text-ye-muted hover:text-white'}`}
          >
            {option === 'signIn' ? 'Sign In' : 'Sign Up'}
          </button>
        ))}
      </div>

      <form onSubmit={handleAuth} className="mt-6 space-y-4">
        <label className="block text-sm font-medium text-white">
          Username
          <input
            type="text"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            className="mt-2 w-full rounded-3xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none transition focus:border-ye-purple"
            placeholder="your name"
            autoComplete="username"
          />
        </label>

        <label className="block text-sm font-medium text-white">
          Password
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="mt-2 w-full rounded-3xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none transition focus:border-ye-purple pr-12"
              placeholder={mode === 'signUp' ? 'min. 6 characters' : 'your password'}
              autoComplete={mode === 'signUp' ? 'new-password' : 'current-password'}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-ye-muted hover:text-white transition"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </label>

        {message && (
          <p className={`text-sm ${message.includes('success') ? 'text-green-400' : 'text-ye-gold-light'}`}>
            {message}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-full bg-gradient-to-r from-[#7c4dff] via-[#6b35ff] to-[#4f1be5] px-5 py-3 text-sm font-semibold text-white shadow-[0_18px_45px_rgba(124,77,255,0.2)] transition disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? 'Working …' : mode === 'signIn' ? 'Sign in' : 'Create account'}
        </button>
      </form>
    </div>
  );
}
