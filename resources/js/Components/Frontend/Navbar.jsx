import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Menu, X } from 'lucide-react';

export default function Navbar({ onOpenAdmin }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('beranda');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
      const sections = ['beranda', 'tentang', 'kontak'];
      const current = sections.find(section => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          return rect.top >= -200 && rect.top <= 400;
        }
        return false;
      });
      if (current) setActiveSection(current);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setMobileMenuOpen(false);
    }
  };

  return (
    <nav className={`fixed w-full z-50 transition-all duration-500 ${isScrolled ? 'bg-[#0a0a0f]/90 backdrop-blur-xl border-b border-white/5 py-4' : 'bg-transparent py-6'}`}>
      <div className="container mx-auto px-6 flex justify-between items-center">
        <motion.div className="flex items-center gap-3 cursor-pointer" onClick={() => scrollToSection('beranda')} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-violet-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg shadow-violet-500/30">
            <ShieldCheck className="text-white w-5 h-5 md:w-6 md:h-6" />
          </div>
          <div className="hidden md:block">
            <span className="font-bold text-xl tracking-tight block">Verif<span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-cyan-400">ID</span></span>
            <span className="text-[9px] text-gray-400 tracking-widest uppercase">Verification System</span>
          </div>
        </motion.div>

        <div className="hidden md:flex items-center gap-8">
          {['beranda', 'tentang', 'kontak'].map((id) => (
            <motion.button key={id} onClick={() => scrollToSection(id)} className={`text-sm font-medium transition-colors relative group capitalize ${activeSection === id ? 'text-white' : 'text-gray-400 hover:text-white'}`} whileHover={{ y: -2 }}>
              {id}
              <motion.span className="absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-violet-500 to-cyan-500" initial={{ width: 0 }} animate={{ width: activeSection === id ? '100%' : 0 }} transition={{ duration: 0.3 }} />
            </motion.button>
          ))}
          <motion.button onClick={onOpenAdmin} className="px-5 py-2.5 bg-gradient-to-r from-violet-600 to-cyan-600 rounded-full font-semibold text-sm hover:shadow-lg hover:shadow-violet-500/30 transition-all border border-white/10" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            Admin Portal
          </motion.button>
        </div>

        <motion.button className="md:hidden text-white p-2 z-50 relative" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} whileTap={{ scale: 0.9 }}>
          <AnimatePresence mode="wait" initial={false}>
            {mobileMenuOpen ? <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}><X size={24} /></motion.div> : <motion.div key="menu" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}><Menu size={24} /></motion.div>}
          </AnimatePresence>
        </motion.button>
      </div>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="md:hidden absolute top-full left-0 w-full bg-[#0a0a0f]/95 backdrop-blur-xl border-b border-white/10 overflow-hidden shadow-2xl">
            <div className="flex flex-col p-6 gap-4">
              {['beranda', 'tentang', 'kontak'].map((id) => (
                <motion.button key={id} onClick={() => scrollToSection(id)} className="text-left text-lg font-medium text-gray-300 hover:text-white py-2 border-b border-white/5 capitalize" whileTap={{ scale: 0.98 }}>{id}</motion.button>
              ))}
              <motion.button onClick={() => { onOpenAdmin(); setMobileMenuOpen(false); }} className="mt-4 w-full py-3 bg-gradient-to-r from-violet-600 to-cyan-600 rounded-xl font-bold text-white shadow-lg" whileTap={{ scale: 0.98 }}>Login Admin</motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}