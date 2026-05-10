import Link from 'next/link';
import { ArrowRight, Disc, Sparkles } from 'lucide-react';
import { appConfig } from '@/app/lib/appConfig';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(108,46,255,0.18),_transparent_24%),radial-gradient(circle_at_bottom_right,_rgba(99,102,241,0.16),_transparent_20%),linear-gradient(180deg,#050105,#0d0218)] text-white">
      <div className="mx-auto grid min-h-screen max-w-6xl gap-10 px-6 py-10 lg:grid-cols-[1.4fr,1fr] lg:items-center">
        <section className="rounded-[36px] border border-white/10 bg-white/5 p-8 shadow-[0_40px_120px_rgba(99,65,255,0.24)] backdrop-blur-xl">
          <div className="flex flex-wrap items-center gap-3 text-sm uppercase tracking-[0.35em] text-ye-gold">
            <Sparkles size={18} />
            <span>New music vault</span>
          </div>

          <div className="mt-8 space-y-6">
            <div>
              <p className="text-sm uppercase tracking-[0.35em] text-ye-gold-light">Yeezify</p>
              <h1 className="mt-4 text-5xl font-semibold tracking-tight text-white sm:text-6xl">
                Store music. Share albums. Discover together.
              </h1>
            </div>

            <p className="max-w-2xl text-base leading-8 text-ye-muted">
              Launch the app to manage your playlists, create user accounts, upload album collections, and share selected albums with friends via a simple backend API.
            </p>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <Link
                href="/player"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#7c4dff] via-[#6b35ff] to-[#4f1be5] px-6 py-3 text-sm font-semibold text-white shadow-[0_18px_45px_rgba(124,77,255,0.2)] transition hover:-translate-y-0.5 hover:shadow-[0_22px_55px_rgba(124,77,255,0.28)]"
              >
                Open the app
                <ArrowRight size={18} />
              </Link>
              <div className="rounded-3xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-ye-text">
                Version <span className="font-semibold text-white">{appConfig.version}</span>
              </div>
            </div>
          </div>
        </section>

        <section className="relative isolate overflow-hidden rounded-[36px] border border-white/10 bg-[#12092f]/80 p-6 shadow-[0_40px_120px_rgba(58,22,123,0.24)]">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(124,77,255,0.35),_transparent_35%)]" />
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,_rgba(79,27,229,0.28),_transparent_40%)]" />
          <div className="relative flex flex-col items-center justify-center gap-6">
            <div className="relative flex h-72 w-72 items-center justify-center rounded-full bg-gradient-to-br from-[#7c4dff] via-[#682bfd] to-[#2c0a68] shadow-[0_0_120px_rgba(124,77,255,0.28)]">
              <div className="absolute inset-8 rounded-full bg-[#3a1f82]/40 blur-2xl" />
              <div className="absolute inset-14 rounded-full bg-[#1c0b3c]/95" />
              <div className="absolute left-1/2 top-1/2 h-20 w-20 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#e4d2ff]/30 bg-white/10" />
              <Disc size={48} className="relative text-[#f7f0ff] opacity-80" />
            </div>
            <div className="text-center">
              <p className="text-sm uppercase tracking-[0.35em] text-ye-gold-light">Behind the scenes</p>
              <h2 className="mt-4 text-3xl font-semibold text-white sm:text-4xl">Your music library meets shared album control.</h2>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
