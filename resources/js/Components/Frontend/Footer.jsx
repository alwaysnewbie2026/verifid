import React from 'react';
import { ShieldCheck, ChevronRight } from 'lucide-react';

export default function Footer() {
  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) element.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#050508] border-t border-white/5 pt-16 pb-8 relative z-10">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-cyan-500 rounded-xl flex items-center justify-center">
                <ShieldCheck className="text-white w-5 h-5" />
              </div>
              <div>
                <span className="font-bold text-xl block">Verif<span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-cyan-400">ID</span></span>
                <span className="text-[9px] text-gray-500 tracking-widest uppercase">Verification System</span>
              </div>
            </div>
            <p className="text-gray-400 max-w-sm leading-relaxed text-sm">Platform verifikasi sertifikat dan keanggotaan kursus terpercaya. Membantu institusi pendidikan mengelola dan memverifikasi data peserta dengan efisien.</p>
          </div>
          <div>
            <h4 className="font-bold text-white mb-6">Navigasi</h4>
            <ul className="space-y-3 text-gray-400 text-sm">
              <li><button onClick={() => scrollToSection('beranda')} className="hover:text-violet-400 transition-colors flex items-center gap-2"><ChevronRight size={14} /> Beranda</button></li>
              <li><button onClick={() => scrollToSection('tentang')} className="hover:text-violet-400 transition-colors flex items-center gap-2"><ChevronRight size={14} /> Tentang</button></li>
              <li><button onClick={() => scrollToSection('kontak')} className="hover:text-violet-400 transition-colors flex items-center gap-2"><ChevronRight size={14} /> Kontak</button></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-white mb-6">Legal</h4>
            <ul className="space-y-3 text-gray-400 text-sm">
              <li><a href="#" className="hover:text-violet-400 transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-violet-400 transition-colors">Terms of Service</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/5 pt-8 text-center text-gray-600 text-xs">
          &copy; 2024 VerifID System. All rights reserved.
        </div>
      </div>
    </footer>
  );
}