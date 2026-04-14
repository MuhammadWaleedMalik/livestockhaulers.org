'use client';

import { useState } from 'react';
import { ChevronDown, Handshake, BarChart3, Briefcase, Facebook, Linkedin, Youtube, ExternalLink, MousePointer2, MapPin, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';

export function Header({ setView, view }: { setView?: (v: string) => void, view?: string }) {
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const { data: session } = useSession();

  const handleNav = (v: string) => {
    if (setView) {
      setView(v);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-[100] bg-black/80 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link
            href="/"
            onClick={() => handleNav('home')}
            className="flex items-center gap-3 bg-transparent border-none p-0 cursor-pointer"
          >
            <div className="w-10 h-10 bg-yellow-400 rotate-45 flex items-center justify-center overflow-hidden">
              <div className="-rotate-45 font-black text-black text-sm">LH</div>
            </div>
            <div className="text-xl font-bold tracking-tight text-left">
              <span className="text-white">Livestock Haulers </span>
              <span className="text-yellow-400">Hub</span>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-8">
            <Link
              href="/"
              onClick={() => handleNav('home')}
              className={`text-sm font-medium transition-colors ${view === 'home' ? 'text-yellow-400' : 'text-white/70 hover:text-yellow-400'}`}
            >
              Home
            </Link>
            <button
              onClick={() => handleNav('how-it-works')}
              className={`text-sm font-medium transition-colors ${view === 'how-it-works' ? 'text-yellow-400' : 'text-white/70 hover:text-yellow-400'}`}
            >
              How It Works
            </button>
            <button onClick={() => handleNav('post-a-load')} className={`text-sm font-medium transition-colors ${view === 'post-a-load' ? 'text-yellow-400' : 'text-white/70 hover:text-yellow-400'}`}>Post A Load (Breeders)</button>
            <button onClick={() => handleNav('find-a-load')} className={`text-sm font-medium transition-colors ${view === 'find-a-load' ? 'text-yellow-400' : 'text-white/70 hover:text-yellow-400'}`}>Loadboard (Haulers)</button>

            {/* More Dropdown */}
            <div
              className="relative group py-2"
              onMouseEnter={() => setIsMoreOpen(true)}
              onMouseLeave={() => setIsMoreOpen(false)}
            >
              <button
                className={`text-sm font-medium transition-colors flex items-center gap-1 ${['partnerships', 'contact'].includes(view || '') ? 'text-yellow-400' : 'text-white/70 hover:text-yellow-400'}`}
              >
                More <ChevronDown className={`w-4 h-4 transition-transform ${isMoreOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown Menu */}
              <div className={`absolute top-full right-0 mt-1 w-56 bg-white rounded-xl shadow-2xl overflow-hidden transition-all duration-200 origin-top-right z-[110] ${isMoreOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}>
                <div className="p-2 flex flex-col">
                  <button
                    onClick={() => { handleNav('contact'); setIsMoreOpen(false); }}
                    className="px-4 py-3 text-left text-sm font-semibold text-gray-700 hover:bg-neutral-100 rounded-lg transition-colors flex items-center justify-between"
                  >
                    Contact Us
                  </button>
                  <button
                    onClick={() => { handleNav('how-it-works'); setIsMoreOpen(false); }}
                    className="px-4 py-3 text-left text-sm font-semibold text-gray-700 hover:bg-neutral-100 rounded-lg transition-colors flex items-center justify-between"
                  >
                    How It Works / About Us
                  </button>
                  <button
                    onClick={() => { handleNav('workflow'); setIsMoreOpen(false); }}
                    className="px-4 py-3 text-left text-sm font-semibold text-gray-700 hover:bg-neutral-100 rounded-lg transition-colors flex items-center justify-between"
                  >
                    Workflow
                  </button>
                  <button
                    onClick={() => { handleNav('partnerships'); setIsMoreOpen(false); }}
                    className="px-4 py-3 text-left text-sm font-semibold text-gray-700 hover:bg-neutral-100 rounded-lg transition-colors flex items-center justify-between"
                  >
                    Partnerships
                  </button>
                </div>
              </div>
            </div>

            {session ? (
              <>
                <Link
                  href={`/dashboard/${session.user.role.toLowerCase()}`}
                  className="text-sm font-medium text-yellow-400 hover:text-yellow-500 transition-colors"
                >
                  Dashboard
                </Link>
                <button
                  onClick={() => signOut()}
                  className="text-sm font-medium text-white/70 hover:text-yellow-400 transition-colors"
                >
                  Log Out
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => handleNav('signup')}
                  className={`text-sm font-medium transition-colors ${view === 'signup' ? 'text-yellow-400' : 'text-white/70 hover:text-yellow-400'}`}
                >
                  Sign Up
                </button>
                <button
                  onClick={() => handleNav('login')}
                  className={`text-sm font-medium transition-colors flex items-center gap-1 ${view === 'login' ? 'text-yellow-400' : 'text-white/70 hover:text-yellow-400'}`}
                >
                  Log In/Sign Up
                </button>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
