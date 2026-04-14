'use client';

import { Facebook, Linkedin, Youtube } from 'lucide-react';

export function Footer({ setView }: { setView?: (v: string) => void }) {
  const handleNav = (v: string) => {
    if (setView) {
      setView(v);
    }
  };

  return (
    <footer className="footer-bg border-t border-white/5 py-24 bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">
          <div>
            <h4 className="text-white font-black uppercase tracking-widest text-xs mb-8">Company</h4>
            <ul className="space-y-4 text-sm font-medium text-white/40">
              <li><button onClick={() => handleNav('home')} className="hover:text-yellow-400 transition-colors">Home</button></li>
              <li><button onClick={() => handleNav('how-it-works')} className="hover:text-yellow-400 transition-colors">How It Works</button></li>
              <li><button onClick={() => handleNav('workflow')} className="hover:text-yellow-400 transition-colors">Workflow</button></li>
              <li><button onClick={() => handleNav('partnerships')} className="hover:text-yellow-400 transition-colors">Partnerships</button></li>
              <li><a href="#" className="hover:text-yellow-400 transition-colors">Careers</a></li>
              <li><button onClick={() => handleNav('contact')} className="hover:text-yellow-400 transition-colors">Contact</button></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-black uppercase tracking-widest text-xs mb-8">Services</h4>
            <ul className="space-y-4 text-sm font-medium text-white/40">
              <li><button onClick={() => handleNav('find-a-load')} className="hover:text-yellow-400 transition-colors">Find a Load (Haulers)</button></li>
              <li><button onClick={() => handleNav('post-a-load')} className="hover:text-yellow-400 transition-colors">Post a Load (Shippers)</button></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-black uppercase tracking-widest text-xs mb-8">Your Account</h4>
            <ul className="space-y-4 text-sm font-medium text-white/40">
              <li><button onClick={() => handleNav('signup')} className="hover:text-yellow-400 transition-colors">Sign Up</button></li>
              <li><button onClick={() => handleNav('login')} className="hover:text-yellow-400 transition-colors">Log In</button></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-black uppercase tracking-widest text-xs mb-8">Socials</h4>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 bg-neutral-900 rounded-xl flex items-center justify-center text-white/40 hover:text-yellow-400 hover:bg-neutral-800 transition-all"><Facebook className="w-5 h-5" /></a>
              <a href="#" className="w-10 h-10 bg-neutral-900 rounded-xl flex items-center justify-center text-white/40 hover:text-yellow-400 hover:bg-neutral-800 transition-all"><Linkedin className="w-5 h-5" /></a>
              <a href="#" className="w-10 h-10 bg-neutral-900 rounded-xl flex items-center justify-center text-white/40 hover:text-yellow-400 hover:bg-neutral-800 transition-all"><Youtube className="w-5 h-5" /></a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
