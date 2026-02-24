import React, { useState } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import Navbar from '@/Components/Frontend/Navbar';
import Footer from '@/Components/Frontend/Footer';
import AdminModal from '@/Components/Frontend/AdminModal';

export default function FrontendLayout({ children }) {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white font-sans overflow-x-hidden selection:bg-violet-500/30">
      <motion.div className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-violet-500 via-cyan-500 to-emerald-500 z-[100]" style={{ scaleX }} />

      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <motion.div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-violet-600/20 rounded-full blur-3xl will-change-transform" animate={{ scale: [1, 1.1, 1], opacity: [0.4, 0.6, 0.4] }} transition={{ duration: 10, repeat: Infinity, ease: "linear" }} />
        <motion.div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-cyan-600/20 rounded-full blur-3xl will-change-transform" animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.6, 0.4] }} transition={{ duration: 12, repeat: Infinity, ease: "linear", delay: 1 }} />
        <motion.div className="absolute top-[30%] left-[40%] w-[300px] h-[300px] bg-emerald-600/15 rounded-full blur-3xl will-change-transform" animate={{ scale: [1, 1.05, 1], opacity: [0.2, 0.4, 0.2] }} transition={{ duration: 8, repeat: Infinity, ease: "linear", delay: 2 }} />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px]" />
      </div>

      <Navbar onOpenAdmin={() => setIsAdminOpen(true)} />
      
      <main className="relative z-10">
        {children}
      </main>

      <Footer />
      <AdminModal isOpen={isAdminOpen} onClose={() => setIsAdminOpen(false)} />
    </div>
  );
}